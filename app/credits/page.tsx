'use client';
import React, { useState } from 'react';
import { Search, Plus, Home, Filter, MoreHorizontal, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function CreditsPage() {
  const [search, setSearch] = useState('');

  const credits = [
    { id: 'CR-001', client: 'Arjun Mehta', date: '2023-10-12', amount: '₹1,500', balance: '₹1,500', status: 'Available' },
    { id: 'CR-002', client: 'Priya Sharma', date: '2023-10-14', amount: '₹500', balance: '₹0', status: 'Applied' },
    { id: 'CR-003', client: 'Rahul Desai', date: '2023-10-20', amount: '₹2,000', balance: '₹1,200', status: 'Partial' },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 font-sans flex flex-col">
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#161616]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium text-white">Credits</h1>
          
          <div className="flex items-center bg-black/40 border border-white/10 rounded-md px-3 py-1.5 ml-2 w-80 focus-within:border-white/30 transition-all">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search credits or clients..." 
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
            New Credit
          </button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 px-6 py-3 text-sm text-gray-400 border-b border-white/5 bg-[#111111]">
        <Link href="/" className="hover:text-white transition-colors">
          <Home size={16} />
        </Link>
        <span>/</span>
        <span className="text-gray-200">Credits</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="border border-white/5 rounded-lg bg-[#161616] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Credit Number</th>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Balance</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {credits.map((credit, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm font-medium text-blue-400 cursor-pointer hover:underline">{credit.id}</td>
                  <td className="p-4 text-sm text-white">{credit.client}</td>
                  <td className="p-4 text-sm text-gray-400">{credit.date}</td>
                  <td className="p-4 text-sm text-white font-medium">{credit.amount}</td>
                  <td className="p-4 text-sm text-gray-400">{credit.balance}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                      credit.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      credit.status === 'Applied' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {credit.status}
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
          
          {credits.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p>No credit notes found.</p>
            </div>
          )}
          
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
            <div>Showing 1 to {credits.length} of {credits.length} entries</div>
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
