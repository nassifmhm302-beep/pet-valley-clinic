import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { generateCode } from "@/lib/format";
import { getIsAdmin } from "@/lib/auth";

export async function GET() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  const items = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return NextResponse.json({ items });
}

const schema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().min(2),
  area: z.string().optional(),
  address: z.string().min(5),
  shippingMethod: z.string().min(2),
  paymentMethod: z.string().min(2),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات الطلب غير مكتملة أو غير صحيحة." }, { status: 400 });
  }
  const data = parsed.data;

  const productIds = data.items.map((i) => i.productId);
  const dbProducts = await db.select().from(products).where(eq(products.isActive, true));
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  const lineItems: {
    productId: number;
    productName: string;
    unitPrice: string;
    quantity: number;
    lineTotal: string;
  }[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "أحد المنتجات لم يعد متوفرًا." }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `الكمية المطلوبة من "${product.name}" غير متوفرة حاليًا.` },
        { status: 400 }
      );
    }
    const lineTotal = Number(product.price) * item.quantity;
    subtotal += lineTotal;
    lineItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal: lineTotal.toFixed(2),
    });
  }

  const shippingSetting = await import("@/db/queries").then((m) =>
    m.getSetting<{ flatRate: number; freeOverAmount: number }>("shipping", { flatRate: 3, freeOverAmount: 40 })
  );
  const shippingCost = subtotal >= shippingSetting.freeOverAmount ? 0 : shippingSetting.flatRate;
  const total = subtotal + shippingCost;
  const orderNumber = generateCode("PV");

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email || null,
      city: data.city,
      area: data.area || null,
      address: data.address,
      shippingMethod: data.shippingMethod,
      shippingCost: shippingCost.toFixed(2),
      paymentMethod: data.paymentMethod,
      subtotal: subtotal.toFixed(2),
      discount: "0",
      total: total.toFixed(2),
      notes: data.notes || null,
      status: "pending",
    })
    .returning();

  await db.insert(orderItems).values(lineItems.map((li) => ({ ...li, orderId: order.id })));

  for (const item of data.items) {
    const product = productMap.get(item.productId)!;
    await db
      .update(products)
      .set({ stock: product.stock - item.quantity })
      .where(eq(products.id, item.productId));
  }

  return NextResponse.json({ orderNumber: order.orderNumber, id: order.id });
}
