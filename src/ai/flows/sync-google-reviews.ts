export const runtime = "nodejs";

import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { generateAiReply } from './generate-ai-reply';
import { sendAdminAlertEmail, sendGoogleDisconnectedEmail } from '@/lib/brevo';
import type { Review } from '@/lib/types';
import { z } from 'zod';
import { publishReview } from "./publish-review";

// Minimum delay between manual syncs (in milliseconds)
const MIN_MANUAL_SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Helper to get a valid access token, refreshing if necessary
async function getValidAccessToken(clientId: string): Promise<string> {
  const clientRef = adminDb.collection('clients').doc(clientId);
  const clientSnap = await clientRef.get();
  if (!clientSnap.exists) {
    throw new Error(`Client ${clientId} not found`);
  }
  const clientData = clientSnap.data()!;
  const refreshToken = clientData.googleRefreshToken;

  if (!refreshToken) {
    throw new Error(`No refresh token for client ${clientId}`);
  }

  // For now we always refresh; later you can check expiry
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID!,
      client_secret: process.env.GBP_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to refresh access token:', response.status, errorText);
    throw new Error(`Token refresh failed with status ${response.status}`);
  }

  const tokenJson = await response.json();
  const newAccessToken = tokenJson.access_token;

  await clientRef.update({
    googleAccessToken: newAccessToken,
    googleAccessTokenExpiresAt: FieldValue.serverTimestamp(),
  });

  return newAccessToken;
}

// Helper to update client's connection status
async function updateGoogleConnectionStatus(
  clientId: string,
  status: 'connected' | 'disconnected' | 'error',
  error: string | null = null
) {
  await adminDb.collection('clients').doc(clientId).update({
    googleConnectionStatus: status,
    googleLastSyncError: error,
    googleLastSyncAt: FieldValue.serverTimestamp(),
    googleLastSyncSuccess: status === 'connected',
  });
}

// Helper function to calculate and update client stats
export async function updateClientStats(clientId: string) {
  const reviewsRef = adminDb.collection('clients').doc(clientId).collection('reviews');
  const reviewsSnap = await reviewsRef.get();
  const reviews = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];

  if (reviews.length === 0) {
    await adminDb.collection('clients').doc(clientId).update({
      stats: {
        totalReviews: 0,
        pendingReviews: 0,
        postedReviews: 0,
        averageRating: 0,
        approvalRate: 0,
        autoRepliesThisMonth: 0,
        manualRepliesThisMonth: 0,
        lowRatingDraftsThisMonth: 0,
        updatedAt: FieldValue.serverTimestamp(),
      },
    });
    return;
  }

  let totalReviews = reviews.length;
  let pendingReviews = 0;
  let postedReviews = 0;
  let totalRating = 0;
  let autoRepliesThisMonth = 0;
  let manualRepliesThisMonth = 0;
  let lowRatingDraftsThisMonth = 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  reviews.forEach(review => {
    totalRating += review.rating;
    if (review.status === 'pending') pendingReviews++;
    if (review.status === 'posted') postedReviews++;

    const responseTs = review.responseTimestamp?.toDate ? review.responseTimestamp.toDate() : null;
    if (responseTs && responseTs >= startOfMonth) {
      if (review.autoReplied) {
        autoRepliesThisMonth++;
        if (review.rating <= 3 && review.status === 'pending') {
          lowRatingDraftsThisMonth++;
        }
      } else {
        manualRepliesThisMonth++;
      }
    }
  });

  const averageRating = totalRating / totalReviews;
  const aiRespondedReviews = reviews.filter(
    r => r.response && (r.status === 'posted' || r.status === 'pending')
  ).length;
  const approvalRate = aiRespondedReviews > 0 ? (postedReviews / aiRespondedReviews) * 100 : 0;

  const stats = {
    totalReviews,
    pendingReviews,
    postedReviews,
    averageRating: parseFloat(averageRating.toFixed(2)),
    approvalRate: parseFloat(approvalRate.toFixed(2)),
    autoRepliesThisMonth,
    manualRepliesThisMonth,
    lowRatingDraftsThisMonth,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await adminDb.collection('clients').doc(clientId).update({ stats });
  console.log(`Updated stats for client ${clientId}`);
}

