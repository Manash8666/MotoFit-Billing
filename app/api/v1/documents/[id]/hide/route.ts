import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import * as jose from 'jose';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { isHidden } = body;

    // VERY STRICT SECURITY: Only Samael (6359635416) can hit this route.
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_unsafe_secret_for_dev_only");
    const { payload } = await jose.jwtVerify(token, secret);

    if (payload.phone !== "6359635416") {
      return NextResponse.json({ error: "Forbidden: Only Samael can perform this action." }, { status: 403 });
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: { isHidden }
    });

    return NextResponse.json({ success: true, document: updatedDocument });
  } catch (error: any) {
    console.error("Hide document error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
