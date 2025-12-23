"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Card, Button, Input, Label, Muted } from "@/components/ui";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  const role = search.get("role");

  async function sendLink() {
    if (!email.trim()) return alert("Ajoute ton email.");
    setLoading(true);

    const base = process.env.NEXT_PUBLIC_APP_URL || "";
    const redirectTo = role === "employer" ? `${base}/app/set-role/employer` : `${base}/auth/callback`;

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);
    if (error) return alert(error.message);
    setSent(true);
  }

  return (
    <main className="container" style={{ maxWidth: 760 }}>
      <h1 className="h1" style={{ fontSize: 36 }}>Connexion</h1>
      <p className="p">Lien magique par email {role === "employer" ? "(Accès Employeur)" : ""}.</p>

      <Card>
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemple.com" />
        <div style={{ height: 12 }} />
        <Button onClick={sendLink} disabled={loading}>{loading ? "Envoi..." : "Envoyer le lien magique"}</Button>
        <div style={{ height: 10 }} />
        {sent ? <Muted>✅ Lien envoyé. Vérifie ta boîte mail (et tes spams).</Muted> : <Muted>Tu seras redirigé automatiquement après clic.</Muted>}
      </Card>
    </main>
  );
}
