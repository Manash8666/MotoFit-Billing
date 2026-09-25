"use client";

import GlassyDashboard from "@/components/ui/GlassyDashboard";
import DarkNavBar from "@/components/ui/DarkNavBar";
import FolderWidget from "@/components/ui/FolderWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b132b] text-white flex flex-col relative overflow-hidden">
      {/* 
        The Dashboard takes most of the screen. 
      */}
      <div className="flex-1 relative z-10 w-full h-full">
        <GlassyDashboard onBackToLogin={() => console.log('Back to login')} />
      </div>

      {/* Floating Folder Widget overlay */}
      <div className="fixed bottom-32 right-12 z-50">
        <FolderWidget />
      </div>

      {/* Navigation Tabs at the bottom */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6 pointer-events-none">
        <div className="pointer-events-auto shadow-2xl shadow-[#f04923]/20 rounded-full">
          <DarkNavBar />
        </div>
      </div>
    </div>
  );
}
