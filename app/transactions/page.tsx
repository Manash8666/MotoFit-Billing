'use client';
import React, { useState, useEffect } from 'react';
import { Search, Plus, Home, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight, X, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Transaction {
  id: string;
  type: string;
  reference: string;
  date: string;
  account: string;
  amount: string;
  status: string;
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ type: 'Income', reference: '', account: '', amount: '' });

  useEffect(() => {
    fetch('/api/v1/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load transactions", err);
        setIsLoading(false);
      });
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.reference.toLowerCase().includes(search.toLowerCase()) || 
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.account.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });
      
      if (res.ok) {
        // Refresh the list
        const latest = await fetch('/api/v1/transactions').then(r => r.json());
        setTransactions(latest);
        setNewTransaction({ type: 'Income', reference: '', account: '', amount: '' });
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to save transaction!");
      }
    } catch (err) {
      console.error("Failed to create transaction", err);
      alert("Failed to save transaction! (Network error)");
    }
  };

  const handleExportAuditReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("MotoFit Financial Audit Ledger", 14, 22);
    
    // Sub-header details
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Report Type: Immutable Ledger Export`, 14, 36);

    const tableColumn = ["Transaction ID", "Type", "Reference", "Date", "Account/Vendor", "Amount", "Status"];
    const tableRows = filteredTransactions.map(t => [
      t.id, t.type, t.reference, t.date, t.account, t.amount, t.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] }, // MotoFit Green
      styles: { fontSize: 10 },
    });

    doc.save(`MotoFit_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 font-sans flex flex-col relative">
      {/* Top Header */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border-b border-white/10 bg-[#161616] gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <h1 className="text-xl font-medium text-white shrink-0">Transactions</h1>
          
          <div className="flex items-center bg-black/40 border border-white/10 rounded-md px-3 py-1.5 w-full sm:w-64 focus-within:border-white/30 transition-all">
            <Search size={16} className="text-gray-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <button onClick={handleExportAuditReport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium border border-blue-500/50 text-blue-400 rounded-md hover:bg-blue-500/10 transition-colors w-full sm:w-auto">
            <Download size={16} />
            Export
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium border border-white/10 rounded-md hover:bg-white/5 transition-colors w-full sm:w-auto">
            <Filter size={16} />
            Filter
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium bg-white text-black rounded-md hover:bg-gray-200 transition-colors w-full sm:w-auto">
            <Plus size={16} />
            New
          </button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 px-6 py-3 text-sm text-gray-400 border-b border-white/5 bg-[#111111]">
        <Link href="/" className="hover:text-white transition-colors shrink-0">
          <Home size={16} />
        </Link>
        <span>/</span>
        <span className="text-gray-200">Transactions</span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-medium mb-6 text-white">New Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <select value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value})} className="w-full bg-[#111111] border border-white/10 rounded-md p-2 text-sm text-white">
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Reference (e.g. INV-123)</label>
                <input required type="text" value={newTransaction.reference} onChange={e => setNewTransaction({...newTransaction, reference: e.target.value})} className="w-full bg-[#111111] border border-white/10 rounded-md p-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Account</label>
                <input required type="text" value={newTransaction.account} onChange={e => setNewTransaction({...newTransaction, account: e.target.value})} className="w-full bg-[#111111] border border-white/10 rounded-md p-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
                <input required type="number" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} className="w-full bg-[#111111] border border-white/10 rounded-md p-2 text-sm text-white" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-md border border-white/10 text-white text-sm hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="border border-white/5 rounded-lg bg-[#161616] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
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
                {filteredTransactions.map((trx, i) => (
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
                      <button className="text-gray-500 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p>No transactions found.</p>
            </div>
          )}
          
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
            <div>Showing {filteredTransactions.length > 0 ? 1 : 0} to {filteredTransactions.length} of {filteredTransactions.length} entries</div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
