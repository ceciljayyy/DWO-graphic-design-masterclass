import type { Metadata } from "next";
import { Barlow_Condensed, Outfit } from "next/font/google";
import type { ReactNode } from "react";

import { masterclass } from "@/lib/masterclass";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: masterclass.name,
    template: `%s | ${masterclass.name}`,
  },
  description: masterclass.description,
  openGraph: {
    title: masterclass.name,
    description: masterclass.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${barlowCondensed.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
