import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function AuthCallbackPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  redirect("/app");
}
