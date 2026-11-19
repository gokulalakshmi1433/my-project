# Pegasus 43 mobile product page

A single-column product page for 375px phones, built with Next.js (App Router) and Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Add `?slow=1` to hold images for 1.5s and see the loading skeletons.

## Layout rules

- 375px column, 16px side padding (343px content width).
- First screen is 487px tall, so heading, description, price and rating, photo and sizes fit on an iPhone SE without scrolling.
- Product photo is a fixed 343×257 box; its skeleton is the same size, so nothing shifts while it loads.
- Size buttons are 56×48 in every state. In stock = rest state, sold out = disabled state (greyed and crossed through). A 14px line under each shows "Sold out" or "Only N left".

## Data

- `Pegasus 43 size and stock list.json`: sizes, stock, price, style code (source of truth).
- `data/content.json`: placeholder copy, ratings, reviews and image paths until real content is supplied.
- `public/images/`: placeholder images.
