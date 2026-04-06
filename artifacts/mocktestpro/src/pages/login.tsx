import { useState } from "react";
import { useLocation } from "wouter";
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { setUser } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (tab === "signup" && !name.trim()) {
      toast({ title: "Name required", description: "Please enter your full name", variant: "destructive" });
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const displayName = tab === "signup" ? name.trim() : email.split("@")[0];
    setUser({ id: Date.now().toString(), email, name: displayName });
    toast({
      title: tab === "login" ? "Welcome back!" : "Account created!",
      description: `Logged in as ${displayName}`,
    });
    setLocation("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">MockTestPro</h1>
          <p className="text-muted-foreground text-sm mt-1">Your exam preparation partner</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tab === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              data-testid="tab-login"
            >
              Login
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tab === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              data-testid="tab-signup"
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={tab === "signup"}
                  data-testid="input-name"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="btn-toggle-password"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
              data-testid="btn-submit"
            >
              {loading ? "Please wait..." : tab === "login" ? "Login to Account" : "Create Account"}
            </Button>
          </form>
        </div>

        <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-center">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-2">Admin Access (Demo)</p>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@mocktestpro.com");
              setPassword("admin123");
              setTab("login");
            }}
            className="text-xs bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
            data-testid="btn-admin-quick-login"
          >
            Fill Admin Credentials
          </button>
        </div>

        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-1.5 mx-auto mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="btn-back"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
