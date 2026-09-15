import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DonateCard } from "@/components/DonateCard";
import "./globals.css";
import "@/styles/donate-widget.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image2Outline Demo",
  description:
    "Interactive demo of @richardmcquiston01/makertool-image2outline: trace an image into an SVG/DXF vector outline.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <DonateCard />
      </body>
    </html>
  );
}
