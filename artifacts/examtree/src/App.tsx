import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { syncAuthSession } from "@/lib/auth";

const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Tests = lazy(() => import("@/pages/tests"));
const Subcategory = lazy(() => import("@/pages/subcategory"));
const Test = lazy(() => import("@/pages/test"));
const Result = lazy(() => import("@/pages/result"));
const Leaderboard = lazy(() => import("@/pages/leaderboard"));
const Admin = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

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
  useEffect(() => {
    const unsubscribe = syncAuthSession();
    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
