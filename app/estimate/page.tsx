"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EstimatePage() {
  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[#1a233a] rounded-full transition-colors">
            <ArrowLeft className="text-[#ffd600]" />
          </Link>
          <h1 className="text-3xl font-bold">SoW Estimate Creation</h1>
        </header>

        <div className="bg-[#1a233a] rounded-xl border border-gray-800 p-6">
          <p className="text-gray-400 mb-6">Draft repair estimates for customer approval.</p>
          {/* Estimate creation form will go here */}
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center text-gray-500">
            Estimate Form Integration Pending
          </div>
        </div>
      </div>
    </div>
  );
}
