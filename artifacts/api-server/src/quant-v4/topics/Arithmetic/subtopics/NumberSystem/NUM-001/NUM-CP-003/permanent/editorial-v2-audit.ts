import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP003_PERMANENT_QL_IDS } from "./allocation";
import {
  NUM_CP003_EDITORIAL_V2_RELEASE,
  runNumCp003EditorialV2ForQl,
  type NumCp003EditorialV2Question,
} from "./editorial-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const bannedLearnerLanguage = /\b(?:In this question|admissible|topology|candidate[- ]set|cardinality|remainder status|Compute or infer|Exact testing leaves|universal guarantee|solve mode|authority id)\b/iu;
const internalIdentityLeak = /NUM-(?:CP|QL)|PROT-|solveMode|authorityId|qlTemplateId|temporaryTemplateLabel/iu;
const oldSectionLeak = /(?:Main Rule|Exam Speed Trick|Common Traps|Strategy:|Verification:|Conclusion:)/iu;

function learnerText(q: NumCp003EditorialV2Question): string {
  return [
    q.stem,
    ...q.options,
    q.explanation.concept,
    ...q.explanation.solution,
    q.explanation.finalAnswer,
  ].join("\n");
}

function learnerSurface(q: NumCp003EditorialV2Question): string {
  return [q.stem, ...q.options].join("\n");
}

function explanationSurface(q: NumCp003EditorialV2Question): string {
  return [q.explanation.concept, ...q.explanation.solution, q.explanation.finalAnswer].join("\n");
}

function removeInlineMath(text: string): string {
  return text.replace(/\\\([\s\S]*?\\\)/gu, " ");
}

function inlineMathBalanced(text: string): boolean {
  return (text.match(/\\\(/gu)?.length ?? 0) === (text.match(/\\\)/gu)?.length ?? 0);
}

function rawMathViolation(text: string): string | null {
  const raw = removeInlineMath(text);
  const checks: ReadonlyArray<readonly [string, RegExp]> = [
    ["dollar-math", /\$/u],
    ["raw-number-template", /\b(?=[0-9XYAB]{2,}\b)(?=[0-9XYAB]*\d)(?=[0-9XYAB]*[XYAB])[0-9XYAB]{2,}\b/u],
    ["raw-variable-equation", /\b[XY]\s*(?:\+|=|<|>)\s*/u],
    ["raw-ordered-pair", /\(\s*(?:X|Y|-?\d+)\s*,\s*(?:X|Y|-?\d+)\s*\)/u],
    ["raw-numeric-working", /\b-?\d+\s*(?:×|÷|=)\s*-?\d+\b/u],
    ["unicode-math", /[√²³]/u],
  ];
  for (const [name, pattern] of checks) {
    if (pattern.test(raw)) return name;
  }
  return null;
}

const exactSurfaceCounts = new Map<string, number>();
const exactExplanationCounts = new Map<string, number>();
const perQlSurfaces = new Map<string, Set<string>>();
const perQlExplanations = new Map<string, Set<string>>();
const perQlDifficulties = new Map<string, Set<string>>();
let audited = 0;
let maxStemChars = 0;
let maxExplanationChars = 0;
let maxSolutionLines = 0;

