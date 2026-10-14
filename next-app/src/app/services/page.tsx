import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { serviceCategories, services } from "@/db/schema";
import { eq } from "drizzle-orm";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "خدماتنا",
  description: "تعرف على خدمات عيادة بيت فالي البيطرية من الفحص والتطعيمات إلى العناية والإقامة.",
};

export const revalidate = 0;

export default async function ServicesPage() {
  const [categories, allServices] = await Promise.all([
    db.select().from(serviceCategories).orderBy(serviceCategories.sortOrder),
    db.select().from(services).where(eq(services.isActive, true)).orderBy(services.sortOrder),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-pv-beige/40 py-14">
        <div className="container-pv grid items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold text-pv-green-dark ring-1 ring-pv-border">
              خدماتنا
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-pv-green-dark sm:text-4xl">
              رعاية متكاملة لحيوانك في كل مرحلة
            </h1>
            <p className="mt-4 max-w-xl text-pv-stone leading-8">
              نقدّم مجموعة من الخدمات البيطرية الأساسية، من الكشف والتطعيمات إلى العناية والإقامة، بإشراف فريق طبي مختص. اختر الخدمة المناسبة واحجز موعدك مباشرة.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="https://images.pexels.com/photos/6235650/pexels-photo-6235650.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800"
                alt="فحص بيطري لحيوان أليف"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container-pv space-y-16">
          {categories.map((cat) => {
            const list = allServices.filter((s) => s.categoryId === cat.id);
            if (!list.length) return null;
            return (
              <div key={cat.id} id={cat.slug}>
                <Reveal>
                  <SectionHeading title={cat.name} description={cat.description ?? undefined} />
                </Reveal>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {list.map((s, i) => (
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
              </div>
            );
          })}
        </div>
      </section>

      <section className="pb-16">
        <div className="container-pv">
          <div className="rounded-3xl bg-pv-green px-8 py-10 text-center text-white">
            <h2 className="text-xl font-extrabold sm:text-2xl">لم تجد الخدمة المناسبة؟</h2>
            <p className="mt-2 text-sm text-white/85">تواصل معنا وسنساعدك في اختيار الرعاية الأنسب لحيوانك.</p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-pv-green-dark"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
