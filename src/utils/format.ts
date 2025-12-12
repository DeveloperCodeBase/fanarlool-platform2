export const formatNumber = (value: number, locale: "fa" | "en", options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", options).format(value);

export const formatPercent = (value: number, locale: "fa" | "en") =>
  formatNumber(value * 100, locale, { maximumFractionDigits: 1 }) + "%";

export const formatDateLabel = (iso: string, locale: "fa" | "en") => {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    month: "short",
    day: "numeric"
  }).format(d);
};
