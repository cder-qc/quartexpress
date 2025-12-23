import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseRoute } from "@/lib/supabaseRoute";

const Body = z.object({ token: z.string().uuid() });

export async function POST(req: Request) {
  const supabase = supabaseRoute();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = Body.parse(await req.json());

  const { data: appRow, error: appErr } = await supabaseAdmin
    .from("candidate_applications")
    .select("*")
    .eq("token", body.token)
    .single();

  if (appErr || !appRow) return NextResponse.json({ error: "Token invalide." }, { status: 404 });
  if (appRow.completed_at) return NextResponse.json({ ok: true, already: true });

  await supabaseAdmin.from("profiles").upsert({ user_id: user.id, role: "candidate", phone: appRow.phone });
  await supabaseAdmin.from("candidate_profiles").upsert({
    user_id: user.id,
    services: appRow.services,
    min_rate: appRow.min_rate ?? null,
    opt_in_sms: appRow.opt_in_sms ?? true,
    unsubscribed: appRow.unsubscribed ?? false,
  });
  await supabaseAdmin.from("candidate_applications").update({ completed_at: new Date().toISOString(), user_id: user.id }).eq("token", body.token);

  return NextResponse.json({ ok: true });
}
