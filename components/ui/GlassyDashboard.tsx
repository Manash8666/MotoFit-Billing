'use client';
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FileText,
  ClipboardList,
  Users,
  Search,
  Zap,
  Settings,
  PieChart,
  PlusCircle,
  MinusCircle,
  Receipt,
  ArrowRightLeft,
  Sliders,
  LogOut,
  Wrench,
  Menu,
  X
} from 'lucide-react'

export default function GlassyDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('motofit_user');
      if (raw) {
        const user = JSON.parse(raw);
        setUserName(user.name || 'Admin');
        setUserRole(user.role?.replace(/_/g, ' ') || '');
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('motofit_session');
    localStorage.removeItem('motofit_user');
    router.push('/login');
  };

  const features = [
    {
      title: 'SoW Bill',
      desc: 'Create Final Bills & Invoices',
      icon: <FileText size={28} className="text-[#f04923]" />,
      link: '/bill',
      color: '#f04923',
    },
    {
      title: 'SoW Estimate',
      desc: 'Draft customer repair estimates',
      icon: <ClipboardList size={28} className="text-[#ffd600]" />,
      link: '/estimate',
      color: '#ffd600',
    },
    {
      title: 'Clients',
      desc: 'Customer records & history',
      icon: <Users size={28} className="text-[#10b981]" />,
      link: '/clients',
      color: '#10b981',
    },
    {
      title: 'Parts & Services',
      desc: 'Inventory and labor catalog',
      icon: <Wrench size={28} className="text-[#8b5cf6]" />,
      link: '/parts',
      color: '#8b5cf6',
    },
    {
      title: 'Staff',
      desc: 'Manage mechanics & managers',
      icon: <Users size={28} className="text-[#06b6d4]" />,
      link: '/users',
      color: '#06b6d4',
    },
    {
      title: 'AI Sales',
      desc: 'Predictive customer insights',
      icon: <Zap size={28} className="text-[#ff00ff]" />,
      link: '/ai-sales',
      color: '#ff00ff',
    },
    {
      title: 'Financials',
      desc: 'Analytics & revenue overview',
      icon: <PieChart size={28} className="text-[#3b82f6]" />,
      link: '/dashboard',
      color: '#3b82f6',
    },
    {
      title: 'Credits',
      desc: 'Customer credit notes',
      icon: <PlusCircle size={28} className="text-[#34d399]" />,
      link: '/credits',
      color: '#34d399',
    },
    {
      title: 'Debits',
      desc: 'Debit notes & chargebacks',
      icon: <MinusCircle size={28} className="text-[#f43f5e]" />,
      link: '/debits',
      color: '#f43f5e',
    },
    {
      title: 'Expenses',
      desc: 'Track garage expenses',
      icon: <Receipt size={28} className="text-[#f59e0b]" />,
      link: '/expenses',
      color: '#f59e0b',
    },
    {
      title: 'Transactions',
      desc: 'Full financial ledger',
      icon: <ArrowRightLeft size={28} className="text-[#c084fc]" />,
      link: '/transactions',
      color: '#c084fc',
    },
    {
      title: 'Settings',
      desc: 'Configure preferences',
      icon: <Sliders size={28} className="text-[#94a3b8]" />,
      link: '/settings',
      color: '#94a3b8',
    }
  ];

  const filtered = features.filter(f => {
    // Search filter
    const matchesSearch = !searchQuery || f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Role-based Access Control
    const isAdmin = userRole === 'SUPER ADMIN' || userRole === 'SERVICE MANAGER';
    const isRestrictedTile = f.link === '/users' || f.link === '/settings' || f.link === '/dashboard';

    if (isRestrictedTile && !isAdmin) return false;
    
    return matchesSearch;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#050511] to-black text-white overflow-hidden relative font-sans flex flex-col">

      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#f04923]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#06b6d4]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#ffd600]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen bg-black/40">

        {/* TOP NAV */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl shadow-2xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 hover:scale-105 transition-transform duration-300 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-[#f04923] to-[#ffaa00] rounded-xl flex items-center justify-center shadow-lg shadow-[#f04923]/30">
              <Zap size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">MotoFit <span className="text-[#f04923]">OS</span></h1>
          </Link>

          {/* Search - hidden on mobile */}
          <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-2 w-80 focus-within:border-white/30 transition-all">
            <Search size={16} className="text-gray-400 mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search modules..."
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
            />
          </div>

          {/* Desktop: User + Logout */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{userName}</p>
              {userRole && <p className="text-xs text-gray-400">{userRole}</p>}
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f04923] to-[#ffaa00] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {userName.charAt(0)}
            </div>
            <button
              onClick={() => router.push('/profile')}
              title="My Profile"
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            className="sm:hidden p-2 text-gray-400 hover:text-white rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#0b132b] border-b border-white/10 px-4 py-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f04923] to-[#ffaa00] flex items-center justify-center text-white font-bold text-lg">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{userName}</p>
                {userRole && <p className="text-xs text-gray-400">{userRole}</p>}
              </div>
            </div>
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-2">
              <Search size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search modules..."
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
              />
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium"
            >
              <Settings size={16} /> My Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}

        {/* MAIN GRID */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {filtered.map((feature) => (
              <Link href={feature.link} key={feature.title} className="block group">
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center justify-center p-4 sm:p-6 text-center h-[160px] sm:h-[200px] cursor-pointer relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-t-white/30 border-l-white/20 border-b-black/50 border-r-black/50 backdrop-blur-xl shadow-xl transition-all duration-300"
                  style={{ borderColor: `${feature.color}22` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 rounded-2xl pointer-events-none" />

                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg relative z-10 bg-gradient-to-br from-white/10 to-black/40 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                    style={{ boxShadow: `0 4px 20px ${feature.color}22` }}
                  >
                    {feature.icon}
                  </div>

                  <h2 className="text-sm sm:text-base font-bold mb-1 z-10 text-white tracking-tight leading-tight">
                    {feature.title}
                  </h2>
                  <p className="text-gray-400 text-[10px] sm:text-xs z-10 group-hover:text-gray-200 transition-colors leading-relaxed line-clamp-2">
                    {feature.desc}
                  </p>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <p>No modules match "{searchQuery}"</p>
            </div>
          )}
        </main>

        <footer className="w-full text-center p-3 text-xs text-gray-600 border-t border-white/5 bg-black/20">
          MotoFit OS · Nigam Nagar, Ahmedabad · <a href="https://motofit2.in" target="_blank" rel="noopener noreferrer" className="text-[#f04923] hover:underline">motofit2.in</a>
        </footer>
      </div>
    </div>
  )
}
