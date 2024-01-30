import { NextRequest, NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  const chunk = await request.json();
  // handle chunk
  await sleep(5000);
  return NextResponse.json("ok");
}
