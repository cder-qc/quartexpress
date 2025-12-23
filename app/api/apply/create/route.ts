import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { z } from "zod";

const Body = z.object({
  email: z.string().email(),
  phone: z.string().min(8),
  services: z.array(z.string()).min(1),
  min_rate: z.number().nullable().optional(),
  opt_in_sms: z.boolean().optional(),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());

  const { data, error } = await supabaseAdmin
    .from("candidate_applications")
    .insert({
      email: body.email.toLowerCase(),
      phone: body.phone,
      services: body.services,
      min_rate: body.min_rate ?? null,
      opt_in_sms: body.opt_in_sms ?? true,
      unsubscribed: false,
    })
    .select("token")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, token: data.token });
}
