/** Five stars filled to `value` (0–5). Decorative: callers provide the text equivalent. */
export function Stars({ value, size }: { value: number; size: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = "★★★★★";
  return (
    <span
      className="relative inline-block shrink-0 align-middle leading-none tracking-[1px]"
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      <span className="text-line">{row}</span>
      <span className="absolute inset-0 overflow-hidden whitespace-nowrap text-ink" style={{ width: `${pct}%` }}>
        {row}
      </span>
    </span>
  );
}
