import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  BookOpen,
  Trophy,
  LogOut,
  Menu,
  X,
  User,
  LayoutDashboard,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import { getUser, clearAuth } from "@/lib/storage";
import { getFirebaseAuth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";

interface NavbarProps {
  onLoginClick?: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
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
      window.location.reload();
    }
  };

  const isAdmin = user?.role === "admin";
  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { href: "/exams", label: "Exams", icon: <FlaskConical className="w-4 h-4" /> },
        { href: "/leaderboard", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> },
        ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: <ShieldCheck className="w-4 h-4" /> }] : []),
      ]
    : [{ href: "/leaderboard", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> }];

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/55 bg-[linear-gradient(135deg,hsl(var(--card)/0.9),hsl(var(--card)/0.74))] backdrop-blur-2xl shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)]"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group" data-testid="nav-logo">
            <div className="w-10 h-10 rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--secondary)))] flex items-center justify-center text-white shadow-[0_16px_35px_-18px_hsl(var(--primary)/0.8)] group-hover:scale-[1.03] transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EXAMTREE
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground/90">
                Smart Prep Studio
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location === link.href
                    ? "bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setLocation(isAdmin ? "/admin" : "/dashboard")}
                  className="hidden md:flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 shadow-sm transition-colors hover:bg-white"
                  data-testid="btn-profile"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isAdmin ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                    {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="leading-tight">
                    <span className="block text-sm font-semibold capitalize" data-testid="nav-username">
                      {user.name}
                    </span>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {isAdmin ? "Admin Console" : "Student"}
                    </span>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                  data-testid="btn-logout"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={onLoginClick ?? (() => setLocation("/login/student"))}
                size="sm"
                className="rounded-xl shadow-[0_16px_35px_-20px_hsl(var(--primary)/0.75)]"
                data-testid="btn-login"
              >
                Student Login
              </Button>
            )}

            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen((value) => !value)}
              data-testid="btn-mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/70 bg-card/95 backdrop-blur-xl animate-fadeIn" data-testid="mobile-menu">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 w-full"
                onClick={() => setMobileOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="pt-2 border-t border-border mt-2">
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/70"
                  onClick={() => {
                    setMobileOpen(false);
                    setLocation(isAdmin ? "/admin" : "/dashboard");
                  }}
                  data-testid="btn-profile-mobile"
                >
                  Signed in as <span className="font-medium text-foreground capitalize">{user.name}</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-border mt-2">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    (onLoginClick ?? (() => setLocation("/login/student")))();
                  }}
                >
                  Student Login
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
