import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] , variable: "--font-latin" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-ibm-plex-serif",
})

export const metadata: Metadata = {
  title: "Coin Master",
  description: "Coin Master is a modern platform for banking and finance management",
  icons: {
    icon: '/icons/logo.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>{children}</body>
    </html>
  );
}
