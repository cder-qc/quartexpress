import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function SetEmployerRole() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  await supabase.from("profiles").upsert({ user_id: user.id, role: "employer" });
  redirect("/app/employer");
}
