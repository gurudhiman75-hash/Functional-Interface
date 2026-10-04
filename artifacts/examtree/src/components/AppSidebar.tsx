import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Bookmark,
  BookOpen,
  CircleHelp,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Newspaper,
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
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/exams", label: "My Exams", icon: BookOpen },
  { href: "/exams", label: "Test Series", icon: ClipboardList },
  { href: "/mock-tests", label: "Free Tests", icon: FileText },
  { href: "/mock-tests", label: "Practice by Topic", icon: Target },
  { href: "/resources", label: "Study Material", icon: BookOpen },
  { href: "/current-affairs", label: "Current Affairs", icon: Newspaper, badge: "New" },
  { href: "/performance", label: "Performance", icon: BarChart3 },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/profile", label: "Settings", icon: Settings },
  { href: "/contact", label: "Help & Support", icon: CircleHelp },
];

function isLinkActive(location: string, href: string) {
  if (href === "/dashboard") return location === "/dashboard" || location === "/result";
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
        <Link href="/dashboard" aria-label="ExamTree dashboard" className="flex min-h-11 items-center gap-3 rounded-xl px-1 py-1">
          <svg width="37" height="37" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M4 12.5c5.3-.2 9.6 1.2 13.2 4.3V34C13.3 31.5 9 30.5 4 30.8V12.5Z" fill="#0d2d71"/>
            <path d="M36 12.5c-5.3-.2-9.6 1.2-13.2 4.3V34c3.9-2.5 8.2-3.5 13.2-3.2V12.5Z" fill="#0b4ca2"/>
            <path d="M20 14c-4-5.6-8.8-6.2-11.1-5 2.8 1.6 5 4.1 6.1 7.2 1.5-.9 3.2-1.7 5-2.2Z" fill="#0a72e8"/>
            <path d="M20 14c4-5.6 8.8-6.2 11.1-5-2.8 1.6-5 4.1-6.1 7.2-1.5-.9-3.2-1.7-5-2.2Z" fill="#1398ff"/>
          </svg>
          <p className="truncate text-[21px] font-extrabold tracking-[-0.04em] text-[#0b1b4d]">Examtree</p>
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
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-2"><span>{link.label}</span>{"badge" in link && link.badge ? <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-extrabold text-white">{link.badge}</span> : null}</span>
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