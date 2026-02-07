"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentNav = NAV_ITEMS.find((item) => item.href === pathname);
  const title = currentNav ? currentNav.label : "Dashboard";

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-primary/30 selection:text-white">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="lg:pl-[260px]">
        <Header
          title={title}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="px-4 sm:px-6 lg:px-8 pt-[80px] pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
