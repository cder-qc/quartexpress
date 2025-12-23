"use client";
import { useMemo, useState } from "react";
import { Button, Input, Label, Muted } from "@/components/ui";

type Props = {
  userId: string;
  initialPhone: string;
  initialServices: string[];
  initialMinRate: any;
  initialOptIn: boolean;
  initialUnsubscribed: boolean;
};

const SERVICE_OPTIONS = [
  { key: "evenement", label: "Banquets / événements" },
  { key: "plonge", label: "Plonge" },
  { key: "barman", label: "Barman" },
];

export function CandidateProfileForm({
  userId,
  initialPhone,
  initialServices,
  initialMinRate,
  initialOptIn,
  initialUnsubscribed,
}: Props) {
  const [phone, setPhone] = useState(initialPhone);
  const [services, setServices] = useState<string[]>(initialServices ?? []);
  const [minRate, setMinRate] = useState<string>(initialMinRate ? String(initialMinRate) : "");
  const [optInSms, setOptInSms] = useState<boolean>(initialOptIn);
  const [unsubscribed, setUnsubscribed] = useState<boolean>(initialUnsubscribed);
  const [loading, setLoading] = useState(false);

  const canReceive = useMemo(() => optInSms && !unsubscribed, [optInSms, unsubscribed]);

  function toggleService(k: string) {
    setServices((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  async function save() {
    if (!phone.trim()) return alert("Ajoute ton téléphone (format +1...).");
    if (!services.length) return alert("Choisis au moins 1 service.");

    setLoading(true);
    const res = await fetch("/api/candidate/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        phone: phone.trim(),
        services,
        min_rate: minRate ? Number(minRate) : null,
        opt_in_sms: unsubscribed ? false : optInSms,
        unsubscribed,
      }),
    });
    setLoading(false);

    const json = await res.json();
    if (!res.ok) return alert(json.error ?? "Erreur");
    alert("Profil enregistré ✅");
    window.location.reload();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
      <div>
        <Label>Téléphone</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+15145551234" />
        <div style={{ height: 6 }} />
        <Muted>C’est ce numéro qui reçoit les offres SMS.</Muted>
      </div>

      <div>
        <Label>Taux minimum ($/h) (optionnel)</Label>
        <Input type="number" value={minRate} onChange={(e) => setMinRate(e.target.value)} min={0} placeholder="Ex: 20" />
        <div style={{ height: 6 }} />
        <Muted>Si vide, tu reçois selon le dispatch.</Muted>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <Label>Services</Label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SERVICE_OPTIONS.map((s) => (
            <button key={s.key} type="button" onClick={() => toggleService(s.key)} style={chip(services.includes(s.key))}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900 }}>
          <input type="checkbox" checked={optInSms} onChange={(e) => setOptInSms(e.target.checked)} disabled={unsubscribed} />
          Recevoir des SMS (opt-in)
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900 }}>
          <input type="checkbox" checked={unsubscribed} onChange={(e) => setUnsubscribed(e.target.checked)} />
          Désinscrit (STOP)
        </label>
      </div>

      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ color: canReceive ? "#0a6a3a" : "#8a1f1f", fontWeight: 900 }}>
          {canReceive ? "✅ Eligible aux offres SMS" : "⛔ Non eligible (opt-in désactivé ou désinscrit)"}
        </div>
        <Button onClick={save} disabled={loading}>{loading ? "Enregistrement..." : "Enregistrer"}</Button>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <Muted>Commandes SMS : STOP • 1 CODE • 2 CODE • OK CODE</Muted>
      </div>
    </div>
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
