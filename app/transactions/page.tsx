'use client';
import React, { useState } from 'react';
import { Search, Plus, Home, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');

  const transactions = [
    { id: 'TRX-0992', type: 'Income', reference: 'INV-MF-209', date: '2023-10-25', account: 'HDFC Bank', amount: '₹14,500', status: 'Completed' },
    { id: 'TRX-0993', type: 'Expense', reference: 'EXP-001', date: '2023-10-26', account: 'Cash', amount: '₹1,200', status: 'Completed' },
    { id: 'TRX-0994', type: 'Income', reference: 'INV-MF-210', date: '2023-10-27', account: 'Stripe', amount: '₹8,400', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 font-sans flex flex-col">
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#161616]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium text-white">Transactions</h1>
          
          <div className="flex items-center bg-black/40 border border-white/10 rounded-md px-3 py-1.5 ml-2 w-80 focus-within:border-white/30 transition-all">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium border border-white/10 rounded-md hover:bg-white/5 transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-white text-black rounded-md hover:bg-gray-200 transition-colors">
            <Plus size={16} />
            New Transaction
          </button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 px-6 py-3 text-sm text-gray-400 border-b border-white/5 bg-[#111111]">
        <Link href="/" className="hover:text-white transition-colors">
          <Home size={16} />
        </Link>
        <span>/</span>
        <span className="text-gray-200">Transactions</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="border border-white/5 rounded-lg bg-[#161616] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Transaction ID</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Reference</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Account</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm font-medium text-blue-400 cursor-pointer hover:underline">{trx.id}</td>
                  <td className="p-4 text-sm flex items-center gap-2">
                    {trx.type === 'Income' ? (
                      <ArrowDownRight size={16} className="text-emerald-400" />
                    ) : (
                      <ArrowUpRight size={16} className="text-amber-400" />
                    )}
                    <span className={trx.type === 'Income' ? 'text-emerald-400' : 'text-amber-400'}>{trx.type}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-400 hover:text-white cursor-pointer hover:underline">{trx.reference}</td>
                  <td className="p-4 text-sm text-gray-400">{trx.date}</td>
                  <td className="p-4 text-sm text-white">{trx.account}</td>
                  <td className="p-4 text-sm text-white font-medium">{trx.amount}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                      trx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {transactions.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p>No transactions found.</p>
            </div>
          )}
          
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
            <div>Showing 1 to {transactions.length} of {transactions.length} entries</div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
