"use client";
import { useState } from "react";
import { Button, Input, Label, Select, Muted } from "@/components/ui";

type Props = { employerUserId: string };

export function CreateShiftForm({ employerUserId }: Props) {
  const [serviceType, setServiceType] = useState<"evenement" | "plonge" | "barman">("evenement");
  const [location, setLocation] = useState("Montréal");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [hourlyRate, setHourlyRate] = useState<number>(20);
  const [tips, setTips] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!startAt || !endAt) return alert("Choisis une date/heure de début et de fin.");
    setLoading(true);
    const res = await fetch("/api/shifts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employer_user_id: employerUserId,
        service_type: serviceType,
        location,
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
        hourly_rate: Number(hourlyRate),
        tips_flag: tips,
      }),
    });
    setLoading(false);
    const json = await res.json();
    if (!res.ok) return alert(json.error ?? "Erreur");
    alert("Quart créé ✅ Dispatch SMS lancé.");
    window.location.reload();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
      <div>
        <Label>Service</Label>
        <Select value={serviceType} onChange={(e) => setServiceType(e.target.value as any)}>
          <option value="evenement">Banquets / événements</option>
          <option value="plonge">Plonge</option>
          <option value="barman">Barman</option>
        </Select>
      </div>

      <div>
        <Label>Lieu</Label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: Montréal, Plateau..." />
      </div>

      <div>
        <Label>Début</Label>
        <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
      </div>

      <div>
        <Label>Fin</Label>
        <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
      </div>

      <div>
        <Label>Taux horaire ($/h)</Label>
        <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} min={1} />
      </div>

      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 10 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900 }}>
          <input type="checkbox" checked={tips} onChange={(e) => setTips(e.target.checked)} />
          Tips inclus
        </label>

        <Button onClick={submit} disabled={loading}>{loading ? "Création..." : "Créer + envoyer SMS"}</Button>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <Muted>SMS: <b>1 CODE</b> (accepter) • <b>2 CODE</b> (refuser) • <b>OK CODE</b> (confirmer) • STOP</Muted>
      </div>
    </div>
  );
}
