// src/app/api/admin/clients/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

interface ClientSummary {
  id: string;
  businessName?: string;
  email?: string;
  credits?: number;
  stats?: {
    totalReviews?: number;
    pendingReviews?: number;
    approvalRate?: number;
  };
  plan?: "free" | "starter" | "pro" | "enterprise";
  subscriptionStatus?: "active" | "canceled" | "past_due" | "trialing";
  subscriptionEndAt?: any;
  createdAt?: any;
  lastPlanChangeAt?: any;

  // Connection‑monitor fields
  googleConnectionStatus: "connected" | "disconnected" | "error" | null;
  googleLastSyncAt: any;
  googleLastSyncError: string | null;
  googleRefreshToken: string | null;
}

/**
 * Extract and verify Firebase ID token from Authorization: Bearer <token>.
 */
async function getAuthenticatedUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch (err) {
    console.error("Failed to verify ID token in /api/admin/clients:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const decoded = await getAuthenticatedUser(req);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uid = decoded.uid;

  // Check admins/{uid}
  const adminSnap = await adminDb.collection("admins").doc(uid).get();
  if (!adminSnap.exists) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const snap = await adminDb
      .collection("clients")
      .orderBy("createdAt", "desc")
      .get();

    const clients: ClientSummary[] = snap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        businessName: data.businessName || "",
        email: data.email || "",
        credits: data.credits ?? 0,
        stats: data.stats || undefined,
        plan: data.plan || "free",
        subscriptionStatus: data.subscriptionStatus || "active",
        subscriptionEndAt: data.subscriptionEndAt || null,
        createdAt: data.createdAt || null,
        lastPlanChangeAt: data.lastPlanChangeAt || null,
        googleConnectionStatus: data.googleConnectionStatus || null,
        googleLastSyncAt: data.googleLastSyncAt || null,
        googleLastSyncError: data.googleLastSyncError || null,
        googleRefreshToken: data.googleRefreshToken || null,
      };
    });

    return NextResponse.json({ clients });
  } catch (err) {
    console.error("Failed to load clients in /api/admin/clients:", err);
    return NextResponse.json(
      { error: "Internal error loading clients" },
      { status: 500 }
    );
  }
}
