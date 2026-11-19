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
  const [held, setHeld] = useState(true);

  useEffect(() => {
    const slow = new URLSearchParams(window.location.search).has("slow");
    const t = setTimeout(() => setHeld(false), slow ? SLOW_MS : 0);
    return () => clearTimeout(t);
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
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
