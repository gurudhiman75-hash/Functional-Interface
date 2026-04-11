import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Search, Clock, Users, ChevronRight, Filter, BookOpen } from "lucide-react";
import { getActiveTestSessions, getAdminTests, getUser } from "@/lib/storage";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { upsertUserProfile } from "@/lib/auth";
import { getRuntimeCategories, getRuntimeTests } from "@/lib/test-bank";
import { getCategories, getTests, type Category, type Test } from "@/lib/data";
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

const SECTION_COLORS: Record<string, string> = {
  Physics: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/40",
  Chemistry: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-900/40",
  Mathematics: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/40",
  Biology: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40",
  VARC: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-900/40",
  DILR: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40",
  Quant: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/40",
  History: "bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-900/30 dark:text-stone-300 dark:border-stone-700/40",
  Geography: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-900/40",
  Polity: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/40",
};

export default function Tests() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const testVisibilityById = new Map(getAdminTests().map((t) => [t.id, t.showDifficulty]));
  const activeSessions = getActiveTestSessions();

  useEffect(() => {
    if (user) {
      // Fetch data from API when user is available
      const fetchData = async () => {
        try {
          const [testsData, categoriesData] = await Promise.all([
            getTests(),
            getCategories(),
          ]);
          setAllTests(testsData);
          setCategories(categoriesData);
        } catch (error) {
          console.error("Failed to fetch tests:", error);
          setAllTests([]);
          setCategories([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setLocation("/login/student");
        return;
      }
      await upsertUserProfile(firebaseUser);
    });
    return () => unsub();
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
        <div className="mb-8 glass-panel hero-panel rounded-[2rem] p-6 shadow-[0_22px_65px_-42px_rgba(0,0,0,0.55)] animate-fadeInUp">
          <Badge variant="secondary" className="mb-3 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Mock Test Library
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Available Tests</h1>
          <p className="text-muted-foreground text-sm">{allTests.length} tests across {categories.length} exam categories</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 glass-panel rounded-[1.75rem] p-4">
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${selectedCategory === "all" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              data-testid="filter-all"
            >
              All
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${selectedCategory === cat.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                data-testid={`filter-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state glass-panel rounded-[1.8rem] border-dashed border-border/70 p-10 text-center text-muted-foreground shadow-lg">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-semibold text-foreground">No tests found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((test) => (
              <div
                key={test.id}
                className="glass-panel surface-hover rounded-[1.8rem] border border-white/30 p-6 shadow-lg list-item-animate"
                data-testid={`test-card-${test.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${CATEGORY_COLORS[test.category] ?? "bg-muted text-muted-foreground"}`}>
                      {test.category}
                    </span>
                    {testVisibilityById.get(test.id) !== false && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${DIFFICULTY_COLORS[test.difficulty]}`}>
                        {test.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-foreground mb-1 leading-snug">{test.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4" data-testid={`test-sections-${test.id}`}>
                  {test.sections.map((section) => (
                    <span
                      key={section.id}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${SECTION_COLORS[section.name] ?? "bg-muted text-muted-foreground border-border"}`}
                    >
                      {section.name}
                    </span>
                  ))}
                </div>

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

                {activeSessions[test.id] && (
                  <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground">
                    Saved progress available. Resume where you left off.
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={test.totalQuestions === 0}
                  onClick={() => setLocation(`/test/${test.id}`)}
                  data-testid={`btn-start-test-${test.id}`}
                >
                  {test.totalQuestions === 0
                    ? "No Questions Yet"
                    : activeSessions[test.id]
                      ? "Resume Test"
                      : "Start Test"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
