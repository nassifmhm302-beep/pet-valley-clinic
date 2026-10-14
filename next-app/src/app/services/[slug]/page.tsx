import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { services, doctors, doctorServices, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { CalendarCheck, Clock, MapPin, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import ProductCard, { type ProductCardData } from "@/components/shop/ProductCard";
import { formatPrice } from "@/lib/format";

export const revalidate = 0;

async function getService(slug: string) {
  const rows = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.shortDescription,
    openGraph: { images: [service.imageUrl] },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service || !service.isActive) notFound();

  const docLinks = await db
    .select({ doctorId: doctorServices.doctorId })
    .from(doctorServices)
    .where(eq(doctorServices.serviceId, service.id));
  const doctorIds = docLinks.map((d) => d.doctorId);
  const serviceDoctors = doctorIds.length
    ? await db.select().from(doctors).where(inArray(doctors.id, doctorIds))
    : [];

  const relatedProducts = (
    await db.select().from(products).where(eq(products.isActive, true))
  ).filter((p) => (p.relatedServiceIds ?? []).includes(service.id));

  const visitOptions = [
    service.allowInClinic && "داخل العيادة",
    service.allowHomeVisit && "زيارة منزلية",
    service.allowTelemedicine && "استشارة عن بعد",
  ].filter(Boolean) as string[];

  return (
    <div>
      <section className="relative h-72 overflow-hidden sm:h-96">
        <Image src={service.imageUrl} alt={service.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-pv-green-dark/85 via-pv-green-dark/30 to-transparent" />
        <div className="container-pv absolute inset-x-0 bottom-0 pb-8 text-white">
          <nav className="mb-3 text-xs text-white/75">
            <Link href="/services" className="hover:text-white">الخدمات</Link> / {service.name}
          </nav>
          <h1 className="text-2xl font-extrabold sm:text-4xl">{service.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{service.shortDescription}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-pv grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <Reveal>
              <div className="pv-prose rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60 sm:p-8">
                <h2 className="!mt-0 text-xl font-extrabold text-pv-green-dark">عن الخدمة</h2>
                <p>{service.description}</p>
                {service.candidateNotes && (
                  <>
                    <h2>لمن تناسب هذه الخدمة؟</h2>
                    <p>{service.candidateNotes}</p>
                  </>
                )}
                {service.preparationNotes && (
                  <>
                    <h2>تحضيرات قبل الزيارة</h2>
                    <p>{service.preparationNotes}</p>
                  </>
                )}
              </div>
            </Reveal>

            {serviceDoctors.length > 0 && (
              <Reveal>
                <div>
                  <h2 className="text-xl font-extrabold text-pv-green-dark">الأطباء الذين يقدمون هذه الخدمة</h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {serviceDoctors.map((d) => (
                      <Link
                        key={d.id}
                        href={`/doctors/${d.slug}`}
                        className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-pv-border/60 transition hover:-translate-y-1"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                          <Image src={d.photoUrl} alt={d.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-pv-green-dark">{d.name}</h3>
                          <p className="text-xs text-pv-stone">{d.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {relatedProducts.length > 0 && (
              <Reveal>
                <div>
                  <h2 className="text-xl font-extrabold text-pv-green-dark">منتجات قد تحتاجها</h2>
                  <p className="mt-1 text-sm text-pv-stone">
                    منتجات مرتبطة بهذه الخدمة من متجرنا، وليست بديلًا عن أي استشارة أو علاج طبي.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {relatedProducts.map((p) => (
                      <ProductCard key={p.id} product={p as unknown as ProductCardData} />
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {service.faqs && service.faqs.length > 0 && (
              <Reveal>
                <div>
                  <h2 className="text-xl font-extrabold text-pv-green-dark">أسئلة شائعة</h2>
                  <div className="mt-5 space-y-3">
                    {service.faqs.map((f, i) => (
                      <details key={i} className="group rounded-2xl bg-white p-5 shadow-card ring-1 ring-pv-border/60">
                        <summary className="cursor-pointer list-none text-sm font-bold text-pv-green-dark">
                          {f.q}
                        </summary>
                        <p className="mt-2 text-sm leading-7 text-pv-stone">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-1">
            <Reveal>
              <div className="sticky top-28 space-y-5 rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
                <div className="flex items-center gap-2 text-sm text-pv-stone">
                  <Clock className="h-4 w-4 text-pv-teal" />
                  مدة الخدمة التقريبية: {service.durationMinutes} دقيقة
                </div>
                {visitOptions.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-pv-stone">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pv-teal" />
                    <span>طرق تقديم الخدمة: {visitOptions.join(" / ")}</span>
                  </div>
                )}
                {service.priceFrom && (
                  <div className="rounded-2xl bg-pv-cream p-4">
                    <p className="text-xs text-pv-stone">يبدأ السعر من</p>
                    <p className="text-xl font-extrabold text-pv-green-dark">{formatPrice(service.priceFrom)}</p>
                    {service.priceNote && <p className="mt-1 text-xs text-pv-stone">{service.priceNote}</p>}
                  </div>
                )}
                <ul className="space-y-2 text-sm text-pv-stone">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-pv-green" /> فريق طبي مختص
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-pv-green" /> تأكيد فوري لطلب الحجز
                  </li>
                </ul>
                <Link
                  href={`/booking?service=${service.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full pv-cta px-6 py-3.5 text-sm font-bold transition"
                >
                  <CalendarCheck className="h-4.5 w-4.5" />
                  احجز هذه الخدمة
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
