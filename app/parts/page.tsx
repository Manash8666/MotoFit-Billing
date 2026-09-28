'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Plus, Search, Box } from 'lucide-react';
import Link from 'next/link';
import Papa from 'papaparse';

export default function PartsPage() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/bikesDatabase.csv')
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setParts(results.data);
            setLoading(false);
          }
        });
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#050511] text-white p-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#8b5cf6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Link>

        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Settings className="text-[#8b5cf6]" size={40} />
              Parts & Services
            </h1>
            <p className="text-gray-400 mt-2">Manage inventory and labor catalogs</p>
          </div>
          <button className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all">
            <Plus size={20} />
            New Item
          </button>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 mb-6">
            <Search size={20} className="text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search parts by name, SKU, or category..." 
              className="bg-transparent border-none outline-none text-white w-full"
            />
          </div>

          {loading ? (
            <div className="text-center py-20 opacity-50">
              <p>Loading inventory...</p>
            </div>
          ) : parts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-gray-400 font-medium">Part/Vehicle Name</th>
                    <th className="p-4 text-gray-400 font-medium">Category</th>
                    <th className="p-4 text-gray-400 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.slice(0, 20).map((part, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-white">{part.name || part.model || 'Unknown Part'}</td>
                      <td className="p-4 text-gray-400">{part.category || part.brand || 'General'}</td>
                      <td className="p-4 text-right font-medium text-[#8b5cf6]">{part.price ? `₹${part.price}` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parts.length > 20 && (
                <div className="text-center mt-6 text-sm text-gray-400">Showing first 20 items...</div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 opacity-50">
              <Box size={64} className="mx-auto mb-4 text-[#8b5cf6]" />
              <p className="text-xl">No parts found.</p>
              <p className="text-sm mt-2">Add items to your inventory to speed up billing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
