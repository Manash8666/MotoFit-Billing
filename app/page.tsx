"use client";

import Link from "next/link";
import { FileText, ClipboardList, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#f04923]">MotoFit Billing</h1>
          <p className="text-gray-400 mt-2">Garage CRM & Service Management</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/bill">
            <div className="bg-[#1a233a] p-8 rounded-xl border border-gray-800 hover:border-[#f04923] transition-all cursor-pointer flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#0b132b] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-[#f04923]" size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">SoW Bill Creation</h2>
              <p className="text-gray-400 text-sm">Create and manage Final Bills & Invoices</p>
            </div>
          </Link>

          <Link href="/estimate">
            <div className="bg-[#1a233a] p-8 rounded-xl border border-gray-800 hover:border-[#ffd600] transition-all cursor-pointer flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#0b132b] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ClipboardList className="text-[#ffd600]" size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">SoW Estimate Creation</h2>
              <p className="text-gray-400 text-sm">Draft repair estimates for customer approval</p>
            </div>
          </Link>

          <Link href="/users">
            <div className="bg-[#1a233a] p-8 rounded-xl border border-gray-800 hover:border-[#06b6d4] transition-all cursor-pointer flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#0b132b] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="text-[#06b6d4]" size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">User Management</h2>
              <p className="text-gray-400 text-sm">Manage Mechanics and Managers</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
