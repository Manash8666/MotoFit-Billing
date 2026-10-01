'use client';
import { apiClient } from '@/lib/api-client';
import React, { useState, useEffect } from 'react';
import { FileText, Search, Copy, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InvoicesPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    apiClient.fetch('/api/v1/documents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDocuments(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load documents", err);
        setIsLoading(false);
      });
  }, []);

  const filteredDocs = documents.filter(doc => 
    doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.vehicle?.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.vehicle?.regNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[#1a233a] rounded-full transition-colors">
            <ArrowLeft className="text-[#f04923]" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Invoice History</h1>
            <p className="text-gray-400 mt-1">View, reprint, or duplicate past bills and estimates</p>
          </div>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-8 backdrop-blur-xl">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 mb-6">
            <Search size={20} className="text-gray-400 mr-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Bill No, Customer Name, or Vehicle Reg..." 
              className="bg-transparent border-none outline-none text-white w-full"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-400">Loading documents...</div>
          ) : filteredDocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-gray-400 font-medium">Bill No</th>
                    <th className="p-4 text-gray-400 font-medium">Date</th>
                    <th className="p-4 text-gray-400 font-medium">Customer</th>
                    <th className="p-4 text-gray-400 font-medium">Vehicle</th>
                    <th className="p-4 text-gray-400 font-medium text-right">Amount</th>
                    <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-white">{doc.docNumber}</td>
                      <td className="p-4 text-gray-400">{new Date(doc.date).toLocaleDateString()}</td>
                      <td className="p-4 text-gray-400">{doc.vehicle?.customer?.name || 'Unknown'}</td>
                      <td className="p-4 text-[#06b6d4]">{doc.vehicle?.regNumber || 'Unknown'}</td>
                      <td className="p-4 text-right font-medium text-[#10b981]">₹{doc.finalTotal}</td>
                      <td className="p-4 text-right">
                        <Link 
                          href={`/bill?duplicate=${doc.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f04923] text-white text-xs rounded hover:bg-red-600 transition"
                        >
                          <Copy size={14} /> Duplicate
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 opacity-50">
              <FileText size={64} className="mx-auto mb-4 text-[#f04923]" />
              <p className="text-xl">No documents found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
