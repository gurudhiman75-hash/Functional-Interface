import type { CSSProperties, ReactNode } from "react";
import { useLocation } from "wouter";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MiniFooter } from "@/components/MiniFooter";
import { StickyHeader } from "@/components/StickyHeader";

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
        <StickyHeader />
        <main className="flex flex-1 flex-col gap-6 bg-slate-100 px-4 pb-4 pt-24 transition-all duration-200 sm:px-6 sm:pb-6 sm:pt-28">
          {children}
        </main>
        {!hideFooter && <MiniFooter />}
      </SidebarInset>
    </SidebarProvider>
  );
}
