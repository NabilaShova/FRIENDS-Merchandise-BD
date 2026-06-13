import { AdminSidebar } from "@/components/admin/admin-sidebar";

/**
 * Authenticated admin panel chrome (sidebar). Access is gated by
 * `src/middleware.ts`, which redirects unauthenticated requests to
 * `/admin/login`.
 */
export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
