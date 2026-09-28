'use client';
import React, { useState } from 'react';
import { Search, Plus, Home, ChevronDown, Check, X } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Details');
  const [activeSetting, setActiveSetting] = useState('Company Details');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    if (resetConfirmation !== 'CONFIRM_RESET') {
      alert("Invalid confirmation code");
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/v1/settings/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: resetConfirmation })
      });
      if (res.ok) {
        alert("Database wiped successfully. Reloading...");
        window.location.reload();
      } else {
        alert("Failed to reset database");
      }
    } catch (e) {
      alert("Error resetting database");
    } finally {
      setIsResetting(false);
    }
  };

  const basicSettings = [
    'Company Details', 'User Details', 'Localization', 'Payment Settings', 
    'Tax Settings', 'Product Settings', 'Task Settings', 'Tags', 
    'Expense Settings', 'Workflow Settings', 'Account Management', 
    'Backup | Restore', 'Import | Export', 'Danger Zone'
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
          <Link href="/" className="px-4 py-1.5 text-sm font-medium border border-white/10 rounded-md hover:bg-white/5 transition-colors">
            Cancel
          </Link>
          <button onClick={() => alert('Settings saved successfully!')} className="px-4 py-1.5 text-sm font-medium bg-white text-black rounded-md hover:bg-gray-200 transition-colors">
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
            
            {/* Header & Tabs (dynamic based on setting) */}
            <div className="p-6 pb-0 border-b border-white/5">
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-xl font-medium text-white">{activeSetting.split(' ')[0]}</h2>
                <a href="#" className="text-blue-400 text-sm hover:underline">Learn more</a>
              </div>

              {activeSetting === 'Company Details' && (
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
              )}
            </div>

            {/* Form Fields - Dynamically Rendered */}
            <div className="p-6 space-y-6">
              
              {activeSetting === 'Company Details' && activeTab === 'Details' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Company Name</label>
                    <div className="md:col-span-2">
                      <input 
                        type="text" 
                        defaultValue=""
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
                        defaultValue=""
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
                        defaultValue=""
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
                </>
              )}

              {activeSetting === 'Company Details' && activeTab === 'Address' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Street Address</label>
                    <div className="md:col-span-2">
                      <input type="text" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">City</label>
                    <div className="md:col-span-2">
                      <input type="text" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">State/Province</label>
                    <div className="md:col-span-2">
                      <input type="text" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Postal Code</label>
                    <div className="md:col-span-2">
                      <input type="text" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Company Details' && activeTab === 'Logo' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Company Logo</label>
                    <div className="md:col-span-2 flex items-center gap-4">
                      <div className="w-24 h-24 bg-[#0a0a0a] border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-gray-500 hover:border-white/40 hover:text-gray-300 transition-colors cursor-pointer">
                        <span className="text-xs">Upload Logo</span>
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs">
                        Recommended size: 256x256px. Max file size: 2MB. Supported formats: PNG, JPG, SVG.
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Company Details' && !['Details', 'Address', 'Logo'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <p className="text-sm mb-2">No settings configured for {activeTab} yet.</p>
                  <p className="text-xs">This section is under construction.</p>
                </div>
              )}

              {activeSetting === 'User Details' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">First Name</label>
                    <div className="md:col-span-2">
                      <input 
                        type="text" 
                        defaultValue=""
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Last Name</label>
                    <div className="md:col-span-2">
                      <input 
                        type="text" 
                        defaultValue=""
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Email</label>
                    <div className="md:col-span-2">
                      <input 
                        type="email" 
                        defaultValue=""
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Localization' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Language</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Timezone</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>Asia/Kolkata</option>
                        <option>UTC</option>
                        <option>America/New_York</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Currency</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>INR - Indian Rupee (₹)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Tax Settings' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Tax Rates</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>GST 18%</option>
                        <option>GST 28%</option>
                        <option>No Tax</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Invoice Design' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Invoice Template</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>Clean (Default)</option>
                        <option>Bold</option>
                        <option>Modern</option>
                        <option>Classic</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Primary Color</label>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        <input type="color" defaultValue="" className="w-10 h-10 bg-transparent rounded cursor-pointer" />
                        <span className="text-gray-400 text-sm">#3B82F6</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Show Company Logo</label>
                    <div className="md:col-span-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Font Size</label>
                    <div className="md:col-span-2">
                      <input 
                        type="number" 
                        defaultValue=""
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Custom Fields' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4 pt-2">Client Fields</label>
                    <div className="md:col-span-2 space-y-3">
                      <input type="text" placeholder="Custom Field 1" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                      <input type="text" placeholder="Custom Field 2" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-t border-white/5 pt-6">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4 pt-2">Invoice Fields</label>
                    <div className="md:col-span-2 space-y-3">
                      <input type="text" placeholder="Vehicle Registration No." defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                      <input type="text" placeholder="Odometer Reading" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Generated Numbers' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Invoice Prefix</label>
                    <div className="md:col-span-2">
                      <input type="text" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Quote Prefix</label>
                    <div className="md:col-span-2">
                      <input type="text" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Number Padding</label>
                    <div className="md:col-span-2">
                      <input type="number" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Next Invoice Number</label>
                    <div className="md:col-span-2">
                      <input type="number" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Client Portal' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Enable Portal</label>
                    <div className="md:col-span-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Portal URL</label>
                    <div className="md:col-span-2">
                      <input type="text" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Require Authentication</label>
                    <div className="md:col-span-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'E-Invoicing' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Enable UBL/Peppol</label>
                    <div className="md:col-span-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Peppol Scheme ID</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>0151: ABN (Australia)</option>
                        <option>0088: EAN (Global)</option>
                        <option>0184: CVR (Denmark)</option>
                        <option>9901: UBL (India)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Email Settings' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">SMTP Host</label>
                    <div className="md:col-span-2">
                      <input type="text" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">SMTP Port</label>
                    <div className="md:col-span-2">
                      <input type="text" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">SMTP Username</label>
                    <div className="md:col-span-2">
                      <input type="text" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Encryption</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>TLS</option>
                        <option>SSL</option>
                        <option>None</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Templates & Reminders' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Enable Auto-Reminders</label>
                    <div className="md:col-span-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">First Reminder (Days late)</label>
                    <div className="md:col-span-2">
                      <input type="number" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Second Reminder (Days late)</label>
                    <div className="md:col-span-2">
                      <input type="number" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Late Fee (%)</label>
                    <div className="md:col-span-2">
                      <input type="number" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Credit Cards & Banks' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Payment Gateway</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>Stripe</option>
                        <option>PayPal</option>
                        <option>Razorpay</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">API Key / Secret</label>
                    <div className="md:col-span-2">
                      <input type="password" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4 pt-2">Bank Transfer Details</label>
                    <div className="md:col-span-2">
                      <textarea rows={3} defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none"></textarea>
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Group Settings' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Default Group</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>General Customers</option>
                        <option>VIP Clients</option>
                        <option>Corporate Accounts</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Enable Subgroups</label>
                    <div className="md:col-span-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Payment Links' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Allow Partial Payments</label>
                    <div className="md:col-span-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Link Expiration (Days)</label>
                    <div className="md:col-span-2">
                      <input type="number" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'Schedules' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Auto-Bill Frequency</label>
                    <div className="md:col-span-2 relative">
                      <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option>Daily at 8:00 AM</option>
                        <option>Weekly (Monday)</option>
                        <option>Monthly (1st)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400 md:text-right md:pr-4">Failed Payment Retries</label>
                    <div className="md:col-span-2">
                      <input type="number" defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>
                </>
              )}

              {activeSetting === 'User Management' && (
                <>
                  <div className="flex justify-end mb-4">
                    <button className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors">
                      + Add New User
                    </button>
                  </div>
                  <div className="border border-white/5 rounded-md overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-black/40 text-gray-400">
                        <tr>
                          <th className="p-3 font-medium">Name</th>
                          <th className="p-3 font-medium">Email</th>
                          <th className="p-3 font-medium">Role</th>
                          <th className="p-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr><td colSpan={4} className="p-4 text-center text-gray-500">No users found. Go to main User Management tab to add users.</td></tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeSetting === 'Danger Zone' && (
                <div className="flex flex-col gap-6">
                  <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-6 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-3 text-red-400">
                      <X size={24} className="bg-red-500/20 p-1 rounded" />
                      <h3 className="text-lg font-medium">Wipe All Data</h3>
                    </div>
                    <p className="text-gray-400 text-sm max-w-xl">
                      This action is irreversible. It will delete all your customers, vehicles, transactions, bills, and user accounts. The system will be reset to a completely blank slate.
                    </p>
                    <button 
                      onClick={() => setIsResetModalOpen(true)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
                    >
                      Delete All Data
                    </button>
                  </div>
                </div>
              )}

              {!basicSettings.includes(activeSetting) && !advancedSettings.includes(activeSetting) && (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                  <p className="mb-2">Settings for <strong>{activeSetting}</strong> are not yet configured.</p>
                  <p className="text-sm text-gray-600">This module is part of the MotoFit Pro suite.</p>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* Danger Zone Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-[#161616] border border-red-500/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button onClick={() => setIsResetModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-medium text-red-500 mb-2">Confirm Data Wipe</h2>
              <p className="text-gray-400 text-sm mb-6">
                Are you absolutely sure? Type <strong className="text-white select-all">CONFIRM_RESET</strong> below to proceed.
              </p>
              
              <div className="mb-6">
                <input 
                  type="text" 
                  value={resetConfirmation}
                  onChange={(e) => setResetConfirmation(e.target.value)}
                  placeholder="Type CONFIRM_RESET here..."
                  className="w-full bg-[#111111] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-red-500/50 transition-colors placeholder-gray-600"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleResetData}
                  disabled={resetConfirmation !== 'CONFIRM_RESET' || isResetting}
                  className="flex-1 py-2 rounded-md bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                >
                  {isResetting ? 'Wiping...' : 'Wipe Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
