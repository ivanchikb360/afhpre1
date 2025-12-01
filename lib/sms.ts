import twilio from "twilio";

export async function sendSMS(to: string, message: string) {
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_PHONE_NUMBER
  ) {
    console.warn("Twilio credentials not configured. SMS will not be sent.");
    console.warn("Missing:", {
      accountSid: !process.env.TWILIO_ACCOUNT_SID,
      authToken: !process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: !process.env.TWILIO_PHONE_NUMBER,
    });
    return;
  }

  console.log("Attempting to send SMS:", {
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to,
    messageLength: message.length,
  });

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log(`✅ SMS sent successfully to ${to}`);
    console.log("Twilio message SID:", result.sid);
    return result;
  } catch (error: any) {
    console.error("❌ Error sending SMS:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
    });
    throw error;
  }
}
