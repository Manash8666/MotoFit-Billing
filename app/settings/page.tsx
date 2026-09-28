'use client';
import React from 'react';
import { ArrowLeft, Sliders, Search } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#050511] text-white p-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#94a3b8]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Launcher
        </Link>

        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Sliders className="text-[#94a3b8]" size={40} />
              Settings
            </h1>
            <p className="text-gray-400 mt-2">Configure MotoFit system preferences</p>
          </div>
          <button className="bg-[#94a3b8] hover:bg-[#94a3b8]/80 text-black font-semibold py-3 px-6 rounded-xl transition-all">
            Save Changes
          </button>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Garage Name</label>
                  <input type="text" defaultValue="MotoFit (Nigam Nagar)" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Tax & Invoice</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Default Tax Rate (%)</label>
                  <input type="number" defaultValue="18" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Invoice Prefix</label>
                  <input type="text" defaultValue="INV-MF-" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
