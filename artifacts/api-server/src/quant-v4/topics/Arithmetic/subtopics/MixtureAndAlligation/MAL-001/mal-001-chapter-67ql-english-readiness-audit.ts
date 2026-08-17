import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
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

function asRecord(value: unknown): Record<string, unknown> {
  assert(Boolean(value) && typeof value === "object", "Expected a question object.");
  return value as Record<string, unknown>;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? [...value]
    : [];
}

function visibleLines(question: unknown): string[] {
  const record = asRecord(question);
  const explanation = record.explanation;
  if (Array.isArray(explanation)) return asStringArray(explanation);
  if (!explanation || typeof explanation !== "object") return [];
  const e = explanation as Record<string, unknown>;
  for (const key of ["visibleLines", "lines", "steps"] as const) {
    const values = asStringArray(e[key]);
    if (values.length > 0) return values;
  }
  const fallback = ["coreConcept", "formula", "calculation", "verification", "conclusion"]
    .map((key) => e[key])
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  return fallback;
}

function questionSurface(question: unknown): {
  stem: string;
  options: string[];
  answer: string;
  correctIndex: number;
  lines: string[];
} {
  const record = asRecord(question);
  assert(typeof record.stem === "string", "Question stem is missing.");
  assert(typeof record.answer === "string", "Question answer is missing.");
  assert(typeof record.correctIndex === "number", "Question correctIndex is missing.");
  return {
    stem: record.stem,
    options: asStringArray(record.options),
    answer: record.answer,
    correctIndex: record.correctIndex,
    lines: visibleLines(question),
  };
}

const HARD_EDITORIAL_BLOCKERS: readonly { id: string; pattern: RegExp }[] = [
  { id: "UNDEFINED_LABEL", pattern: /\bundefined\b/iu },
  { id: "SINGULAR_PART", pattern: /\b1 parts\b/iu },
  { id: "SINGULAR_RATIO_PART", pattern: /\b1 ratio parts\b/iu },
  { id: "DUPLICATED_QUICK_CHECK", pattern: /Quick check:\s*Check:/iu },
  {
    id: "PLURAL_MATERIAL_NO_CHANGE",
    pattern: /\bSince no [^,.!?]*(?:lentils|beans|leaves) is added or removed\b/iu,
  },
  {
    id: "PLURAL_MATERIAL_SAME_QUANTITY",
    pattern: /\b[^,.!?]*(?:lentils|beans|leaves) has the same quantity in both states\b/iu,
  },
  {
    id: "PLURAL_MATERIAL_PRESENT",
    pattern: /\bhow much [^,.!?]*(?:lentils|beans|leaves) is present\b/iu,
  },
  {
    id: "PLURAL_TRANSFER_AGREEMENT",
    pattern: /\b(?:\d+(?:\.\d+)?(?:\s+\d+\/\d+)?|\d*x) litres(?: of [^,.;?]+)? is (?:transferred|sent|moved|poured|added|returned|removed)\b/iu,
  },
  {
    id: "PLURAL_QUANTITY_UNIT",
    pattern: /\b(?:[2-9]|\d{2,})(?:\.\d+)?(?:\s+\d+\/\d+)? litre\b/iu,
  },
];

function assertManualEditorialGuards(
  qlId: string,
  seed: string,
  surface: ReturnType<typeof questionSurface>,
): void {
  assert(!/^[a-z]/u.test(surface.stem), `${qlId}/${seed}: learner stem starts in lowercase.`);
  const learnerText = [surface.stem, ...surface.options, ...surface.lines].join(" ");
  for (const blocker of HARD_EDITORIAL_BLOCKERS) {
    assert(!blocker.pattern.test(learnerText), `${qlId}/${seed}: hard editorial blocker ${blocker.id}.`);
  }
}

type Difficulty = "Easy" | "Medium" | "Hard";
type CpId = "MAL-CP-001" | "MAL-CP-002" | "MAL-CP-003" | "MAL-CP-004" | "MAL-CP-005" | "MAL-CP-006";
type AuditAllocation = { cpId: CpId; qlId: string; difficulty: Difficulty };
type RealismWarningClass =
  | "LARGE_STEM_RATIO"
  | "VERY_LARGE_STEM_RATIO"
  | "UNREDUCED_STEM_RATIO"
  | "EASY_LARGE_NUMBER"
  | "EASY_FRACTIONAL_QUANTITY"
  | "UGLY_PERCENT_FRACTION"
  | "UGLY_CURRENCY_FRACTION"
  | "UGLY_QUANTITY_FRACTION"
  | "GENERIC_THIRD_GRADE_LABEL"
  | "HIGH_PRECISION_PERCENT";

