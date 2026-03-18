import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ForceDarkMode from "@/components/ForceDarkMode";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobPulse AI - Smart Job Recruitment Portal",
  description: "AI-powered job matching, career guidance, and recruitment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={inter.className}>
        <ForceDarkMode />
        {children}
      </body>
    </html>
  );
}