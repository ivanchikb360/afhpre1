import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSMS } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Save to Supabase (if configured)
    const supabase = createAdminClient();
    let insertedData: any = null;

    // Check if Supabase is configured
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      const { error: dbError, data: insertedDataResult } = await supabase
        .from("leads")
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            searching_for: data.searchingFor,
            care_level: data.careLevel,
            mobility_level: data.mobilityLevel,
            memory_care: data.memoryCare,
            medical_needs: data.medicalNeeds,
            price_range: data.priceRange,
            timeline: data.timeline,
            source: data.source || "prelander",
            submitted_at: data.submittedAt || new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (dbError) {
        console.error("Database error:", dbError);
        // Continue anyway - don't fail the request
      } else {
        insertedData = insertedDataResult;
        console.log("Lead saved to Supabase:", insertedData);
      }
    } else {
      console.log(
        "Supabase not configured - skipping database save. Lead data:",
        data
      );
    }

    // Send SMS notification
    try {
      const message = `New prelander lead: ${data.name} (${data.email}). Budget: ${data.priceRange}, Timeline: ${data.timeline}`;
      console.log("📱 Attempting to send SMS notification...");
      await sendSMS("+13606067393", message);
      console.log("✅ SMS notification sent successfully");
    } catch (smsError: any) {
      console.error("❌ SMS error (non-blocking):", smsError);
      console.error("SMS error details:", {
        message: smsError?.message,
        code: smsError?.code,
        status: smsError?.status,
      });
      // Don't fail the request if SMS fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead submitted successfully",
        id: insertedData?.id || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit lead" },
      { status: 500 }
    );
  }
}
