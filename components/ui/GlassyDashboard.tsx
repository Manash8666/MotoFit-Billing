'use client';
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FileText,
  ClipboardList,
  Users,
  Search,
  Sun,
  Moon,
  Zap
} from 'lucide-react'
import './GlassyDashboard.css'

export default function GlassyDashboard({ userName = 'Admin' }: { userName?: string }) {
  const [theme, setTheme] = useState('dark')
  const [searchQuery, setSearchQuery] = useState('')

  const features = [
    {
      title: 'SoW Bill Creation',
      desc: 'Create and manage Final Bills & Invoices',
      icon: <FileText size={32} className="text-[#f04923]" />,
      link: '/bill',
      color: '#f04923'
    },
    {
      title: 'SoW Estimate Creation',
      desc: 'Draft repair estimates for customer approval',
      icon: <ClipboardList size={32} className="text-[#ffd600]" />,
      link: '/estimate',
      color: '#ffd600'
    },
    {
      title: 'User Management',
      desc: 'Manage Garage Mechanics and Managers',
      icon: <Users size={32} className="text-[#06b6d4]" />,
      link: '/users',
      color: '#06b6d4'
    }
  ];

  return (
    <div className={`glassy-dashboard-container theme-${theme}`}>
      {/* Dynamic Background */}
      <div className="gd-dynamic-background">
        <div className="gd-ambient-blob blob-1"></div>
        <div className="gd-ambient-blob blob-2"></div>
        <div className="gd-ambient-blob blob-3"></div>
      </div>

      <div className="gd-console-layer">
        
        {/* TOP NAV BAR */}
        <header className="gd-topbar">
          <div className="gd-logo-area">
            <div className="gd-logo-icon">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <h1 className="gd-logo-text">MotoFit <span className="gd-text-accent">OS</span></h1>
          </div>

          <div className="gd-search-container">
            <Search size={18} className="gd-search-icon" />
            <input 
              type="text" 
              placeholder="Search invoices, estimates or mechanics..." 
              className="gd-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="gd-topbar-actions">
            <button 
              className="gd-action-btn" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="gd-user-profile-btn">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=120&h=120&q=80" 
                alt="User" 
                className="gd-user-avatar"
              />
              <span className="gd-user-name">{userName}</span>
            </div>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div className="gd-main-interface flex items-center justify-center h-full pb-20">
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {features.map((feature, idx) => (
              <Link href={feature.link} key={idx} className="block h-full">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="gd-glass-card flex flex-col items-center justify-center p-12 text-center h-[300px] cursor-pointer group relative overflow-hidden"
                  style={{ '--card-accent': feature.color } as any}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: feature.color }}></div>
                  
                  <motion.div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl relative z-10"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: `1px solid ${feature.color}40` }}
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 10 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold mb-3 z-10 text-white group-hover:text-transparent group-hover:bg-clip-text transition-colors" style={{ backgroundImage: `linear-gradient(to right, #fff, ${feature.color})` }}>
                    {feature.title}
                  </h2>
                  <p className="text-gray-400 text-sm z-10 group-hover:text-gray-300 transition-colors">
                    {feature.desc}
                  </p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
          
        </div>
      </div>
    </div>
  )
}
