"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Card, Button, Input, Label, Muted } from "@/components/ui";

const SERVICE_OPTIONS = [
  { key: "evenement", label: "Banquets / événements" },
  { key: "plonge", label: "Plonge" },
  { key: "barman", label: "Barman" },
];

export default function ApplyPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [minRate, setMinRate] = useState<string>("");
  const [optIn, setOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function toggleService(k: string) {
    setServices((prev) => (prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]));
  }

  async function submit() {
    if (!email.trim()) return alert("Ajoute un email.");
    if (!phone.trim()) return alert("Ajoute un téléphone au format +1...");
    if (!services.length) return alert("Choisis au moins 1 service.");

    setLoading(true);

    const r = await fetch("/api/apply/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, services, min_rate: minRate ? Number(minRate) : null, opt_in_sms: optIn }),
    });

    const j = await r.json();
    if (!r.ok) { setLoading(false); return alert(j.error ?? "Erreur"); }

    const token = j.token;

    const supabase = supabaseBrowser();
    const base = process.env.NEXT_PUBLIC_APP_URL || "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${base}/apply/complete?token=${token}` },
    });

    setLoading(false);
    if (error) return alert(error.message);
    setSent(true);
  }

  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <h1 className="h1" style={{ fontSize: 36 }}>Inscription candidat</h1>
      <p className="p">On t’envoie un lien magique pour confirmer ton email. Ensuite tu reçois des offres SMS (opt-in).</p>

      <Card>
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemple.com" />

        <div style={{ height: 10 }} />
        <Label>Téléphone (format +1...)</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+15145551234" />

        <div style={{ height: 10 }} />
        <Label>Services</Label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SERVICE_OPTIONS.map(s => (
            <button key={s.key} type="button" onClick={() => toggleService(s.key)} style={chip(services.includes(s.key))}>
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ height: 10 }} />
        <Label>Taux minimum ($/h) (optionnel)</Label>
        <Input type="number" value={minRate} onChange={(e) => setMinRate(e.target.value)} min={0} placeholder="Ex: 20" />

        <div style={{ height: 10 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900 }}>
          <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
          Je veux recevoir des SMS (opt-in)
        </label>

        <div style={{ height: 12 }} />
        <Button onClick={submit} disabled={loading}>{loading ? "Envoi..." : "Recevoir mon lien magique"}</Button>

        <div style={{ height: 10 }} />
        {sent && <Muted>✅ Lien envoyé. Ouvre ton email pour finaliser.</Muted>}
        <div style={{ height: 10 }} />
        <Muted>Tu peux te désinscrire en répondant <b>STOP</b>.</Muted>
      </Card>
    </main>
  );
}

function chip(active: boolean): React.CSSProperties {
  return {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid " + (active ? "#111" : "#ddd"),
    background: active ? "#111" : "white",
    color: active ? "white" : "black",
    fontWeight: 900,
    cursor: "pointer",
  };
}
