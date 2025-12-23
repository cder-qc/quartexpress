import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { absUrl } from "@/lib/absUrl";

export default async function ApplyCompletePage({ searchParams }: { searchParams: { token?: string } }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const token = searchParams.token;
  if (!token) redirect("/apply");

  const res = await fetch(absUrl("/api/apply/complete"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ token }),
  });

  const json = await res.json();
  if (!res.ok) {
    return (
      <main className="container" style={{ maxWidth: 820 }}>
        <h1 className="h1" style={{ fontSize: 34 }}>Erreur</h1>
        <p className="p">{json.error ?? "Impossible de finaliser."}</p>
        <Link href="/apply" style={{ fontWeight: 900 }}>Retour</Link>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <h1 className="h1" style={{ fontSize: 34 }}>Inscription finalisée ✅</h1>
      <p className="p">Ton profil candidat est prêt.</p>
      <Link href="/app/candidate" style={{ fontWeight: 900 }}>Aller à mon portail candidat →</Link>
    </main>
  );
}
