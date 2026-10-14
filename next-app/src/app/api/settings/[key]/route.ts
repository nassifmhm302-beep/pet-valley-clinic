import { NextRequest, NextResponse } from "next/server";
import { getSetting } from "@/db/queries";

export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const value = await getSetting(key, null);
  return NextResponse.json({ value });
}
