'use client';
import React from 'react';
import { ArrowLeft, ArrowRightLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-[#050511] text-white p-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#c084fc]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Launcher
        </Link>

        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <ArrowRightLeft className="text-[#c084fc]" size={40} />
              Transactions
            </h1>
            <p className="text-gray-400 mt-2">Ledger of all financial transactions</p>
          </div>
          <button className="bg-[#c084fc] hover:bg-[#c084fc]/80 text-white font-semibold py-3 px-6 rounded-xl transition-all">
            New Transaction
          </button>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 mb-6">
            <Search size={20} className="text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="bg-transparent border-none outline-none text-white w-full"
            />
          </div>
          <div className="text-center py-20 opacity-50">
            <ArrowRightLeft size={64} className="mx-auto mb-4 text-[#c084fc]" />
            <p className="text-xl">No transactions found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
