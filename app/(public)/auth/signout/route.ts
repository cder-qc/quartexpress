import { NextResponse } from "next/server";
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST() {
  const supabase = supabaseRoute();
  await supabase.auth.signOut();
  const base = process.env.APP_URL || "http://localhost:3000";
  return NextResponse.redirect(new URL("/", base), { status: 303 });
}
