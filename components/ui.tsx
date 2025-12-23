import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: 16,
      boxShadow: "var(--shadow)",
      background: "white"
    }}>
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const style: React.CSSProperties =
    variant === "primary"
      ? { padding: "10px 14px", borderRadius: 14, background: "var(--primary)", color: "var(--primaryText)", fontWeight: 900, border: "none", cursor: "pointer" }
      : { padding: "10px 14px", borderRadius: 14, background: "white", color: "var(--text)", fontWeight: 900, border: "1px solid var(--border)", cursor: "pointer" };

  return (
    <button {...props} style={{ ...style, opacity: props.disabled ? 0.6 : 1 }}>
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: 12,
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: "white",
        outline: "none"
      }}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: 12,
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: "white"
      }}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontWeight: 900, marginBottom: 6 }}>{children}</div>;
}

export function Pill({ children, tone="neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" }) {
  const map: Record<string, React.CSSProperties> = {
    neutral: { background:"#f2f3f5", border:"1px solid #e6e7ea", color:"#333" },
    good: { background:"#eafff3", border:"1px solid #bfead1", color:"#0a6a3a" },
    warn: { background:"#fff7e8", border:"1px solid #f0d6a8", color:"#8a5a00" },
  };
  return (
    <span style={{ display:"inline-block", padding:"5px 10px", borderRadius: 999, fontWeight: 900, fontSize: 12, ...map[tone] }}>
      {children}
    </span>
  );
}

export function Muted({ children }: { children: React.ReactNode }) {
  return <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>{children}</div>;
}
