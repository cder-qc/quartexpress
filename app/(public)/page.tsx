import Link from "next/link";
import { Card } from "@/components/ui";

export default function Home() {
  return (
    <main className="container">
      <section style={{ padding: "34px 0 10px" }}>
        <h1 className="h1">Remplissez vos quarts. Confirmés pour vrai.</h1>
        <p className="p" style={{ fontSize: 18, maxWidth: 760 }}>
          Diffusion SMS + modèle <b>OK-only</b> : un quart n’est confirmé que si le candidat répond <b>OK</b>.
          Lancement Montréal : banquets/événements, plonge, barman.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <Link href="/auth?role=employer" style={btnPrimary}>Je suis employeur</Link>
          <Link href="/apply" style={btnGhost}>Je suis candidat</Link>
        </div>

        <p className="p" style={{ marginTop: 10 }}>✅ Abonnement • ✅ Opt-in • ✅ SMS • ✅ Confirmation “OK”</p>
      </section>

      <section id="how" style={{ marginTop: 18 }}>
        <Card>
          <h2 className="h2">Comment ça marche</h2>
          <ol className="p">
            <li><b>Publie un quart</b> (service, lieu, horaires, taux).</li>
            <li><b>QuartExpress diffuse par SMS</b> aux candidats compatibles.</li>
            <li><b>OK-only</b> : le premier <b>OK CODE</b> verrouille le quart.</li>
          </ol>
        </Card>
      </section>

      <section id="plans" style={{ marginTop: 14 }}>
        <div className="grid grid-3">
          <Card><h2 className="h2">199$</h2><p className="p">Démarrage — 2 vagues • 25 candidats/vague</p></Card>
          <Card><h2 className="h2">299$</h2><p className="p">Croissance — 3 vagues • 35 candidats/vague</p></Card>
          <Card><h2 className="h2">399$</h2><p className="p">Pro — 5 vagues • 60 candidats/vague</p></Card>
        </div>
      </section>

      <hr className="hr" />
      <footer className="p">© {new Date().getFullYear()} QuartExpress</footer>
    </main>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 14,
  background: "var(--primary)",
  color: "var(--primaryText)",
  fontWeight: 900
};
const btnGhost: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "white",
  fontWeight: 900
};
