import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-auth";

// POST /api/v1/intake - Sync bookings directly from customer-facing web/app
export async function POST(req: NextRequest) {
  if (!(await validateApiKey(req))) {
    return NextResponse.json({ error: "Unauthorized: Invalid x-api-key" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { customerName, customerPhone, regNumber, makeModel, runningKm, complaints } = body;

    if (!customerPhone || !regNumber || !makeModel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanReg = regNumber.toUpperCase().trim();

    // Upsert Customer
    let customer = await prisma.customer.findFirst({ where: { phone: customerPhone } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: { name: customerName, phone: customerPhone },
      });
    }

    // Upsert Vehicle
    let vehicle = await prisma.vehicle.findUnique({ where: { regNumber: cleanReg } });
    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          regNumber: cleanReg,
          makeModel,
          runningKm: Number(runningKm) || 0,
          customerId: customer.id,
        },
      });
    }

    // Generate unique job card sequence
    const count = await prisma.document.count();
    const docNumber = `MF2-JC-${(count + 1001).toString()}`;

    const jobCard = await prisma.document.create({
      data: {
        docNumber,
        type: "JOB_CARD",
        status: "DRAFT",
        vehicleId: vehicle.id,
        complaints,
        subtotal: 0.0,
        finalTotal: 0.0,
        createdById: "SYSTEM_SYNC",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Intake registered successfully at MotoFit 2",
      jobCardNumber: jobCard.docNumber,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
