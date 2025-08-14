import type { Metadata } from "next";
import localFont from 'next/font/local';
import Link from 'next/link';
import Image from 'next/image';
import "./globals.css";

const cooperBlackFont = localFont({
  src: '../public/fonts/cooper-black.ttf',
  variable: '--font-cooper',
  display: 'swap',
});

const neueHaasFont = localFont({
  src: [
    {
      path: '../public/fonts/NeueHaasDisplayXXThin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/NeueHaasDisplayXThin.ttf',
      weight: '150',
      style: 'normal',
    },
    {
      path: '../public/fonts/NeueHaasDisplayThin.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/NeueHaasDisplayLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/NeueHaasDisplayRoman.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/NeueHaasDisplayMediu.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/NeueHaasDisplayBold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/NeueHaasDisplayBlack.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-neue-haas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Dylan's Art Class",
  description: "Companion website for elementary art classes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cooperBlackFont.variable} ${neueHaasFont.variable}`}>
      <body className="antialiased font-neue-haas">
        <header className="fixed top-0 left-0 z-50 p-6">
          <Link href="/">
            <div className="transition-transform duration-200 hover:scale-105 cursor-pointer">
              <Image
                src="/logo-black.png"
                alt="Dylan's Art Class Logo"
                width={101}
                height={101}
                className="w-auto h-[84px]"
                priority
              />
            </div>
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}