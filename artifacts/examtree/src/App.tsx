import { lazy, Suspense, useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { syncAuthSession } from "@/lib/auth";
import { hydrateAdminDataFromCloud, getUser } from "@/lib/storage";
import { getFirebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AppLayout } from "@/components/AppLayout";
import { ExamCatalogProvider } from "@/providers/ExamCatalogProvider";
import { MathJaxContext } from "better-react-mathjax";

const MATH_JAX_CONFIG = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
  },
};

const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Tests = lazy(() => import("@/pages/tests"));
const Category = lazy(() => import("@/pages/category"));
const Subcategory = lazy(() => import("@/pages/subcategory"));
const Test = lazy(() => import("@/pages/test"));
const Result = lazy(() => import("@/pages/result"));
const Performance = lazy(() => import("@/pages/performance"));
const Packages = lazy(() => import("@/pages/packages"));
const PackageCheckout = lazy(() => import("@/pages/package-checkout"));
const PackageSuccess = lazy(() => import("@/pages/package-success"));
const MyPackages = lazy(() => import("@/pages/my-packages"));
const Profile = lazy(() => import("@/pages/profile"));
const Admin = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

console.log("App.tsx loaded");

const queryClient = new QueryClient();

/** Redirects to /login/student immediately if the user is not signed in. */
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const user = getUser();
  const [location] = useLocation();
  if (!user) {
    const redirectTo = encodeURIComponent(location);
    return <Redirect to={`/login/student?next=${redirectTo}`} />;
  }
  return <Component />;
}

function Router() {
  const [location] = useLocation();

  console.log("Router component rendered, location:", location);

  const renderRoute = (Component: React.ComponentType) => {
    return (
      <AppLayout>
        <Component />
      </AppLayout>
    );
  };

  return (
    <Suspense fallback={<RouteSkeleton />}>
      <div key={location} className="animate-fadeInUp">
        <Switch>
          <Route path="/" component={() => renderRoute(Home)} />
          <Route path="/login" component={() => renderRoute(Login)} />
          <Route path="/login/student" component={() => renderRoute(Login)} />
          <Route path="/login/admin" component={() => renderRoute(Login)} />
          <Route path="/dashboard" component={() => renderRoute(Dashboard)} />
          <Route path="/exams" component={() => renderRoute(Tests)} />
          <Route path="/tests" component={() => renderRoute(Tests)} />
          <Route path="/category/:id" component={() => renderRoute(Category)} />
          <Route path="/subcategory/:id" component={() => renderRoute(Subcategory)} />
          <Route path="/test/:id" component={() => <ProtectedRoute component={Test} />} />
          <Route path="/result" component={() => renderRoute(Result)} />
          <Route path="/performance" component={() => renderRoute(Performance)} />
          <Route path="/packages" component={() => renderRoute(Packages)} />
          <Route path="/packages/success/:id" component={() => renderRoute(PackageSuccess)} />
          <Route path="/packages/:id" component={() => renderRoute(PackageCheckout)} />
          <Route path="/my-packages" component={() => renderRoute(MyPackages)} />
          <Route path="/profile" component={() => renderRoute(Profile)} />
          <Route path="/admin" component={() => renderRoute(Admin)} />
          <Route component={() => renderRoute(NotFound)} />
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

    const auth = getFirebaseAuth();
    let unsubscribeAuth = () => {};

    const bootstrap = async () => {
      try {
        if (auth) {
          const currentUser = auth.currentUser;
          if (currentUser) {
            if (getUser()?.role === "admin") {
              await hydrateAdminDataFromCloud();
            }
          } else {
            await new Promise<void>((resolve) => {
              unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser && getUser()?.role === "admin") {
                  await hydrateAdminDataFromCloud();
                }
                resolve();
              });
            });
          }
        }
      } catch (error) {
        console.error("Admin data hydration failed:", error);
      } finally {
        if (isActive) {
          setIsBootstrapped(true);
        }
      }
    };

    void bootstrap();

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
      unsubscribeAuth();
    };
  }, []);

  return (
    <AppErrorBoundary>
      <MathJaxContext version={3} config={MATH_JAX_CONFIG}>
        <QueryClientProvider client={queryClient}>
          <ExamCatalogProvider>
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
          </ExamCatalogProvider>
        </QueryClientProvider>
      </MathJaxContext>
    </AppErrorBoundary>
  );
}

export default App;
