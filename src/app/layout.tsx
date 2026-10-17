import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MbareteTráfico 🇵🇾 - Movilidad Urbana Inteligente",
  description: "Tráfico, colectivos en vivo y desvíos inteligentes para Asunción y el Departamento Central de Paraguay.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MbareteTráfico 🇵🇾 - Movilidad Urbana Inteligente",
    description: "Consultá en tiempo real el tráfico, desvíos y colectivos en Asunción y Central.",
    type: "website",
    locale: "es_PY",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark bg-slate-950">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-amber-500/30 selection:text-amber-300">
        {children}
      </body>
    </html>
  );
}
