import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { appointments, services, doctors, branches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Clock3, CheckCircle2, Hourglass, XCircle, PawPrint } from "lucide-react";
import { formatDateAr, formatTimeAr } from "@/lib/format";

export const revalidate = 0;

const STATUS_META: Record<string, { label: string; icon: typeof Clock3; color: string; message: string }> = {
  pending: {
    label: "قيد المراجعة",
    icon: Hourglass,
    color: "text-pv-honey",
    message: "تم إرسال طلب الحجز، وسيتم التواصل معك لتأكيد الموعد.",
  },
  confirmed: {
    label: "مؤكد",
    icon: CheckCircle2,
    color: "text-pv-green",
    message: "تم تأكيد موعدك، نرجو الحضور قبل الموعد بعشر دقائق.",
  },
  rejected: {
    label: "مرفوض",
    icon: XCircle,
    color: "text-red-500",
    message: "تعذّر تأكيد هذا الطلب، يرجى التواصل معنا لاختيار موعد آخر.",
  },
  cancelled: {
    label: "ملغى",
    icon: XCircle,
    color: "text-pv-stone",
    message: "تم إلغاء هذا الحجز.",
  },
  completed: {
    label: "مكتمل",
    icon: CheckCircle2,
    color: "text-pv-teal",
    message: "تم إنجاز هذا الموعد بنجاح.",
  },
};

export default async function BookingConfirmationPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const rows = await db.select().from(appointments).where(eq(appointments.publicCode, code)).limit(1);
  const appointment = rows[0];
  if (!appointment) notFound();

  const [service, doctor, branch] = await Promise.all([
    db.select().from(services).where(eq(services.id, appointment.serviceId)).limit(1),
    appointment.doctorId ? db.select().from(doctors).where(eq(doctors.id, appointment.doctorId)).limit(1) : Promise.resolve([]),
    appointment.branchId ? db.select().from(branches).where(eq(branches.id, appointment.branchId)).limit(1) : Promise.resolve([]),
  ]);

  const meta = STATUS_META[appointment.status];
  const StatusIcon = meta.icon;

  const visitLabel =
    appointment.visitType === "clinic" ? "داخل العيادة" : appointment.visitType === "home" ? "زيارة منزلية" : "استشارة عن بعد";

  return (
    <div className="py-16">
      <div className="container-pv max-w-2xl">
        <div className="rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-pv-border/60">
          <StatusIcon className={`mx-auto h-14 w-14 ${meta.color}`} />
          <h1 className="mt-4 text-2xl font-extrabold text-pv-green-dark">{meta.label}</h1>
          <p className="mt-2 text-pv-stone">{meta.message}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-pv-cream px-5 py-2.5 text-sm font-bold text-pv-green-dark">
            <PawPrint className="h-4 w-4" />
            رقم الحجز: {appointment.publicCode}
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60 sm:grid-cols-2">
          <Info label="الحيوان" value={`${appointment.petName} (${appointment.petType})`} />
          <Info label="الخدمة" value={service[0]?.name ?? ""} />
          <Info label="طريقة الزيارة" value={visitLabel} />
          {branch[0] && <Info label="الفرع" value={branch[0].name} />}
          {doctor[0] && <Info label="الطبيب" value={doctor[0].name} />}
          <Info label="الموعد" value={`${formatDateAr(appointment.scheduledDate)} - ${formatTimeAr(appointment.scheduledTime)}`} />
          <Info label="صاحب الحيوان" value={`${appointment.ownerName} - ${appointment.ownerPhone}`} />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full border-2 border-pv-green px-6 py-3 text-sm font-bold text-pv-green-dark hover:bg-pv-green hover:text-white">
            العودة للرئيسية
          </Link>
          <Link href="/services" className="rounded-full pv-cta px-6 py-3 text-sm font-bold">
            تصفح خدمات أخرى
          </Link>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-pv-stone">{label}</p>
      <p className="font-bold text-pv-text">{value}</p>
    </div>
  );
}
