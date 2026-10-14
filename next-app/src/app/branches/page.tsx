import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, Navigation, CalendarCheck } from "lucide-react";
import { getActiveBranches } from "@/db/queries";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = { title: "الفروع" };
export const revalidate = 0;

export default async function BranchesPage() {
  const branches = await getActiveBranches();

  return (
    <div className="py-14">
      <div className="container-pv">
        <Reveal>
          <SectionHeading eyebrow="فروعنا" title="زرنا في أقرب فرع إليك" align="center" />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {branches.map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-pv-border/60">
                {b.mapEmbedUrl && (
                  <iframe
                    src={b.mapEmbedUrl}
                    title={b.name}
                    loading="lazy"
                    className="h-56 w-full border-0"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-extrabold text-pv-green-dark">{b.name}</h3>
                  <div className="mt-3 space-y-2 text-sm text-pv-stone">
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pv-teal" /> {b.address}
                    </p>
                    {b.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-pv-teal" /> <span dir="ltr">{b.phone}</span>
                      </p>
                    )}
                    {b.hours && (
                      <div className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-pv-teal" />
                        <div>
                          {b.hours.map((h) => (
                            <p key={h.day}>
                              {h.day}: {h.open} - {h.close}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full border border-pv-border px-4 py-2 text-xs font-bold text-pv-green-dark hover:bg-pv-cream"
                    >
                      <Navigation className="h-3.5 w-3.5" /> الاتجاهات
                    </a>
                    <Link
                      href="/booking"
                      className="flex items-center gap-1.5 rounded-full pv-cta px-4 py-2 text-xs font-bold"
                    >
                      <CalendarCheck className="h-3.5 w-3.5" /> احجز موعدًا
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {branches.length === 0 && (
          <p className="py-10 text-center text-pv-stone">سيتم نشر بيانات الفروع قريبًا بعد اعتمادها.</p>
        )}
      </div>
    </div>
  );
}
