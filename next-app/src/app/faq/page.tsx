import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = { title: "الأسئلة الشائعة" };

const FAQS = [
  {
    category: "الحجز",
    items: [
      { q: "كيف يمكنني حجز موعد؟", a: "يمكنك الحجز مباشرة عبر صفحة الحجز الإلكتروني باختيار الخدمة والطبيب والموعد المناسب." },
      { q: "هل يتم تأكيد الموعد فورًا؟", a: "يُرسل طلب الحجز ويظهر بحالة قيد المراجعة حتى تأكيده من فريق العيادة." },
      { q: "هل يمكن إلغاء أو تعديل الموعد؟", a: "نعم، يمكن التواصل مع العيادة لإلغاء أو تعديل الموعد وفق سياسة إلغاء المواعيد." },
    ],
  },
  {
    category: "المتجر",
    items: [
      { q: "ما هي طرق الدفع المتاحة؟", a: "حاليًا يتوفر الدفع عند الاستلام، وسيتم تفعيل طرق دفع إلكترونية إضافية لاحقًا." },
      { q: "كم تستغرق مدة التوصيل؟", a: "تختلف مدة التوصيل حسب المنطقة، ويتم تأكيدها عند تأكيد الطلب." },
      { q: "هل يمكن استرجاع منتج؟", a: "نعم وفق سياسة الاستبدال والاسترجاع المعتمدة لدى العيادة." },
    ],
  },
  {
    category: "الخدمات الطبية",
    items: [
      { q: "هل تتوفر الزيارات المنزلية في كل المناطق؟", a: "تتوفر الزيارة المنزلية ضمن نطاق محدد يتم تأكيده عند الحجز." },
      { q: "هل تقدمون استشارات عن بعد؟", a: "نعم، لبعض الحالات التي لا تتطلب فحصًا مباشرًا، وفق تقييم الطبيب." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="py-14">
      <div className="container-pv max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="مساعدة" title="الأسئلة الشائعة" align="center" />
        </Reveal>

        <div className="mt-10 space-y-10">
          {FAQS.map((group) => (
            <Reveal key={group.category}>
              <h2 className="mb-4 text-lg font-extrabold text-pv-green-dark">{group.category}</h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details key={item.q} className="group rounded-2xl bg-white p-5 shadow-card ring-1 ring-pv-border/60">
                    <summary className="cursor-pointer list-none text-sm font-bold text-pv-text">{item.q}</summary>
                    <p className="mt-2 text-sm leading-7 text-pv-stone">{item.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
