/**
 * AssignFromBankDialog
 * Opens a searchable, filterable view of the Question Bank so an admin can
 * pick questions and assign them to a specific test.
 *
 * - Already-assigned questions are shown greyed out with a checkmark
 * - Duplicate detection is handled both client-side (UI) and server-side
 * - Paginated (20 per page), filters: search text, section, difficulty
 */

import { useState, useEffect, useCallback } from "react";
import { Search, X, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getQuestionBank,
  addQuestionsToTest,
  getTest,
  getSections,
  getDiSets,
  type BankQuestion,
  type QuestionDifficulty,
  type MasterSection,
  type DiSet,
} from "@/lib/data";

// ── helpers ───────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const DIFFICULTY_COLORS: Record<QuestionDifficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function truncate(text: string, max = 100) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

const PAGE_SIZE = 20;

// ── component ─────────────────────────────────────────────────────────────────

interface Props {
  testId: string;
  testName: string;
  open: boolean;
  onClose: () => void;
  /** Called after a successful add so parent can refresh question counts */
  onAdded?: (count: number) => void;
}

export default function AssignFromBankDialog({ testId, testName, open, onClose, onAdded }: Props) {
  const { toast } = useToast();

  // ── filter state ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionDifficulty | "">("");
  const [diSetFilter, setDiSetFilter] = useState<string>("");
  const debouncedSearch = useDebounce(search);

  // ── pagination ─────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);

  // ── data ───────────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // IDs of questions already assigned to this test
  const [existingIds, setExistingIds] = useState<Set<number>>(new Set());
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Master sections for filter dropdown
  const [sections, setSections] = useState<MasterSection[]>([]);
  const [diSets, setDiSets] = useState<DiSet[]>([]);

  // ── selection ──────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // ── submitting ─────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  // ── load existing question IDs ─────────────────────────────────────────────
  useEffect(() => {
    if (!open || !testId) return;
    setLoadingExisting(true);
    getTest(testId)
      .then((test) => {
        const ids = new Set<number>(
          (test.sections ?? []).flatMap((s) => (s.questions ?? []).map((q) => q.id))
        );
        setExistingIds(ids);
      })
      .catch(() => setExistingIds(new Set()))
      .finally(() => setLoadingExisting(false));
  }, [open, testId]);

  // ── load master sections ───────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    getSections().then(setSections).catch(() => setSections([]));
    getDiSets().then(setDiSets).catch(() => setDiSets([]));
  }, [open]);

  // ── load bank questions ────────────────────────────────────────────────────
  const loadQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const result = await getQuestionBank({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        section: sectionFilter || undefined,
        difficulty: difficultyFilter || undefined,
        diSetId: diSetFilter ? parseInt(diSetFilter, 10) : undefined,
      });
      setQuestions(result.items);
      setTotal(result.total);
    } catch {
      toast({ title: "Failed to load question bank", variant: "destructive" });
    } finally {
      setLoadingQuestions(false);
    }
  }, [page, debouncedSearch, sectionFilter, difficultyFilter, diSetFilter, toast]);

  useEffect(() => {
    if (open) loadQuestions();
  }, [open, loadQuestions]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sectionFilter, difficultyFilter, diSetFilter]);

  // ── reset when dialog closes ───────────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      setSelected(new Set());
      setSearch("");
      setSectionFilter("");
      setDifficultyFilter("");
      setDiSetFilter("");
      setPage(1);
    }
  }, [open]);

  // ── selection helpers ──────────────────────────────────────────────────────
  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectPage() {
    const assignable = questions.filter((q) => !existingIds.has(q.id)).map((q) => q.id);
    const allSelected = assignable.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        assignable.forEach((id) => next.delete(id));
      } else {
        assignable.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  // ── submit ─────────────────────────────────────────────────────────────────
  async function handleAdd() {
    if (selected.size === 0) return;
    setSubmitting(true);
    try {
      const result = await addQuestionsToTest(testId, [...selected]);
      toast({
        title: `${result.added.length} question${result.added.length !== 1 ? "s" : ""} added`,
        description:
          result.alreadyPresent.length > 0
            ? `${result.alreadyPresent.length} already in test (skipped)`
            : undefined,
      });
      // Update existingIds so UI reflects new state without re-fetching test
      setExistingIds((prev) => {
        const next = new Set(prev);
        result.added.forEach((id) => next.add(id));
        return next;
      });
      setSelected(new Set());
      onAdded?.(result.added.length);
    } catch {
      toast({ title: "Failed to add questions", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const assignableOnPage = questions.filter((q) => !existingIds.has(q.id)).map((q) => q.id);
  const allPageSelected = assignableOnPage.length > 0 && assignableOnPage.every((id) => selected.has(id));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0">
          <DialogTitle className="text-base font-semibold">
            Assign from Question Bank
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Assigning to: <span className="font-medium text-foreground">{testName}</span>
          </p>
        </DialogHeader>

        {/* ── Filters ── */}
        <div className="px-6 py-3 flex flex-wrap gap-2 border-b border-border shrink-0">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search questions…"
              className="pl-8 h-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch("")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <select
            className="h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            <option value="">All sections</option>
            {sections.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
          <select
            className="h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as QuestionDifficulty | "")}
          >
            <option value="">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            className="h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={diSetFilter}
            onChange={(e) => setDiSetFilter(e.target.value)}
          >
            <option value="">All DI Sets</option>
            {diSets.map((ds) => (
              <option key={ds.id} value={String(ds.id)}>{`#${ds.id} ${ds.title}`}</option>
            ))}
          </select>
        </div>

        {/* ── Table ── */}
        <div className="overflow-y-auto flex-1 px-0">
          {loadingQuestions || loadingExisting ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : questions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">No questions found</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="w-10 px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={allPageSelected}
                      onChange={toggleSelectPage}
                      title="Select all on this page"
                    />
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Question</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground w-24">Section</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground w-20">Difficulty</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground w-16">Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.map((q) => {
                  const inTest = existingIds.has(q.id);
                  const isSelected = selected.has(q.id);
                  return (
                    <tr
                      key={q.id}
                      className={`cursor-pointer transition-colors ${
                        inTest
                          ? "opacity-50 cursor-not-allowed bg-muted/20"
                          : isSelected
                          ? "bg-primary/5 hover:bg-primary/10"
                          : "hover:bg-muted/40"
                      }`}
                      onClick={() => !inTest && toggleSelect(q.id)}
                    >
                      <td className="px-4 py-2.5">
                        {inTest ? (
                          <span title="Already in test" className="inline-flex">
                            <Check className="w-4 h-4 text-emerald-500" />
                          </span>
                        ) : (
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={isSelected}
                            onChange={() => toggleSelect(q.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-foreground">
                        {truncate(q.text ?? "")}
                        {inTest && (
                          <span className="ml-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            IN TEST
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">{q.section}</td>
                      <td className="px-3 py-2.5">
                        {q.difficulty ? (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[q.difficulty]}`}>
                            {q.difficulty}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{q.usageCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="px-6 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <span>
              Page {page} of {totalPages} · {total} total
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {selected.size > 0 ? `${selected.size} selected` : "Select questions to add"}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={selected.size === 0 || submitting}
              onClick={handleAdd}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Adding…
                </>
              ) : (
                `Add ${selected.size > 0 ? selected.size : ""} to Test`
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
