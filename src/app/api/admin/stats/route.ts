// src/app/api/admin/stats/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

interface AdminStats {
  totalClients: number;
  activeClients: number;
  totalReviews: number;
  totalPending: number;
  avgApprovalRate: number;
  mrr: number;
  upcomingRenewals: number;
  churnLast30Days: number;
  updatedAt?: any;
}

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
    console.error("Failed to verify ID token in /api/admin/stats:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const decoded = await getAuthenticatedUser(req);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uid = decoded.uid;

  const adminSnap = await adminDb.collection("admins").doc(uid).get();
  if (!adminSnap.exists) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const statsRef = adminDb.collection("admin").doc("stats");
    const statsSnap = await statsRef.get();

    if (!statsSnap.exists) {
      return NextResponse.json(
        { error: "Stats document not found" },
        { status: 404 }
      );
    }

    const data = statsSnap.data() as AdminStats;
    return NextResponse.json({ stats: data });
  } catch (err) {
    console.error("Failed to load admin stats in /api/admin/stats:", err);
    return NextResponse.json(
      { error: "Internal error loading stats" },
      { status: 500 }
    );
  }
}
