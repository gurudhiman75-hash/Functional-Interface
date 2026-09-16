import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SCI_PHYSICS_EXHAUSTIVE_CP_META_V2 } from "./sci-physics-exhaustive-domain-v2";
import {
  auditPhysicsExhaustiveV2,
  generatePhysicsExhaustiveCpV2,
  type PhysicsExhaustiveQuestionV2,
} from "./sci-physics-exhaustive-generator-v2";

const audit = auditPhysicsExhaustiveV2();
if (!audit.valid) throw new Error(audit.errors.join("; "));
const LETTERS = ["A", "B", "C", "D"] as const;

function renderQuestion(question: PhysicsExhaustiveQuestionV2): string[] {
  return [
    `### ${question.questionId} · ${question.difficulty} · ${question.family}`,
    "", question.stem, "",
    ...question.options.map((option, index) => `${LETTERS[index]}. ${option}`),
    "", `**Answer:** ${LETTERS[question.correctIndex]}. ${question.canonicalAnswer}`,
    "", `**Explanation:** ${question.explanation}`, "",
  ];
}

const lines: string[] = [
  "# SCI Physics Exhaustive V2 — Coverage & Review", "",
  "Status: **REVIEW-ONLY CANDIDATE V2**", "",
  "This artifact reviews every curated semantic anchor plus representative composition questions. It does not print all 3,480 generated questions.", "",
  "## Capacity audit", "",
  `- Total semantic capacity: **${audit.totalQuestions.toLocaleString()} questions**`,
  "- Per CP: **348 semantic questions**",
  "- Per CP composition: **24 direct + 24 correct-statement + 24 incorrect-statement + 276 unique two-anchor compositions**",
  "- Correct-option positions per CP: **A87 / B87 / C87 / D87**",
  "- Option shuffles and wording-only permutations are not counted as semantic capacity.",
  "- Default 60-question delivery mix: 24 direct + 12 correct-statement + 12 incorrect-statement + 12 two-statement.",
  "- Lifecycle: review-only; runtime registration remains disabled.", "",
];

for (const meta of SCI_PHYSICS_EXHAUSTIVE_CP_META_V2) {
  const questions = generatePhysicsExhaustiveCpV2(meta.cpId);
  const direct = questions.filter((q) => q.family === "direct-anchor");
  const correctStatement = questions.filter((q) => q.family === "correct-statement");
  const incorrectStatement = questions.filter((q) => q.family === "incorrect-statement");
  const pairs = questions.filter((q) => q.family === "two-statement-composition");
  lines.push(`# ${meta.cpId} — ${meta.title}`, "");
  lines.push(
    `Coverage anchors: **${meta.anchors.length}** · Microtopics: **${audit.cpTopicCounts[meta.cpId]}** · Semantic capacity: **${audit.cpCounts[meta.cpId]}**`,
    "", "## Curated anchor review", "",
  );
  direct.forEach((question) => lines.push(...renderQuestion(question)));
  lines.push("## Other family samples", "");
  [0, 7, 15, 23].forEach((index) => lines.push(...renderQuestion(correctStatement[index])));
  [0, 7, 15, 23].forEach((index) => lines.push(...renderQuestion(incorrectStatement[index])));
  [0, 31, 74, 119, 177, 233].forEach((index) => lines.push(...renderQuestion(pairs[index])));
}

const outDir = join(process.cwd(), "dist", "science-review", "SCI-PHYSICS-EXHAUSTIVE-V2");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "SCI-PHYSICS-EXHAUSTIVE-V2-REVIEW.md");
writeFileSync(outFile, `${lines.join("\n")}\n`, "utf8");
console.log(outFile);
