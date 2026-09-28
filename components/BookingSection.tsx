"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { CalendarCheckIcon, CheckCircleIcon, ClockIcon, LockSimpleIcon, VideoCameraIcon } from "@phosphor-icons/react";
import { countryNames } from "@/lib/countries";
import { formatSessionPrice, sessionPrice, sessionTopics, site, type SessionKey } from "@/lib/site";
import Photo from "./Photo";
import SplitWords from "./SplitWords";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string; email?: string; customAnswers?: Record<string, string> };
      }) => void;
    };
  }
}

const topics: { key: SessionKey; scene: string; photo: string; title: string; text: string }[] = [
  {
    key: "brokenHeart",
    scene: "heart",
    photo: "/images/session-heart.jpg",
    title: "Broken heart session",
    text: "For when you feel very sad, hurt, worried, depressed, disappointed or emotionally devastated.",
  },
  {
    key: "conflict",
    scene: "conflict",
    photo: "/images/session-conflict.jpg",
    title: "Conflict resolution",
    text: "For individual, family, community, national and business conflict. Come alone or with the other party.",
  },
  {
    key: "faith",
    scene: "faith",
    photo: "/images/session-faith.jpg",
    title: "Faith conversation",
    text: "Confused about your faith, or carrying questions that bother you? Bring them all.",
  },
];

type Details = { name: string; email: string; phone: string; country: string; notes: string };
type Booking = Details & { topic: SessionKey; hours: number; reference: string };
type Step = "details" | "book" | "booked";

const STORAGE_KEY = "atbh-paid-booking";

