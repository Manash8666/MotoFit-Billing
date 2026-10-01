'use client';
import React, { useState, useEffect } from 'react';
import { Search, Plus, Home, Filter, MoreHorizontal, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ExpenseTransaction {
  id: string;
  vendor: string;
  date: string;
  category: string;
  amount: string;
  status: string;
}

export default function ExpensesPage() {
  const [search, setSearch] = useState('');
  const [expenses, setExpenses] = useState<ExpenseTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ vendor: '', category: '', amount: '' });

  useEffect(() => {
    fetch('/api/v1/transactions')
      .then(res => res.json())
      .then((data: any[]) => {
        const mapped = data.filter(t => t.type === 'Expense').map(t => ({
          id: t.id,
          vendor: t.account,
          date: t.date,
          category: t.reference,
          amount: t.amount,
          status: 'Logged'
        }));
        setExpenses(mapped);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load expenses", err);
        setIsLoading(false);
      });
  }, []);

  const filteredExpenses = expenses.filter(e => 
    e.vendor.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Expense', reference: newExpense.category, account: newExpense.vendor, amount: newExpense.amount })
      });
      if (res.ok) {
        const data = await fetch('/api/v1/transactions').then(r => r.json());
        const mapped = data.filter((t: any) => t.type === 'Expense').map((t: any) => ({
          id: t.id,
          vendor: t.account,
          date: t.date,
          category: t.reference,
          amount: t.amount,
          status: 'Logged'
        }));
        setExpenses(mapped);
        setNewExpense({ vendor: '', category: '', amount: '' });
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to save expense");
      }
    } catch (err) {
      alert("Failed to save expense (Network error)");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 font-sans flex flex-col relative">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-white/10 bg-[#161616] gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <h1 className="text-xl font-medium text-white shrink-0">Expenses</h1>
          
          <div className="flex items-center bg-black/40 border border-white/10 rounded-md px-3 py-1.5 w-full sm:w-64 focus-within:border-white/30 transition-all">
            <Search size={16} className="text-gray-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium border border-white/10 rounded-md hover:bg-white/5 transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium bg-white text-black rounded-md hover:bg-gray-200 transition-colors">
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
        <span className="text-gray-200">Expenses</span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-medium mb-6 text-white">New Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Vendor Name</label>
                <input required type="text" value={newExpense.vendor} onChange={e => setNewExpense({...newExpense, vendor: e.target.value})} className="w-full bg-[#111111] border border-white/10 rounded-md p-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <input required type="text" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full bg-[#111111] border border-white/10 rounded-md p-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
                <input required type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="w-full bg-[#111111] border border-white/10 rounded-md p-2 text-sm text-white" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-md border border-white/10 text-white text-sm hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors">Save Expense</button>
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
                {filteredExpenses.map((expense, i) => (
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
                      <button className="text-gray-500 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredExpenses.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p>No expenses found.</p>
            </div>
          )}
          
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
            <div>Showing {filteredExpenses.length > 0 ? 1 : 0} to {filteredExpenses.length} of {filteredExpenses.length} entries</div>
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
