"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircleIcon, DownloadSimpleIcon, LockSimpleIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import { formatPrice, site } from "@/lib/site";
import { ProductArt, sceneClass } from "../ProductMedia";
import { useCheckout } from "./CheckoutProvider";

type Result =
  | { kind: "verified"; firstName: string; email: string; reference: string; downloadUrl: string }
  | { kind: "unverified"; reference: string };

export default function CheckoutDrawer() {
  const { product, isOpen, close } = useCheckout();
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Start fresh each time a different eBook is chosen.
  useEffect(() => {
    setResult(null);
  }, [product]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!product) return;
    setError("");
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    if (!name) return setError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (!site.paystackPublicKey) {
      return setError("Payments are not set up yet. The site owner needs to add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.");
    }

    setPaying(true);
    const [firstName, ...rest] = name.split(/\s+/);

    try {
      // Paystack's library touches `window` on import, so load it only in the browser, on demand.
      const { default: PaystackPop } = await import("@paystack/inline-js");
      new PaystackPop().newTransaction({
        key: site.paystackPublicKey,
        email,
        amount: Math.round(product.price * 100), // lowest currency unit (kobo / pesewas / cents)
        currency: site.currency,
        firstName,
        lastName: rest.join(" "),
        phone,
        metadata: {
          product_id: product.id,
          custom_fields: [
            { display_name: "eBook", variable_name: "ebook", value: product.name },
            { display_name: "Customer name", variable_name: "customer_name", value: name },
            { display_name: "Phone", variable_name: "phone", value: phone || "-" },
          ],
        },
        onSuccess: async ({ reference }) => {
          let downloadUrl = "";
          try {
            const res = await fetch("/api/paystack/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference }),
            });
            const json = await res.json();
            if (res.ok && json.verified) downloadUrl = json.downloadUrl;
          } catch {
            /* fall through to the "being confirmed" message */
          }
          setPaying(false);
          setResult(
            downloadUrl
              ? { kind: "verified", firstName, email, reference, downloadUrl }
              : { kind: "unverified", reference }
          );
        },
        onCancel: () => setPaying(false),
        onError: (err) => {
          setPaying(false);
          setError(err?.message || "Something went wrong with the payment. Please try again.");
        },
      });
    } catch {
      setPaying(false);
      setError("Could not load Paystack. Please check your internet connection and try again.");
    }
  }

  return (
    <>
      <div className={`overlay${isOpen ? " open" : ""}`} onClick={close} aria-hidden="true" />
      <aside className={`drawer${isOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <div className="drawer-head">
          <h3 id="checkout-title">Checkout</h3>
          <button ref={closeRef} className="close-btn" type="button" onClick={close} aria-label="Close checkout">
            <XIcon size={20} />
          </button>
        </div>

        {product && (
          <div className="drawer-body">
            {result?.kind === "verified" ? (
              <div className="success">
                <CheckCircleIcon size={48} />
                <h3>Thank you, {result.firstName}!</h3>
                <p>Your payment was received and a receipt has been sent to <strong>{result.email}</strong>.</p>
                <a className="btn btn-primary" href={result.downloadUrl} style={{ marginTop: "1.5rem" }}>
                  <DownloadSimpleIcon size={20} /> Download your eBook
                </a>
                <p style={{ fontSize: ".9rem" }}>
                  Payment reference: <strong>{result.reference}</strong>. Keep it to download again later.
                </p>
              </div>
            ) : result?.kind === "unverified" ? (
              <div className="success">
                <WarningCircleIcon size={48} />
                <h3>Payment being confirmed</h3>
                <p>Paystack has your payment and we are confirming it. Your eBook will be emailed to you shortly.</p>
                <p>Keep this reference in case you need to contact us: <strong>{result.reference}</strong></p>
              </div>
            ) : (
              <>
                <div className="checkout-item">
                  <div className={`checkout-thumb product-media ${sceneClass(product)}`}>
                    <ProductArt product={product} />
                  </div>
                  <div>
                    <span className="product-cat">{product.type}</span>
                    <h4>{product.name}</h4>
                    <p className="price" style={{ marginTop: ".35rem" }}>{formatPrice(product.price)}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="field">
                    <label htmlFor="buyer-name">Full name</label>
                    <input id="buyer-name" name="name" autoComplete="name" required />
                  </div>
                  <div className="field">
                    <label htmlFor="buyer-email">Email address</label>
                    <input id="buyer-email" name="email" type="email" autoComplete="email" required />
                    <small className="hint">Your receipt is sent here.</small>
                  </div>
                  <div className="field">
                    <label htmlFor="buyer-phone">Phone number (optional)</label>
                    <input id="buyer-phone" name="phone" type="tel" autoComplete="tel" />
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <button className="btn btn-primary btn-block" type="submit" disabled={paying}>
                    {paying ? "Opening secure checkout…" : `Pay ${formatPrice(product.price)}`}
                  </button>
                  <p className="secure">
                    <LockSimpleIcon size={14} /> Secure payment by Paystack: card, bank transfer and USSD
                  </p>
                </form>
              </>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
