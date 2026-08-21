import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StickyHeader } from "@/components/StickyHeader";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

interface AppLayoutProps {
  children: ReactNode;
}

function CatalogAwareHeader() {
  const { error, retryCatalog, isRetrying } = useExamCatalog();

  if (!error) return <StickyHeader />;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-amber-200 bg-amber-50/95 py-2 backdrop-blur-xl md:left-[var(--sidebar-width)]"
      role="status"
      aria-live="polite"
      data-testid="catalog-recovery-header"
    >
      <div className="flex min-h-11 items-center gap-3 px-4 sm:px-6">
        <SidebarTrigger className="h-11 w-11 shrink-0 rounded-md border border-amber-200 bg-white text-slate-600 hover:bg-amber-100" />
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">Catalog temporarily unavailable</p>
          <p className="hidden truncate text-xs text-slate-600 sm:block">Your activity and saved work remain available while ExamTree reconnects.</p>
        </div>
        <button
          type="button"
          onClick={() => void retryCatalog()}
          disabled={isRetrying}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:cursor-wait disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} aria-hidden="true" />
          <span className="hidden sm:inline">{isRetrying ? "Retrying…" : "Retry catalog"}</span>
          <span className="sm:hidden">Retry</span>
        </button>
      </div>
    </header>
  );
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
        <CatalogAwareHeader />
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
