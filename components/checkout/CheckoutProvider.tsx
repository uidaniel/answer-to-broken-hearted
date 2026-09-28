"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

type CheckoutContextValue = {
  product: Product | null;
  isOpen: boolean;
  buy: (product: Product) => void;
  close: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

/** Each purchase is a single eBook, so "checkout" is just: which product, and is the panel open. */
export default function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("locked", isOpen);
  }, [isOpen]);

  const buy = useCallback((p: Product) => {
    setProduct(p);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ product, isOpen, buy, close }), [product, isOpen, buy, close]);
  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside <CheckoutProvider>");
  return ctx;
}
