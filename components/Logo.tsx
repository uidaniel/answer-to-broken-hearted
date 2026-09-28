import Link from "next/link";

/*
 * The mark: a jigsaw heart with one piece missing, and a hand lifting that piece back into place.
 * Drawn without masks or ids, so it can appear any number of times on a page.
 */
const HEART_WITH_GAP =
  "M52 110 C52 110 6 85 6 49 C6 32.5 18.5 20 34 20 C42.5 20 48.5 24.5 52 31 C55.5 24.5 61.5 20 70 20 C85.5 20 98 32.5 98 49 C98 85 52 110 52 110 Z M56.5 32.5 H85.5 V61.5 H75.68 A5.13 5.13 0 1 1 66.32 61.5 H56.5 V51.68 A5.13 5.13 0 1 1 56.5 42.32 Z";
const SEAMS = "M44 23.5 V58 A4.2 4.2 0 1 0 44 66 V99 M13 72 H24 A4.2 4.2 0 1 1 32 72 H90";
const PIECE = "M0 0 H26 V26 H17.2 A4.6 4.6 0 1 1 8.8 26 H0 V17.2 A4.6 4.6 0 1 1 0 8.8 Z";
const HAND =
  "M-2 -3.5 C-1 -0.5 2 0 5 0 L26 0 L27 -2 C25 -9 22.5 -14 25 -16 C28.5 -18.5 33 -12 36.5 -3.5 L39 0 L52 -1.5 L52 16 L32 16 C24 16 13 12.5 5 10 C0 8.5 -4 6 -4.2 1 C-4.3 -1.8 -3.4 -3.5 -2 -3.5 Z";

/** `light` draws the hand in a pale colour for dark backgrounds. */
export function LogoMark({ light = false, className = "logo-mark" }: { light?: boolean; className?: string }) {
  const hand = light ? "#fcfbfa" : "#153a43";
  const handLines = light ? "#153a43" : "#fcfbfa";
  return (
    <svg className={className} viewBox="0 0 164 120" aria-hidden="true">
      <path fill="#ff7c4d" fillRule="evenodd" d={HEART_WITH_GAP} />
      <path d={SEAMS} fill="none" stroke="#fcfbfa" strokeOpacity=".6" strokeWidth="2.2" strokeLinecap="round" />
      <g transform="translate(84 44) rotate(-24)">
        <path d={PIECE} transform="translate(1 -26.5)" fill="#ff4401" />
        <rect x="49" y="-8.5" width="30" height="27" rx="5" fill="#389bb4" />
        <path d={HAND} fill={hand} />
        <path d="M8 4.6 L27 5.4 M11 8.8 L29 10" stroke={handLines} strokeOpacity=".35" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export default function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Answer To The Broken Hearted home">
      <LogoMark />
      <span>
        Answer To The
        <br />
        Broken Hearted
      </span>
    </Link>
  );
}
