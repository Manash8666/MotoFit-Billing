"use client";

import Link from "next/link";
import { ArrowLeft, UserPlus, Shield, Phone, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", pinHash: "", role: "SENIOR_MECHANIC" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = () => {
    fetch('/api/v1/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load users", err);
        setLoading(false);
      });
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, pinHash: formData.pinHash || '0000' })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("User created successfully!");
        loadUsers();
        setFormData({ name: "", phone: "", pinHash: "", role: "SENIOR_MECHANIC" });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to save user");
      }
    } catch (err) {
      setError("Network error — failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from staff? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/v1/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        loadUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch {
      alert("Network error — failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[#1a233a] rounded-full transition-colors">
            <ArrowLeft className="text-[#06b6d4]" />
          </Link>
          <h1 className="text-3xl font-bold">User Management</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create User Form */}
          <div className="bg-[#1a233a] rounded-xl border border-gray-800 p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#06b6d4]">
              <UserPlus size={20} /> Add New Staff
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input required type="text" className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ramesh Singh" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <input required type="text" className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 99999 99999" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="SENIOR_MECHANIC">Senior Mechanic</option>
                  <option value="SERVICE_MANAGER">Service Manager</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="AUDITOR">Auditor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Login PIN (4 digits)</label>
                <input required type="password" maxLength={4} className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white text-center tracking-widest text-lg" value={formData.pinHash} onChange={e => setFormData({...formData, pinHash: e.target.value})} placeholder="****" />
              </div>

              {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded p-2">{error}</p>}
              {success && <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/30 rounded p-2">{success}</p>}

              <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-4 bg-[#06b6d4] hover:bg-cyan-600 text-white font-bold rounded transition shadow-lg shadow-cyan-500/20 disabled:opacity-50">
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>

          {/* User List */}
          <div className="lg:col-span-2 bg-[#1a233a] rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-6 text-white">Active Staff Accounts</h2>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-800 rounded-lg"></div>)}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                No users found. Create one to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-[#0b132b] border border-gray-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{user.name}</h3>
                        <div className="flex gap-4 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><Phone size={12} /> {user.phone}</span>
                          <span className="flex items-center gap-1 text-[#06b6d4]"><Shield size={12} /> {user.role.replace(/_/g, " ")}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
