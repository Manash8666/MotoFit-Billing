import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateInvoiceTotals } from "@/lib/billing-calculations";
import crypto from "crypto";

import { headers } from "next/headers";
import * as jose from 'jose';

export async function GET(req: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    let isSamael = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_unsafe_secret_for_dev_only");
      try {
        const { payload } = await jose.jwtVerify(token, secret);
        if (payload.phone === "6359635416") isSamael = true;
      } catch (e) {
        // invalid token
      }
    }

    const whereClause = isSamael ? {} : { isHidden: false };

    const documents = await prisma.document.findMany({
      take: 100, // Basic pagination cap to prevent memory crashes
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          include: {
            customer: true
          }
        },
        items: true
      }
    });
    return NextResponse.json(documents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      docType, docNumber, date, 
      customerName, customerPhone, 
      vehicleReg, makeModel, runningKm, 
      workTypeNote, paymentMethod, items,
      proofImage 
    } = body;

    if (!docNumber || !vehicleReg || !customerPhone || !customerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Calculate Totals using our trusted strict logic (MDR + Discounts)
    const breakdown = calculateInvoiceTotals({
      invoiceDate: date,
      paymentMethod: paymentMethod || "CASH",
      items: items
    });

    let finalDocNumber = docNumber;
    let attempt = 0;
    let result;

    while (attempt < 5) {
      try {
        result = await prisma.$transaction(async (tx) => {
          if (docNumber === "AUTO") {
            const count = await tx.document.count({ where: { type: docType } });
            const prefix = docType === "SOW_BILL" ? "MF2-PASS-" : "MF2-EST-";
            // Format number to be at least 2 digits
            const seq = (count + 1).toString().padStart(2, '0');
            finalDocNumber = `${prefix}${seq}`;
          }

          // Upsert Customer
          let customer = await tx.customer.upsert({
            where: { phone: customerPhone },
            update: { name: customerName },
            create: { name: customerName, phone: customerPhone }
          });

          // Upsert Vehicle
          let vehicle = await tx.vehicle.findUnique({
            where: { regNumber: vehicleReg }
          });
          if (!vehicle) {
            vehicle = await tx.vehicle.create({
              data: {
                regNumber: vehicleReg,
                makeModel: makeModel || "Unknown",
                runningKm: runningKm || 0,
                customerId: customer.id
              }
            });
          }

          // Get a default user (temporary until auth is fully integrated)
          let defaultUser = await tx.user.findFirst({ where: { role: 'SUPER_ADMIN', deletedAt: null } });
          if (!defaultUser) {
            defaultUser = await tx.user.create({
              data: {
                name: "System Admin",
                phone: "+910000000000",
                pinHash: "0000",
                role: "SUPER_ADMIN"
              }
            });
          }

          const initialStatus = docType === "SOW_BILL" ? "DRAFT" : "ESTIMATE_CREATED";

          // Create Document
          const document = await tx.document.create({
            data: {
              docNumber: finalDocNumber,
              type: docType,
              status: initialStatus,
              date: new Date(date),
              vehicleId: vehicle.id,
              workTypeNote,
              paymentMethod: docType === "SOW_BILL" ? paymentMethod : null,
              subtotal: breakdown.subtotal,
              mdrSurcharge: breakdown.mdrSurcharge,
              finalTotal: breakdown.finalTotal,
              createdById: defaultUser.id,
              proofImage: proofImage || null,
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
              vehicle: { include: { customer: true } }
            }
          });

          // Create highly secure Audit Log entry
          await tx.auditLog.create({
            data: {
              userId: defaultUser.id,
              action: "DOCUMENT_CREATED",
              entityType: "Document",
              entityId: document.id,
              details: {
                docNumber: finalDocNumber,
                type: docType,
                status: initialStatus,
                total: breakdown.finalTotal
              },
              ipAddress: req.headers.get('x-forwarded-for') || "unknown"
            }
          });

          return document;
        }, { maxWait: 10000, timeout: 30000 });

        // Break loop on success
        break;

      } catch (error: any) {
        if (error.code === 'P2002' && docNumber === "AUTO") {
          // Unique constraint failed, meaning another phone generated this ID at the exact same millisecond. Retry!
          attempt++;
          if (attempt >= 5) throw new Error("System is too busy. Please try generating the bill again.");
          continue;
        }
        throw error;
      }
    }

    return NextResponse.json({ success: true, document: result }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating document:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Document number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
