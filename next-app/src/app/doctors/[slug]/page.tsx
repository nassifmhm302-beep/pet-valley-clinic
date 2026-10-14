import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { doctors, specialties, doctorServices, services } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { CalendarCheck, GraduationCap, Stethoscope } from "lucide-react";
import Reveal from "@/components/Reveal";

export const revalidate = 0;

async function getDoctor(slug: string) {
  const rows = await db.select().from(doctors).where(eq(doctors.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctor(slug);
  if (!doctor) return {};
  return { title: doctor.name, description: doctor.bio, openGraph: { images: [doctor.photoUrl] } };
}

export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = await getDoctor(slug);
  if (!doctor || !doctor.isActive) notFound();

  const [specialty, svcLinks] = await Promise.all([
    doctor.specialtyId
      ? db.select().from(specialties).where(eq(specialties.id, doctor.specialtyId)).limit(1)
      : Promise.resolve([]),
    db.select({ serviceId: doctorServices.serviceId }).from(doctorServices).where(eq(doctorServices.doctorId, doctor.id)),
  ]);

  const serviceIds = svcLinks.map((s) => s.serviceId);
  const doctorServicesList = serviceIds.length
    ? await db.select().from(services).where(inArray(services.id, serviceIds))
    : [];

  return (
    <div>
      <section className="py-12">
        <div className="container-pv grid gap-10 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div className="sticky top-28 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-pv-border/60">
              <div className="relative h-80 w-full">
                <Image src={doctor.photoUrl} alt={doctor.name} fill className="object-cover" />
              </div>
              <div className="p-6 text-center">
                <h1 className="text-xl font-extrabold text-pv-green-dark">{doctor.name}</h1>
                <p className="mt-1 text-sm font-semibold text-pv-teal">{doctor.title}</p>
                {specialty[0] && (
                  <span className="mt-3 inline-block rounded-full bg-pv-cream px-3 py-1 text-xs font-bold text-pv-green-dark">
                    {specialty[0].name}
                  </span>
                )}
                <Link
                  href={`/booking?doctor=${doctor.slug}`}
                  className="mt-6 flex items-center justify-center gap-2 rounded-full pv-cta px-6 py-3.5 text-sm font-bold transition"
                >
                  <CalendarCheck className="h-4.5 w-4.5" />
                  احجز موعدًا مع هذا الطبيب
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="space-y-8 lg:col-span-2">
            <Reveal>
              <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60 sm:p-8">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-pv-green-dark">
                  <Stethoscope className="h-5 w-5 text-pv-teal" /> نبذة مهنية
                </h2>
                <p className="mt-3 text-sm leading-8 text-pv-stone">{doctor.bio}</p>
              </div>
            </Reveal>

            {doctor.qualifications && doctor.qualifications.length > 0 && (
              <Reveal>
                <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60 sm:p-8">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-pv-green-dark">
                    <GraduationCap className="h-5 w-5 text-pv-teal" /> المؤهلات العلمية
                  </h2>
                  <ul className="mt-3 list-disc space-y-1.5 pr-5 text-sm text-pv-stone">
                    {doctor.qualifications.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {doctorServicesList.length > 0 && (
              <Reveal>
                <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60 sm:p-8">
                  <h2 className="text-lg font-extrabold text-pv-green-dark">الخدمات التي يقدمها</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {doctorServicesList.map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.slug}`}
                        className="rounded-full bg-pv-cream px-4 py-2 text-xs font-bold text-pv-green-dark transition hover:bg-pv-beige"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {doctor.isDemo && (
              <p className="rounded-2xl bg-pv-honey-light/50 p-4 text-xs text-pv-green-dark">
                بيانات هذا الملف تجريبية بانتظار اعتماد العيادة الرسمي قبل النشر النهائي.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
