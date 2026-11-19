"use client";

import { useEffect, useRef, useState } from "react";
import { usePurchase } from "@/components/purchase-context";

const primary =
  "h-[52px] w-full rounded-full bg-ink text-[16px] font-semibold text-white active:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const outline =
  "h-[52px] w-full rounded-full border border-ink bg-white text-[16px] font-semibold text-ink active:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

function useBuyActions(productName: string) {
  const { requireSize, sizeLabel, toast } = usePurchase();
  return {
    buy: () => {
      const size = requireSize();
      if (size) toast(`Checkout for ${productName}, ${sizeLabel(size)} is not connected yet`);
    },
    addToCart: () => {
      const size = requireSize();
      if (size) toast(`Added ${productName}, ${sizeLabel(size)} to cart`);
    },
  };
}

/** 2.2 Buy now (343×52) with Add to cart (343×52) 8px below, plus the optional sticky bar. */
export function BuyButtons({ productName }: { productName: string }) {
  const { buy, addToCart } = useBuyActions(productName);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    // Show the sticky bar only once the main button has scrolled away above the screen.
    const io = new IntersectionObserver(([entry]) => {
      setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={ctaRef} id="cta" className="mt-8 flex flex-col gap-2">
        <button type="button" className={primary} onClick={buy}>
          Buy now
        </button>
        <button type="button" className={outline} onClick={addToCart}>
          Add to cart
        </button>
      </div>

      <div
        className={`fixed bottom-0 left-1/2 z-20 w-full max-w-[375px] -translate-x-1/2 border-t border-line bg-white px-4 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] transition-transform duration-200 motion-reduce:transition-none ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showSticky}
        inert={!showSticky}
      >
        <button type="button" className={primary} onClick={buy}>
          Buy now
        </button>
      </div>
    </>
  );
}

export function Toast() {
  const { toastMessage } = usePurchase();
  return (
    <p
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-24 left-1/2 z-30 w-[343px] -translate-x-1/2 rounded-lg bg-ink px-4 py-3 text-center text-[14px] leading-5 text-white transition-opacity ${
        toastMessage ? "opacity-100" : "opacity-0"
      }`}
    >
      {toastMessage}
    </p>
  );
}

export function QuickAdd({ name }: { name: string }) {
  const { toast } = usePurchase();
  return (
    <button
      type="button"
      onClick={() => toast(`Added ${name} to cart`)}
      aria-label={`Add ${name} to cart`}
      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-[22px] leading-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <span aria-hidden="true">+</span>
    </button>
  );
}

export function PlayButton({ user }: { user: string }) {
  const { toast } = usePurchase();
  return (
    <button
      type="button"
      onClick={() => toast("Video playback is not connected yet")}
      aria-label={`Play video by ${user}`}
      className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path d="M5 3.5v11l9-5.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
