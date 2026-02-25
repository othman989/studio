// src/app/api/admin/coupons/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountPercent: number;
  maxUses?: number | null;
  uses: number;
  partnerId?: string | null;
  active: boolean;
  createdBy?: string;
  createdAt?: any;
}

/**
 * Verify Firebase ID token and ensure the user is an admin.
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
    console.error("Failed to verify ID token in /api/admin/coupons:", err);
    return null;
  }
}

// GET: list all coupons (already used by /admin)
export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const snap = await adminDb
      .collection("coupons")
      .orderBy("createdAt", "desc")
      .get();

    const coupons: Coupon[] = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code,
        description: data.description || "",
        discountPercent: data.discountPercent,
        maxUses: data.maxUses ?? null,
        uses: data.uses ?? 0,
        partnerId: data.partnerId ?? null,
        active: data.active ?? false,
        createdBy: data.createdBy || "",
        createdAt: data.createdAt || null,
      };
    });

    return NextResponse.json({ coupons });
  } catch (err) {
    console.error("Failed to load coupons in /api/admin/coupons (GET):", err);
    return NextResponse.json(
      { error: "Internal error loading coupons" },
      { status: 500 }
    );
  }
}

// POST: create a new coupon
export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const rawCode = (body.code || "").trim();
    const discountPercent = Number(body.discountPercent);
    const maxUses =
      body.maxUses === null || body.maxUses === undefined
        ? null
        : Number(body.maxUses);
    const partnerId =
      typeof body.partnerId === "string" && body.partnerId.trim() !== ""
        ? body.partnerId.trim()
        : null;
    const active =
      typeof body.active === "boolean" ? body.active : true;

    if (!rawCode) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(discountPercent) || discountPercent <= 0) {
      return NextResponse.json(
        {
          error: "Invalid discountPercent; must be a positive number.",
        },
        { status: 400 }
      );
    }
    if (maxUses !== null && (!Number.isFinite(maxUses) || maxUses <= 0)) {
      return NextResponse.json(
        {
          error:
            "Invalid maxUses; must be a positive number or null for unlimited.",
        },
        { status: 400 }
      );
    }

    const upperCode = rawCode.toUpperCase();

    const ref = await adminDb.collection("coupons").add({
      code: upperCode,
      description: "",
      discountPercent,
      maxUses,
      uses: 0,
      partnerId,
      active,
      createdBy: admin.uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    const createdSnap = await ref.get();
    const data = createdSnap.data() || {};

    const coupon: Coupon = {
      id: ref.id,
      code: data.code || upperCode,
      description: data.description || "",
      discountPercent: data.discountPercent,
      maxUses: data.maxUses ?? null,
      uses: data.uses ?? 0,
      partnerId: data.partnerId ?? null,
      active: data.active ?? false,
      createdBy: data.createdBy || admin.uid,
      createdAt: data.createdAt || null,
    };

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err) {
    console.error("Failed to create coupon in /api/admin/coupons (POST):", err);
    return NextResponse.json(
      { error: "Internal error creating coupon" },
      { status: 500 }
    );
  }
}

// PATCH: update an existing coupon
export async function PATCH(req: NextRequest) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const id = (body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.discountPercent !== undefined) {
      const discountPercent = Number(body.discountPercent);
      if (!Number.isFinite(discountPercent) || discountPercent <= 0) {
        return NextResponse.json(
          {
            error:
              "Invalid discountPercent; must be a positive number.",
          },
          { status: 400 }
        );
      }
      updates.discountPercent = discountPercent;
    }

    if (body.maxUses !== undefined) {
      if (body.maxUses === null) {
        updates.maxUses = null;
      } else {
        const maxUses = Number(body.maxUses);
        if (!Number.isFinite(maxUses) || maxUses <= 0) {
          return NextResponse.json(
            {
              error:
                "Invalid maxUses; must be a positive number or null.",
            },
            { status: 400 }
          );
        }
        updates.maxUses = maxUses;
      }
    }

    if (body.active !== undefined) {
      updates.active = !!body.active;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update." },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("coupons").doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json(
        { error: `Coupon ${id} not found` },
        { status: 404 }
      );
    }

    await ref.update(updates);

    const updatedSnap = await ref.get();
    const data = updatedSnap.data() || {};

    const coupon: Coupon = {
      id: updatedSnap.id,
      code: data.code,
      description: data.description || "",
      discountPercent: data.discountPercent,
      maxUses: data.maxUses ?? null,
      uses: data.uses ?? 0,
      partnerId: data.partnerId ?? null,
      active: data.active ?? false,
      createdBy: data.createdBy || "",
      createdAt: data.createdAt || null,
    };

    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("Failed to update coupon in /api/admin/coupons (PATCH):", err);
    return NextResponse.json(
      { error: "Internal error updating coupon" },
      { status: 500 }
    );
  }
}

// DELETE: delete an existing coupon
export async function DELETE(req: NextRequest) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const id = (body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("coupons").doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json(
        { error: `Coupon ${id} not found` },
        { status: 404 }
      );
    }

    await ref.delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete coupon in /api/admin/coupons (DELETE):", err);
    return NextResponse.json(
      { error: "Internal error deleting coupon" },
      { status: 500 }
    );
  }
}
