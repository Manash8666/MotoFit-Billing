'use client';
import React, { useState } from 'react';
import { Search, Plus, Home, ChevronDown, Check, X } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Details');
  const [activeSetting, setActiveSetting] = useState('Company Details');

  const basicSettings = [
    'Company Details', 'User Details', 'Localization', 'Payment Settings', 
    'Tax Settings', 'Product Settings', 'Task Settings', 'Tags', 
    'Expense Settings', 'Workflow Settings', 'Account Management', 
    'Backup | Restore', 'Import | Export'
  ];

  const advancedSettings = [
    'Invoice Design', 'Custom Fields', 'Generated Numbers', 'Client Portal', 
    'E-Invoicing', 'Email Settings', 'Templates & Reminders', 'Credit Cards & Banks', 
    'Group Settings', 'Payment Links', 'Schedules', 'User Management'
  ];

  const tabs = ['Details', 'Address', 'Logo', 'Defaults', 'Documents', 'Custom Fields'];

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 font-sans flex flex-col">
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#161616]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium text-white">{activeSetting}</h1>
          <button className="p-1 border border-white/10 rounded hover:bg-white/5 transition-colors">
            <Plus size={18} />
          </button>
          
          <div className="flex items-center bg-black/40 border border-white/10 rounded-md px-3 py-1.5 ml-2 w-72 focus-within:border-white/30 transition-all">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Find invoices, clients, and more" 
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-sm font-medium border border-white/10 rounded-md hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-1.5 text-sm font-medium bg-white text-black rounded-md hover:bg-gray-200 transition-colors">
            Save
          </button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 px-6 py-3 text-sm text-gray-400 border-b border-white/5">
        <Link href="/" className="hover:text-white transition-colors">
          <Home size={16} />
        </Link>
        <span>/</span>
        <span>Settings</span>
        <span>/</span>
        <span className="text-gray-200">{activeSetting}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 overflow-y-auto border-r border-white/5 pb-10">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Basic Settings</h2>
            <ul className="space-y-0.5">
              {basicSettings.map(setting => (
                <li key={setting}>
                  <button 
                    onClick={() => setActiveSetting(setting)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                      activeSetting === setting ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    {setting}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 pt-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Advanced Settings</h2>
              <span className="text-[10px] bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                ✦ Pro
              </span>
            </div>
            <ul className="space-y-0.5">
              {advancedSettings.map(setting => (
                <li key={setting}>
                  <button 
                    onClick={() => setActiveSetting(setting)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                      activeSetting === setting ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    {setting}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#111111]">
          <div className="max-w-4xl border border-white/5 rounded-lg bg-[#161616]">
            
            {/* Header & Tabs */}
            <div className="p-6 pb-0 border-b border-white/5">
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-xl font-medium text-white">Company</h2>
                <a href="#" className="text-blue-400 text-sm hover:underline">Learn more</a>
              </div>

              <div className="flex gap-6">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === tab ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm text-gray-400 md:text-right md:pr-4">Company Name</label>
                <div className="md:col-span-2">
                  <input 
                    type="text" 
                    defaultValue="MotoFit (Nigam Nagar)"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm text-gray-400 md:text-right md:pr-4">ID Number</label>
                <div className="md:col-span-2">
                  <input 
                    type="text" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm text-gray-400 md:text-right md:pr-4">VAT Number</label>
                <div className="md:col-span-2">
                  <input 
                    type="text" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm text-gray-400 md:text-right md:pr-4">Website</label>
                <div className="md:col-span-2">
                  <input 
                    type="text" 
                    defaultValue="http://www.motofit.com"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm text-gray-400 md:text-right md:pr-4">Email</label>
                <div className="md:col-span-2">
                  <input 
                    type="email" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm text-gray-400 md:text-right md:pr-4">Company Phone</label>
                <div className="md:col-span-2">
                  <input 
                    type="text" 
                    defaultValue="+91 9876543210"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm text-gray-400 md:text-right md:pr-4">Company Size</label>
                <div className="md:col-span-2 relative">
                  <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                    <option>1 - 3</option>
                    <option>4 - 10</option>
                    <option>11 - 50</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm text-gray-400 md:text-right md:pr-4">Industry</label>
                <div className="md:col-span-2 relative">
                  <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                    <option>Automotive / Repair</option>
                    <option>Manufacturing</option>
                    <option>Retail</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm text-gray-400 md:text-right md:pr-4">Classification</label>
                <div className="md:col-span-2 relative">
                  <div className="flex items-center w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-within:border-white/30 transition-colors">
                    <select className="bg-transparent border-none outline-none appearance-none w-full">
                      <option>Business</option>
                      <option>Individual</option>
                    </select>
                    <div className="flex items-center gap-2 ml-2">
                      <X size={14} className="text-gray-500 hover:text-white cursor-pointer" />
                      <ChevronDown size={16} className="text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
