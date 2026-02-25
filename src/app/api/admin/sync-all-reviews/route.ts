// src/app/api/admin/sync-all-reviews/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { syncClientGoogleReviewsFlow } from "@/ai/flows/sync-google-reviews";

async function getAuthenticatedAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const adminSnap = await adminDb.collection("admins").doc(uid).get();
    if (!adminSnap.exists) {
      return null;
    }

    return { uid };
  } catch (err) {
    console.error("Failed to verify admin ID token (sync-all-reviews):", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const clientsSnap = await adminDb.collection("clients").get();
    const clientIds = clientsSnap.docs.map((d) => d.id);

    let started = 0;

    // Run client syncs sequentially for now (safe at low scale)
    for (const clientId of clientIds) {
      try {
        await syncClientGoogleReviewsFlow(clientId);
        started++;
      } catch (err) {
        console.error(
          `Failed to trigger sync for client ${clientId}:`,
          err
        );
      }
    }

    return NextResponse.json({
      started,
      totalClients: clientIds.length,
    });
  } catch (err) {
    console.error("Failed to run global sync (/api/admin/sync-all-reviews):", err);
    return NextResponse.json(
      { error: "Internal error while starting global sync." },
      { status: 500 }
    );
  }
}
