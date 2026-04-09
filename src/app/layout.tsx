import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "福星AI算命",
  description: "基于四柱命理的 Web 模块化测算服务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-950 flex flex-col">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
              福星AI算命
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-500">
              <Link href="/privacy" className="transition hover:text-slate-900">
                隐私说明
              </Link>
              <Link href="/terms" className="transition hover:text-slate-900">
                服务条款
              </Link>
              <Link href="/disclaimer" className="transition hover:text-slate-900">
                免责声明
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
