import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      docType, docNumber, date, 
      customerName, customerPhone, 
      vehicleReg, makeModel, runningKm, 
      workTypeNote, paymentMethod, items 
    } = body;

    if (!docNumber || !vehicleReg || !customerPhone || !customerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert Customer
    let customer = await prisma.customer.findFirst({
      where: { phone: customerPhone }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone
        }
      });
    }

    // Upsert Vehicle
    let vehicle = await prisma.vehicle.findUnique({
      where: { regNumber: vehicleReg }
    });

    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          regNumber: vehicleReg,
          makeModel: makeModel || "Unknown",
          runningKm: runningKm || 0,
          customerId: customer.id
        }
      });
    }

    // Calculate totals on backend for safety
    let subtotal = 0;
    items.forEach((item: any) => {
      const disc = item.mrpDiscount || 0;
      const netRate = item.rate * (1 - disc / 100);
      const lineTotal = netRate * item.quantity;
      subtotal += lineTotal;
    });

    const finalTotal = subtotal; // Ignoring MDR for now

    // Get a default user (temporary until auth is fully integrated)
    let defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          name: "System Admin",
          phone: "+910000000000",
          pinHash: "0000"
        }
      });
    }

    // Create Document
    const document = await prisma.document.create({
      data: {
        docNumber,
        type: docType,
        status: docType === "SOW_BILL" ? "DRAFT" : "ESTIMATE_CREATED",
        date: new Date(date),
        vehicleId: vehicle.id,
        workTypeNote,
        paymentMethod: docType === "SOW_BILL" ? paymentMethod : null,
        subtotal: subtotal,
        mdrSurcharge: 0,
        finalTotal: finalTotal,
        createdById: defaultUser.id,
        items: {
          create: items.map((item: any, idx: number) => {
            const disc = item.mrpDiscount || 0;
            const netRate = item.rate * (1 - disc / 100);
            return {
              sortOrder: idx,
              sectionName: item.sectionName,
              title: item.title,
              description: item.description,
              quantity: item.quantity,
              qtyUnit: item.qtyUnit,
              rate: item.rate,
              mrpDiscount: item.mrpDiscount,
              amount: netRate * item.quantity
            };
          })
        }
      },
      include: {
        items: true,
        vehicle: {
          include: { customer: true }
        }
      }
    });

    return NextResponse.json({ success: true, document }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating document:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Document number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
