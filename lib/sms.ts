import Twilio from "twilio";

export function twilioClient() {
  return Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
}

export async function sendSms(to: string, body: string) {
  const client = twilioClient();
  return client.messages.create({ from: process.env.TWILIO_FROM_NUMBER!, to, body });
}
