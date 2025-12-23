import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { z } from "zod";

const Body = z.object({ employer_user_id: z.string() });

export async function POST(req: Request) {
  const body = Body.parse(await req.json());

  const { data: shifts, error } = await supabaseAdmin
    .from("shifts")
    .select("id,service_type,location,start_at,end_at,hourly_rate,tips_flag,status,confirmed_offer_id,dispatch_count,last_dispatch_at,created_at")
    .eq("employer_user_id", body.employer_user_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, shifts });
}
