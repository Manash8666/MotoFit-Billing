"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DocumentCreator from "@/components/DocumentCreator";

export default function BillPage() {
  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-4 no-print">
          <Link href="/" className="p-2 hover:bg-[#1a233a] rounded-full transition-colors">
            <ArrowLeft className="text-[#f04923]" />
          </Link>
          <h1 className="text-3xl font-bold">SoW Bill Creation</h1>
        </header>

        <DocumentCreator docType="SOW_BILL" />
      </div>
    </div>
  );
}
