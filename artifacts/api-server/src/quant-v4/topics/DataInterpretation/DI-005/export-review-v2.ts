import { writeFileSync } from "node:fs";
import { generateDi005V2Set, DI005_V2_TASK_KINDS } from "./pie-set-v2";
import type { Di005V2ExamProfile, Di005V2QuestionSet } from "./pie-v2-types";

function selectReviewSets(): Di005V2QuestionSet[] {
  const uncovered = new Set(DI005_V2_TASK_KINDS);
  const selected: Di005V2QuestionSet[] = [];
  for (let index = 1; index <= 200 && (uncovered.size > 0 || selected.length < 6); index += 1) {
    const profile: Di005V2ExamProfile = index % 2 === 0 ? "BANKING_PRELIMS" : "SSC_CGL_TIER_I";
    const set = generateDi005V2Set({ seed: `DI005-V2-REVIEW-${String(index).padStart(3, "0")}`, examProfile: profile });
    const introduces = set.questions.some((question) => uncovered.has(question.kind));
    if (introduces || selected.length < 2) {
      selected.push(set);
      set.questions.forEach((question) => uncovered.delete(question.kind));
    }
  }
  if (uncovered.size > 0) throw new Error(`DI-005 V2 review export did not cover: ${[...uncovered].join(", ")}`);
  return selected;
}

function table(set: Di005V2QuestionSet) {
  const lines = ["| Category | Pie label | Actual share | Angle |", "|---|---:|---:|---:|"];
  for (const slice of set.stimulus.slices) {
    lines.push(`| ${slice.category} | ${slice.displayPercent === "?" ? "?" : `${slice.displayPercent}%`} | ${slice.percent}% | ${slice.angleDegrees}° |`);
  }
  return lines.join("\n");
}

function questionBlock(set: Di005V2QuestionSet, questionIndex: number) {
  const q = set.questions[questionIndex]!;
  const optionLines = q.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join("\n");
  const explanation = q.explanation.steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  return [
    `### Q${questionIndex + 1} — ${q.kind} · ${q.difficulty} · ${q.stemSurfaceId}`,
    "",
    q.stem,
    "",
    optionLines,
    "",
    `**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.answer}`,
    "",
    `**Explanation:** ${q.explanation.keyIdea}`,
    explanation,
    "",
  ].join("\n");
}

const sets = selectReviewSets();
const output = process.argv[2] ?? "DI-005-REVIEW-V2.md";
const familyCoverage = new Set(sets.flatMap((set) => set.questions.map((question) => question.kind)));
const lines: string[] = [
  "# DI-005 Pie Chart — V2 Review Pack",
  "",
  "> Review-only. Not registered in Question Studio, Question Bank, tests, mocks or public/student delivery.",
  "",
  `- Review sets: ${sets.length}`,
  `- Questions: ${sets.length * 5}`,
  `- Task families covered: ${familyCoverage.size}/${DI005_V2_TASK_KINDS.length}`,
  "- Per-set difficulty: 1 Easy + 2 Medium + 2 Hard",
  "- Profiles: SSC CGL Tier I (4 options) and Banking Prelims (5 options)",
  "- Stimulus architecture: semantic pie data only; visual rendering is presentation-only",
  "",
];

sets.forEach((set, setIndex) => {
  lines.push(`## Set ${setIndex + 1} — ${set.examProfile}`);
  lines.push("");
  lines.push(`**${set.stimulus.title}**`);
  lines.push("");
  lines.push(`${set.stimulus.totalLabel}: **${set.stimulus.totalValue} ${set.stimulus.unit}**`);
  lines.push("");
  lines.push(set.stimulus.instruction);
  lines.push("");
  lines.push(table(set));
  lines.push("");
  set.questions.forEach((_, questionIndex) => lines.push(questionBlock(set, questionIndex)));
});

writeFileSync(output, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ status: "PASS_DI_005_REVIEW_V2_MD", output, sets: sets.length, questions: sets.length * 5, taskFamilies: familyCoverage.size }));
