import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Faith & Growth Tracker",
    default: "Faith & Growth Tracker",
  },
  description: "A personal discipline dashboard for tracking faith, goals, and growth.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Faith & Growth Tracker",
    description: "A personal discipline dashboard for tracking faith, goals, and growth.",
    type: "website",
    locale: "en_ZA",
  },
};

export const viewport: Viewport = {
  themeColor: "#d4af37",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${dmSans.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
