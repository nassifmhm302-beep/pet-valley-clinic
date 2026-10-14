import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getIsAdmin } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const phone = req.nextUrl.searchParams.get("phone");
  const isAdmin = await getIsAdmin();

  const rows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  const order = rows[0];
  if (!order) return NextResponse.json({ error: "لم يتم العثور على الطلب." }, { status: 404 });

  if (!isAdmin) {
    if (!phone || phone.replace(/\s/g, "") !== order.phone.replace(/\s/g, "")) {
      return NextResponse.json({ error: "تحقق من رقم الطلب ورقم الهاتف." }, { status: 403 });
    }
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return NextResponse.json({ order, items });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

  const { orderNumber } = await params;
  const body = await req.json();
  const allowed = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "حالة غير صحيحة." }, { status: 400 });
  }

  const [updated] = await db
    .update(orders)
    .set({ status: body.status })
    .where(eq(orders.orderNumber, orderNumber))
    .returning();

  if (!updated) return NextResponse.json({ error: "لم يتم العثور على الطلب." }, { status: 404 });
  return NextResponse.json({ order: updated });
}
