"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode, type RefObject } from "react";
import { sizes, unitNames, type SizeOption, type SizeUnit } from "@/lib/product";

type PurchaseState = {
  unit: SizeUnit;
  setUnit: (unit: SizeUnit) => void;
  selected: SizeOption | null;
  select: (size: SizeOption) => void;
  showSizeError: boolean;
  /** Returns the selected size, or scrolls back to the sizes and shows the error. */
  requireSize: () => SizeOption | null;
  sizesRef: RefObject<HTMLDivElement | null>;
  sizeLabel: (size: SizeOption) => string;
  toast: (message: string) => void;
  toastMessage: string;
};

const PurchaseContext = createContext<PurchaseState | null>(null);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<SizeUnit>("us_men");
  const [selected, setSelected] = useState<SizeOption | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const sizesRef = useRef<HTMLDivElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const select = useCallback((size: SizeOption) => {
    if (size.status === "sold_out") return;
    setSelected(size);
    setShowSizeError(false);
  }, []);

  const toast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(() => setToastMessage(""), 2800);
  }, []);

  const sizeLabel = useCallback((size: SizeOption) => `${unitNames[unit]} ${size.labels[unit]}`, [unit]);

  const requireSize = useCallback(() => {
    if (selected) return selected;
    setShowSizeError(true);
    const block = sizesRef.current;
    if (block) {
      block.scrollIntoView({ behavior: "smooth", block: "center" });
      const firstAvailable = block.querySelector<HTMLButtonElement>('button[data-size][aria-disabled="false"]');
      firstAvailable?.focus({ preventScroll: true });
    }
    return null;
  }, [selected]);

  return (
    <PurchaseContext.Provider
      value={{
        unit,
        setUnit,
        selected,
        select,
        showSizeError,
        requireSize,
        sizesRef,
        sizeLabel,
        toast,
        toastMessage,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error("usePurchase must be used inside <PurchaseProvider>");
  return ctx;
}

export { sizes };
