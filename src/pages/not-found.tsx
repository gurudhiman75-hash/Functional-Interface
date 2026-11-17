import { useLocation } from "wouter";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center animate-fadeInUp max-w-sm glass-panel rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-xl">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-3">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground text-sm mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => setLocation("/")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
