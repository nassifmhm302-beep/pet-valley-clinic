import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db";
import { productCategories, products } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import ProductCard, { type ProductCardData } from "@/components/shop/ProductCard";
import ShopCatalog from "@/components/shop/ShopCatalog";
import { DEMO_MODE_NOTICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "المتجر",
  description: "تسوق غذاء ومنتجات العناية والإكسسوارات لحيوانك الأليف من متجر بيت فالي.",
};

export const revalidate = 0;

export default async function ShopHomePage() {
  const [categories, bestSellers] = await Promise.all([
    db.select().from(productCategories).where(eq(productCategories.isActive, true)).orderBy(productCategories.sortOrder),
    db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), eq(products.isBestSeller, true)))
      .orderBy(products.sortOrder)
      .limit(4),
  ]);

  return (
    <div className="bg-white">
      <div className="bg-pv-honey-light/60 py-2 text-center text-xs font-semibold text-pv-green-dark">
        {DEMO_MODE_NOTICE}
      </div>

      {/* SHOP HERO */}
      <section className="relative isolate overflow-hidden bg-[#edf7f4]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-pv-honey/20 blur-3xl" />
        <div className="container-pv grid items-center gap-8 py-10 md:py-14 lg:min-h-[430px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-12">
          <Reveal className="relative z-10 order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-pv-green-dark shadow-sm ring-1 ring-pv-border/70">
              <Sparkles className="h-4 w-4 text-pv-honey" /> اختيارات موثوقة لصحة وسعادة حيوانك
            </span>
            <h1 className="mt-5 max-w-xl text-[clamp(2rem,4.5vw,3.45rem)] font-extrabold leading-[1.2] text-pv-green-dark">
              متجر بيت فالي… كل ما يحبه صديقك الأليف
            </h1>
            <p className="mt-4 max-w-lg text-base leading-8 text-pv-stone md:text-lg">
              طعام وعناية وإكسسوارات مختارة بعناية، لتكون احتياجات حيوانك أقرب وأسهل.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="#catalog" className="pv-cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-extrabold shadow-sm transition">
                تسوق الآن <ArrowLeft className="h-4 w-4" />
              </Link>
              {categories[0] && (
                <Link href={`/shop/category/${categories[0].slug}`} className="inline-flex items-center gap-2 rounded-full border border-pv-green/30 bg-white/80 px-6 py-3.5 text-sm font-bold text-pv-green-dark transition hover:border-pv-green hover:bg-white">
                  اكتشف التصنيفات
                </Link>
              )}
            </div>
          </Reveal>
          <Reveal delay={100} className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-pv-beige/40 shadow-card ring-4 ring-white md:aspect-[16/9]">
              <Image
                src="https://images.pexels.com/photos/38398910/pexels-photo-38398910.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400&h=850"
                alt="حيوان أليف سعيد في متجر بيت فالي"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pv-green-dark/25 via-transparent to-transparent" />
              <span className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 text-xs font-extrabold text-pv-green-dark shadow-sm">
                لأنهم جزء من العائلة
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICE PROMISES */}
      <section className="border-y border-pv-border bg-white py-5 md:py-6">
        <div className="container-pv grid grid-cols-1 gap-4 text-sm sm:grid-cols-3 sm:gap-3">
          <div className="flex items-center justify-center gap-2 text-pv-stone"><Truck className="h-4.5 w-4.5 text-pv-green" /> توصيل لمعظم المناطق</div>
          <div className="flex items-center justify-center gap-2 text-pv-stone"><ShieldCheck className="h-4.5 w-4.5 text-pv-green" /> منتجات مختارة بعناية</div>
          <div className="flex items-center justify-center gap-2 text-pv-stone"><RotateCcw className="h-4.5 w-4.5 text-pv-green" /> سياسة استبدال واضحة</div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      {categories.length > 0 && (
        <section className="bg-pv-cream/55 py-12 md:py-14">
          <div className="container-pv">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold tracking-wide text-pv-green">اكتشف مجموعتنا</p>
                <h2 className="mt-1 text-2xl font-extrabold text-pv-green-dark sm:text-3xl">تسوق حسب التصنيف</h2>
              </div>
              <Link href="#catalog" className="hidden items-center gap-1 text-sm font-bold text-pv-green-dark hover:text-pv-green sm:flex">
                كل المنتجات <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.slice(0, 4).map((category, index) => (
                <Reveal key={category.id} delay={index * 60}>
                  <Link href={`/shop/category/${category.slug}`} className="group relative block h-40 overflow-hidden rounded-2xl bg-pv-beige shadow-card sm:h-52">
                    {category.imageUrl && (
                      <Image src={category.imageUrl} alt={category.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-pv-green-dark/85 via-pv-green-dark/10 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-white sm:text-base">{category.name}</span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-pv-green-dark transition group-hover:bg-pv-honey">
                        <ArrowLeft className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BEST SELLERS */}
      {bestSellers.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-pv">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-pv-honey-light/70 px-3 py-1 text-[11px] font-extrabold text-pv-green-dark">اختيارات محبوبة</span>
                <h2 className="mt-2 text-2xl font-extrabold text-pv-green-dark sm:text-3xl">الأكثر مبيعًا</h2>
                <p className="mt-1 text-sm text-pv-stone">منتجات مميزة اختارها عملاؤنا.</p>
              </div>
              <Link href="#catalog" className="inline-flex items-center gap-1 text-sm font-bold text-pv-green-dark hover:text-pv-green">
                استكشف المتجر <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {bestSellers.map((product, index) => (
                <Reveal key={product.id} delay={index * 60}>
                  <ProductCard product={product as unknown as ProductCardData} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FULL CATALOG */}
      <section id="catalog" className="bg-pv-cream/55 py-12 md:py-16">
        <div className="container-pv">
          <div className="mb-6">
            <p className="text-xs font-extrabold tracking-wide text-pv-green">اعثر على ما يناسبه</p>
            <h2 className="mt-1 text-2xl font-extrabold text-pv-green-dark sm:text-3xl">تسوق جميع المنتجات</h2>
          </div>
          <Suspense fallback={<div className="h-64" />}>
            <ShopCatalog />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
