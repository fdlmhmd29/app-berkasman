import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Jangan tampilkan sidebar di halaman login
  if (router.pathname === "/login") return <>{children}</>;

  if (status === "loading") return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-screen bg-gray-50/50">
        <div className="p-4 border-b bg-white flex items-center gap-4 sticky top-0 z-10">
          <SidebarTrigger />
          <div className="h-4 w-[1px] bg-gray-200" />
          <h2 className="text-sm font-medium text-gray-500 capitalize">
            {router.pathname.split("/").pop() || "Dashboard"}
          </h2>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
