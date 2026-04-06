import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Search, Clock, Users, ChevronRight, Filter, BookOpen } from "lucide-react";
import { getUser } from "@/lib/storage";
import { allTests, categories } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const CATEGORY_COLORS: Record<string, string> = {
  JEE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  NEET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CAT: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  UPSC: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  GATE: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  SSC: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function Tests() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!user) setLocation("/login");
  }, [user, setLocation]);

  if (!user) return null;

  const filtered = allTests.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || t.categoryId === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Available Tests</h1>
          <p className="text-muted-foreground text-sm">{allTests.length} tests across {categories.length} exam categories</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${selectedCategory === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              data-testid="filter-all"
            >
              All
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                data-testid={`filter-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No tests found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((test) => (
              <div
                key={test.id}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                data-testid={`test-card-${test.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${CATEGORY_COLORS[test.category] ?? "bg-muted text-muted-foreground"}`}>
                      {test.category}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${DIFFICULTY_COLORS[test.difficulty]}`}>
                      {test.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-foreground mb-1">{test.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {test.sections.join(" • ")}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{test.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-secondary" />
                    <span>{test.totalQuestions} Qs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>{test.attempts.toLocaleString()} attempts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Avg {test.avgScore}%</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setLocation(`/test/${test.id}`)}
                  data-testid={`btn-start-test-${test.id}`}
                >
                  Start Test
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
