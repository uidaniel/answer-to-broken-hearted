"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClockIcon, VideoCameraIcon } from "@phosphor-icons/react";
import { site, type SessionKey } from "@/lib/site";
import Photo from "./Photo";

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void };
  }
}

const sessions: { key: SessionKey; scene: string; photo: string; title: string; text: string }[] = [
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

function urlFor(session?: SessionKey | null) {
  return (session && site.calendly[session]) || site.calendly.main;
}

export default function BookingSection({ initialSession }: { initialSession?: SessionKey | null }) {
  const [url, setUrl] = useState(() => urlFor(initialSession));
  const [ready, setReady] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLElement>(null);

  const mount = useCallback(() => {
    if (!url || !embedRef.current || !window.Calendly) return;
    embedRef.current.innerHTML = "";
    const widgetUrl = `${url}${url.includes("?") ? "&" : "?"}hide_gdpr_banner=1&primary_color=ff7c4d`;
    window.Calendly.initInlineWidget({ url: widgetUrl, parentElement: embedRef.current });
  }, [url]);

  useEffect(() => {
    if (window.Calendly) setReady(true);
  }, []);

  useEffect(() => {
    if (ready) mount();
  }, [ready, mount]);

  useEffect(() => {
    if (initialSession) scheduleRef.current?.scrollIntoView();
  }, [initialSession]);

  function choose(key: SessionKey) {
    setUrl(urlFor(key));
    scheduleRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onReady={() => setReady(true)} />

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="tagline">Session types</span>
              <h2>What would you like to talk about?</h2>
            </div>
          </div>
          <div className="session-grid">
            {sessions.map((s) => (
              <article className="session-card reveal" key={s.key}>
                <div className={`session-art scene scene-${s.scene}`}>
                  <Photo src={s.photo} tint="none" sizes="(max-width: 900px) 100vw, 33vw" />
                </div>
                <div className="session-body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className="session-meta">
                    <span className="chip"><ClockIcon size={16} /> 60 min</span>
                    <span className="chip"><VideoCameraIcon size={16} /> Online</span>
                  </div>
                  <button className="btn btn-dark btn-block" type="button" onClick={() => choose(s.key)}>
                    Choose a time
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="schedule" ref={scheduleRef} style={{ paddingTop: 0, scrollMarginTop: "calc(var(--nav-h) + 1rem)" }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="tagline">Schedule</span>
              <h2>Pick a date and time.</h2>
            </div>
            <p className="lead" style={{ maxWidth: "24rem" }}>
              You&apos;ll get a confirmation email with your meeting details straight away.
            </p>
          </div>
          <div className="calendly-wrap">
            {url ? (
              <div ref={embedRef} className="calendly-inline" />
            ) : (
              <div className="notice" style={{ margin: "1.5rem" }}>
                <h4>Booking calendar not connected yet</h4>
                <p style={{ marginTop: ".5rem" }}>
                  Add your Calendly link as <code>NEXT_PUBLIC_CALENDLY_URL</code> in <code>.env.local</code> and the booking
                  calendar will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
