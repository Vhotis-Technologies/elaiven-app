/** £186K, £3.4M. Amounts under 1,000 are shown in full. */
export function formatCompact(amount: number, currency: string): string {
  const sign = amount < 0 ? "-" : "";
  const value = Math.abs(amount);

  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const text = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return `${sign}${currency}${text}M`;
  }

  if (value >= 1_000) {
    const thousands = value / 1_000;
    const text =
      thousands >= 100 || thousands % 1 === 0
        ? Math.round(thousands).toString()
        : thousands.toFixed(1);
    return `${sign}${currency}${text}K`;
  }

  return `${sign}${currency}${Math.round(value)}`;
}

/** 9 Nov 2026. `iso` is a calendar date, YYYY-MM-DD. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** £246,200 */
export function formatFull(amount: number, currency: string): string {
  return `${currency}${Math.round(amount).toLocaleString("en-GB")}`;
}

/**
 * Axis tick, with no currency sign. `axisMax` keeps every tick in the same
 * unit, so a £2.5M chart reads 2.5M, 2M, 1.5M rather than mixing in K.
 */
export function formatAxis(amount: number, axisMax = amount): string {
  if (amount <= 0) return "0";

  if (axisMax >= 1_000_000) {
    const millions = amount / 1_000_000;
    const text = Number.isInteger(millions) ? String(millions) : millions.toFixed(1);
    return `${text}M`;
  }

  if (axisMax >= 1_000) {
    const thousands = amount / 1_000;
    const text = Number.isInteger(thousands)
      ? String(thousands)
      : thousands.toFixed(1);
    return `${text}K`;
  }

  return String(Math.round(amount));
}

/** Next clean ceiling above the tallest bar: 1, 2, 2.5, 5, 10 × the magnitude. */
export function axisCeiling(max: number): number {
  if (max <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const steps = [1, 2, 2.5, 5, 10].map((step) => step * magnitude);
  return steps.find((step) => step >= max) ?? magnitude * 10;
}
