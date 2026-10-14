import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { products, productCategories, services } from "@/db/schema";
import { and, eq, inArray, ne } from "drizzle-orm";
import Reveal from "@/components/Reveal";
import RatingStars from "@/components/ui/RatingStars";
import DiscountBadge from "@/components/ui/DiscountBadge";
import DemoBadge from "@/components/ui/DemoBadge";
import ProductCard, { type ProductCardData } from "@/components/shop/ProductCard";
import AddToCartSection from "@/components/shop/AddToCartSection";
import { formatPrice, discountPercent } from "@/lib/format";

export const revalidate = 0;

async function getProduct(slug: string) {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 150),
    openGraph: { images: product.images },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || !product.isActive) notFound();

  const category = product.categoryId
    ? (await db.select().from(productCategories).where(eq(productCategories.id, product.categoryId)).limit(1))[0]
    : null;

  const related = product.categoryId
    ? await db
        .select()
        .from(products)
        .where(and(eq(products.categoryId, product.categoryId), eq(products.isActive, true), ne(products.id, product.id)))
        .limit(4)
    : [];

  const relatedServices = product.relatedServiceIds?.length
    ? await db.select().from(services).where(inArray(services.id, product.relatedServiceIds))
    : [];

  const percent = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className="py-10">
      <div className="container-pv">
        <nav className="mb-6 text-xs text-pv-stone">
          <Link href="/shop" className="hover:text-pv-green-dark">المتجر</Link>
          {category && (
            <>
              {" / "}
              <Link href={`/shop/category/${category.slug}`} className="hover:text-pv-green-dark">{category.name}</Link>
            </>
          )}
          {" / "}
          {product.name}
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-pv-border/60">
              <Image src={product.images[0]} alt={product.name} fill sizes="600px" className="object-cover" />
              <DiscountBadge percent={percent} />
              {product.isDemo && <DemoBadge />}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              {product.brand && <span className="text-xs font-bold text-pv-teal">{product.brand}</span>}
              <h1 className="mt-1 text-2xl font-extrabold text-pv-green-dark sm:text-3xl">{product.name}</h1>
              <div className="mt-2">
                <RatingStars rating={product.rating} count={product.ratingCount} size="md" />
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-pv-green-dark">{formatPrice(product.price)}</span>
                {percent > 0 && (
                  <span className="text-base text-pv-stone line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
              </div>
              <p className="mt-5 text-sm leading-8 text-pv-stone">{product.description}</p>

              {product.weight && (
                <p className="mt-3 text-sm text-pv-stone">
                  <span className="font-bold text-pv-text">الحجم / الوزن: </span>
                  {product.weight}
                </p>
              )}

              {product.specs && product.specs.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-pv-stone">
                  {product.specs.map((s) => (
                    <li key={s.label} className="rounded-xl bg-pv-cream px-3 py-2">
                      <span className="font-bold text-pv-text">{s.label}: </span>
                      {s.value}
                    </li>
                  ))}
                </ul>
              )}

              {product.usageInstructions && (
                <div className="mt-4 rounded-2xl bg-pv-beige/40 p-4 text-sm leading-7 text-pv-stone">
                  <span className="font-bold text-pv-text">طريقة الاستخدام: </span>
                  {product.usageInstructions}
                </div>
              )}

              <div className="mt-6">
                <AddToCartSection
                  productId={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.price)}
                  image={product.images[0]}
                  stock={product.stock}
                />
              </div>

              {product.isDemo && (
                <p className="mt-4 text-xs text-pv-stone">
                  * هذا المنتج نموذج تجريبي ضمن مرحلة تصميم المتجر، وسيُستبدل بالكتالوج الرسمي بعد اعتماده من العيادة.
                </p>
              )}
            </div>
          </Reveal>
        </div>

        {relatedServices.length > 0 && (
          <Reveal>
            <div className="mt-14">
              <h2 className="text-lg font-extrabold text-pv-green-dark">مرتبط بخدمات العيادة</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedServices.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="rounded-full bg-pv-cream px-4 py-2 text-xs font-bold text-pv-green-dark hover:bg-pv-beige"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {related.length > 0 && (
          <Reveal>
            <div className="mt-14">
              <h2 className="text-lg font-extrabold text-pv-green-dark">منتجات مشابهة</h2>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p as unknown as ProductCardData} />
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
