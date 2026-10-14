"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  CalendarCheck,
  PawPrint,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { MAIN_NAV, SITE } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { ids } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_8px_24px_rgba(23,76,69,0.08)]" : ""
      }`}
    >
      <div className="container-pv flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pv-green text-white">
            <PawPrint className="h-6 w-6" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold text-pv-green-dark">{SITE.nameAr}</span>
            <span className="text-[11px] font-medium tracking-wide text-pv-stone">
              Pet Valley Vet Clinic
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-pv-cream text-pv-green-dark"
                  : "text-pv-text hover:bg-pv-cream/70 hover:text-pv-green-dark"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <form onSubmit={submitSearch} className="flex items-center">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث عن منتج..."
                  className="h-10 w-48 rounded-full border border-pv-border bg-pv-cream px-4 text-sm outline-none focus:border-pv-teal md:w-64"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="-mr-9 flex h-8 w-8 items-center justify-center text-pv-stone"
                  aria-label="إغلاق البحث"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="بحث"
                className="flex h-10 w-10 items-center justify-center rounded-full text-pv-text transition hover:bg-pv-cream"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          <Link
            href="/account"
            aria-label="المفضلة"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-pv-text transition hover:bg-pv-cream sm:flex"
          >
            <Heart className="h-5 w-5" />
            {ids.length > 0 && (
              <span className="absolute -left-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pv-honey px-1 text-[10px] font-bold text-pv-green-dark">
                {ids.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label="سلة التسوق"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-pv-text transition hover:bg-pv-cream"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -left-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pv-green px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/booking"
            className="hidden items-center gap-1.5 rounded-full pv-cta px-5 py-2.5 text-sm font-bold shadow-sm transition md:flex"
          >
            <CalendarCheck className="h-4 w-4" />
            احجز موعدًا
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-pv-text hover:bg-pv-cream lg:hidden"
            aria-label="القائمة"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            aria-label="إغلاق"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85%] flex-col bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-extrabold text-pv-green-dark">{SITE.nameAr}</span>
              <button onClick={() => setMobileOpen(false)} aria-label="إغلاق القائمة">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={submitSearch} className="mb-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="h-11 w-full rounded-full border border-pv-border bg-pv-cream px-4 text-sm outline-none"
              />
            </form>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-base font-semibold ${
                    isActive(item.href) ? "bg-pv-cream text-pv-green-dark" : "text-pv-text"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/cart" className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-pv-text">
                سلة التسوق <ChevronDown className="h-4 w-4 -rotate-90" />
              </Link>
              <Link href="/account" className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-pv-text">
                الحساب والمفضلة <ChevronDown className="h-4 w-4 -rotate-90" />
              </Link>
            </nav>
            <Link
              href="/booking"
              className="mt-4 flex items-center justify-center gap-2 rounded-full pv-cta px-5 py-3.5 text-base font-bold"
            >
              <CalendarCheck className="h-5 w-5" />
              احجز موعدًا
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
