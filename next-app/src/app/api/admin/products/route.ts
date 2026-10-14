import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getIsAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";

export async function GET() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  const items = await db.select().from(products).orderBy(products.sortOrder);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.price || !body.categoryId || !body.images?.length) {
    return NextResponse.json({ error: "يرجى تعبئة الحقول الأساسية للمنتج." }, { status: 400 });
  }

  const [created] = await db
    .insert(products)
    .values({
      slug: `${slugify(body.name)}-${Date.now().toString().slice(-4)}`,
      name: body.name,
      categoryId: Number(body.categoryId),
      brand: body.brand || "عينة تجريبية",
      description: body.description || "",
      images: body.images,
      price: String(body.price),
      compareAtPrice: body.compareAtPrice ? String(body.compareAtPrice) : null,
      stock: Number(body.stock ?? 0),
      isActive: true,
      isDemo: true,
    })
    .returning();

  return NextResponse.json({ product: created });
}
