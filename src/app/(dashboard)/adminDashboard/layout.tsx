"use client";
import React, { useCallback, useState } from "react";
import AdminNavbar from "./_components/AdminNavbar";
import AdminSidebar from "./_components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex flex-1 flex-col">
        <AdminNavbar onMenuClick={openSidebar} />
        <main className="flex-1 bg-slate-50/50 p-6">{children}</main>
      </div>
    </div>
  );
}
