import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const STATUS_COPY: Record<string, { subject: string; heading: string; body: string }> = {
  Processing: {
    subject: "We've received your order",
    heading: "Your order is being prepared",
    body: "Thanks for your order! Our team is preparing it now — we'll let you know as soon as it's on its way.",
  },
  "Out for Delivery": {
    subject: "Your order is on its way!",
    heading: "Out for delivery",
    body: "Good news — your order has left the farm and is on its way to you. Please have someone available to receive it.",
  },
  Delivered: {
    subject: "Your order has been delivered",
    heading: "Delivered — enjoy!",
    body: "Your order has been marked as delivered. We hope you enjoy it! If anything wasn't right, please reach out to us right away.",
  },
  Cancelled: {
    subject: "Your order has been cancelled",
    heading: "Order cancelled",
    body: "Your order has been cancelled. If this wasn't expected, or you have any questions, please contact us — we're happy to help.",
  },
};

export async function POST(request: NextRequest) {
  const { orderNumber, status } = await request.json();

  if (!orderNumber || !status || !STATUS_COPY[status]) {
    return NextResponse.json({ sent: false, error: "Missing or invalid orderNumber/status." }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Verify this order actually exists and get the real customer details
  // ourselves — never trust an email address passed in from the client,
  // or this endpoint could be used to spam arbitrary inboxes using our
  // sender reputation.
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("order_number, email, full_name, status")
    .eq("order_number", orderNumber)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ sent: false, error: "Order not found." }, { status: 404 });
  }
  if (!order.email) {
    // No email on file for this order (e.g. Pay on Delivery customer
    // who skipped the optional email field) — nothing to send to.
    return NextResponse.json({ sent: false, error: "No email on file for this order." }, { status: 200 });
  }
  if (order.status !== status) {
    return NextResponse.json({ sent: false, error: "Status mismatch — order may have changed again." }, { status: 409 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not set.");
    return NextResponse.json({ sent: false, error: "Email is not configured." }, { status: 500 });
  }

  const copy = STATUS_COPY[status];
  const firstName = order.full_name?.split(" ")[0] ?? "there";

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "5CEE Farms <onboarding@resend.dev>",
      to: order.email,
      subject: `${copy.subject} — Order ${order.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #2B2B2B;">
          <div style="background-color: #1B5E20; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0;">5CEE FARMS LTD</p>
            <p style="color: #D4A017; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 4px 0 0;">Chiso Foods</p>
          </div>
          <div style="border: 1px solid #1B5E2020; border-top: none; padding: 28px 24px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 15px;">Hi ${firstName},</p>
            <h2 style="color: #1B5E20; font-size: 20px; margin: 12px 0;">${copy.heading}</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #2B2B2B99;">${copy.body}</p>
            <p style="font-size: 13px; color: #2B2B2B66; margin-top: 20px;">Order Number: <strong>${order.order_number}</strong></p>
            <p style="font-size: 12px; color: #2B2B2B66; margin-top: 24px;">
              Questions? WhatsApp us at <a href="https://wa.me/2347061302674" style="color: #1B5E20;">0706 130 2674</a>.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Resend send error:", err);
    return NextResponse.json({ sent: false, error: "Failed to send email." }, { status: 500 });
  }
}