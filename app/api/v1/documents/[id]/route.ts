import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import * as jose from 'jose';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            customer: true
          }
        },
        items: true
      }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (document.isHidden) {
      const headersList = await headers();
      const authHeader = headersList.get('authorization');
      let isSamael = false;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_unsafe_secret_for_dev_only");
        try {
          const { payload } = await jose.jwtVerify(token, secret);
          if (payload.phone === "6359635416") isSamael = true;
        } catch (e) {}
      }
      if (!isSamael) {
        return NextResponse.json({ error: "Document is classified" }, { status: 403 });
      }
    }

    return NextResponse.json(document);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
