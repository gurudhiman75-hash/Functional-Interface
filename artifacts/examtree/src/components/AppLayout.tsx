import type { CSSProperties, ReactNode } from "react";
import { useLocation } from "wouter";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PublicFooter } from "@/components/PublicFooter";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const hideFooter =
    location.startsWith("/admin") ||
    location.startsWith("/dashboard") ||
    location.startsWith("/performance") ||
    location.startsWith("/profile") ||
    location.startsWith("/result") ||
    location.startsWith("/test/") ||
    location.startsWith("/login") ||
    location.startsWith("/my-packages") ||
    location.startsWith("/packages/");

  return (
    <SidebarProvider
      className="min-h-screen bg-slate-100 text-foreground"
      style={{ "--sidebar-width": "260px" } as CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b border-slate-200 bg-white/85 px-6 backdrop-blur-xl">
          <SidebarTrigger className="-ml-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-950" />
          <div className="ml-4 hidden items-center gap-2 text-xs font-medium text-muted-foreground md:flex">
            <span>Professional Testing Platform</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>High quality practice and analytics</span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 bg-slate-100 p-4 transition-all duration-200 sm:p-6">
          {children}
        </main>
        {!hideFooter && <PublicFooter />}
      </SidebarInset>
    </SidebarProvider>
  );
}
