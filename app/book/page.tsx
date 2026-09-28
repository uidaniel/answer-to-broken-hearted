import type { Metadata } from "next";
import { ViewTransition } from "react";
import BookingSection from "@/components/BookingSection";
import SplitWords from "@/components/SplitWords";
import type { SessionKey } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Book a private session for heartbreak, conflict resolution or questions about faith.",
};

const faqs = [
  {
    q: "How much does a session cost?",
    a: "$10 per hour. You can book 1, 2 or 3 hours, and you pay securely with Paystack (card, bank transfer or USSD) before choosing your time.",
  },
  {
    q: "What happens after I pay?",
    a: "Our calendar opens straight away with your details filled in. Pick a day and time, and you will get a confirmation email with your meeting link.",
  },
  { q: "Is my conversation private?", a: "Yes. What you share in a session stays between you and us." },
  {
    q: "Can two people in a conflict attend together?",
    a: "Yes. For conflict resolution sessions you can come alone or invite the other party. Mention it in the booking form so we can prepare.",
  },
  {
    q: "Do you offer money or financial support?",
    a: "No. Answer To The Broken Hearted is not a financial empowerment organisation. We focus only on heartbreak, conflict and faith.",
  },
  { q: "How do I reschedule or cancel?", a: "Use the link in your confirmation email to reschedule or cancel at any time." },
  {
    q: "What if I am in crisis right now?",
    a: "If you are in immediate danger or thinking about harming yourself, please contact your local emergency services straight away. Our sessions do not replace emergency or medical care.",
  },
];

const sessionKeys: SessionKey[] = ["brokenHeart", "conflict", "faith"];

export default async function BookPage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const { session } = await searchParams;
  const initialSession = sessionKeys.find((k) => k === session) ?? null;

  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>
      <BookingSection initialSession={initialSession} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container container-small">
          <div className="center reveal" style={{ marginBottom: "2.5rem" }}>
            <span className="tagline">Questions</span>
            <h2 style={{ marginTop: ".75rem" }}><SplitWords text="Before you book" /></h2>
          </div>
          <div className="faq reveal" style={{ "--i": 1 } as React.CSSProperties}>
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      </div>
    </ViewTransition>
  );
}
