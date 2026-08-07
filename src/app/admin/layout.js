import AdminGuard from "@/components/auth/AdminGuard";
import AdminSidebar from "./AdminSidebar";
import Header from "@/components/layout/Header";

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 bg-gray-100 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}