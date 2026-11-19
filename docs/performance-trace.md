# Performance trace notes

Trace of the Pegasus 43 product page on a throttled phone, what was slow, what moved, and what was changed.

## Test setup

| Setting | Value |
|---|---|
| Build | Production (`npm run build` + `next start -p 3100`). Dev mode was only used to compare. |
| Network | Chrome DevTools "Slow 4G" |
| CPU | 4× slowdown |
| Viewport | 375×812, DPR 3, mobile + touch |
| Cache | Disabled (cold load) |
| Tools | Chrome DevTools performance trace and insights, plus in-page `PerformanceObserver` for `longtask`, `layout-shift`, `long-animation-frame` and `largest-contentful-paint` |

Scroll frame rate was measured by scrolling with `requestAnimationFrame` steps and timing each frame: the page top → bottom → top over 6 s, then each horizontal rail end to end over 1.5 s.

## Results

| Metric | Before | After |
|---|---|---|
| TTFB | 563 ms | 563 ms |
| First Contentful Paint | 1,312 ms | **660 ms** |
| Largest Contentful Paint (main photo `pdp-1.svg`) | 2,569 ms | **1,192 ms** |
| LCP render delay | 1,418 ms | **59 ms** |
| Cumulative Layout Shift (load) | 0.00 | 0.00 |
| Long tasks > 50 ms | 0 | 0 |
| Longest animation frame | 65 ms (hydration, 0 ms blocking) | — |
| Page scroll | 60 fps, worst frame 18 ms, 0 dropped | unchanged |
| Rails (gallery, sizes, customer photos, related) | 60 fps each, worst frame 18 ms | unchanged |
| JavaScript transferred | 138 KB (gzipped) | unchanged |
| DevTools insights flagged | LCP breakdown, Render-blocking, Network dependency tree, DOM size, Forced reflow (37 ms, unattributed), Legacy JavaScript | LCP breakdown, Legacy JavaScript |

### LCP breakdown, before

| Part | Time | Share |
|---|---|---|
| TTFB | 563 ms | 22% |
| Resource load delay | 11 ms | 0.4% |
| Resource load duration | 575 ms | 22% |
| **Element render delay** | **1,418 ms** | **55%** |

The photo had finished downloading at ~1,150 ms but was not shown until ~2,570 ms.

## Size grid position

The size grid (`ul[aria-labelledby=size-label]`) was measured on load and after each interaction. In the production build it stayed at **top 421 px, height 66 px** every time (top 461 px after the size-system row was added, see fix 4):

- Load (sampled every 16 ms)
- Buy now without a size (error message)
- Switch size system to EU, then US W
- Select a size
- Add to cart (toast)
- Open a spec section
- View more reviews
- Size guide link

Nothing above the grid can change height:

| Element | File | Height rule |
|---|---|---|
| Heading | `app/page.tsx:25` | `truncate leading-6` → 1 line, 24 px |
| Description | `app/page.tsx:28` | `line-clamp-2 h-10` → 40 px |
| Price + rating row | `app/page.tsx:32` | `h-6` → 24 px |
| Photo gallery | `components/gallery.tsx` | fixed 343×257 box |
| Size label row | `components/size-picker.tsx` | `h-5` → 20 px |
| Size-system row (US M / US W / EU) | `components/size-picker.tsx` | `mt-2 h-8` → 8 + 32 px |

### Price and font

- The price is formatted on the server at build time, so `$140` is in the HTML. Sampled every 10 ms for 6 s, it appeared once (top 88 px, width 44 px) and never changed.
- No web font is loaded: 0 font requests, no `@font-face`, no `next/font`. The page uses the system stack in `app/globals.css:5` (`-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif`), so there is no font swap to shift text.
- If a brand web font is added later, load it with `next/font` and keep the system stack as the fallback.

### Dev mode only

After a reload in `next dev`, the page sometimes scrolled by itself (from the previous scroll position back to the top), which made the grid look like it slid. This did not happen in the production build, and no app code calls a scroll at that moment; it looks like browser scroll restoration. Not fully pinned down.

## Issues found and fixes

### 1. Photos hidden until JavaScript ran (main slowdown)

- **Where:** `components/skeleton-image.tsx`
- **Cause:** every image started at `opacity-0`. It became visible only after React hydrated (138 KB of JS on Slow 4G), set `held` to false in an effect, saw the image load, and then faded in over 300 ms. This applied to the main photo, customer photos and related products.
- **Fix:** images are visible in the server HTML (`held` starts `false`). The image has `z-[1]` so it paints above the shimmer; the shimmer only shows until the photo arrives. `?slow` still hides photos, but only after hydration (they show briefly, then hide for 1.5 s).
- **Result:** LCP render delay 1,418 ms → 59 ms; LCP 2,569 ms → 1,192 ms.

