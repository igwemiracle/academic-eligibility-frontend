import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Computer Science Eligibility Tracker | JOSTUM",
  description:
    "Academic Eligibility Tracking System for Graduation Status Monitoring - Department of Computer Science, Joseph Sarwuan Tarka University, Makurdi",
  icons: {
    icon: "/jostum-logo.png",
    apple: "/jostum-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={sora.variable}>
      <body className={`${sora.className} font-sans antialiased selection:bg-primary/20 selection:text-primary`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
