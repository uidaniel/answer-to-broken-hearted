/**
 * PRODUCTS (eBooks): add, remove or edit them here.
 * Put each eBook's PDF in /ebooks named <id>.pdf. Buyers get it right after paying.
 *
 *   id          unique short id, no spaces (also used in links: /shop?product=id)
 *   price       whole units of your currency (5000 = ₦5,000)
 *   image       optional cover image in /public, e.g. "/covers/healing.jpg".
 *               Leave empty to show the generated cover artwork.
 *   scene       colour of the generated artwork: "heart", "conflict" or "faith"
 *   featured    true = also shown on the home page (first 3 are used)
 *
 * The eBooks below are SAMPLES. Replace them with your real ones.
 * Prices here are also what the server checks payments against.
 */
export type Scene = "heart" | "conflict" | "faith";

export type Product = {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  image?: string;
  scene: Scene;
  featured?: boolean;
  short: string;
  description: string;
  includes: string[];
};

export const products: Product[] = [
  {
    id: "healing-the-broken-heart",
    name: "Healing the Broken Heart",
    category: "Broken heart",
    type: "eBook",
    price: 5000,
    scene: "heart",
    featured: true,
    short: "A gentle guide through sadness, hurt and disappointment, towards restored joy.",
    description:
      "When your heart has been broken, the pain can feel endless. This book walks with you step by step through the sorrow, the questions and the healing, and shows you that there is an answer, and that joy can return.",
    includes: ["12 chapters on grief, hurt and disappointment", "Reflection questions after every chapter", "Instant PDF download"],
  },
  {
    id: "30-day-peace-journal",
    name: "30-Day Peace Journal",
    category: "Broken heart",
    type: "eBook",
    price: 7500,
    scene: "faith",
    featured: true,
    short: "Daily prompts to calm a worried mind and write your way to peace.",
    description:
      "A guided journal with thirty days of prompts, scriptures and exercises to help you process worry, release hurt and rebuild inner peace, one page at a time.",
    includes: ["30 guided daily prompts", "Space for prayer and reflection", "Printable PDF, download instantly"],
  },
  {
    id: "resolving-family-conflict",
    name: "Resolving Family Conflict",
    category: "Conflict resolution",
    type: "eBook",
    price: 6000,
    scene: "conflict",
    featured: true,
    short: "Practical tools to restore understanding between spouses, parents and children.",
    description:
      "Family conflict cuts deep. This eBook gives you conversation guides, listening exercises and reconciliation steps you can use at home to rebuild trust and understanding.",
    includes: ["Step-by-step reconciliation framework", "Conversation scripts for hard talks", "Instant PDF download"],
  },
  {
    id: "answers-for-the-questioning-heart",
    name: "Answers for the Questioning Heart",
    category: "Faith",
    type: "eBook",
    price: 5500,
    scene: "faith",
    short: "Honest answers to the faith questions that trouble you most.",
    description:
      "Are you confused about your faith? This book takes on the bothering questions many are afraid to ask, and answers them with clarity, compassion and truth.",
    includes: ["30 common faith questions answered", "Scripture references for further study", "Instant PDF download"],
  },
  {
    id: "conflict-resolution-for-business",
    name: "Conflict Resolution for Business Owners",
    category: "Conflict resolution",
    type: "eBook",
    price: 15000,
    scene: "conflict",
    short: "Resolve disputes with partners, staff and clients before they cost you.",
    description:
      "A practical guide for business owners and leaders. Learn to spot conflict early, mediate between team members and restore working relationships with partners and clients.",
    includes: ["8 practical chapters", "Mediation checklist for your team", "Instant PDF download"],
  },
  {
    id: "heart-restoration-devotional",
    name: "Heart Restoration Devotional",
    category: "Faith",
    type: "eBook",
    price: 4000,
    scene: "heart",
    short: "Short daily readings for the hurting heart.",
    description:
      "Forty short devotional readings written for anyone who is hurting, disappointed or emotionally drained. A few minutes each day to find comfort and strength.",
    includes: ["40 daily readings", "Prayer at the end of each reading", "Instant PDF download"],
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
