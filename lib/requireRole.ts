import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

type Role = "employer" | "candidate";

export async function requireRole(role: Role) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).maybeSingle();

  if (!profile) {
    await supabase.from("profiles").insert({ user_id: user.id, role: "candidate" });
    if (role !== "candidate") redirect("/app/candidate");
    return { user, role: "candidate" as Role };
  }

  if (profile.role !== role) redirect(profile.role === "employer" ? "/app/employer" : "/app/candidate");

  return { user, role: profile.role as Role };
}
