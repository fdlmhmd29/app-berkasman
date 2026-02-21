import {
  LayoutDashboard,
  Users,
  FileText,
  Book,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  {
    title: "Manajemen User",
    url: "/super-admin/users",
    icon: Users,
    role: "Super Admin",
  },
  { title: "Dokumen", url: "/dokumen", icon: FileText },
  { title: "Buku", url: "/buku", icon: Book },
];

export function AppSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            Berkasman
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // Filter menu berdasarkan role jika ditentukan
                if (item.role && session?.user?.role !== item.role) return null;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