for (const qlId of NUM_CP003_PERMANENT_QL_IDS) {
  perQlSurfaces.set(qlId, new Set());
  perQlExplanations.set(qlId, new Set());
  perQlDifficulties.set(qlId, new Set());

  for (let seed = 1; seed <= 80; seed += 1) {
    const q = runNumCp003EditorialV2ForQl(qlId, `cp003-editorial-v2-audit:${seed}`);
    audited += 1;
    const label = `${qlId}/${seed}`;
    const learner = learnerText(q);
    const surface = learnerSurface(q);
    const explanation = explanationSurface(q);

    assert(q.editorialVersion === "NUM-CP-003-EDITORIAL-V2", `${label}: wrong editorial version`);
    assert(q.reviewStatus === "EDITORIAL_V2_CONTROLLED_REVIEW", `${label}: wrong review status`);
    assert(!q.active, `${label}: source activation changed`);
    assert(!q.questionStudioDiscoverable, `${label}: Question Studio gate opened`);
    assert(!q.questionBankWritable, `${label}: Question Bank gate opened`);
    assert(!q.testEligible, `${label}: test gate opened`);
    assert(!q.publiclyPublishable, `${label}: public gate opened`);

    assert(q.options.length >= 4 && q.options.length <= 5, `${label}: invalid option count`);
    assert(new Set(q.options).size === q.options.length, `${label}: duplicate learner option`);
    assert(q.correctIndex >= 0 && q.correctIndex < q.options.length, `${label}: invalid correct index`);
    assert(q.options[q.correctIndex] === q.answer, `${label}: answer not at correct index`);
    assert(q.canonicalAnswer === q.answer, `${label}: canonical answer mismatch`);
    assert(q.explanation.finalAnswer === q.answer, `${label}: final answer mismatch`);

    assert(q.explanation.concept.length > 0 && q.explanation.concept.length <= 180, `${label}: concept is not concise`);
    assert(q.explanation.solution.length >= 2 && q.explanation.solution.length <= 4, `${label}: solution must have 2-4 lines`);
    assert(q.explanation.solution.every((line) => line.trim().length >= 8), `${label}: empty or trivial solution line`);

    assert(!bannedLearnerLanguage.test(learner), `${label}: banned learner wording`);
    assert(!oldSectionLeak.test(learner), `${label}: legacy four-tier wording leaked`);
    assert(!internalIdentityLeak.test(learner), `${label}: internal identity leaked to learner text`);
    assert(inlineMathBalanced(learner), `${label}: unbalanced inline MathJax`);
    assert(!/\\\([^)]*\\\(/u.test(learner), `${label}: nested inline MathJax`);
    const rawMath = rawMathViolation(learner);
    assert(rawMath === null, `${label}: ${rawMath} remains outside LaTeX`);

    exactSurfaceCounts.set(surface, (exactSurfaceCounts.get(surface) ?? 0) + 1);
    exactExplanationCounts.set(explanation, (exactExplanationCounts.get(explanation) ?? 0) + 1);
    perQlSurfaces.get(qlId)!.add(surface);
    perQlExplanations.get(qlId)!.add(explanation);
    perQlDifficulties.get(qlId)!.add(q.difficulty);

    maxStemChars = Math.max(maxStemChars, q.stem.length);
    maxExplanationChars = Math.max(maxExplanationChars, explanation.length);
    maxSolutionLines = Math.max(maxSolutionLines, q.explanation.solution.length);
  }

  assert(perQlSurfaces.get(qlId)!.size >= 4, `${qlId}: insufficient learner-surface diversity`);
  assert(perQlExplanations.get(qlId)!.size >= 4, `${qlId}: insufficient question-specific explanation diversity`);
}

assert(audited === NUM_CP003_PERMANENT_QL_IDS.length * 80, "unexpected audit corpus size");

function selectFourForReview(qlId: (typeof NUM_CP003_PERMANENT_QL_IDS)[number]): readonly NumCp003EditorialV2Question[] {
  const candidates = Array.from({ length: 320 }, (_, index) =>
    runNumCp003EditorialV2ForQl(qlId, `cp003-editorial-v2-review:${index + 1}`));
  const selected: NumCp003EditorialV2Question[] = [];
  const seenDifficulties = new Set<string>();
  const seenCorrectIndices = new Set<number>();
  const seenSurfaces = new Set<string>();

  while (selected.length < 4) {
    let best: NumCp003EditorialV2Question | undefined;
    let bestScore = -1;
    for (const candidate of candidates) {
      if (selected.some((picked) => picked.seed === candidate.seed)) continue;
      const surface = learnerSurface(candidate);
      const score =
        (!seenDifficulties.has(candidate.difficulty) ? 6 : 0)
        + (!seenCorrectIndices.has(candidate.correctIndex) ? 3 : 0)
        + (!seenSurfaces.has(surface) ? 2 : 0);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    assert(best, `${qlId}: unable to select review question`);
    selected.push(best);
    seenDifficulties.add(best.difficulty);
    seenCorrectIndices.add(best.correctIndex);
    seenSurfaces.add(learnerSurface(best));
  }

  assert(seenSurfaces.size === 4, `${qlId}: review pack contains duplicate surfaces`);
  return Object.freeze(selected);
}

const reviewQuestions = NUM_CP003_PERMANENT_QL_IDS.flatMap((qlId) => selectFourForReview(qlId));
assert(reviewQuestions.length === 68, `Expected 68 review questions, received ${reviewQuestions.length}`);

const reviewRows = reviewQuestions.map((q) => ({
  permanentQlId: q.permanentQlId,
  difficulty: q.difficulty,
  seed: q.seed,
  stem: q.stem,
  options: q.options,
  correctIndex: q.correctIndex,
  answer: q.answer,
  explanation: q.explanation,
  lifecycle: {
    active: q.active,
    questionStudioDiscoverable: q.questionStudioDiscoverable,
    questionBankWritable: q.questionBankWritable,
    testEligible: q.testEligible,
    publiclyPublishable: q.publiclyPublishable,
  },
}));

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/num-cp003-editorial-v2");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "num-cp003-editorial-v2-68q-review.json");
const markdownPath = resolve(outputDirectory, "num-cp003-editorial-v2-68q-review.md");
const csvPath = resolve(outputDirectory, "num-cp003-editorial-v2-68q-review.csv");
const auditPath = resolve(outputDirectory, "num-cp003-editorial-v2-audit.json");

writeFileSync(jsonPath, `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");

writeFileSync(markdownPath, [
  "# NUM-CP-003 English Editorial V2 — 68 Question Review Pack",
  "",
  "Scope: divisibility and missing digits. Permanent mathematical identities NUM-QL-001..017 remain unchanged.",
  "",
  "Explanation model: concise Concept → Solution → Answer. No forced shortcut or distractor-trap sections.",
  "",
  "Lifecycle: controlled review only. Question Studio, Question Bank, tests and public publication remain disabled.",
  "",
  ...reviewQuestions.flatMap((q, index) => [
    `## Q${index + 1}. ${q.permanentQlId} · ${q.difficulty} · seed ${q.seed}`,
    "",
    q.stem.replace(/\n/gu, "  \n"),
    "",
    ...q.options.map((option, optionIndex) =>
      `${String.fromCharCode(65 + optionIndex)}. ${option}${optionIndex === q.correctIndex ? " **[Correct]**" : ""}`),
    "",
    `**Concept:** ${q.explanation.concept}`,
    "",
    "**Solution:**",
    ...q.explanation.solution.map((line) => `- ${line}`),
    "",
    `**Answer:** ${q.explanation.finalAnswer}`,
    "",
    "---",
    "",
  ]),
].join("\n"), "utf8");

