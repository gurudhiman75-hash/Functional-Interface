import { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center px-6">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6 transition-all duration-200">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}