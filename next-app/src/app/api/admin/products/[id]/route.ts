import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getIsAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const update: Partial<typeof products.$inferInsert> = {};

  if (body.price !== undefined) update.price = String(body.price);
  if (body.compareAtPrice !== undefined) update.compareAtPrice = body.compareAtPrice ? String(body.compareAtPrice) : null;
  if (body.stock !== undefined) update.stock = Number(body.stock);
  if (body.isActive !== undefined) update.isActive = Boolean(body.isActive);
  if (body.isFeatured !== undefined) update.isFeatured = Boolean(body.isFeatured);
  if (body.isBestSeller !== undefined) update.isBestSeller = Boolean(body.isBestSeller);
  if (body.name !== undefined) update.name = body.name;

  const [updated] = await db.update(products).set(update).where(eq(products.id, Number(id))).returning();
  if (!updated) return NextResponse.json({ error: "لم يتم العثور على المنتج." }, { status: 404 });
  return NextResponse.json({ product: updated });
}
