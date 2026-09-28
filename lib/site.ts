/**
 * Site-wide settings. Keys and links come from environment variables
 * (see .env.example); everything else can be edited here directly.
 */
export const site = {
  name: "Answer to Broken Hearted",
  tagline: "There is an answer to your question.",
  contactEmail: "hello@answertobrokenhearted.com",
  contactPhone: "+234 000 000 0000",

  // Currency your Paystack account accepts: "NGN", "GHS", "ZAR", "KES" or "USD".
  currency: "NGN",
  currencySymbol: "₦",

  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",

  calendly: {
    main: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
    brokenHeart: process.env.NEXT_PUBLIC_CALENDLY_BROKEN_HEART_URL ?? "",
    conflict: process.env.NEXT_PUBLIC_CALENDLY_CONFLICT_URL ?? "",
    faith: process.env.NEXT_PUBLIC_CALENDLY_FAITH_URL ?? "",
  },
};

export type SessionKey = "brokenHeart" | "conflict" | "faith";

export function formatPrice(amount: number) {
  return site.currencySymbol + amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
