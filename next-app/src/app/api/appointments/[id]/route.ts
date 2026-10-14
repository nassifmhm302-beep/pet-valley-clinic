import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getIsAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const allowedStatus = ["pending", "confirmed", "rejected", "cancelled", "completed"];

  const update: Partial<typeof appointments.$inferInsert> = { updatedAt: new Date() };
  if (body.status) {
    if (!allowedStatus.includes(body.status)) {
      return NextResponse.json({ error: "حالة غير صحيحة." }, { status: 400 });
    }
    update.status = body.status;
  }
  if (typeof body.internalNotes === "string") update.internalNotes = body.internalNotes;

  const [updated] = await db
    .update(appointments)
    .set(update)
    .where(eq(appointments.id, Number(id)))
    .returning();

  if (!updated) return NextResponse.json({ error: "لم يتم العثور على الحجز." }, { status: 404 });
  return NextResponse.json({ appointment: updated });
}
