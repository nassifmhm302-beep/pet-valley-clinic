"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";

export default function AddToCartSection({
  productId,
  slug,
  name,
  price,
  image,
  stock,
}: {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const outOfStock = stock <= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-pv-green-dark">الكمية</span>
        <div className="flex items-center gap-3 rounded-full border border-pv-border px-2 py-1.5">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-pv-cream"
            aria-label="إنقاص الكمية"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-pv-cream"
            aria-label="زيادة الكمية"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="text-xs text-pv-stone">{outOfStock ? "غير متوفر" : `${stock} متوفر في المخزون`}</span>
      </div>
      <div className="flex gap-3">
        <button
          disabled={outOfStock}
          onClick={() => addItem({ productId, slug, name, price, image, stock }, qty)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full pv-cta px-6 py-3.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:bg-pv-stone/40"
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          أضف إلى السلة
        </button>
        <button
          onClick={() => toggle(productId, name)}
          aria-label="إضافة للمفضلة"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-pv-border transition hover:bg-pv-cream"
        >
          <Heart className={`h-5 w-5 ${has(productId) ? "fill-pv-honey text-pv-honey" : "text-pv-stone"}`} />
        </button>
      </div>
    </div>
  );
}
