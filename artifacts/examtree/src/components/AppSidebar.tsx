import { Link, useLocation } from "wouter";
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
import { signOut } from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase";
import { clearAuth, getUser } from "@/lib/storage";
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
      className="border-r border-indigo-900 bg-[#1e1b4b] text-slate-200 [&_[data-sidebar=sidebar]]:border-indigo-900 [&_[data-sidebar=sidebar]]:bg-[#1e1b4b] [&_[data-slot=sidebar-inner]]:bg-[#1e1b4b]"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-indigo-900 px-4 py-4">
        <Link href="/" aria-label="ExamTree home" className="flex min-h-11 items-center gap-3 rounded-md px-1 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
            <span className="text-sm font-semibold">E</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-white">examtree</p>
            <p className="truncate text-[11px] font-medium text-slate-300">Tree of success</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
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
                  className="min-h-11 rounded-md border border-transparent border-l-2 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-indigo-950 hover:text-white data-[active=true]:border-l-teal-300 data-[active=true]:bg-indigo-950 data-[active=true]:text-white"
                >
                  <Link href={link.href} className="flex items-center gap-3">
                    <link.icon className="h-4 w-4" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-indigo-900 p-3">
        {user ? (
          <div className="flex items-center gap-2 rounded-md border border-indigo-800 bg-indigo-950/70 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-900 text-slate-200">
              {isAdmin ? <ShieldCheck className="h-4 w-4" aria-hidden="true" /> : <User className="h-4 w-4" aria-hidden="true" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user.name}</p>
              <p className="truncate text-[11px] text-slate-300">{isAdmin ? "Administrator" : "Student"}</p>
            </div>
            <Link
              href="/profile"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-slate-300 transition hover:bg-indigo-900 hover:text-white"
              aria-label="Profile"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <SidebarMenuButton
            asChild
            className="min-h-11 rounded-md border border-indigo-800 bg-indigo-950/70 text-slate-200 hover:bg-indigo-900 hover:text-white"
          >
            <Link href="/login/student">Login</Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
