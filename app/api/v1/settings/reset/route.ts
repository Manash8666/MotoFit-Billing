import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { confirmation } = await req.json();

    if (confirmation !== "CONFIRM_RESET") {
      return NextResponse.json({ error: "Invalid confirmation code" }, { status: 400 });
    }

    // Wrap in a transaction or execute sequentially
    await prisma.auditLog.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.lineItem.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.customer.deleteMany({});
    // We intentionally do not delete ApiClient to keep API access active if configured
    await prisma.user.deleteMany({});
    await prisma.part.deleteMany({});

    return NextResponse.json({ success: true, message: "Database wiped successfully" });
  } catch (error: any) {
    console.error("Failed to reset database:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
