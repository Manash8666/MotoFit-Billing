'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, PieChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function FinancialDashboardPage() {
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    fetch('/api/v1/transactions')
      .then(res => res.json())
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        let rev = 0;
        let exp = 0;
        data.forEach(t => {
          const raw = t.amount ? t.amount.toString().replace(/[^0-9.-]+/g, "") : "0";
          const val = parseFloat(raw) || 0;
          if (t.type === 'Income') rev += val;
          if (t.type === 'Expense') exp += val;
        });
        setRevenue(rev);
        setExpenses(exp);
      })
      .catch(console.error);
  }, []);

  const netProfit = revenue - expenses;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#050511] to-black text-white p-8 font-sans relative overflow-hidden flex flex-col">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#3b82f6]/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Launcher
        </Link>

        <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-3">
              <PieChart className="text-[#3b82f6]" size={32} />
              Financial Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">Revenue, expenses, and overall analytics</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white/10 to-transparent border border-t-white/30 border-l-white/20 border-b-black/50 border-r-black/50 shadow-xl rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none rounded-3xl"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-[#10b981]/20 border border-[#10b981]/30 rounded-xl shadow-inner">
                <TrendingUp className="text-[#10b981]" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Total Revenue</h3>
            </div>
            <p className="text-4xl font-bold">₹{revenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-400 mt-2">All Time</p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-transparent border border-t-white/30 border-l-white/20 border-b-black/50 border-r-black/50 shadow-xl rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none rounded-3xl"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-[#f43f5e]/20 border border-[#f43f5e]/30 rounded-xl shadow-inner">
                <TrendingDown className="text-[#f43f5e]" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Total Expenses</h3>
            </div>
            <p className="text-4xl font-bold">₹{expenses.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-400 mt-2">All Time</p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-transparent border border-t-white/30 border-l-white/20 border-b-black/50 border-r-black/50 shadow-xl rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none rounded-3xl"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-[#3b82f6]/20 border border-[#3b82f6]/30 rounded-xl shadow-inner">
                <DollarSign className="text-[#3b82f6]" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Net Profit</h3>
            </div>
            <p className="text-4xl font-bold">₹{netProfit.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-400 mt-2">This Month</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl h-64 flex items-center justify-center">
          <p className="text-gray-500">Charts & detailed analytics will appear here as data populates.</p>
        </div>

      </div>
    </div>
  );
}
