import { Link, useLocation } from "wouter";
import { useState } from "react";
import { BookOpen, Trophy, LogOut, Menu, X, User, LayoutDashboard, FlaskConical } from "lucide-react";
import { getUser, clearAuth } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onLoginClick?: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getUser();
  const { toast } = useToast();

  const handleLogout = () => {
    clearAuth();
    toast({ title: "Logged out successfully", description: "See you soon!" });
    setLocation("/");
    window.location.reload();
  };

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { href: "/tests", label: "Tests", icon: <FlaskConical className="w-4 h-4" /> },
        { href: "/leaderboard", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> },
      ]
    : [
        { href: "/leaderboard", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> },
      ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group" data-testid="nav-logo">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MockTestPro
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium capitalize" data-testid="nav-username">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  data-testid="btn-logout"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={onLoginClick ?? (() => setLocation("/login"))}
                size="sm"
                data-testid="btn-login"
              >
                Login
              </Button>
            )}

            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="btn-mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fadeIn" data-testid="mobile-menu">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
                onClick={() => setMobileOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="pt-2 border-t border-border mt-2">
                <p className="px-3 py-1 text-xs text-muted-foreground">Signed in as <span className="font-medium text-foreground capitalize">{user.name}</span></p>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
