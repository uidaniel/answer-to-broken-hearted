"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import Logo from "./Logo";

const links = [
  { href: "/#mission", label: "Our mission" },
  { href: "/#help", label: "How we help" },
  { href: "/shop", label: "Products" },
  { href: "/book", label: "Book a session" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
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
