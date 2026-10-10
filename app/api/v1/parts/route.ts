import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    const [parts, totalCount] = await Promise.all([
      prisma.part.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.part.count()
    ]);
    const response = NextResponse.json(parts);
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
    const { name, category, price, stock } = await req.json();

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const part = await prisma.part.create({
      data: {
        name,
        category: category || "",
        price: Number.parseFloat(price.toString().replace(/[^0-9.-]+/g, "")) || 0.00,
        stock: Number.parseInt(stock) || 0
      }
    });

    return NextResponse.json(part, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
