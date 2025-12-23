import "./globals.css";

export const metadata = {
  title: "QuartExpress",
  description: "Shift marketplace (quarts) pour petits employeurs — Montréal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
