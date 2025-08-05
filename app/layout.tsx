import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArtLila - Elementary Art Class Companion",
  description: "Interactive spinning wheels for creative drawing challenges in elementary art class",
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