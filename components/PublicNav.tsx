import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export async function PublicNav() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div style={{ borderBottom: "1px solid var(--border)", background: "white" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <Link href="/" style={{ fontWeight: 950 }}>QuartExpress</Link>

        <nav style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <a href="/#how" style={{ fontWeight: 800, color: "#222" }}>Comment ça marche</a>
          <a href="/#plans" style={{ fontWeight: 800, color: "#222" }}>Plans</a>
          <Link href="/apply" style={{ fontWeight: 800, color: "#222" }}>Candidats</Link>
          {user ? (
            <Link href="/app" style={btnPrimary}>Mon espace</Link>
          ) : (
            <Link href="/auth?role=employer" style={btnPrimary}>Je suis employeur</Link>
          )}
        </nav>
      </div>
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 14,
  background: "var(--primary)",
  color: "var(--primaryText)",
  fontWeight: 900
};
