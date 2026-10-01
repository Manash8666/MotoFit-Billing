import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      take: 100, // Basic pagination cap
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(parts);
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
        price: parseFloat(price.toString().replace(/[^0-9.-]+/g, "")) || 0.00,
        stock: parseInt(stock) || 0
      }
    });

    return NextResponse.json(part, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
