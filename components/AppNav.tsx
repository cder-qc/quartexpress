import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export async function AppNav() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div style={{ borderBottom: "1px solid var(--border)", background: "white" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <Link href="/app" style={{ fontWeight: 950 }}>QuartExpress</Link>

        <nav style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/app" style={link}>Mon espace</Link>
          <Link href="/app/employer" style={link}>Employeur</Link>
          <Link href="/app/candidate" style={link}>Candidat</Link>
          {user ? (
            <form action="/auth/signout" method="post">
              <button style={btnGhost}>Déconnexion</button>
            </form>
          ) : (
            <Link href="/auth" style={btnGhost}>Connexion</Link>
          )}
        </nav>
      </div>
    </div>
  );
}

const link: React.CSSProperties = { fontWeight: 900, color: "#222" };
const btnGhost: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "white",
  fontWeight: 900
};
