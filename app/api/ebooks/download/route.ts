import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyPurchase } from "@/lib/paystack";
import { site } from "@/lib/site";

/**
 * Sends the purchased eBook. The PDFs live in /ebooks (NOT /public), so the only way
 * to get one is with the reference of a verified Paystack payment for that eBook.
 */
export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference") ?? "";

  let purchase;
  try {
    purchase = await verifyPurchase(reference);
  } catch {
    return text("Downloads are not set up yet. Please contact us and we will send your eBook.", 500);
  }
  if (!purchase) return text("We could not find a completed payment for this download link.", 403);

  const file = path.join(process.cwd(), "ebooks", `${purchase.product.id}.pdf`);
  try {
    const pdf = await readFile(file);
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${purchase.product.id}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return text(
      `Thank you for your purchase! Your eBook is being prepared and will be sent to ${purchase.email}. ` +
        `Questions? Email ${site.contactEmail} with reference ${reference}.`,
      404
    );
  }
}

function text(message: string, status: number) {
  return new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
