import { useLocation, useParams } from "wouter";
import { ArrowLeft, Clock, BarChart2, ChevronRight, Cpu, Heart, BarChart3, Building2, Wrench, FileText } from "lucide-react";
import { categories } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ICONS: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
};

const GRADIENT_MAP: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  emerald: "from-emerald-500 to-emerald-600",
  violet: "from-violet-500 to-violet-600",
  amber: "from-amber-500 to-amber-600",
  orange: "from-orange-500 to-orange-600",
  rose: "from-rose-500 to-rose-600",
};

export default function Subcategory() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const category = categories.find((c) => c.id === id);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Category not found</h2>
            <Button onClick={() => setLocation("/")}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const gradient = GRADIENT_MAP[category.color] ?? "from-primary to-secondary";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className={`bg-gradient-to-r ${gradient} text-white py-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors"
            data-testid="btn-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              {ICONS[category.icon]}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{category.name}</h1>
              <p className="text-white/80 text-sm mt-0.5">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Select Exam Year</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {category.exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setLocation("/tests")}
              className="group glass-panel surface-hover rounded-[1.7rem] border border-white/20 p-6 shadow-lg transition-transform hover:-translate-y-1 text-left"
              data-testid={`exam-card-${exam.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary" className="text-xs">{exam.year}</Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-bold text-foreground text-base mb-3">{exam.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{exam.testsCount} tests available</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Avg Score: <span className="font-semibold text-primary">{exam.avgScore}%</span></span>
                </div>
              </div>
              <div className="mt-4 w-full py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg text-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                View Tests
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
