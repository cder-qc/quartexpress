import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { z } from "zod";

const Body = z.object({
  user_id: z.string(),
  phone: z.string().min(8),
  services: z.array(z.string()).min(1),
  min_rate: z.number().nullable().optional(),
  opt_in_sms: z.boolean(),
  unsubscribed: z.boolean(),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());

  await supabaseAdmin.from("profiles").upsert({ user_id: body.user_id, role: "candidate", phone: body.phone });

  const { error } = await supabaseAdmin.from("candidate_profiles").upsert({
    user_id: body.user_id,
    services: body.services,
    min_rate: body.min_rate ?? null,
    opt_in_sms: body.opt_in_sms,
    unsubscribed: body.unsubscribed,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
