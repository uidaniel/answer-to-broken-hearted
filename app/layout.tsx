import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutProvider from "@/components/checkout/CheckoutProvider";
import CheckoutDrawer from "@/components/checkout/CheckoutDrawer";
import RevealObserver from "@/components/RevealObserver";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "900"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Answer to Broken Hearted | There is an answer to your question",
    template: "%s | Answer to Broken Hearted",
  },
  description:
    "Answer to Broken Hearted helps individuals, families, communities, nations, business owners and people of faith through heartbreak, conflict and confusion.",
  openGraph: {
    title: "Answer to Broken Hearted",
    description: "Heartbreak, conflict, a confused mind about faith. There is an answer to your question.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <CheckoutProvider>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <CheckoutDrawer />
        </CheckoutProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
