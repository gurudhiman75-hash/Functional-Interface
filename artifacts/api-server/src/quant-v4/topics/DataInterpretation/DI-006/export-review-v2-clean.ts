import { writeFileSync } from "node:fs";
import { DI006_V2_TASK_KINDS, generateDi006V2Set } from "./caselet-set-v2";
import type { Di006V2ExamProfile, Di006V2QuestionSet } from "./caselet-v2-types";

function selectReviewSets(): Di006V2QuestionSet[] {
  const uncovered = new Set(DI006_V2_TASK_KINDS);
  const selected: Di006V2QuestionSet[] = [];

  for (let index = 1; index <= 240 && (uncovered.size > 0 || selected.length < 6); index += 1) {
    const profile: Di006V2ExamProfile = index % 2 === 0 ? "BANKING_PRELIMS" : "SSC_CGL_TIER_I";
    const set = generateDi006V2Set({
      seed: "DI006-V2-REVIEW-" + String(index).padStart(3, "0"),
      examProfile: profile,
    });
    const introduces = set.questions.some((question) => uncovered.has(question.kind));
    if (introduces || selected.length < 2) {
      selected.push(set);
      set.questions.forEach((question) => uncovered.delete(question.kind));
    }
  }

  if (uncovered.size > 0) throw new Error("DI-006 V2 review export did not cover: " + [...uncovered].join(", "));
  return selected;
}

function questionBlock(set: Di006V2QuestionSet, questionIndex: number) {
  const q = set.questions[questionIndex]!;
  const options = q.options.map((option, index) => String.fromCharCode(65 + index) + ". " + option).join("\n");
  const steps = q.explanation.steps.map((step, index) => String(index + 1) + ". " + step).join("\n");
  return [
    "### Q" + String(questionIndex + 1) + " — " + q.kind + " · " + q.difficulty + " · " + q.stemSurfaceId,
    "",
    q.stem,
    "",
    options,
    "",
    "**Answer:** " + String.fromCharCode(65 + q.correctIndex) + ". " + q.answer,
    "",
    "**Explanation:** " + q.explanation.keyIdea,
    steps,
    "",
  ].join("\n");
}

const sets = selectReviewSets();
const output = process.argv[2] ?? "DI-006-REVIEW-V2.md";
const coverage = new Set(sets.flatMap((set) => set.questions.map((question) => question.kind)));
const lines: string[] = [
  "# DI-006 Caselet — V2 Review Pack",
  "",
  "> Review-only. No permanent QLs, Question Studio discovery, Question Bank writes, test/mock eligibility or public delivery.",
  "",
  "- Review sets: " + sets.length,
  "- Questions: " + sets.length * 5,
  "- Task families covered: " + coverage.size + "/" + DI006_V2_TASK_KINDS.length,
  "- Per-set difficulty: 1 Easy + 2 Medium + 2 Hard",
  "- Profiles: SSC CGL Tier I (4 options) and Banking Prelims (5 options)",
  "- Context/topology variety is shown with every set.",
  "",
];

sets.forEach((set, setIndex) => {
  lines.push("## Set " + String(setIndex + 1) + " — " + set.examProfile);
  lines.push("");
  lines.push("**" + set.stimulus.title + "**");
  lines.push("");
  lines.push("**Context:** " + set.stimulus.contextId + " · **Topology:** " + set.stimulus.topologyId);
  lines.push("");
  lines.push(set.stimulus.learnerText);
  lines.push("");
  set.questions.forEach((_, questionIndex) => lines.push(questionBlock(set, questionIndex)));
});

writeFileSync(output, lines.join("\n") + "\n", "utf8");
console.log(JSON.stringify({
  status: "PASS_DI_006_REVIEW_V2_MD",
  output,
  sets: sets.length,
  questions: sets.length * 5,
  taskFamilies: coverage.size,
}));
