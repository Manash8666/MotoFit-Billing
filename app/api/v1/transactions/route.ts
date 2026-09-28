import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    });

    const formatted = transactions.map(t => ({
      id: t.reference,
      type: t.type === 'CREDIT' ? 'Income' : 'Expense',
      reference: t.category || '-',
      date: new Date(t.date).toISOString().split('T')[0],
      account: t.accountVendor,
      amount: `₹${t.amount.toString()}`,
      status: t.status === 'COMPLETED' ? 'Completed' : 'Pending'
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, reference, account, amount } = await req.json();

    if (!account || !amount) {
      return NextResponse.json({ error: "Missing account or amount" }, { status: 400 });
    }

    // Get or create system user
    let defaultUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN', deletedAt: null } });
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          name: "System Admin",
          phone: "+910000000000",
          pinHash: "0000",
          role: "SUPER_ADMIN"
        }
      });
    }

    // Use timestamp + random to avoid race conditions on unique reference
    const uniqueSuffix = Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
    const cleanAmount = parseFloat(amount.toString().replace(/[^0-9.-]+/g, ""));

    const transaction = await prisma.transaction.create({
      data: {
        reference: `TRX-${uniqueSuffix}`,
        type: type === 'Income' ? 'CREDIT' : 'DEBIT',
        accountVendor: account,
        amount: cleanAmount,
        category: reference || type,
        status: 'COMPLETED',
        createdById: defaultUser.id,
      }
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Duplicate reference, please retry" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
