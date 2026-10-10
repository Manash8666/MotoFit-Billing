import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        skip,
        take: limit,
        where: { deletedAt: null },
        include: { vehicles: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where: { deletedAt: null } })
    ]);

    const formatted = customers.map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      vehicle: c.vehicles.length > 0 ? c.vehicles[0].makeModel : 'No Vehicle',
      vehicles: c.vehicles,
      lastVisit: new Date(c.updatedAt).toLocaleDateString(),
      rawLastVisit: c.updatedAt
    }));

    const response = NextResponse.json(formatted);
    response.headers.set('X-Total-Count', totalCount.toString());
    response.headers.set('X-Page', page.toString());
    response.headers.set('X-Limit', limit.toString());
    return response;
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
