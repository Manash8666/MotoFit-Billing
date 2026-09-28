import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-auth";

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

    const result = await prisma.$transaction(async (tx) => {
      // Upsert Customer
      let customer = await tx.customer.findFirst({ where: { phone: customerPhone } });
      if (!customer) {
        customer = await tx.customer.create({
          data: { name: customerName, phone: customerPhone },
        });
      }

      // Upsert Vehicle
      let vehicle = await tx.vehicle.findUnique({ where: { regNumber: cleanReg } });
      if (!vehicle) {
        vehicle = await tx.vehicle.create({
          data: {
            regNumber: cleanReg,
            makeModel,
            runningKm: Number(runningKm) || 0,
            customerId: customer.id,
          },
        });
      }

      // Get System Admin User
      let systemUser = await tx.user.findFirst({ where: { role: "SUPER_ADMIN" } });
      if (!systemUser) {
        systemUser = await tx.user.create({
          data: {
            name: "SYSTEM_SYNC",
            phone: "+919999999999",
            pinHash: "0000",
            role: "SUPER_ADMIN"
          }
        });
      }

      // Generate unique job card sequence
      const count = await tx.document.count();
      const docNumber = `MF2-JC-${(count + 1001).toString()}`;

      const jobCard = await tx.document.create({
        data: {
          docNumber,
          type: "JOB_CARD",
          status: "DRAFT",
          vehicleId: vehicle.id,
          complaints,
          subtotal: 0.0,
          finalTotal: 0.0,
          createdById: systemUser.id,
        },
      });

      // Log Security Audit
      await tx.auditLog.create({
        data: {
          userId: systemUser.id,
          action: "INTAKE_JOB_CARD_CREATED",
          entityType: "Document",
          entityId: jobCard.id,
          details: {
            source: "API_SYNC",
            docNumber: jobCard.docNumber
          },
          ipAddress: req.headers.get('x-forwarded-for') || "API"
        }
      });

      return jobCard;
    });

    return NextResponse.json({
      success: true,
      message: "Intake registered successfully at MotoFit 2",
      jobCardNumber: result.docNumber,
    });
  } catch (err: any) {
    console.error("Intake Sync Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
