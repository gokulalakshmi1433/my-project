"use client";

import { useState } from "react";
import { Stars } from "@/components/stars";
import { formatDate } from "@/lib/product";

type Review = { stars: number; title: string; text: string; name: string; date: string };
type Rating = { average: number; count: number; distribution: Record<string, number> };

const INITIAL = 5;

/** 2.5 Summary, five review cards, then "View more reviews" (343×48). */
export function Reviews({ rating, reviews }: { rating: Rating; reviews: Review[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, INITIAL);
  const max = Math.max(...Object.values(rating.distribution));

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="mt-8 scroll-mt-4">
      <h2 id="reviews-heading" className="text-[16px] leading-6 font-semibold">
        Reviews
      </h2>

      <div className="mt-3 flex items-center gap-6">
        <div className="shrink-0">
          <p className="text-[24px] leading-8 font-bold">{rating.average.toFixed(1)}</p>
          <Stars value={rating.average} size={16} />
          <p className="mt-1 text-[12px] leading-4 text-muted">{rating.count} reviews</p>
        </div>
        <ul className="flex-1 space-y-1" aria-label="Rating breakdown">
          {[5, 4, 3, 2, 1].map((star) => {
            const n = rating.distribution[String(star)] ?? 0;
            return (
              <li key={star} className="flex items-center gap-2 text-[12px] leading-4">
                <span className="w-3 text-right" aria-hidden="true">
                  {star}
                </span>
                <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface" aria-hidden="true">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-ink" style={{ width: `${(n / max) * 100}%` }} />
                </span>
                <span className="w-6 text-right text-muted" aria-hidden="true">
                  {n}
                </span>
                <span className="sr-only">
                  {star} stars: {n} reviews
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <ol className="mt-2 divide-y divide-line">
        {visible.map((r) => (
          <li key={`${r.name}-${r.date}`} className="py-4">
            <Stars value={r.stars} size={14} />
            <span className="sr-only">{r.stars} out of 5 stars</span>
            <h3 className="mt-1 text-[14px] leading-5 font-semibold">{r.title}</h3>
            <p className="mt-1 line-clamp-3 text-[14px] leading-5">{r.text}</p>
            <p className="mt-2 text-[12px] leading-4 text-muted">
              {r.name} · {formatDate(r.date)}
            </p>
          </li>
        ))}
      </ol>

      {!showAll && reviews.length > INITIAL && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-2 h-12 w-full rounded-full border border-ink bg-white text-[14px] font-semibold active:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          View more reviews
        </button>
      )}
    </section>
  );
}
