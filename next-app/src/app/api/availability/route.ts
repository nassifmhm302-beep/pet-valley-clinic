import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { doctorAvailability, appointments } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

const DEFAULT_START = "10:00";
const DEFAULT_END = "20:00";
const DEFAULT_SLOT_MINUTES = 30;
const DEFAULT_CAPACITY = 3;

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function minutesToTime(min: number) {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function isSameOrAfterNow(dateStr: string, time: string) {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Amman" })
  );
  const slotDate = new Date(`${dateStr}T${time}:00`);
  return slotDate.getTime() > now.getTime();
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const date = sp.get("date");
  const doctorId = sp.get("doctorId") ? Number(sp.get("doctorId")) : null;

  if (!date) {
    return NextResponse.json({ error: "التاريخ مطلوب." }, { status: 400 });
  }

  const weekday = new Date(`${date}T00:00:00`).getDay();

  let slots: string[] = [];

  if (doctorId) {
    const avail = await db
      .select()
      .from(doctorAvailability)
      .where(
        and(
          eq(doctorAvailability.doctorId, doctorId),
          eq(doctorAvailability.weekday, weekday),
          eq(doctorAvailability.isActive, true)
        )
      );
    for (const a of avail) {
      const start = timeToMinutes(a.startTime.slice(0, 5));
      const end = timeToMinutes(a.endTime.slice(0, 5));
      for (let m = start; m + a.slotMinutes <= end; m += a.slotMinutes) {
        slots.push(minutesToTime(m));
      }
    }
  } else {
    const start = timeToMinutes(DEFAULT_START);
    const end = timeToMinutes(DEFAULT_END);
    for (let m = start; m + DEFAULT_SLOT_MINUTES <= end; m += DEFAULT_SLOT_MINUTES) {
      slots.push(minutesToTime(m));
    }
  }

  slots = slots.filter((s) => isSameOrAfterNow(date, s));

  const existing = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.scheduledDate, date),
        inArray(appointments.status, ["pending", "confirmed"])
      )
    );

  const booked = doctorId ? existing.filter((e) => e.doctorId === doctorId) : existing;
  const bookedCounts = new Map<string, number>();
  for (const b of booked) {
    const t = b.scheduledTime.slice(0, 5);
    bookedCounts.set(t, (bookedCounts.get(t) ?? 0) + 1);
  }

  const available = slots.filter((s) => {
    const count = bookedCounts.get(s) ?? 0;
    return doctorId ? count === 0 : count < DEFAULT_CAPACITY;
  });

  return NextResponse.json({ slots: available });
}
