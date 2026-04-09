import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { onAuthStateChanged } from "firebase/auth";
import {
  Users, BookOpen, HelpCircle, Activity, Plus, Edit, Trash2, Search,
  X, Check, AlertTriangle, Tag,
} from "lucide-react";
import {
  getUser,
  addAdminCategory,
  addAdminQuestion,
  addAdminSubcategory,
  addAdminTest,
  updateAdminCategory,
  saveAdminCategories, saveAdminSubcategories, saveAdminTests, saveAdminQuestions,
  markSeeded, hydrateAdminDataFromCloud, pauseAdminCloudSync, resumeAdminCloudSync,
  type AdminCategory, type AdminSubcategory, type AdminTest, type AdminQuestion,
} from "@/lib/storage";
import {
  addCategory,
  addQuestion,
  addSubcategory,
  addTest,
  deleteCategory,
  deleteQuestion,
  deleteSubcategory,
  deleteTest,
  loadAdminSnapshot,
  updateCategory,
  updateQuestion,
  updateSubcategory,
  updateTest,
} from "@/lib/admin-repo";
import { getFirebaseAuth } from "@/lib/firebase";
import { upsertUserProfile } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const isAdminUser = (role?: string) => role === "admin";

function getAdminActionErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Admin action failed.";
}

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
async function seedDefaults() {
  pauseAdminCloudSync();
  try {
    saveAdminCategories([]);
    saveAdminSubcategories([]);
    saveAdminTests([]);
    saveAdminQuestions([]);

    // Keep this modest so the seed fits safely in Firestore document limits.
    const questionsPerSection = 2;
    const mocksPerSubcategory = 10;
    const baseSections = ["Reasoning", "Quant", "English", "General Awareness"];

    const makeDifficulty = (i: number): AdminTest["difficulty"] => {
      if (i % 3 === 0) return "Easy";
      if (i % 3 === 1) return "Medium";
      return "Hard";
    };

    const makeMCQ = (
      section: string,
      idx: number,
    ): { text: string; options: [string, string, string, string]; correct: number; explanation: string } => {
      const n = idx + 1;
      const r = (m: number) => Math.abs(Math.floor(((Math.sin(n * 999 + m) + 1) / 2) * 1000));

      const shuffle4 = (arr: string[], correctValue: string) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = r(i) % (i + 1);
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return { options: copy as [string, string, string, string], correct: copy.indexOf(correctValue) };
      };

      // Placeholder questions (can be replaced by bulk upload later).
      if (section === "Quant") {
        const a = 10 + (r(1) % 40);
        const b = 5 + (r(2) % 30);
        const correctValue = String(a + b);
        const distractors = Array.from(new Set([a + b + 1, a + b + 2, Math.max(0, a + b - 1)]))
          .map(String)
          .slice(0, 3);
        while (distractors.length < 3) distractors.push(String(a + b + 3 + distractors.length));
        const raw = [correctValue, ...distractors];
        const { options, correct } = shuffle4(raw, correctValue);
        return {
          text: `What is ${a} + ${b}?`,
          options,
          correct,
          explanation: `${a} + ${b} = ${a + b}.`,
        };
      }

      if (section === "Reasoning") {
        const start = 1 + (r(3) % 7);
        const step = 2 + (r(4) % 5);
        const correctValue = String(start + 3 * step);
        const distractors = Array.from(new Set([start + 2 * step, start + 4 * step, start + 5 * step]))
          .map(String)
          .slice(0, 3);
        while (distractors.length < 3) distractors.push(String(start + 6 * step));
        const raw = [correctValue, ...distractors];
        const { options, correct } = shuffle4(raw, correctValue);
        return {
          text: `Next number: ${start}, ${start + step}, ${start + 2 * step}, ?`,
          options,
          correct,
          explanation: `The pattern increases by ${step} each time.`,
        };
      }

      if (section === "English") {
        const correctValue = n % 2 === 0 ? "goes" : "go";
        const subject = n % 2 === 0 ? "He" : "They";
        const distractors = ["go", "went", "going"].filter((x) => x !== correctValue);
        while (distractors.length < 3) distractors.push("goes");
        const raw = [correctValue, ...distractors.slice(0, 3)];
        const { options, correct } = shuffle4(raw, correctValue);
        return {
          text: `${subject} to school every day. Choose the correct word.`,
          options,
          correct,
          explanation: n % 2 === 0 ? "He uses 'goes'." : "They use the base form 'go'.",
        };
      }

      // General Awareness
      const correctValue = "New Delhi";
      const distractors = ["Mumbai", "Chennai", "Kolkata"];
      const raw = [correctValue, ...distractors];
      const { options, correct } = shuffle4(raw, correctValue);
      return {
        text: `What is the capital of India?`,
        options,
        correct,
        explanation: `New Delhi is the capital of India.`,
      };
    };

    const topCats = [
      { name: "SSC", description: "Staff Selection Commission exams" },
      { name: "Railways", description: "RRB exams (Railway Recruitment)" },
      { name: "Punjab", description: "Punjab state recruitment exams" },
      { name: "Banking", description: "Banking recruitment exams" },
    ];

    const subcats: Array<{ categoryName: string; name: string; description: string; sections?: string[] }> = [
      // SSC
      { categoryName: "SSC", name: "SSC CPO", description: "Sub-inspector/Officer exam mock tests" },
      { categoryName: "SSC", name: "CHSL", description: "Combined Higher Secondary Level mock tests" },
      { categoryName: "SSC", name: "MTS", description: "Multi-Tasking Staff mock tests" },
      // Railways
      { categoryName: "Railways", name: "RRB ALP", description: "Assistant Loco Pilot mock tests" },
      { categoryName: "Railways", name: "RRB Technician", description: "RRB Technician mock tests" },
      // Punjab
      { categoryName: "Punjab", name: "Excise Inspector", description: "Punjab excise inspector mock tests" },
      { categoryName: "Punjab", name: "PSSSB Clerk", description: "PSSSB clerk mock tests" },
      // Banking
      { categoryName: "Banking", name: "IBPS PO", description: "IBPS Probationary Officer mock tests" },
      { categoryName: "Banking", name: "IBPS Clerk", description: "IBPS Clerk mock tests" },
    ];

    const categoryIdByName = new Map<string, string>();
    topCats.forEach((c) => {
      const created = addAdminCategory({ name: c.name, description: c.description, testsCount: 0 });
      categoryIdByName.set(c.name, created.id);
    });

    const subcatIdByKey = new Map<string, string>();
    subcats.forEach((s) => {
      const catId = categoryIdByName.get(s.categoryName) ?? "";
      const created = addAdminSubcategory({
        categoryId: catId,
        categoryName: s.categoryName,
        name: s.name,
        description: s.description,
      });
      subcatIdByKey.set(`${s.categoryName}::${s.name}`, created.id);
    });

    const testCountByCategoryId = new Map<string, number>();

    subcats.forEach((s, subIndex) => {
      const subcatId = subcatIdByKey.get(`${s.categoryName}::${s.name}`) ?? "";
      const duration = 120;
      const sections = s.sections && s.sections.length > 0 ? s.sections : baseSections;
      for (let mockIdx = 1; mockIdx <= mocksPerSubcategory; mockIdx++) {
        const difficulty = makeDifficulty(mockIdx + subIndex);
        const createdTest = addAdminTest({
          name: `${s.name} Mock ${mockIdx}`,
          categoryId: categoryIdByName.get(s.categoryName) ?? "",
          categoryName: s.categoryName,
          subcategoryId: subcatId,
          subcategoryName: s.name,
          duration,
          totalQuestions: sections.length * questionsPerSection,
          difficulty,
          showDifficulty: true,
          sectionTimingMode: "none",
          sectionTimings: sections.map((sec) => ({ name: sec, minutes: 0 })),
          sections,
          sectionSettings: sections.map((sec) => ({ name: sec, locked: false })),
        });

        testCountByCategoryId.set(
          createdTest.categoryId,
          (testCountByCategoryId.get(createdTest.categoryId) ?? 0) + 1,
        );

        const createdTestId = createdTest.id;
        let questionGlobalIdx = (subIndex + 1) * 1000 + (mockIdx + 1) * 100;
        sections.forEach((sectionName) => {
          for (let q = 0; q < questionsPerSection; q++) {
            const mcq = makeMCQ(sectionName, questionGlobalIdx++);
            addAdminQuestion({
              testId: createdTestId,
              section: sectionName,
              text: mcq.text,
              options: mcq.options,
              correct: mcq.correct,
              explanation: mcq.explanation,
            });
          }
        });
      }
    });

    // Fix testsCount for top-level categories (used on filters/badges).
    testCountByCategoryId.forEach((count, categoryId) => {
      updateAdminCategory(categoryId, { testsCount: count });
    });

    markSeeded();
  } finally {
    await resumeAdminCloudSync();
  }
}

