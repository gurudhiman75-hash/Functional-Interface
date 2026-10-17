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
      className="et-chrome et-shell-header fixed inset-x-0 top-0 z-50 border-b border-amber-300/70 py-2 md:left-[var(--sidebar-width)]"
      role="status"
      aria-live="polite"
      data-testid="catalog-recovery-header"
    >
      <div className="flex min-h-11 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="et-interactive h-11 w-11 shrink-0 rounded-xl border border-amber-300/70 bg-card text-muted-foreground hover:bg-amber-100/70 hover:text-foreground" />
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">Catalog temporarily unavailable</p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">Your activity and saved work remain available while ExamTree reconnects.</p>
        </div>
        <button
          type="button"
          onClick={() => void retryCatalog()}
          disabled={isRetrying}
          className="et-interactive inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-card px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100/70 disabled:cursor-wait disabled:opacity-60 dark:text-amber-200"
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
      className="et-viewport et-page-surface bg-background text-foreground"
      style={{ "--sidebar-width": "260px" } as CSSProperties}
    >
      <a
        href="#main-content"
        className="sr-only z-[1000] rounded-lg bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-x-clip">
        <CatalogAwareHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="et-page-content flex flex-1 flex-col gap-6 bg-transparent px-4 pb-5 pt-24 transition-[padding] duration-200 sm:px-6 sm:pb-7 sm:pt-28 lg:px-8"
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
