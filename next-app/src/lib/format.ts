import { CURRENCY } from "./constants";

export function formatPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "";
  return `${num.toLocaleString("ar-JO", { maximumFractionDigits: 2 })} ${CURRENCY}`;
}

export function formatDateAr(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-JO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatTimeAr(time: string): string {
  // time like "14:30:00"
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat("ar-JO", { hour: "numeric", minute: "2-digit" }).format(date);
}

export function discountPercent(price: string | number, compareAt: string | number | null | undefined): number {
  if (!compareAt) return 0;
  const p = Number(price);
  const c = Number(compareAt);
  if (!c || c <= p) return 0;
  return Math.round(((c - p) / c) * 100);
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function generateCode(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const time = Date.now().toString().slice(-5);
  return `${prefix}-${time}${rand}`;
}
