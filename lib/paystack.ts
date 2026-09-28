import "server-only";
import { getProduct, type Product } from "./products";
import { site } from "./site";

export type VerifiedPurchase = { product: Product; email: string; reference: string };

/**
 * Asks Paystack (with the SECRET key) whether `reference` is a successful payment
 * for one of our eBooks, at that eBook's full price, in our currency.
 * Returns the purchase if so, otherwise null.
 */
export async function verifyPurchase(reference: string): Promise<VerifiedPurchase | null> {
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

  const product = getProduct(String(tx.metadata?.product_id ?? ""));
  if (!product) return null;
  if (tx.currency !== site.currency || Number(tx.amount) !== Math.round(product.price * 100)) return null;

  return { product, email: String(tx.customer?.email ?? ""), reference };
}
