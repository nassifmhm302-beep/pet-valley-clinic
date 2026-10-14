import { db } from "@/db";
import { settings, branches } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    if (!rows.length) return fallback;
    return rows[0].value as T;
  } catch {
    return fallback;
  }
}

export async function getAllSettings() {
  const rows = await db.select().from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, unknown>;
}

export async function getActiveBranches() {
  return db
    .select()
    .from(branches)
    .where(eq(branches.isActive, true))
    .orderBy(asc(branches.sortOrder));
}

export type SiteContact = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  instagram: string;
  facebook: string;
  hoursText: string;
};

export type HeroContent = {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  imageUrl: string;
  showHomeVisitCta: boolean;
};

export type TopBarContent = {
  locationText: string;
  hoursText: string;
  promoText: string;
  trackOrderEnabled: boolean;
  whatsapp: string;
};
