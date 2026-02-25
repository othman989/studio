import { onSchedule } from "firebase-functions/v2/scheduler";

// Node 20 has global fetch available

export const scheduledSyncAllReviews = onSchedule(
  {
    schedule: "every 4 hours", // or "0 */4 * * *" for cron
    timeZone: "UTC",
  },
  async (event) => {
    const appUrl =
      process.env.APP_URL || "https://studio-6069290181-9f198.web.app";
    const secret = process.env.CRON_SYNC_SECRET;

    if (!secret) {
      console.error(
        "CRON_SYNC_SECRET not set; skipping scheduled sync."
      );
      return;
    }

    const base = appUrl.replace(/\/$/, "");
    const url = `${base}/api/internal/sync-all-reviews-cron?secret=${encodeURIComponent(
      secret
    )}`;

    try {
      const res = await fetch(url, { method: "GET" });
      const text = await res.text();
      if (!res.ok) {
        console.error(
          "scheduledSyncAllReviews: non-200 from app:",
          res.status,
          text
        );
      } else {
        console.log("scheduledSyncAllReviews: success:", text);
      }
    } catch (err) {
      console.error("scheduledSyncAllReviews: fetch error", err);
    }
  }
);
