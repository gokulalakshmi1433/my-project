# Prompt notes

The requests made to Claude Code during the performance pass, and what was done for each. Read with [performance-trace.md](performance-trace.md).

## 1. Run the project

> npm run dev / can you run the my project repo

- `npm` was not found: Node.js was not installed.
- Installed nvm and Node LTS (v26.13.1, npm 11.20.0). Next.js 16 needs Node ≥ 20.9.
- `npm install`, then `npm run dev` → http://localhost:3000.

## 2. Trace the page on a slow phone and fix what pushes the size grid

> Check the speed on a slow 4G network with the CPU throttled 4×. Check frame rate, page loading and scroll rate, which tasks are running late, and which elements cause the lag. Give a summary list. Trace everything and fix the issues pushing the size grid down.

> Give the list of the elements that push the grid, slow it down, and their causes.

- Built for production and traced on Slow 4G + 4× CPU at 375×812.
- Measured load (FCP, LCP, CLS), long tasks, long animation frames, page and rail scroll fps, and the size grid position through 8 interactions.
- Found the size grid does not move in production; the main slowdown was photos hidden until JavaScript ran.
- Fixed: photos visible from the HTML, CSS inlined, size-system switch no longer slides when the error shows.
- Details and numbers: [performance-trace.md](performance-trace.md).

## 3. Price and web font

> Did you check the price and the web font?

- No web font is loaded; the page uses system fonts. 0 font requests.
- The price is in the server HTML and never changed position, width or text during load.

> How is the price block kept from moving, and how does the price font load? Show me the lines. Look for a fixed height or min-height on the price block, and a font setup with a fallback font (font-display or next/font).

- Price row: `app/page.tsx:32`, `h-6` (fixed 24 px height, not `min-height`); price text `leading-6` at line 33.
- Font: `app/globals.css:5` system stack with fallbacks, applied to `body` at line 35. No `font-display` or `next/font`, because there is no web font to download.

## 4. Save the notes

> Add the trace notes and prompt notes in the repo.

- Added `docs/performance-trace.md` and `docs/prompt-notes.md`.

## 5. Speed budget and size-system row

> performance_score_min -> 90 to 100 / size_grid_shift_px_max -> 0 / size_button_min_px -> 48
> add speed-budget.json file using the above values

- Added `speed-budget.json` with the three limits and the test conditions.
- Lighthouse mobile score: 99. Grid shift: 0 px. Size buttons: 56×48 px. All pass.

> US M / US W / EU buttons can be on a new line, aligned with the sizes, instead of in the centre of the row.

- Moved the switch to its own 32 px row. Each button uses the size buttons' 56 px column and 8 px gap, so they line up with the first three sizes.
- Size grid is 40 px lower (first screen 527 px) and still moves 0 px.

## 6. Stock snapshot, Vercel and live test

> Add the Pegasus size and stock snapshot, 8 December 2026 document. Link the repo to Vercel. Run the live Lighthouse test on the mobile URL (90+). Screenshots of the sizes being tapped, with notes.

- Added the snapshot as `data/Pegasus Size and Stock Snapshot, 8 December 2026.json` and switched the page to it (PR #3).
- The repo was imported into Vercel by the owner: https://my-project-sable-seven-91.vercel.app/
- Live Lighthouse mobile score: 99. Seven size-tap screenshots and notes in [live-size-tap-test.md](live-size-tap-test.md).

## Prompts to reuse

Short versions of the requests above, for the next performance pass:

- *Trace the production build at 375×812 on Slow 4G with 4× CPU throttling. Report FCP, LCP with its breakdown, CLS with the elements that shifted, long tasks, and page and rail scroll fps.*
- *Track the size grid's position on load and after every interaction (size error, size system switch, size select, add to cart, spec open, more reviews, size guide). List anything that moves it and why.*
- *Check the price row and fonts: is the price in the server HTML, does its row have a fixed height, and are any web fonts loaded with a fallback?*
- *Fix what you find, rebuild, re-trace with the same settings, and give a before/after table.*
- *Check the build against `speed-budget.json` (Lighthouse mobile score, size grid shift, size button size) and report pass/fail.*
