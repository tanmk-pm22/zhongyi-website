import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "AI剪纸设计 - 传统艺术现代化",
  description: "使用AI技术将照片、文字、语音转换为传统剪纸艺术，支持多语言书法生成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="font-sans">
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
