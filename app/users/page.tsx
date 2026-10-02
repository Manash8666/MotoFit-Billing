"use client";
import { apiClient } from '@/lib/api-client';

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

  const loadUsers = async () => {
    try {
      const data = await apiClient.get<{ users: User[] }>('/api/v1/users');
      if (data && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.post('/api/v1/users', { ...formData, pinHash: formData.pinHash || '0000' });
      setSuccess("User created successfully!");
      loadUsers();
      setFormData({ name: "", phone: "", pinHash: "", role: "SENIOR_MECHANIC" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.data?.error || "Network error \u2014 failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from staff? This cannot be undone.`)) return;
    try {
      await apiClient.delete('/api/v1/users', { body: JSON.stringify({ id }) });
      loadUsers();
    } catch (err: any) {
      alert(err.data?.error || "Network error \u2014 failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-4 md:p-8" role="main">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[#1a233a] rounded-full transition-colors focus:ring-2 focus:ring-[#06b6d4] outline-none" aria-label="Go back to Dashboard">
            <ArrowLeft className="text-[#06b6d4]" aria-hidden="true" />
          </Link>
          <h1 className="text-3xl font-bold">User Management</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create User Form */}
          <section className="bg-[#1a233a] rounded-xl border border-gray-800 p-6 h-fit" aria-labelledby="create-user-heading">
            <h2 id="create-user-heading" className="text-xl font-bold mb-4 flex items-center gap-2 text-[#06b6d4]">
              <UserPlus size={20} aria-hidden="true" /> Add New Staff
            </h2>
            <form onSubmit={handleCreate} className="space-y-4" aria-live="polite">
              <div>
                <label htmlFor="nameInput" className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input id="nameInput" required type="text" className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white focus:ring-2 focus:ring-[#06b6d4] outline-none transition-shadow" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ramesh Singh" aria-required="true" />
              </div>
              <div>
                <label htmlFor="phoneInput" className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <input id="phoneInput" required type="tel" className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white focus:ring-2 focus:ring-[#06b6d4] outline-none transition-shadow" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 99999 99999" aria-required="true" />
              </div>
              <div>
                <label htmlFor="roleSelect" className="block text-sm text-gray-400 mb-1">Role</label>
                <select id="roleSelect" className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white focus:ring-2 focus:ring-[#06b6d4] outline-none transition-shadow" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="SENIOR_MECHANIC">Senior Mechanic</option>
                  <option value="SERVICE_MANAGER">Service Manager</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="AUDITOR">Auditor</option>
                </select>
              </div>
              <div>
                <label htmlFor="pinInput" className="block text-sm text-gray-400 mb-1">Login PIN (4 digits)</label>
                <input id="pinInput" required type="password" maxLength={4} className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white text-center tracking-widest text-lg focus:ring-2 focus:ring-[#06b6d4] outline-none transition-shadow" value={formData.pinHash} onChange={e => setFormData({...formData, pinHash: e.target.value})} placeholder="****" aria-required="true" />
              </div>

              {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded p-2" role="alert">{error}</p>}
              {success && <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/30 rounded p-2" role="status">{success}</p>}

              <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-4 bg-[#06b6d4] hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-300 outline-none text-white font-bold rounded transition shadow-lg shadow-cyan-500/20 disabled:opacity-50">
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </form>
          </section>

          {/* User List */}
          <section className="lg:col-span-2 bg-[#1a233a] rounded-xl border border-gray-800 p-6" aria-labelledby="staff-list-heading">
            <h2 id="staff-list-heading" className="text-xl font-bold mb-6 text-white">Active Staff Accounts</h2>

            {(() => {
              if (loading) {
                return (
                  <div className="animate-pulse space-y-4" role="status" aria-label="Loading staff accounts">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-800 rounded-lg"></div>)}
                  </div>
                );
              }
              if (users.length === 0) {
                return (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg" role="status">
                    No users found. Create one to get started.
                  </div>
                );
              }
              return (
                <ul className="space-y-3" aria-label="List of active staff">
                  {users.map(user => (
                    <li key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0b132b] border border-gray-700 rounded-lg gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-12 h-12 shrink-0 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400" aria-hidden="true">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-lg truncate">{user.name}</h3>
                          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-400 mt-1">
                            <span className="flex items-center gap-1 whitespace-nowrap"><Phone size={12} aria-hidden="true" /> <span className="sr-only">Phone number:</span>{user.phone}</span>
                            <span className="flex items-center gap-1 text-[#06b6d4] whitespace-nowrap"><Shield size={12} aria-hidden="true" /> <span className="sr-only">Role:</span>{user.role.replace(/_/g, " ")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-gray-800 sm:border-0 pt-3 sm:pt-0">
                        <button
                          onClick={async () => {
                            if (!confirm(`Reset PIN for "${user.name}" to 0000?`)) return;
                            try {
                              await apiClient.fetch('/api/v1/users', {
                                method: 'PATCH',
                                body: JSON.stringify({ id: user.id, action: 'RESET_PIN' })
                              });
                              alert(`PIN for ${user.name} has been reset to 0000`);
                            } catch (err: any) {
                              alert("Network error: failed to reset PIN");
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 focus:ring-2 focus:ring-cyan-500 outline-none rounded-lg transition-colors text-xs font-semibold"
                          aria-label={`Reset PIN for ${user.name} to 0000`}
                        >
                          Reset PIN
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 focus:ring-2 focus:ring-red-500 outline-none rounded-lg transition-colors"
                          aria-label={`Remove user ${user.name}`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              );
            })()}
          </section>
        </div>
      </div>
    </div>
  );
}
