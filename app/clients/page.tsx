'use client';
import React from 'react';
import { ArrowLeft, Users, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-[#050511] text-white p-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Link>

        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Users className="text-[#10b981]" size={40} />
              Clients Directory
            </h1>
            <p className="text-gray-400 mt-2">Manage customer records and history</p>
          </div>
          <button className="bg-[#10b981] hover:bg-[#10b981]/80 text-black font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all">
            <Plus size={20} />
            New Client
          </button>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 mb-6">
            <Search size={20} className="text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search clients by name, phone, or vehicle..." 
              className="bg-transparent border-none outline-none text-white w-full"
            />
          </div>

          <div className="text-center py-20 opacity-50">
            <Users size={64} className="mx-auto mb-4 text-[#10b981]" />
            <p className="text-xl">No clients found.</p>
            <p className="text-sm mt-2">Add a new client to start tracking service history.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
