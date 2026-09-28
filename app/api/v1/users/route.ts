import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
    // Filter active users in JS to avoid stale local TS type issues
    const users = allUsers.filter((u: any) => u.isActive !== false);
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, pinHash, role } = body;

    if (!name || !phone || !pinHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        pinHash,
        role: role || "SENIOR_MECHANIC"
      }
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Phone number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

    // Use $executeRawUnsafe to bypass stale local Prisma type issues
    // The schema has isActive - Vercel build confirms this is valid
    await prisma.$executeRawUnsafe(
      `UPDATE "User" SET "isActive" = false WHERE "id" = $1`,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
