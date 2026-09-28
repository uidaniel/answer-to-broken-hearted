import { NextResponse } from "next/server";
import { verifySession } from "@/lib/paystack";

/** Called by the booking page after the Paystack popup reports a successful session payment. */
export async function POST(request: Request) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ verified: false, error: "PAYSTACK_SECRET_KEY is not set" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const reference = typeof body?.reference === "string" ? body.reference.trim() : "";
  const session = await verifySession(reference);

  if (!session) return NextResponse.json({ verified: false }, { status: 402 });

  // A good place to record the booking payment or email yourself a notification.
  console.log(`Session payment verified: ${session.hours}h for ${session.email} (${reference})`);

  return NextResponse.json({ verified: true, hours: session.hours });
}
