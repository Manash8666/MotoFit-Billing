'use client';
import React, { useState } from 'react';
import { Search, Plus, Home, Filter, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function ExpensesPage() {
  const [search, setSearch] = useState('');

  const expenses = [
    { id: 'EXP-001', vendor: 'Nigam Nagar Hardware', date: '2023-10-10', category: 'Supplies', amount: '₹1,200', status: 'Logged' },
    { id: 'EXP-002', vendor: 'City Power Corp', date: '2023-10-15', category: 'Utilities', amount: '₹4,500', status: 'Billed' },
    { id: 'EXP-003', vendor: 'Tony Mechanic', date: '2023-10-22', category: 'Contractor', amount: '₹8,000', status: 'Logged' },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 font-sans flex flex-col">
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#161616]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium text-white">Expenses</h1>
          
          <div className="flex items-center bg-black/40 border border-white/10 rounded-md px-3 py-1.5 ml-2 w-80 focus-within:border-white/30 transition-all">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search expenses..." 
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
            New Expense
          </button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 px-6 py-3 text-sm text-gray-400 border-b border-white/5 bg-[#111111]">
        <Link href="/" className="hover:text-white transition-colors">
          <Home size={16} />
        </Link>
        <span>/</span>
        <span className="text-gray-200">Expenses</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="border border-white/5 rounded-lg bg-[#161616] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Expense Number</th>
                <th className="p-4 font-semibold">Vendor</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm font-medium text-blue-400 cursor-pointer hover:underline">{expense.id}</td>
                  <td className="p-4 text-sm text-white">{expense.vendor}</td>
                  <td className="p-4 text-sm text-gray-400">{expense.date}</td>
                  <td className="p-4 text-sm text-gray-300">{expense.category}</td>
                  <td className="p-4 text-sm text-white font-medium">{expense.amount}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                      expense.status === 'Billed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {expense.status}
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
          
          {expenses.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p>No expenses found.</p>
            </div>
          )}
          
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
            <div>Showing 1 to {expenses.length} of {expenses.length} entries</div>
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
