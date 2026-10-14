"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Package, CalendarCheck, Search } from "lucide-react";
import { formatPrice, formatDateAr, formatTimeAr } from "@/lib/format";

type OrderResult = {
  order: { orderNumber: string; status: string; total: string; createdAt: string };
  items: { productName: string; quantity: number; lineTotal: string }[];
};

export default function AccountPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [orderError, setOrderError] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);

  const lookupOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingOrder(true);
    setOrderError("");
    setOrderResult(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error ?? "تعذّر العثور على الطلب.");
      } else {
        setOrderResult(data);
      }
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <div className="py-14">
      <div className="container-pv max-w-2xl space-y-10">
        <div>
          <h1 className="text-2xl font-extrabold text-pv-green-dark">حسابي وتتبع الطلبات</h1>
          <p className="mt-2 text-sm text-pv-stone">
            يمكنك التسوق والحجز كزائر دون الحاجة لإنشاء حساب. استخدم النموذج أدناه لتتبع طلبك باستخدام رقم الطلب ورقم الهاتف.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-pv-green-dark">
            <Package className="h-5 w-5 text-pv-teal" /> تتبع طلب
          </h2>
          <form onSubmit={lookupOrder} className="flex flex-col gap-3 sm:flex-row">
            <input required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="رقم الطلب" className="flex-1 rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
            <input required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف" className="flex-1 rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
            <button disabled={loadingOrder} className="flex items-center justify-center gap-2 rounded-xl pv-cta px-6 py-3 text-sm font-bold disabled:opacity-60">
              {loadingOrder ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              بحث
            </button>
          </form>
          {orderError && <p className="mt-3 text-sm text-red-600">{orderError}</p>}
          {orderResult && (
            <div className="mt-5 rounded-2xl bg-pv-cream p-4 text-sm">
              <p className="font-bold text-pv-green-dark">حالة الطلب: {orderResult.order.status}</p>
              <p className="mt-1 text-pv-stone">تاريخ الطلب: {formatDateAr(orderResult.order.createdAt)}</p>
              <p className="mt-1 text-pv-stone">الإجمالي: {formatPrice(orderResult.order.total)}</p>
              <ul className="mt-2 space-y-1">
                {orderResult.items.map((it, i) => (
                  <li key={i}>{it.productName} × {it.quantity} — {formatPrice(it.lineTotal)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-pv-green-dark">
            <CalendarCheck className="h-5 w-5 text-pv-teal" /> تتبع موعد
          </h2>
          <p className="text-sm text-pv-stone">
            احتفظ برقم الحجز الذي استلمته بعد إرسال الطلب، ويمكنك زيارة رابط المتابعة مباشرة:
          </p>
          <p className="mt-2 text-xs text-pv-stone">مثال: /booking/confirmation/APT-XXXXXX</p>
          <Link href="/booking" className="mt-4 inline-block rounded-full pv-cta px-5 py-2.5 text-xs font-bold">
            حجز موعد جديد
          </Link>
        </div>
      </div>
    </div>
  );
}
