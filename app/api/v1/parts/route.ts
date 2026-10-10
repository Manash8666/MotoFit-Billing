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
    console.error("[Parts API Error]:", error);
    return NextResponse.json({ error: "An unexpected error occurred processing parts." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, category, price, stock } = await req.json();

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedPrice = Number.parseFloat(price?.toString().replace(/[^0-9.-]+/g, ""));
    const parsedStock = Number.parseInt(stock);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "Price must be a valid positive number" }, { status: 400 });
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      return NextResponse.json({ error: "Stock must be a valid positive number" }, { status: 400 });
    }

    const part = await prisma.part.create({
      data: {
        name,
        category: category || "",
        price: parsedPrice,
        stock: parsedStock
      }
    });

    return NextResponse.json(part, { status: 201 });
  } catch (error: any) {
    console.error("[Parts API Error]:", error);
    return NextResponse.json({ error: "An unexpected error occurred processing parts." }, { status: 500 });
  }
}
