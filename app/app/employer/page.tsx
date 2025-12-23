import { requireRole } from "@/lib/requireRole";
import { absUrl } from "@/lib/absUrl";
import { Card, Pill, Muted } from "@/components/ui";
import { CreateShiftForm } from "./CreateShiftForm";

export default async function EmployerPage() {
  const { user } = await requireRole("employer");

  const res = await fetch(absUrl("/api/shifts/list"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ employer_user_id: user.id }),
  });
  const json = await res.json();
  const shifts = json.shifts ?? [];

  return (
    <main className="container">
      <h1 className="h1" style={{ fontSize: 36 }}>Portail Employeur</h1>
      <p className="p">Crée un quart. QuartExpress diffuse par SMS et confirme via <b>OK-only</b>.</p>

      <Card>
        <h2 className="h2" style={{ fontSize: 22 }}>Créer un quart</h2>
        <div style={{ height: 10 }} />
        <CreateShiftForm employerUserId={user.id} />
      </Card>

      <div style={{ height: 14 }} />

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <h2 className="h2" style={{ fontSize: 22 }}>Mes quarts</h2>
          <Muted>{shifts.length} quart(s)</Muted>
        </div>

        {!shifts.length ? (
          <Muted>Aucun quart pour l’instant.</Muted>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>Statut</th><th style={th}>Service</th><th style={th}>Lieu</th>
                  <th style={th}>Début</th><th style={th}>Fin</th><th style={th}>Taux</th><th style={th}>Dispatch</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s: any) => (
                  <tr key={s.id}>
                    <td style={td}>
                      <Pill tone={s.status === "filled" ? "good" : "warn"}>{s.status}</Pill>
                      {s.confirmed_offer_id ? <div style={{ color: "#0a7", fontWeight: 900, marginTop: 6 }}>OK confirmé</div> : null}
                    </td>
                    <td style={td}><b>{s.service_type}</b></td>
                    <td style={td}>{s.location}</td>
                    <td style={td}>{new Date(s.start_at).toLocaleString("fr-CA")}</td>
                    <td style={td}>{new Date(s.end_at).toLocaleString("fr-CA")}</td>
                    <td style={td}>{Number(s.hourly_rate).toFixed(2)}$/h {s.tips_flag ? "• tips" : ""}</td>
                    <td style={td}>
                      <div>vagues: <b>{s.dispatch_count ?? 0}</b></div>
                      <div style={{ color: "#666" }}>{s.last_dispatch_at ? `dernier: ${new Date(s.last_dispatch_at).toLocaleString("fr-CA")}` : "—"}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </main>
  );
}
const th: React.CSSProperties = { padding: 10, borderBottom: "1px solid #eee", color: "#444" };
const td: React.CSSProperties = { padding: 10, borderBottom: "1px solid #f2f2f2", verticalAlign: "top" };
