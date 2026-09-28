"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades in `.reveal` elements as they scroll into view, including ones rendered later.
 * Everything is visible by default; the hidden state only applies once this script has
 * added `reveal-on` to <html>, so a slow or failed script load never leaves the page blank.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      root.classList.remove("reveal-on");
      return;
    }

    // Anything already on screen (or scrolled past) stays visible, so turning the effect on never flashes content away.
    const markVisible = (el: Element) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
    };
    document.querySelectorAll(".reveal:not(.in)").forEach(markVisible);
    root.classList.add("reveal-on");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    const observeNew = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    observeNew();

    const mo = new MutationObserver(observeNew);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
