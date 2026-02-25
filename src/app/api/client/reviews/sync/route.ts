// src/app/api/client/reviews/sync/route.ts
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
    console.error("POST /api/client/reviews/sync verifyIdToken failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const uid = await getUid(req);
  if (!uid) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const result = await syncClientGoogleReviewsFlow(uid);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error("POST /api/client/reviews/sync failed:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "SYNC_FAILED" },
      { status: 400 }
    );
  }
}
