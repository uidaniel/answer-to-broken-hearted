"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Photo from "./Photo";

const issues = [
  {
    key: "heart",
    photo: { src: "/images/broken-heart.jpg", alt: "A woman sitting alone at dusk with her head on her knees" },
    title: "Broken heart",
    sub: "For when sadness, hurt or disappointment feels too heavy to carry.",
    heading: "Are you feeling sad, hurt, or emotionally devastated?",
    chips: ["Very sad", "Disturbed", "Worrying", "Hurt", "Depressed", "Disappointed", "Emotionally devastated"],
    body: null,
    answer: true,
    cta: { href: "/book?session=brokenHeart", label: "Book a broken heart session" },
  },
  {
    key: "conflict",
    photo: { src: "/images/conflict-handshake.jpg", alt: "Two people shaking hands across a table" },
    title: "Conflict resolution",
    sub: "For individuals, families, communities, nations and businesses at odds.",
    heading: "Conflict can be resolved, at every level.",
    chips: ["Individual conflict", "Family conflict", "Community conflict", "National conflict", "Business conflict"],
    body: "Whether it is between two people or two groups, we help each side be heard and find a path to peace.",
    answer: false,
    cta: { href: "/book?session=conflict", label: "Book a conflict resolution session" },
  },
  {
    key: "faith",
    photo: { src: "/images/faith-prayer.jpg", alt: "A young woman praying with her eyes closed" },
    title: "Faith confused mind",
    sub: "For the questions about faith that keep you awake at night.",
    heading: "Are you confused about your faith?",
    chips: ["Doubts", "Troubling questions", "Unanswered prayers", "Feeling lost"],
    body: "Do you have bothering questions? Bring them. No question is too small or too difficult.",
    answer: true,
    cta: { href: "/book?session=faith", label: "Book a faith conversation" },
  },
];

export default function IssueTabs() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Only auto-advance when the visitor hasn't asked for reduced motion.
  useEffect(() => {
    setAutoplay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  function choose(index: number, focus = false) {
    const next = (index + issues.length) % issues.length;
    setAutoplay(false);
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  }

  return (
    <div className="tabs reveal" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="tab-list" role="tablist" aria-label="Issues we address">
        {issues.map((issue, i) => (
          <button
            key={issue.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            className="tab"
            role="tab"
            id={`tab-${issue.key}`}
            aria-controls={`panel-${issue.key}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => choose(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); choose(active + 1, true); }
              if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); choose(active - 1, true); }
            }}
          >
            {i === active && autoplay && (
              <span
                key={`timer-${active}`}
                className="tab-timer running"
                style={{ animationPlayState: paused ? "paused" : "running" }}
                onAnimationEnd={() => setActive((a) => (a + 1) % issues.length)}
              />
            )}
            <span className="tab-num">0{i + 1}</span>
            <span className="tab-title">{issue.title}</span>
            <span className="tab-sub">{issue.sub}</span>
          </button>
        ))}
      </div>

      <div>
        {issues.map((issue, i) => (
          <div
            key={issue.key}
            className={`tab-panel scene scene-${issue.key}`}
            role="tabpanel"
            id={`panel-${issue.key}`}
            aria-labelledby={`tab-${issue.key}`}
            hidden={i !== active}
          >
            <Photo src={issue.photo.src} alt={issue.photo.alt} tint="soft" sizes="(max-width: 860px) 100vw, 55vw" />
            <div className="panel-card">
              <h3>{issue.heading}</h3>
              <div className="chips">
                {issue.chips.map((chip) => (
                  <span className="chip" key={chip}>{chip}</span>
                ))}
              </div>
              {issue.body && <p>{issue.body}</p>}
              {issue.answer && <p className="panel-answer">There is an answer to your question.</p>}
              <Link className="btn btn-dark" href={issue.cta.href}>{issue.cta.label}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
