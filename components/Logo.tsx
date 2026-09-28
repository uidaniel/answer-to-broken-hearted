import Link from "next/link";

export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 35S4 25.5 4 14.5A8.5 8.5 0 0 1 20 10a8.5 8.5 0 0 1 16 4.5C36 25.5 20 35 20 35Z" fill="#ff7c4d" />
      <path d="M21 10.5 17.5 17l5 3-4 6 1.5 4" fill="none" stroke="#fcfbfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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
