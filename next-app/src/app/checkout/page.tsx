"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/format";

type ShippingInfo = { flatRate: number; freeOverAmount: number; codEnabled: boolean };

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [shipping, setShipping] = useState<ShippingInfo>({ flatRate: 3, freeOverAmount: 40, codEnabled: true });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    city: "",
    area: "",
    address: "",
    shippingMethod: "توصيل للمنزل",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/settings/shipping")
      .then((r) => r.json())
      .then((d) => d.value && setShipping(d.value))
      .catch(() => {});
  }, []);

  const shippingCost = items.length === 0 ? 0 : subtotal >= shipping.freeOverAmount ? 0 : shipping.flatRate;
  const total = subtotal + shippingCost;

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("يرجى الموافقة على الشروط وسياسة الخصوصية.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: "الدفع عند الاستلام",
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر إتمام الطلب، يرجى المحاولة مرة أخرى.");
        setSubmitting(false);
        return;
      }
      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch {
      setError("حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-pv py-20 text-center">
        <p className="text-pv-stone">سلتك فارغة، أضف منتجات أولًا لإتمام الطلب.</p>
        <Link href="/shop" className="mt-5 inline-block rounded-full pv-cta px-6 py-3 text-sm font-bold">
          تصفح المتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-pv grid gap-10 lg:grid-cols-3">
        <form onSubmit={submit} className="space-y-6 lg:col-span-2">
          <h1 className="text-2xl font-extrabold text-pv-green-dark">إتمام الطلب</h1>

          <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
            <h2 className="mb-4 text-sm font-extrabold text-pv-green-dark">بيانات العميل</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required value={form.customerName} onChange={update("customerName")} placeholder="الاسم الكامل" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              <input required dir="ltr" value={form.phone} onChange={update("phone")} placeholder="رقم الهاتف" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              <input type="email" value={form.email} onChange={update("email")} placeholder="البريد الإلكتروني (اختياري)" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal sm:col-span-2" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
            <h2 className="mb-4 text-sm font-extrabold text-pv-green-dark">عنوان التوصيل</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required value={form.city} onChange={update("city")} placeholder="المدينة" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              <input value={form.area} onChange={update("area")} placeholder="المنطقة / الحي" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              <textarea required value={form.address} onChange={update("address")} placeholder="العنوان التفصيلي" rows={3} className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal sm:col-span-2" />
              <textarea value={form.notes} onChange={update("notes")} placeholder="ملاحظات إضافية (اختياري)" rows={2} className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal sm:col-span-2" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
            <h2 className="mb-4 text-sm font-extrabold text-pv-green-dark">طريقة الدفع</h2>
            <div className="flex items-center gap-3 rounded-xl bg-pv-cream p-4 text-sm">
              <ShieldCheck className="h-5 w-5 text-pv-teal" />
              الدفع عند الاستلام — الطريقة الوحيدة المفعّلة حاليًا لحين إتمام ربط بوابة دفع إلكتروني معتمدة.
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-pv-stone">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-pv-green" />
            أوافق على <Link href="/terms" className="text-pv-green-dark underline">الشروط والأحكام</Link> و
            <Link href="/privacy-policy" className="text-pv-green-dark underline"> سياسة الخصوصية</Link>
          </label>

          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <button
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full pv-cta px-6 py-4 text-sm font-bold transition disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            تأكيد الطلب
          </button>
        </form>

        <div className="h-fit space-y-4 rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
          <h2 className="text-lg font-extrabold text-pv-green-dark">مراجعة الطلب</h2>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-pv-cream">
                  <Image src={i.image} alt={i.name} fill className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-semibold">{i.name}</p>
                  <p className="text-xs text-pv-stone">الكمية: {i.quantity}</p>
                </div>
                <span className="text-sm font-bold text-pv-green-dark">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-pv-border pt-4 text-sm">
            <div className="flex justify-between text-pv-stone">
              <span>المجموع الفرعي</span>
              <span className="font-bold text-pv-text">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-pv-stone">
              <span>الشحن</span>
              <span className="font-bold text-pv-text">{shippingCost === 0 ? "مجاني" : formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-pv-green-dark">
              <span>الإجمالي</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