// Genkit flow to update stats for a single client on-demand
export const updateClientStatsFlow = ai.defineFlow(
  {
    name: 'updateClientStatsFlow',
    inputSchema: z.string(), // Expects client ID as a string
  },
  async (clientId) => {
    console.log(`On-demand stats update requested for client: ${clientId}`);
    await updateClientStats(clientId);
    return `Stats updated for client ${clientId}.`;
  }
);

/**
 * INTERNAL HELPER:
 * Sync reviews for a single client.
 * Used by both the per-client flow and the all-clients flow.
 */
async function syncClientReviews(clientId: string): Promise<void> {
  const clientRef = adminDb.collection('clients').doc(clientId);
  const clientSnap = await clientRef.get();

  if (!clientSnap.exists) {
    console.log(`Client ${clientId} not found, skipping sync.`);
    return;
  }

  const clientData = clientSnap.data()!;
  let newReviewsFound = false;

  if (!clientData.googleRefreshToken) {
    console.log(`Skipping client ${clientId} due to missing refresh token.`);
    await updateGoogleConnectionStatus(clientId, 'disconnected', 'Missing Google Refresh Token');
    return;
  }

  try {
    console.log(`Syncing for client: ${clientData.businessName} (${clientId})`);
    const accessToken = await getValidAccessToken(clientId);
    await updateGoogleConnectionStatus(clientId, 'connected');

    // Fetch locations for this client
    const locationsSnap = await clientRef.collection('locations').get();

    if (locationsSnap.empty) {
      console.log(`No locations found for client ${clientId}.`);
      return;
    }

    for (const locationDoc of locationsSnap.docs) {
      const locationData = locationDoc.data();
      const googleLocationName = locationData.googleLocationName;

      if (!googleLocationName) continue;

      const reviewsResponse = await fetch(
        `https://mybusiness.googleapis.com/v4/${googleLocationName}/reviews`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!reviewsResponse.ok) {
        console.error(`Failed to fetch reviews for location ${googleLocationName}`);
        continue;
      }

      const reviewsData = await reviewsResponse.json();
      const reviews = reviewsData.reviews || [];

      for (const review of reviews) {
        const reviewId = review.reviewId;
        const reviewRef = clientRef.collection('reviews').doc(reviewId);
        const reviewSnap = await reviewRef.get();

        if (reviewSnap.exists) {
          // Existing review: update core fields (idempotent)
          await reviewRef.update(
            {
              text: review.comment || '',
              rating: review.starRating,
              updateTime: review.updateTime,
            },
            { merge: true } as any
          );
        } else {
          newReviewsFound = true;

          const newReview: Review = {
            id: reviewId,
            clientId: clientId,
            googleReviewId: review.reviewId,
            reviewName: review.name,
            authorName: review.reviewer?.displayName || 'Anonymous',
            authorPhotoUrl: review.reviewer?.profilePhotoUrl,
            text: review.comment || '',
            rating: review.starRating,
            locationId: locationDoc.id,
            locationName: locationData.name,
            status: 'new',
            createdAt: FieldValue.serverTimestamp(),
            createTime: review.createTime,
            updateTime: review.updateTime,
            source: 'google_sync',
          };

          await reviewRef.set(newReview);

          const hasCredits = (clientData.credits || 0) > 0;
          const autoHandleReviews = clientData.autoHandleReviews ?? true;
          const requireApprovalForAll = clientData.approveAllReplies ?? false;
          const isPositive = newReview.rating >= 4;

          if (!autoHandleReviews) {
            // User does not want any automatic handling during sync.
            await reviewRef.update({ status: 'unreplied' });
          } else if (!hasCredits) {
            // No credits -> cannot generate anything automatically.
            await reviewRef.update({ status: 'unreplied' });
          } else {
            // autoHandleReviews === true AND hasCredits === true
            const shouldAutoPost = isPositive && !requireApprovalForAll;

            if (shouldAutoPost) {
              // Auto-post for 4–5★ when approval is not required
              try {
                const aiResponse = await generateAiReply({
                  clientId,
                  reviewText: newReview.text || '',
                  rating: newReview.rating,
                  authorName: newReview.authorName,
                  businessName: clientData.businessName,
                  tone: clientData.responseTone,
                  language: clientData.language || 'autodetect',
                  template: clientData.responseTemplate || '',
                });

                await publishReview({
                  clientId,
                  reviewId,
                  replyText: aiResponse.replyText,
                });

                await clientRef.update({
                  credits: FieldValue.increment(-1),
                });

              } catch (aiError) {
                console.error(`AI auto-reply failed for review ${reviewId}:`, aiError);
              }
            } else {
              // Draft-only mode: either low rating OR requireApprovalForAll === true
              try {
                const aiResponse = await generateAiReply({
                  clientId,
                  reviewText: newReview.text || '',
                  rating: newReview.rating,
                  authorName: newReview.authorName,
                  businessName: clientData.businessName,
                  tone: clientData.responseTone,
                  language: clientData.language || 'autodetect',
                  template: clientData.responseTemplate || '',
                });

                await reviewRef.update({
                  response: aiResponse.replyText,
                  status: 'pending',
                  autoReplied: false,
                  responseTimestamp: FieldValue.serverTimestamp(),
                });

                await clientRef.update({
                  credits: FieldValue.increment(-1),
                });
              } catch (aiError) {
                console.error(`AI draft generation failed for review ${reviewId}:`, aiError);
              }
            }
          }
        }
      }
    }

    if (newReviewsFound) {
      await updateClientStats(clientId);
    }

    console.log(`Successfully synced reviews for client ${clientId}`);
  } catch (err: any) {
    console.error(`Sync failed for client ${clientId}:`, err.message);

    if (
      err.message.includes('401') ||
      err.message.includes('invalid_grant') ||
      err.message.includes('Token refresh failed')
    ) {
      await updateGoogleConnectionStatus(clientId, 'disconnected', err.message);

      if (clientData.email) {
        await sendGoogleDisconnectedEmail(clientData.email, clientData.businessName);
      }
      await sendAdminAlertEmail(
        `Client disconnected: ${clientData.businessName}`,
        `<p>Client ${clientData.businessName} (${clientData.email}) was disconnected during review sync.</p><p>Error: ${err.message}</p>`
      );
    } else {
      await updateGoogleConnectionStatus(clientId, 'error', err.message);
    }
  }
}