type RealismWarning = {
  class: RealismWarningClass;
  cpId: CpId;
  qlId: string;
  difficulty: Difficulty;
  seed: string;
  excerpt: string;
};

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function collectRealismWarnings(
  allocation: AuditAllocation,
  seed: string,
  surface: ReturnType<typeof questionSurface>,
): RealismWarning[] {
  const warnings: RealismWarning[] = [];
  const add = (warningClass: RealismWarningClass, excerpt: string) => {
    warnings.push({
      class: warningClass,
      cpId: allocation.cpId,
      qlId: allocation.qlId,
      difficulty: allocation.difficulty,
      seed,
      excerpt: excerpt.trim().slice(0, 240),
    });
  };

  for (const match of surface.stem.matchAll(/\b(\d+)\s*:\s*(\d+)\b/gu)) {
    const left = Number(match[1]);
    const right = Number(match[2]);
    const max = Math.max(left, right);
    if (max >= 100) add("LARGE_STEM_RATIO", match[0]);
    if (max >= 500) add("VERY_LARGE_STEM_RATIO", match[0]);
    if (left > 0 && right > 0 && gcd(left, right) > 1) add("UNREDUCED_STEM_RATIO", match[0]);
  }

  if (allocation.difficulty === "Easy") {
    const largeNumber = surface.stem.match(/\b(?:[5-9]\d{2}|\d{4,})\b/u);
    if (largeNumber) add("EASY_LARGE_NUMBER", largeNumber[0]);
    const fractionalQuantity = surface.stem.match(
      /(?:\\frac\{\d+\}\{\d+\}|\b\d+\s+\d+\/\d+)\s*(?:\\,\\text\{(?:kg|litres?)\}|kg|litres?)/u,
    );
    if (fractionalQuantity) add("EASY_FRACTIONAL_QUANTITY", fractionalQuantity[0]);
  }

  const learnerText = [surface.stem, ...surface.options].join(" ");
  for (const match of learnerText.matchAll(/\b\d+\s+(\d+)\/(\d+)%/gu)) {
    if (Number(match[2]) > 12) add("UGLY_PERCENT_FRACTION", match[0]);
  }
  for (const match of learnerText.matchAll(/₹\s*\d+\s+(\d+)\/(\d+)/gu)) {
    if (Number(match[2]) > 10) add("UGLY_CURRENCY_FRACTION", match[0]);
  }
  for (const match of learnerText.matchAll(/\b\d+\s+(\d+)\/(\d+)\s+(?:kg|litres?)\b/gu)) {
    if (Number(match[2]) > 16) add("UGLY_QUANTITY_FRACTION", match[0]);
  }
  if (/\bthird grade\b/iu.test(learnerText)) add("GENERIC_THIRD_GRADE_LABEL", "third grade");
  const highPrecisionPercent = learnerText.match(/\b\d+\.\d{2,}%/u);
  if (highPrecisionPercent) add("HIGH_PRECISION_PERCENT", highPrecisionPercent[0]);

  return warnings;
}

const allocations: AuditAllocation[] = [
  ...MAL_CP001_PERMANENT_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-001" as const, qlId: entry.qlId, difficulty: entry.difficulty })),
  ...MAL_CP002_PERMANENT_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-002" as const, qlId: entry.qlId, difficulty: entry.difficulty })),
  ...MAL_CP003_PERMANENT_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-003" as const, qlId: entry.qlId, difficulty: entry.difficulty })),
  ...MAL_CP004_PERMANENT_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-004" as const, qlId: entry.qlId, difficulty: entry.difficulty })),
  ...MAL_CP005_RELEASE_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-005" as const, qlId: entry.qlId, difficulty: entry.difficulty })),
  ...MAL_CP006_REVIEW_ALLOCATION.map((entry) => ({ cpId: "MAL-CP-006" as const, qlId: entry.qlId, difficulty: entry.difficulty })),
];

assert(allocations.length === 67, `Expected 67 MAL permanent QLs, received ${allocations.length}.`);
assert(new Set(allocations.map((entry) => entry.qlId)).size === 67, "MAL permanent QLs are not unique.");
for (let index = 0; index < 67; index += 1) {
  const expected = `MAL-QL-${String(index + 1).padStart(3, "0")}`;
  assert(allocations[index]?.qlId === expected, `MAL QL continuity failed at ${expected}.`);
}

const cpExpectedCounts: Record<CpId, number> = {
  "MAL-CP-001": 11,
  "MAL-CP-002": 17,
  "MAL-CP-003": 9,
  "MAL-CP-004": 10,
  "MAL-CP-005": 13,
  "MAL-CP-006": 7,
};
for (const [cpId, expected] of Object.entries(cpExpectedCounts) as [CpId, number][]) {
  assert(allocations.filter((entry) => entry.cpId === cpId).length === expected, `${cpId}: expected ${expected} permanent QLs.`);
}

