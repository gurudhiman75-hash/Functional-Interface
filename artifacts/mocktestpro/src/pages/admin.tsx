import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  Users, BookOpen, HelpCircle, Activity, Plus, Edit, Trash2, Search,
  X, Check, AlertTriangle, Tag,
} from "lucide-react";
import {
  getUser,
  getAdminCategories, addAdminCategory, updateAdminCategory, deleteAdminCategory,
  saveAdminCategories, saveAdminTests,
  getAdminTests, addAdminTest, updateAdminTest, deleteAdminTest,
  needsReseed, markSeeded,
  type AdminCategory, type AdminTest,
} from "@/lib/storage";
import { categories as defaultCategories, allTests as defaultTests } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "admin@mocktestpro.com";

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ── Sections tag-input component ──────────────────────────────────────────────
function SectionsInput({
  sections,
  onChange,
}: {
  sections: string[];
  onChange: (s: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const val = input.trim();
    if (val && !sections.includes(val)) onChange([...sections, val]);
    setInput("");
  };

  const remove = (s: string) => onChange(sections.filter((x) => x !== s));

  return (
    <div>
      <Label>Sections</Label>
      <div
        className="mt-1 min-h-[38px] flex flex-wrap gap-1.5 items-center px-3 py-1.5 bg-background border border-input rounded-lg focus-within:ring-2 focus-within:ring-ring cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {sections.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-md"
          >
            {s}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(s); }}
              className="hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder={sections.length === 0 ? "Type a section, press Enter or comma…" : "Add more…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
            if (e.key === "Backspace" && !input && sections.length) remove(sections[sections.length - 1]);
          }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">Press Enter or comma to add. Backspace removes last.</p>
    </div>
  );
}

// ── Delete confirmation modal ─────────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl animate-fadeInUp">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Confirm Delete</h3>
            <p className="text-xs text-muted-foreground">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Are you sure you want to delete <span className="font-semibold text-foreground">"{name}"</span>?
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">Delete</Button>
        </div>
      </div>
    </div>
  );
}

// ── Seed helper (clears + re-seeds from defaults) ────────────────────────────
function seedDefaults() {
  saveAdminCategories([]);
  saveAdminTests([]);
  defaultCategories.forEach((c) =>
    addAdminCategory({ name: c.name, description: c.description, testsCount: c.testsCount })
  );
  const seededCats = getAdminCategories();
  defaultTests.forEach((t) => {
    const match = seededCats.find((c) => c.name.startsWith(t.category.split(" ")[0]));
    addAdminTest({
      name: t.name,
      categoryId: match?.id ?? "",
      categoryName: match?.name ?? t.category,
      duration: t.duration,
      totalQuestions: t.totalQuestions,
      difficulty: t.difficulty,
      sections: t.sections ?? [],
    });
  });
  markSeeded();
}

// ── Blank form defaults ───────────────────────────────────────────────────────
const blankTestForm = () => ({
  name: "",
  categoryId: "",
  duration: "",
  totalQuestions: "",
  difficulty: "Medium" as AdminTest["difficulty"],
  sections: [] as string[],
});

