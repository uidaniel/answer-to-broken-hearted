"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import Logo from "./Logo";

const links = [
  { href: "/#mission", label: "Our mission" },
  { href: "/#help", label: "How we help" },
  { href: "/book", label: "Book a session" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Tuck the bar away while scrolling down through content; bring it back on any scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`navbar${scrolled ? " scrolled" : ""}${hidden && !open ? " tucked" : ""}`}
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="container navbar-inner">
        <Logo />
        <div className="nav-right">
          <nav className={`nav-menu${open ? " open" : ""}`} id="nav-menu" aria-label="Main">
            {links.map((link) => (
              <Link
                key={link.href}
                className="nav-link"
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="nav-actions">
              <Link className="btn btn-primary" href="/book" onClick={() => setOpen(false)}>
                Talk to us
              </Link>
            </div>
          </nav>
          <button
            className="nav-toggle"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <XIcon size={28} /> : <ListIcon size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
}
