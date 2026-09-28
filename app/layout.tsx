import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { site } from "@/lib/site";
import ScrollEffects from "@/components/ScrollEffects";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Answer To The Broken Hearted | There is an answer to your question",
    template: "%s | Answer To The Broken Hearted",
  },
  description:
    "Answer To The Broken Hearted helps individuals, families, communities, nations, business owners and people of faith through heartbreak, conflict and confusion.",
  openGraph: {
    url: "/",
    siteName: "Answer To The Broken Hearted",
    title: "Answer To The Broken Hearted",
    description: "Heartbreak, conflict, a confused mind about faith. There is an answer to your question.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
        <ScrollEffects />
      </body>
    </html>
  );
}