function generate(allocation: AuditAllocation, seed: string): unknown {
  if (allocation.cpId === "MAL-CP-006") {
    return runMalCp006EnglishReviewPipeline({
      questionLanguageId: allocation.qlId as never,
      seed,
      language: "en",
    });
  }
  return runMal001QuestionStudioPipeline(allocation.cpId, {
    questionLanguageId: allocation.qlId,
    seed,
    language: "en",
  });
}

const samplesPerQl = 20;
let generated = 0;
let manualEditorialGuardChecks = 0;
const difficultyCounts: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
const cpGeneratedCounts: Record<CpId, number> = {
  "MAL-CP-001": 0,
  "MAL-CP-002": 0,
  "MAL-CP-003": 0,
  "MAL-CP-004": 0,
  "MAL-CP-005": 0,
  "MAL-CP-006": 0,
};
const crossQlStemOwners = new Map<string, Set<string>>();
const realismWarnings: RealismWarning[] = [];
const qlEvidence: Array<{
  cpId: CpId;
  qlId: string;
  difficulty: Difficulty;
  distinctStems: number;
  distinctAnswers: number;
}> = [];
const reviewRows: Array<{ cpId: CpId; qlId: string; difficulty: Difficulty; question: unknown }> = [];

for (const allocation of allocations) {
  difficultyCounts[allocation.difficulty] += 1;
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < samplesPerQl; index += 1) {
    const seed = `mal-001-67ql-audit:${allocation.qlId}:${index}`;
    const question = generate(allocation, seed);
    const surface = questionSurface(question);

    assert(surface.stem.trim().length >= 20, `${allocation.qlId}/${seed}: stem is too short.`);
    assert(surface.stem.trim().endsWith("?"), `${allocation.qlId}/${seed}: stem is not an explicit question.`);
    assert(!/\b(?:find|calculate|determine)\s*\.$/iu.test(surface.stem.trim()), `${allocation.qlId}/${seed}: incomplete command stem.`);
    assert(surface.options.length === 4, `${allocation.qlId}/${seed}: expected four options.`);
    assert(new Set(surface.options).size === 4, `${allocation.qlId}/${seed}: duplicate options.`);
    assert(surface.correctIndex >= 0 && surface.correctIndex < 4, `${allocation.qlId}/${seed}: invalid correct index.`);
    assert(surface.options[surface.correctIndex] === surface.answer, `${allocation.qlId}/${seed}: answer/index mismatch.`);
    assert(surface.lines.length >= 1, `${allocation.qlId}/${seed}: no learner-visible worked solution lines.`);
    assert(surface.lines.every((line) => line.trim().length > 0), `${allocation.qlId}/${seed}: blank learner-visible solution line.`);

    const learnerText = [surface.stem, ...surface.options, ...surface.lines].join(" ");
    assert(!/\bMAL-(?:CP|QL)|prototype|runtime id|state key|question language|traceability|global component|component load/iu.test(learnerText), `${allocation.qlId}/${seed}: internal implementation language leaked.`);
    assert(!/\b1 litres\b/iu.test(learnerText), `${allocation.qlId}/${seed}: singular litre grammar regressed.`);
    assertManualEditorialGuards(allocation.qlId, seed, surface);
    manualEditorialGuardChecks += 1;
    realismWarnings.push(...collectRealismWarnings(allocation, seed, surface));

    stems.add(surface.stem);
    answers.add(surface.answer);
    const normalizedStem = surface.stem.replace(/\s+/gu, " ").trim().toLowerCase();
    const owners = crossQlStemOwners.get(normalizedStem) ?? new Set<string>();
    owners.add(allocation.qlId);
    crossQlStemOwners.set(normalizedStem, owners);
    generated += 1;
    cpGeneratedCounts[allocation.cpId] += 1;
    if (index === 0) reviewRows.push({ ...allocation, question });
  }

  assert(stems.size >= 4, `${allocation.qlId}: fewer than four distinct stems in ${samplesPerQl} samples.`);
  assert(answers.size >= 2, `${allocation.qlId}: answer generation became constant.`);
  qlEvidence.push({
    cpId: allocation.cpId,
    qlId: allocation.qlId,
    difficulty: allocation.difficulty,
    distinctStems: stems.size,
    distinctAnswers: answers.size,
  });
}

assert(generated === 1340, `Expected 1340 chapter audit questions, received ${generated}.`);
assert(manualEditorialGuardChecks === generated, "Manual editorial guard coverage incomplete.");
assert(reviewRows.length === 67, `Expected one review row per QL, received ${reviewRows.length}.`);
assert(Object.values(difficultyCounts).every((count) => count > 0), "Chapter does not retain all three difficulty bands.");

const crossQlExactStemCollisions = [...crossQlStemOwners.entries()]
  .filter(([, owners]) => owners.size > 1)
  .map(([stem, owners]) => ({ stem, qls: [...owners].sort() }));
