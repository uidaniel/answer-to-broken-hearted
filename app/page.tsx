import Link from "next/link";
import { ViewTransition } from "react";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  GlobeHemisphereWestIcon,
  HandsPrayingIcon,
  HouseLineIcon,
  UserIcon,
  UsersThreeIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import IssueTabs from "@/components/IssueTabs";
import Photo from "@/components/Photo";
import SplitWords from "@/components/SplitWords";

const marqueeWords = [
  { text: "Broken heart" },
  { text: "Conflict resolution", accent: true },
  { text: "Faith" },
  { text: "There is an answer", accent: true },
];

const audiences = [
  { Icon: UserIcon, title: "Individuals", text: "Personal heartbreak, grief, disappointment and inner conflict." },
  { Icon: UsersThreeIcon, title: "Families", text: "Marriages, parents and children, and relatives who have drifted apart." },
  { Icon: HouseLineIcon, title: "Communities", text: "Neighbourhoods, groups and congregations working through division." },
  { Icon: GlobeHemisphereWestIcon, title: "Nations", text: "Dialogue and reconciliation for conflict on a national scale." },
  { Icon: BriefcaseIcon, title: "Business owners", text: "Disputes between partners, teams, clients and stakeholders." },
  { Icon: HandsPrayingIcon, title: "People of faith", text: "Honest answers for a confused mind and a questioning heart." },
];

const gallery = [
  { src: "/images/heart-hands.jpg", alt: "Hands forming a heart shape against the sunset", caption: "Hope restored" },
  { src: "/images/family-embrace.jpg", alt: "A mother hugging her young child outdoors", caption: "Families reunited" },
  { src: "/images/conversation.jpg", alt: "Two women talking at a table by a window", caption: "Heard without judgement" },
  { src: "/images/comfort.jpg", alt: "A father comforting his daughter as they sit together", caption: "Comfort in hard times" },
];

