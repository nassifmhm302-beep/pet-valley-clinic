import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/db";
import { productCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Reveal from "@/components/Reveal";
import ShopCatalog from "@/components/shop/ShopCatalog";

export const revalidate = 0;

async function getCategory(slug: string) {
  const rows = await db.select().from(productCategories).where(eq(productCategories.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return {};
  return { title: cat.name, description: cat.description ?? undefined };
}

export default async function ShopCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category || !category.isActive) notFound();

  return (
    <div className="py-12">
      <div className="container-pv">
        <Reveal>
          <nav className="mb-2 text-xs text-pv-stone">المتجر / {category.name}</nav>
          <h1 className="text-2xl font-extrabold text-pv-green-dark sm:text-3xl">{category.name}</h1>
          {category.description && <p className="mt-2 max-w-xl text-pv-stone">{category.description}</p>}
        </Reveal>
        <div className="mt-8">
          <Suspense fallback={<div className="h-64" />}>
            <ShopCatalog lockedCategory={category.slug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
