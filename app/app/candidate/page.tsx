import { requireRole } from "@/lib/requireRole";
import { supabaseServer } from "@/lib/supabaseServer";
import { Card } from "@/components/ui";
import { CandidateProfileForm } from "./CandidateProfileForm";

export default async function CandidatePage() {
  const { user } = await requireRole("candidate");
  const supabase = supabaseServer();

  const { data: profile } = await supabase.from("profiles").select("phone").eq("user_id", user.id).maybeSingle();
  const { data: cand } = await supabase
    .from("candidate_profiles")
    .select("services,min_rate,opt_in_sms,unsubscribed")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <main className="container">
      <h1 className="h1" style={{ fontSize: 36 }}>Portail Candidat</h1>
      <p className="p">Configure ton profil pour recevoir des quarts par SMS (opt-in).</p>

      <Card>
        <h2 className="h2" style={{ fontSize: 22 }}>Mon profil</h2>
        <div style={{ height: 10 }} />
        <CandidateProfileForm
          userId={user.id}
          initialPhone={profile?.phone ?? ""}
          initialServices={(cand?.services ?? []) as string[]}
          initialMinRate={cand?.min_rate ?? ""}
          initialOptIn={cand?.opt_in_sms ?? true}
          initialUnsubscribed={cand?.unsubscribed ?? false}
        />
      </Card>
    </main>
  );
}
