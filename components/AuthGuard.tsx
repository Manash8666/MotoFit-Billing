"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("motofit_session");
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!session && !isPublic) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) {
    // Splash while auth check runs
    return (
      <div className="min-h-screen bg-[#0b132b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#f04923] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
