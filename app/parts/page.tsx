'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Plus, Search, Box, X } from 'lucide-react';
import Link from 'next/link';
import Papa from 'papaparse';

export default function PartsPage() {
  const [parts, setParts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', price: '' });

  useEffect(() => {
    fetch('/api/v1/parts')
      .then(res => res.json())
      .then(data => {
        setParts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredParts = parts.filter(part => {
    const nameMatch = (part.name || part.model || '').toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = (part.category || part.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || catMatch;
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          price: newItem.price,
          stock: 10
        })
      });
      if (res.ok) {
        const latest = await fetch('/api/v1/parts').then(r => r.json());
        setParts(latest);
        setNewItem({ name: '', category: '', price: '' });
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save part");
      }
    } catch (err) {
      alert("Failed to save part (Network error)");
    }
  };

  return (
    <div className="min-h-screen bg-[#050511] text-white p-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#8b5cf6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b132b] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="text-[#8b5cf6]" size={24} /> New Part
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Part Name</label>
                <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-[#1a233a] border border-white/10 rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category / Brand</label>
                <input required type="text" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-[#1a233a] border border-white/10 rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                <input required type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-[#1a233a] border border-white/10 rounded-lg p-2.5 text-white" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#8b5cf6] text-white font-medium hover:bg-[#8b5cf6]/80 transition-colors">Save Part</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          <button onClick={() => setIsModalOpen(true)} className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all">
            <Plus size={20} />
            New Item
          </button>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 mb-6">
            <Search size={20} className="text-gray-400 mr-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parts by name, SKU, or category..." 
              className="bg-transparent border-none outline-none text-white w-full"
            />
          </div>

          {loading ? (
            <div className="text-center py-20 opacity-50">
              <p>Loading inventory...</p>
            </div>
          ) : filteredParts.length > 0 ? (
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
                  {filteredParts.slice(0, 50).map((part, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-white">{part.name || part.model || 'Unknown Part'}</td>
                      <td className="p-4 text-gray-400">{part.category || part.brand || 'General'}</td>
                      <td className="p-4 text-right font-medium text-[#8b5cf6]">{part.price ? `₹${part.price}` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredParts.length > 50 && (
                <div className="text-center mt-6 text-sm text-gray-400">Showing first 50 results...</div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 opacity-50">
              <Box size={64} className="mx-auto mb-4 text-[#8b5cf6]" />
              <p className="text-xl">No parts found matching "{searchQuery}"</p>
              <p className="text-sm mt-2">Try a different search term or add a new part.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
