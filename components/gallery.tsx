"use client";

import { useRef, useState } from "react";
import { SkeletonImage } from "@/components/skeleton-image";

const W = 343;
const H = 257;

export function Gallery({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = trackRef.current;
    if (el) setActive(Math.round(el.scrollLeft / W));
  };

  return (
    // 1.5 + 1.6: fixed 343×257 box. Skeleton and photo share it, so nothing jumps or squeezes.
    <div
      className="relative mt-3 overflow-hidden rounded-lg"
      style={{ width: W, height: H }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Product photos"
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        tabIndex={0}
        className="rail h-full gap-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
        aria-label={`Photo ${active + 1} of ${images.length}. Swipe or use arrow keys for more.`}
      >
        {images.map((img, i) => (
          <div key={img.src} className="snap-start" aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}`}>
            <SkeletonImage src={img.src} alt={img.alt} width={W} height={H} eager={i === 0} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden="true">
        {images.map((img, i) => (
          <span
            key={img.src}
            className={`size-1.5 rounded-full transition-colors ${i === active ? "bg-ink" : "bg-ink/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
