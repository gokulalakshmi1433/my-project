# Pegasus 43 mobile product page

A single-column product page for 375px phones, built with Next.js (App Router) and Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Add `?slow=1` to hide images for 1.5s after the page loads and see the loading skeletons.

Performance trace results and fixes: [docs/performance-trace.md](docs/performance-trace.md). Notes on the requests behind them: [docs/prompt-notes.md](docs/prompt-notes.md).

## Layout rules

- 375px column, 16px side padding (343px content width).
- First screen is 527px tall, so heading, description, price and rating, photo, size system (US M / US W / EU) and sizes fit on an iPhone SE without scrolling.
- Product photo is a fixed 343×257 box; its skeleton is the same size, so nothing shifts while it loads.
- Size buttons are 56×48 in every state. In stock = rest state, sold out = disabled state (greyed and crossed through). A 14px line under each shows "Sold out" or "Only N left".

## Data

- `Pegasus 43 size and stock list.json`: sizes, stock, price, style code (source of truth).
- `data/content.json`: placeholder copy, ratings, reviews and image paths until real content is supplied.
- `public/images/`: placeholder images.
