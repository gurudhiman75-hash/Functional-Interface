import { Link, useLocation } from "wouter";
import {
  BarChart3,
  ClipboardList,
  CreditCard,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  Target,
  User,
  WandSparkles,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { getUser, clearAuth } from "@/lib/storage";
import { getFirebaseAuth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const primaryLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tests", label: "Tests & Exams", icon: ClipboardList },
  { href: "/packages", label: "Packages", icon: CreditCard },
  { href: "/dashboard", label: "Practice", icon: Target },
  { href: "/performance", label: "Analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin";
  const links = isAdmin
    ? [
        ...primaryLinks,
        { href: "/admin", label: "Admin", icon: ShieldCheck },
        { href: "/admin/generator", label: "Question Studio", icon: WandSparkles },
      ]
    : primaryLinks;

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    try {
      if (auth) await signOut(auth);
    } catch {
      // Keep local logout resilient.
    } finally {
      clearAuth();
      toast({ title: "Logged out", description: "Your session has ended." });
      setLocation("/");
    }
  };

  return (
    <Sidebar
      className="border-r border-slate-800 bg-slate-950 text-slate-300 [&_[data-sidebar=sidebar]]:bg-slate-950"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-slate-800 px-4 py-4">
        <Link href="/" className="flex items-center gap-3 rounded-md px-1 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
            <span className="text-sm font-semibold">E</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-white">examtree</p>
            <p className="truncate text-[11px] text-slate-500">Testing Platform</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {links.map((link) => {
            const active =
              location === link.href ||
              (link.href === "/tests" && (location.startsWith("/category") || location.startsWith("/subcategory"))) ||
              (link.href === "/dashboard" && location.startsWith("/test/"));
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={link.label}
                  className="rounded-md border border-transparent border-l-2 px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white data-[active=true]:border-l-indigo-500 data-[active=true]:bg-slate-900 data-[active=true]:text-white"
                >
                  <Link href={link.href} className="flex items-center gap-3">
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800 p-3">
        {user ? (
          <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/70 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-slate-300">
              {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user.name}</p>
              <p className="truncate text-[11px] text-slate-500">{isAdmin ? "Administrator" : "Student"}</p>
            </div>
            <Link
              href="/profile"
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <SidebarMenuButton
            asChild
            className="rounded-md border border-slate-800 bg-slate-900/70 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Link href="/login/student">Login</Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
