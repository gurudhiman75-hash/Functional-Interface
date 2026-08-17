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

const CP001_DUAL_METHOD_QLS = new Set([
  "MAL-QL-001",
  "MAL-QL-005",
  "MAL-QL-006",
  "MAL-QL-007",
  "MAL-QL-009",
  "MAL-QL-010",
]);

const CP004_DUAL_METHOD_QLS = new Set([
  "MAL-QL-041",
  "MAL-QL-042",
]);

const CP005_DUAL_METHOD_QLS = new Set([
  "MAL-QL-055",
  "MAL-QL-058",
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
  /Step-by-Step Solution/i,
  /Quick check\s*:/i,
  /Final answer\s*:/i,
  /10-Second Exam Shortcut/i,
  /Common Trap/i,
  /Mistake Warning/i,
];

const forbiddenEditorialDefects = [
  /\b2th root\b/i,
  /Therefore, known total value =/i,
  /\bq litre\b/i,
  /After \d+ operations, the original quantity is .*?\d+ \d+\/\d+/i,
];

let generated = 0;
let mathSurfaceChecks = 0;
let cp001DualMethodChecks = 0;
let cp004DualMethodChecks = 0;
let cp005DualMethodChecks = 0;
let enrichedCp004Cp005Checks = 0;
const samplesPerQl = 20;

for (const allocation of allocations) {
  for (let index = 0; index < samplesPerQl; index += 1) {
    const seed = `mal-001-dual-method-explanation-v3:${allocation.qlId}:${index}`;
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

    const isCp001Dual = CP001_DUAL_METHOD_QLS.has(allocation.qlId);
    const isCp004Dual = CP004_DUAL_METHOD_QLS.has(allocation.qlId);
    const isCp005Dual = CP005_DUAL_METHOD_QLS.has(allocation.qlId);
    const isDual = isCp001Dual || isCp004Dual || isCp005Dual;

    if (isDual) {
      assert(
        lines[0] === "Method 1 — Simple Method",
        `${allocation.qlId}/${seed}: dual-method explanation must start with the simple method.`,
      );
      const method2Index = lines.indexOf("Method 2 — Alligation Cross");
      assert(
        method2Index >= 3,
        `${allocation.qlId}/${seed}: alligation method is missing or the simple method is too thin.`,
      );
      assert(
        lines.length - method2Index >= 3,
        `${allocation.qlId}/${seed}: alligation method needs a cross plus explanatory calculation.`,
      );
      assert(
        lines.length <= 12,
        `${allocation.qlId}/${seed}: ${lines.length} lines exceed the dual-method limit of 12.`,
      );

      const alligationLines = lines.slice(method2Index + 1);
      if (isCp001Dual) {
        assert(
          alligationLines.some((line) => line.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:")),
          `${allocation.qlId}/${seed}: CP001 alligation cross visual is missing.`,
        );
        cp001DualMethodChecks += 1;
      }
      if (isCp004Dual) {
        assert(
          alligationLines.some((line) => /[╲╱]/u.test(line)),
          `${allocation.qlId}/${seed}: CP004 alligation cross is missing.`,
        );
        assert(
          alligationLines.some((line) => /ratio|=/.test(line)),
          `${allocation.qlId}/${seed}: CP004 alligation ratio/calculation is missing.`,
        );
        cp004DualMethodChecks += 1;
      }
      if (isCp005Dual) {
        assert(
          alligationLines.some((line) => line.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:")),
          `${allocation.qlId}/${seed}: CP005 alligation visual is missing.`,
        );
        assert(
          lines.slice(1, method2Index).some((line) => /weighted-average/i.test(line)),
          `${allocation.qlId}/${seed}: CP005 Method 1 must remain a genuinely separate normal method.`,
        );
        cp005DualMethodChecks += 1;
      }
    } else if (allocation.cpId !== "MAL-CP-006") {
      assert(
        lines[0] === "Simple Method",
        `${allocation.qlId}/${seed}: non-alligation learner explanation should use one clear simple method.`,
      );
      assert(
        lines.length >= 2 && lines.length <= 7,
        `${allocation.qlId}/${seed}: simple explanation should contain 1-6 working lines.`,
      );
      assert(
        !lines.some((line) => /Alligation Cross/i.test(line)),
        `${allocation.qlId}/${seed}: alligation was forced into a non-natural family.`,
      );
      if (allocation.cpId === "MAL-CP-004" || allocation.cpId === "MAL-CP-005") {
        assert(
          lines.length >= 3,
          `${allocation.qlId}/${seed}: solution-first explanation is still too terse for learner review.`,
        );
        enrichedCp004Cp005Checks += 1;
      }
    } else {
      assert(
        lines.length >= 1 && lines.length <= 4,
        `${allocation.qlId}/${seed}: CP006 review solution should remain 1-4 natural transfer lines.`,
      );
    }

    const learnerExplanation = lines.join("\n");
    for (const pattern of forbiddenClutter) {
      assert(
        !pattern.test(learnerExplanation),
        `${allocation.qlId}/${seed}: learner explanation contains clutter ${pattern}.`,
      );
    }
    for (const pattern of forbiddenEditorialDefects) {
      assert(
        !pattern.test(learnerExplanation),
        `${allocation.qlId}/${seed}: learner explanation contains known editorial defect ${pattern}.`,
      );
    }
    for (const line of lines) {
      assertMathWellFormed(allocation.qlId, seed, line);
      mathSurfaceChecks += 1;
    }

    generated += 1;
  }
}

assert(generated === 1340, `Expected 1,340 explanation checks, received ${generated}.`);
assert(cp001DualMethodChecks === 120, `Expected 120 CP001 dual-method checks, received ${cp001DualMethodChecks}.`);
assert(cp004DualMethodChecks === 40, `Expected 40 CP004 dual-method checks, received ${cp004DualMethodChecks}.`);
assert(cp005DualMethodChecks === 40, `Expected 40 CP005 dual-method checks, received ${cp005DualMethodChecks}.`);

console.log(JSON.stringify({
  status: "PASS_MAL_001_DUAL_METHOD_EXPLANATION_V3",
  permanentQls: 67,
  samplesPerQl,
  generated,
  mathSurfaceChecks,
  cp001DualMethodQls: [...CP001_DUAL_METHOD_QLS],
  cp001DualMethodChecks,
  cp004DualMethodQls: [...CP004_DUAL_METHOD_QLS],
  cp004DualMethodChecks,
  cp005DualMethodQls: [...CP005_DUAL_METHOD_QLS],
  cp005DualMethodChecks,
  enrichedCp004Cp005Checks,
  policy: "Teach the normal method first; show alligation cross second wherever the released authority already supports it naturally.",
}, null, 2));
