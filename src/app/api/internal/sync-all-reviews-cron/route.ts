// src/app/api/internal/sync-all-reviews-cron/route.ts

import { NextRequest, NextResponse } from "next/server";
import { syncAllClientsReviewsFlow } from "@/ai/flows/sync-google-reviews";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SYNC_SECRET;
  const provided = req.nextUrl.searchParams.get("secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await syncAllClientsReviewsFlow();
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("Cron sync-all-reviews failed:", err);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
