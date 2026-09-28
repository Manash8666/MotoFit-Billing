'use client';
import React from 'react';
import { ArrowLeft, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-[#050511] text-white p-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#34d399]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Launcher
        </Link>

        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <PlusCircle className="text-[#34d399]" size={40} />
              Credits
            </h1>
            <p className="text-gray-400 mt-2">Manage customer credit notes</p>
          </div>
          <button className="bg-[#34d399] hover:bg-[#34d399]/80 text-black font-semibold py-3 px-6 rounded-xl transition-all">
            New Credit Note
          </button>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 mb-6">
            <Search size={20} className="text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search credits..." 
              className="bg-transparent border-none outline-none text-white w-full"
            />
          </div>
          <div className="text-center py-20 opacity-50">
            <PlusCircle size={64} className="mx-auto mb-4 text-[#34d399]" />
            <p className="text-xl">No credit notes found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
