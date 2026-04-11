import { lazy, Suspense, useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { syncAuthSession } from "@/lib/auth";
import { hydrateAdminDataFromCloud } from "@/lib/storage";

const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Tests = lazy(() => import("@/pages/tests"));
const Category = lazy(() => import("@/pages/category"));
const Subcategory = lazy(() => import("@/pages/subcategory"));
const Test = lazy(() => import("@/pages/test"));
const Result = lazy(() => import("@/pages/result"));
const Leaderboard = lazy(() => import("@/pages/leaderboard"));
const Admin = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

console.log("App.tsx loaded");

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  console.log("Router component rendered, location:", location);

  return (
    <Suspense fallback={<RouteSkeleton />}>
      <div key={location} className="animate-fadeInUp">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/login/student" component={Login} />
          <Route path="/login/admin" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/tests" component={Tests} />
          <Route path="/category/:id" component={Category} />
          <Route path="/subcategory/:id" component={Subcategory} />
          <Route path="/test/:id" component={Test} />
          <Route path="/result" component={Result} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Suspense>
  );
}

function RouteSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-5">
          <div className="h-12 w-48 rounded-2xl bg-muted" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-40 rounded-3xl bg-muted" />
            <div className="h-40 rounded-3xl bg-muted" />
            <div className="h-40 rounded-3xl bg-muted" />
          </div>
          <div className="h-72 rounded-3xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  useEffect(() => {
    let isActive = true;
    let unsubscribe = () => {};

    // Try to sync auth session, but don't fail if Firebase is not available
    try {
      unsubscribe = syncAuthSession();
    } catch (error) {
      console.warn("Auth sync failed, continuing without auth:", error);
    }

    // Bootstrap with automatic fallback timeout
    const bootstrapPromise = (async () => {
      try {
        await hydrateAdminDataFromCloud();
      } catch (error) {
        console.error("Admin data hydration failed:", error);
      }
      if (isActive) {
        setIsBootstrapped(true);
      }
    })();

    // Safety timeout - if hydration takes > 5 seconds, proceed anyway
    const timeoutId = setTimeout(() => {
      if (isActive) {
        setIsBootstrapped(true);
      }
    }, 5000);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {isBootstrapped ? (
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          ) : (
            <RouteSkeleton />
          )}
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
