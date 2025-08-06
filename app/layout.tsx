import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moment Dessin",
  description: "Roues interactives pour des d\u00e9fis de dessin cr\u00e9atifs en classe d'art",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}