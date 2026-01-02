import AdminNavbar from "@/components/layouts/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <div className="fixed bottom-0 left-0 w-full h-16 lg:top-0 lg:h-screen lg:w-20 z-[60]">
        <AdminNavbar />
      </div>

      <main className="flex-1 min-w-0 pb-4 lg:pb-0 lg:ml-20 relative">
        {children}
      </main>
    </div>
  );
}
