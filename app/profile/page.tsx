"use client";
import { apiClient } from '@/lib/api-client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Phone, KeyRound, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("motofit_user");
    if (!raw) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(raw);
    setUserData(user);
    setName(user.name);
    setPhone(user.phone);
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPin && newPin.length !== 4) {
      setError("New PIN must be exactly 4 digits.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.fetch('/api/v1/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData.id,
          name,
          phone,
          oldPin,
          newPin
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
      } else {
        setSuccess("Profile updated successfully!");
        localStorage.setItem("motofit_user", JSON.stringify(data.user));
        setOldPin("");
        setNewPin("");
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch (err) {
      setError("Network error. Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[#1a233a] rounded-full transition-colors">
            <ArrowLeft className="text-[#06b6d4]" />
          </Link>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </header>

        <div className="bg-[#1a233a] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f04923] to-[#ffaa00] flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {name.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-[#06b6d4] font-semibold">{userData.role.replace(/_/g, ' ')}</p>
              <p className="text-gray-400 text-sm">Manage your personal details & PIN</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#06b6d4] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  required 
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#06b6d4] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 pb-2">
              <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">Change Security PIN</h3>
              <p className="text-xs text-gray-400 mb-4">Leave these fields blank if you do not wish to change your PIN.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Current PIN</label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="password" 
                      maxLength={4}
                      value={oldPin} 
                      onChange={e => setOldPin(e.target.value)} 
                      placeholder="****"
                      className="w-full bg-[#0b132b] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white tracking-[0.3em] font-mono focus:border-[#f04923] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">New PIN (4 digits)</label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f04923]/60" />
                    <input 
                      type="password" 
                      maxLength={4}
                      value={newPin} 
                      onChange={e => setNewPin(e.target.value)} 
                      placeholder="****"
                      className="w-full bg-[#0b132b] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white tracking-[0.3em] font-mono focus:border-[#f04923] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm">
                <AlertCircle size={16} className="shrink-0" /> {error}
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-300 text-sm">
                <CheckCircle2 size={16} className="shrink-0" /> {success}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#06b6d4] hover:bg-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
