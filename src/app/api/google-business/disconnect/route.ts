// src/app/api/google-business/disconnect/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

async function getAuthenticatedUser(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid as string;
  } catch (err) {
    console.error("Failed to verify ID token in /api/google-business/disconnect:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const uid = await getAuthenticatedUser(req);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientRef = adminDb.collection("clients").doc(uid);

  try {
    await clientRef.update({
      googleRefreshToken: FieldValue.delete(),
      googleAccessToken: FieldValue.delete(),
      googleScopes: FieldValue.delete(),
      googleConnectionStatus: "disconnected",
      googleLastSyncSuccess: false,
      googleLastSyncError: "Disconnected by client",
      googleDisconnectedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to disconnect Google Business for client:", uid, err);
    return NextResponse.json(
      { error: "Failed to disconnect Google Business" },
      { status: 500 }
    );
  }
}