function csvCell(value: unknown): string {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}
const csvRows = [
  ["qlId", "difficulty", "seed", "stem", "optionA", "optionB", "optionC", "optionD", "optionE", "correctIndex", "answer", "concept", "solution"],
  ...reviewQuestions.map((q) => [
    q.permanentQlId,
    q.difficulty,
    q.seed,
    q.stem,
    q.options[0] ?? "",
    q.options[1] ?? "",
    q.options[2] ?? "",
    q.options[3] ?? "",
    q.options[4] ?? "",
    q.correctIndex,
    q.answer,
    q.explanation.concept,
    q.explanation.solution.join(" | "),
  ]),
];
writeFileSync(csvPath, `${csvRows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`, "utf8");

const audit = {
  status: "PASS_NUM_CP003_EDITORIAL_V2_AUDIT",
  auditedQuestions: audited,
  permanentQlCount: NUM_CP003_PERMANENT_QL_IDS.length,
  reviewQuestionCount: reviewQuestions.length,
  reviewQuestionsPerQl: 4,
  uniqueLearnerSurfaces: exactSurfaceCounts.size,
  uniqueExplanations: exactExplanationCounts.size,
  maxStemChars,
  maxExplanationChars,
  maxSolutionLines,
  difficultyBandsSeen: Object.fromEntries(
    NUM_CP003_PERMANENT_QL_IDS.map((qlId) => [qlId, [...perQlDifficulties.get(qlId)!].sort()]),
  ),
  lifecycle: NUM_CP003_EDITORIAL_V2_RELEASE,
  rawMathViolations: 0,
  legacyFourTierLeaks: 0,
  internalIdentityLeaks: 0,
};
writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...audit, jsonPath, markdownPath, csvPath, auditPath }, null, 2));
