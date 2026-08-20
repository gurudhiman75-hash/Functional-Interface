import type { CSSProperties, ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StickyHeader } from "@/components/StickyHeader";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider
      className="min-h-screen bg-slate-100 text-foreground"
      style={{ "--sidebar-width": "260px" } as CSSProperties}
    >
      <a
        href="#main-content"
        className="sr-only z-[1000] rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <AppSidebar />
      <SidebarInset>
        <StickyHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 flex-col gap-6 bg-slate-100 px-4 pb-4 pt-24 transition-all duration-200 sm:px-6 sm:pb-6 sm:pt-28"
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
