import { NextResponse } from "next/server";
import { verifyPurchase } from "@/lib/paystack";

/** Called by the checkout after the Paystack popup reports success. */
export async function POST(request: Request) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ verified: false, error: "PAYSTACK_SECRET_KEY is not set" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const reference = typeof body?.reference === "string" ? body.reference.trim() : "";
  const purchase = await verifyPurchase(reference);

  if (!purchase) return NextResponse.json({ verified: false }, { status: 402 });

  // A good place to record the order or email yourself a notification.
  console.log(`eBook sale verified: ${purchase.product.name} → ${purchase.email} (${reference})`);

  return NextResponse.json({
    verified: true,
    productId: purchase.product.id,
    downloadUrl: `/api/ebooks/download?reference=${encodeURIComponent(reference)}`,
  });
}
