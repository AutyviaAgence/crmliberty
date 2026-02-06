"use client";

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
    const currentNav = NAV_ITEMS.find((item) => item.href === pathname);
    const title = currentNav ? currentNav.label : "Dashboard";

    return (
        <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-primary selection:text-white">
            <Sidebar />
            <div className="lg:pl-[280px]">
                <Header title={title} />
                <main className="p-8 pt-[104px] animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}
