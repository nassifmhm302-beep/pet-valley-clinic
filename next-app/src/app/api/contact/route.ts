import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { getIsAdmin } from "@/lib/auth";
import { desc } from "drizzle-orm";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(5),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح." }, { status: 400 });
  }
  const data = parsed.data;
  await db.insert(contactMessages).values({
    name: data.name,
    phone: data.phone || null,
    email: data.email || null,
    subject: data.subject || null,
    message: data.message,
  });
  return NextResponse.json({ success: true });
}

export async function GET() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  const items = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  return NextResponse.json({ items });
}
