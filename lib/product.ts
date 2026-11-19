// Stock source: snapshot of 8 December 2026. The earlier list is kept at "/Pegasus 43 size and stock list.json".
import stockRows from "@/data/Pegasus Size and Stock Snapshot, 8 December 2026.json";
import content from "@/data/content.json";

export type StockStatus = "in_stock" | "low_stock" | "sold_out";
export type SizeUnit = "us_men" | "us_women" | "eu";

export type SizeOption = {
  sku: string;
  order: number;
  labels: Record<SizeUnit, string>;
  status: StockStatus;
  quantity: number;
};

type StockRow = (typeof stockRows)[number];

const formatNumber = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

const sorted: StockRow[] = [...stockRows].sort((a, b) => a.display_order - b.display_order);
const first = sorted[0];
const last = sorted[sorted.length - 1];

export const sizes: SizeOption[] = sorted.map((row) => ({
  sku: row.sku,
  order: row.display_order,
  labels: {
    us_men: formatNumber(row.size_us_men),
    us_women: formatNumber(row.size_us_women),
    eu: row.size_eu,
  },
  // Trust the stock count over the label if they ever disagree.
  status: !row.in_stock || row.stock_quantity <= 0 ? "sold_out" : (row.stock_status as StockStatus),
  quantity: row.stock_quantity,
}));

export const product = {
  name: first.product_name,
  colorway: first.colorway,
  styleCode: first.style_code,
  price: first.price,
  launchDate: first.launch_date,
  sizeRange: `M ${formatNumber(first.size_us_men)}–${formatNumber(last.size_us_men)} / W ${formatNumber(
    first.size_us_women,
  )}–${formatNumber(last.size_us_women)} / EU ${first.size_eu}–${last.size_eu}`,
};

export const unitNames: Record<SizeUnit, string> = { us_men: "US M", us_women: "US W", eu: "EU" };

export const formatPrice = (usd: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(usd);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

export { content };