export default function BookingSection({ initialSession }: { initialSession?: SessionKey | null }) {
  const [topic, setTopic] = useState<SessionKey>(initialSession ?? "brokenHeart");
  const [hours, setHours] = useState(1);
  const [step, setStep] = useState<Step>("details");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [calendlyReady, setCalendlyReady] = useState(false);
  const bookingRef = useRef<HTMLElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [countries, setCountries] = useState<string[]>([]);

  const total = sessionPrice(hours);
  const calendlyUrl = booking ? site.calendly[booking.hours] : "";

  // A paid booking survives a page refresh, so nobody has to pay twice to reach the calendar.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null") as Booking | null;
      if (saved?.reference) {
        setBooking(saved);
        setTopic(saved.topic);
        setHours(saved.hours);
        setStep("book");
      }
    } catch {
      /* storage unavailable */
    }
    if (window.Calendly) setCalendlyReady(true);
    setCountries(countryNames());
  }, []);

  useEffect(() => {
    if (initialSession) bookingRef.current?.scrollIntoView();
  }, [initialSession]);

  // Show the Calendly calendar for the paid session length, with the buyer's details filled in.
  useEffect(() => {
    if (step !== "book" || !booking || !calendlyUrl || !calendlyReady || !embedRef.current || !window.Calendly) return;
    embedRef.current.innerHTML = "";
    window.Calendly.initInlineWidget({
      url: `${calendlyUrl}${calendlyUrl.includes("?") ? "&" : "?"}hide_gdpr_banner=1&primary_color=ff7c4d`,
      parentElement: embedRef.current,
      prefill: {
        name: booking.name,
        email: booking.email,
        customAnswers: {
          a1: booking.phone,
          a2: booking.country,
          a3: `${sessionTopics[booking.topic]}: ${booking.notes}`,
          a4: `Paid ${formatSessionPrice(sessionPrice(booking.hours))} via Paystack, ref ${booking.reference}`,
        },
      },
    });
  }, [step, booking, calendlyUrl, calendlyReady]);

  // Calendly tells the page when the time slot has been booked.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      if (e.data?.event === "calendly.event_scheduled") {
        setStep("booked");
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        bookingRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function chooseTopic(key: SessionKey) {
    setTopic(key);
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function handlePay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const details: Details = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      country: String(data.get("country") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
    };

    if (!details.name) return setError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) return setError("Please enter a valid email address.");
    if (details.phone.replace(/\D/g, "").length < 7) return setError("Please enter a phone number we can reach you on.");
    if (!details.country) return setError("Please tell us which country you are in.");
    if (!details.notes) return setError("Please tell us briefly what you would like to talk about.");
    if (!site.paystackPublicKey) {
      return setError("Payments are not set up yet. The site owner needs to add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.");
    }

    setPaying(true);
    const [firstName, ...rest] = details.name.split(/\s+/);
    const chosenHours = hours;
    const chosenTopic = topic;

    try {
      // Paystack's library touches `window` on import, so load it only in the browser, on demand.
      const { default: PaystackPop } = await import("@paystack/inline-js");
      new PaystackPop().newTransaction({
        key: site.paystackPublicKey,
        email: details.email,
        amount: Math.round(sessionPrice(chosenHours) * 100), // cents
        currency: site.sessions.currency,
        firstName,
        lastName: rest.join(" "),
        phone: details.phone,
        metadata: {
          kind: "session",
          hours: chosenHours,
          topic: chosenTopic,
          custom_fields: [
            { display_name: "Session", variable_name: "session", value: `${sessionTopics[chosenTopic]}, ${chosenHours} hour(s)` },
            { display_name: "Customer name", variable_name: "customer_name", value: details.name },
            { display_name: "Phone", variable_name: "phone", value: details.phone },
            { display_name: "Country", variable_name: "country", value: details.country },
          ],
        },
        onSuccess: async ({ reference }) => {
          let verified = false;
          try {
            const res = await fetch("/api/paystack/verify-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference }),
            });
            verified = res.ok && (await res.json()).verified === true;
          } catch {
            verified = false;
          }
          setPaying(false);
          if (!verified) {
            setError(
              `We received your payment (reference ${reference}) but could not confirm it automatically. ` +
                `Please email ${site.contactEmail} with this reference and we will book you in.`
            );
            return;
          }
          const paid: Booking = { ...details, topic: chosenTopic, hours: chosenHours, reference };
          try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(paid));
          } catch {
            /* storage unavailable */
          }
          setBooking(paid);
          setStep("book");
          bookingRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        onCancel: () => setPaying(false),
        onError: (err) => {
          setPaying(false);
          setError(err?.message || "Something went wrong with the payment. Please try again.");
        },
      });
    } catch {
      setPaying(false);
      setError("Could not load Paystack. Please check your internet connection and try again.");
    }
  }

  const stepIndex = step === "details" ? 0 : step === "book" ? 2 : 3;

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onReady={() => setCalendlyReady(true)}
      />

      <section className="section" style={{ paddingTop: "clamp(2rem, 5vw, 3.5rem)" }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="tagline">Book a session</span>
              <h1 className="page-title"><SplitWords text="What would you like to talk about?" /></h1>
            </div>
            <p className="lead" style={{ maxWidth: "24rem" }}>
              Private one-to-one sessions online, {formatSessionPrice(site.sessions.ratePerHour)} per hour. Book 1, 2 or 3
              hours.
            </p>
          </div>
          <div className="session-grid">
            {topics.map((s, i) => (
              <article
                className={`session-card reveal${topic === s.key ? " selected" : ""}`}
                key={s.key}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className={`session-art scene scene-${s.scene}`}>
                  <Photo src={s.photo} tint="none" sizes="(max-width: 900px) 100vw, 33vw" />
                  {topic === s.key && (
                    <span className="selected-badge">
                      <CheckCircleIcon size={18} weight="fill" /> Selected
                    </span>
                  )}
                </div>
                <div className="session-body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className="session-meta">
                    <span className="chip"><ClockIcon size={16} /> 1–3 hours</span>
                    <span className="chip"><VideoCameraIcon size={16} /> Online</span>
                  </div>
                  <button
                    className={`btn btn-block ${topic === s.key ? "btn-primary" : "btn-dark"}`}
                    type="button"
                    aria-pressed={topic === s.key}
                    onClick={() => chooseTopic(s.key)}
                    disabled={step !== "details"}
                  >
                    {topic === s.key ? "Continue" : "Choose this"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        id="schedule"
        ref={bookingRef}
        style={{ paddingTop: 0, scrollMarginTop: "calc(var(--nav-h) + 1rem)" }}
      >
        <div className="container">
          <ol className="stepper reveal" aria-label="Booking steps">
            {["Your details", "Pay securely", "Pick a time"].map((label, i) => (
              <li
                key={label}
                className={i < stepIndex ? "done" : i === stepIndex || (i === 1 && paying) ? "current" : ""}
                aria-current={i === stepIndex ? "step" : undefined}
              >
                <span className="stepper-dot">{i < stepIndex ? <CheckCircleIcon size={18} weight="bold" /> : i + 1}</span>
                {label}
              </li>
            ))}
          </ol>

          {step === "details" && (
            <div className="booking-card" key="details">
              <form id="booking-form" className="booking-form" onSubmit={handlePay} noValidate>
                <fieldset className="field">
                  <legend>Session length</legend>
                  <div className="duration-options" role="radiogroup" aria-label="Session length">
                    {site.sessions.hours.map((h) => (
                      <button
                        key={h}
                        type="button"
                        role="radio"
                        aria-checked={hours === h}
                        className={`duration${hours === h ? " active" : ""}`}
                        onClick={() => setHours(h)}
                      >
                        <strong>{h} hour{h > 1 ? "s" : ""}</strong>
                        <span>{formatSessionPrice(sessionPrice(h))}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="bk-name">Full name</label>
                    <input id="bk-name" name="name" autoComplete="name" required />
                  </div>
                  <div className="field">
                    <label htmlFor="bk-email">Email address</label>
                    <input id="bk-email" name="email" type="email" autoComplete="email" required />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="bk-phone">Phone number</label>
                    <input id="bk-phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 800 000 0000" required />
                  </div>
                  <div className="field">
                    <label htmlFor="bk-country">Country</label>
                    <input id="bk-country" name="country" list="bk-countries" autoComplete="country-name" required />
                    <datalist id="bk-countries">
                      {countries.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="bk-notes">What would you like to talk about?</label>
                  <textarea
                    id="bk-notes"
                    name="notes"
                    rows={4}
                    placeholder="A few lines about what is on your heart. Everything you share is private."
                    required
                  />
                </div>

                {error && <p className="form-error">{error}</p>}
              </form>

              <aside className="booking-summary">
                <h4>Your session</h4>
                <dl>
                  <div><dt>Topic</dt><dd>{sessionTopics[topic]}</dd></div>
                  <div><dt>Length</dt><dd>{hours} hour{hours > 1 ? "s" : ""}</dd></div>
                  <div><dt>Where</dt><dd>Online</dd></div>
                  <div className="total"><dt>Total</dt><dd>{formatSessionPrice(total)}</dd></div>
                </dl>
                <button className="btn btn-primary btn-block" type="submit" form="booking-form" disabled={paying}>
                  {paying ? "Opening secure checkout…" : `Pay ${formatSessionPrice(total)} & choose a time`}
                </button>
                <p className="secure">
                  <LockSimpleIcon size={14} /> Secure payment by Paystack. Right after paying you pick your time.
                </p>
              </aside>
            </div>
          )}

          {step === "book" && booking && (
            <div className="booking-paid" key="book">
              <div className="paid-banner">
                <CheckCircleIcon size={28} weight="fill" />
                <div>
                  <strong>Payment received. Thank you, {booking.name.split(" ")[0]}.</strong>
                  <span>
                    {sessionTopics[booking.topic]} · {booking.hours} hour{booking.hours > 1 ? "s" : ""} ·{" "}
                    {formatSessionPrice(sessionPrice(booking.hours))} · ref {booking.reference}
                  </span>
                </div>
              </div>
              <p className="lead" style={{ margin: "1.25rem 0" }}>
                Now pick a day and time that suits you. Your details are already filled in.
              </p>
              <div className="calendly-wrap">
                {calendlyUrl ? (
                  <div ref={embedRef} className="calendly-inline" />
                ) : (
                  <div className="notice" style={{ margin: "1.5rem" }}>
                    <h4>Calendar not connected yet</h4>
                    <p style={{ marginTop: ".5rem" }}>
                      Your payment is confirmed. We will email <strong>{booking.email}</strong> to arrange your time.
                      (Site owner: add <code>NEXT_PUBLIC_CALENDLY_{booking.hours}H_URL</code> to show the calendar here.)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "booked" && (
            <div className="booking-card booked" key="booked">
              <div className="success">
                <CalendarCheckIcon size={52} />
                <h3>You&apos;re booked in.</h3>
                <p>A confirmation with your meeting link has been emailed to you. We look forward to talking with you.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
