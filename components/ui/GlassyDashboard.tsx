'use client';
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FileText,
  ClipboardList,
  Users,
  Search,
  Sun,
  Moon,
  Zap,
  Settings
} from 'lucide-react'

export default function GlassyDashboard({ userName = 'Admin' }: { userName?: string }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      title: 'SoW Bill Creation',
      desc: 'Create and manage Final Bills & Invoices',
      icon: <FileText size={40} className="text-[#f04923]" />,
      link: '/bill',
      color: '#f04923',
      bgClass: 'hover:bg-[#f04923]/10 hover:border-[#f04923]/50'
    },
    {
      title: 'SoW Estimate Creation',
      desc: 'Draft repair estimates for customer approval',
      icon: <ClipboardList size={40} className="text-[#ffd600]" />,
      link: '/estimate',
      color: '#ffd600',
      bgClass: 'hover:bg-[#ffd600]/10 hover:border-[#ffd600]/50'
    },
    {
      title: 'Clients Directory',
      desc: 'Manage customer records and history',
      icon: <Users size={40} className="text-[#10b981]" />,
      link: '/clients',
      color: '#10b981',
      bgClass: 'hover:bg-[#10b981]/10 hover:border-[#10b981]/50'
    },
    {
      title: 'Parts & Services',
      desc: 'Manage inventory and labor catalogs',
      icon: <Settings size={40} className="text-[#8b5cf6]" />,
      link: '/parts',
      color: '#8b5cf6',
      bgClass: 'hover:bg-[#8b5cf6]/10 hover:border-[#8b5cf6]/50'
    },
    {
      title: 'User Management',
      desc: 'Manage Garage Mechanics and Managers',
      icon: <Users size={40} className="text-[#06b6d4]" />,
      link: '/users',
      color: '#06b6d4',
      bgClass: 'hover:bg-[#06b6d4]/10 hover:border-[#06b6d4]/50'
    },
    {
      title: 'AI Sales Analysis',
      desc: 'Predictive sales & customer behavior insights',
      icon: <Zap size={40} className="text-[#ff00ff]" />,
      link: '/ai-sales',
      color: '#ff00ff',
      bgClass: 'hover:bg-[#ff00ff]/10 hover:border-[#ff00ff]/50'
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050511] text-white overflow-hidden relative font-sans">
      
      {/* Animated Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#f04923]/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#06b6d4]/15 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#ffd600]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col min-h-screen backdrop-blur-3xl bg-black/40">
        
        {/* TOP NAV BAR */}
        <header className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f04923] to-[#ffaa00] rounded-xl flex items-center justify-center shadow-lg shadow-[#f04923]/30">
              <Zap size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">MotoFit <span className="text-[#f04923]">OS</span></h1>
          </div>

          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96 focus-within:border-white/30 focus-within:bg-white/10 transition-all">
            <Search size={18} className="text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search invoices, estimates or mechanics..." 
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings size={22} />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=120&h=120&q=80" 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              <span className="font-medium hidden sm:block">{userName}</span>
            </div>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <main className="flex-1 flex items-center justify-center p-8">
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.15 }}
          >
            {features.map((feature, idx) => (
              <Link href={feature.link} key={idx} className="block h-full group">
                <motion.div 
                  whileHover={{ scale: 1.03, y: -10 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col items-center justify-center p-10 text-center h-[340px] cursor-pointer relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl transition-all duration-500 ${feature.bgClass}`}
                >
                  
                  <motion.div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative z-10 bg-black/40 border border-white/5 group-hover:scale-110 transition-transform duration-500"
                    initial={{ rotate: -5 }}
                    animate={{ rotate: 0 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold mb-3 z-10 text-white transition-colors tracking-tight">
                    {feature.title}
                  </h2>
                  <p className="text-gray-400 text-sm z-10 group-hover:text-gray-300 transition-colors px-4 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
          
        </main>
      </div>
    </div>
  )
}
