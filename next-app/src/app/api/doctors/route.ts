import { NextResponse } from "next/server";
import { db } from "@/db";
import { doctors, doctorServices } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const [rows, links] = await Promise.all([
    db.select().from(doctors).where(eq(doctors.isActive, true)).orderBy(doctors.sortOrder),
    db.select().from(doctorServices),
  ]);
  const withServices = rows.map((d) => ({
    ...d,
    serviceIds: links.filter((l) => l.doctorId === d.id).map((l) => l.serviceId),
  }));
  return NextResponse.json({ items: withServices });
}
