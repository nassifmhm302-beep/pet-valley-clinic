"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  PawPrint,
  Stethoscope,
  MapPin,
  Home,
  Video,
  CalendarDays,
  User,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { formatTimeAr, formatDateAr } from "@/lib/format";

type Service = {
  id: number;
  slug: string;
  name: string;
  imageUrl: string;
  durationMinutes: number;
  allowInClinic: boolean;
  allowHomeVisit: boolean;
  allowTelemedicine: boolean;
};
type Doctor = {
  id: number;
  slug: string;
  name: string;
  title: string;
  photoUrl: string;
  serviceIds: number[];
};
type Branch = { id: number; name: string; address: string; city: string };

const STEPS = ["الحيوان", "الخدمة", "الزيارة", "الموعد", "بياناتك", "المراجعة"];

export default function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [petType, setPetType] = useState("كلب");
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petNotes, setPetNotes] = useState("");

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [visitType, setVisitType] = useState<"clinic" | "home" | "telemedicine">("clinic");
  const [branchId, setBranchId] = useState<number | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/doctors").then((r) => r.json()),
      fetch("/api/branches").then((r) => r.json()),
    ]).then(([s, d, b]) => {
      setServices(s.items);
      setDoctors(d.items);
      setBranches(b.items);
      if (b.items[0]) setBranchId(b.items[0].id);

      const presetServiceSlug = searchParams.get("service");
      const presetDoctorSlug = searchParams.get("doctor");
      const presetVisit = searchParams.get("visitType");

      if (presetServiceSlug) {
        const found = s.items.find((x: Service) => x.slug === presetServiceSlug);
        if (found) setServiceId(found.id);
      }
      if (presetDoctorSlug) {
        const found = d.items.find((x: Doctor) => x.slug === presetDoctorSlug);
        if (found) setDoctorId(found.id);
      }
      if (presetVisit === "home" || presetVisit === "telemedicine" || presetVisit === "clinic") {
        setVisitType(presetVisit);
      }
      setLoadingData(false);
    });
  }, [searchParams]);

  const selectedService = services.find((s) => s.id === serviceId) ?? null;
  const eligibleDoctors = useMemo(
    () => (serviceId ? doctors.filter((d) => d.serviceIds.includes(serviceId)) : doctors),
    [doctors, serviceId]
  );

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setTime("");
    const params = new URLSearchParams({ date });
    if (doctorId) params.set("doctorId", String(doctorId));
    fetch(`/api/availability?${params}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [date, doctorId]);

  const minDate = new Date().toISOString().slice(0, 10);

  const canNext = () => {
    if (step === 0) return petName.trim().length > 0 && petType.trim().length > 0;
    if (step === 1) return serviceId !== null;
    if (step === 2) {
      if (visitType === "clinic") return branchId !== null;
      return true;
    }
    if (step === 3) return date !== "" && time !== "";
    if (step === 4) {
      if (visitType === "home" && !ownerAddress.trim()) return false;
      return ownerName.trim().length > 1 && ownerPhone.trim().length > 6;
    }
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petName,
          petType,
          petBreed,
          petAge,
          petNotes,
          serviceId,
          doctorId,
          branchId: visitType === "clinic" ? branchId : null,
          visitType,
          scheduledDate: date,
          scheduledTime: time,
          ownerName,
          ownerPhone,
          ownerEmail,
          ownerAddress,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر إرسال طلب الحجز.");
        setSubmitting(false);
        return;
      }
      router.push(`/booking/confirmation/${data.publicCode}`);
    } catch {
      setError("حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.");
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-pv-green" />
      </div>
    );
  }

  return (
    <div>
      {/* progress bar */}
      <div className="mb-10 flex items-center gap-1 sm:gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                i < step ? "bg-pv-green text-white" : i === step ? "bg-pv-honey text-pv-green-dark" : "bg-pv-border text-pv-stone"
              }`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className="hidden text-[10px] font-semibold text-pv-stone sm:block">{label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60 sm:p-8">
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-pv-green-dark">
              <PawPrint className="h-5 w-5 text-pv-teal" /> بيانات الحيوان
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-pv-text">نوع الحيوان</label>
                <select value={petType} onChange={(e) => setPetType(e.target.value)} className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal">
                  <option value="كلب">كلب</option>
                  <option value="قطة">قطة</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-pv-text">اسم الحيوان</label>
                <input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="مثال: لولو" className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-pv-text">السلالة (اختياري)</label>
                <input value={petBreed} onChange={(e) => setPetBreed(e.target.value)} className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-pv-text">العمر التقريبي (اختياري)</label>
                <input value={petAge} onChange={(e) => setPetAge(e.target.value)} placeholder="مثال: سنة ونصف" className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-pv-text">ملاحظات حول الزيارة (اختياري)</label>
                <textarea value={petNotes} onChange={(e) => setPetNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-pv-green-dark">
              <Stethoscope className="h-5 w-5 text-pv-teal" /> اختر الخدمة
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setServiceId(s.id);
                    if (!s.allowInClinic && s.allowHomeVisit) setVisitType("home");
                    else if (!s.allowInClinic && s.allowTelemedicine) setVisitType("telemedicine");
                    else setVisitType("clinic");
                  }}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-start transition ${
                    serviceId === s.id ? "border-pv-green bg-pv-cream" : "border-pv-border hover:border-pv-teal"
                  }`}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <Image src={s.imageUrl} alt={s.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-pv-text">{s.name}</p>
                    <p className="text-xs text-pv-stone">{s.durationMinutes} دقيقة تقريبًا</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedService && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-3 text-lg font-extrabold text-pv-green-dark">طريقة الزيارة</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {selectedService.allowInClinic && (
                  <button
                    onClick={() => setVisitType("clinic")}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-bold transition ${
                      visitType === "clinic" ? "border-pv-green bg-pv-cream text-pv-green-dark" : "border-pv-border text-pv-stone hover:border-pv-teal"
                    }`}
                  >
                    <MapPin className="h-5 w-5" /> داخل العيادة
                  </button>
                )}
                {selectedService.allowHomeVisit && (
                  <button
                    onClick={() => setVisitType("home")}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-bold transition ${
                      visitType === "home" ? "border-pv-green bg-pv-cream text-pv-green-dark" : "border-pv-border text-pv-stone hover:border-pv-teal"
                    }`}
                  >
                    <Home className="h-5 w-5" /> زيارة منزلية
                  </button>
                )}
                {selectedService.allowTelemedicine && (
                  <button
                    onClick={() => setVisitType("telemedicine")}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-bold transition ${
                      visitType === "telemedicine" ? "border-pv-green bg-pv-cream text-pv-green-dark" : "border-pv-border text-pv-stone hover:border-pv-teal"
                    }`}
                  >
                    <Video className="h-5 w-5" /> استشارة عن بعد
                  </button>
                )}
              </div>
            </div>

            {visitType === "clinic" && branches.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-bold text-pv-text">اختر الفرع</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBranchId(b.id)}
                      className={`rounded-xl border-2 p-3 text-start text-sm transition ${
                        branchId === b.id ? "border-pv-green bg-pv-cream" : "border-pv-border hover:border-pv-teal"
                      }`}
                    >
                      <p className="font-bold text-pv-text">{b.name}</p>
                      <p className="text-xs text-pv-stone">{b.address}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-2 text-sm font-bold text-pv-text">اختر الطبيب (اختياري)</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => setDoctorId(null)}
                  className={`rounded-xl border-2 p-3 text-start text-sm font-bold transition ${
                    doctorId === null ? "border-pv-green bg-pv-cream text-pv-green-dark" : "border-pv-border text-pv-stone hover:border-pv-teal"
                  }`}
                >
                  أي طبيب متاح
                </button>
                {eligibleDoctors.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDoctorId(d.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 p-3 text-start text-sm transition ${
                      doctorId === d.id ? "border-pv-green bg-pv-cream" : "border-pv-border hover:border-pv-teal"
                    }`}
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Image src={d.photoUrl} alt={d.name} fill className="object-cover" />
                    </div>
                    <span className="font-bold text-pv-text">{d.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-pv-green-dark">
              <CalendarDays className="h-5 w-5 text-pv-teal" /> اختر التاريخ والوقت
            </h2>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal sm:w-64"
            />
            {date && (
              <div>
                {loadingSlots ? (
                  <div className="flex h-24 items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-pv-green" />
                  </div>
                ) : slots.length === 0 ? (
                  <p className="rounded-xl bg-pv-cream p-4 text-sm text-pv-stone">
                    لا توجد مواعيد متاحة في هذا اليوم، يرجى اختيار تاريخ آخر.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setTime(s)}
                        className={`rounded-xl border-2 px-2 py-2.5 text-xs font-bold transition ${
                          time === s ? "border-pv-green bg-pv-green text-white" : "border-pv-border text-pv-text hover:border-pv-teal"
                        }`}
                      >
                        {formatTimeAr(s + ":00")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-pv-green-dark">
              <User className="h-5 w-5 text-pv-teal" /> بياناتك
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="الاسم الكامل" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              <input dir="ltr" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="رقم الهاتف" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
              <input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="البريد الإلكتروني (اختياري)" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal sm:col-span-2" />
              {visitType === "home" && (
                <textarea
                  value={ownerAddress}
                  onChange={(e) => setOwnerAddress(e.target.value)}
                  placeholder="عنوان الزيارة المنزلية"
                  rows={3}
                  className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal sm:col-span-2"
                />
              )}
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية (اختياري)" rows={2} className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal sm:col-span-2" />
            </div>
          </div>
        )}

        {step === 5 && selectedService && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-pv-green-dark">مراجعة تفاصيل الحجز</h2>
            <dl className="grid gap-3 rounded-2xl bg-pv-cream p-5 text-sm sm:grid-cols-2">
              <Row label="الحيوان" value={`${petName} (${petType})`} />
              <Row label="الخدمة" value={selectedService.name} />
              <Row
                label="طريقة الزيارة"
                value={visitType === "clinic" ? "داخل العيادة" : visitType === "home" ? "زيارة منزلية" : "استشارة عن بعد"}
              />
              {visitType === "clinic" && branchId && (
                <Row label="الفرع" value={branches.find((b) => b.id === branchId)?.name ?? ""} />
              )}
              <Row label="الطبيب" value={doctorId ? doctors.find((d) => d.id === doctorId)?.name ?? "" : "أي طبيب متاح"} />
              <Row label="الموعد" value={`${formatDateAr(date)} - ${formatTimeAr(time + ":00")}`} />
              <Row label="صاحب الحيوان" value={`${ownerName} - ${ownerPhone}`} />
            </dl>
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <button
              onClick={submit}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full pv-cta px-6 py-4 text-sm font-bold transition disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              إرسال طلب الحجز
            </button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-full border border-pv-border px-5 py-2.5 text-sm font-bold text-pv-text disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </button>
          {step < STEPS.length - 1 && (
            <button
              onClick={() => canNext() && setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canNext()}
              className="flex items-center gap-1.5 rounded-full pv-cta px-6 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-pv-stone">{label}</dt>
      <dd className="font-bold text-pv-text">{value}</dd>
    </div>
  );
}
