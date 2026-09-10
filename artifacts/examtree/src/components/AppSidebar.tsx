import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Bookmark,
  ClipboardList,
  Home,
  LogOut,
  Newspaper,
  ReceiptText,
  Settings,
  ShieldCheck,
  ShoppingBag,
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
  { href: "/exams", label: "Tests & Exams", icon: ClipboardList },
  { href: "/resources", label: "Free Resources", icon: Newspaper },
  { href: "/store", label: "Store", icon: ShoppingBag },
  { href: "/my-packages", label: "My Purchases", icon: ReceiptText },
  { href: "/dashboard", label: "My Activity", icon: Target },
  { href: "/performance", label: "Performance", icon: BarChart3 },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

function isLinkActive(location: string, href: string) {
  if (href === "/") return location === "/";
  if (href === "/exams") {
    return location === "/exams"
      || location === "/tests"
      || location.startsWith("/category/")
      || location.startsWith("/subcategory/")
      || location.startsWith("/test-series/");
  }
  if (href === "/resources") return location === "/current-affairs" || location === "/resources" || location.startsWith("/resources/");
  if (href === "/store") {
    return location === "/store"
      || location === "/packages"
      || location.startsWith("/store/")
      || (location.startsWith("/packages/") && !location.startsWith("/packages/success/"));
  }
  if (href === "/my-packages") return location === "/my-packages" || location === "/purchases";
  if (href === "/dashboard") return location === "/dashboard" || location === "/result";
  return location === href || location.startsWith(`${href}/`);
}

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
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground [&_[data-sidebar=sidebar]]:border-sidebar-border [&_[data-sidebar=sidebar]]:bg-sidebar [&_[data-slot=sidebar-inner]]:bg-sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" aria-label="ExamTree home" className="flex min-h-11 items-center gap-3 rounded-xl px-1 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="text-sm font-extrabold">E</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold tracking-[-0.03em] text-sidebar-foreground">EXAMTREE</p>
            <p className="truncate text-[11px] font-medium text-muted-foreground">Student workspace</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {links.map((link) => {
            const active = isLinkActive(location, link.href);
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={link.label}
                  className="min-h-11 rounded-xl border border-transparent border-l-2 px-3 py-2 text-sm font-semibold text-sidebar-foreground/72 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:border-l-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link href={link.href} className="flex items-center gap-3" aria-current={active ? "page" : undefined}>
                    <link.icon className="h-4 w-4" aria-hidden="true" />
                    <span>{link.label}</span>
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
              aria-current={location === "/profile" ? "page" : undefined}
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