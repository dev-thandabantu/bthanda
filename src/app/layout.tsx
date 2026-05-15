import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brighton Tandabantu",
  description: "Software engineer, AI builder, and founder. Building AnchorBase and AgriData AI. Available for select freelance and contract work.",
  openGraph: {
    title: "Brighton Tandabantu",
    description: "Software engineer, AI builder, and founder. Building AnchorBase and AgriData AI.",
    url: "https://bthanda.com",
    siteName: "Brighton Tandabantu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Brighton Tandabantu",
    description: "Software engineer, AI builder, and founder.",
  },
  metadataBase: new URL("https://bthanda.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
