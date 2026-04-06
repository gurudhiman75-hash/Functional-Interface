import { useState } from "react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Users, BookOpen, HelpCircle, Activity, Plus, Edit, Trash2, Search } from "lucide-react";
import { getUser } from "@/lib/storage";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { allTests, categories } from "@/lib/data";

const stats = [
  { label: "Total Users", value: "12,450", icon: <Users className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
  { label: "Total Tests", value: "542", icon: <BookOpen className="w-5 h-5" />, color: "text-secondary", bg: "bg-secondary/10" },
  { label: "Total Questions", value: "28,950", icon: <HelpCircle className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
  { label: "Test Attempts", value: "156,320", icon: <Activity className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
];

export default function Admin() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const [tab, setTab] = useState<"categories" | "tests">("categories");
  const [catName, setCatName] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user) return null;

  const filteredTests = allTests.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage tests, categories, and platform data</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-sm" data-testid={`admin-stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center ${s.color} mb-3`}>
                {s.icon}
              </div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
          {(["categories", "tests"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all capitalize ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              data-testid={`admin-tab-${t}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "categories" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Add New Category
              </h3>
              <form
                className="flex gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (catName.trim()) {
                    setCatName("");
                    alert(`Category "${catName}" added (demo only)`);
                  }
                }}
              >
                <div className="flex-1">
                  <Label className="sr-only" htmlFor="cat-name">Category Name</Label>
                  <Input
                    id="cat-name"
                    placeholder="Category name (e.g., IBPS PO)"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    data-testid="input-category-name"
                  />
                </div>
                <Button type="submit" data-testid="btn-add-category">Add Category</Button>
              </form>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Categories ({categories.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors" data-testid={`category-row-${cat.id}`}>
                    <div>
                      <p className="font-medium text-foreground">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.testsCount} tests</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive h-8 px-2">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "tests" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Create New Test
              </h3>
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={(e) => { e.preventDefault(); alert("Test created (demo only)"); }}>
                <div>
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input id="test-name" placeholder="e.g., JEE Main Mock 10" className="mt-1" data-testid="input-test-name" />
                </div>
                <div>
                  <Label htmlFor="test-category">Category</Label>
                  <select id="test-category" className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" data-testid="select-test-category">
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="test-duration">Duration (minutes)</Label>
                  <Input id="test-duration" type="number" placeholder="180" className="mt-1" data-testid="input-test-duration" />
                </div>
                <div>
                  <Label htmlFor="test-questions">Total Questions</Label>
                  <Input id="test-questions" type="number" placeholder="90" className="mt-1" data-testid="input-test-questions" />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" data-testid="btn-create-test">Create Test</Button>
                </div>
              </form>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border gap-3">
                <h3 className="font-semibold text-foreground">Tests ({allTests.length})</h3>
                <div className="relative w-56">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="Search tests..." className="pl-8 h-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-tests" />
                </div>
              </div>
              <div className="divide-y divide-border">
                {filteredTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors" data-testid={`test-row-${test.id}`}>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{test.name}</p>
                      <p className="text-xs text-muted-foreground">{test.category} • {test.totalQuestions} questions • {test.duration} min</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{test.attempts.toLocaleString()} attempts</span>
                      <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive h-8 px-2">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
