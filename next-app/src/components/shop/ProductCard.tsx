"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import RatingStars from "@/components/ui/RatingStars";
import DiscountBadge from "@/components/ui/DiscountBadge";
import DemoBadge from "@/components/ui/DemoBadge";
import { formatPrice, discountPercent } from "@/lib/format";

export type ProductCardData = {
  id: number;
  slug: string;
  name: string;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  stock: number;
  rating: string | null;
  ratingCount: number;
  isDemo: boolean;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const percent = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-pv-border/60 transition hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-square overflow-hidden bg-pv-cream">
        <Link href={`/shop/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <DiscountBadge percent={percent} />
        {product.isDemo && <DemoBadge />}
        <button
          onClick={() => toggle(product.id, product.name)}
          aria-label="إضافة للمفضلة"
          className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${has(product.id) ? "fill-pv-honey text-pv-honey" : "text-pv-stone"}`} />
        </button>
        {outOfStock && (
          <span className="absolute bottom-3 right-3 rounded-full bg-pv-stone/90 px-2.5 py-1 text-[10px] font-bold text-white">
            غير متوفر حاليًا
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <RatingStars rating={product.rating} count={product.ratingCount} />
        <Link href={`/shop/${product.slug}`} className="line-clamp-2 min-h-[2.6rem] text-sm font-bold text-pv-text hover:text-pv-green-dark">
          {product.name}
        </Link>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-extrabold text-pv-green-dark">{formatPrice(product.price)}</span>
          {percent > 0 && (
            <span className="text-xs text-pv-stone line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            disabled={outOfStock}
            onClick={() =>
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: Number(product.price),
                image: product.images[0],
                stock: product.stock,
              })
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full pv-cta px-3 py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:bg-pv-stone/40"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            أضف للسلة
          </button>
          <Link
            href={`/shop/${product.slug}`}
            className="rounded-full border border-pv-border px-3 py-2.5 text-xs font-bold text-pv-green-dark transition hover:bg-pv-cream"
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
}
