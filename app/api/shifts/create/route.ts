import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { triggerMatching } from "@/lib/matching";

const Body = z.object({
  employer_user_id: z.string(),
  service_type: z.enum(["evenement", "plonge", "barman"]),
  location: z.string().min(2),
  start_at: z.string(),
  end_at: z.string(),
  hourly_rate: z.number().min(1),
  tips_flag: z.boolean().optional(),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());

  const { data: shift, error } = await supabaseAdmin
    .from("shifts")
    .insert({
      employer_user_id: body.employer_user_id,
      service_type: body.service_type,
      location: body.location,
      start_at: body.start_at,
      end_at: body.end_at,
      hourly_rate: body.hourly_rate,
      tips_flag: body.tips_flag ?? false,
      status: "open",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  try {
    const result = await triggerMatching(shift.id);
    return NextResponse.json({ ok: true, shift_id: shift.id, dispatch: result });
  } catch (e: any) {
    return NextResponse.json({ ok: true, shift_id: shift.id, dispatch_error: e?.message ?? "dispatch error" });
  }
}
