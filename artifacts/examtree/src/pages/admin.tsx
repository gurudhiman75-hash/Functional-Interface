import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { onAuthStateChanged } from "firebase/auth";
import {
  Users, BookOpen, HelpCircle, Activity, Plus, Edit, Trash2, Search,
  X, Check, AlertTriangle, Tag, Package,
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
  getAdminQuestions,
  type AdminCategory, type AdminSubcategory, type AdminTest, type AdminQuestion, type TestAccess, type TestKind,
} from "@/lib/storage";
import {
  addCategory,
  addQuestion,
  bulkAddQuestions,
  addSubcategory,
  addTest,
  deleteCategory,
  deleteQuestion,
  deleteSubcategory,
  deleteTest,
  getAdminSnapshot,
  updateCategory,
  updateQuestion,
  updateSubcategory,
  updateTest,
} from "@/lib/admin-repo";
import { createPackage, getTests as fetchBackendTests, getPackages, createBundle, getBundles, getSections, getAllTopics, createTopic, renameTopic, deleteTopic, createSection, deleteSection, type MasterSection, type MasterTopic } from "@/lib/data";
import { getFirebaseAuth } from "@/lib/firebase";
import { upsertUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import QuestionBankTab from "@/components/QuestionBankTab";
import { DiSetManager } from "@/components/DiSetManager";
import AssignFromBankDialog from "@/components/AssignFromBankDialog";

const isAdminUser = (role?: string) => role === "admin";

function getAdminActionErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Admin action failed.";
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const TEST_KIND_LABELS: Record<TestKind, string> = {
  "full-length": "Full Length",
  sectional: "Sectional",
  "topic-wise": "Topic Wise",
};

const TEST_ACCESS_LABELS: Record<TestAccess, string> = {
  free: "Free",
  paid: "Paid",
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

// ── Sections picker (master-table backed, no free text) ───────────────────────
function SectionsPicker({
  selected,       // selected section names
  selectedIds,    // selected section IDs (parallel array)
  masterSections, // from master table
  onChange,       // (names, ids) => void
  required,       // show asterisk / required styling
  single,         // single-select mode (for topic-wise tests)
}: {
  selected: string[];
  selectedIds: string[];
  masterSections: { id: string; name: string }[];
  onChange: (names: string[], ids: string[]) => void;
  required?: boolean;
  single?: boolean;
}) {
  const addSection = (id: string) => {
    if (selectedIds.includes(id)) return;
    const sec = masterSections.find((s) => s.id === id);
    if (!sec) return;
    onChange([...selected, sec.name], [...selectedIds, id]);
  };

  const removeSection = (id: string) => {
    const idx = selectedIds.indexOf(id);
    if (idx === -1) return;
    const names = selected.filter((_, i) => i !== idx);
    const ids = selectedIds.filter((_, i) => i !== idx);
    onChange(names, ids);
  };

  const unselected = masterSections.filter((s) => !selectedIds.includes(s.id));

  // Single-select mode: plain dropdown for topic-wise
  if (single) {
    const currentId = selectedIds[0] ?? "";
    return (
      <div>
        <Label>Section{required && <span className="text-destructive ml-0.5">*</span>}</Label>
        <select
          className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={currentId}
          onChange={(e) => {
            const sec = masterSections.find((s) => s.id === e.target.value);
            if (sec) onChange([sec.name], [sec.id]);
            else onChange([], []);
          }}
        >
          <option value="">Pick a section…</option>
          {masterSections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {masterSections.length === 0 && (
          <p className="text-[11px] text-amber-600 mt-1">No master sections found. Ensure sections are seeded.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Label>Sections{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      <div className="mt-1 min-h-[38px] flex flex-wrap gap-1.5 items-center px-3 py-1.5 bg-background border border-input rounded-lg">
        {selected.map((name, i) => (
          <span
            key={selectedIds[i]}
            className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-md"
          >
            {name}
            <button
              type="button"
              onClick={() => removeSection(selectedIds[i])}
              className="hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {unselected.length > 0 && (
          <select
            className="flex-1 min-w-32 bg-transparent text-sm outline-none text-muted-foreground"
            value=""
            onChange={(e) => { if (e.target.value) addSection(e.target.value); }}
          >
            <option value="">{selected.length === 0 ? "Pick a section…" : "Add section…"}</option>
            {unselected.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}
        {unselected.length === 0 && selected.length === masterSections.length && (
          <span className="text-xs text-muted-foreground">All sections selected</span>
        )}
      </div>
      {masterSections.length === 0 && (
        <p className="text-[11px] text-amber-600 mt-1">No master sections found. Ensure sections are seeded.</p>
      )}
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
          access: mockIdx <= 2 ? "free" : "paid",
          kind: mockIdx <= 2 ? "full-length" : mockIdx % 2 === 0 ? "sectional" : "topic-wise",
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
  access: "free" as TestAccess,
  kind: "full-length" as TestKind,
  duration: "",
  totalQuestions: "",
  difficulty: "Medium" as AdminTest["difficulty"],
  showDifficulty: true,
  sectionTimingMode: "none" as "none" | "fixed",
  sectionTimings: [] as { name: string; minutes: number }[],
  sections: [] as string[],
  sectionIds: [] as string[],
  sectionTopics: {} as Record<string, string[]>, // sectionId → topicIds[]
  marksPerQuestion: 1 as number,
  negativeMarks: 0 as number,
});

const blankQuestionForm = (section = "", topic = "") => ({
  section,
  topic,
  text: "",
  options: ["", "", "", ""] as [string, string, string, string],
  correct: 0,
  explanation: "",
  // Translation fields (optional)
  textHi: "",
  optionsHi: ["", "", "", ""] as [string, string, string, string],
  explanationHi: "",
  textPa: "",
  optionsPa: ["", "", "", ""] as [string, string, string, string],
  explanationPa: "",
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

// ── Sections manager tab ──────────────────────────────────────────────────────
function SectionsManager({
  masterSections,
  queryClient,
  toast,
}: {
  masterSections: MasterSection[];
  queryClient: ReturnType<typeof useQueryClient>;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  // ── Section creation ──────────────────────────────────────────────────────
  const [newSectionName, setNewSectionName] = useState("");
  const [creatingSection, setCreatingSection] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);

  // ── Topic creation ────────────────────────────────────────────────────────
  const [newTopicName, setNewTopicName] = useState("");
  const [creatingTopic, setCreatingTopic] = useState(false);

  // ── Topic editing ─────────────────────────────────────────────────────────
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicName, setEditingTopicName] = useState("");
  const [savingTopicId, setSavingTopicId] = useState<string | null>(null);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  // ── All topics ────────────────────────────────────────────────────────────
  const { data: allTopics = [] } = useQuery<MasterTopic[]>({
    queryKey: ["all-topics"],
    queryFn: getAllTopics,
    staleTime: 0,
  });

  const invalidateTopics = () => {
    queryClient.invalidateQueries({ queryKey: ["all-topics"] });
    queryClient.invalidateQueries({ queryKey: ["master-topics"] });
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSectionName.trim();
    if (!name) return;
    setCreatingSection(true);
    try {
      await createSection(name);
      await queryClient.invalidateQueries({ queryKey: ["master-sections"] });
      setNewSectionName("");
      toast({ title: "Section created" });
    } catch {
      toast({ title: "Failed to create section", variant: "destructive" });
    } finally {
      setCreatingSection(false);
    }
  };

  const handleDeleteSection = async (id: string, name: string) => {
    setDeletingSectionId(id);
    try {
      await deleteSection(id);
      await queryClient.invalidateQueries({ queryKey: ["master-sections"] });
      await invalidateTopics();
      toast({ title: `Section "${name}" deleted`, variant: "destructive" });
    } catch {
      toast({ title: "Failed to delete section", variant: "destructive" });
    } finally {
      setDeletingSectionId(null);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTopicName.trim();
    if (!name) return;
    setCreatingTopic(true);
    try {
      await createTopic(name);
      await invalidateTopics();
      setNewTopicName("");
      toast({ title: "Topic added" });
    } catch (err: any) {
      toast({ title: err?.message ?? "Failed to add topic", variant: "destructive" });
    } finally {
      setCreatingTopic(false);
    }
  };

  const handleRenameStart = (topic: MasterTopic) => {
    setEditingTopicId(topic.id);
    setEditingTopicName(topic.name);
  };

  const handleRenameSave = async (topic: MasterTopic) => {
    const name = editingTopicName.trim();
    if (!name || name === topic.name) { setEditingTopicId(null); return; }
    setSavingTopicId(topic.id);
    try {
      await renameTopic(topic.id, name);
      await invalidateTopics();
      setEditingTopicId(null);
      toast({ title: "Topic renamed" });
    } catch (err: any) {
      toast({ title: err?.message ?? "Failed to rename topic", variant: "destructive" });
    } finally {
      setSavingTopicId(null);
    }
  };

  const handleDeleteTopic = async (topic: MasterTopic) => {
    setDeletingTopicId(topic.id);
    try {
      await deleteTopic(topic.id);
      await invalidateTopics();
      toast({ title: `Topic "${topic.name}" deleted`, variant: "destructive" });
    } catch {
      toast({ title: "Failed to delete topic", variant: "destructive" });
    } finally {
      setDeletingTopicId(null);
    }
  };

  const totalTopics = allTopics.length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── Add forms row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Add section */}
        <div className="glass-panel rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4 text-primary" /> New Section
          </h3>
          <form onSubmit={handleCreateSection} className="flex gap-2">
            <Input
              className="h-9 text-sm"
              placeholder="e.g. Quantitative Aptitude"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              required
            />
            <Button type="submit" size="sm" className="h-9 shrink-0" disabled={creatingSection || !newSectionName.trim()}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </form>
        </div>

        {/* Add topic */}
        <div className="glass-panel rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4 text-primary" /> New Topic
          </h3>
          <form onSubmit={handleCreateTopic} className="flex gap-2">
            <Input
              className="h-9 text-sm min-w-0"
              placeholder="Topic name"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              required
            />
            <Button type="submit" size="sm" className="h-9 shrink-0" disabled={creatingTopic || !newTopicName.trim()}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </form>
        </div>
      </div>

      {/* ── Sections table ── */}
      <div className="glass-panel rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Sections</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{masterSections.length} section{masterSections.length !== 1 ? "s" : ""}</p>
        </div>
        {masterSections.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted-foreground text-sm">No sections yet. Add your first section above.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-2.5 font-medium text-muted-foreground text-xs">Name</th>
                <th className="py-2.5 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {masterSections.map((section) => (
                <tr key={section.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-3 font-medium text-foreground">{section.name}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" disabled={deletingSectionId === section.id} onClick={() => handleDeleteSection(section.id, section.name)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Topics table ── */}
      <div className="glass-panel rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Topics</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{totalTopics} topic{totalTopics !== 1 ? "s" : ""} (global)</p>
        </div>
        {allTopics.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted-foreground text-sm">No topics yet. Add your first topic above.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-2.5 font-medium text-muted-foreground text-xs">Name</th>
                <th className="py-2.5 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allTopics.map((topic) => (
                <tr key={topic.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-2">
                    {editingTopicId === topic.id ? (
                      <div className="flex gap-1.5 items-center">
                        <Input
                          autoFocus
                          className="h-7 text-sm"
                          value={editingTopicName}
                          onChange={(e) => setEditingTopicName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameSave(topic);
                            if (e.key === "Escape") setEditingTopicId(null);
                          }}
                        />
                        <Button size="sm" className="h-7 px-2 text-xs shrink-0" disabled={savingTopicId === topic.id || !editingTopicName.trim()} onClick={() => handleRenameSave(topic)}>Save</Button>
                        <Button size="sm" variant="ghost" className="h-7 px-1.5 shrink-0" onClick={() => setEditingTopicId(null)}>✕</Button>
                      </div>
                    ) : (
                      <span className="text-foreground">{topic.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    {editingTopicId !== topic.id && (
                      <>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-primary hover:text-primary" onClick={() => handleRenameStart(topic)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" disabled={deletingTopicId === topic.id} onClick={() => handleDeleteTopic(topic)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [tab, setTab] = useState<"categories" | "subcategories" | "tests" | "questions" | "packages" | "bundles" | "sections" | "question-bank" | "di-sets">("categories");
  const [search, setSearch] = useState("");

  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [catForm, setCatForm] = useState({ name: "", description: "" });
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [deletingCat, setDeletingCat] = useState<AdminCategory | null>(null);
  const [subcats, setSubcats] = useState<AdminSubcategory[]>([]);
  const [subcatForm, setSubcatForm] = useState({ categoryId: "", name: "", description: "", languages: ["en"] as string[] });
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
  const [qLangTab, setQLangTab] = useState<"en" | "hi" | "pa">("en");
  const [qFormNewTopicInput, setQFormNewTopicInput] = useState("");
  const [qFormAddingTopic, setQFormAddingTopic] = useState(false);

  // ── Master sections/topics — declared early so qFormSectionId can use them ──
  const { data: masterSections = [] } = useQuery<MasterSection[]>({
    queryKey: ["master-sections"],
    queryFn: getSections,
    staleTime: Infinity,
  });

  const qFormSectionId = masterSections.find((s) => s.name === questionForm.section)?.id ?? "";
  const { data: qFormTopics = [], isLoading: qFormTopicsLoading } = useQuery<MasterTopic[]>({
    queryKey: ["master-topics"],
    queryFn: getAllTopics,
    staleTime: 0,
  });
  const [bulkJson, setBulkJson] = useState("");
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  // Direct CSV import state
  type DirectCsvPreviewRow = { rowNum: number; cells: Record<string, string>; valid: boolean; errors: string[] };
  const [directCsvFile, setDirectCsvFile] = useState<File | null>(null);
  const [directCsvSection, setDirectCsvSection] = useState("");
  const [directCsvTopic, setDirectCsvTopic] = useState("");
  const [directCsvNewTopicInput, setDirectCsvNewTopicInput] = useState("");
  const [directCsvAddingTopic, setDirectCsvAddingTopic] = useState(false);
  const [directCsvCreateMissingTopics, setDirectCsvCreateMissingTopics] = useState(false);
  const [directCsvUploading, setDirectCsvUploading] = useState(false);
  const [directCsvResult, setDirectCsvResult] = useState<{ inserted: number; skipped: number; errors: { row: number; reason: string }[] } | null>(null);
  const [directCsvError, setDirectCsvError] = useState<string | null>(null);
  const [directCsvParsed, setDirectCsvParsed] = useState<DirectCsvPreviewRow[] | null>(null);
  const [directCsvShowErrors, setDirectCsvShowErrors] = useState(false);

  // ── Assign from Bank dialog state ──
  const [bankPickerOpen, setBankPickerOpen] = useState(false);
  const [bankPickerTestId, setBankPickerTestId] = useState("");
  const [bankPickerTestName, setBankPickerTestName] = useState("");

  // ── Package state ──
  type BackendTest = { id: string; name: string; category: string };
  type AdminPackageItem = { id: string; name: string; finalPriceCents: number; testCount: number };
  const { data: packagesList = [], isLoading: packagesListLoading } = useQuery<AdminPackageItem[]>({
    queryKey: ["admin-packages-list"],
    queryFn: () => getPackages() as Promise<AdminPackageItem[]>,
    staleTime: 0,
    enabled: tab === "packages",
  });

  const { data: backendTests = [], isLoading: testsLoading } = useQuery<BackendTest[]>({
    queryKey: ["admin-tests"],
    queryFn: () => fetchBackendTests() as Promise<BackendTest[]>,
    staleTime: 60_000,
    enabled: tab === "packages",
  });
  const [pkgForm, setPkgForm] = useState({
    name: "",
    description: "",
    originalPriceCents: "",
    discountPercent: "0",
    testIds: [] as string[],
    features: "",
    isPopular: false,
    order: "0",
  });
  const [pkgBusy, setPkgBusy] = useState(false);

  // ── Bundle state ──
  type AdminBundleItem = { id: string; name: string; price: number; packageCount: number };
  const queryClient = useQueryClient();
  const { data: bundlesList = [], isLoading: bundlesListLoading } = useQuery<AdminBundleItem[]>({
    queryKey: ["admin-bundles-list"],
    queryFn: () => getBundles() as unknown as Promise<AdminBundleItem[]>,
    staleTime: 0,
    enabled: tab === "bundles",
  });
  const [bundleForm, setBundleForm] = useState({
    name: "",
    description: "",
    priceCents: "",
    packageIds: [] as string[],
  });
  const [bundleBusy, setBundleBusy] = useState(false);
  const pkgFinalPrice = Math.round(
    Number(pkgForm.originalPriceCents) * (1 - Number(pkgForm.discountPercent) / 100),
  );
  const selectedQuestionTest = tests.find((t) => t.id === questionTestId) ?? null;
  const availableQuestionSections = selectedQuestionTest?.sections ?? [];

  const directCsvSectionId = masterSections.find((s) => s.name === directCsvSection)?.id ?? "";
  const { data: masterTopics = [] } = useQuery<MasterTopic[]>({
    queryKey: ["master-topics"],
    queryFn: getAllTopics,
    staleTime: 0,
  });
  const directCsvTopicId = masterTopics.find((t) => t.name === directCsvTopic)?.id ?? "";

  // Topics for test-form (topic-wise mode) — same global list
  const { data: testFormSectionTopics = [] } = useQuery<MasterTopic[]>({
    queryKey: ["master-topics"],
    queryFn: getAllTopics,
    staleTime: 0,
  });

  // Topics for edit-test form (topic-wise mode) — same global list
  const { data: editTestSectionTopics = [] } = useQuery<MasterTopic[]>({
    queryKey: ["master-topics"],
    queryFn: getAllTopics,
    staleTime: 0,
  });

  // Quick-add topic modal state
  const [addTopicModal, setAddTopicModal] = useState<{
    open: boolean;
    name: string;
    busy: boolean;
    error: string | null;
    onSave: (topic: MasterTopic) => void;
  }>({
    open: false,
    name: "",
    busy: false,
    error: null,
    onSave: () => {},
  });

  const openAddTopicModal = (onSave: (t: MasterTopic) => void) => {
    setAddTopicModal({ open: true, name: "", busy: false, error: null, onSave });
  };

  const handleAddTopicModalSave = async () => {
    const name = addTopicModal.name.trim();
    if (!name) return;
    setAddTopicModal((m) => ({ ...m, busy: true, error: null }));
    try {
      const created = await createTopic(name);
      await queryClient.invalidateQueries({ queryKey: ["master-topics"] });
      await queryClient.invalidateQueries({ queryKey: ["all-topics"] });
      addTopicModal.onSave(created);
      setAddTopicModal((m) => ({ ...m, open: false }));
      toast({ title: `Topic "${created.name}" added` });
    } catch (err: any) {
      setAddTopicModal((m) => ({ ...m, busy: false, error: err?.message ?? "Failed to add topic" }));
    }
  };

  const questionSubcatLangs: string[] = (() => {
    if (!selectedQuestionTest) return ["en"];
    // Use the test's own language setting if set, otherwise default to ["en"].
    // Do NOT inherit from subcategory — bilingual tests must explicitly set
    // their own languages field (e.g. ["en", "pa"]).
    if (Array.isArray(selectedQuestionTest.languages) && selectedQuestionTest.languages.length > 0) {
      return selectedQuestionTest.languages as string[];
    }
    return ["en"];
  })();


  const reload = useCallback(() => {
    const snapshot = getAdminSnapshot();
    setCats(snapshot.categories);
    setSubcats(snapshot.subcategories);
    setTests(snapshot.tests);
    setQuestions(snapshot.questions);
  }, []);

  const handleReset = async () => {
    if (!confirm("This will clear all admin data and restore defaults. Continue?")) return;
    try {
      await seedDefaults();
      reload();
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
    if (!auth) {
      setIsAuthorizing(false);
      setLocation("/login/student");
      return;
    }
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
        reload();
      } catch (err) {
        console.error("Admin auth error:", err);
        toast({
          title: "Could not connect to server",
          description: "Make sure the API server is running, then refresh.",
          variant: "destructive",
        });
      } finally {
        setIsAuthorizing(false);
      }
    });

    return () => unsub();
  }, [setLocation, toast, reload]);

  useEffect(() => {
    const onSyncFailed = (ev: Event) => {
      const detail = (ev as CustomEvent<string>).detail ?? "Sync failed.";
      reload();
      toast({
        title: "Could not save to server",
        description: detail,
        variant: "destructive",
      });
    };
    window.addEventListener("admin-cloud-sync-failed", onSyncFailed);
    return () => window.removeEventListener("admin-cloud-sync-failed", onSyncFailed);
  }, [toast, reload]);

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
      reload();
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
      reload();
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
      reload();
      toast({ title: "Category deleted", variant: "destructive" });
      setDeletingCat(null);
    } catch (error) {
      toast({ title: "Category delete failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleAddSubcat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcatForm.categoryId || !subcatForm.name.trim()) return;
    if (subcatForm.languages.length === 0) {
      toast({ title: "Select at least one language", variant: "destructive" });
      return;
    }
    const cat = cats.find((c) => c.id === subcatForm.categoryId);
    try {
      await addSubcategory({
        categoryId: subcatForm.categoryId,
        categoryName: cat?.name ?? "",
        name: subcatForm.name.trim(),
        description: subcatForm.description.trim(),
        languages: subcatForm.languages.length > 0 ? subcatForm.languages : undefined,
      });
      reload();
      setSubcatForm({ categoryId: "", name: "", description: "", languages: ["en"] });
      toast({ title: "Subcategory added" });
    } catch (error) {
      toast({ title: "Subcategory add failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleSaveEditSubcat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcat) return;
    if ((editingSubcat.languages ?? []).length === 0) {
      toast({ title: "Select at least one language", variant: "destructive" });
      return;
    }
    const cat = cats.find((c) => c.id === editingSubcat.categoryId);
    try {
      await updateSubcategory(editingSubcat.id, {
        ...editingSubcat,
        categoryName: cat?.name ?? editingSubcat.categoryName,
      });
      reload();
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
      reload();
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
    if (testForm.kind === "sectional" && normalizedSections.length === 0) {
      toast({ title: "Sections required", description: "Sectional tests require at least one section.", variant: "destructive" });
      return;
    }
    if (testForm.kind === "topic-wise" && (normalizedSections.length === 0 || !Object.values(testForm.sectionTopics).some((tids) => tids.length > 0))) {
      toast({ title: "Section & topics required", description: "Topic-wise tests require at least one section with at least one topic.", variant: "destructive" });
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
        access: testForm.access,
        kind: testForm.kind,
        duration: Number(testForm.duration) || 180,
        totalQuestions: Number(testForm.totalQuestions) || 90,
        difficulty: testForm.difficulty,
        showDifficulty: testForm.showDifficulty,
        sectionTimingMode: testForm.sectionTimingMode,
        sectionTimings,
        sections: normalizedSections,
        sectionIds: testForm.sectionIds,
        sectionSettings,
        ...(testForm.kind === "topic-wise" && (() => {
          const allTopicIds = [...new Set(Object.values(testForm.sectionTopics).flat())];
          return {
            topicId: allTopicIds.join(","),
            topicName: allTopicIds.map((id) => testFormSectionTopics.find((t) => t.id === id)?.name ?? id).join(","),
          };
        })()),
        marksPerQuestion: testForm.marksPerQuestion ?? 1,
        negativeMarks: testForm.negativeMarks ?? 0,
      });
      reload();
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
    if (editingTest.kind === "sectional" && normalizedSections.length === 0) {
      toast({ title: "Sections required", description: "Sectional tests require at least one section.", variant: "destructive" });
      return;
    }
    if (editingTest.kind === "topic-wise" && (normalizedSections.length === 0 || !(editingTest.topicId ?? "").split(",").filter(Boolean).length)) {
      toast({ title: "Section & topic required", description: "Topic-wise tests require a section and at least one topic.", variant: "destructive" });
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
      reload();
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
      reload();
      toast({ title: "Test deleted", variant: "destructive" });
      setDeletingTest(null);
    } catch (error) {
      toast({ title: "Test delete failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const section = questionForm.section.trim();
    const topic = questionForm.topic?.trim() ?? "";
    if (!questionTestId || !section || !questionForm.text.trim()) return;
    if (availableQuestionSections.length > 0 && !availableQuestionSections.includes(section)) {
      toast({
        title: "Invalid section",
        description: "Choose one of the predefined sections for this test.",
        variant: "destructive",
      });
      return;
    }
    // Validate topic exists in global topics list
    if (topic && qFormTopics.length > 0) {
      const topicMatch = qFormTopics.find(
        (t) => t.name.trim().toLowerCase() === topic.toLowerCase()
      );
      if (!topicMatch) {
        toast({
          title: "Invalid topic",
          description: `"${topic}" is not in the global topics list. Select a topic from the dropdown.`,
          variant: "destructive",
        });
        return;
      }
    }
    if (questionForm.options.some((o) => !o.trim())) return;

    // Validate required language fields based on subcategory languages
    if (questionSubcatLangs.includes("hi")) {
      if (!questionForm.textHi.trim()) {
        toast({ title: "Hindi translation required", description: "This exam requires a Hindi question text.", variant: "destructive" });
        setQLangTab("hi");
        return;
      }
      if (questionForm.optionsHi.some((o) => !o.trim())) {
        toast({ title: "Hindi options incomplete", description: "Fill all 4 Hindi options.", variant: "destructive" });
        setQLangTab("hi");
        return;
      }
    }
    if (questionSubcatLangs.includes("pa")) {
      if (!questionForm.textPa.trim()) {
        toast({ title: "Punjabi translation required", description: "This exam requires a Punjabi question text.", variant: "destructive" });
        setQLangTab("pa");
        return;
      }
      if (questionForm.optionsPa.some((o) => !o.trim())) {
        toast({ title: "Punjabi options incomplete", description: "Fill all 4 Punjabi options.", variant: "destructive" });
        setQLangTab("pa");
        return;
      }
    }

    // Build translation payloads — required langs always included, others only if filled
    const translationHi = (questionSubcatLangs.includes("hi") || questionForm.textHi.trim()) ? {
      textHi: questionForm.textHi.trim() || undefined,
      optionsHi: questionForm.optionsHi.map((o) => o.trim()) as [string, string, string, string],
      explanationHi: questionForm.explanationHi.trim() || undefined,
    } : {};
    const translationPa = (questionSubcatLangs.includes("pa") || questionForm.textPa.trim()) ? {
      textPa: questionForm.textPa.trim() || undefined,
      optionsPa: questionForm.optionsPa.map((o) => o.trim()) as [string, string, string, string],
      explanationPa: questionForm.explanationPa.trim() || undefined,
    } : {};

    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, {
          section,
          topic: topic || undefined,
          text: questionForm.text.trim(),
          options: questionForm.options.map((o) => o.trim()) as [string, string, string, string],
          correct: questionForm.correct,
          explanation: questionForm.explanation.trim(),
          ...translationHi,
          ...translationPa,
        });
        setEditingQuestion(null);
        toast({ title: "Question updated" });
      } else {
        await addQuestion({
          testId: questionTestId,
          section,
          topic: topic || undefined,
          text: questionForm.text.trim(),
          options: questionForm.options.map((o) => o.trim()) as [string, string, string, string],
          correct: questionForm.correct,
          explanation: questionForm.explanation.trim(),
          ...translationHi,
          ...translationPa,
        });
        toast({ title: "Question added", description: "New question saved to this test" });
      }
      reload();
      setQuestionForm(blankQuestionForm(availableQuestionSections[0] ?? "", ""));
      setQFormAddingTopic(false);
      setQFormNewTopicInput("");
      setQLangTab("en");

      // Warn if subcategory requires translations that some questions are missing
      if (questionSubcatLangs.length > 1) {
        const testQs = getAdminQuestions().filter((q) => q.testId === questionTestId);
        const missingHi = questionSubcatLangs.includes("hi") && testQs.some((q) => !q.textHi?.trim());
        const missingPa = questionSubcatLangs.includes("pa") && testQs.some((q) => !q.textPa?.trim());
        if (missingHi || missingPa) {
          const missing = [missingHi && "Hindi", missingPa && "Punjabi"].filter(Boolean).join(" & ");
          console.warn(`[Admin] Some questions are missing ${missing} translations for this exam.`);
          toast({
            title: `⚠️ Missing ${missing} translations`,
            description: `Some questions in this test lack ${missing} translations. Students may see English fallback.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({ title: "Question save failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion(id);
      reload();
      toast({ title: "Question deleted", variant: "destructive" });
    } catch (error) {
      toast({ title: "Question delete failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgForm.name.trim() || !pkgForm.description.trim()) return;
    if (!pkgForm.originalPriceCents || Number(pkgForm.originalPriceCents) <= 0) {
      toast({ title: "Invalid price", description: "Original price must be greater than 0", variant: "destructive" });
      return;
    }
    if (pkgForm.testIds.length === 0) {
      toast({ title: "No tests selected", description: "Select at least one test for the package", variant: "destructive" });
      return;
    }
    setPkgBusy(true);
    try {
      await createPackage({
        name: pkgForm.name.trim(),
        description: pkgForm.description.trim(),
        originalPriceCents: Number(pkgForm.originalPriceCents),
        discountPercent: Number(pkgForm.discountPercent),
        finalPriceCents: pkgFinalPrice,
        testIds: pkgForm.testIds,
        features: pkgForm.features.split("\n").map((f) => f.trim()).filter(Boolean),
        isPopular: pkgForm.isPopular ? 1 : 0,
        order: Number(pkgForm.order) || 0,
      });
      toast({ title: "Package created", description: `"${pkgForm.name}" saved successfully` });
      setPkgForm({ name: "", description: "", originalPriceCents: "", discountPercent: "0", testIds: [], features: "", isPopular: false, order: "0" });
    } catch (error) {
      toast({ title: "Package create failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    } finally {
      setPkgBusy(false);
    }
  };

  const handleCreateBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleForm.name.trim() || !bundleForm.description.trim()) return;
    if (!bundleForm.priceCents || Number(bundleForm.priceCents) <= 0) {
      toast({ title: "Invalid price", description: "Price must be greater than 0", variant: "destructive" });
      return;
    }
    if (bundleForm.packageIds.length === 0) {
      toast({ title: "No packages selected", description: "Select at least one package", variant: "destructive" });
      return;
    }
    setBundleBusy(true);
    try {
      await createBundle({
        name: bundleForm.name.trim(),
        description: bundleForm.description.trim(),
        price: Number(bundleForm.priceCents),
        packageIds: bundleForm.packageIds,
      });
      toast({ title: "Bundle created", description: `"${bundleForm.name}" saved successfully` });
      setBundleForm({ name: "", description: "", priceCents: "", packageIds: [] });
      queryClient.invalidateQueries({ queryKey: ["admin-bundles-list"] });
    } catch (error) {
      toast({ title: "Bundle create failed", description: getAdminActionErrorMessage(error), variant: "destructive" });
    } finally {
      setBundleBusy(false);
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
      let skipped = 0;
      const toAdd: Parameters<typeof bulkAddQuestions>[0] = [];
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
        toAdd.push({
          testId: questionTestId,
          section,
          text,
          options: [options[0], options[1], options[2], options[3]],
          correct: Number.isFinite(correct) ? correct : 0,
          explanation,
        });
      }
      await bulkAddQuestions(toAdd);
      const added = toAdd.length;
      reload();
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

  const csvLangLabel = (lang: string) => lang === "en" ? "English" : lang === "hi" ? "Hindi" : lang === "pa" ? "Punjabi" : lang;

  /** Build CSV header columns based on the available langs for the selected test's subcategory */
  const buildCsvColumns = (langs: string[]) => {
    const cols = ["section", "text", "option_a", "option_b", "option_c", "option_d", "correct(0-3)", "explanation"];
    for (const lang of langs) {
      if (lang === "en") continue;
      cols.push(`text_${lang}`, `option_a_${lang}`, `option_b_${lang}`, `option_c_${lang}`, `option_d_${lang}`, `explanation_${lang}`);
    }
    return cols;
  };

  const downloadCsvTemplate = () => {
    const cols = buildCsvColumns(questionSubcatLangs);
    const csv = cols.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!questionTestId) { setCsvError("Select a test first."); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const text = (ev.target?.result as string) ?? "";
        const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(Boolean);
        if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");

        const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const expectCols = buildCsvColumns(questionSubcatLangs);
        // Validate that all required columns (section, text, option_a-d, correct) are present
        const requiredCols = ["section", "text", "option_a", "option_b", "option_c", "option_d", "correct(0-3)"];
        for (const req of requiredCols) {
          if (!header.includes(req)) throw new Error(`Missing required column: "${req}"`);
        }

        const toAdd: Parameters<typeof bulkAddQuestions>[0] = [];
        let skipped = 0;
        for (let i = 1; i < lines.length; i++) {
          const raw = lines[i];
          // Simple CSV split (handles quoted fields with commas)
          const cells: string[] = [];
          let cur = "", inQuote = false;
          for (let ci = 0; ci < raw.length; ci++) {
            const ch = raw[ci];
            if (ch === '"') { inQuote = !inQuote; }
            else if (ch === "," && !inQuote) { cells.push(cur.trim()); cur = ""; }
            else { cur += ch; }
          }
          cells.push(cur.trim());

          const get = (col: string) => (cells[header.indexOf(col)] ?? "").trim();

          const section = get("section");
          const text = get("text");
          const option_a = get("option_a");
          const option_b = get("option_b");
          const option_c = get("option_c");
          const option_d = get("option_d");
          const correct = parseInt(get("correct(0-3)"), 10);
          const explanation = get("explanation");

          const isValidSection = availableQuestionSections.length === 0 || availableQuestionSections.includes(section);
          if (!section || !text || !option_a || !option_b || !option_c || !option_d || !isValidSection || isNaN(correct)) {
            skipped++;
            continue;
          }

          const entry: Parameters<typeof bulkAddQuestions>[0][number] = {
            testId: questionTestId,
            section,
            text,
            options: [option_a, option_b, option_c, option_d],
            correct: Math.max(0, Math.min(3, correct)),
            explanation,
          };

          // Optional language fields — only if subcategory supports them
          if (questionSubcatLangs.includes("hi") && header.includes("text_hi")) {
            const textHi = get("text_hi");
            if (textHi) {
              entry.textHi = textHi;
              entry.optionsHi = [get("option_a_hi") || option_a, get("option_b_hi") || option_b, get("option_c_hi") || option_c, get("option_d_hi") || option_d];
              entry.explanationHi = get("explanation_hi") || undefined;
            }
          }
          if (questionSubcatLangs.includes("pa") && header.includes("text_pa")) {
            const textPa = get("text_pa");
            if (textPa) {
              entry.textPa = textPa;
              entry.optionsPa = [get("option_a_pa") || option_a, get("option_b_pa") || option_b, get("option_c_pa") || option_c, get("option_d_pa") || option_d];
              entry.explanationPa = get("explanation_pa") || undefined;
            }
          }

          toAdd.push(entry);
        }

        await bulkAddQuestions(toAdd);
        reload();
        toast({
          title: "CSV import complete",
          description: skipped > 0
            ? `Imported ${toAdd.length} questions, skipped ${skipped} invalid rows.`
            : `Imported ${toAdd.length} questions.`,
        });
      } catch (err) {
        setCsvError(err instanceof Error ? err.message : "CSV parse failed.");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  /** Download the template for the direct CSV import format */
  const downloadDirectCsvTemplate = () => {
    const langs = questionSubcatLangs;
    const langHeaders: string[] = [];
    for (const l of ["en", "hi", "pa"]) {
      if (!langs.includes(l)) continue;
      langHeaders.push(`question_${l}`, `optionA_${l}`, `optionB_${l}`, `optionC_${l}`, `optionD_${l}`);
    }
    const headers = [...langHeaders, "correct_option", "explanation_en"];
    if (langs.includes("hi")) headers.push("explanation_hi");
    if (langs.includes("pa")) headers.push("explanation_pa");

    const exRow: string[] = [];
    for (const l of ["en", "hi", "pa"]) {
      if (!langs.includes(l)) continue;
      exRow.push(`What is 2+2?`, `3`, `4 ✓`, `5`, `6`);
    }
    exRow.push("B", "Because 2+2=4");
    if (langs.includes("hi")) exRow.push("क्योंकि 2+2=4");
    if (langs.includes("pa")) exRow.push("ਕਿਉਂਕਿ 2+2=4");

    const csv = [headers.join(","), exRow.map((v) => `"${v}"`).join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "direct-upload-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /** Parse a CSV line handling quoted fields */
  const parseCsvLineClient = (line: string): string[] => {
    const cells: string[] = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuote = !inQuote; }
      } else if (ch === "," && !inQuote) { cells.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    cells.push(cur.trim());
    return cells;
  };

  /** Read and validate a CSV file client-side for preview */
  const handleDirectCsvFileChange = (file: File) => {
    setDirectCsvFile(file);
    setDirectCsvResult(null);
    setDirectCsvError(null);
    setDirectCsvParsed(null);
    setDirectCsvShowErrors(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? "";
      const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) { setDirectCsvError("CSV must have a header row and at least one data row"); return; }

      const headerLine = parseCsvLineClient(lines[0]);
      const header = headerLine.map((h) => h.toLowerCase().trim().replace(/[^a-z0-9_]/g, ""));

      const get = (cells: string[], col: string) => (cells[header.indexOf(col)] ?? "").trim();

      const langs = questionSubcatLangs;
      const needHi = langs.includes("hi");
      const needPa = langs.includes("pa");

      const parsed: DirectCsvPreviewRow[] = [];
      for (let i = 1; i < Math.min(lines.length, 51); i++) {
        const cells = parseCsvLineClient(lines[i]);
        const rowNum = i + 1;
        const rowErrors: string[] = [];
        const cellMap: Record<string, string> = {};
        header.forEach((h, idx) => { cellMap[h] = cells[idx] ?? ""; });

        if (!get(cells, "question_en")) rowErrors.push("question_en missing");
        const opts = ["optiona_en", "optionb_en", "optionc_en", "optiond_en"];
        if (opts.some((o) => !get(cells, o))) rowErrors.push("English option(s) missing");
        const correct = get(cells, "correct_option").toUpperCase();
        if (!["A", "B", "C", "D"].includes(correct)) rowErrors.push(`correct_option "${correct}" invalid`);
        if (needHi) {
          const hiCols = ["question_hi", "optiona_hi", "optionb_hi", "optionc_hi", "optiond_hi"];
          if (hiCols.some((c) => !get(cells, c))) rowErrors.push("Hindi fields required");
        }
        if (needPa) {
          const paCols = ["question_pa", "optiona_pa", "optionb_pa", "optionc_pa", "optiond_pa"];
          if (paCols.some((c) => !get(cells, c))) rowErrors.push("Punjabi fields required");
        }

        // ── Per-row section / topic validation (client-side preview) ──────
        // Only validate rows that specify their own section/topic column
        // (batch-level selection is validated on submit, not here)
        const rowSectionVal = get(cells, "section") || get(cells, "section_id");
        const rowTopicVal   = get(cells, "topic")   || get(cells, "topic_id");
        if (rowSectionVal) {
          const normSec = rowSectionVal.trim().toLowerCase().replace(/\s+/g, " ");
          // Check by name (case-insensitive) or raw ID match
          const secMatch = masterSections.some(
            (s) => s.name.trim().toLowerCase().replace(/\s+/g, " ") === normSec || s.id === rowSectionVal.trim()
          );
          if (!secMatch) rowErrors.push(`section "${rowSectionVal}" not in master table`);
        }
        if (rowTopicVal && masterTopics.length > 0) {
          const normTop = rowTopicVal.trim().toLowerCase().replace(/\s+/g, " ");
          const topMatch = masterTopics.some(
            (t) => t.name.trim().toLowerCase().replace(/\s+/g, " ") === normTop || t.id === rowTopicVal.trim()
          );
          if (!topMatch) rowErrors.push(`topic "${rowTopicVal}" not found in global topics table`);
        }

        parsed.push({ rowNum, cells: cellMap, valid: rowErrors.length === 0, errors: rowErrors });
      }
      setDirectCsvParsed(parsed);
    };
    reader.readAsText(file);
  };

  const handleDirectCsvUpload = async () => {
    setDirectCsvError(null);
    setDirectCsvResult(null);

    if (!questionTestId) { setDirectCsvError("Select a test first."); return; }
    if (!directCsvFile) { setDirectCsvError("Select a CSV file first."); return; }
    if (!directCsvSection) { setDirectCsvError("Select a section first."); return; }
    if (!directCsvTopic) { setDirectCsvError("Select a topic first."); return; }

    setDirectCsvUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", directCsvFile);
      formData.append("testId", questionTestId);
      // Send both name (for display fallback) and ID (for authoritative lookup)
      formData.append("section", directCsvSection);
      formData.append("topic", directCsvTopic);
      if (directCsvSectionId) formData.append("sectionId", directCsvSectionId);
      if (directCsvTopicId)   formData.append("topicId",   directCsvTopicId);
      formData.append("createMissingTopics", directCsvCreateMissingTopics ? "true" : "false");
      if (selectedQuestionTest?.subcategoryId) {
        formData.append("subcategoryId", selectedQuestionTest.subcategoryId);
      }

      const { getFirebaseAuth } = await import("@/lib/firebase");
      const auth = getFirebaseAuth();
      const token = auth?.currentUser ? await auth.currentUser.getIdToken() : "";

      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "/api"}/upload-questions`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({ error: "Upload failed" })) as { error?: string };
        throw new Error(errBody.error ?? `Upload failed (${resp.status})`);
      }

      const result = await resp.json() as { inserted: number; skipped: number; errors: { row: number; reason: string }[] };
      setDirectCsvResult(result);
      setDirectCsvFile(null);
      setDirectCsvParsed(null);
      reload();
      toast({
        title: "Direct CSV import complete",
        description: `${result.inserted} question${result.inserted !== 1 ? "s" : ""} inserted${result.skipped > 0 ? `, ${result.skipped} skipped` : ""}.`,
      });
    } catch (err) {
      setDirectCsvError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setDirectCsvUploading(false);
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
            <div key={s.label} className="glass-panel rounded-2xl p-5 shadow-sm surface-hover">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-panel border border-border/70 rounded-2xl w-fit mb-6 shadow-sm flex-wrap">
          {(["categories", "subcategories", "tests", "questions", "packages", "bundles", "sections", "question-bank", "di-sets"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all capitalize ${
                tab === t
                  ? "bg-primary/10 text-foreground border border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"
              }`}
            >
              {t === "question-bank" ? "Question Bank" : t === "di-sets" ? "DI Sets" : t}
            </button>
          ))}
        </div>

        {/* ── CATEGORIES TAB ── */}
        {tab === "categories" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="glass-panel rounded-2xl p-6 shadow-sm">
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

            <div className="glass-panel rounded-2xl shadow-sm overflow-hidden">
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
            <div className="glass-panel rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Add New Exam
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
                <div>
                  <Label>Languages</Label>
                  <div className="mt-1 flex gap-3">
                    {(["en","hi","pa"] as const).map((lang) => (
                      <label key={lang} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <input type="checkbox" checked={subcatForm.languages.includes(lang)}
                          onChange={(e) => setSubcatForm({ ...subcatForm, languages: e.target.checked ? [...subcatForm.languages, lang] : subcatForm.languages.filter(l => l !== lang) })} />
                        {lang === "en" ? "English" : lang === "hi" ? "हिंदी" : "ਪੰਜਾਬੀ"}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit"><Plus className="w-4 h-4 mr-1.5" /> Add Exam</Button>
                </div>
              </form>
            </div>

            <div className="glass-panel rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Exams ({subcats.length})</h3>
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
                        <div className="flex gap-2 items-center">
                          {(["en","hi","pa"] as const).map((lang) => (
                            <label key={lang} className="flex items-center gap-1 text-xs cursor-pointer">
                              <input type="checkbox" checked={(editingSubcat.languages ?? ["en"]).includes(lang)}
                                onChange={(e) => setEditingSubcat({ ...editingSubcat, languages: e.target.checked ? [...(editingSubcat.languages ?? []), lang] : (editingSubcat.languages ?? ["en"]).filter(l => l !== lang) })} />
                              {lang === "en" ? "EN" : lang === "hi" ? "HI" : "PA"}
                            </label>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <Button type="submit" size="sm" className="h-8 px-2"><Check className="w-3.5 h-3.5" /></Button>
                          <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => setEditingSubcat(null)}><X className="w-3.5 h-3.5" /></Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.categoryName} • {s.description || "—"} • {(s.languages ?? ["en"]).join(", ")}</p>
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
                  <Label htmlFor="test-subcategory">Exam *</Label>
                  <select
                    id="test-subcategory"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={testForm.subcategoryId}
                    onChange={(e) => setTestForm({ ...testForm, subcategoryId: e.target.value })}
                    required
                  >
                    <option value="">Select exam</option>
                    {subcats.filter((s) => s.categoryId === testForm.categoryId).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="test-kind">Test Type</Label>
                  <select
                    id="test-kind"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={testForm.kind}
                    onChange={(e) => {
                      const newKind = e.target.value as TestKind;
                      setTestForm({
                        ...testForm,
                        kind: newKind,
                        // Full-length: clear all section/topic data
                        ...(newKind === "full-length" && { sections: [], sectionIds: [], topicId: "", topicName: "", sectionTimingMode: "none", sectionTimings: [] }),
                        // Sectional: clear any topic data, keep sections
                        ...(newKind === "sectional" && { topicId: "", topicName: "" }),
                        // Topic-wise: keep at most one section, clear topic
                        ...(newKind === "topic-wise" && {
                          sections: testForm.sections.slice(0, 1),
                          sectionIds: testForm.sectionIds.slice(0, 1),
                          topicId: "",
                          topicName: "",
                          sectionTimingMode: "none",
                          sectionTimings: [],
                        }),
                      });
                    }}
                  >
                    <option value="full-length">Full Length</option>
                    <option value="sectional">Sectional</option>
                    <option value="topic-wise">Topic Wise</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="test-access">Access</Label>
                  <select
                    id="test-access"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={testForm.access}
                    onChange={(e) => setTestForm({ ...testForm, access: e.target.value as TestAccess })}
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
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
                <div>
                  <Label htmlFor="test-marks-per-q">Marks / Correct</Label>
                  <Input id="test-marks-per-q" type="number" step="0.25" min="0" className="mt-1" placeholder="1" value={testForm.marksPerQuestion} onChange={(e) => setTestForm({ ...testForm, marksPerQuestion: Number(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="test-neg-marks">Negative Marks</Label>
                  <Input id="test-neg-marks" type="number" step="0.25" min="0" className="mt-1" placeholder="0" value={testForm.negativeMarks} onChange={(e) => setTestForm({ ...testForm, negativeMarks: Number(e.target.value) })} />
                </div>

                {/* Section / topic fields — hidden for full-length */}
                {testForm.kind !== "full-length" && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <SectionsPicker
                      selected={testForm.sections}
                      selectedIds={testForm.sectionIds}
                      masterSections={masterSections ?? []}
                      single={false}
                      onChange={(names, ids) => {
                        const nextSections = normalizeSections(names);
                        // Prune sectionTopics: remove entries for sections no longer selected
                        const pruned: Record<string, string[]> = {};
                        ids.forEach((id) => { pruned[id] = testForm.sectionTopics[id] ?? []; });
                        setTestForm({
                          ...testForm,
                          sections: nextSections,
                          sectionIds: ids,
                          sectionTopics: pruned,
                          sectionTimings: buildSectionTimings(nextSections, testForm.sectionTimingMode, testForm.sectionTimings),
                        });
                      }}
                      required
                    />
                  </div>
                )}

                {/* Per-section topic pickers — topic-wise only */}
                {testForm.kind === "topic-wise" && testForm.sectionIds.length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Topics per Section <span className="text-destructive ml-0.5">*</span></Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs text-primary hover:text-primary gap-1"
                        onClick={() => openAddTopicModal(
                          (created) => setTestForm((f) => ({
                            ...f,
                            sectionTopics: Object.fromEntries(
                              f.sectionIds.map((sid) => [sid, f.sectionTopics[sid] ?? []])
                            ),
                          })),
                        )}
                      >
                        <Plus className="w-3 h-3" /> Add Topic
                      </Button>
                    </div>
                    {testFormSectionTopics.length === 0 ? (
                      <p className="text-[11px] text-amber-600">No topics yet — click <strong>Add Topic</strong> above to create one.</p>
                    ) : (
                      testForm.sectionIds.map((sectionId, si) => {
                        const sectionName = testForm.sections[si] ?? sectionId;
                        const picked = testForm.sectionTopics[sectionId] ?? [];
                        return (
                          <div key={sectionId} className="border border-input rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50">
                              <span className="text-xs font-medium">{sectionName}</span>
                              <span className="text-[11px] text-muted-foreground">{picked.length} topic{picked.length !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="p-2 max-h-36 overflow-y-auto grid grid-cols-2 gap-0.5">
                              {testFormSectionTopics.map((t) => (
                                <label key={t.id} className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-muted rounded px-1.5 py-1">
                                  <input
                                    type="checkbox"
                                    className="accent-primary"
                                    checked={picked.includes(t.id)}
                                    onChange={(e) => {
                                      const updated = e.target.checked
                                        ? [...picked, t.id]
                                        : picked.filter((id) => id !== t.id);
                                      setTestForm({
                                        ...testForm,
                                        sectionTopics: { ...testForm.sectionTopics, [sectionId]: updated },
                                      });
                                    }}
                                  />
                                  {t.name}
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Section timing — sectional only */}
                {testForm.kind === "sectional" && (
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
                )}

                {testForm.kind === "sectional" && testForm.sectionTimingMode === "fixed" && testForm.sections.length > 0 && (
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
                            <Label className="text-xs">Exam</Label>
                            <select
                              className="mt-0.5 w-full h-8 px-2 bg-background border border-input rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                              value={editingTest.subcategoryId}
                              onChange={(e) => setEditingTest({ ...editingTest, subcategoryId: e.target.value })}
                            >
                              {subcats.filter((s) => s.categoryId === editingTest.categoryId).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs">Test Type</Label>
                            <select
                              className="mt-0.5 w-full h-8 px-2 bg-background border border-input rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                              value={editingTest.kind}
                              onChange={(e) => {
                                const newKind = e.target.value as TestKind;
                                setEditingTest({
                                  ...editingTest,
                                  kind: newKind,
                                  ...(newKind === "full-length" && { sections: [], sectionIds: [], topicId: "", topicName: "", sectionTimingMode: "none", sectionTimings: [], sectionSettings: [] }),
                                  ...(newKind === "sectional" && { topicId: "", topicName: "" }),
                                  ...(newKind === "topic-wise" && {
                                    sections: (editingTest.sections ?? []).slice(0, 1),
                                    sectionIds: (editingTest.sectionIds ?? []).slice(0, 1),
                                    topicId: "",
                                    topicName: "",
                                    sectionTimingMode: "none",
                                    sectionTimings: [],
                                    sectionSettings: [],
                                  }),
                                });
                              }}
                            >
                              <option value="full-length">Full Length</option>
                              <option value="sectional">Sectional</option>
                              <option value="topic-wise">Topic Wise</option>
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs">Access</Label>
                            <select
                              className="mt-0.5 w-full h-8 px-2 bg-background border border-input rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                              value={editingTest.access}
                              onChange={(e) => setEditingTest({ ...editingTest, access: e.target.value as TestAccess })}
                            >
                              <option value="free">Free</option>
                              <option value="paid">Paid</option>
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
                          {/* Section timing — sectional only */}
                          {editingTest.kind === "sectional" && (
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
                          )}
                          <div>
                            <Label className="text-xs">Duration (min)</Label>
                            <Input type="number" className="mt-0.5 h-8 text-sm" value={editingTest.duration} onChange={(e) => setEditingTest({ ...editingTest, duration: Number(e.target.value) })} />
                          </div>
                          <div>
                            <Label className="text-xs">Questions</Label>
                            <Input type="number" className="mt-0.5 h-8 text-sm" value={editingTest.totalQuestions} onChange={(e) => setEditingTest({ ...editingTest, totalQuestions: Number(e.target.value) })} />
                          </div>
                          <div>
                            <Label className="text-xs">Marks / Correct</Label>
                            <Input type="number" step="0.25" min="0" className="mt-0.5 h-8 text-sm" value={editingTest.marksPerQuestion ?? 1} onChange={(e) => setEditingTest({ ...editingTest, marksPerQuestion: Number(e.target.value) })} />
                          </div>
                          <div>
                            <Label className="text-xs">Negative Marks</Label>
                            <Input type="number" step="0.25" min="0" className="mt-0.5 h-8 text-sm" value={editingTest.negativeMarks ?? 0} onChange={(e) => setEditingTest({ ...editingTest, negativeMarks: Number(e.target.value) })} />
                          </div>
                          {/* Section picker — hidden for full-length */}
                          {editingTest.kind !== "full-length" && (
                            <div className="col-span-2 sm:col-span-3">
                              <SectionsPicker
                                selected={editingTest.sections ?? []}
                                selectedIds={editingTest.sectionIds ?? []}
                                masterSections={masterSections ?? []}
                                single={false}
                                onChange={(names, ids) => {
                                  const nextSections = normalizeSections(names);
                                  // Keep existing topicId assignment; no need to clear
                                  setEditingTest({
                                    ...editingTest,
                                    sections: nextSections,
                                    sectionIds: ids,
                                    sectionSettings: buildSectionSettings(nextSections, editingTest.sectionSettings),
                                    sectionTimings: buildSectionTimings(
                                      nextSections,
                                      editingTest.sectionTimingMode ?? "none",
                                      editingTest.sectionTimings,
                                    ),
                                  });
                                }}
                                required
                              />
                            </div>
                          )}
                          {/* Per-section topic pickers — topic-wise only */}
                          {editingTest.kind === "topic-wise" && (editingTest.sectionIds ?? []).length > 0 && (
                            <div className="col-span-2 sm:col-span-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">Topics per Section <span className="text-destructive ml-0.5">*</span></Label>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 px-1.5 text-[11px] text-primary hover:text-primary gap-1"
                                  onClick={() => openAddTopicModal(() => {/* topic list auto-refreshes */})}
                                >
                                  <Plus className="w-3 h-3" /> Add Topic
                                </Button>
                              </div>
                              {editTestSectionTopics.length === 0 ? (
                                <p className="text-[11px] text-amber-600">No topics yet — click <strong>Add Topic</strong> above to create one.</p>
                              ) : (
                                (editingTest.sectionIds ?? []).map((sectionId, si) => {
                                  const sectionName = (editingTest.sections ?? [])[si] ?? sectionId;
                                  const allSelectedIds = (editingTest.topicId ?? "").split(",").filter(Boolean);
                                  return (
                                    <div key={sectionId} className="border border-input rounded-lg overflow-hidden">
                                      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50">
                                        <span className="text-xs font-medium">{sectionName}</span>
                                        <span className="text-[11px] text-muted-foreground">
                                          {allSelectedIds.length} topic{allSelectedIds.length !== 1 ? "s" : ""} selected
                                        </span>
                                      </div>
                                      <div className="p-1.5 max-h-32 overflow-y-auto grid grid-cols-2 gap-0.5">
                                        {editTestSectionTopics.map((t) => (
                                          <label key={t.id} className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-muted rounded px-1.5 py-1">
                                            <input
                                              type="checkbox"
                                              className="accent-primary"
                                              checked={allSelectedIds.includes(t.id)}
                                              onChange={(e) => {
                                                const updatedIds = e.target.checked
                                                  ? [...allSelectedIds, t.id]
                                                  : allSelectedIds.filter((id) => id !== t.id);
                                                const updatedNames = updatedIds.map((id) => editTestSectionTopics.find((tp) => tp.id === id)?.name ?? id);
                                                setEditingTest({ ...editingTest, topicId: updatedIds.join(","), topicName: updatedNames.join(",") });
                                              }}
                                            />
                                            {t.name}
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                          {/* Section timing per-section minutes — sectional only */}
                          {editingTest.kind === "sectional" && (editingTest.sectionTimingMode ?? "none") === "fixed" && (
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
                          {/* Section lock settings — sectional only */}
                          {editingTest.kind === "sectional" && (
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
                          )}
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
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                {TEST_KIND_LABELS[test.kind ?? "full-length"]}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                (test.access ?? "free") === "free"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              }`}>
                                {TEST_ACCESS_LABELS[test.access ?? "free"]}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[test.difficulty]}`}>{test.difficulty}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1.5">
                              {test.categoryName} • {test.subcategoryName || "General"} • {test.totalQuestions} questions • {test.duration} min • {test.attempts.toLocaleString()} attempts
                            </p>
                            {test.kind !== "full-length" && test.sections && test.sections.length > 0 && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <Tag className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                                {test.sections.map((s) => (
                                  <span key={s} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{s}</span>
                                ))}
                                {test.kind === "topic-wise" && test.topicName && (
                                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">{test.topicName}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-primary" onClick={() => setEditingTest({ ...test, sectionIds: (test.sections ?? []).map((name) => masterSections?.find((s) => s.name === name)?.id ?? "").filter(Boolean) })}><Edit className="w-3.5 h-3.5" /></Button>
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
                    onChange={(e) => {
                      const newTestId = e.target.value;
                      setQuestionTestId(newTestId);
                      const newTest = tests.find((t) => t.id === newTestId);
                      const newSubcat = subcats.find((s) => s.id === newTest?.subcategoryId);
                      const newLangs = newSubcat?.languages && newSubcat.languages.length > 0 ? newSubcat.languages : ["en"];
                      if (!newLangs.includes(qLangTab)) setQLangTab("en");
                    }}
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
                    onChange={(e) => {
                      setQuestionForm({ ...questionForm, section: e.target.value, topic: "" });
                      setQFormAddingTopic(false);
                      setQFormNewTopicInput("");
                    }}
                    required
                  >
                    <option value="">— pick section —</option>
                    {masterSections.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="q-topic">Topic</Label>
                  <select
                    id="q-topic"
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    value={qFormAddingTopic ? "__add_new__" : (questionForm.topic ?? "")}
                    onChange={(e) => {
                      if (e.target.value === "__add_new__") {
                        setQFormAddingTopic(true);
                        setQFormNewTopicInput("");
                        setQuestionForm({ ...questionForm, topic: "" });
                      } else {
                        setQFormAddingTopic(false);
                        setQuestionForm({ ...questionForm, topic: e.target.value });
                      }
                    }}
                    disabled={qFormTopicsLoading}
                  >
                    <option value="">{qFormTopicsLoading ? "Loading…" : "— pick topic (optional) —"}</option>
                    {qFormTopics.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                    <option value="__add_new__">＋ Add new topic…</option>
                  </select>
                  {qFormAddingTopic && (
                    <div className="flex gap-1.5 mt-1.5">
                      <Input
                        autoFocus
                        placeholder="New topic name"
                        className="h-8 text-sm"
                        value={qFormNewTopicInput}
                        onChange={(e) => setQFormNewTopicInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Escape") { setQFormAddingTopic(false); setQFormNewTopicInput(""); } }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 px-3 shrink-0"
                        disabled={!qFormNewTopicInput.trim()}
                        onClick={async () => {
                          const name = qFormNewTopicInput.trim();
                          if (!name) return;
                          try {
                            const created = await createTopic(name);
                            await queryClient.invalidateQueries({ queryKey: ["master-topics"] });
                            setQuestionForm({ ...questionForm, topic: created.name });
                            setQFormAddingTopic(false);
                            setQFormNewTopicInput("");
                          } catch {
                            toast({ title: "Failed to create topic", variant: "destructive" });
                          }
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 shrink-0"
                        onClick={() => { setQFormAddingTopic(false); setQFormNewTopicInput(""); }}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
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

                {/* ── Language tabs ── */}
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 p-1 w-fit mb-4">
                    {(["en", "hi", "pa"] as const).filter((l) => questionSubcatLangs.includes(l)).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setQLangTab(l)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                          qLangTab === l
                            ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-200"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        {l === "en" ? "English" : l === "hi" ? "हिंदी" : "ਪੰਜਾਬੀ"}
                        {l !== "en" && !questionSubcatLangs.includes(l) && (
                          <span className="ml-1 text-[9px] font-normal text-gray-400">(optional)</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* English fields (required) */}
                  {qLangTab === "en" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>
                  )}

                  {/* Hindi fields (optional) */}
                  {qLangTab === "hi" && questionSubcatLangs.includes("hi") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        हिंदी अनुवाद वैकल्पिक है। यदि प्रश्न खाली छोड़ा गया तो हिंदी का विकल्प नहीं दिखाया जाएगा।
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="q-text-hi">प्रश्न (हिंदी)</Label>
                        <Input id="q-text-hi" className="mt-1" placeholder="प्रश्न यहाँ लिखें" value={questionForm.textHi} onChange={(e) => setQuestionForm({ ...questionForm, textHi: e.target.value })} />
                      </div>
                      {questionForm.optionsHi.map((opt, index) => (
                        <div key={index}>
                          <Label htmlFor={`q-opt-hi-${index}`}>विकल्प {String.fromCharCode(65 + index)}</Label>
                          <Input
                            id={`q-opt-hi-${index}`}
                            className="mt-1"
                            value={opt}
                            onChange={(e) => {
                              const next = [...questionForm.optionsHi] as [string, string, string, string];
                              next[index] = e.target.value;
                              setQuestionForm({ ...questionForm, optionsHi: next });
                            }}
                          />
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <Label htmlFor="q-exp-hi">व्याख्या (हिंदी)</Label>
                        <Input id="q-exp-hi" className="mt-1" placeholder="सही उत्तर की व्याख्या" value={questionForm.explanationHi} onChange={(e) => setQuestionForm({ ...questionForm, explanationHi: e.target.value })} />
                      </div>
                    </div>
                  )}

                  {/* Punjabi fields (optional) */}
                  {qLangTab === "pa" && questionSubcatLangs.includes("pa") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਵਿਕਲਪਿਕ ਹੈ। ਜੇਕਰ ਸਵਾਲ ਖਾਲੀ ਛੱਡਿਆ ਗਿਆ ਤਾਂ ਪੰਜਾਬੀ ਵਿਕਲਪ ਨਹੀਂ ਦਿਖਾਇਆ ਜਾਵੇਗਾ।
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="q-text-pa">ਸਵਾਲ (ਪੰਜਾਬੀ)</Label>
                        <Input id="q-text-pa" className="mt-1" placeholder="ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ" value={questionForm.textPa} onChange={(e) => setQuestionForm({ ...questionForm, textPa: e.target.value })} />
                      </div>
                      {questionForm.optionsPa.map((opt, index) => (
                        <div key={index}>
                          <Label htmlFor={`q-opt-pa-${index}`}>ਵਿਕਲਪ {String.fromCharCode(65 + index)}</Label>
                          <Input
                            id={`q-opt-pa-${index}`}
                            className="mt-1"
                            value={opt}
                            onChange={(e) => {
                              const next = [...questionForm.optionsPa] as [string, string, string, string];
                              next[index] = e.target.value;
                              setQuestionForm({ ...questionForm, optionsPa: next });
                            }}
                          />
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <Label htmlFor="q-exp-pa">ਵਿਆਖਿਆ (ਪੰਜਾਬੀ)</Label>
                        <Input id="q-exp-pa" className="mt-1" placeholder="ਸਹੀ ਜਵਾਬ ਦੀ ਵਿਆਖਿਆ" value={questionForm.explanationPa} onChange={(e) => setQuestionForm({ ...questionForm, explanationPa: e.target.value })} />
                      </div>
                    </div>
                  )}
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
                              setQFormAddingTopic(false);
                              setQFormNewTopicInput("");
                              setQuestionForm({
                                section: q.section,
                                topic: q.topic ?? "",
                                text: q.text,
                                options: [...q.options] as [string, string, string, string],
                                correct: q.correct,
                                explanation: q.explanation,
                                textHi: q.textHi ?? "",
                                optionsHi: q.optionsHi ? [...q.optionsHi] as [string, string, string, string] : ["", "", "", ""],
                                explanationHi: q.explanationHi ?? "",
                                textPa: q.textPa ?? "",
                                optionsPa: q.optionsPa ? [...q.optionsPa] as [string, string, string, string] : ["", "", "", ""],
                                explanationPa: q.explanationPa ?? "",
                              });
                              setQLangTab("en");
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

            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-1">Bulk Upload (CSV)</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Upload a CSV file. Columns adapt to the subcategory languages.
                {questionSubcatLangs.length > 1 && (
                  <span className="ml-1 font-medium text-foreground">
                    Active langs: {questionSubcatLangs.map(csvLangLabel).join(", ")}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Button type="button" variant="outline" size="sm" onClick={downloadCsvTemplate} disabled={!questionTestId}>
                  Download Template
                </Button>
                <input
                  type="file"
                  id="csvUpload"
                  accept=".csv"
                  style={{ display: "none" }}
                  onChange={handleCsvUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!questionTestId}
                  onClick={() => (document.getElementById("csvUpload") as HTMLInputElement | null)?.click()}
                >
                  Upload CSV
                </Button>
              </div>
              {csvError && <p className="text-xs text-destructive">{csvError}</p>}
              {questionTestId && (
                <p className="text-[11px] text-muted-foreground font-mono">
                  Required columns: {buildCsvColumns(questionSubcatLangs).join(", ")}
                </p>
              )}
            </div>

            {/* ── Assign from Question Bank ── */}
            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Assign from Question Bank
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Pick questions from the global bank and add them to a test. Already-assigned questions are shown greyed out.
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-48">
                  <Label className="text-xs mb-1 block">Select Test</Label>
                  <select
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={bankPickerTestId}
                    onChange={(e) => {
                      setBankPickerTestId(e.target.value);
                      setBankPickerTestName(tests.find((t) => t.id === e.target.value)?.name ?? "");
                    }}
                  >
                    <option value="">— select a test —</option>
                    {tests.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={!bankPickerTestId}
                  onClick={() => setBankPickerOpen(true)}
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Browse &amp; Assign
                </Button>
              </div>
            </div>

            {/* ── Direct CSV Import (uploads straight to DB) ── */}
            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                Direct CSV Import
                <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Writes directly to DB</span>
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Upload 100–1000+ questions in one shot. EN questions are required
                {questionSubcatLangs.includes("hi") && "; Hindi required for this subcategory"}
                {questionSubcatLangs.includes("pa") && "; Punjabi required for this subcategory"}
                . Preview shown before confirming.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <Label className="text-xs mb-1 block">Section</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={directCsvSection}
                    onChange={(e) => { setDirectCsvSection(e.target.value); setDirectCsvTopic(""); setDirectCsvAddingTopic(false); setDirectCsvNewTopicInput(""); }}
                  >
                    <option value="">— pick section —</option>
                    {masterSections.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Topic</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                    value={directCsvTopic}
                    onChange={(e) => {
                      if (e.target.value === "__add_new__") {
                        setDirectCsvTopic("");
                        setDirectCsvNewTopicInput("");
                        setDirectCsvAddingTopic(true);
                      } else {
                        setDirectCsvAddingTopic(false);
                        setDirectCsvTopic(e.target.value);
                      }
                    }}
                    disabled={!directCsvSectionId}
                  >
                    <option value="">— pick topic —</option>
                    {masterTopics.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                    <option value="__add_new__">＋ Add new topic…</option>
                  </select>
                  {directCsvAddingTopic && (
                    <div className="flex gap-1.5 mt-1.5">
                      <Input
                        autoFocus
                        placeholder="New topic name"
                        className="h-8 text-sm"
                        value={directCsvNewTopicInput}
                        onChange={(e) => setDirectCsvNewTopicInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Escape") { setDirectCsvAddingTopic(false); setDirectCsvNewTopicInput(""); } }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 px-3 shrink-0"
                        disabled={!directCsvNewTopicInput.trim()}
                        onClick={async () => {
                          const name = directCsvNewTopicInput.trim();
                          if (!name) return;
                          try {
                            const created = await createTopic(name);
                            await queryClient.invalidateQueries({ queryKey: ["master-topics"] });
                            setDirectCsvTopic(created.name);
                            setDirectCsvAddingTopic(false);
                            setDirectCsvNewTopicInput("");
                          } catch {
                            toast({ title: "Failed to create topic", variant: "destructive" });
                          }
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 shrink-0"
                        onClick={() => { setDirectCsvAddingTopic(false); setDirectCsvNewTopicInput(""); }}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {/* Auto-create missing topics toggle */}
              <div className="mb-3 flex items-center gap-2">
                <input
                  id="csvCreateMissingTopics"
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
                  checked={directCsvCreateMissingTopics}
                  onChange={(e) => setDirectCsvCreateMissingTopics(e.target.checked)}
                />
                <Label htmlFor="csvCreateMissingTopics" className="text-xs cursor-pointer select-none">
                  Auto-create topics not in master table
                  <span className="ml-1 text-muted-foreground">(per-row <code className="font-mono">topic</code> column)</span>
                </Label>
              </div>
              <div className="mb-3">
                <div className="flex flex-col justify-end">
                  <Label className="text-xs mb-1 block">CSV File</Label>
                  <label className={`inline-flex items-center gap-1.5 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground truncate ${!questionTestId ? "opacity-50 pointer-events-none" : ""}`}>
                    <input
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      disabled={!questionTestId}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleDirectCsvFileChange(f);
                        e.target.value = "";
                      }}
                    />
                    {directCsvFile ? directCsvFile.name : "Choose file…"}
                  </label>
                </div>
              </div>

              {/* Validation summary bar */}
              {directCsvParsed && (() => {
                const validCount = directCsvParsed.filter((r) => r.valid).length;
                const invalidCount = directCsvParsed.filter((r) => !r.valid).length;
                return (
                  <div className="flex items-center gap-3 text-xs mb-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
                    <span className="text-emerald-600 font-semibold">✓ {validCount} valid</span>
                    {invalidCount > 0 && <span className="text-destructive font-semibold">✗ {invalidCount} invalid</span>}
                    <span className="text-muted-foreground">(previewing first {directCsvParsed.length} rows)</span>
                  </div>
                );
              })()}

              {/* Preview table */}
              {directCsvParsed && directCsvParsed.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-border mb-3 max-h-64 overflow-y-auto text-xs">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/60 sticky top-0">
                      <tr>
                        <th className="px-2 py-1.5 text-left font-semibold">#</th>
                        <th className="px-2 py-1.5 text-left font-semibold">question_en</th>
                        <th className="px-2 py-1.5 text-left font-semibold">correct</th>
                        <th className="px-2 py-1.5 text-left font-semibold">status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {directCsvParsed.map((row) => (
                        <tr key={row.rowNum} className={row.valid ? "" : "bg-destructive/10"}>
                          <td className="px-2 py-1 text-muted-foreground">{row.rowNum}</td>
                          <td className="px-2 py-1 max-w-xs truncate" title={row.cells["question_en"] ?? ""}>{row.cells["question_en"] ?? "—"}</td>
                          <td className="px-2 py-1">{(row.cells["correct_option"] ?? "").toUpperCase() || "—"}</td>
                          <td className="px-2 py-1">
                            {row.valid
                              ? <span className="text-emerald-600">✓</span>
                              : <span className="text-destructive" title={row.errors.join("; ")}>✗ {row.errors[0]}</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadDirectCsvTemplate}
                >
                  Download Template
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!questionTestId || !directCsvFile || directCsvUploading || (directCsvParsed !== null && directCsvParsed.every((r) => !r.valid))}
                  onClick={handleDirectCsvUpload}
                >
                  {directCsvUploading ? "Uploading…" : directCsvParsed ? "Confirm Upload" : "Upload to DB"}
                </Button>
              </div>

              {directCsvError && (
                <p className="text-xs text-destructive mt-2">{directCsvError}</p>
              )}

              {directCsvResult && (
                <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1">
                  <p className="font-semibold text-foreground">
                    ✅ {directCsvResult.inserted} inserted
                    {directCsvResult.skipped > 0 && `, ⚠️ ${directCsvResult.skipped} skipped`}
                  </p>
                  {directCsvResult.errors.length > 0 && (
                    <div>
                      <button
                        type="button"
                        className="text-muted-foreground underline underline-offset-2 text-[11px]"
                        onClick={() => setDirectCsvShowErrors((v) => !v)}
                      >
                        {directCsvShowErrors ? "Hide" : "Show"} {directCsvResult.errors.length} error{directCsvResult.errors.length !== 1 ? "s" : ""}
                      </button>
                      {directCsvShowErrors && (
                        <div className="mt-1 space-y-0.5 text-muted-foreground max-h-40 overflow-y-auto">
                          {directCsvResult.errors.map((e) => (
                            <p key={e.row}>Row {e.row}: {e.reason}</p>
                          ))}
                          {directCsvResult.skipped > directCsvResult.errors.length && (
                            <p>…and {directCsvResult.skipped - directCsvResult.errors.length} more</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <p className="text-[11px] text-muted-foreground font-mono mt-3">
                Required: question_en, optionA/B/C/D_en, correct_option (A/B/C/D)
                {questionSubcatLangs.includes("hi") && " + _hi fields"}
                {questionSubcatLangs.includes("pa") && " + _pa fields"}
              </p>
            </div>
          </div>
        )}

        {/* ── PACKAGES TAB ── */}
        {tab === "packages" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="glass-panel rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Create New Package
              </h3>
              <form onSubmit={handleCreatePackage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Name *</Label>
                    <Input className="mt-1" placeholder="e.g., Railways Full Pack" value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Display Order</Label>
                    <Input type="number" min="0" className="mt-1" placeholder="0" value={pkgForm.order} onChange={(e) => setPkgForm({ ...pkgForm, order: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Description *</Label>
                    <Input className="mt-1" placeholder="Brief description of the package" value={pkgForm.description} onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Original Price (₹, in paise) *</Label>
                    <Input type="number" min="1" className="mt-1" placeholder="e.g. 49900 for ₹499" value={pkgForm.originalPriceCents} onChange={(e) => setPkgForm({ ...pkgForm, originalPriceCents: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Discount %</Label>
                    <Input type="number" min="0" max="100" className="mt-1" placeholder="0" value={pkgForm.discountPercent} onChange={(e) => setPkgForm({ ...pkgForm, discountPercent: e.target.value })} />
                  </div>
                  {pkgForm.originalPriceCents && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Final price: <span className="font-semibold text-foreground">₹{(pkgFinalPrice / 100).toFixed(2)}</span>
                        {Number(pkgForm.discountPercent) > 0 && (
                          <span className="ml-2 text-emerald-600">({pkgForm.discountPercent}% off)</span>
                        )}
                      </p>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <Label>Features (one per line)</Label>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                      placeholder="Includes 10 full-length tests&#10;Detailed solutions&#10;Valid for 1 year"
                      value={pkgForm.features}
                      onChange={(e) => setPkgForm({ ...pkgForm, features: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="pkg-popular" checked={pkgForm.isPopular} onChange={(e) => setPkgForm({ ...pkgForm, isPopular: e.target.checked })} />
                    <Label htmlFor="pkg-popular" className="cursor-pointer">Mark as Popular</Label>
                  </div>
                </div>

                {/* Test selector */}
                <div>
                  <Label>Select Tests *</Label>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-2">{pkgForm.testIds.length} selected</p>
                  {testsLoading ? (
                    <p className="text-sm text-muted-foreground">Loading tests…</p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto rounded-lg border border-input divide-y divide-border">
                      {backendTests.map((t) => (
                        <label key={t.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pkgForm.testIds.includes(t.id)}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...pkgForm.testIds, t.id]
                                : pkgForm.testIds.filter((id) => id !== t.id);
                              setPkgForm({ ...pkgForm, testIds: next });
                            }}
                          />
                          <span className="text-sm font-medium leading-snug">{t.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground shrink-0">{t.category}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={pkgBusy}>
                    <Package className="w-4 h-4 mr-1.5" />
                    {pkgBusy ? "Creating…" : "Create Package"}
                  </Button>
                </div>
              </form>
            </div>
          {/* Packages list */}
          <div className="glass-panel rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">All Packages</h3>
            {packagesListLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : packagesList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No packages yet.</p>
            ) : (
              <div className="divide-y divide-border rounded-lg border border-input overflow-hidden">
                {packagesList.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-medium">{pkg.name}</span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{pkg.testCount} test{pkg.testCount !== 1 ? "s" : ""}</span>
                      <span className="font-semibold text-foreground">₹{(pkg.finalPriceCents / 100).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* ── BUNDLES TAB ── */}
        {tab === "bundles" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="glass-panel rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Create New Bundle
              </h3>
              <form onSubmit={handleCreateBundle} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Label>Name *</Label>
                    <Input
                      className="mt-1"
                      placeholder="e.g., Ultimate Prep Bundle"
                      value={bundleForm.name}
                      onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Description *</Label>
                    <Input
                      className="mt-1"
                      placeholder="Brief description of the bundle"
                      value={bundleForm.description}
                      onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Price (₹, in paise) *</Label>
                    <Input
                      type="number"
                      min="1"
                      className="mt-1"
                      placeholder="e.g. 99900 for ₹999"
                      value={bundleForm.priceCents}
                      onChange={(e) => setBundleForm({ ...bundleForm, priceCents: e.target.value })}
                      required
                    />
                    {bundleForm.priceCents && (
                      <p className="text-xs text-muted-foreground mt-1">
                        = ₹{(Number(bundleForm.priceCents) / 100).toFixed(0)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Package selector */}
                <div>
                  <Label>Select Packages *</Label>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                    {bundleForm.packageIds.length} selected
                  </p>
                  {packagesListLoading ? (
                    <p className="text-sm text-muted-foreground">Loading packages…</p>
                  ) : packagesList.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No packages available. Create packages first.</p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto rounded-lg border border-input divide-y divide-border">
                      {packagesList.map((pkg) => (
                        <label key={pkg.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bundleForm.packageIds.includes(pkg.id)}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...bundleForm.packageIds, pkg.id]
                                : bundleForm.packageIds.filter((id) => id !== pkg.id);
                              setBundleForm({ ...bundleForm, packageIds: next });
                            }}
                          />
                          <span className="text-sm font-medium leading-snug">{pkg.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground shrink-0">
                            ₹{(pkg.finalPriceCents / 100).toFixed(0)}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={bundleBusy}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    {bundleBusy ? "Creating…" : "Create Bundle"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Bundles list */}
            <div className="glass-panel rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">All Bundles</h3>
              {bundlesListLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : bundlesList.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bundles yet.</p>
              ) : (
                <div className="divide-y divide-border rounded-lg border border-input overflow-hidden">
                  {bundlesList.map((b) => (
                    <div key={b.id} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium">{b.name}</span>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{b.packageCount} package{b.packageCount !== 1 ? "s" : ""}</span>
                        <span className="font-semibold text-foreground">₹{(b.price / 100).toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SECTIONS TAB ── */}
        {tab === "sections" && (
          <SectionsManager masterSections={masterSections} queryClient={queryClient} toast={toast} />
        )}

        {/* ── QUESTION BANK TAB ── */}
        {tab === "question-bank" && (
          <QuestionBankTab />
        )}

        {/* ── DI SETS TAB ── */}
        {tab === "di-sets" && (
          <DiSetManager />
        )}
      </main>

      {/* ── Assign from Bank Dialog ── */}
      <AssignFromBankDialog
        testId={bankPickerTestId}
        testName={bankPickerTestName}
        open={bankPickerOpen}
        onClose={() => setBankPickerOpen(false)}
        onAdded={() => {/* tests list will reflect updated count on next load */}}
      />

      {deletingCat && <DeleteModal name={deletingCat.name} onConfirm={handleDeleteCat} onCancel={() => setDeletingCat(null)} />}
      {deletingSubcat && <DeleteModal name={deletingSubcat.name} onConfirm={handleDeleteSubcat} onCancel={() => setDeletingSubcat(null)} />}
      {deletingTest && <DeleteModal name={deletingTest.name} onConfirm={handleDeleteTest} onCancel={() => setDeletingTest(null)} />}

      {/* Quick-add topic modal */}
      <Dialog open={addTopicModal.open} onOpenChange={(open) => !addTopicModal.busy && setAddTopicModal((m) => ({ ...m, open }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div>
              <Label htmlFor="quick-topic-name">Topic Name <span className="text-destructive">*</span></Label>
              <Input
                id="quick-topic-name"
                autoFocus
                className="mt-1"
                placeholder="e.g. Algebra"
                value={addTopicModal.name}
                onChange={(e) => setAddTopicModal((m) => ({ ...m, name: e.target.value, error: null }))}
                onKeyDown={(e) => { if (e.key === "Enter" && addTopicModal.name.trim()) handleAddTopicModalSave(); }}
                disabled={addTopicModal.busy}
              />
              {addTopicModal.error && (
                <p className="text-xs text-destructive mt-1">{addTopicModal.error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={addTopicModal.busy} onClick={() => setAddTopicModal((m) => ({ ...m, open: false }))}>
              Cancel
            </Button>
            <Button size="sm" disabled={addTopicModal.busy || !addTopicModal.name.trim()} onClick={handleAddTopicModalSave}>
              {addTopicModal.busy ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
