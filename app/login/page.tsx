"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, KeyRound, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect to home
  useEffect(() => {
    const session = localStorage.getItem("motofit_session");
    if (session) router.replace("/");
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store session
      localStorage.setItem("motofit_session", data.token);
      localStorage.setItem("motofit_user", JSON.stringify(data.user));

      router.replace("/");
    } catch {
      setError("Network error — please check your connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b132b] flex flex-col items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[600px] h-[600px] bg-[#f04923]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 border border-white/10 rounded-2xl mb-4 shadow-lg shadow-orange-500/10 overflow-hidden p-1">
            <img src="/motofit-logo.jpg" alt="MotoFit Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">MotoFit 2</h1>
          <p className="text-gray-400 text-sm mt-1">Billing & Service CRM</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1a233a] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-6">Authorized Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone */}
            <div>
              <label htmlFor="phoneInput" className="block text-sm text-gray-400 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="phoneInput"
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#f04923]/60 focus:ring-1 focus:ring-[#f04923]/30 transition-all"
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <label htmlFor="pinInput" className="block text-sm text-gray-400 mb-1.5">Login PIN</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="pinInput"
                  type="password"
                  required
                  maxLength={4}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-white text-center tracking-[0.5em] text-xl placeholder-gray-700 focus:outline-none focus:border-[#f04923]/60 focus:ring-1 focus:ring-[#f04923]/30 transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-[#f04923] hover:bg-[#d03d1e] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : "Sign In"}
            </button>
            
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Forgot PIN? Contact the Super Admin to reset it.
              </p>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          MotoFit Billing System · Nigam Nagar, Ahmedabad
        </p>
      </div>
    </div>
  );
}