assert(crossQlExactStemCollisions.length === 0, `Cross-QL exact stem collisions found: ${crossQlExactStemCollisions.length}.`);

const realismByClass = Object.fromEntries(
  [...new Set(realismWarnings.map((warning) => warning.class))]
    .sort()
    .map((warningClass) => [
      warningClass,
      realismWarnings.filter((warning) => warning.class === warningClass).length,
    ]),
);
const realismByQl = Object.fromEntries(
  [...new Set(realismWarnings.map((warning) => warning.qlId))]
    .sort()
    .map((qlId) => [qlId, realismWarnings.filter((warning) => warning.qlId === qlId).length]),
);
const realismExamples = realismWarnings.filter((warning, index, all) =>
  all.findIndex(
    (candidate) => candidate.qlId === warning.qlId && candidate.class === warning.class,
  ) === index,
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-001-chapter-67ql-english-readiness.json");
const markdownPath = resolve(outputDirectory, "MAL-001-CHAPTER-67QL-ENGLISH-READINESS-REVIEW.md");

const summary = {
  status: "PASS_MAL_001_67QL_ENGLISH_READINESS_AUDIT",
  permanentQlRange: "MAL-QL-001..MAL-QL-067",
  permanentQlCount: 67,
  cpQlCounts: cpExpectedCounts,
  difficultyCounts,
  generated,
  samplesPerQl,
  manualEditorialGuardChecks,
  hardEditorialBlockerClasses: HARD_EDITORIAL_BLOCKERS.map((entry) => entry.id),
  crossQlExactStemCollisions,
  qlEvidence,
  cpGeneratedCounts,
  examRealismAdvisory: {
    status: realismWarnings.length === 0 ? "NO_ADVISORIES" : "REVIEW_RECOMMENDED",
    warningCount: realismWarnings.length,
    byClass: realismByClass,
    byQl: realismByQl,
    examples: realismExamples,
  },
  lifecycleBoundary: {
    cp001ToCp005: "CURRENT_ENGLISH_PRODUCT_SURFACES",
    cp006: "INACTIVE_PERMANENT_ENGLISH_REVIEW_CANDIDATE",
    wholeChapterEnglishFreeze: false,
    hindiPunjabi: "NOT_AUTHORISED_BY_THIS_AUDIT",
  },
};

writeFileSync(
  jsonPath,
  `${JSON.stringify({ ...summary, review: reviewRows }, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-001 — 67 QL English Readiness Review",
  "",
  "> Chapter closure audit. CP-006 remains review-only; this audit does not activate or freeze it.",
  "",
  "## Inventory",
  "",
  "| Checkpoint | Permanent QLs | Count | Current audit surface |",
  "|---|---|---:|---|",
  "| MAL-CP-001 | MAL-QL-001..011 | 11 | current English product surface |",
  "| MAL-CP-002 | MAL-QL-012..028 | 17 | current English product surface |",
  "| MAL-CP-003 | MAL-QL-029..037 | 9 | current English product surface |",
  "| MAL-CP-004 | MAL-QL-038..047 | 10 | current English product surface |",
  "| MAL-CP-005 | MAL-QL-048..060 | 13 | current English product surface |",
  "| MAL-CP-006 | MAL-QL-061..067 | 7 | inactive permanent-ID review candidate |",
  "",
  `Difficulty authorities: Easy ${difficultyCounts.Easy}, Medium ${difficultyCounts.Medium}, Hard ${difficultyCounts.Hard}.`,
  `Manual blocker guard checks: ${manualEditorialGuardChecks}.`,
  "",
  "## Exam-realism advisories (non-blocking)",
  "",
  `Warnings across ${generated} samples: ${realismWarnings.length}.`,
  "",
  "| Advisory class | Count |",
  "|---|---:|",
  ...Object.entries(realismByClass).map(([key, count]) => `| ${key} | ${count} |`),
  "",
  "## Per-QL diversity sample",
  "",
  "| CP | QL | Difficulty | Distinct stems / 20 | Distinct answers / 20 |",
  "|---|---|---|---:|---:|",
  ...qlEvidence.map((row) => `| ${row.cpId} | ${row.qlId} | ${row.difficulty} | ${row.distinctStems} | ${row.distinctAnswers} |`),
  "",
  "## One learner-facing question per permanent QL",
  "",
];

for (const [index, row] of reviewRows.entries()) {
  const surface = questionSurface(row.question);
  markdown.push(
    `### ${index + 1}. ${row.qlId} (${row.cpId}, ${row.difficulty})`,
    "",
    surface.stem,
    "",
    ...surface.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}${optionIndex === surface.correctIndex ? " **✓**" : ""}`),
    "",
    `**Answer:** ${surface.answer}`,
    "",
    "**Solution**",
    ...surface.lines.map((line) => `- ${line}`),
    "",
    "---",
    "",
  );
}

writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
