import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateDi007V2ReviewSet } from "./missing-set-v2";
import type { Di007V2QuestionSet, Di007V2TaskKind } from "./missing-v2-types";

const OUTPUT = resolve(process.cwd(), process.argv[2] || "DI-007-REVIEW-V2.md");
const ALL_TASKS: readonly Di007V2TaskKind[] = [
  "VISIBLE_ROW_COMBINED_TOTAL",
  "VISIBLE_ROW_DIFFERENCE",
  "RECOVER_MISSING_VALUE",
  "HIDDEN_ROW_COMBINED_TOTAL",
  "MISSING_TO_PAIRED_RATIO",
  "B_TOTAL_AS_PERCENT_OF_A_TOTAL",
  "MISSING_SHARE_OF_B_TOTAL",
  "VISIBLE_TWO_ROW_B_TOTAL",
  "MISSING_AS_PERCENT_OF_PAIRED_A",
  "COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL",
  "HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS",
  "HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO",
];

function score(set: Di007V2QuestionSet, uncovered: Set<Di007V2TaskKind>) {
  return set.questions.filter((question) => uncovered.has(question.kind)).length;
}

function chooseReviewSets() {
  const uncovered = new Set<Di007V2TaskKind>(ALL_TASKS);
  const selected: Di007V2QuestionSet[] = [];
  const used = new Set<string>();

  for (let round = 0; round < 6 && uncovered.size; round += 1) {
    let best: Di007V2QuestionSet | undefined;
    let bestScore = -1;
    for (let index = 1; index <= 500; index += 1) {
      const profile = (index + round) % 2 === 0 ? "BANKING_PRELIMS" as const : "BANKING_MAINS" as const;
      const seed = "DI-007-V2-REVIEW-" + String(round + 1) + "-" + String(index);
      if (used.has(seed)) continue;
      const candidate = generateDi007V2ReviewSet({ seed, examProfile: profile });
      const candidateScore = score(candidate, uncovered);
      if (candidateScore > bestScore) {
        best = candidate;
        bestScore = candidateScore;
      }
      if (candidateScore >= Math.min(5, uncovered.size)) break;
    }
    if (!best || bestScore <= 0) break;
    selected.push(best);
    used.add(best.seed);
    for (const question of best.questions) uncovered.delete(question.kind);
  }

  if (uncovered.size) throw new Error("Review exporter failed to cover task families: " + [...uncovered].join(", "));
  return selected;
}

function table(set: Di007V2QuestionSet) {
  const s = set.stimulus;
  const rows = [
    "| " + s.rowLabel + " | " + s.seriesALabel + " | " + s.seriesBLabel + " |",
    "|---|---:|---:|",
    ...s.points.map((point) => "| " + point.label + " | " + String(point.seriesA) + " | " + String(point.displaySeriesB) + " |"),
  ];
  return rows.join("\n");
}

const sets = chooseReviewSets();
const taskCoverage = new Set(sets.flatMap((set) => set.questions.map((question) => question.kind)));
const lines: string[] = [
  "# DI-007 — Missing Data Interpretation V2 Review",
  "",
  "Status: ENGLISH_REVIEW_APPROVED · DIFFICULTY-FLOOR CORRECTION REVIEW",
  "",
  "Review sets: " + String(sets.length),
  "Questions: " + String(sets.reduce((sum, set) => sum + set.questions.length, 0)),
  "Task families covered: " + String(taskCoverage.size) + "/" + String(ALL_TASKS.length),
  "",
  "Each set contains exactly 1 Easy + 2 Medium + 2 Hard questions.",
  "",
];

let questionNumber = 1;
sets.forEach((set, setIndex) => {
  lines.push("---", "", "## Set " + String(setIndex + 1) + " — " + set.examProfile, "");
  lines.push("**Context:** " + set.stimulus.contextId, "");
  lines.push(set.stimulus.title, "");
  lines.push(set.stimulus.instruction, "");
  lines.push(table(set), "");

  set.questions.forEach((question) => {
    lines.push("### Q" + String(questionNumber) + ". [" + question.difficulty + "] " + question.kind, "");
    lines.push(question.stem, "");
    question.options.forEach((option, index) => lines.push(String.fromCharCode(65 + index) + ". " + option));
    lines.push("");
    lines.push("**Answer:** " + String.fromCharCode(65 + question.correctIndex) + ". " + question.answer, "");
    lines.push("**Explanation:** " + question.explanation.keyIdea, "");
    question.explanation.steps.forEach((step, index) => lines.push(String(index + 1) + ". " + step));
    lines.push("");
    questionNumber += 1;
  });
});

lines.push("---", "", "## Review checklist", "");
lines.push("- Missing-table condition is understandable without internal terminology.");
lines.push("- Context labels read naturally for banking-exam DI.");
lines.push("- Every Easy question requires arithmetic; zero-operation direct lookup is not allowed. Hard questions require missing-value recovery plus another operation.");
lines.push("- Distractors are plausible and not absurd numerical fillers.");
lines.push("- Explanations are simple, worked and question-specific.");
lines.push("- No forced shortcut/trap boilerplate appears.");
lines.push("- Five options remain unique for both Banking Prelims and Banking Mains.");
lines.push("");

await writeFile(OUTPUT, lines.join("\n") + "\n", "utf8");
console.log(JSON.stringify({ output: OUTPUT, sets: sets.length, questions: questionNumber - 1, taskFamilies: taskCoverage.size }));
