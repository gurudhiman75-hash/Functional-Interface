import { MAL_CP001_PERMANENT_ALLOCATION } from "./foundation/cp001-permanent-allocation";
import { MAL_CP002_PERMANENT_ALLOCATION } from "./foundation/cp002-permanent-runtime";
import { MAL_CP003_PERMANENT_ALLOCATION } from "./foundation/cp003-permanent-runtime";
import { MAL_CP004_PERMANENT_ALLOCATION } from "./foundation/cp004-permanent-runtime";
import { MAL_CP005_RELEASE_ALLOCATION } from "./foundation/cp005-permanent-runtime-v1";
import {
  MAL_CP006_REVIEW_ALLOCATION,
  runMalCp006EnglishReviewPipeline,
} from "./foundation/cp006-permanent-review-runtime-v1";
import { runMal001QuestionStudioPipeline } from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? [...value]
    : [];
}

function visibleLines(question: any): string[] {
  const explanation = question.explanation;
  if (Array.isArray(explanation)) return stringArray(explanation);
  if (!explanation || typeof explanation !== "object") return [];
  const visible = stringArray(explanation.visibleLines);
  if (visible.length > 0) return visible;
  const lines = stringArray(explanation.lines);
  if (lines.length > 0) return lines;
  return stringArray(explanation.steps);
}

function count(value: string, token: string): number {
  return value.split(token).length - 1;
}

function assertMathWellFormed(qlId: string, seed: string, line: string): void {
  if (line.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:")) return;
  assert(
    count(line, "{") === count(line, "}"),
    `${qlId}/${seed}: unbalanced MathJax braces in '${line}'.`,
  );
  assert(
    count(line, "\\[") === count(line, "\\]"),
    `${qlId}/${seed}: unbalanced display-MathJax delimiters in '${line}'.`,
  );
  assert(
    count(line, "\\(") === count(line, "\\)"),
    `${qlId}/${seed}: unbalanced inline-MathJax delimiters in '${line}'.`,
  );
  assert(
    !/\\frac\{[^{}]*\{\\,\\text\{(?:kg|litres?)\}\}\{/u.test(line),
    `${qlId}/${seed}: malformed unit embedded inside a fraction numerator.`,
  );
}

const CP001_ALLIGATION_PRIMARY = new Set([
  "MAL-QL-001",
  "MAL-QL-005",
  "MAL-QL-006",
  "MAL-QL-007",
  "MAL-QL-009",
  "MAL-QL-010",
]);

const allocations = [
  ...MAL_CP001_PERMANENT_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-001" as const, qlId: entry.qlId })),
  ...MAL_CP002_PERMANENT_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-002" as const, qlId: entry.qlId })),
  ...MAL_CP003_PERMANENT_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-003" as const, qlId: entry.qlId })),
  ...MAL_CP004_PERMANENT_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-004" as const, qlId: entry.qlId })),
  ...MAL_CP005_RELEASE_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-005" as const, qlId: entry.qlId })),
  ...MAL_CP006_REVIEW_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-006" as const, qlId: entry.qlId })),
];

assert(allocations.length === 67, `Expected 67 QLs, received ${allocations.length}.`);

const forbiddenClutter = [
  /Core Concept/i,
  /Method\s*1/i,
  /Method\s*2/i,
  /Step-by-Step Solution/i,
  /Quick check\s*:/i,
  /Final answer\s*:/i,
  /10-Second Exam Shortcut/i,
  /Common Trap/i,
  /Mistake Warning/i,
];

let generated = 0;
let mathSurfaceChecks = 0;
let alligationPrimaryChecks = 0;
let selectiveCp004AlligationChecks = 0;
const samplesPerQl = 20;
const maxVisibleLines = 4;

for (const allocation of allocations) {
  for (let index = 0; index < samplesPerQl; index += 1) {
    const seed = `mal-001-compact-explanation:${allocation.qlId}:${index}`;
    const question = allocation.cpId === "MAL-CP-006"
      ? runMalCp006EnglishReviewPipeline({
          questionLanguageId: allocation.qlId as never,
          seed,
          language: "en",
        })
      : runMal001QuestionStudioPipeline(allocation.cpId, {
          questionLanguageId: allocation.qlId,
          seed,
          language: "en",
        });

    const lines = visibleLines(question);
    assert(lines.length >= 1, `${allocation.qlId}/${seed}: no learner-visible explanation.`);
    assert(
      lines.length <= maxVisibleLines,
      `${allocation.qlId}/${seed}: ${lines.length} visible lines exceeds compact limit ${maxVisibleLines}.`,
    );

    const learnerExplanation = lines.join("\n");
    for (const pattern of forbiddenClutter) {
      assert(
        !pattern.test(learnerExplanation),
        `${allocation.qlId}/${seed}: learner explanation contains clutter ${pattern}.`,
      );
    }
    for (const line of lines) {
      assertMathWellFormed(allocation.qlId, seed, line);
      mathSurfaceChecks += 1;
    }

    if (CP001_ALLIGATION_PRIMARY.has(allocation.qlId)) {
      assert(
        lines.some((line) => line.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:")),
        `${allocation.qlId}/${seed}: primary alligation visual is missing.`,
      );
      assert(lines.length >= 3, `${allocation.qlId}/${seed}: alligation explanation is too terse.`);
      alligationPrimaryChecks += 1;
    }

    if (allocation.qlId === "MAL-QL-041" || allocation.qlId === "MAL-QL-042") {
      const serialized = JSON.stringify(question, (_key, value) =>
        typeof value === "bigint" ? `${value}n` : value,
      );
      assert(
        /alligation/i.test(serialized),
        `${allocation.qlId}/${seed}: selective CP004 alligation help was lost.`,
      );
      selectiveCp004AlligationChecks += 1;
    }

    generated += 1;
  }
}

assert(generated === 1340, `Expected 1,340 compact-explanation checks, received ${generated}.`);
assert(alligationPrimaryChecks === 120, `Expected 120 CP001 alligation checks, received ${alligationPrimaryChecks}.`);
assert(selectiveCp004AlligationChecks === 40, `Expected 40 CP004 selective-alligation checks, received ${selectiveCp004AlligationChecks}.`);

console.log(JSON.stringify({
  status: "PASS_MAL_001_COMPACT_EXPLANATION_V1",
  permanentQls: 67,
  samplesPerQl,
  generated,
  maxVisibleLines,
  mathSurfaceChecks,
  cp001AlligationPrimaryQls: [...CP001_ALLIGATION_PRIMARY],
  cp001AlligationPrimaryChecks: alligationPrimaryChecks,
  cp004SelectiveAlligationQls: ["MAL-QL-041", "MAL-QL-042"],
  cp004SelectiveAlligationChecks: selectiveCp004AlligationChecks,
}, null, 2));
