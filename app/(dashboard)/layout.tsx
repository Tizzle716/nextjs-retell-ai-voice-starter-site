import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-black">
        <AppSidebar user={user} />
        <main className="flex-1 overflow-y-auto bg-black">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
