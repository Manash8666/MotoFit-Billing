import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";



export async function POST(req: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is missing");
    }

    const { phone, pin } = await req.json();

    if (!phone || !pin) {
      return NextResponse.json({ error: "Phone and PIN are required" }, { status: 400 });
    }

    let cleanPhone = phone.replace(/\D/g, "");
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

    const isPinValid = await bcrypt.compare(pin.trim(), user.pinHash);

    if (!isPinValid) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: { increment: 1 } }
      });
      
      if (updatedUser.failedAttempts >= 5) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isActive: false }
        });
        return NextResponse.json({ error: "Account locked due to too many failed attempts. Contact Super Admin." }, { status: 403 });
      }
      return NextResponse.json({ error: "Incorrect PIN. Please try again." }, { status: 401 });
    }

    const updateData: any = { lastLogin: new Date() };
    if (user.failedAttempts > 0) updateData.failedAttempts = 0;

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    // Issue a cryptographically signed JWT
    const sessionToken = jwt.sign(
      { id: user.id, name: user.name, role: user.role, phone: user.phone },
      JWT_SECRET as string,
      { expiresIn: '7d' } // Expire in 7 days
    );

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