export default function HomePage() {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero-card scene scene-dawn">
          <Photo src="/images/hero-friends-sunset.jpg" priority tint="hero" position="center 65%" parallax={0.12} />
          <div className="hero-top">
            <div className="hero-intro">
              <h1 className="enter" style={{ "--d": 1 } as React.CSSProperties}>Are you depressed, cheated, hurt, in conflict, or confused? There is an answer to your question.</h1>
              <div className="btn-group enter" style={{ "--d": 2 } as React.CSSProperties}>
                <Link className="btn btn-primary" href="/book">Book a session</Link>
                <a className="btn btn-light" href="#help">See how we help</a>
              </div>
            </div>
            <aside className="hero-note enter" style={{ "--d": 3 } as React.CSSProperties}>
              <strong>You are not alone.</strong>
              Whatever you are carrying (sorrow, disappointment, a broken relationship or a troubled faith), there is a
              way through it.
            </aside>
          </div>
          <p className="hero-title" aria-hidden="true"><span>Answer.</span></p>
        </div>
      </section>
      <aside className="hero-note-mobile">
        <strong>You are not alone.</strong>
        Whatever you are carrying, there is a way through it.
      </aside>

      {/* ===== Mission ===== */}
      <section className="section" id="mission">
        <div className="container container-small center">
          <span className="tagline reveal">Our mission</span>
          <p className="statement reveal" style={{ marginTop: "1.5rem" }}>
            We exist for one purpose: to bring <span className="hl">healing to the broken heart</span>,{" "}
            <span className="hl">resolution to conflict</span> and <span className="hl">clarity to the confused mind</span>.{" "}
            <span className="muted">Whoever you are, and whatever you are facing.</span>
          </p>
        </div>
      </section>

      {/* ===== Marquee ===== */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div className="marquee-group" key={group}>
              {marqueeWords.map((w) => (
                <span key={w.text} style={{ display: "contents" }}>
                  <span className={`marquee-item${w.accent ? " is-accent" : ""}`}>{w.text}</span>
                  <span className="marquee-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== Issues we address ===== */}
      <section className="section" id="help">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <h2><SplitWords text="Issues to Address" /></h2>
            </div>
            <p className="lead" style={{ maxWidth: "26rem" }}>
              Choose what you are going through. Each one is a conversation we are ready to have with you.
            </p>
          </div>
          <IssueTabs />
        </div>
      </section>

      {/* ===== Who we serve ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="tagline">Who we serve</span>
              <h2><SplitWords text="Solutions that address every part of life." /></h2>
            </div>
          </div>
          <div className="serve-grid">
            {audiences.map(({ Icon, title, text }, i) => (
              <article className="serve-card reveal" key={title} style={{ "--i": i % 3 } as React.CSSProperties}>
                <span className="serve-icon"><Icon size={24} /></span>
                <h4>{title}</h4>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Care gallery ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="tagline">Care drives change</span>
              <h2><SplitWords text="Healing happens together." /></h2>
            </div>
            <p className="lead" style={{ maxWidth: "26rem" }}>
              Broken hearts mend, families reconcile and faith grows stronger when someone walks the road with you.
            </p>
          </div>
          <div className="gallery">
            {gallery.map((g, i) => (
              <figure className="reveal reveal-zoom" key={g.src} style={{ "--i": i } as React.CSSProperties}>
                <Photo src={g.src} alt={g.alt} tint="none" sizes="(max-width: 760px) 100vw, 40vw" />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== What we are / are not ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="clarity">
            <div className="clarity-card is-yes reveal reveal-left">
              <span className="tagline" style={{ color: "var(--sky)" }}>What we are</span>
              <h3 style={{ marginTop: ".75rem" }}>Dedicated to the heart</h3>
              <ul>
                <li><CheckCircleIcon size={22} /><span>A place to bring your hurt, sorrow and disappointment</span></li>
                <li><CheckCircleIcon size={22} /><span>A neutral guide for resolving conflict</span></li>
                <li><CheckCircleIcon size={22} /><span>A safe space for honest questions about faith</span></li>
              </ul>
            </div>
            <div className="clarity-card is-no reveal reveal-right" style={{ "--i": 1 } as React.CSSProperties}>
              <span className="tagline">What we are not</span>
              <h3 style={{ marginTop: ".75rem" }}>Not a financial organisation</h3>
              <ul>
                <li><XCircleIcon size={22} /><span>This is not a financial empowerment organisation.</span></li>
                <li><XCircleIcon size={22} /><span>We do not offer grants, loans, investments or cash support.</span></li>
                <li><XCircleIcon size={22} /><span>Our focus is solely heartbreak, conflict and faith.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="tagline">How it works</span>
              <h2><SplitWords text="Three steps towards peace." /></h2>
            </div>
            <Link className="btn btn-outline" href="/book">Book a session</Link>
          </div>
          <div className="steps">
            <div className="step reveal" style={{ "--i": 0 } as React.CSSProperties}><h4>Book a session</h4><p>Pick a time that suits you on our calendar. It takes less than a minute.</p></div>
            <div className="step reveal" style={{ "--i": 1 } as React.CSSProperties}><h4>Talk it through</h4><p>Meet with us privately. Share what is on your heart and be heard without judgement.</p></div>
            <div className="step reveal" style={{ "--i": 2 } as React.CSSProperties}><h4>Walk forward</h4><p>Leave with clear answers and practical next steps, plus resources to keep growing.</p></div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta">
        <div className="cta-card scene scene-night">
          <Photo src="/images/lake-sunrise.jpg" tint="dark" parallax={0.1} />
          <h2 className="reveal">You don&apos;t have to <span>carry it alone.</span></h2>
          <p className="reveal" style={{ "--i": 1 } as React.CSSProperties}>Take the first step today. Book a private session and let&apos;s find your answer together.</p>
          <div className="btn-group is-center reveal" style={{ "--i": 2 } as React.CSSProperties}>
            <Link className="btn btn-primary" href="/book">Book a session</Link>
            <Link className="btn btn-light" href="/shop">Browse products</Link>
          </div>
        </div>
      </section>
      </div>
    </ViewTransition>
  );
}