/**
 * FLOW 1: Per-client sync (for dashboard button).
 */
export const syncClientGoogleReviewsFlow = ai.defineFlow(
  {
    name: 'syncClientGoogleReviewsFlow',
    inputSchema: z.string(), // clientId
  },
  async (clientId: string) => {
    console.log(`Starting Google reviews sync for single client: ${clientId}`);

    // Basic server-side rate limiting for manual syncs
    const clientRef = adminDb.collection('clients').doc(clientId);
    const clientSnap = await clientRef.get();

    if (!clientSnap.exists) {
      throw new Error(`Client ${clientId} not found.`);
    }

    const clientData = clientSnap.data()!;
    const lastSyncTs = clientData.googleLastSyncAt;

    if (lastSyncTs && typeof lastSyncTs.toDate === 'function') {
      const lastSyncDate = lastSyncTs.toDate() as Date;
      const elapsedMs = Date.now() - lastSyncDate.getTime();

      if (elapsedMs < MIN_MANUAL_SYNC_INTERVAL_MS) {
        const remainingMs = MIN_MANUAL_SYNC_INTERVAL_MS - elapsedMs;
        const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

        throw new Error(
          `You recently synced reviews. Please wait about ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} before syncing again.`
        );
      }
    }

    await syncClientReviews(clientId);
    return `Review sync completed for client ${clientId}.`;
  }
);


/**
 * FLOW 2: All-clients sync (for cron/worker only).
 */
export const syncAllClientsReviewsFlow = ai.defineFlow(
  {
    name: 'syncAllClientsReviewsFlow',
  },
  async () => {
    console.log('Starting Google reviews sync for all clients...');

    const clientsSnap = await adminDb.collection('clients').get();
    if (clientsSnap.empty) {
      console.log('No clients found to sync.');
      return 'No clients to sync.';
    }

    const syncPromises = clientsSnap.docs.map((clientDoc) =>
      syncClientReviews(clientDoc.id)
    );

    await Promise.all(syncPromises);

    return 'Review sync completed for all clients.';
  }
);

// Backwards-compatible alias if anything still imports this
export const syncGoogleReviewsFlow = syncAllClientsReviewsFlow;
