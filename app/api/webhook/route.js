import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log(
      "PAYPAL WEBHOOK:",
      JSON.stringify(body, null, 2)
    );

    /* =========================
       PAYMENT COMPLETED
    ========================== */

    if (
      body.event_type ===
      "PAYMENT.CAPTURE.COMPLETED"
    ) {
      const payment =
        body.resource;

      const email =
        payment?.payer?.email_address;

      const amount =
        payment?.amount?.value;

      const transactionId =
        payment?.id;

      /* =========================
         SAVE PAYMENT
      ========================== */

      const { error: paymentError } =
        await supabase
          .from("payments")
          .insert([
            {
              email,
              amount,
              status: "completed",
              payment_method:
                "paypal",
              paypal_transaction_id:
                transactionId,
            },
          ]);

      if (paymentError) {
        console.error(
          paymentError
        );
      }

      /* =========================
         CREATE SUBSCRIPTION
      ========================== */

      const startDate =
        new Date();

      const endDate =
        new Date();

      endDate.setMonth(
        endDate.getMonth() + 1
      );

      const {
        error: subscriptionError,
      } = await supabase
        .from("subscriptions")
        .insert([
          {
            email,
            plan: "premium",
            amount,
            status: "active",
            paypal_order_id:
              transactionId,
            start_date:
              startDate,
            end_date: endDate,
          },
        ]);

      if (subscriptionError) {
        console.error(
          subscriptionError
        );
      }

      console.log(
        "Subscription Activated"
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          "Webhook Error",
      },
      {
        status: 500,
      }
    );
  }
}