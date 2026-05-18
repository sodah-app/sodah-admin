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
// Check if WhatsApp is already connected for any business
const { data: existingConnectedBusiness, error: checkError } = await supabase
  .from('businesses')
  .select('id, business_name')
  .eq('whatsapp_connected', true)
  .maybeSingle();

if (checkError) {
  return NextResponse.json(
    { success: false, error: 'Failed to check WhatsApp connection status.' },
    { status: 500 }
  );
}

if (existingConnectedBusiness) {
  return NextResponse.json(
    {
      success: false,
      error:
        'WhatsApp is already connected for another business on this device. Disconnect it first before creating a new setup.'
    },
    { status: 400 }
  );
}

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

    // Check if business already exists
    const { data: existingBusiness } = await supabase
      .from("businesses")
      .select("*")
      .eq("email", email)
      .eq("business_name", business_name)
      .maybeSingle();

    if (existingBusiness) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        message:
          "Your information has already been saved. Please connect your WhatsApp.",
        business_id: existingBusiness.business_id,
      });
    }

    // Generate unique business ID
    const business_id = generateBusinessId();

    // Save new business
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

    if (error) {
      console.error("Supabase error:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

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
        message: error.message,
      },
      { status: 500 }
    );
  }
}