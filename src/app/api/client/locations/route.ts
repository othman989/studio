// src/app/api/client/locations/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

async function getUidFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const decoded = await adminAuth.verifyIdToken(token);
  return decoded.uid;
}

export async function GET(req: NextRequest) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snap = await adminDb
      .collection("clients")
      .doc(uid)
      .collection("locations")
      .orderBy("name", "asc")
      .get();

    const locations = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ ok: true, locations });
  } catch (err) {
    console.error("GET /api/client/locations failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
