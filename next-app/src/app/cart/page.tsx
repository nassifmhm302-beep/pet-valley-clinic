"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/format";

type ShippingInfo = { flatRate: number; freeOverAmount: number; codEnabled: boolean };

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [shipping, setShipping] = useState<ShippingInfo>({ flatRate: 3, freeOverAmount: 40, codEnabled: true });

  useEffect(() => {
    fetch("/api/settings/shipping")
      .then((r) => r.json())
      .then((d) => d.value && setShipping(d.value))
      .catch(() => {});
  }, []);

  const shippingCost = items.length === 0 ? 0 : subtotal >= shipping.freeOverAmount ? 0 : shipping.flatRate;
  const total = subtotal + shippingCost;

  return (
    <div className="py-12">
      <div className="container-pv">
        <h1 className="text-2xl font-extrabold text-pv-green-dark sm:text-3xl">سلة التسوق</h1>

        {items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-white py-20 text-center shadow-card ring-1 ring-pv-border/60">
            <ShoppingBag className="h-10 w-10 text-pv-stone" />
            <p className="text-pv-stone">سلتك فارغة حاليًا.</p>
            <Link href="/shop" className="rounded-full pv-cta px-6 py-3 text-sm font-bold">
              تصفح المتجر
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-pv-border/60"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-pv-cream">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/shop/${item.slug}`} className="text-sm font-bold text-pv-text hover:text-pv-green-dark">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm font-extrabold text-pv-green-dark">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-pv-border px-2 py-1.5">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-pv-cream"
                      aria-label="إنقاص"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-pv-cream disabled:opacity-40"
                      aria-label="زيادة"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="حذف المنتج"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-pv-stone hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-pv-green-dark hover:text-pv-teal">
                <ArrowLeft className="h-4 w-4 rotate-180" />
                متابعة التسوق
              </Link>
            </div>

            <div className="h-fit rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
              <h2 className="text-lg font-extrabold text-pv-green-dark">ملخص الطلب</h2>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-pv-stone">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-pv-text">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-pv-stone">
                  <span>الشحن</span>
                  <span className="font-bold text-pv-text">{shippingCost === 0 ? "مجاني" : formatPrice(shippingCost)}</span>
                </div>
                {shipping.freeOverAmount > subtotal && (
                  <p className="text-xs text-pv-teal">
                    أضف منتجات بقيمة {formatPrice(shipping.freeOverAmount - subtotal)} أخرى للحصول على شحن مجاني.
                  </p>
                )}
                <div className="flex justify-between border-t border-pv-border pt-3 text-base font-extrabold text-pv-green-dark">
                  <span>الإجمالي</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 flex items-center justify-center gap-2 rounded-full pv-cta px-6 py-3.5 text-sm font-bold transition"
              >
                إتمام الطلب
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
