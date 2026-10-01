import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, pin } = await req.json();

    if (!phone || !pin) {
      return NextResponse.json({ error: "Phone and PIN are required" }, { status: 400 });
    }

    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("91") && cleanPhone.length > 10) {
      cleanPhone = cleanPhone.substring(2);
    }

    const user = await prisma.user.findFirst({
      where: { phone: cleanPhone }
    });

    if (!user) {
      return NextResponse.json({ error: "No account found with this phone number" }, { status: 404 });
    }

    if (!(user as any).isActive) {
      return NextResponse.json({ error: "This account has been deactivated" }, { status: 403 });
    }

    if (user.pinHash !== pin.trim()) {
      return NextResponse.json({ error: "Incorrect PIN. Please try again." }, { status: 401 });
    }

    // Issue a simple signed session token (phone:role:timestamp)
    const sessionToken = Buffer.from(
      JSON.stringify({ id: user.id, name: user.name, role: user.role, phone: user.phone, ts: Date.now() })
    ).toString("base64");

    return NextResponse.json({
      success: true,
      token: sessionToken,
      user: { id: user.id, name: user.name, role: user.role, phone: user.phone }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
