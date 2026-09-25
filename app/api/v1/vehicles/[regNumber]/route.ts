import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-auth";

// GET /api/v1/vehicles/[regNumber] - Fetches complete service ledger for app/website
export async function GET(
  req: NextRequest,
  { params }: { params: { regNumber: string } }
) {
  if (!(await validateApiKey(req))) {
    return NextResponse.json({ error: "Unauthorized: Invalid or missing x-api-key" }, { status: 401 });
  }

  const reg = decodeURIComponent(params.regNumber).toUpperCase().trim();

  const vehicle = await prisma.vehicle.findUnique({
    where: { regNumber: reg },
    include: {
      customer: { select: { name: true, phone: true } },
      documents: {
        orderBy: { date: "desc" },
        include: { items: true },
      },
    },
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle record not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, vehicle });
}
