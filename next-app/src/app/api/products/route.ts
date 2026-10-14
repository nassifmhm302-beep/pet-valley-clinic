import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productCategories } from "@/db/schema";
import { and, asc, desc, eq, gte, ilike, lte, SQL } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const search = sp.get("search")?.trim();
  const categorySlug = sp.get("category");
  const brand = sp.get("brand");
  const minPrice = sp.get("minPrice");
  const maxPrice = sp.get("maxPrice");
  const inStock = sp.get("inStock");
  const sort = sp.get("sort") ?? "newest";
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const pageSize = Math.min(24, Math.max(1, Number(sp.get("pageSize") ?? "12")));

  const conditions: SQL[] = [eq(products.isActive, true)];

  if (categorySlug) {
    const cat = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.slug, categorySlug))
      .limit(1);
    if (cat[0]) conditions.push(eq(products.categoryId, cat[0].id));
    else conditions.push(eq(products.categoryId, -1));
  }
  if (search) conditions.push(ilike(products.name, `%${search}%`));
  if (brand) conditions.push(eq(products.brand, brand));
  if (minPrice) conditions.push(gte(products.price, minPrice));
  if (maxPrice) conditions.push(lte(products.price, maxPrice));
  if (inStock === "true") conditions.push(gte(products.stock, 1));

  const orderBy =
    sort === "price-asc"
      ? asc(products.price)
      : sort === "price-desc"
      ? desc(products.price)
      : sort === "rating"
      ? desc(products.rating)
      : desc(products.createdAt);

  const where = and(...conditions);

  const [rows, categories] = await Promise.all([
    db.select().from(products).where(where).orderBy(orderBy),
    db.select().from(productCategories).where(eq(productCategories.isActive, true)),
  ]);

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const pageItems = rows.slice(start, start + pageSize);
  const brands = Array.from(new Set(rows.map((r) => r.brand).filter(Boolean)));

  return NextResponse.json({
    items: pageItems,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    categories,
    brands,
  });
}
