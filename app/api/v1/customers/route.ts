import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      where: { deletedAt: null },
      include: {
        vehicles: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = customers.map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      vehicle: c.vehicles.length > 0 ? c.vehicles[0].makeModel : 'No Vehicle',
      vehicles: c.vehicles,
      lastVisit: new Date(c.updatedAt).toLocaleDateString()
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, phone, vehicle } = await req.json();

    const customer = await prisma.customer.upsert({
      where: { phone },
      update: { name },
      create: {
        name,
        phone,
        vehicles: vehicle ? {
          create: [{ regNumber: `UNREG-${Date.now()}`, makeModel: vehicle, runningKm: 0 }]
        } : undefined
      }
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
