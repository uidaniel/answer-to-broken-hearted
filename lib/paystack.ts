import "server-only";
import { getProduct, type Product } from "./products";
import { sessionPrice, site } from "./site";

export type VerifiedPurchase = { product: Product; email: string; reference: string };
export type VerifiedSession = { hours: number; email: string; reference: string };

/** Fetches a transaction from Paystack with the SECRET key; returns it only if it succeeded. */
async function fetchSuccessfulTransaction(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not set");
  if (!/^[\w.=-]{1,100}$/.test(reference)) return null;

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  const tx = json?.data;
  if (!res.ok || json?.status !== true || tx?.status !== "success") return null;
  return tx;
}

/**
 * Is `reference` a successful payment for one of our eBooks, at that eBook's full price,
 * in our currency? Returns the purchase if so, otherwise null.
 */
export async function verifyPurchase(reference: string): Promise<VerifiedPurchase | null> {
  const tx = await fetchSuccessfulTransaction(reference);
  if (!tx || tx.metadata?.kind === "session") return null;

  const product = getProduct(String(tx.metadata?.product_id ?? ""));
  if (!product) return null;
  if (tx.currency !== site.currency || Number(tx.amount) !== Math.round(product.price * 100)) return null;

  return { product, email: String(tx.customer?.email ?? ""), reference };
}

/**
 * Is `reference` a successful payment for a counselling session of 1–3 hours,
 * at the full hourly rate, in the session currency? Returns the session if so.
 */
export async function verifySession(reference: string): Promise<VerifiedSession | null> {
  const tx = await fetchSuccessfulTransaction(reference);
  if (!tx || tx.metadata?.kind !== "session") return null;

  const hours = Number(tx.metadata?.hours);
  if (!(site.sessions.hours as readonly number[]).includes(hours)) return null;
  if (tx.currency !== site.sessions.currency || Number(tx.amount) !== Math.round(sessionPrice(hours) * 100)) return null;

  return { hours, email: String(tx.customer?.email ?? ""), reference };
}
