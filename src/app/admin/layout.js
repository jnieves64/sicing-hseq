'use client'

import { useState } from 'react'

import AdminGuard from "@/components/auth/AdminGuard";
import AdminSidebar from "./AdminSidebar";
import Header from "@/components/layout/Header";

export default function AdminLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <AdminGuard>
            <div className="h-screen flex flex-col overflow-hidden">

                <Header onMenuClick={() => setSidebarOpen(true)} />

                <div className="flex flex-1 overflow-hidden relative">

                    {sidebarOpen && (
                        <div
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/40 z-40"
                        />
                    )}

                    <AdminSidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />

                    <main className="flex-1 bg-gray-100 overflow-y-auto">
                        {children}
                    </main>

                </div>
            </div>
        </AdminGuard>
    );
}