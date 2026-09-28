'use client';
import React from 'react';
import { ArrowLeft, PieChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function FinancialDashboardPage() {
  return (
    <div className="min-h-screen bg-[#050511] text-white p-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Launcher
        </Link>

        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <PieChart className="text-[#3b82f6]" size={40} />
              Financial Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Revenue, expenses, and overall analytics</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#10b981]/10 rounded-xl">
                <TrendingUp className="text-[#10b981]" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Total Revenue</h3>
            </div>
            <p className="text-4xl font-bold">₹0</p>
            <p className="text-sm text-gray-400 mt-2">This Month</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#f43f5e]/10 rounded-xl">
                <TrendingDown className="text-[#f43f5e]" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Total Expenses</h3>
            </div>
            <p className="text-4xl font-bold">₹0</p>
            <p className="text-sm text-gray-400 mt-2">This Month</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#3b82f6]/10 rounded-xl">
                <DollarSign className="text-[#3b82f6]" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Net Profit</h3>
            </div>
            <p className="text-4xl font-bold">₹0</p>
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
