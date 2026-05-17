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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Brighton Tandabantu",
    description: "Software engineer, AI builder, and founder. Building AnchorBase and AgriData AI.",
    url: "https://bthanda.com",
    siteName: "Brighton Tandabantu",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Brighton Tandabantu - Software engineer, AI builder, and founder.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brighton Tandabantu",
    description: "Software engineer, AI builder, and founder.",
    images: ["/twitter-image.png"],
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
