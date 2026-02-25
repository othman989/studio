// src/lib/firebase-functions.ts

/**
 * Applique un coupon pour un plan
 *
 * NOTE: This is a simple client-side helper. It does NOT use Genkit or any
 * server-only dependencies, so it is safe to import from Client Components.
 * In a real app, you would likely call a backend API to validate coupons.
 */
export async function redeemCoupon(
  code: string,
  planId: "starter" | "pro" | "enterprise"
): Promise<{
  ok: boolean;
  discountPercent: number;
  couponCode: string;
  planId: string;
}> {
  console.log("Attempting to redeem coupon:", code, "for plan:", planId);

  if (code.toUpperCase() === "PARTNER10") {
    return {
      ok: true,
      discountPercent: 10,
      couponCode: code,
      planId,
    };
  }

  return {
    ok: false,
    discountPercent: 0,
    couponCode: code,
    planId,
  };
}
