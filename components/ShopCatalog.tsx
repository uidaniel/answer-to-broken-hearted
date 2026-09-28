"use client";

import { useEffect, useRef, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import ProductCard from "./ProductCard";
import { ProductArt, sceneClass } from "./ProductMedia";
import { useCheckout } from "./checkout/CheckoutProvider";
import { getProduct, products, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

export default function ShopCatalog({ initialProductId }: { initialProductId?: string }) {
  const { buy } = useCheckout();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const visible = products.filter((p) => filter === "All" || p.category === filter);

  function view(product: Product) {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setSelected(product);
    setOpen(true);
    window.history.replaceState(null, "", `?product=${product.id}`);
  }

  function close(restoreFocus = true) {
    setOpen(false);
    window.history.replaceState(null, "", window.location.pathname);
    if (restoreFocus) lastFocus.current?.focus();
  }

  // Open a product straight from a link such as /shop?product=healing-the-broken-heart
  useEffect(() => {
    const product = initialProductId ? getProduct(initialProductId) : undefined;
    if (product) view(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProductId]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("locked");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("locked");
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <div className="filters" role="group" aria-label="Filter eBooks by topic">
        {categories.map((c) => (
          <button key={c} className="filter" type="button" aria-pressed={c === filter} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} onView={() => view(p)} onBuy={() => buy(p)} />
        ))}
      </div>
      {visible.length === 0 && <p className="lead">No eBooks here yet. Please check back soon.</p>}

      <div className={`overlay${open ? " open" : ""}`} onClick={() => close()} aria-hidden="true" />
      <div className={`modal${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button ref={closeRef} className="close-btn" type="button" onClick={() => close()} aria-label="Close">
          <XIcon size={20} />
        </button>
        {selected && (
          <div className="modal-grid">
            <div className={`product-media ${sceneClass(selected)}`}>
              <ProductArt product={selected} />
            </div>
            <div className="modal-content">
              <span className="product-cat">{selected.category}</span>
              <h2 id="modal-title">{selected.name}</h2>
              <p className="price" style={{ marginTop: ".75rem" }}>{formatPrice(selected.price)}</p>
              <p className="desc">{selected.description}</p>
              {selected.includes.length > 0 && (
                <>
                  <h4 style={{ marginTop: "1.5rem" }}>What&apos;s inside</h4>
                  <ul>
                    {selected.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              <div className="modal-buy">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    close(false);
                    buy(selected);
                  }}
                >
                  Buy now · {formatPrice(selected.price)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
