import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Bookmark,
  BookOpen,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Home,
  LogOut,
  Newspaper,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Target,
  User,
  WandSparkles,
} from "lucide-react";
import { signOut } from "firebase/auth";
import "@/styles/student-sidebar.css";

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
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/exams", label: "Test series", icon: ClipboardList },
  { href: "/mock-tests", label: "Practice", icon: Target },
  { href: "/pyqs", label: "Previous year papers", icon: ClipboardList },
  { href: "/store", label: "Store", icon: ShoppingBag },
  { href: "/exams-covered", label: "Exams covered", icon: BookOpen },
  { href: "/performance", label: "Results", icon: BarChart3 },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/my-packages", label: "My purchases", icon: CreditCard },
  { href: "/resources", label: "Study material", icon: BookOpen },
  { href: "/current-affairs", label: "Current affairs", icon: Newspaper },
  { href: "/profile", label: "Profile & settings", icon: Settings },
  { href: "/contact", label: "Help & support", icon: CircleHelp },
  { href: "/faq", label: "FAQ", icon: CircleHelp },
];

function isLinkActive(location: string, href: string) {
  if (href === "/dashboard") return location === "/dashboard";
  if (href === "/exams") return location === "/exams" || location === "/tests"
    || ["/category/", "/subcategory/", "/test-series/", "/published-tests/"].some(prefix => location.startsWith(prefix));
  if (href === "/store") return location === "/store" || location === "/packages" || location.startsWith("/store/") || location.startsWith("/packages/");
  if (href === "/resources") return location === "/resources" || (location.startsWith("/resources/") && !location.startsWith("/resources/current-affairs"));
  if (href === "/current-affairs") return location === "/current-affairs" || location.startsWith("/resources/current-affairs");
  if (href === "/performance") return location === "/performance" || location === "/result";
  if (href === "/my-packages") return location === "/purchases" || location === "/my-packages" || location.startsWith("/my-packages/");
  if (href === "/admin") return location === "/admin" || (location.startsWith("/admin/") && !location.startsWith("/admin/content/questions/generate"));
  return location === href || location.startsWith(href + "/");
}

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin";
  const links = isAdmin ? [
    ...primaryLinks,
    { href: "/admin", label: "Admin", icon: ShieldCheck },
    { href: "/admin/content/questions/generate", label: "Question Studio", icon: WandSparkles },
  ] : primaryLinks;

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
      className="student-app-sidebar border-r border-sidebar-border bg-sidebar text-sidebar-foreground [&_[data-sidebar=sidebar]]:border-sidebar-border [&_[data-sidebar=sidebar]]:bg-sidebar [&_[data-slot=sidebar-inner]]:bg-sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/dashboard" aria-label="ExamTree dashboard" className="flex min-h-11 items-center gap-3 rounded-xl px-1 py-1">
          <img src="/examtree-mark.svg" width="37" height="37" alt="" aria-hidden="true" className="h-[37px] w-[37px] shrink-0 object-contain" />
          <p className="truncate text-[21px] font-extrabold tracking-[-0.04em] text-sidebar-foreground">Examtree</p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {links.map((link) => {
            const active = isLinkActive(location, link.href);
            return (
              <SidebarMenuItem key={`${link.href}-${link.label}`}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={link.label}
                  className="min-h-11 rounded-xl border border-transparent border-l-2 px-3 py-2 text-sm font-semibold text-sidebar-foreground/72 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:border-l-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link href={link.href} className="flex items-center gap-3" aria-current={active ? "page" : undefined}>
                    <link.icon className="h-4 w-4" aria-hidden="true" />
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-2"><span>{link.label}</span></span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {user ? (
          <div className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-sidebar-accent/55 p-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {isAdmin ? <ShieldCheck className="h-4 w-4" aria-hidden="true" /> : <User className="h-4 w-4" aria-hidden="true" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-sidebar-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{isAdmin ? "Administrator" : "Student"}</p>
            </div>
            <Link
              href="/profile"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${location === "/profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}
              aria-label="Profile"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <SidebarMenuButton
            asChild
            className="min-h-11 rounded-xl border border-sidebar-border bg-sidebar-accent/55 text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
          >
            <Link href="/login/student">Login</Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}