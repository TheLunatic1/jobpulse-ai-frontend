import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import ForceDarkMode from "@/components/ForceDarkMode";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobPulse AI – Smart Job Recruitment with AI",
  description: "AI-powered job matching, career guidance, resume optimization and recruitment platform",
  icons: {
    icon: "/favicon.ico",
  },
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
      <body
        className={`${inter.variable} font-sans antialiased bg-base-100 text-base-content min-h-screen`}
      >
        <ForceDarkMode />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}