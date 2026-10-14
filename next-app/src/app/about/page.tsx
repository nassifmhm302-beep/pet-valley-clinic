import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "من نحن",
  description: "تعرف على عيادة بيت فالي البيطرية ورسالتها في تقديم رعاية شاملة لحيوانك الأليف.",
};

const VALUES = [
  { icon: Heart, title: "الرعاية من القلب", desc: "نتعامل مع كل حيوان وكأنه فرد من العائلة، باهتمام وصبر." },
  { icon: ShieldCheck, title: "الثقة الطبية", desc: "فريق مختص يعتمد تقييمًا دقيقًا قبل أي قرار علاجي." },
  { icon: Sparkles, title: "النظافة والاحترافية", desc: "بيئة نظيفة ومرتبة تراعي السلامة في كل زيارة." },
  { icon: Stethoscope, title: "رعاية ومنتجات في مكان واحد", desc: "من الفحص الطبي إلى منتجات العناية، كل ما يحتاجه حيوانك هنا." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-pv-beige/40 py-14">
        <div className="container-pv grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold text-pv-green-dark ring-1 ring-pv-border">
              من نحن
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-pv-green-dark sm:text-4xl">عيادة بيت فالي البيطرية</h1>
            <p className="mt-4 leading-8 text-pv-stone">
              نحن فريق من الأطباء البيطريين وأخصائيي العناية نؤمن بأن الحيوانات الأليفة تستحق رعاية تجمع بين الدقة الطبية والدفء
              الإنساني. نسعى لأن تكون كل زيارة لعيادتنا تجربة مريحة لصاحب الحيوان وحيوانه معًا، من الفحص والتطعيم إلى العناية
              والإقامة، وصولًا إلى توفير منتجات موثوقة ضمن متجرنا الإلكتروني.
            </p>
            <Link href="/booking" className="mt-6 inline-flex items-center gap-2 rounded-full pv-cta px-6 py-3 text-sm font-bold">
              احجز موعدًا معنا
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="https://images.pexels.com/photos/4269274/pexels-photo-4269274.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=900"
                alt="استقبال عيادة بيت فالي"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container-pv">
          <Reveal>
            <SectionHeading eyebrow="قيمنا" title="ما الذي يميز طريقة عملنا؟" align="center" />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="rounded-2xl bg-white p-6 text-center shadow-card ring-1 ring-pv-border/60">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pv-cream text-pv-green">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-sm font-extrabold text-pv-green-dark">{v.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-pv-stone">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-pv">
          <Reveal>
            <div className="rounded-3xl bg-pv-green-dark px-8 py-12 text-center text-white">
              <h2 className="text-xl font-extrabold sm:text-2xl">طريقة عملنا</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/85">
                يبدأ تعاملنا مع كل حالة بفحص وتقييم دقيق، ثم نشرح لصاحب الحيوان الخيارات المتاحة بوضوح قبل اتخاذ أي قرار، مع
                متابعة دورية بعد الزيارة عند الحاجة.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
