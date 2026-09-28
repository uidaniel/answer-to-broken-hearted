/**
 * Site-wide settings. Keys and links come from environment variables
 * (see .env.example); everything else can be edited here directly.
 */
export const site = {
  name: "Answer To The Broken Hearted",
  tagline: "There is an answer to your question.",
  contactEmail: "hello@answertobrokenhearted.com",
  contactPhone: "+234 000 000 0000",

  // eBook prices. Currency your Paystack account accepts: "NGN", "GHS", "ZAR", "KES" or "USD".
  currency: "NGN",
  currencySymbol: "₦",

  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",

  // Paid sessions: price per hour and the lengths people can book.
  // USD payments must be enabled on your Paystack account (Settings → Preferences).
  sessions: {
    currency: "USD",
    currencySymbol: "$",
    ratePerHour: 10,
    hours: [1, 2, 3] as const,
  },

  // One Calendly event type per session length (a 1-hour, a 2-hour and a 3-hour event).
  calendly: {
    1: process.env.NEXT_PUBLIC_CALENDLY_1H_URL ?? "",
    2: process.env.NEXT_PUBLIC_CALENDLY_2H_URL ?? "",
    3: process.env.NEXT_PUBLIC_CALENDLY_3H_URL ?? "",
  } as Record<number, string>,
};

export type SessionKey = "brokenHeart" | "conflict" | "faith";

export const sessionTopics: Record<SessionKey, string> = {
  brokenHeart: "Broken heart",
  conflict: "Conflict resolution",
  faith: "Faith conversation",
};

export function formatPrice(amount: number) {
  return site.currencySymbol + amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function formatSessionPrice(amount: number) {
  return site.sessions.currencySymbol + amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function sessionPrice(hours: number) {
  return hours * site.sessions.ratePerHour;
}
