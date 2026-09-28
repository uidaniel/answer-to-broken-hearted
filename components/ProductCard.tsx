import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { ProductArt, sceneClass } from "./ProductMedia";

type Props = {
  product: Product;
  /** When set, the card has "Read more" and "Buy now" buttons (shop page). Otherwise it links to the shop. */
  onView?: () => void;
  onBuy?: () => void;
};

export default function ProductCard({ product, onView, onBuy }: Props) {
  const interactive = Boolean(onView && onBuy);
  const href = `/shop?product=${product.id}`;

  return (
    <article className="product-card reveal">
      {interactive ? (
        <button type="button" className={`product-media ${sceneClass(product)}`} onClick={onView} aria-label={`View details for ${product.name}`}>
          <ProductArt product={product} />
        </button>
      ) : (
        <Link href={href} className={`product-media ${sceneClass(product)}`} aria-label={`View ${product.name}`}>
          <ProductArt product={product} />
        </Link>
      )}
      <div className="product-body">
        <span className="product-cat">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.short}</p>
        {interactive && (
          <button className="link-btn" type="button" onClick={onView} style={{ marginTop: "1rem", alignSelf: "flex-start" }}>
            Read more
          </button>
        )}
        <div className="product-foot">
          <span className="price">{formatPrice(product.price)}</span>
          {interactive ? (
            <button className="btn btn-dark" type="button" onClick={onBuy}>
              Buy now
            </button>
          ) : (
            <Link className="btn btn-dark" href={href}>
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
