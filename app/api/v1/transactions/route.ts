import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    });

    const formatted = transactions.map(t => ({
      id: t.reference,
      type: t.type === 'CREDIT' ? 'Income' : t.type === 'DEBIT' ? 'Expense' : 'Expense',
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

    // Get a default user (temporary until auth is fully integrated)
    let defaultUser = await prisma.user.findFirst();
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

    const count = await prisma.transaction.count();
    const cleanAmount = parseFloat(amount.toString().replace(/[^0-9.-]+/g,""));

    const transaction = await prisma.transaction.create({
      data: {
        reference: `TRX-${1000 + count}`,
        type: type === 'Income' ? 'CREDIT' : 'EXPENSE',
        accountVendor: account,
        amount: cleanAmount,
        category: reference,
        status: 'COMPLETED',
        createdById: defaultUser.id,
      }
    });

    return NextResponse.json(transaction);
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
