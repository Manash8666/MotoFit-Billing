import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const { id, name, phone, oldPin, newPin } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update payload
    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) {
      const phoneClean = phone.replace(/[^0-9+]/g, "");
      // Check if phone belongs to someone else
      const existingPhone = await prisma.user.findUnique({ where: { phone: phoneClean } });
      if (existingPhone && existingPhone.id !== id) {
        return NextResponse.json({ error: "Phone number already in use by another account" }, { status: 400 });
      }
      updateData.phone = phoneClean;
    }

    // Pin change logic
    if (newPin) {
      if (!oldPin) {
        return NextResponse.json({ error: "Current PIN is required to change to a new PIN" }, { status: 400 });
      }
      if (user.pinHash !== oldPin) {
        return NextResponse.json({ error: "Incorrect Current PIN" }, { status: 401 });
      }
      if (newPin.length !== 4) {
        return NextResponse.json({ error: "New PIN must be 4 digits" }, { status: 400 });
      }
      updateData.pinHash = newPin;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role
      } 
    });

  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
