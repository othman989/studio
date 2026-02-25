// src/app/api/reviews/[reviewId]/generate-reply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateAiReply } from "@/ai/flows/generate-ai-reply";
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
    console.error("generate-reply: verifyIdToken failed:", err);
    return null;
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  const uid = await getUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviewId } = await context.params;

  try {
    const clientRef = adminDb.collection("clients").doc(uid);
    const clientSnap = await clientRef.get();
    if (!clientSnap.exists) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const clientData: any = clientSnap.data();
    const credits = Number(clientData?.credits ?? 0);
    if (credits < 1) {
      return NextResponse.json({ error: "Out of credits" }, { status: 402 });
    }

    const reviewRef = clientRef.collection("reviews").doc(reviewId);
    const reviewSnap = await reviewRef.get();
    if (!reviewSnap.exists) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const reviewData: any = reviewSnap.data();
    const reviewText = String(reviewData?.text ?? "").trim();
    const rating = Number(reviewData?.rating ?? 0);

    if (!reviewText) {
      return NextResponse.json({ error: "Review text missing" }, { status: 400 });
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const businessName = String(clientData?.businessName ?? "My Business");
    const authorName = reviewData?.authorName
      ? String(reviewData.authorName)
      : undefined;

    const tone = String(clientData?.responseTone ?? "professional");
    const language = String(clientData?.language ?? "autodetect");
    const template = clientData?.responseTemplate
      ? String(clientData.responseTemplate)
      : undefined;

    const { replyText, sentiment } = await generateAiReply({
      clientId: uid,
      reviewText,
      rating,
      authorName,
      businessName,
      tone,
      language,
      template,
    });

    // Save generated draft + set status pending
    await reviewRef.set(
      {
        response: replyText,
        status: "pending",
        autoReplyError: null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Decrement credits
    await clientRef.set({ credits: FieldValue.increment(-1) }, { merge: true });

    return NextResponse.json({ ok: true, replyText, sentiment });
  } catch (err: any) {
    console.error(
      `generate-reply failed for uid=${uid} reviewId=${reviewId}:`,
      err
    );
    return NextResponse.json(
      { error: err?.message || "Failed to generate reply" },
      { status: 500 }
    );
  }
}
