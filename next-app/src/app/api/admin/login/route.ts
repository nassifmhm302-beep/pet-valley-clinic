import { NextRequest, NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    await setAdminSession();
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة." }, { status: 401 });
}
