import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(services).where(eq(services.isActive, true)).orderBy(services.sortOrder);
  return NextResponse.json({ items: rows });
}
