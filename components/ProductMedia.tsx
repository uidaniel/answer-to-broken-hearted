import Image from "next/image";
import type { Product } from "@/lib/products";

/** Product photo if one is set, otherwise a generated book-style cover on the product's colour scene. */
export function ProductArt({ product }: { product: Product }) {
  if (product.image) {
    return <Image src={product.image} alt={product.name} fill sizes="(max-width: 580px) 100vw, 33vw" />;
  }
  return (
    <span className="cover" aria-hidden="true">
      <span className="cover-type">{product.type}</span>
      <span className="cover-title">{product.name}</span>
      <span className="cover-brand">Answer to Broken Hearted</span>
    </span>
  );
}

export function sceneClass(product: Product) {
  return `scene scene-${product.scene}`;
}
