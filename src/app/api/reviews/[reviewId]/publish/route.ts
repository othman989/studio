// src/app/api/reviews/[reviewId]/publish/route.ts

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
export const runtime = "nodejs";

async function getAuthenticatedUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid as string;
  } catch (err) {
    console.error("Failed to verify ID token in publish route:", err);
    return null;
  }
}

async function getValidAccessToken(clientId: string): Promise<string> {
  const clientRef = adminDb.collection("clients").doc(clientId);
  const clientSnap = await clientRef.get();
  if (!clientSnap.exists) {
    throw new Error(`Client ${clientId} not found`);
  }
  const clientData = clientSnap.data()!;
  const refreshToken = clientData.googleRefreshToken;
  if (!refreshToken) {
    throw new Error(`No refresh token for client ${clientId}`);
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID!,
      client_secret: process.env.GBP_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Token refresh failed:", response.status, text);
    throw new Error("Token refresh failed");
  }

  const tokenJson = await response.json();
  return tokenJson.access_token;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await context.params;

  const uid = await getAuthenticatedUser(req);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const replyText = (body.replyText || "").trim();
  if (!replyText) {
    return NextResponse.json(
      { error: "replyText is required" },
      { status: 400 }
    );
  }

  const clientId = uid;
  const reviewRef = adminDb
    .collection("clients")
    .doc(clientId)
    .collection("reviews")
    .doc(reviewId);

  try {
    const accessToken = await getValidAccessToken(clientId);

    const reviewSnap = await reviewRef.get();
    if (!reviewSnap.exists) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    const reviewData = reviewSnap.data()!;
    const reviewName = reviewData.reviewName;

    if (!reviewName) {
      return NextResponse.json(
        { error: "Review name (Google ID) is missing." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: replyText,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      await reviewRef.update({
        status: "post_failed",
        googlePostError: errorText,
      });
      console.error(
        `Google API failed for review ${reviewId}:`,
        response.status,
        errorText
      );
      return NextResponse.json(
        { ok: false, message: `Google API failed: ${errorText}` },
        { status: 502 }
      );
    }

    await reviewRef.update({
      response: replyText,
      status: "posted",
      postedToGoogle: true,
      googlePostError: null,
      responseTimestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      ok: true,
      message: "Reply posted successfully.",
    });
  } catch (error: any) {
    console.error(
      `Failed to publish reply for review ${reviewId}:`,
      error
    );
    try {
      await reviewRef.update({
        status: "post_failed",
        googlePostError: error.message || "Unknown error",
      });
    } catch (updateErr) {
      console.error(
        "Failed to update review status after publish error:",
        updateErr
      );
    }
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Failed to publish reply.",
      },
      { status: 500 }
    );
  }
}
