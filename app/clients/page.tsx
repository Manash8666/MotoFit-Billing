'use client';
import { apiClient } from '@/lib/api-client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus, Search, X, Loader2, MessageCircle, FileText, Bell } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Client {
  id: string | number;
  name: string;
  phone: string;
  vehicle: string;
  lastVisit: string;
  rawLastVisit?: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', vehicle: '' });
  const [showDueOnly, setShowDueOnly] = useState(false);

  const isDueForService = (rawDate?: string) => {
    if (!rawDate) return false;
    const diff = Date.now() - new Date(rawDate).getTime();
    return diff > 90 * 24 * 60 * 60 * 1000; // 90 days
  };

  const handleGenerateStatement = async (client: Client) => {
    // Basic mock generation of Statement. In production, this would fetch all documents for the client.
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("MotoFit Lifetime Statement", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Customer: ${client.name}`, 14, 30);
    doc.text(`Phone: ${client.phone}`, 14, 36);
    doc.text(`Vehicle: ${client.vehicle}`, 14, 42);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 48);

    autoTable(doc, {
      head: [['Date', 'Description', 'Amount', 'Status']],
      body: [
        [client.lastVisit, 'Standard Servicing & Oil Change', '₹2,500', 'Paid'],
        ['--', 'Previous balances cleared', '₹0', 'Cleared']
      ],
      startY: 55,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`Statement_${client.name.replace(/\s+/g, '_')}.pdf`);
  };

  useEffect(() => {
    apiClient.fetch('/api/v1/customers')
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load clients", err);
        setIsLoading(false);
      });
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          client.phone.includes(searchQuery) ||
                          client.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showDueOnly && !isDueForService(client.rawLastVisit)) {
      return false;
    }
    
    return matchesSearch;
  });

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.fetch('/api/v1/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      
      if (res.ok) {
        // Refresh the list
        const latest = await apiClient.fetch('/api/v1/customers').then(r => r.json());
        setClients(latest);
        setNewClient({ name: '', phone: '', vehicle: '' });
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to save client!");
      }
    } catch (err) {
      console.error("Failed to create client", err);
      alert("Failed to save client! (Network error)");
    }
  };

  return (
    <div className="min-h-screen bg-[#050511] text-white p-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b132b] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="text-[#10b981]" size={24} /> New Client
            </h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                <input required type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full bg-[#1a233a] border border-white/10 rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <input required type="text" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full bg-[#1a233a] border border-white/10 rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Vehicle Details</label>
                <input required type="text" value={newClient.vehicle} onChange={e => setNewClient({...newClient, vehicle: e.target.value})} className="w-full bg-[#1a233a] border border-white/10 rounded-lg p-2.5 text-white" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#10b981] text-black font-medium hover:bg-[#10b981]/80 transition-colors">Save Client</button>
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

        <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-3">
              <Users className="text-[#10b981]" size={32} />
              Clients Directory
            </h1>
            <p className="text-gray-400 mt-2">Manage customer records and history</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#10b981] hover:bg-[#10b981]/80 text-black font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
            <Plus size={20} />
            New Client
          </button>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 w-full">
              <Search size={20} className="text-gray-400 mr-3" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients by name, phone, or vehicle..." 
                className="bg-transparent border-none outline-none text-white w-full"
              />
            </div>
            <button 
              onClick={() => setShowDueOnly(!showDueOnly)}
              className={`px-4 py-3 rounded-xl font-medium border flex items-center justify-center gap-2 whitespace-nowrap transition-colors w-full sm:w-auto ${
                showDueOnly 
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <Bell size={18} />
              90+ Days Due
            </button>
          </div>

          {filteredClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-gray-400 font-medium">Name</th>
                    <th className="p-4 text-gray-400 font-medium">Phone</th>
                    <th className="p-4 text-gray-400 font-medium">Vehicle</th>
                    <th className="p-4 text-gray-400 font-medium text-right">Last Visit</th>
                    <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-white">{client.name}</td>
                      <td className="p-4 text-gray-400">{client.phone}</td>
                      <td className="p-4 text-gray-400">{client.vehicle}</td>
                      <td className="p-4 text-right font-medium text-[#10b981]">{client.lastVisit}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleGenerateStatement(client)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs rounded hover:bg-blue-500/20 transition"
                          >
                            <FileText size={14} /> Statement
                          </button>
                          <a 
                            href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              isDueForService(client.rawLastVisit) 
                                ? `Hi ${client.name}, it has been over 3 months since your ${client.vehicle} was serviced. Please book an appointment with MotoFit for a routine checkup to maintain optimal performance!` 
                                : `Hi ${client.name}, your vehicle (${client.vehicle}) servicing is complete and ready for pickup at MotoFit!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#25D366] text-white text-xs rounded hover:bg-[#20b858] transition"
                          >
                            <MessageCircle size={14} /> {isDueForService(client.rawLastVisit) ? 'Remind Due' : 'Reminder'}
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 opacity-50">
              <Users size={64} className="mx-auto mb-4 text-[#10b981]" />
              <p className="text-xl">No clients found matching "{searchQuery}"</p>
              <p className="text-sm mt-2">Try a different search term or add a new client.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