// ── Main admin page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();
  const [tab, setTab] = useState<"categories" | "tests">("categories");
  const [search, setSearch] = useState("");

  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [catForm, setCatForm] = useState({ name: "", description: "" });
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [deletingCat, setDeletingCat] = useState<AdminCategory | null>(null);

  const [tests, setTests] = useState<AdminTest[]>([]);
  const [testForm, setTestForm] = useState(blankTestForm());
  const [editingTest, setEditingTest] = useState<AdminTest | null>(null);
  const [deletingTest, setDeletingTest] = useState<AdminTest | null>(null);

  const reload = () => {
    setCats(getAdminCategories());
    setTests(getAdminTests());
  };

  const handleReset = () => {
    if (!confirm("This will clear all admin data and restore defaults. Continue?")) return;
    seedDefaults();
    reload();
    toast({ title: "Data reset", description: "Restored to default categories and tests" });
  };

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) { setLocation("/"); return; }
    // Force re-seed if version is stale or data is missing
    if (needsReseed()) {
      seedDefaults();
    }
    reload();
  }, []);

  if (!user || user.email !== ADMIN_EMAIL) return null;

  // ── Category handlers ──
  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    addAdminCategory({ name: catForm.name.trim(), description: catForm.description.trim(), testsCount: 0 });
    setCats(getAdminCategories());
    toast({ title: "Category added", description: `"${catForm.name}" created successfully` });
    setCatForm({ name: "", description: "" });
  };

  const handleSaveEditCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    updateAdminCategory(editingCat.id, { name: editingCat.name, description: editingCat.description });
    setCats(getAdminCategories());
    toast({ title: "Category updated" });
    setEditingCat(null);
  };

  const handleDeleteCat = () => {
    if (!deletingCat) return;
    deleteAdminCategory(deletingCat.id);
    setCats(getAdminCategories());
    setTests(getAdminTests());
    toast({ title: "Category deleted", variant: "destructive" });
    setDeletingCat(null);
  };

  // ── Test handlers ──
  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.name.trim() || !testForm.categoryId) return;
    const cat = cats.find((c) => c.id === testForm.categoryId);
    addAdminTest({
      name: testForm.name.trim(),
      categoryId: testForm.categoryId,
      categoryName: cat?.name ?? "",
      duration: Number(testForm.duration) || 180,
      totalQuestions: Number(testForm.totalQuestions) || 90,
      difficulty: testForm.difficulty,
      sections: testForm.sections,
    });
    updateAdminCategory(testForm.categoryId, { testsCount: (cat?.testsCount ?? 0) + 1 });
    setTests(getAdminTests());
    setCats(getAdminCategories());
    toast({ title: "Test created", description: `"${testForm.name}" added` });
    setTestForm(blankTestForm());
  };

  const handleSaveEditTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;
    const cat = cats.find((c) => c.id === editingTest.categoryId);
    updateAdminTest(editingTest.id, { ...editingTest, categoryName: cat?.name ?? editingTest.categoryName });
    setTests(getAdminTests());
    toast({ title: "Test updated" });
    setEditingTest(null);
  };

  const handleDeleteTest = () => {
    if (!deletingTest) return;
    deleteAdminTest(deletingTest.id);
    const cat = cats.find((c) => c.id === deletingTest.categoryId);
    if (cat) updateAdminCategory(cat.id, { testsCount: Math.max(0, (cat.testsCount ?? 1) - 1) });
    setTests(getAdminTests());
    setCats(getAdminCategories());
    toast({ title: "Test deleted", variant: "destructive" });
    setDeletingTest(null);
  };

  const filteredTests = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Categories", value: cats.length, icon: <HelpCircle className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Tests", value: tests.length, icon: <BookOpen className="w-5 h-5" />, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Total Attempts", value: tests.reduce((a, t) => a + t.attempts, 0).toLocaleString(), icon: <Activity className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
    { label: "Platform Users", value: "12,450", icon: <Users className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeInUp flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage categories, tests, and platform data</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="shrink-0 text-muted-foreground hover:text-destructive hover:border-destructive">
            Reset to Defaults
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
          {(["categories", "tests"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all capitalize ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── CATEGORIES TAB ── */}
        {tab === "categories" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Add New Category
              </h3>
              <form onSubmit={handleAddCat} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="cat-name">Name *</Label>
                  <Input id="cat-name" className="mt-1" placeholder="e.g., IBPS PO" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Input id="cat-desc" className="mt-1" placeholder="Brief description" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit"><Plus className="w-4 h-4 mr-1.5" /> Add Category</Button>
                </div>
              </form>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Categories <span className="text-muted-foreground font-normal text-sm">({cats.length})</span></h3>
              </div>
              {cats.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">No categories yet. Add one above.</div>
              ) : (
                <div className="divide-y divide-border">
                  {cats.map((cat) => (
                    <div key={cat.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                      {editingCat?.id === cat.id ? (
                        <form onSubmit={handleSaveEditCat} className="flex items-center gap-2 flex-wrap">
                          <Input className="flex-1 min-w-32 h-8 text-sm" value={editingCat.name} onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })} required />
                          <Input className="flex-1 min-w-48 h-8 text-sm" value={editingCat.description} onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })} placeholder="Description" />
                          <div className="flex gap-1">
                            <Button type="submit" size="sm" className="h-8 px-2"><Check className="w-3.5 h-3.5" /></Button>
                            <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => setEditingCat(null)}><X className="w-3.5 h-3.5" /></Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">{cat.description || "—"} • {cat.testsCount} tests</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-primary" onClick={() => setEditingCat(cat)}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:text-destructive" onClick={() => setDeletingCat(cat)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TESTS TAB ── */}
        {tab === "tests" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Create New Test
              </h3>
              <form onSubmit={handleAddTest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="test-name">Test Name *</Label>
                  <Input id="test-name" className="mt-1" placeholder="e.g., JEE Main Mock 10" value={testForm.name} onChange={(e) => setTestForm({ ...testForm, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="test-category">Category *</Label>
                  <select
                    id="test-category"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={testForm.categoryId}
                    onChange={(e) => setTestForm({ ...testForm, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="test-difficulty">Difficulty</Label>
                  <select
                    id="test-difficulty"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={testForm.difficulty}
                    onChange={(e) => setTestForm({ ...testForm, difficulty: e.target.value as AdminTest["difficulty"] })}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="test-duration">Duration (minutes)</Label>
                  <Input id="test-duration" type="number" min="1" className="mt-1" placeholder="180" value={testForm.duration} onChange={(e) => setTestForm({ ...testForm, duration: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="test-questions">Total Questions</Label>
                  <Input id="test-questions" type="number" min="1" className="mt-1" placeholder="90" value={testForm.totalQuestions} onChange={(e) => setTestForm({ ...testForm, totalQuestions: e.target.value })} />
                </div>

                {/* Sections tag input */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <SectionsInput
                    sections={testForm.sections}
                    onChange={(s) => setTestForm({ ...testForm, sections: s })}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <Button type="submit"><Plus className="w-4 h-4 mr-1.5" /> Create Test</Button>
                </div>
              </form>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border gap-3">
                <h3 className="font-semibold text-foreground">Tests <span className="text-muted-foreground font-normal text-sm">({tests.length})</span></h3>
                <div className="relative w-52">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="Search tests…" className="pl-8 h-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>

              {filteredTests.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">No tests found. Create one above.</div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredTests.map((test) => (
                    <div key={test.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                      {editingTest?.id === test.id ? (
                        <form onSubmit={handleSaveEditTest} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="col-span-2 sm:col-span-3">
                            <Label className="text-xs">Name</Label>
                            <Input className="mt-0.5 h-8 text-sm" value={editingTest.name} onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })} required />
                          </div>
                          <div>
                            <Label className="text-xs">Category</Label>
                            <select
                              className="mt-0.5 w-full h-8 px-2 bg-background border border-input rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                              value={editingTest.categoryId}
                              onChange={(e) => setEditingTest({ ...editingTest, categoryId: e.target.value })}
                            >
                              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs">Difficulty</Label>
                            <select
                              className="mt-0.5 w-full h-8 px-2 bg-background border border-input rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                              value={editingTest.difficulty}
                              onChange={(e) => setEditingTest({ ...editingTest, difficulty: e.target.value as AdminTest["difficulty"] })}
                            >
                              <option>Easy</option><option>Medium</option><option>Hard</option>
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs">Duration (min)</Label>
                            <Input type="number" className="mt-0.5 h-8 text-sm" value={editingTest.duration} onChange={(e) => setEditingTest({ ...editingTest, duration: Number(e.target.value) })} />
                          </div>
                          <div>
                            <Label className="text-xs">Questions</Label>
                            <Input type="number" className="mt-0.5 h-8 text-sm" value={editingTest.totalQuestions} onChange={(e) => setEditingTest({ ...editingTest, totalQuestions: Number(e.target.value) })} />
                          </div>
                          <div className="col-span-2 sm:col-span-3">
                            <SectionsInput
                              sections={editingTest.sections ?? []}
                              onChange={(s) => setEditingTest({ ...editingTest, sections: s })}
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-3 flex gap-1.5">
                            <Button type="submit" size="sm"><Check className="w-3.5 h-3.5 mr-1" /> Save</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => setEditingTest(null)}><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-medium text-foreground text-sm">{test.name}</p>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[test.difficulty]}`}>{test.difficulty}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1.5">
                              {test.categoryName} • {test.totalQuestions} questions • {test.duration} min • {test.attempts.toLocaleString()} attempts
                            </p>
                            {test.sections && test.sections.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                <Tag className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                                {test.sections.map((s) => (
                                  <span key={s} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{s}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-primary" onClick={() => setEditingTest(test)}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:text-destructive" onClick={() => setDeletingTest(test)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {deletingCat && <DeleteModal name={deletingCat.name} onConfirm={handleDeleteCat} onCancel={() => setDeletingCat(null)} />}
      {deletingTest && <DeleteModal name={deletingTest.name} onConfirm={handleDeleteTest} onCancel={() => setDeletingTest(null)} />}
    </div>
  );
}
