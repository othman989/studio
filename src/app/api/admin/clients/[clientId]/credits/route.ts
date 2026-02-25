// src/app/api/admin/clients/[clientId]/credits/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Verify Firebase ID token and ensure the user is an admin (admins/{uid} exists).
 */
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
    console.error("Failed to verify admin ID token (credits):", err);
    return null;
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await context.params;

  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const delta = Number(body.delta);

    if (!Number.isFinite(delta) || delta === 0) {
      return NextResponse.json(
        { error: "Invalid delta; must be a non-zero number." },
        { status: 400 }
      );
    }

    const clientRef = adminDb.collection("clients").doc(clientId);
    const clientSnap = await clientRef.get();

    if (!clientSnap.exists) {
      return NextResponse.json(
        { error: `Client ${clientId} not found.` },
        { status: 404 }
      );
    }

    await clientRef.update({
      credits: FieldValue.increment(delta),
    });

    const updatedSnap = await clientRef.get();
    const updatedData = updatedSnap.data() || {};
    const newCredits = updatedData.credits ?? 0;

    return NextResponse.json({ credits: newCredits });
  } catch (err) {
    console.error(`Failed to update credits for client ${clientId}:`, err);
    return NextResponse.json(
      { error: "Internal error while updating credits." },
      { status: 500 }
    );
  }
}
