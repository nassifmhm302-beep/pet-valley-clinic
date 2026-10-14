import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CheckCircle2, Package } from "lucide-react";
import { formatPrice, formatDateAr } from "@/lib/format";

export const revalidate = 0;

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد المراجعة",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغى",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const rows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  const order = rows[0];
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return (
    <div className="py-16">
      <div className="container-pv max-w-2xl">
        <div className="rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-pv-border/60">
          <CheckCircle2 className="mx-auto h-14 w-14 text-pv-green" />
          <h1 className="mt-4 text-2xl font-extrabold text-pv-green-dark">تم استلام طلبك بنجاح</h1>
          <p className="mt-2 text-pv-stone">سنتواصل معك على رقم {order.phone} لتأكيد تفاصيل التوصيل.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-pv-cream px-5 py-2.5 text-sm font-bold text-pv-green-dark">
            <Package className="h-4 w-4" />
            رقم الطلب: {order.orderNumber}
          </div>
          <p className="mt-3 text-sm font-semibold text-pv-teal">الحالة الحالية: {STATUS_LABELS[order.status]}</p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
          <h2 className="text-sm font-extrabold text-pv-green-dark">ملخص الطلب</h2>
          <div className="mt-4 space-y-2 divide-y divide-pv-border/70">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 text-sm">
                <span>{item.productName} × {item.quantity}</span>
                <span className="font-bold text-pv-text">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 border-t border-pv-border pt-4 text-sm">
            <div className="flex justify-between text-pv-stone"><span>المجموع الفرعي</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-pv-stone"><span>الشحن</span><span>{formatPrice(order.shippingCost)}</span></div>
            <div className="flex justify-between text-base font-extrabold text-pv-green-dark"><span>الإجمالي</span><span>{formatPrice(order.total)}</span></div>
          </div>
          <p className="mt-4 text-xs text-pv-stone">تاريخ الطلب: {formatDateAr(order.createdAt)}</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="rounded-full border-2 border-pv-green px-6 py-3 text-sm font-bold text-pv-green-dark hover:bg-pv-green hover:text-white">
            متابعة التسوق
          </Link>
          <Link href="/account" className="rounded-full pv-cta px-6 py-3 text-sm font-bold">
            تتبع الطلب لاحقًا
          </Link>
        </div>
      </div>
    </div>
  );
}
