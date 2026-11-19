"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** Fixed box size in px. The skeleton and the photo always use exactly this size. */
  width: number;
  height: number;
  eager?: boolean;
  className?: string;
};

/** Delay used by `?slow` so the client can see the loading placeholder on a fast connection. */
const SLOW_MS = 1500;

export function SkeletonImage({ src, alt, width, height, eager = false, className = "" }: Props) {
  const [imageReady, setImageReady] = useState(false);
  // Visible from the server HTML: the photo must not wait for JavaScript to show.
  // Only the `?slow` demo hides it, and only after hydration.
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("slow")) return;
    const hide = setTimeout(() => setHeld(true), 0);
    const show = setTimeout(() => setHeld(false), SLOW_MS);
    return () => {
      clearTimeout(hide);
      clearTimeout(show);
    };
  }, []);

  // A cached image can finish loading before React hydrates and attaches onLoad.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setImageReady(true);
  }, []);

  const loaded = imageReady && !held;

  return (
    <div
      className={`skeleton shrink-0 ${className}`}
      style={{ width, height }}
      data-loaded={loaded}
      aria-busy={!loaded}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        onLoad={() => setImageReady(true)}
        // z-[1] paints the photo above the shimmer, so the shimmer shows only until the photo arrives.
        className={`absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none ${
          held ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
