"use client";

import { sizes, usePurchase } from "@/components/purchase-context";
import { unitNames, type SizeOption, type SizeUnit } from "@/lib/product";

const UNITS: SizeUnit[] = ["us_men", "us_women", "eu"];

function stockNote(size: SizeOption) {
  if (size.status === "sold_out") return "Sold out";
  if (size.status === "low_stock") return `Only ${size.quantity} left`;
  return "";
}

export function SizePicker() {
  const { unit, setUnit, selected, select, showSizeError, sizesRef, sizeLabel } = usePurchase();

  const openSizeGuide = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const details = document.getElementById("spec-details");
    if (details instanceof HTMLDetailsElement) {
      e.preventDefault();
      details.open = true;
      details.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={sizesRef}>
      {/* 1.7: 20px row. The error replaces the label so nothing below moves.
          Label on the left, Size guide pinned right, so the wider error text moves nothing. */}
      <div className="mt-3 flex h-5 items-center justify-between whitespace-nowrap">
        {showSizeError ? (
          <p id="size-label" role="alert" className="text-[12px] leading-5 font-semibold text-error">
            Please select a size
          </p>
        ) : (
          <p id="size-label" className="text-[14px] leading-5 font-semibold">
            Select size
          </p>
        )}

        <a
          href="#spec-details"
          onClick={openSizeGuide}
          className="hit-44 text-[14px] leading-5 underline underline-offset-2"
        >
          Size guide
        </a>
      </div>

      {/* Size system: its own 32px row. Each button uses the size buttons' 56px column and 8px gap,
          so US M / US W / EU line up with the first three sizes below. */}
      <div className="mt-2 flex h-8 gap-2" role="group" aria-label="Size system">
        {UNITS.map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            aria-pressed={unit === u}
            className={`hit-44 h-8 w-14 shrink-0 rounded-lg border text-[12px] leading-none ${
              unit === u ? "border-ink bg-ink font-semibold text-white" : "border-line bg-white text-muted hover:border-ink hover:text-ink"
            } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
          >
            {unitNames[u]}
          </button>
        ))}
      </div>

      {/* 1.8–1.10: 48px buttons + 4px gap + 14px note = 66px, the same for every size. */}
      <ul className="rail mt-2 h-[66px] scroll-px-0" aria-labelledby="size-label">
        {sizes.map((size) => {
          const soldOut = size.status === "sold_out";
          const isSelected = selected?.sku === size.sku;
          const note = stockNote(size);
          return (
            <li key={size.sku} className="flex w-14 shrink-0 snap-start flex-col items-center">
              <button
                type="button"
                data-size={size.sku}
                aria-disabled={soldOut}
                aria-pressed={isSelected}
                aria-label={`${sizeLabel(size)}${note ? `, ${note.toLowerCase()}` : ""}`}
                onClick={() => select(size)}
                className={[
                  // Fixed 56×48 in every state. States change colour only, never size.
                  "box-border h-12 w-14 shrink-0 rounded-lg border text-[14px] leading-none",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                  soldOut
                    ? // Disabled state
                      "cursor-not-allowed border-line bg-surface text-ink opacity-40 bg-[linear-gradient(to_top_right,transparent_calc(50%-0.75px),var(--color-muted)_calc(50%-0.75px),var(--color-muted)_calc(50%+0.75px),transparent_calc(50%+0.75px))]"
                    : isSelected
                      ? // Selected state: inset ring so the border never changes the size
                        "border-ink bg-white font-semibold shadow-[inset_0_0_0_1px_var(--color-ink)]"
                      : // Rest state
                        "border-line bg-white hover:border-ink",
                ].join(" ")}
              >
                {size.labels[unit]}
              </button>
              <span
                aria-hidden="true"
                className={`mt-1 h-3.5 text-[12px] leading-[14px] whitespace-nowrap ${
                  soldOut ? "text-muted" : "text-warn"
                }`}
              >
                {note}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