// ── Blank form defaults ───────────────────────────────────────────────────────
const blankTestForm = () => ({
  name: "",
  categoryId: "",
  subcategoryId: "",
  duration: "",
  totalQuestions: "",
  difficulty: "Medium" as AdminTest["difficulty"],
  showDifficulty: true,
  sectionTimingMode: "none" as "none" | "fixed",
  sectionTimings: [] as { name: string; minutes: number }[],
  sections: [] as string[],
});

const blankQuestionForm = (section = "") => ({
  section,
  text: "",
  options: ["", "", "", ""] as [string, string, string, string],
  correct: 0,
  explanation: "",
});

function normalizeSections(sections: string[]) {
  const seen = new Set<string>();
  return sections
    .map((section) => section.trim())
    .filter((section) => {
      if (!section) return false;
      const key = section.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function buildSectionSettings(
  sections: string[],
  existing?: { name: string; locked: boolean }[],
) {
  return sections.map((name) => {
    const match = existing?.find((item) => item.name.toLowerCase() === name.toLowerCase());
    return { name, locked: match?.locked ?? false };
  });
}

function buildSectionTimings(
  sections: string[],
  mode: "none" | "fixed",
  existing?: { name: string; minutes: number }[],
) {
  return sections.map((name) => {
    const match = existing?.find((item) => item.name.toLowerCase() === name.toLowerCase());
    const fallback = mode === "fixed" ? 1 : 0;
    return { name, minutes: match?.minutes ?? fallback };
  });
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [tab, setTab] = useState<"categories" | "subcategories" | "tests" | "questions">("categories");
  const [search, setSearch] = useState("");

  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [catForm, setCatForm] = useState({ name: "", description: "" });
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [deletingCat, setDeletingCat] = useState<AdminCategory | null>(null);
  const [subcats, setSubcats] = useState<AdminSubcategory[]>([]);
  const [subcatForm, setSubcatForm] = useState({ categoryId: "", name: "", description: "" });
  const [editingSubcat, setEditingSubcat] = useState<AdminSubcategory | null>(null);
  const [deletingSubcat, setDeletingSubcat] = useState<AdminSubcategory | null>(null);

  const [tests, setTests] = useState<AdminTest[]>([]);
  const [testForm, setTestForm] = useState(blankTestForm());
  const [editingTest, setEditingTest] = useState<AdminTest | null>(null);
  const [deletingTest, setDeletingTest] = useState<AdminTest | null>(null);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [questionTestId, setQuestionTestId] = useState("");
  const [questionForm, setQuestionForm] = useState(blankQuestionForm());
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(null);
  const [bulkJson, setBulkJson] = useState("");
  const [bulkError, setBulkError] = useState<string | null>(null);
  const selectedQuestionTest = tests.find((t) => t.id === questionTestId) ?? null;
  const availableQuestionSections = selectedQuestionTest?.sections ?? [];

  const reload = async () => {
    const snapshot = await loadAdminSnapshot();
    setCats(snapshot.categories);
    setSubcats(snapshot.subcategories);
    setTests(snapshot.tests);
    setQuestions(snapshot.questions);
  };

  const handleReset = async () => {
    if (!confirm("This will clear all admin data and restore defaults. Continue?")) return;
    try {
      await seedDefaults();
      await reload();
      toast({ title: "Data reset", description: "Restored to default categories and tests" });
    } catch (error) {
      toast({
        title: "Reset failed",
        description: getAdminActionErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setIsAuthorizing(false);
        setLocation("/login/student");
        return;
      }

      try {
        const appUser = await upsertUserProfile(firebaseUser);
        if (!isAdminUser(appUser.role)) {
          setIsAuthorizing(false);
          setLocation("/");
          return;
        }

        const hydrated = await hydrateAdminDataFromCloud();
        if (!hydrated) {
          toast({
            title: "Cloud sync unavailable",
            description: "Loaded cached admin data locally. Firebase could not be reached.",
            variant: "destructive",
          });
        }
        await reload();
      } finally {
        setIsAuthorizing(false);
      }
    });

    return () => unsub();
  }, [setLocation, toast]);

  useEffect(() => {
    setQuestionForm((current) => {
      if (availableQuestionSections.length === 0) {
        return current.section ? { ...current, section: "" } : current;
      }

      if (availableQuestionSections.includes(current.section)) {
        return current;
      }

      return { ...current, section: availableQuestionSections[0] };
    });
  }, [questionTestId, availableQuestionSections.join("|")]);

  if (isAuthorizing || !user || !isAdminUser(user.role)) return null;

  // ── Category handlers ──
  const handleAddCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    try {
      await addCategory({ name: catForm.name.trim(), description: catForm.description.trim(), testsCount: 0 });
      await reload();
      toast({ title: "Category added", description: `"${catForm.name}" created successfully` });
      setCatForm({ name: "", description: "" });
    } catch (error) {
      toast({ title: "Category add failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleSaveEditCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    try {
      await updateCategory(editingCat.id, { name: editingCat.name, description: editingCat.description });
      await reload();
      toast({ title: "Category updated" });
      setEditingCat(null);
    } catch (error) {
      toast({ title: "Category update failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleDeleteCat = async () => {
    if (!deletingCat) return;
    try {
      await deleteCategory(deletingCat.id);
      await reload();
      toast({ title: "Category deleted", variant: "destructive" });
      setDeletingCat(null);
    } catch (error) {
      toast({ title: "Category delete failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleAddSubcat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcatForm.categoryId || !subcatForm.name.trim()) return;
    const cat = cats.find((c) => c.id === subcatForm.categoryId);
    try {
      await addSubcategory({
        categoryId: subcatForm.categoryId,
        categoryName: cat?.name ?? "",
        name: subcatForm.name.trim(),
        description: subcatForm.description.trim(),
      });
      await reload();
      setSubcatForm({ categoryId: "", name: "", description: "" });
      toast({ title: "Subcategory added" });
    } catch (error) {
      toast({ title: "Subcategory add failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleSaveEditSubcat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcat) return;
    const cat = cats.find((c) => c.id === editingSubcat.categoryId);
    try {
      await updateSubcategory(editingSubcat.id, {
        ...editingSubcat,
        categoryName: cat?.name ?? editingSubcat.categoryName,
      });
      await reload();
      setEditingSubcat(null);
      toast({ title: "Subcategory updated" });
    } catch (error) {
      toast({ title: "Subcategory update failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleDeleteSubcat = async () => {
    if (!deletingSubcat) return;
    try {
      await deleteSubcategory(deletingSubcat.id);
      await reload();
      setDeletingSubcat(null);
      toast({ title: "Subcategory deleted", variant: "destructive" });
    } catch (error) {
      toast({ title: "Subcategory delete failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  // ── Test handlers ──
  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.name.trim() || !testForm.categoryId || !testForm.subcategoryId) return;
    const normalizedSections = normalizeSections(testForm.sections);
    if (normalizedSections.length === 0) {
      toast({
        title: "Sections required",
        description: "Add at least one valid section before creating a test.",
        variant: "destructive",
      });
      return;
    }
    const cat = cats.find((c) => c.id === testForm.categoryId);
    const subcat = subcats.find((s) => s.id === testForm.subcategoryId);
    const sectionSettings = buildSectionSettings(normalizedSections);
    const sectionTimings = buildSectionTimings(normalizedSections, testForm.sectionTimingMode, testForm.sectionTimings);
    try {
      await addTest({
        name: testForm.name.trim(),
        categoryId: testForm.categoryId,
        categoryName: cat?.name ?? "",
        subcategoryId: testForm.subcategoryId,
        subcategoryName: subcat?.name ?? "",
        duration: Number(testForm.duration) || 180,
        totalQuestions: Number(testForm.totalQuestions) || 90,
        difficulty: testForm.difficulty,
        showDifficulty: testForm.showDifficulty,
        sectionTimingMode: testForm.sectionTimingMode,
        sectionTimings,
        sections: normalizedSections,
        sectionSettings,
      });
      await updateCategory(testForm.categoryId, { testsCount: (cat?.testsCount ?? 0) + 1 });
      await reload();
      toast({ title: "Test created", description: `"${testForm.name}" added` });
      setTestForm(blankTestForm());
    } catch (error) {
      toast({ title: "Test create failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleSaveEditTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;
    const normalizedSections = normalizeSections(editingTest.sections ?? []);
    if (normalizedSections.length === 0) {
      toast({
        title: "Sections required",
        description: "A test must keep at least one valid section.",
        variant: "destructive",
      });
      return;
    }
    const cat = cats.find((c) => c.id === editingTest.categoryId);
    const subcat = subcats.find((s) => s.id === editingTest.subcategoryId);
    try {
      await updateTest(editingTest.id, {
        ...editingTest,
        sections: normalizedSections,
        categoryName: cat?.name ?? editingTest.categoryName,
        subcategoryName: subcat?.name ?? editingTest.subcategoryName,
        sectionSettings: buildSectionSettings(normalizedSections, editingTest.sectionSettings),
        sectionTimingMode: editingTest.sectionTimingMode ?? "none",
        sectionTimings: buildSectionTimings(
          normalizedSections,
          editingTest.sectionTimingMode ?? "none",
          editingTest.sectionTimings,
        ),
      });
      await reload();
      toast({ title: "Test updated" });
      setEditingTest(null);
    } catch (error) {
      toast({ title: "Test update failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleDeleteTest = async () => {
    if (!deletingTest) return;
    try {
      await deleteTest(deletingTest.id);
      const cat = cats.find((c) => c.id === deletingTest.categoryId);
      if (cat) await updateCategory(cat.id, { testsCount: Math.max(0, (cat.testsCount ?? 1) - 1) });
      await reload();
      toast({ title: "Test deleted", variant: "destructive" });
      setDeletingTest(null);
    } catch (error) {
      toast({ title: "Test delete failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const section = questionForm.section.trim();
    if (!questionTestId || !section || !questionForm.text.trim()) return;
    if (availableQuestionSections.length > 0 && !availableQuestionSections.includes(section)) {
      toast({
        title: "Invalid section",
        description: "Choose one of the predefined sections for this test.",
        variant: "destructive",
      });
      return;
    }
    if (questionForm.options.some((o) => !o.trim())) return;
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, {
          section,
          text: questionForm.text.trim(),
          options: questionForm.options.map((o) => o.trim()) as [string, string, string, string],
          correct: questionForm.correct,
          explanation: questionForm.explanation.trim(),
        });
        setEditingQuestion(null);
        toast({ title: "Question updated" });
      } else {
        await addQuestion({
          testId: questionTestId,
          section,
          text: questionForm.text.trim(),
          options: questionForm.options.map((o) => o.trim()) as [string, string, string, string],
          correct: questionForm.correct,
          explanation: questionForm.explanation.trim(),
        });
        toast({ title: "Question added", description: "New question saved to this test" });
      }
      await reload();
      setQuestionForm(blankQuestionForm(availableQuestionSections[0] ?? ""));
    } catch (error) {
      toast({ title: "Question save failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion(id);
      await reload();
      toast({ title: "Question deleted", variant: "destructive" });
    } catch (error) {
      toast({ title: "Question delete failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleBulkUpload = async () => {
    setBulkError(null);
    if (!questionTestId || !bulkJson.trim()) {
      setBulkError("Select a test and paste JSON questions before uploading.");
      return;
    }
    try {
      const parsed = JSON.parse(bulkJson) as unknown;
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of questions.");
      }
      let added = 0;
      let skipped = 0;
      for (const item of parsed) {
        if (!item || typeof item !== "object") continue;
        const section = String((item as any).section ?? "").trim();
        const text = String((item as any).text ?? "").trim();
        const options = (item as any).options as string[] | undefined;
        const correct = Number((item as any).correct ?? 0);
        const explanation = String((item as any).explanation ?? "").trim();
        const isValidSection =
          availableQuestionSections.length === 0 || availableQuestionSections.includes(section);
        if (!section || !text || !options || options.length < 4 || !isValidSection) {
          skipped += 1;
          continue;
        }
        await addQuestion({
          testId: questionTestId,
          section,
          text,
          options: [options[0], options[1], options[2], options[3]],
          correct: Number.isFinite(correct) ? correct : 0,
          explanation,
        });
        added += 1;
      }
      await reload();
      toast({
        title: "Bulk upload complete",
        description:
          skipped > 0
            ? `Imported ${added} questions and skipped ${skipped} with invalid data or section names.`
            : `Imported ${added} questions.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not parse JSON.";
      setBulkError(message);
    }
  };

  const filteredTests = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(search.toLowerCase())
  );
  const questionsForSelectedTest = questions.filter((q) => q.testId === questionTestId);

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
            <div key={s.label} className="bg-card/80 border border-border/70 rounded-2xl p-5 shadow-sm surface-hover">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-panel border border-border/70 rounded-2xl w-fit mb-6 shadow-sm">
          {(["categories", "subcategories", "tests", "questions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all capitalize ${
                tab === t
                  ? "bg-primary/10 text-foreground border border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── CATEGORIES TAB ── */}
        {tab === "categories" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
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

            <div className="bg-card/85 border border-border/70 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Categories <span className="text-muted-foreground font-normal text-sm">({cats.length})</span></h3>
              </div>
              {cats.length === 0 ? (
                <div className="empty-state text-sm">No categories yet. Add one above.</div>
              ) : (
                <div className="divide-y divide-border">
                  {cats.map((cat) => (
                    <div key={cat.id} className="px-6 py-4 hover:bg-muted/30 transition-colors list-item-animate">
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

        {tab === "subcategories" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Add New Subcategory
              </h3>
              <form onSubmit={handleAddSubcat} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label>Category *</Label>
                  <select className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm" value={subcatForm.categoryId} onChange={(e) => setSubcatForm({ ...subcatForm, categoryId: e.target.value })} required>
                    <option value="">Select category</option>
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Name *</Label>
                  <Input className="mt-1" value={subcatForm.name} onChange={(e) => setSubcatForm({ ...subcatForm, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input className="mt-1" value={subcatForm.description} onChange={(e) => setSubcatForm({ ...subcatForm, description: e.target.value })} />
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit"><Plus className="w-4 h-4 mr-1.5" /> Add Subcategory</Button>
                </div>
              </form>
            </div>

            <div className="bg-card/85 border border-border/70 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Subcategories ({subcats.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {subcats.map((s) => (
                  <div key={s.id} className="px-6 py-4">
                    {editingSubcat?.id === s.id ? (
                      <form onSubmit={handleSaveEditSubcat} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <select className="h-8 px-2 bg-background border border-input rounded-lg text-xs" value={editingSubcat.categoryId} onChange={(e) => setEditingSubcat({ ...editingSubcat, categoryId: e.target.value })}>
                          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <Input className="h-8 text-sm" value={editingSubcat.name} onChange={(e) => setEditingSubcat({ ...editingSubcat, name: e.target.value })} />
                        <Input className="h-8 text-sm" value={editingSubcat.description} onChange={(e) => setEditingSubcat({ ...editingSubcat, description: e.target.value })} />
                        <div className="flex gap-1">
                          <Button type="submit" size="sm" className="h-8 px-2"><Check className="w-3.5 h-3.5" /></Button>
                          <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => setEditingSubcat(null)}><X className="w-3.5 h-3.5" /></Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.categoryName} • {s.description || "—"}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-primary" onClick={() => setEditingSubcat(s)}><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:text-destructive" onClick={() => setDeletingSubcat(s)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TESTS TAB ── */}
        {tab === "tests" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
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
                  <Label htmlFor="test-subcategory">Subcategory *</Label>
                  <select
                    id="test-subcategory"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={testForm.subcategoryId}
                    onChange={(e) => setTestForm({ ...testForm, subcategoryId: e.target.value })}
                    required
                  >
                    <option value="">Select subcategory</option>
                    {subcats.filter((s) => s.categoryId === testForm.categoryId).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 text-sm text-foreground">
                    <input type="checkbox" checked={testForm.showDifficulty} onChange={(e) => setTestForm({ ...testForm, showDifficulty: e.target.checked })} />
                    Show difficulty to students
                  </label>
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
                    onChange={(s) => {
                      const nextSections = normalizeSections(s);
                      setTestForm({
                        ...testForm,
                        sections: nextSections,
                        sectionTimings: buildSectionTimings(nextSections, testForm.sectionTimingMode, testForm.sectionTimings),
                      });
                    }}
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">Empty and duplicate section names are removed automatically.</p>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <Label className="text-xs">Section Timing</Label>
                  <div className="mt-1 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={testForm.sectionTimingMode === "none"}
                        onChange={() =>
                          setTestForm({
                            ...testForm,
                            sectionTimingMode: "none",
                            sectionTimings: buildSectionTimings(testForm.sections, "none", testForm.sectionTimings),
                          })
                        }
                      />
                      No sectional timing
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={testForm.sectionTimingMode === "fixed"}
                        onChange={() =>
                          setTestForm({
                            ...testForm,
                            sectionTimingMode: "fixed",
                            sectionTimings: buildSectionTimings(testForm.sections, "fixed", testForm.sectionTimings),
                          })
                        }
                      />
                      Fixed per section
                    </label>
                  </div>
                </div>

                {testForm.sectionTimingMode === "fixed" && testForm.sections.length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {testForm.sections.map((sectionName) => {
                      const timing = testForm.sectionTimings.find((t) => t.name === sectionName);
                      return (
                        <div key={sectionName}>
                          <Label className="text-xs">{sectionName} Minutes</Label>
                          <Input
                            type="number"
                            min="1"
                            className="mt-0.5 h-8 text-sm"
                            value={timing?.minutes ?? 1}
                            onChange={(e) => {
                              const next = Math.max(1, Number(e.target.value) || 1);
                              setTestForm({
                                ...testForm,
                                sectionTimings: testForm.sections.map((name) =>
                                  name === sectionName
                                    ? { name, minutes: next }
                                    : {
                                        name,
                                        minutes: testForm.sectionTimings.find((t) => t.name === name)?.minutes ?? 1,
                                      },
                                ),
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="sm:col-span-2 lg:col-span-3">
                  <Button type="submit"><Plus className="w-4 h-4 mr-1.5" /> Create Test</Button>
                </div>
              </form>
            </div>

            <div className="bg-card/85 border border-border/70 rounded-2xl shadow-sm overflow-hidden">
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
                            <Label className="text-xs">Subcategory</Label>
                            <select
                              className="mt-0.5 w-full h-8 px-2 bg-background border border-input rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                              value={editingTest.subcategoryId}
                              onChange={(e) => setEditingTest({ ...editingTest, subcategoryId: e.target.value })}
                            >
                              {subcats.filter((s) => s.categoryId === editingTest.categoryId).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                          <div className="flex items-end">
                            <label className="inline-flex items-center gap-2 text-xs text-foreground">
                              <input
                                type="checkbox"
                                checked={editingTest.showDifficulty ?? true}
                                onChange={(e) => setEditingTest({ ...editingTest, showDifficulty: e.target.checked })}
                              />
                              Show difficulty
                            </label>
                          </div>
                          <div className="col-span-2 sm:col-span-3">
                            <Label className="text-xs">Section Timing</Label>
                            <div className="mt-0.5 flex items-center gap-3">
                              <label className="inline-flex items-center gap-2 text-xs">
                                <input
                                  type="radio"
                                  checked={(editingTest.sectionTimingMode ?? "none") === "none"}
                                  onChange={() =>
                                    setEditingTest({
                                      ...editingTest,
                                      sectionTimingMode: "none",
                                      sectionTimings: buildSectionTimings(
                                        normalizeSections(editingTest.sections ?? []),
                                        "none",
                                        editingTest.sectionTimings,
                                      ),
                                    })
                                  }
                                />
                                No sectional timing
                              </label>
                              <label className="inline-flex items-center gap-2 text-xs">
                                <input
                                  type="radio"
                                  checked={(editingTest.sectionTimingMode ?? "none") === "fixed"}
                                  onChange={() =>
                                    setEditingTest({
                                      ...editingTest,
                                      sectionTimingMode: "fixed",
                                      sectionTimings: buildSectionTimings(
                                        normalizeSections(editingTest.sections ?? []),
                                        "fixed",
                                        editingTest.sectionTimings,
                                      ),
                                    })
                                  }
                                />
                                Fixed per section
                              </label>
                            </div>
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
                              onChange={(s) => {
                                const nextSections = normalizeSections(s);
                                setEditingTest({
                                  ...editingTest,
                                  sections: nextSections,
                                  sectionSettings: buildSectionSettings(nextSections, editingTest.sectionSettings),
                                  sectionTimings: buildSectionTimings(
                                    nextSections,
                                    editingTest.sectionTimingMode ?? "none",
                                    editingTest.sectionTimings,
                                  ),
                                });
                              }}
                            />
                            <p className="mt-1 text-[11px] text-muted-foreground">Empty and duplicate section names are removed automatically.</p>
                          </div>
                          {(editingTest.sectionTimingMode ?? "none") === "fixed" && (
                            <div className="col-span-2 sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(editingTest.sections ?? []).map((sectionName) => {
                                const timing = editingTest.sectionTimings?.find((t) => t.name === sectionName);
                                return (
                                  <div key={sectionName}>
                                    <Label className="text-xs">{sectionName} Minutes</Label>
                                    <Input
                                      type="number"
                                      min="1"
                                      className="mt-0.5 h-8 text-sm"
                                      value={timing?.minutes ?? 1}
                                      onChange={(e) => {
                                        const next = Math.max(1, Number(e.target.value) || 1);
                                        setEditingTest({
                                          ...editingTest,
                                          sectionTimings: (editingTest.sections ?? []).map((name) =>
                                            name === sectionName
                                              ? { name, minutes: next }
                                              : {
                                                  name,
                                                  minutes: editingTest.sectionTimings?.find((t) => t.name === name)?.minutes ?? 1,
                                                },
                                          ),
                                        });
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="col-span-2 sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(editingTest.sectionSettings ?? []).map((section) => (
                              <label key={section.name} className="inline-flex items-center gap-2 text-xs">
                                <input
                                  type="checkbox"
                                  checked={!section.locked}
                                  onChange={(e) =>
                                    setEditingTest({
                                      ...editingTest,
                                      sectionSettings: (editingTest.sectionSettings ?? []).map((s) =>
                                        s.name === section.name ? { ...s, locked: !e.target.checked } : s,
                                      ),
                                    })
                                  }
                                />
                                {section.name} ({section.locked ? "Locked" : "Unlocked"})
                              </label>
                            ))}
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
                              {test.categoryName} • {test.subcategoryName || "General"} • {test.totalQuestions} questions • {test.duration} min • {test.attempts.toLocaleString()} attempts
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

        {/* ── QUESTIONS TAB ── */}
        {tab === "questions" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> {editingQuestion ? "Edit Question" : "Add Question to Test"}
              </h3>
              <form onSubmit={handleAddQuestion} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="q-test">Test *</Label>
                  <select
                    id="q-test"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={questionTestId}
                    onChange={(e) => setQuestionTestId(e.target.value)}
                    required
                  >
                    <option value="">Select test</option>
                    {tests.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="q-section">Section *</Label>
                  <select
                    id="q-section"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    value={questionForm.section}
                    onChange={(e) => setQuestionForm({ ...questionForm, section: e.target.value })}
                    disabled={!questionTestId || availableQuestionSections.length === 0}
                    required
                  >
                    <option value="">
                      {!questionTestId
                        ? "Select a test first"
                        : availableQuestionSections.length === 0
                          ? "No sections defined for this test"
                          : "Select section"}
                    </option>
                    {availableQuestionSections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Only predefined sections from the selected test can be used.
                  </p>
                </div>
                <div>
                  <Label htmlFor="q-correct">Correct Option</Label>
                  <select
                    id="q-correct"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={questionForm.correct}
                    onChange={(e) => setQuestionForm({ ...questionForm, correct: Number(e.target.value) })}
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="q-text">Question *</Label>
                  <Input id="q-text" className="mt-1" placeholder="Enter question statement" value={questionForm.text} onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })} required />
                </div>
                {questionForm.options.map((opt, index) => (
                  <div key={index}>
                    <Label htmlFor={`q-opt-${index}`}>Option {String.fromCharCode(65 + index)} *</Label>
                    <Input
                      id={`q-opt-${index}`}
                      className="mt-1"
                      value={opt}
                      onChange={(e) => {
                        const next = [...questionForm.options] as [string, string, string, string];
                        next[index] = e.target.value;
                        setQuestionForm({ ...questionForm, options: next });
                      }}
                      required
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <Label htmlFor="q-exp">Explanation</Label>
                  <Input id="q-exp" className="mt-1" placeholder="Why this option is correct" value={questionForm.explanation} onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })} />
                </div>
                <div className="sm:col-span-2 flex gap-2">
                  <Button type="submit">
                    {editingQuestion ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5" /> Save Question
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Question
                      </>
                    )}
                  </Button>
                  {editingQuestion && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingQuestion(null);
                        setQuestionForm(blankQuestionForm());
                      }}
                    >
                      <X className="w-4 h-4 mr-1.5" /> Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-card/85 border border-border/70 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Questions <span className="text-muted-foreground font-normal text-sm">({questionsForSelectedTest.length})</span></h3>
              </div>
              {!questionTestId ? (
                <div className="empty-state text-sm">Select a test to view its questions.</div>
              ) : questionsForSelectedTest.length === 0 ? (
                <div className="empty-state text-sm">No questions for this test yet.</div>
              ) : (
                <div className="divide-y divide-border">
                  {questionsForSelectedTest.map((q, index) => (
                    <div key={q.id} className="px-6 py-4 list-item-animate">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Q{index + 1} • {q.section}</p>
                          <p className="font-medium text-foreground text-sm">{q.text}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-primary hover:text-primary"
                            onClick={() => {
                              setEditingQuestion(q);
                              setQuestionTestId(q.testId);
                              setQuestionForm({
                                section: q.section,
                                text: q.text,
                                options: [...q.options] as [string, string, string, string],
                                correct: q.correct,
                                explanation: q.explanation,
                              });
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteQuestion(q.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-2">Bulk Upload (JSON)</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Paste an array of questions. Example: [&#123;"section":"Quant","text":"2+2?","options":["1","2","3","4"],"correct":3,"explanation":"2+2=4"&#125;]
              </p>
              <textarea
                className="w-full h-40 text-xs font-mono bg-background border border-input rounded-md p-2"
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                placeholder='[{"section":"Quant","text":"2+2?","options":["1","2","3","4"],"correct":3,"explanation":"2+2=4"}]'
              />
              {bulkError && <p className="mt-2 text-xs text-destructive">{bulkError}</p>}
              <div className="mt-3 flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={handleBulkUpload}>
                  Import Questions
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {deletingCat && <DeleteModal name={deletingCat.name} onConfirm={handleDeleteCat} onCancel={() => setDeletingCat(null)} />}
      {deletingSubcat && <DeleteModal name={deletingSubcat.name} onConfirm={handleDeleteSubcat} onCancel={() => setDeletingSubcat(null)} />}
      {deletingTest && <DeleteModal name={deletingTest.name} onConfirm={handleDeleteTest} onCancel={() => setDeletingTest(null)} />}
    </div>
  );
}
