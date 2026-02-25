// src/app/api/google-business/auth-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

export const runtime = "nodejs";

async function getUid(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch (e) {
    console.error("auth-url verifyIdToken failed:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const uid = await getUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const APP_URL = process.env.APP_URL || "https://gbreplai.greotech.com";
  const clientId = process.env.GBP_CLIENT_ID; // ✅ server var
  if (!clientId) {
    return NextResponse.json({ error: "GBP_CLIENT_ID missing" }, { status: 500 });
  }

  const redirectUri = `${APP_URL}/api/google-business/callback`;

  const scopes = [
    "https://www.googleapis.com/auth/business.manage",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ].join(" ");

  const state = crypto.randomBytes(32).toString("hex");

  await adminDb.collection("oauth_states").doc(state).set({
    uid,
    createdAt: FieldValue.serverTimestamp(),
    expiresAtMs: Date.now() + 10 * 60 * 1000,
    purpose: "google_business_connect",
  });

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      include_granted_scopes: "true",
      prompt: "consent",
      state,
    }).toString();

  return NextResponse.json({ ok: true, authUrl });
}
