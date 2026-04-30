import { Link, useLocation } from "wouter";
import {
  BarChart3,
  BookOpen,
  Gift,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Trophy,
  FlaskConical,
  WandSparkles,
  User,
} from "lucide-react";
import { getUser, clearAuth } from "@/lib/storage";
import { getFirebaseAuth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch {
      // Keep local logout resilient.
    } finally {
      clearAuth();
      toast({ title: "Logged out successfully", description: "See you soon!" });
      setLocation("/");
    }
  };

  const isAdmin = user?.role === "admin";
  const mainLinks = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/tests", label: "Tests", icon: FlaskConical },
    { href: "/packages", label: "Packages", icon: Gift },
    { href: "/performance", label: "Performance", icon: BarChart3 },
  ];

  const accountLinks = [
    { href: "/profile", label: "Profile", icon: User },
    ...(isAdmin
  ? [
      {
        href: "/admin",
        label: "Admin",
        icon: ShieldCheck,
      },

      {
        href: "/admin/generator",
        label: "Question Studio",
        icon: WandSparkles,
      },
    ]
  : []),
  ];

  return (
    <Sidebar variant="inset" className="border-r border-border/70 bg-background/95 shadow-sm">
      <SidebarHeader className="border-b border-border/70 px-3 py-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-sm transition duration-200 ease-out group-hover:scale-105">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">EXAMTREE</span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Smart Prep</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="space-y-5 px-2 py-4">
        <SidebarGroup>
          <div className="px-3 pb-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Main</p>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map((link) => (
                <SidebarMenuItem key={link.href} className="group/menu-item">
                  <SidebarMenuButton
                    asChild
                    isActive={location === link.href}
                    tooltip={link.label}
                    className="rounded-2xl border border-transparent bg-transparent px-3 py-2 text-sidebar-foreground transition duration-200 ease-out hover:-translate-x-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm data-[active=true]:border-l-4 data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={link.href} className="flex w-full items-center gap-3">
                      <link.icon className="w-4 h-4 transition-transform duration-200 ease-out group-hover/menu-item:scale-110" />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="px-3 pb-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Account</p>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountLinks.map((link) => (
                <SidebarMenuItem key={link.href} className="group/menu-item">
                  <SidebarMenuButton
                    asChild
                    isActive={location === link.href}
                    tooltip={link.label}
                    className="rounded-2xl border border-transparent bg-transparent px-3 py-2 text-sidebar-foreground transition duration-200 ease-out hover:-translate-x-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm data-[active=true]:border-l-4 data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={link.href} className="flex w-full items-center gap-3">
                      <link.icon className="w-4 h-4 transition-transform duration-200 ease-out group-hover/menu-item:scale-110" />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          <div className="space-y-3 p-3">
            <div className="rounded-3xl border border-border/70 bg-card p-3 shadow-sm transition duration-200 ease-out hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isAdmin ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{isAdmin ? "Admin Console" : "Student"}</p>
                </div>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem className="group/menu-item">
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="rounded-2xl border border-transparent bg-transparent px-3 py-2 text-destructive transition duration-200 ease-out hover:-translate-x-1 hover:bg-destructive/10 hover:text-destructive hover:shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        ) : (
          <div className="p-3">
            <SidebarMenuButton
              asChild
              tooltip="Login"
              className="rounded-2xl border border-transparent bg-transparent px-3 py-2 transition duration-200 ease-out hover:-translate-x-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
            >
              <Link href="/login/student">Login</Link>
            </SidebarMenuButton>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}