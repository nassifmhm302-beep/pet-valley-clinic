import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import {
  services,
  doctors,
  products,
  articles,
  galleryPhotos,
  productCategories,
} from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getSetting } from "@/db/queries";
import type { HeroContent } from "@/db/queries";
import {
  CalendarCheck,
  ArrowLeft,
  Stethoscope,
  Sparkles,
  Home as HomeIcon,
  ShieldCheck,
  Star,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import DoctorCard from "@/components/DoctorCard";
import ProductCard, { type ProductCardData } from "@/components/shop/ProductCard";
import { formatDateAr } from "@/lib/format";
import { DEMO_MODE_NOTICE } from "@/lib/constants";

export const revalidate = 0;

const TRUST_ITEMS = [
  { icon: Stethoscope, title: "رعاية بيطرية متكاملة", desc: "فحص وتشخيص ومتابعة من فريق طبي مختص." },
  { icon: Sparkles, title: "عناية ونظافة احترافية", desc: "استحمام وتهذيب فراء بأسلوب هادئ ومريح." },
  { icon: CalendarCheck, title: "حجز إلكتروني سهل", desc: "اختر الخدمة والموعد المناسب خلال دقائق." },
  { icon: HomeIcon, title: "زيارات منزلية عند توفرها", desc: "رعاية حيوانك داخل منزله عند توفر التغطية." },
];

export default async function HomePage() {
  const hero = await getSetting<HeroContent>("hero", {
    title: "رعاية تحبها… وراحة يشعر بها حيوانك",
    subtitle:
      "رعاية بيطرية متكاملة لحيواناتك الأليفة، من الفحص والتطعيم إلى العناية والإقامة، داخل العيادة أو في منزلك عند توفر الخدمة.",
    ctaPrimary: "احجز موعدًا",
    ctaSecondary: "اكتشف خدماتنا",
    imageUrl: "",
    showHomeVisitCta: true,
  });
  const offers = await getSetting<
    { title: string; description: string; badge: string; ctaLabel: string; ctaHref: string; imageUrl: string }[]
  >("offers", []);

  const [activeServices, activeDoctors, featuredProducts, latestArticles, friends, shopCats] =
    await Promise.all([
      db.select().from(services).where(eq(services.isActive, true)).orderBy(services.sortOrder).limit(6),
      db.select().from(doctors).where(eq(doctors.isActive, true)).orderBy(doctors.sortOrder).limit(4),
      db
        .select()
        .from(products)
        .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
        .orderBy(products.sortOrder)
        .limit(4),
      db
        .select()
        .from(articles)
        .where(eq(articles.isPublished, true))
        .orderBy(desc(articles.publishedAt))
        .limit(3),
      db.select().from(galleryPhotos).where(eq(galleryPhotos.isActive, true)).orderBy(galleryPhotos.sortOrder),
      db.select().from(productCategories).where(eq(productCategories.isActive, true)).orderBy(productCategories.sortOrder).limit(4),
    ]);

  return (
    <div>
      {/* Demo notice */}
      <div className="bg-pv-honey-light/60 py-2 text-center text-xs font-semibold text-pv-green-dark">
        {DEMO_MODE_NOTICE}
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pv-beige/70 via-pv-cream to-pv-cream">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pv-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-pv-honey/20 blur-3xl" />
        <div className="container-pv grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="pv-fade-up order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-pv-green-dark shadow-sm ring-1 ring-pv-border">
              <ShieldCheck className="h-3.5 w-3.5 text-pv-teal" /> رعاية موثوقة لكل أفراد العائلة
            </span>
            <h1 className="mt-5 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.2] text-pv-green-dark">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-pv-stone md:text-lg">{hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/booking"
                className="flex items-center gap-2 rounded-full pv-cta px-7 py-3.5 text-sm font-bold shadow-md transition"
              >
                <CalendarCheck className="h-4.5 w-4.5" />
                {hero.ctaPrimary}
              </Link>
              <Link
                href="/services"
                className="flex items-center gap-2 rounded-full border-2 border-pv-green px-7 py-3.5 text-sm font-bold text-pv-green-dark transition hover:bg-pv-green hover:text-white"
              >
                {hero.ctaSecondary}
              </Link>
              {hero.showHomeVisitCta && (
                <Link
                  href="/booking?visitType=home"
                  className="flex items-center gap-1.5 px-2 text-sm font-bold text-pv-teal hover:text-pv-green-dark"
                >
                  اطلب زيارة منزلية
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-2xl ring-8 ring-white">
              {hero.imageUrl && (
                <Image src={hero.imageUrl} alt={hero.title} fill priority className="object-cover" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-pv-border bg-white py-10">
        <div className="container-pv grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TRUST_ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 80} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pv-cream text-pv-green">
                <item.icon className="h-5.5 w-5.5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-pv-green-dark">{item.title}</h3>
                <p className="mt-0.5 text-xs leading-6 text-pv-stone">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 md:py-20">
        <div className="container-pv">
          <Reveal>
            <SectionHeading
              eyebrow="خدماتنا"
              title="رعاية متكاملة تحت سقف واحد"
              description="من الفحص الدوري إلى العناية والإقامة، اختر الخدمة الأنسب لحيوانك واحجزها مباشرة."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {activeServices.map((s, i) => (
              <Reveal key={s.id} delay={i * 70}>
                <ServiceCard
                  slug={s.slug}
                  name={s.name}
                  shortDescription={s.shortDescription}
                  imageUrl={s.imageUrl}
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border-2 border-pv-green px-7 py-3 text-sm font-bold text-pv-green-dark transition hover:bg-pv-green hover:text-white"
            >
              عرض جميع الخدمات
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="bg-pv-beige/40 py-16 md:py-20">
        <div className="container-pv">
          <Reveal>
            <SectionHeading eyebrow="فريقنا" title="يد أمينة لحيوانك الأليف" />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {activeDoctors.map((d, i) => (
              <Reveal key={d.id} delay={i * 70}>
                <DoctorCard slug={d.slug} name={d.name} title={d.title} bio={d.bio} photoUrl={d.photoUrl} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 rounded-full border-2 border-pv-green px-7 py-3 text-sm font-bold text-pv-green-dark transition hover:bg-pv-green hover:text-white"
            >
              تعرف على فريقنا الطبي
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP PREVIEW */}
      <section className="py-16 md:py-20">
        <div className="container-pv">
          <Reveal>
            <SectionHeading
              eyebrow="المتجر"
              title="كل ما يحتاجه حيوانك في مكان واحد"
              description="تشكيلة مختارة من الطعام ومنتجات العناية والإكسسوارات."
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featuredProducts.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard product={p as unknown as ProductCardData} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full pv-cta px-7 py-3 text-sm font-bold transition"
            >
              تصفح المتجر بالكامل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROMO BANNER GRID */}
      <section className="pb-16 md:pb-20">
        <div className="container-pv grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shopCats.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <Link
                href={`/shop/category/${c.slug}`}
                className="group relative block h-44 overflow-hidden rounded-2xl shadow-card"
              >
                {c.imageUrl && (
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    sizes="300px"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-pv-green-dark/80 via-pv-green-dark/10 to-transparent" />
                <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white">{c.name}</span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-pv-green-dark">
                    تسوق الآن
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OFFERS */}
      {offers.length > 0 && (
        <section className="bg-pv-green-dark py-16 md:py-20">
          <div className="container-pv">
            <Reveal>
              <h2 className="text-center text-2xl font-extrabold text-white sm:text-3xl">العروض الحالية</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {offers.map((offer, i) => (
                <Reveal key={offer.title} delay={i * 90}>
                  <div className="relative flex h-56 items-end overflow-hidden rounded-3xl shadow-xl sm:h-64">
                    <Image src={offer.imageUrl} alt={offer.title} fill sizes="600px" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 flex w-full items-end justify-between gap-4 p-6">
                      <div>
                        <span className="pv-pulse inline-block rounded-full bg-pv-honey px-3 py-1 text-[11px] font-extrabold text-pv-green-dark">
                          {offer.badge}
                        </span>
                        <h3 className="mt-2 text-lg font-extrabold text-white">{offer.title}</h3>
                        <p className="mt-1 max-w-xs text-xs leading-6 text-white/80">{offer.description}</p>
                      </div>
                      <Link
                        href={offer.ctaHref}
                        className="shrink-0 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-pv-green-dark"
                      >
                        {offer.ctaLabel}
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ARTICLES */}
      <section className="py-16 md:py-20">
        <div className="container-pv">
          <Reveal>
            <SectionHeading eyebrow="المدونة" title="نصائح وإرشادات للعناية بحيوانك" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {latestArticles.map((a, i) => (
              <Reveal key={a.id} delay={i * 80}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-pv-border/60 transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={a.coverImageUrl}
                      alt={a.title}
                      fill
                      sizes="400px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold text-pv-teal">{a.category}</span>
                    <h3 className="mt-1.5 line-clamp-2 text-base font-extrabold text-pv-green-dark">{a.title}</h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-pv-stone">{a.excerpt}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-pv-stone">
                      <span>{formatDateAr(a.publishedAt)}</span>
                      <span className="font-bold text-pv-green-dark">اقرأ المقال ←</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-pv-green-dark hover:text-pv-teal">
              جميع المقالات
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FRIENDS GALLERY */}
      {friends.length > 0 && (
        <section className="bg-pv-beige/40 py-16 md:py-20">
          <div className="container-pv">
            <Reveal>
              <SectionHeading eyebrow="مجتمعنا" title="أصدقاء بيت فالي" description="لحظات من زيارات أصدقائنا الصغار للعيادة." />
            </Reveal>
          </div>
          <div className="pv-scrollbar-none mt-10 flex gap-4 overflow-x-auto px-5 lg:container-pv">
            {friends.map((f) => (
              <div
                key={f.id}
                className="group relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl shadow-card sm:h-52 sm:w-52"
              >
                <Image
                  src={f.imageUrl}
                  alt={f.caption ?? "صديق بيت فالي"}
                  fill
                  sizes="220px"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS PLACEHOLDER */}
      <section className="py-16">
        <div className="container-pv">
          <Reveal>
            <div className="rounded-3xl border-2 border-dashed border-pv-border bg-white/60 p-10 text-center">
              <Star className="mx-auto h-8 w-8 text-pv-honey" />
              <h3 className="mt-3 text-lg font-extrabold text-pv-green-dark">آراء عملائنا قريبًا</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-pv-stone">
                بانتظار نشر العيادة لتقييمات موثقة من أصحاب الحيوانات، ستظهر هنا فور اعتمادها.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-4">
        <div className="container-pv">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-pv-green px-8 py-14 text-center sm:px-16">
              <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-pv-honey/20" />
              <h2 className="relative text-2xl font-extrabold text-white sm:text-3xl">صديقك يستحق أفضل رعاية</h2>
              <p className="relative mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
                احجز موعده الآن مع فريق بيت فالي الطبي، واطمئن على صحته وراحته.
              </p>
              <Link
                href="/booking"
                className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-pv-green-dark shadow-md transition hover:bg-pv-honey-light"
              >
                <CalendarCheck className="h-4.5 w-4.5" />
                احجز موعدًا
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
