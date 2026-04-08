import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
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
  title: "LI.FI Demo",
  description:
    "A minimal LI.FI demo with Widget and SDK integration paths.",
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
      <body className="min-h-full text-foreground">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(92,103,255,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(247,194,255,0.24),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(92,103,255,0.08),_transparent_34%),linear-gradient(180deg,_#fbfcff_0%,_#f5f7fc_45%,_#edf2ff_100%)]" />
        <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-[linear-gradient(180deg,_rgba(255,255,255,0.78)_0%,_transparent_100%)]" />
        <div className="mx-auto flex min-h-screen w-full max-w-[1160px] flex-col px-4 pb-12 sm:px-6 lg:px-8">
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
