import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "观察日记",
  description: "记录日常，看见每周的变化。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
