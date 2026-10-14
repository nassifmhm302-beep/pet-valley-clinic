import type { Metadata } from "next";
import { db } from "@/db";
import { doctors, specialties } from "@/db/schema";
import { eq } from "drizzle-orm";
import Reveal from "@/components/Reveal";
import DoctorCard from "@/components/DoctorCard";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "فريقنا الطبي",
  description: "تعرف على فريق عيادة بيت فالي البيطرية من الأطباء وأخصائيي العناية.",
};

export const revalidate = 0;

export default async function DoctorsPage() {
  const [allDoctors, allSpecialties] = await Promise.all([
    db.select().from(doctors).where(eq(doctors.isActive, true)).orderBy(doctors.sortOrder),
    db.select().from(specialties),
  ]);

  const specialtyMap = Object.fromEntries(allSpecialties.map((s) => [s.id, s.name]));

  return (
    <div>
      <section className="bg-pv-beige/40 py-14">
        <div className="container-pv">
          <Reveal>
            <SectionHeading
              eyebrow="فريقنا"
              title="فريقنا الطبي"
              description="أطباء وأخصائيو عناية ملتزمون بتقديم رعاية آمنة ومريحة لحيوانك الأليف."
            />
          </Reveal>
        </div>
      </section>

      <section className="py-14">
        <div className="container-pv">
          <div className="mb-8 flex flex-wrap gap-2">
            {allSpecialties.map((s) => (
              <span key={s.id} className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-pv-green-dark ring-1 ring-pv-border">
                {s.name}
              </span>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {allDoctors.map((d, i) => (
              <Reveal key={d.id} delay={i * 70}>
                <DoctorCard slug={d.slug} name={d.name} title={d.title} bio={d.bio} photoUrl={d.photoUrl} />
              </Reveal>
            ))}
          </div>
          {allDoctors.length === 0 && (
            <p className="py-10 text-center text-pv-stone">سيتم نشر بيانات الفريق الطبي قريبًا.</p>
          )}
        </div>
      </section>
    </div>
  );
}
