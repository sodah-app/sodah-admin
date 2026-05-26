import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* SAVE MEMORY */
export async function saveMemory({
  businessId,
  customerPhone,
  role,
  message,
  aiResponse,
  intent,
  sentiment,
}) {
  const { error } = await supabase
    .from("ai_memory")
    .insert([
      {
        business_id: businessId,
        customer_phone: customerPhone,
        role,
        message,
        ai_response: aiResponse,
        intent,
        sentiment,
      },
    ]);

  if (error) {
    console.log("Memory Save Error:", error);
  }
}

/* GET CONVERSATION MEMORY */
export async function getConversationMemory(
  customerPhone
) {
  const { data, error } = await supabase
    .from("ai_memory")
    .select("*")
    .eq("customer_phone", customerPhone)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.log("Memory Fetch Error:", error);
    return [];
  }

  return data;
}