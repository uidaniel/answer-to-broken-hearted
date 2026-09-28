"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-linked motion:
 *  - a thin progress bar across the top of the page
 *  - gentle parallax for any element with data-parallax="<speed>" (e.g. 0.15)
 * Uses the CSS `translate` property so it never fights `transform`/`scale` animations.
 */
export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = reduce ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));

      const vh = window.innerHeight;
      for (const el of items) {
        const host = el.parentElement ?? el;
        const rect = host.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        const speed = Number(el.dataset.parallax) || 0.15;
        // 0 when the element's centre is mid-screen; positive above, negative below.
        const offset = (vh / 2 - (rect.top + rect.height / 2)) * speed;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden="true" />;
}
