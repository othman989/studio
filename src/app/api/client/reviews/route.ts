// src/app/api/client/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldPath, Timestamp } from "firebase-admin/firestore";

export const runtime = "nodejs";

async function getUidFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch (e) {
    console.error("GET /api/client/reviews verifyIdToken failed:", e);
    return null;
  }
}

function parseCursor(cursor: string | null): { createdAtMs: number; id: string } | null {
  if (!cursor) return null;
  try {
    const json = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    if (typeof json?.createdAtMs !== "number" || typeof json?.id !== "string") return null;
    return { createdAtMs: json.createdAtMs, id: json.id };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);

    const locationId = searchParams.get("locationId") || "all";
    const status = searchParams.get("status") || "all";
    const ratingRaw = searchParams.get("rating") || "all";
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "20"), 1), 50);

    const cursor = parseCursor(searchParams.get("cursor"));

    let q: FirebaseFirestore.Query = adminDb
      .collection("clients")
      .doc(uid)
      .collection("reviews")
      .orderBy("createdAt", "desc")
      .orderBy(FieldPath.documentId(), "desc")
      .limit(limit);

    if (locationId !== "all") q = q.where("locationId", "==", locationId);
    if (status !== "all") q = q.where("status", "==", status);

    if (ratingRaw !== "all") {
      const rating = Number(ratingRaw);
      if (!Number.isFinite(rating)) {
        return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
      }
      q = q.where("rating", "==", rating);
    }

    if (cursor) {
      q = q.startAfter(Timestamp.fromMillis(cursor.createdAtMs), cursor.id);
    }

    const snap = await q.get();
    const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    let nextCursor: string | null = null;
    const last = snap.docs[snap.docs.length - 1];
    if (last) {
      const data: any = last.data();
      const createdAt = data?.createdAt;
      const createdAtMs =
        createdAt && typeof createdAt.toMillis === "function" ? createdAt.toMillis() : null;

      if (typeof createdAtMs === "number") {
        nextCursor = Buffer.from(JSON.stringify({ createdAtMs, id: last.id }), "utf8").toString(
          "base64"
        );
      }
    }

    return NextResponse.json({ ok: true, reviews, nextCursor, pageSize: limit });
  } catch (err: any) {
    const msg = String(err?.message || "");
    console.error("GET /api/client/reviews failed:", err);

    // Firestore missing index
    if (msg.toLowerCase().includes("requires an index")) {
      return NextResponse.json(
        { error: "Firestore index required", details: msg },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
