import { NextResponse } from "next/server";
import { getSpanishPlayers } from "@/lib/startgg";

export async function GET() {
  const data = getSpanishPlayers();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
