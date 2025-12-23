import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function AppRouterPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).maybeSingle();
  if (profile?.role === "employer") redirect("/app/employer");
  redirect("/app/candidate");
}