### 2. Render-blocking stylesheet

- **Where:** `next.config.ts`
- **Cause:** the page could not paint until a separate 4.9 KB CSS file arrived (689 ms request on Slow 4G).
- **Fix:** `experimental.inlineCss: true`, which inlines the CSS into the HTML (recommended in the Next 16 docs for small Tailwind CSS). Experimental, production builds only.
- **Result:** FCP 1,312 ms → 660 ms.

### 3. Size-system switch slid sideways

- **Where:** `components/size-picker.tsx`
- **Cause:** the label row used `justify-between`. Swapping "Select size" (73 px) for "Please select a size" (115 px) pushed the US M / US W / EU group ~25 px right (layout shift 0.0002 each time).
- **Fix:** the row is a grid, `grid-cols-[116px_1fr_auto]` with `whitespace-nowrap`; the switch is centred in the middle column.
- **Result:** switch stays at x = 151 px in both states; 0 layout shifts.
- **Replaced by fix 4.**

### 4. Size-system switch moved to its own row

- **Where:** `components/size-picker.tsx`
- **Why:** requested layout change. The switch now lines up with the size buttons instead of sitting in the middle of the label row.
- **Change:** the label row is back to `flex justify-between` with only "Select size" and "Size guide". US M / US W / EU are a new `h-8` row below it; each button is `w-14` (56 px) with `gap-2` (8 px), the same column and gap as the size buttons.
- **Result:** the buttons are 56×32 px at x = 16, 80 and 144 px, exactly above the first three sizes. The size grid is 40 px lower (top 461 px, first screen 527 px) and still moves 0 px on load, size error, EU, US W and size select. "Size guide" stays at x = 292 px when the error shows.
- **Note:** a first attempt with `grid-cols-[1fr_auto_1fr]` made the error wrap onto two lines over the size buttons. Caught in a screenshot and replaced.

## Budget check

Limits are in [`speed-budget.json`](../speed-budget.json). Checked on the production build with the size-system row (fix 4).

| Budget | Limit | Measured | Result |
|---|---|---|---|
| `performance_score_min` | 90 | **99** | Pass |
| `size_grid_shift_px_max` | 0 px | 0 px | Pass |
| `size_button_min_px` | 48 px | 56×48 px (all 26 size buttons) | Pass |

Lighthouse 12.8.2, mobile, simulated throttling (150 ms RTT, ~1.6 Mbps, CPU 4×):

| Metric | Value | Score |
|---|---|---|
| First Contentful Paint | 0.8 s | 1.00 |
| Largest Contentful Paint | 2.2 s | 0.94 |
| Total Blocking Time | 10 ms | 1.00 |
| Cumulative Layout Shift | 0 | 1.00 |
| Speed Index | 1.5 s | 1.00 |

Lighthouse's LCP (2.2 s) is higher than the DevTools trace (1.2 s), likely because Lighthouse estimates slow-network timings from a fast run instead of throttling the page live. Both are under the 2.5 s "good" limit.

The US M / US W / EU buttons are 56×32 px. `size_button_min_px` covers the size buttons only.

## Not fixed

- **Legacy JavaScript:** DevTools reports ~14 KB of polyfills for old browsers. No measured effect on FCP or LCP.
- **Size button labels:** the numbers re-centre when switching US M / US W / EU. That is the label text changing, not the buttons moving.

## How to repeat

1. `npm run build && npx next start -p 3100`
2. In Chrome DevTools: Performance panel, Slow 4G, CPU 4× slowdown, 375×812 mobile viewport, disable cache.
3. Record a reload. Check LCP breakdown, Render-blocking and Layout shifts.
4. Scroll the page and each rail with the FPS meter on (Rendering → Frame Rendering Stats).
5. Tap Buy now with no size selected and confirm the grid and size-system switch do not move.
6. Lighthouse score (Node via nvm):
   ```bash
   npx -y lighthouse@12.8.2 http://localhost:3100/ --only-categories=performance --form-factor=mobile --chrome-flags="--headless=new" --quiet --output=json --output-path=/tmp/lh.json
   node -e 'console.log(Math.round(require("/tmp/lh.json").categories.performance.score*100))'
   ```
