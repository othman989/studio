
/**
 * @fileOverview This flow handles publishing a review reply to Google Business Profile.
 * It's a callable flow that can be invoked from the client.
 */
export const runtime = "nodejs";

import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';

const PublishReviewInputSchema = z.object({
  clientId: z.string(),
  reviewId: z.string(),
  replyText: z.string(),
});

const PublishReviewOutputSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
});

export type PublishReviewInput = z.infer<typeof PublishReviewInputSchema>;
export type PublishReviewOutput = z.infer<typeof PublishReviewOutputSchema>;

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
    throw new Error('Token refresh failed');
  }

  const tokenJson = await response.json();
  return tokenJson.access_token;
}

export const publishReviewFlow = ai.defineFlow(
  {
    name: 'publishReviewFlow',
    inputSchema: PublishReviewInputSchema,
    outputSchema: PublishReviewOutputSchema,
  },
  async ({ clientId, reviewId, replyText }) => {
    const reviewRef = adminDb.collection('clients').doc(clientId).collection('reviews').doc(reviewId);

    try {
      const accessToken = await getValidAccessToken(clientId);
      const reviewSnap = await reviewRef.get();
      if (!reviewSnap.exists) {
        throw new Error('Review not found');
      }
      const reviewData = reviewSnap.data()!;
      const reviewName = reviewData.reviewName; // e.g., "accounts/{accountId}/locations/{locationId}/reviews/{reviewId}"

      if (!reviewName) {
        throw new Error('Review name (Google ID) is missing.');
      }

      const response = await fetch(
        `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment: replyText,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        await reviewRef.update({
          status: 'post_failed',
          googlePostError: errorText,
        });
        throw new Error(`Google API failed: ${errorText}`);
      }

      await reviewRef.update({
        response: replyText,
        status: 'posted',
        postedToGoogle: true,
        googlePostError: null,
        responseTimestamp: FieldValue.serverTimestamp(),
      });
      
      return { ok: true, message: 'Reply posted successfully.' };

    } catch (error: any) {
      console.error(`Failed to publish reply for review ${reviewId}:`, error);
      await reviewRef.update({
        status: 'post_failed',
        googlePostError: error.message,
      }).catch(console.error);
      
      return { ok: false, message: error.message };
    }
  }
);

export async function publishReview(input: PublishReviewInput): Promise<PublishReviewOutput> {
  return await publishReviewFlow(input);
}
