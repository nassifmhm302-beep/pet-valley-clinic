import { NextResponse } from "next/server";
import { getActiveBranches } from "@/db/queries";

export async function GET() {
  const items = await getActiveBranches();
  return NextResponse.json({ items });
}
