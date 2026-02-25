// src/app/api/google/security-events/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";

/**
 * Google RISC config doc (issuer + jwks_uri)
 */
const RISC_CONFIG_URL = "https://accounts.google.com/.well-known/risc-configuration";

// Event URIs (declare BEFORE use to avoid TS2448/TS2454)
const TOKENS_REVOKED =
  "https://schemas.openid.net/secevent/oauth/event-type/tokens-revoked";
const SESSIONS_REVOKED =
  "https://schemas.openid.net/secevent/risc/event-type/sessions-revoked";

// Cache the JWKS resolver across invocations
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

async function getRiscConfig(): Promise<{ issuer: string; jwks_uri: string }> {
  const res = await fetch(RISC_CONFIG_URL, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to fetch RISC config: ${res.status}`);
  const json = await res.json();
  if (!json.issuer || !json.jwks_uri) throw new Error("Invalid RISC config");
  return { issuer: json.issuer, jwks_uri: json.jwks_uri };
}

async function verifySecurityEventToken(setJwt: string): Promise<JWTPayload> {
  const { issuer, jwks_uri } = await getRiscConfig();

  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(jwks_uri));
  }

  const { payload } = await jwtVerify(setJwt, jwks, {
    issuer,
    // OPTIONAL (recommended if you have it):
    // audience: process.env.GOOGLE_RISC_AUDIENCE,
  });

  return payload;
}

function extractEventUris(payload: any): string[] {
  const events = payload?.events;
  if (!events || typeof events !== "object") return [];
  return Object.keys(events);
}

async function disconnectClientGoogle(uid: string, reason: string) {
  const clientRef = adminDb.collection("clients").doc(uid);

  await clientRef.set(
    {
      googleRefreshToken: null,
      googleAccessToken: null,
      googleScopes: null,
      googleConnectionStatus: "disconnected",
      googleDisconnectedAt: new Date(),
      googleDisconnectReason: reason,
      googleLastSyncSuccess: false,
      googleLastSyncError: reason,
    },
    { merge: true }
  );

  // Optional: revoke Firebase sessions to force re-auth
  try {
    await adminAuth.revokeRefreshTokens(uid);
  } catch (e) {
    console.error("Failed to revoke Firebase refresh tokens:", e);
  }
}

/**
 * Find ALL client uids matching a Google subject.
 * Requires you to store googleUserSub on the client doc during GBP connect.
 */
async function findClientUidsByGoogleSub(googleSub: string): Promise<string[]> {
  const snap = await adminDb
    .collection("clients")
    .where("googleUserSub", "==", googleSub)
    .get();

  return snap.docs.map((d) => d.id);
}

async function handleRiscEvent(payload: any) {
  const googleSub = payload?.sub ? String(payload.sub) : null;
  const eventUris = extractEventUris(payload);

  if (!googleSub) {
    console.warn("RISC event missing sub; cannot map to client.", { eventUris });
    return;
  }

  const uids = await findClientUidsByGoogleSub(googleSub);
  if (uids.length === 0) {
    console.warn("No client found for google sub", googleSub, { eventUris });
    return;
  }

  if (eventUris.includes(TOKENS_REVOKED)) {
    await Promise.all(uids.map((u) => disconnectClientGoogle(u, "risc:tokens-revoked")));
    return;
  }

  if (eventUris.includes(SESSIONS_REVOKED)) {
    await Promise.all(uids.map((u) => disconnectClientGoogle(u, "risc:sessions-revoked")));
    return;
  }

  console.log("RISC event received (no handler configured):", { eventUris, googleSub });
}

async function readSetFromRequest(req: NextRequest): Promise<string | null> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);
    return body?.security_event_token ? String(body.security_event_token) : null;
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const set = params.get("security_event_token");
    return set ? String(set) : null;
  }

  // fallback: try json then form
  const raw = await req.text();
  try {
    const asJson = JSON.parse(raw);
    if (asJson?.security_event_token) return String(asJson.security_event_token);
  } catch {
    const params = new URLSearchParams(raw);
    const set = params.get("security_event_token");
    return set ? String(set) : null;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const setJwt = await readSetFromRequest(req);
    if (!setJwt) {
      return NextResponse.json(
        { ok: false, error: "missing_security_event_token" },
        { status: 400 }
      );
    }

    const payload = await verifySecurityEventToken(setJwt);
    await handleRiscEvent(payload);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("RISC handler error:", e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
