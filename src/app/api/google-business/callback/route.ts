// src/app/api/google-business/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { syncClientGoogleReviewsFlow } from "@/ai/flows/sync-google-reviews";

export const runtime = "nodejs";

async function fetchGoogleAccounts(accessToken: string): Promise<any[]> {
  const response = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to fetch accounts:", response.status, text);
    throw new Error(`Failed to fetch accounts: ${response.status}`);
  }
  const data = await response.json();
  return data.accounts || [];
}

async function fetchGoogleLocations(accessToken: string, accountName: string): Promise<any[]> {
  const response = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title,storefrontAddress`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to fetch locations:", response.status, text);
    return [];
  }
  const data = await response.json();
  return data.locations || [];
}

async function fetchGoogleUserInfo(accessToken: string): Promise<{ sub?: string; email?: string }> {
  const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch userinfo:", res.status, text);
    return {};
  }

  const data = await res.json();
  return { sub: data.sub, email: data.email };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const APP_URL = process.env.APP_URL || "https://gbreplai.greotech.com";

  try {
    if (error) {
      console.error("OAuth error:", error);
      return NextResponse.redirect(`${APP_URL}/settings?error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${APP_URL}/settings?error=missing_params`);
    }

    // Validate state from Firestore
    const stateRef = adminDb.collection("oauth_states").doc(state);
    const stateSnap = await stateRef.get();
    if (!stateSnap.exists) {
      return NextResponse.redirect(`${APP_URL}/settings?error=invalid_state`);
    }
    const stateData: any = stateSnap.data();
    const uid = String(stateData?.uid || "");
    const expiresAtMs = Number(stateData?.expiresAtMs || 0);

    if (!uid || !expiresAtMs || Date.now() > expiresAtMs) {
      await stateRef.delete().catch(() => {});
      return NextResponse.redirect(`${APP_URL}/settings?error=state_expired`);
    }

    // One-time use
    await stateRef.delete().catch(() => {});

    const GBP_CLIENT_ID = process.env.GBP_CLIENT_ID;
    const GBP_CLIENT_SECRET = process.env.GBP_CLIENT_SECRET;
    const REDIRECT_URI = `${APP_URL}/api/google-business/callback`;

    if (!GBP_CLIENT_ID || !GBP_CLIENT_SECRET) {
      console.error("Server configuration error: Google client credentials missing.");
      return NextResponse.redirect(`${APP_URL}/settings?error=server_config_error`);
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GBP_CLIENT_ID,
        client_secret: GBP_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("Token exchange failed:", tokenRes.status, text);
      return NextResponse.redirect(`${APP_URL}/settings?error=token_exchange_failed`);
    }

    const tokenJson = await tokenRes.json();
    const refreshToken = tokenJson.refresh_token;
    const accessToken = tokenJson.access_token;
    const scope = tokenJson.scope;

    if (!refreshToken) {
      console.error("No refresh token received", tokenJson);
      return NextResponse.redirect(`${APP_URL}/settings?error=no_refresh_token`);
    }

    const userinfo = await fetchGoogleUserInfo(accessToken);
    const googleUserSub = userinfo.sub || null;
    const googleUserEmail = userinfo.email || null;

    const clientRef = adminDb.collection("clients").doc(uid);
    await clientRef.set(
      {
        googleRefreshToken: refreshToken,
        googleAccessToken: accessToken,
        googleScopes: scope,
        googleUserSub,
        googleUserEmail,
        googleConnectedAt: FieldValue.serverTimestamp(),
        googleConnectionStatus: "connected",
        googleLastSyncAt: FieldValue.serverTimestamp(),
        googleLastSyncError: null,
        googleLastSyncSuccess: true,
      },
      { merge: true }
    );

    // Sync locations
    try {
      const accounts = await fetchGoogleAccounts(accessToken);
      for (const account of accounts) {
        const locations = await fetchGoogleLocations(accessToken, account.name);
        for (const location of locations) {
          const locationId = location.name.split("/").pop();
          if (locationId) {
            await clientRef.collection("locations").doc(locationId).set(
              {
                id: locationId,
                googleLocationName: location.name,
                googleAccountName: account.name,
                name: location.title || "Unnamed location",
                address: location.storefrontAddress || null,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          }
        }
      }
    } catch (syncErr) {
      console.error("Failed to sync locations immediately after OAuth:", syncErr);
    }

    // Sync reviews
    try {
      await syncClientGoogleReviewsFlow(uid);
    } catch (reviewsErr) {
      console.error("Failed to sync reviews immediately after OAuth:", reviewsErr);
    }

    return NextResponse.redirect(`${APP_URL}/settings?connected=google-business`);
  } catch (err: any) {
    console.error("Critical OAuth callback error:", err);
    return NextResponse.redirect(`${APP_URL}/settings?error=internal_server_error`);
  }
}
