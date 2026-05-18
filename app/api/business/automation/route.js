import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function generateBusinessId() {
  return "BIZ-" + Date.now();
}

export async function POST(request) {
  try {
    const body = await request.json();

    // ==========================================================
    // 1. CHECK LIVE WHATSAPP SESSION BEFORE SAVING ANY DATA
    // ==========================================================
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://sodah-app-sypp.vercel.app";

    try {
      const checkResponse = await fetch(
        `${appUrl}/api/connect-whatsapp`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();

        // Support different possible response formats
        const isConnected =
          checkData?.connected === true ||
          checkData?.isConnected === true ||
          checkData?.status === "connected" ||
          checkData?.whatsapp_connected === true;

        if (isConnected) {
          return NextResponse.json(
            {
              success: false,
              alreadyConnected: true,
              message:
                "WhatsApp is already connected. Disconnect the current session before creating a new setup.",
            },
            { status: 400 }
          );
        }
      }
    } catch (sessionCheckError) {
      // Do not block setup if the session check endpoint is unavailable.
      console.warn(
        "WhatsApp session check failed:",
        sessionCheckError.message
      );
    }

    // ==========================================================
    // 2. CHECK DATABASE FLAG AS A SECOND LAYER OF PROTECTION
    // ==========================================================
    const {
      data: existingConnectedBusiness,
      error: checkError,
    } = await supabase
      .from("businesses")
      .select("id, business_name")
      .eq("whatsapp_connected", true)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to check WhatsApp connection status.",
        },
        { status: 500 }
      );
    }

    if (existingConnectedBusiness) {
      return NextResponse.json(
        {
          success: false,
          alreadyConnected: true,
          message:
            "WhatsApp is already connected for another business. Disconnect it first before creating a new setup.",
        },
        { status: 400 }
      );
    }

    // ==========================================================
    // 3. EXTRACT REQUEST DATA
    // ==========================================================
    const {
      email,
      business_name,
      full_name,
      industry,
      location,
      price_range,
      ai_number,
      support_number,
      working_days,
      hours,
      capabilities,
      personal_goal,
      setup_type = "business",
    } = body;

    // ==========================================================
    // 4. CHECK IF THIS BUSINESS HAS ALREADY BEEN SAVED
    // ==========================================================
    const { data: existingBusiness, error: existingBusinessError } =
      await supabase
        .from("businesses")
        .select("*")
        .eq("email", email)
        .eq("business_name", business_name)
        .maybeSingle();

    if (existingBusinessError) {
      return NextResponse.json(
        {
          success: false,
          message: existingBusinessError.message,
        },
        { status: 500 }
      );
    }

    if (existingBusiness) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        message:
          "Your information has already been saved. Please connect your WhatsApp.",
        business_id: existingBusiness.business_id,
        data: existingBusiness,
      });
    }

    // ==========================================================
    // 5. GENERATE UNIQUE BUSINESS ID
    // ==========================================================
    const business_id = generateBusinessId();

    // ==========================================================
    // 6. SAVE NEW BUSINESS RECORD
    // ==========================================================
    const { data, error } = await supabase
      .from("businesses")
      .insert([
        {
          business_id,
          setup_type,
          business_name,
          full_name,
          industry,
          email,
          location,
          price_range,
          ai_number,
          support_number,
          working_days,
          hours,
          capabilities,
          personal_goal,
          whatsapp_connected: false,
          status: "active",
        },
      ])
      .select()
      .single();

    // ==========================================================
    // 7. HANDLE DATABASE ERRORS
    // ==========================================================
    if (error) {
      console.error("Supabase error:", error);

      // Unique constraint on support_number
      if (
        error.code === "23505" ||
        error.message?.toLowerCase().includes("duplicate")
      ) {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            message:
              "This WhatsApp support number has already been registered.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // ==========================================================
    // 8. SUCCESS RESPONSE
    // ==========================================================
    return NextResponse.json({
      success: true,
      alreadyExists: false,
      message: "Business setup saved successfully.",
      business_id: data.business_id,
      data,
    });
  } catch (error) {
    console.error("Setup API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}