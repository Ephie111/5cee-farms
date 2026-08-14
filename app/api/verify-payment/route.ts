import { NextRequest, NextResponse } from "next/server";

/**
 * Verifies a Paystack transaction reference server-side.
 *
 * This MUST happen on the server: the secret key used here can move
 * real money and must never be sent to the browser. The client only
 * gets back a simple { verified: true/false }.
 */
export async function POST(request: NextRequest) {
  const { reference } = await request.json();

  if (!reference || typeof reference !== "string") {
    return NextResponse.json({ verified: false, error: "Missing payment reference." }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("PAYSTACK_SECRET_KEY is not set.");
    return NextResponse.json(
      { verified: false, error: "Payment verification is not configured." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const data = await res.json();

    const verified = data?.status === true && data?.data?.status === "success";

    return NextResponse.json({
      verified,
      amount: verified ? data.data.amount / 100 : null, // kobo → naira
    });
  } catch (err) {
    console.error("Paystack verify error:", err);
    return NextResponse.json({ verified: false, error: "Could not reach Paystack." }, { status: 500 });
  }
}