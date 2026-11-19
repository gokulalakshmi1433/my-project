import { BuyButtons, PlayButton, QuickAdd, Toast } from "@/components/buy-buttons";
import { Gallery } from "@/components/gallery";
import { PurchaseProvider } from "@/components/purchase-context";
import { Reviews } from "@/components/reviews";
import { SizePicker } from "@/components/size-picker";
import { SkeletonImage } from "@/components/skeleton-image";
import { Stars } from "@/components/stars";
import { content, formatPrice, product } from "@/lib/product";

const h2 = "text-[16px] leading-6 font-semibold";

export default function ProductPage() {
  const specs = content.specs.map((s) =>
    s.body === "__FROM_STOCK__"
      ? { ...s, body: `Style ${product.styleCode} · ${product.colorway} · Sizes ${product.sizeRange}` }
      : s,
  );

  return (
    <PurchaseProvider>
      {/* 375px column, 16px side padding → 343px content width */}
      <main className="mx-auto min-h-dvh w-full max-w-[375px] overflow-x-clip bg-white px-4 pt-3 pb-16">
        {/* ── 1. Above the fold: 527px ── */}
        <section aria-label="Product summary">
          {/* 1.1 Heading: 18px semibold / 24px */}
          <h1 className="truncate text-[18px] leading-6 font-semibold">{product.name}</h1>

          {/* 1.2 Short description: 14px / 20px, 2 lines max, height fixed at 40px */}
          <p className="mt-1 line-clamp-2 h-10 text-[14px] leading-5 text-muted">{content.description}</p>

          {/* 1.3 + 1.4 Price and rating, one 24px row */}
          <div className="mt-2 flex h-6 items-center gap-3">
            <p className="text-[18px] leading-6 font-bold">
              <span className="sr-only">Price: </span>
              {formatPrice(product.price)}
            </p>
            <a
              href="#reviews"
              className="hit-44 flex items-center gap-1 text-[14px] leading-5"
              aria-label={`Rated ${content.rating.average} out of 5 from ${content.rating.count} reviews. Go to reviews.`}
            >
              <span aria-hidden="true">★</span>
              <span aria-hidden="true">
                {content.rating.average.toFixed(1)} <span className="text-muted underline">({content.rating.count})</span>
              </span>
            </a>
          </div>

          {/* 1.5 + 1.6 Image 343×257 with same-size skeleton */}
          <Gallery images={content.images} />

          {/* 1.7 – 1.10 Size label and guide, size-system row, size buttons, notes */}
          <SizePicker />
        </section>

        {/* ── 2.1 Benefits ── */}
        <section aria-labelledby="benefits-heading" className="mt-8">
          <h2 id="benefits-heading" className={h2}>
            {content.benefits.heading}
          </h2>
          <ul className="mt-3 space-y-2">
            {content.benefits.items.map((item) => (
              <li
                key={item}
                className="relative pl-4 text-[14px] leading-5 before:absolute before:top-2 before:left-0 before:size-1.5 before:rounded-full before:bg-ink"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── 2.2 Buy now / Add to cart (+ sticky bar) ── */}
        <BuyButtons productName={product.name} />

        {/* ── 2.3 Specs, materials and policies ── */}
        <section aria-label="Specs, materials and policies" className="mt-8 border-t border-line">
          {specs.map((s) => (
            <details key={s.id} id={`spec-${s.id}`} className="group scroll-mt-4 border-b border-line">
              <summary className="flex h-[52px] cursor-pointer list-none items-center justify-between text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
                {s.title}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
                >
                  <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </summary>
              <p className="pb-4 text-[14px] leading-5 text-muted">{s.body}</p>
            </details>
          ))}
        </section>

        {/* ── 2.4 Customer photos and videos ── */}
        <section aria-labelledby="ugc-heading" className="mt-8">
          <h2 id="ugc-heading" className={h2}>
            {content.ugc.heading}
          </h2>
          <ul className="rail mt-3">
            {content.ugc.items.map((item) => (
              <li key={item.src} className="w-[140px] shrink-0 snap-start">
                <div className="relative">
                  <SkeletonImage
                    src={item.src}
                    alt={`${item.video ? "Video" : "Photo"} of the Pegasus 43 shared by ${item.user}`}
                    width={140}
                    height={187}
                    className="rounded-lg"
                  />
                  {item.video && <PlayButton user={item.user} />}
                </div>
                <p className="mt-1 truncate text-[12px] leading-4 text-muted">{item.user}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 2.5 Reviews ── */}
        <Reviews rating={content.rating} reviews={content.reviews} />

        {/* ── 2.6 Related products ── */}
        <section aria-labelledby="related-heading" className="mt-8">
          <h2 id="related-heading" className={h2}>
            {content.related.heading}
          </h2>
          <ul className="rail mt-3">
            {content.related.items.map((item) => (
              <li key={item.name} className="w-[160px] shrink-0 snap-start">
                <SkeletonImage src={item.src} alt="" width={160} height={160} className="rounded-lg" />
                <p className="mt-2 line-clamp-2 h-10 text-[14px] leading-5">{item.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-[14px] leading-5 font-semibold">{formatPrice(item.price)}</p>
                  <QuickAdd name={item.name} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 flex items-center gap-2 text-[12px] leading-4 text-muted">
          <Stars value={content.rating.average} size={12} />
          Sample ratings, reviews and images until real content is supplied.
        </p>
      </main>
      <Toast />
    </PurchaseProvider>
  );
}
