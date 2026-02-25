// src/app/api/client/sync-reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { syncClientGoogleReviewsFlow } from "@/ai/flows/sync-google-reviews";

export const runtime = "nodejs";

async function getUid(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch (err) {
    console.error("POST /api/client/sync-reviews verifyIdToken failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const uid = await getUid(req);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncClientGoogleReviewsFlow(uid);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error(`POST /api/client/sync-reviews failed for uid=${uid}:`, err);
    return NextResponse.json({ error: err?.message || "Sync failed" }, { status: 400 });
  }
}
