/**
 * QuestionBankTab — Admin Question Bank UI
 *
 * Features:
 * - Search + filter bar (section, topic, difficulty) with debounced search
 * - Paginated table: checkbox, question preview, topic, difficulty badge, usageCount, lastUsed
 * - Row expansion: full question text + list of tests using it
 * - Add / Edit question modal (all fields + difficulty)
 * - "Add to Test" modal: pick target test, prevents duplicates
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Edit, Trash2, Search, X, ChevronDown, ChevronRight,
  BookOpen, AlertTriangle, Check, Loader2, ExternalLink, Upload, Download, FileText, ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getQuestionBank,
  getBankQuestionTests,
  createBankQuestion,
  updateBankQuestion,
  deleteBankQuestion,
  addQuestionsToTest,
  removeQuestionFromTest,
  importBankQuestionsFromCsv,
  getDiSets,
  uploadImageToStorage,
  type BankQuestion,
  type QuestionDifficulty,
  type BankQuestionUsage,
  type BankCsvImportResult,
  type DiSet,
} from "@/lib/data";
import { getSections, getAllTopics, type MasterSection, type MasterTopic } from "@/lib/data";
import { getTests as fetchBackendTests } from "@/lib/data";

// ── Constants ─────────────────────────────────────────────────────────────────

const DIFFICULTY_OPTIONS: QuestionDifficulty[] = ["Easy", "Medium", "Hard"];
const PAGE_SIZE = 20;

const DIFFICULTY_COLORS: Record<QuestionDifficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function DifficultyBadge({ diff }: { diff: QuestionDifficulty | null }) {
  if (!diff) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[diff]}`}>
      {diff}
    </span>
  );
}

function truncate(text: string, max = 90) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Blank question form ────────────────────────────────────────────────────────

function blankForm() {
  return {
    text: "",
    options: ["", "", "", ""] as [string, string, string, string],
    correct: 0,
    section: "",
    sectionId: "",
    globalTopicId: "",
    topic: "",
    explanation: "",
    difficulty: "" as QuestionDifficulty | "",
    textHi: "",
    optionsHi: ["", "", "", ""] as [string, string, string, string],
    explanationHi: "",
    textPa: "",
    optionsPa: ["", "", "", ""] as [string, string, string, string],
    explanationPa: "",
    imageUrl: "",
    questionType: "text" as "text" | "image" | "di",
    diSetId: "" as string,
  };
}

// ── Row expansion: tests using this question ───────────────────────────────────

function QuestionTestList({ questionId }: { questionId: number }) {
  const { data: usageList, isLoading } = useQuery<BankQuestionUsage[]>({
    queryKey: ["question-tests", questionId],
    queryFn: () => getBankQuestionTests(questionId),
    staleTime: 30_000,
  });

  if (isLoading) {
    return <p className="text-xs text-muted-foreground py-2 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Loading usage…</p>;
  }
  if (!usageList || usageList.length === 0) {
    return <p className="text-xs text-muted-foreground py-2">Not used in any test yet.</p>;
  }
  return (
    <ul className="space-y-1 py-1">
      {usageList.map((u) => (
        <li key={u.testId} className="flex items-center gap-2 text-xs text-muted-foreground">
          <ExternalLink className="w-3 h-3 shrink-0" />
          <span className="font-medium text-foreground">{u.testName}</span>
          <span>({u.testCategory})</span>
          <DifficultyBadge diff={u.testDifficulty} />
          <span className="ml-auto">{formatDate(u.addedAt)}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Question form modal ───────────────────────────────────────────────────────

interface QuestionFormModalProps {
  open: boolean;
  editing: BankQuestion | null;
  masterSections: MasterSection[];
  masterTopics: MasterTopic[];
  diSets: DiSet[];
  onClose: () => void;
  onSaved: () => void;
}

function QuestionFormModal({ open, editing, masterSections, masterTopics, diSets: diSetsList, onClose, onSaved }: QuestionFormModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState(blankForm());
  const [langTab, setLangTab] = useState<"en" | "hi" | "pa">("en");
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Sync form when editing changes
  useEffect(() => {
    if (editing) {
      setForm({
        text: editing.text,
        options: [...(editing.options as [string, string, string, string])] as [string, string, string, string],
        correct: editing.correct,
        section: editing.section,
        sectionId: editing.sectionId ?? "",
        globalTopicId: editing.globalTopicId,
        topic: editing.topic,
        explanation: editing.explanation,
        difficulty: editing.difficulty ?? "",
        textHi: editing.textHi ?? "",
        optionsHi: [...((editing.optionsHi as [string, string, string, string]) ?? ["", "", "", ""])] as [string, string, string, string],
        explanationHi: editing.explanationHi ?? "",
        textPa: editing.textPa ?? "",
        optionsPa: [...((editing.optionsPa as [string, string, string, string]) ?? ["", "", "", ""])] as [string, string, string, string],
        explanationPa: editing.explanationPa ?? "",
        imageUrl: editing.imageUrl ?? "",
        questionType: editing.questionType ?? "text",
        diSetId: editing.diSetId != null ? String(editing.diSetId) : "",
      });
    } else {
      setForm(blankForm());
    }
    setLangTab("en");
  }, [editing, open]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim() || !form.section || !form.globalTopicId || !form.explanation.trim()) {
      toast({ title: "Required fields missing", variant: "destructive" });
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (!form.options[i]?.trim()) {
        toast({ title: `Option ${i + 1} is empty`, variant: "destructive" });
        return;
      }
    }

    const payload = {
      text: form.text.trim(),
      options: form.options.map((o) => o.trim()) as [string, string, string, string],
      correct: form.correct,
      section: form.section,
      sectionId: form.sectionId || undefined,
      globalTopicId: form.globalTopicId,
      topic: form.topic || "General",
      explanation: form.explanation.trim(),
      difficulty: (form.difficulty || undefined) as QuestionDifficulty | undefined,
      textHi: form.textHi?.trim() || undefined,
      optionsHi: form.optionsHi.some((o) => o.trim())
        ? (form.optionsHi.map((o) => o.trim()) as [string, string, string, string])
        : undefined,
      explanationHi: form.explanationHi?.trim() || undefined,
      textPa: form.textPa?.trim() || undefined,
      optionsPa: form.optionsPa.some((o) => o.trim())
        ? (form.optionsPa.map((o) => o.trim()) as [string, string, string, string])
        : undefined,
      explanationPa: form.explanationPa?.trim() || undefined,
      imageUrl: form.imageUrl?.trim() || undefined,
      questionType: form.questionType || "text",
      diSetId: form.diSetId ? parseInt(form.diSetId, 10) : undefined,
    };

    setSaving(true);
    try {
      if (editing) {
        await updateBankQuestion(editing.id, payload);
        toast({ title: "Question updated" });
      } else {
        await createBankQuestion({ ...payload, testId: "" });
        toast({ title: "Question added to bank" });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast({ title: "Save failed", description: err?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const url = await uploadImageToStorage(file, "question-images");
      setForm((f) => ({ ...f, imageUrl: url, questionType: f.questionType === "text" ? "image" : f.questionType }));
      toast({ title: "Image uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message, variant: "destructive" });
    } finally {
      setImageUploading(false);
    }
  };

  const sectionTopics = masterTopics; // global topics, not section-scoped

  const optionKeys: [string, string, string, string] = ["A", "B", "C", "D"];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Question" : "Add Question to Bank"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          {/* Section + Topic + Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Section *</Label>
              <select
                className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.section}
                onChange={(e) => {
                  const sec = masterSections.find((s) => s.name === e.target.value);
                  setForm((f) => ({ ...f, section: e.target.value, sectionId: sec?.id ?? "" }));
                }}
                required
              >
                <option value="">Select section</option>
                {masterSections.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Topic *</Label>
              <select
                className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.globalTopicId}
                onChange={(e) => {
                  const t = sectionTopics.find((x) => x.id === e.target.value);
                  setForm((f) => ({ ...f, globalTopicId: e.target.value, topic: t?.name ?? "" }));
                }}
                required
              >
                <option value="">Select topic</option>
                {sectionTopics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <select
                className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.difficulty}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as QuestionDifficulty | "" }))}
              >
                <option value="">Not set</option>
                {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Question Type + DI Set + Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Question Type</Label>
              <select
                className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.questionType}
                onChange={(e) => setForm((f) => ({ ...f, questionType: e.target.value as "text" | "image" | "di" }))}
              >
                <option value="text">Text only</option>
                <option value="image">Image question</option>
                <option value="di">Data Interpretation (DI)</option>
              </select>
            </div>
            <div>
              <Label>DI Set</Label>
              <select
                className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.diSetId}
                onChange={(e) => setForm((f) => ({
                  ...f,
                  diSetId: e.target.value,
                  questionType: e.target.value ? "di" : f.questionType === "di" ? "text" : f.questionType,
                }))}
              >
                <option value="">None</option>
                {diSetsList.map((ds) => <option key={ds.id} value={String(ds.id)}>{ds.title}</option>)}
              </select>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <Label>Question Image (optional)</Label>
            <div className="mt-1 flex items-center gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={imageUploading}
                onClick={() => imageInputRef.current?.click()}
              >
                {imageUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <ImageIcon className="w-3.5 h-3.5 mr-1.5" />}
                {imageUploading ? "Uploading…" : "Upload image"}
              </Button>
              {form.imageUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setForm((f) => ({ ...f, imageUrl: "", questionType: f.questionType === "image" ? "text" : f.questionType }))}
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
              )}
            </div>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Question image preview"
                className="mt-2 max-h-40 rounded-md border border-border object-contain"
              />
            )}
          </div>

          {/* Language tabs */}
          <div className="flex gap-2 border-b border-border pb-1">
            {(["en", "hi", "pa"] as const).map((l) => (
              <button
                key={l}
                type="button"
                className={`text-xs px-3 py-1 rounded-t font-medium transition-colors ${
                  langTab === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setLangTab(l)}
              >
                {l === "en" ? "English" : l === "hi" ? "हिन्दी" : "ਪੰਜਾਬੀ"}
              </button>
            ))}
          </div>

          {/* Question text */}
          {langTab === "en" && (
            <div>
              <Label>Question Text *</Label>
              <textarea
                className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                required
              />
            </div>
          )}
          {langTab === "hi" && (
            <div>
              <Label>Question Text (Hindi)</Label>
              <textarea
                className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                value={form.textHi}
                onChange={(e) => setForm((f) => ({ ...f, textHi: e.target.value }))}
              />
            </div>
          )}
          {langTab === "pa" && (
            <div>
              <Label>Question Text (Punjabi)</Label>
              <textarea
                className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                value={form.textPa}
                onChange={(e) => setForm((f) => ({ ...f, textPa: e.target.value }))}
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-2">
            <Label>Options *</Label>
            {optionKeys.map((key, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={form.correct === i}
                  onChange={() => setForm((f) => ({ ...f, correct: i }))}
                  title={`Option ${key} is correct`}
                />
                <span className="text-xs font-bold text-muted-foreground w-4">{key}</span>
                <Input
                  value={
                    langTab === "en"
                      ? form.options[i]
                      : langTab === "hi"
                      ? form.optionsHi[i]
                      : form.optionsPa[i]
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (langTab === "en") {
                      const opts = [...form.options] as [string, string, string, string];
                      opts[i] = val;
                      setForm((f) => ({ ...f, options: opts }));
                    } else if (langTab === "hi") {
                      const opts = [...form.optionsHi] as [string, string, string, string];
                      opts[i] = val;
                      setForm((f) => ({ ...f, optionsHi: opts }));
                    } else {
                      const opts = [...form.optionsPa] as [string, string, string, string];
                      opts[i] = val;
                      setForm((f) => ({ ...f, optionsPa: opts }));
                    }
                  }}
                  placeholder={`Option ${key}${langTab === "en" ? " *" : ""}`}
                  className="flex-1 text-sm"
                />
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground">Select the radio button next to the correct answer.</p>
          </div>

          {/* Explanation */}
          <div>
            <Label>{langTab === "en" ? "Explanation *" : langTab === "hi" ? "Explanation (Hindi)" : "Explanation (Punjabi)"}</Label>
            <textarea
              className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px]"
              value={langTab === "en" ? form.explanation : langTab === "hi" ? form.explanationHi : form.explanationPa}
              onChange={(e) => {
                const val = e.target.value;
                if (langTab === "en") setForm((f) => ({ ...f, explanation: val }));
                else if (langTab === "hi") setForm((f) => ({ ...f, explanationHi: val }));
                else setForm((f) => ({ ...f, explanationPa: val }));
              }}
              required={langTab === "en"}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
              {editing ? "Save Changes" : "Add Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Add to Test modal ─────────────────────────────────────────────────────────

interface AddToTestModalProps {
  open: boolean;
  selectedIds: number[];
  onClose: () => void;
  onDone: () => void;
}

function AddToTestModal({ open, selectedIds, onClose, onDone }: AddToTestModalProps) {
  const { toast } = useToast();
  const [targetTestId, setTargetTestId] = useState("");
  const [adding, setAdding] = useState(false);
  const [result, setResult] = useState<{ added: number[]; alreadyPresent: number[] } | null>(null);

  type BackendTest = { id: string; name: string; category: string };
  const { data: tests = [] } = useQuery<BackendTest[]>({
    queryKey: ["all-tests-list"],
    queryFn: () => fetchBackendTests() as Promise<BackendTest[]>,
    staleTime: 60_000,
    enabled: open,
  });

  useEffect(() => {
    if (!open) {
      setTargetTestId("");
      setResult(null);
    }
  }, [open]);

  const handleAdd = async () => {
    if (!targetTestId || selectedIds.length === 0) return;
    setAdding(true);
    try {
      const res = await addQuestionsToTest(targetTestId, selectedIds);
      setResult({ added: res.added, alreadyPresent: res.alreadyPresent });
      if (res.added.length > 0) {
        toast({ title: `Added ${res.added.length} question(s) to test` });
      }
      if (res.alreadyPresent.length > 0) {
        toast({
          title: `${res.alreadyPresent.length} question(s) already in test`,
          description: "Duplicates were skipped.",
        });
      }
    } catch (err: any) {
      toast({ title: "Failed to add", description: err?.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add {selectedIds.length} Question{selectedIds.length !== 1 ? "s" : ""} to Test</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {result ? (
            <div className="space-y-2 text-sm">
              {result.added.length > 0 && (
                <p className="text-emerald-600 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> {result.added.length} question(s) added successfully.
                </p>
              )}
              {result.alreadyPresent.length > 0 && (
                <p className="text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> {result.alreadyPresent.length} question(s) were already in the test — skipped.
                </p>
              )}
              <Button className="w-full mt-2" onClick={() => { onDone(); onClose(); }}>Done</Button>
            </div>
          ) : (
            <>
              <div>
                <Label>Select Target Test</Label>
                <select
                  className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={targetTestId}
                  onChange={(e) => setTargetTestId(e.target.value)}
                >
                  <option value="">Choose a test…</option>
                  {tests.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} — {t.category}</option>
                  ))}
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleAdd} disabled={!targetTestId || adding}>
                  {adding ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                  Add to Test
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete confirm modal ───────────────────────────────────────────────────────

function DeleteModal({
  question,
  onConfirm,
  onClose,
}: {
  question: BankQuestion | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!question} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" /> Delete Question?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-1">
          {question?.usageCount && question.usageCount > 0
            ? `This question is used in ${question.usageCount} test(s). Remove it from all tests before deleting.`
            : `Delete "${truncate(question?.text ?? "", 60)}"? This cannot be undone.`}
        </p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {(!question?.usageCount || question.usageCount === 0) && (
            <Button variant="destructive" onClick={onConfirm}>Delete</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Import CSV modal ──────────────────────────────────────────────────────────

interface ImportBankCsvModalProps {
  open: boolean;
  masterSections: MasterSection[];
  masterTopics: MasterTopic[];
  onClose: () => void;
  onImported: () => void;
}

function ImportBankCsvModal({ open, masterSections, masterTopics, onClose, onImported }: ImportBankCsvModalProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [batchSection, setBatchSection] = useState("");
  const [batchTopic, setBatchTopic] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<BankCsvImportResult | null>(null);
  const [previewRows, setPreviewRows] = useState<string[][] | null>(null);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setBatchSection("");
      setBatchTopic("");
      setResult(null);
      setPreviewRows(null);
      setPreviewHeaders([]);
    }
  }, [open]);

  const handleFileChange = (f: File) => {
    setFile(f);
    setResult(null);
    // Quick client-side preview (first 5 data rows)
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? "";
      const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(Boolean);
      if (lines.length < 1) return;
      const parseLine = (l: string) => {
        const cells: string[] = [];
        let cur = "", inQ = false;
        for (let i = 0; i < l.length; i++) {
          const ch = l[i];
          if (ch === '"') { if (inQ && l[i+1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
          else if (ch === ',' && !inQ) { cells.push(cur.trim()); cur = ""; }
          else cur += ch;
        }
        cells.push(cur.trim());
        return cells;
      };
      const headers = parseLine(lines[0]);
      setPreviewHeaders(headers);
      setPreviewRows(lines.slice(1, 6).map(parseLine));
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    if (!file) { toast({ title: "Select a CSV file first", variant: "destructive" }); return; }
    setImporting(true);
    try {
      const res = await importBankQuestionsFromCsv(file, {
        section: batchSection || undefined,
        topic: batchTopic || undefined,
      });
      setResult(res);
      if (res.inserted > 0) {
        toast({ title: `Imported ${res.inserted} question${res.inserted !== 1 ? "s" : ""}` });
        onImported();
      }
    } catch (err: any) {
      toast({ title: "Import failed", description: err?.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "section", "topic", "difficulty",
      "question_en", "optionA_en", "optionB_en", "optionC_en", "optionD_en",
      "correct_option", "explanation_en",
      "question_hi", "optionA_hi", "optionB_hi", "optionC_hi", "optionD_hi", "explanation_hi",
      "question_pa", "optionA_pa", "optionB_pa", "optionC_pa", "optionD_pa", "explanation_pa",
    ];
    const example = [
      "Quantitative Aptitude", "Arithmetic", "Easy",
      "What is 2+2?", "3", "4", "5", "6",
      "B", "Because 2+2=4",
      "2+2 क्या है?", "3", "4", "5", "6", "क्योंकि 2+2=4",
      "2+2 ਕੀ ਹੈ?", "3", "4", "5", "6", "ਕਿਉਂਕਿ 2+2=4",
    ];
    const csv = [headers.join(","), example.map((v) => `"${v}"`).join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "question-bank-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const detectedLangs = (() => {
    if (!previewHeaders.length) return null;
    const h = previewHeaders.map((x) => x.toLowerCase());
    const langs: string[] = ["English"];
    if (h.some((c) => c.includes("_hi"))) langs.push("Hindi");
    if (h.some((c) => c.includes("_pa"))) langs.push("Punjabi");
    return langs;
  })();

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" /> Import Questions from CSV
          </DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-3 mt-2">
            <div className={`rounded-lg p-4 ${result.inserted > 0 ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800" : "bg-muted border border-border"}`}>
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Import complete: <span className="text-emerald-600">{result.inserted} inserted</span>
                {result.skipped > 0 && <span className="text-amber-600 ml-1">, {result.skipped} skipped</span>}
              </p>
              {detectedLangs && (
                <p className="text-xs text-muted-foreground mt-1">
                  Languages detected: {detectedLangs.join(", ")}
                </p>
              )}
            </div>
            {result.errors.length > 0 && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                <p className="text-xs font-semibold text-destructive mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {result.errors.length} row error{result.errors.length !== 1 ? "s" : ""}
                </p>
                <ul className="space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-muted-foreground">Row {e.row}: {e.reason}</li>
                  ))}
                </ul>
              </div>
            )}
            <DialogFooter>
              <Button onClick={onClose}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {/* Template download */}
            <div className="flex items-start gap-3 bg-muted/40 rounded-lg p-3">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  Download the template CSV. English columns are required; Hindi (
                  <span className="font-medium">_hi</span>) and Punjabi (
                  <span className="font-medium">_pa</span>) columns are optional — they are auto-detected.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={downloadTemplate}>
                <Download className="w-3.5 h-3.5 mr-1" /> Template
              </Button>
            </div>

            {/* Batch-level overrides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Default Section <span className="text-muted-foreground">(used when row has none)</span></Label>
                <select
                  className="mt-1 w-full h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={batchSection}
                  onChange={(e) => setBatchSection(e.target.value)}
                >
                  <option value="">— optional —</option>
                  {masterSections.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs">Default Topic <span className="text-muted-foreground">(used when row has none)</span></Label>
                <select
                  className="mt-1 w-full h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={batchTopic}
                  onChange={(e) => setBatchTopic(e.target.value)}
                >
                  <option value="">— optional —</option>
                  {masterTopics.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
            </div>

            {/* File picker */}
            <div>
              <Label className="text-xs mb-1 block">CSV File *</Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                    <button
                      type="button"
                      className="ml-2 text-muted-foreground hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewRows(null); setPreviewHeaders([]); }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <Upload className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click to select a CSV file</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileChange(f); e.target.value = ""; }}
              />
            </div>

            {/* Detected languages badge */}
            {detectedLangs && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Detected languages:</span>
                {detectedLangs.map((l) => (
                  <span key={l} className="text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{l}</span>
                ))}
              </div>
            )}

            {/* Preview table */}
            {previewRows && previewRows.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Preview (first {previewRows.length} rows)</p>
                <div className="overflow-x-auto rounded border border-border">
                  <table className="text-[11px] w-max min-w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        {previewHeaders.slice(0, 10).map((h, i) => (
                          <th key={i} className="px-2 py-1 text-left font-medium text-muted-foreground whitespace-nowrap border-r border-border last:border-0">{h}</th>
                        ))}
                        {previewHeaders.length > 10 && <th className="px-2 py-1 text-muted-foreground">+{previewHeaders.length - 10} more</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, ri) => (
                        <tr key={ri} className="border-t border-border">
                          {previewHeaders.slice(0, 10).map((_, ci) => (
                            <td key={ci} className="px-2 py-1 max-w-[120px] truncate border-r border-border last:border-0" title={row[ci]}>{row[ci] ?? ""}</td>
                          ))}
                          {previewHeaders.length > 10 && <td className="px-2 py-1 text-muted-foreground">…</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleImport} disabled={!file || importing}>
                {importing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                Import
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main QuestionBankTab component ────────────────────────────────────────────

export default function QuestionBankTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<QuestionDifficulty | "">("");
  const debouncedSearch = useDebounce(searchInput);

  // Pagination
  const [page, setPage] = useState(1);

  // Row expansion
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<BankQuestion | null>(null);
  const [showAddToTest, setShowAddToTest] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Master data
  const { data: masterSections = [] } = useQuery<MasterSection[]>({
    queryKey: ["master-sections"],
    queryFn: getSections,
    staleTime: Infinity,
  });
  const { data: masterTopics = [] } = useQuery<MasterTopic[]>({
    queryKey: ["master-topics"],
    queryFn: getAllTopics,
    staleTime: 0,
  });
  const { data: diSetsData = [] } = useQuery<DiSet[]>({
    queryKey: ["di-sets"],
    queryFn: getDiSets,
    staleTime: 0,
  });

  // Question bank data
  const bankKey = ["question-bank", page, PAGE_SIZE, debouncedSearch, filterSection, filterTopic, filterDifficulty];
  const { data: bankPage, isLoading, isFetching } = useQuery({
    queryKey: bankKey,
    queryFn: () =>
      getQuestionBank({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        section: filterSection || undefined,
        topic: filterTopic || undefined,
        difficulty: (filterDifficulty || undefined) as QuestionDifficulty | undefined,
      }),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterSection, filterTopic, filterDifficulty]);

  // Reset selection on page change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, debouncedSearch, filterSection, filterTopic, filterDifficulty]);

  const invalidateBank = () => queryClient.invalidateQueries({ queryKey: ["question-bank"] });

  const handleDelete = async () => {
    if (!deletingQuestion) return;
    try {
      await deleteBankQuestion(deletingQuestion.id);
      toast({ title: "Question deleted", variant: "destructive" });
      invalidateBank();
      setDeletingQuestion(null);
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.message, variant: "destructive" });
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allIds = (bankPage?.items ?? []).map((q) => q.id);
    if (allIds.every((id) => selectedIds.has(id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const items = bankPage?.items ?? [];
  const total = bankPage?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allSelected = items.length > 0 && items.every((q) => selectedIds.has(q.id));

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Question Bank
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {total.toLocaleString()} question{total !== 1 ? "s" : ""} in bank
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddToTest(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add {selectedIds.size} to Test
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowImport(true)}
          >
            <Upload className="w-3.5 h-3.5 mr-1" /> Import CSV
          </Button>
          <Button
            size="sm"
            onClick={() => { setEditingQuestion(null); setShowForm(true); }}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Question
          </Button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-card/85 border border-border/70 rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              className="pl-8 text-sm h-9"
              placeholder="Search questions…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setSearchInput("")}>
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <select
            className="px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring h-9"
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
          >
            <option value="">All Sections</option>
            {masterSections.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select
            className="px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring h-9"
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
          >
            <option value="">All Topics</option>
            {masterTopics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select
            className="px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring h-9"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value as QuestionDifficulty | "")}
          >
            <option value="">All Difficulties</option>
            {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-card/85 border border-border/70 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading questions…
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No questions found. {(debouncedSearch || filterSection || filterTopic || filterDifficulty) && "Try clearing filters."}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-3 px-4 py-2 border-b border-border/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="rounded"
                title="Select all"
              />
              <span>Question</span>
              <span className="text-right">Topic</span>
              <span className="text-right">Difficulty</span>
              <span className="text-right">Used in</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            <div className={`divide-y divide-border/40 ${isFetching && !isLoading ? "opacity-70 transition-opacity" : ""}`}>
              {items.map((q) => (
                <div key={q.id}>
                  {/* Main row */}
                  <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-1 pt-0.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(q.id)}
                        onChange={() => toggleSelect(q.id)}
                        className="rounded"
                      />
                      <button
                        onClick={() => toggleExpand(q.id)}
                        className="text-muted-foreground hover:text-foreground"
                        title={expandedIds.has(q.id) ? "Collapse" : "Expand"}
                      >
                        {expandedIds.has(q.id) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-foreground leading-snug">{truncate(q.text)}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{q.section} • ID {q.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">{q.topic}</span>
                    </div>
                    <div className="text-right">
                      <DifficultyBadge diff={q.difficulty} />
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => { setExpandedIds((prev) => { const n = new Set(prev); n.add(q.id); return n; }); }}
                        className="text-xs text-primary hover:underline tabular-nums"
                        title="See tests"
                      >
                        {q.usageCount} test{q.usageCount !== 1 ? "s" : ""}
                      </button>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-primary hover:text-primary"
                        onClick={() => { setEditingQuestion(q); setShowForm(true); }}
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeletingQuestion(q)}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded row */}
                  {expandedIds.has(q.id) && (
                    <div className="px-12 py-3 bg-muted/20 border-t border-border/40 space-y-3">
                      {/* Full question */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">Full Question</p>
                        <p className="text-sm text-foreground">{q.text}</p>
                        <div className="mt-2 grid grid-cols-2 gap-1">
                          {(q.options as string[]).map((opt, i) => (
                            <div
                              key={i}
                              className={`text-xs px-2 py-1 rounded ${
                                i === q.correct
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium"
                                  : "bg-muted/60 text-muted-foreground"
                              }`}
                            >
                              {String.fromCharCode(65 + i)}. {opt}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="mt-2 text-xs text-muted-foreground italic">
                            <span className="font-medium not-italic text-foreground">Explanation: </span>
                            {q.explanation}
                          </p>
                        )}
                      </div>

                      {/* Tests using this question */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                          Tests using this question ({q.usageCount})
                        </p>
                        <QuestionTestList questionId={q.id} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 text-xs text-muted-foreground">
                <span>
                  {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ‹ Prev
                  </Button>
                  <span className="px-2 py-1 bg-primary/10 rounded text-primary font-medium">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next ›
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      <QuestionFormModal
        open={showForm}
        editing={editingQuestion}
        masterSections={masterSections}
        masterTopics={masterTopics}
        diSets={diSetsData}
        onClose={() => { setShowForm(false); setEditingQuestion(null); }}
        onSaved={invalidateBank}
      />

      <AddToTestModal
        open={showAddToTest}
        selectedIds={[...selectedIds]}
        onClose={() => setShowAddToTest(false)}
        onDone={() => setSelectedIds(new Set())}
      />

      <ImportBankCsvModal
        open={showImport}
        masterSections={masterSections}
        masterTopics={masterTopics}
        onClose={() => setShowImport(false)}
        onImported={invalidateBank}
      />

      <DeleteModal
        question={deletingQuestion}
        onConfirm={handleDelete}
        onClose={() => setDeletingQuestion(null)}
      />
    </div>
  );
}
