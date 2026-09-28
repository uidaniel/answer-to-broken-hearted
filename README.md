# Answer To The Broken Hearted

Website for Answer To The Broken Hearted ([answertothebrokenhearted.com.ng](https://answertothebrokenhearted.com.ng)), built with Next.js (App Router, TypeScript).

- **Home** (`/`): mission, issues to address, who we serve, how it works
- **Book a session** (`/book`): paid sessions ($10/hour, 1–3 hours), paid with Paystack, then booked on Calendly

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev                  # http://localhost:3000
```

## Settings

| What | Where |
| --- | --- |
| Paystack keys | `.env.local`: `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` |
| Calendly links | `.env.local`: `NEXT_PUBLIC_CALENDLY_1H_URL`, `_2H_URL`, `_3H_URL` (one event type per session length) |
| Session price and lengths | `lib/site.ts` → `sessions` ($10/hour, 1–3 hours, USD) |
| Email, phone, site address | `lib/site.ts` |
| Logo files | `public/brand/` (SVG and square PNGs) |
| Site photos | `public/images/` (CC0 / public-domain photos from StockSnap, free for commercial use) |
| Colours, fonts, spacing | `app/globals.css` (colour tokens at the top) |

## How paid sessions work

1. The visitor picks a topic (broken heart, conflict, faith) and a length: 1, 2 or 3 hours at $10/hour.
2. They enter name, email, phone, country and what they want to talk about, then pay with Paystack (USD).
3. `/api/paystack/verify-session` confirms with Paystack that the payment succeeded for exactly
   $10 × hours. Only then does the Calendly calendar appear.
4. The calendar is the Calendly event for that length, with name and email already filled in.
   They pick one of your free slots and Calendly emails the confirmation.

**Calendly setup:** create three event types (60, 120 and 180 minutes) and put their links in
`.env.local`. In each event type, add these invitee questions **in this order** so they get
pre-filled: 1. Phone, 2. Country, 3. What would you like to talk about?, 4. Payment reference.

**Paystack setup:** USD payments must be enabled on your Paystack account. Note that a Calendly
link is public, so someone who finds it could book without paying. The payment reference in
question 4 lets you check each booking against your Paystack dashboard.

Test with `pk_test_` / `sk_test_` keys and Paystack's test cards first, then switch to live keys.

## Deploy

The easiest route is [Vercel](https://vercel.com): import the project and add the same
environment variables from `.env.local` in Project Settings → Environment Variables.
Any Node.js host that runs `npm run build && npm start` also works.
