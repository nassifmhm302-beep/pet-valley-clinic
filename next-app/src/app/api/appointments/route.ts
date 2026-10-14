import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { appointments, services, doctors } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { generateCode } from "@/lib/format";
import { getIsAdmin } from "@/lib/auth";

const schema = z.object({
  petName: z.string().min(1),
  petType: z.string().min(1),
  petBreed: z.string().optional(),
  petAge: z.string().optional(),
  petNotes: z.string().optional(),
  serviceId: z.number(),
  doctorId: z.number().nullable().optional(),
  branchId: z.number().nullable().optional(),
  visitType: z.enum(["clinic", "home", "telemedicine"]),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  ownerName: z.string().min(2),
  ownerPhone: z.string().min(7),
  ownerEmail: z.string().email().optional().or(z.literal("")),
  ownerAddress: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "يرجى التحقق من بيانات الحجز المدخلة." }, { status: 400 });
  }
  const data = parsed.data;

  const service = (await db.select().from(services).where(eq(services.id, data.serviceId)).limit(1))[0];
  if (!service || !service.isActive) {
    return NextResponse.json({ error: "الخدمة المختارة غير متاحة." }, { status: 400 });
  }
  if (data.visitType === "home" && !service.allowHomeVisit) {
    return NextResponse.json({ error: "هذه الخدمة لا تدعم الزيارة المنزلية حاليًا." }, { status: 400 });
  }
  if (data.visitType === "telemedicine" && !service.allowTelemedicine) {
    return NextResponse.json({ error: "هذه الخدمة لا تدعم الاستشارة عن بعد حاليًا." }, { status: 400 });
  }
  if (data.visitType === "clinic" && !service.allowInClinic) {
    return NextResponse.json({ error: "هذه الخدمة لا تتوفر داخل العيادة حاليًا." }, { status: 400 });
  }
  if (data.visitType === "home" && !data.ownerAddress) {
    return NextResponse.json({ error: "عنوان الزيارة المنزلية مطلوب." }, { status: 400 });
  }

  if (data.doctorId) {
    const doctor = (await db.select().from(doctors).where(eq(doctors.id, data.doctorId)).limit(1))[0];
    if (!doctor || !doctor.isActive) {
      return NextResponse.json({ error: "الطبيب المختار غير متاح." }, { status: 400 });
    }
  }

  // Re-check conflict to avoid double booking
  const sameSlot = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.scheduledDate, data.scheduledDate),
        eq(appointments.scheduledTime, data.scheduledTime + ":00"),
        inArray(appointments.status, ["pending", "confirmed"])
      )
    );

  if (data.doctorId) {
    const conflict = sameSlot.some((a) => a.doctorId === data.doctorId);
    if (conflict) {
      return NextResponse.json({ error: "تم حجز هذا الموعد للتو، يرجى اختيار وقت آخر." }, { status: 409 });
    }
  } else if (sameSlot.length >= 3) {
    return NextResponse.json({ error: "هذا الوقت ممتلئ، يرجى اختيار وقت آخر." }, { status: 409 });
  }

  const publicCode = generateCode("APT");

  const [appointment] = await db
    .insert(appointments)
    .values({
      publicCode,
      petName: data.petName,
      petType: data.petType,
      petBreed: data.petBreed || null,
      petAge: data.petAge || null,
      petNotes: data.petNotes || null,
      serviceId: data.serviceId,
      doctorId: data.doctorId || null,
      branchId: data.branchId || null,
      visitType: data.visitType,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime + ":00",
      ownerName: data.ownerName,
      ownerPhone: data.ownerPhone,
      ownerEmail: data.ownerEmail || null,
      ownerAddress: data.ownerAddress || null,
      notes: data.notes || null,
      status: "pending",
    })
    .returning();

  return NextResponse.json({ publicCode: appointment.publicCode, id: appointment.id });
}

export async function GET(req: NextRequest) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

  const rows = await db.select().from(appointments).orderBy(appointments.createdAt);
  return NextResponse.json({ items: rows.reverse() });
}
