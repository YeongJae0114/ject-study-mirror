import { Suspense } from "react";

import type { Metadata } from "next";
import { Alata } from "next/font/google";
import localFont from "next/font/local";

import Navbar from "@/components/common/Navbar";
import ScrollManager from "@/components/common/ScrollManager";

import Providers from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "ReFit",
  description: "묵혀둔 작품을 꺼내어, 가장 핏한 공간과의 매칭",
};

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alata",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pretendard.className} ${alata.variable} h-full antialiased`}>
      {/* <body className="flex min-h-full flex-col"> */}
      <body className="mobile:w-97.5 mx-auto min-h-screen w-full bg-white">
        <Providers>{children}</Providers>
        <Suspense fallback={null}>
          <ScrollManager />
        </Suspense>
        <Navbar />
      </body>
    </html>
  );
}
