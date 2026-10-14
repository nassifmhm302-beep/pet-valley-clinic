"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Loader2, SearchX } from "lucide-react";
import ProductCard, { type ProductCardData } from "@/components/shop/ProductCard";

type Category = { id: number; slug: string; name: string };

export default function ShopCatalog({ lockedCategory }: { lockedCategory?: string }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(lockedCategory ?? "");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [items, setItems] = useState<ProductCardData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", "true");
    params.set("sort", sort);
    params.set("page", String(page));
    return params.toString();
  }, [search, category, brand, minPrice, maxPrice, inStock, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category, brand, minPrice, maxPrice, inStock, sort]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/products?${query}`)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setItems(data.items);
        setCategories(data.categories);
        setBrands(data.brands);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
        <div className="space-y-6 rounded-3xl bg-white p-5 shadow-card ring-1 ring-pv-border/60">
          <div>
            <label className="mb-2 block text-xs font-bold text-pv-green-dark">البحث بالاسم</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full rounded-xl border border-pv-border px-3 py-2.5 text-sm outline-none focus:border-pv-teal"
            />
          </div>

          {!lockedCategory && (
            <div>
              <label className="mb-2 block text-xs font-bold text-pv-green-dark">التصنيف</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-pv-border px-3 py-2.5 text-sm outline-none focus:border-pv-teal"
              >
                <option value="">جميع التصنيفات</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {brands.length > 0 && (
            <div>
              <label className="mb-2 block text-xs font-bold text-pv-green-dark">العلامة التجارية</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-pv-border px-3 py-2.5 text-sm outline-none focus:border-pv-teal"
              >
                <option value="">جميع العلامات</option>
                {brands.map((b) => (
                  <option key={b} value={b ?? ""}>{b}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-bold text-pv-green-dark">نطاق السعر</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="من"
                className="w-full rounded-xl border border-pv-border px-3 py-2.5 text-sm outline-none focus:border-pv-teal"
              />
              <span className="text-pv-stone">-</span>
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="إلى"
                className="w-full rounded-xl border border-pv-border px-3 py-2.5 text-sm outline-none focus:border-pv-teal"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-pv-text">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-pv-green" />
            المتوفر في المخزون فقط
          </label>

          <button
            onClick={() => {
              setSearch("");
              setCategory(lockedCategory ?? "");
              setBrand("");
              setMinPrice("");
              setMaxPrice("");
              setInStock(false);
              setSort("newest");
            }}
            className="w-full rounded-full border border-pv-border py-2.5 text-xs font-bold text-pv-stone hover:bg-pv-cream"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-pv-border px-4 py-2 text-xs font-bold text-pv-green-dark lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              الفلاتر
            </button>
            <p className="text-sm text-pv-stone">{total} منتج</p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-pv-border px-4 py-2 text-xs font-bold text-pv-green-dark outline-none"
          >
            <option value="newest">الأحدث</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
            <option value="rating">الأعلى تقييمًا</option>
          </select>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-pv-stone">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-3xl bg-white text-pv-stone ring-1 ring-pv-border/60">
            <SearchX className="h-8 w-8" />
            <p className="text-sm font-semibold">لا توجد منتجات مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-full text-sm font-bold transition ${
                  p === page ? "bg-pv-green text-white" : "bg-white text-pv-text ring-1 ring-pv-border hover:bg-pv-cream"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
