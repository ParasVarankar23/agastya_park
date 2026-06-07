"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function ClientLayout({
    children,
}) {
    const pathname = usePathname();

    const authRoutes = [
        "/",
        "/signup",
        "/forgot-password",
    ];

    const isAuthPage =
        authRoutes.includes(pathname);

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Navbar />

                <main className="flex-1 p-6">
                    {children}
                </main>              
            </div>
        </div>
    );
}