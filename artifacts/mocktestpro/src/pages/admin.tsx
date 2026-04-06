import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Users, BookOpen, HelpCircle, Activity, Plus, Edit, Trash2, Search,
  X, Check, AlertTriangle,
} from "lucide-react";
import {
  getUser,
  getAdminCategories, addAdminCategory, updateAdminCategory, deleteAdminCategory,
  getAdminTests, addAdminTest, updateAdminTest, deleteAdminTest,
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
          <Button variant="outline" onClick={onCancel} className="flex-1" data-testid="btn-cancel-delete">Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1" data-testid="btn-confirm-delete">Delete</Button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();
  const [tab, setTab] = useState<"categories" | "tests">("categories");
  const [search, setSearch] = useState("");

  // ── Categories state ──
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [catForm, setCatForm] = useState({ name: "", description: "" });
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [deletingCat, setDeletingCat] = useState<AdminCategory | null>(null);

  // ── Tests state ──
  const [tests, setTests] = useState<AdminTest[]>([]);
  const [testForm, setTestForm] = useState({ name: "", categoryId: "", duration: "", totalQuestions: "", difficulty: "Medium" as AdminTest["difficulty"] });
  const [editingTest, setEditingTest] = useState<AdminTest | null>(null);
  const [deletingTest, setDeletingTest] = useState<AdminTest | null>(null);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) {
      setLocation("/");
      return;
    }
    // Seed localStorage from defaults if empty
    const stored = getAdminCategories();
    if (stored.length === 0) {
      const seeded = defaultCategories.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        testsCount: c.testsCount,
      }));
      seeded.forEach((c) => addAdminCategory({ name: c.name, description: c.description, testsCount: c.testsCount }));
    }
    const storedTests = getAdminTests();
    if (storedTests.length === 0) {
      defaultTests.forEach((t) =>
        addAdminTest({
          name: t.name,
          categoryId: t.categoryId,
          categoryName: t.category,
          duration: t.duration,
          totalQuestions: t.totalQuestions,
          difficulty: t.difficulty,
        })
      );
    }
    setCats(getAdminCategories());
    setTests(getAdminTests());
  }, []);

  if (!user || user.email !== ADMIN_EMAIL) return null;

  // ── Category handlers ──
  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    addAdminCategory({ name: catForm.name.trim(), description: catForm.description.trim(), testsCount: 0 });
    setCats(getAdminCategories());
    setCatForm({ name: "", description: "" });
    toast({ title: "Category added", description: `"${catForm.name}" created successfully` });
  };

  const handleSaveEditCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    updateAdminCategory(editingCat.id, { name: editingCat.name, description: editingCat.description });
    setCats(getAdminCategories());
    toast({ title: "Category updated", description: `"${editingCat.name}" saved` });
    setEditingCat(null);
  };

  const handleDeleteCat = () => {
    if (!deletingCat) return;
    deleteAdminCategory(deletingCat.id);
    setCats(getAdminCategories());
    setTests(getAdminTests());
    toast({ title: "Category deleted", description: `"${deletingCat.name}" removed`, variant: "destructive" });
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
    });
    // bump testsCount
    updateAdminCategory(testForm.categoryId, { testsCount: (cat?.testsCount ?? 0) + 1 });
    setTests(getAdminTests());
    setCats(getAdminCategories());
    setTestForm({ name: "", categoryId: "", duration: "", totalQuestions: "", difficulty: "Medium" });
    toast({ title: "Test created", description: `"${testForm.name}" added` });
  };

  const handleSaveEditTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;
    const cat = cats.find((c) => c.id === editingTest.categoryId);
    updateAdminTest(editingTest.id, { ...editingTest, categoryName: cat?.name ?? editingTest.categoryName });
    setTests(getAdminTests());
    toast({ title: "Test updated", description: `"${editingTest.name}" saved` });
    setEditingTest(null);
  };

  const handleDeleteTest = () => {
    if (!deletingTest) return;
    deleteAdminTest(deletingTest.id);
    const cat = cats.find((c) => c.id === deletingTest.categoryId);
    if (cat) updateAdminCategory(cat.id, { testsCount: Math.max(0, (cat.testsCount ?? 1) - 1) });
    setTests(getAdminTests());
    setCats(getAdminCategories());
    toast({ title: "Test deleted", description: `"${deletingTest.name}" removed`, variant: "destructive" });
    setDeletingTest(null);
  };

  const filteredTests = tests.filter((t) =>
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
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage categories, tests, and platform data</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-sm" data-testid={`admin-stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
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
              data-testid={`admin-tab-${t}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── CATEGORIES TAB ── */}
        {tab === "categories" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Add form */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Add New Category
              </h3>
              <form onSubmit={handleAddCat} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="cat-name">Name *</Label>
                  <Input id="cat-name" className="mt-1" placeholder="e.g., IBPS PO" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required data-testid="input-category-name" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Input id="cat-desc" className="mt-1" placeholder="Brief description" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} data-testid="input-category-desc" />
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit" data-testid="btn-add-category">
                    <Plus className="w-4 h-4 mr-1.5" /> Add Category
                  </Button>
                </div>
              </form>
            </div>

            {/* Categories list */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Categories <span className="text-muted-foreground font-normal text-sm">({cats.length})</span></h3>
              </div>
              {cats.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">No categories yet. Add one above.</div>
              ) : (
                <div className="divide-y divide-border">
                  {cats.map((cat) => (
                    <div key={cat.id} className="px-6 py-4 hover:bg-muted/30 transition-colors" data-testid={`category-row-${cat.id}`}>
                      {editingCat?.id === cat.id ? (
                        <form onSubmit={handleSaveEditCat} className="flex items-center gap-2 flex-wrap">
                          <Input
                            className="flex-1 min-w-32 h-8 text-sm"
                            value={editingCat.name}
                            onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                            required
                            data-testid="input-edit-category-name"
                          />
                          <Input
                            className="flex-1 min-w-48 h-8 text-sm"
                            value={editingCat.description}
                            onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                            placeholder="Description"
                            data-testid="input-edit-category-desc"
                          />
                          <div className="flex gap-1">
                            <Button type="submit" size="sm" className="h-8 px-2" data-testid="btn-save-category"><Check className="w-3.5 h-3.5" /></Button>
                            <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => setEditingCat(null)} data-testid="btn-cancel-edit-category"><X className="w-3.5 h-3.5" /></Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">{cat.description || "—"} &nbsp;•&nbsp; {cat.testsCount} tests</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-primary" onClick={() => setEditingCat(cat)} data-testid={`btn-edit-category-${cat.id}`}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:text-destructive" onClick={() => setDeletingCat(cat)} data-testid={`btn-delete-category-${cat.id}`}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
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
            {/* Create form */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Create New Test
              </h3>
              <form onSubmit={handleAddTest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="test-name">Test Name *</Label>
                  <Input id="test-name" className="mt-1" placeholder="e.g., JEE Main Mock 10" value={testForm.name} onChange={(e) => setTestForm({ ...testForm, name: e.target.value })} required data-testid="input-test-name" />
                </div>
                <div>
                  <Label htmlFor="test-category">Category *</Label>
                  <select
                    id="test-category"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={testForm.categoryId}
                    onChange={(e) => setTestForm({ ...testForm, categoryId: e.target.value })}
                    required
                    data-testid="select-test-category"
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
                    data-testid="select-test-difficulty"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="test-duration">Duration (minutes)</Label>
                  <Input id="test-duration" type="number" min="1" className="mt-1" placeholder="180" value={testForm.duration} onChange={(e) => setTestForm({ ...testForm, duration: e.target.value })} data-testid="input-test-duration" />
                </div>
                <div>
                  <Label htmlFor="test-questions">Total Questions</Label>
                  <Input id="test-questions" type="number" min="1" className="mt-1" placeholder="90" value={testForm.totalQuestions} onChange={(e) => setTestForm({ ...testForm, totalQuestions: e.target.value })} data-testid="input-test-questions" />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <Button type="submit" data-testid="btn-create-test">
                    <Plus className="w-4 h-4 mr-1.5" /> Create Test
                  </Button>
                </div>
              </form>
            </div>

            {/* Tests list */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border gap-3">
                <h3 className="font-semibold text-foreground">Tests <span className="text-muted-foreground font-normal text-sm">({tests.length})</span></h3>
                <div className="relative w-52">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="Search tests..." className="pl-8 h-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-tests" />
                </div>
              </div>

              {filteredTests.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">No tests found. Create one above.</div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredTests.map((test) => (
                    <div key={test.id} className="px-6 py-4 hover:bg-muted/30 transition-colors" data-testid={`test-row-${test.id}`}>
                      {editingTest?.id === test.id ? (
                        <form onSubmit={handleSaveEditTest} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
                          <div className="col-span-2">
                            <Label className="text-xs">Name</Label>
                            <Input className="mt-0.5 h-8 text-sm" value={editingTest.name} onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })} required data-testid="input-edit-test-name" />
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
                            <Input type="number" className="mt-0.5 h-8 text-sm" value={editingTest.duration} onChange={(e) => setEditingTest({ ...editingTest, duration: Number(e.target.value) })} data-testid="input-edit-test-duration" />
                          </div>
                          <div>
                            <Label className="text-xs">Questions</Label>
                            <Input type="number" className="mt-0.5 h-8 text-sm" value={editingTest.totalQuestions} onChange={(e) => setEditingTest({ ...editingTest, totalQuestions: Number(e.target.value) })} data-testid="input-edit-test-questions" />
                          </div>
                          <div className="col-span-2 flex gap-1.5">
                            <Button type="submit" size="sm" className="h-8" data-testid="btn-save-test"><Check className="w-3.5 h-3.5 mr-1" /> Save</Button>
                            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => setEditingTest(null)} data-testid="btn-cancel-edit-test"><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <p className="font-medium text-foreground text-sm">{test.name}</p>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[test.difficulty]}`}>{test.difficulty}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {test.categoryName} &nbsp;•&nbsp; {test.totalQuestions} questions &nbsp;•&nbsp; {test.duration} min &nbsp;•&nbsp; {test.attempts.toLocaleString()} attempts
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-primary" onClick={() => setEditingTest(test)} data-testid={`btn-edit-test-${test.id}`}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:text-destructive" onClick={() => setDeletingTest(test)} data-testid={`btn-delete-test-${test.id}`}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
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

      {deletingCat && (
        <DeleteModal name={deletingCat.name} onConfirm={handleDeleteCat} onCancel={() => setDeletingCat(null)} />
      )}
      {deletingTest && (
        <DeleteModal name={deletingTest.name} onConfirm={handleDeleteTest} onCancel={() => setDeletingTest(null)} />
      )}
    </div>
  );
}
