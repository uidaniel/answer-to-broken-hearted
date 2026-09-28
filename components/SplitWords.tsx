import { Fragment } from "react";

/**
 * Splits heading text into words that slide up one after another when their `.reveal`
 * ancestor scrolls into view. Screen readers get the plain text via aria-label.
 */
export default function SplitWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span aria-label={text} role="text">
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden="true">
            <span className="word" style={{ "--w": i + delay } as React.CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
