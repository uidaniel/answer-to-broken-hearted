import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import ShopCatalog from "@/components/ShopCatalog";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: "Products",
  description:
    "eBooks for healing the broken heart, resolving conflict and finding clarity in faith. Pay with Paystack, download instantly.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;

  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>
      <section className="page-hero">
        <div className="page-hero-card scene scene-night">
          <Photo src="/images/bible-coffee.jpg" priority tint="dark" parallax={0.1} />
          <span className="tagline enter">Our eBooks</span>
          <h1 className="enter" style={{ "--d": 1 } as React.CSSProperties}>Resources for the healing journey.</h1>
          <p className="enter" style={{ "--d": 2 } as React.CSSProperties}>
            eBooks to help you heal, make peace and grow in faith. Read about each one, pay securely with Paystack and
            download it instantly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ShopCatalog initialProductId={product} />
        </div>
      </section>

      <section className="cta">
        <div className="cta-card scene scene-dawn">
          <Photo src="/images/conversation.jpg" tint="dark" parallax={0.1} />
          <h2 className="reveal">Need more than a book? <span>Talk to us.</span></h2>
          <p className="reveal" style={{ "--i": 1 } as React.CSSProperties}>Some answers are best found in conversation. Book a private session.</p>
          <div className="reveal" style={{ "--i": 2 } as React.CSSProperties}>
            <Link className="btn btn-primary" href="/book">Book a session</Link>
          </div>
        </div>
      </section>
      </div>
    </ViewTransition>
  );
}
