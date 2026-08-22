import { signOut } from "firebase/auth";
import {
  ClipboardList,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  Target,
  User,
  WandSparkles,
} from "lucide-react";
import { Link, useLocation } from "wouter";

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
import { useToast } from "@/hooks/use-toast";
import { getFirebaseAuth } from "@/lib/firebase";
import { clearAuth, getUser } from "@/lib/storage";

const primaryLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tests", label: "Tests & Exams", icon: ClipboardList },
  { href: "/dashboard", label: "My Activity", icon: Target },
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
        { href: "/admin/content/questions/generate", label: "Question Studio", icon: WandSparkles },
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
      className="border-r border-slate-200 bg-white text-slate-700 [&_[data-sidebar=sidebar]]:border-slate-200 [&_[data-sidebar=sidebar]]:bg-white [&_[data-slot=sidebar-inner]]:bg-white"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-slate-200 px-3 py-3">
        <Link
          href="/"
          aria-label="ExamTree home"
          className="flex min-h-11 items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1e1b4b] text-sm font-semibold text-white">E</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight text-slate-950">examtree</span>
            <span className="block truncate text-[11px] font-medium text-slate-500">Preparation workspace</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 group-data-[collapsible=icon]:hidden">
          Preparation
        </p>
        <SidebarMenu className="space-y-1">
          {links.map((link) => {
            const active =
              location === link.href
              || (link.href === "/tests" && (location.startsWith("/category") || location.startsWith("/subcategory")))
              || (link.href === "/dashboard" && location.startsWith("/test/"));
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={link.label}
                  className="min-h-11 rounded-lg border border-transparent border-l-2 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 data-[active=true]:border-l-indigo-700 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-950"
                >
                  <Link href={link.href} className="flex items-center gap-3">
                    <link.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-3">
        {user ? (
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-800 ring-1 ring-slate-200">
              {isAdmin ? <ShieldCheck className="h-4 w-4" aria-hidden="true" /> : <User className="h-4 w-4" aria-hidden="true" />}
            </div>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-xs font-semibold text-slate-950">{user.name}</p>
              <p className="truncate text-[11px] text-slate-500">{isAdmin ? "Administrator" : "Student"}</p>
            </div>
            <Link
              href="/profile"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-indigo-800"
              aria-label="Profile"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-rose-700"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <SidebarMenuButton
            asChild
            className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 hover:bg-indigo-50 hover:text-indigo-950"
          >
            <Link href="/login/student">Login</Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
