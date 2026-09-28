import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  /** Colour wash laid over the photo so text on top stays readable. */
  tint?: "hero" | "dark" | "soft" | "none";
  position?: string;
};

/** A full-bleed background photo for a `.scene` container (sits under the grain and the content). */
export default function Photo({ src, alt = "", priority, sizes = "100vw", tint = "dark", position }: Props) {
  return (
    <>
      <Image
        className="photo-bg"
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={position ? { objectPosition: position } : undefined}
      />
      {tint !== "none" && <span className={`photo-tint tint-${tint}`} aria-hidden="true" />}
    </>
  );
}
