// src/app/api/reviews/[reviewId]/decline/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
export const runtime = "nodejs";

async function getUid(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch (err) {
    console.error("Decline: verifyIdToken failed:", err);
    return null;
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  const uid = await getUid(req);
  if (!uid) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { reviewId } = await context.params;

  try {
    const reviewRef = adminDb
      .collection("clients")
      .doc(uid)
      .collection("reviews")
      .doc(reviewId);

    const snap = await reviewRef.get();
    if (!snap.exists) {
      return NextResponse.json({ ok: false, error: "REVIEW_NOT_FOUND" }, { status: 404 });
    }

    await reviewRef.set(
      {
        status: "declined",
        response: "",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Decline failed:", err);
    return NextResponse.json({ ok: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
