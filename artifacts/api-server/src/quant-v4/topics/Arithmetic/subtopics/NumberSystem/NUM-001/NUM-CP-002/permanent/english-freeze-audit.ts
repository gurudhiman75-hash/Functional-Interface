import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  NUM_CP002_PERMANENT_ALLOCATION,
  NUM_CP002_PERMANENT_QL_IDS,
  getNumCp002PermanentAllocation,
} from "./allocation";
import {
  getNumCp002PermanentDifficultyBands,
  runNumCp002PermanentPipeline,
  type NumCp002PermanentQuestion,
} from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const bannedLearnerLanguage = /\b(?:In this question|admissible|topology|candidate-set|residue condition|universal guarantee|sharpness check|rational decimal)\b/iu;
const rawSlashFraction = /(?<!\\frac\{)\b\d+\/\d+\b/u;
const unicodeMath = /[√²³]/u;
const denominatorOne = /\\frac\{[^{}]+\}\{1\}/u;
const rawLongFloat = /\b\d+\.\d{7,}\b/u;
const internalIdentityLeak = /NUM-(?:CP|QL)|PROT-|solveMode|authorityId|qlTemplateId/iu;

function learnerText(q: NumCp002PermanentQuestion): string {
  return [
    q.stem,
    ...q.options.map((option) => option.value),
    q.explanation.concept ?? "",
    ...q.explanation.solution,
    q.explanation.finalAnswer,
  ].join("\n");
}

function fullQuestionSurface(q: NumCp002PermanentQuestion): string {
  return [q.stem, ...q.options.map((option) => option.value)].join("\n");
}

function latexBalanced(text: string): boolean {
  return (text.match(/\\\(/g)?.length ?? 0) === (text.match(/\\\)/g)?.length ?? 0);
}

const fullSurfaceAnswers = new Map<string, string>();
const stemOwner = new Map<string, string>();
const exactStemCounts = new Map<string, number>();
const exactSurfaceCounts = new Map<string, number>();
const exactExplanationCounts = new Map<string, number>();
const perQlUniqueSurfaces = new Map<string, Set<string>>();
const perQlUniqueExplanations = new Map<string, Set<string>>();
let audited = 0;
let maxStemChars = 0;
let maxStemWords = 0;
let maxExplanationChars = 0;

for (const qlId of NUM_CP002_PERMANENT_QL_IDS) {
  perQlUniqueSurfaces.set(qlId, new Set());
  perQlUniqueExplanations.set(qlId, new Set());
  for (let seed = 1; seed <= 60; seed += 1) {
    const q = runNumCp002PermanentPipeline({ questionLanguageId: qlId, seed });
    audited += 1;
    const learner = learnerText(q);
    const surface = fullQuestionSurface(q);
    const explanation = [q.explanation.concept ?? "", ...q.explanation.solution, q.explanation.finalAnswer].join("\n");

    assert(!bannedLearnerLanguage.test(learner), `${qlId}/${seed}: banned learner wording`);
    assert(!rawSlashFraction.test(learner), `${qlId}/${seed}: raw slash fraction`);
    assert(!unicodeMath.test(learner), `${qlId}/${seed}: unicode math`);
    assert(!denominatorOne.test(learner), `${qlId}/${seed}: denominator-one rendering artifact`);
    assert(!rawLongFloat.test(learner), `${qlId}/${seed}: raw floating-point artifact`);
    assert(!internalIdentityLeak.test(learner), `${qlId}/${seed}: internal identity leak`);
    assert(latexBalanced(learner), `${qlId}/${seed}: unbalanced inline MathJax`);
    assert(q.explanation.solution.length >= 1 && q.explanation.solution.length <= 3, `${qlId}/${seed}: explanation structure`);
    assert(q.explanation.finalAnswer === q.canonicalAnswer, `${qlId}/${seed}: final answer mismatch`);

    const priorAnswer = fullSurfaceAnswers.get(surface);
    if (priorAnswer !== undefined) {
      assert(priorAnswer === q.canonicalAnswer, `${qlId}/${seed}: identical learner surface has conflicting answers`);
    } else {
      fullSurfaceAnswers.set(surface, q.canonicalAnswer);
    }

    const priorOwner = stemOwner.get(q.stem);
    if (priorOwner !== undefined) {
      assert(priorOwner === qlId, `${qlId}/${seed}: cross-QL stem collision with ${priorOwner}`);
    } else {
      stemOwner.set(q.stem, qlId);
    }

    exactStemCounts.set(q.stem, (exactStemCounts.get(q.stem) ?? 0) + 1);
    exactSurfaceCounts.set(surface, (exactSurfaceCounts.get(surface) ?? 0) + 1);
    exactExplanationCounts.set(explanation, (exactExplanationCounts.get(explanation) ?? 0) + 1);
    perQlUniqueSurfaces.get(qlId)!.add(surface);
    perQlUniqueExplanations.get(qlId)!.add(explanation);

    maxStemChars = Math.max(maxStemChars, q.stem.length);
    maxStemWords = Math.max(maxStemWords, q.stem.trim().split(/\s+/u).length);
    maxExplanationChars = Math.max(maxExplanationChars, explanation.length);
  }

  assert(perQlUniqueSurfaces.get(qlId)!.size >= 4, `${qlId}: insufficient learner-surface diversity`);
  assert(perQlUniqueExplanations.get(qlId)!.size >= 4, `${qlId}: insufficient question-specific explanation diversity`);
}

assert(audited === 21 * 60, "editorial corpus size");

function selectReviewQuestions(qlId: (typeof NUM_CP002_PERMANENT_QL_IDS)[number]): readonly NumCp002PermanentQuestion[] {
  const allocation = getNumCp002PermanentAllocation(qlId);
  const neededPrototypes = new Set([...allocation.corePrototypeIds, ...allocation.adapterPrototypeIds]);
  const neededPositions = new Set([0, 1, 2, 3]);
  const neededDifficulties = new Set(getNumCp002PermanentDifficultyBands(qlId));
  const candidates = Array.from({ length: 240 }, (_, i) => runNumCp002PermanentPipeline({ questionLanguageId: qlId, seed: i + 1 }));
  const selected: NumCp002PermanentQuestion[] = [];
  const selectedSurfaces = new Set<string>();

  while ((neededPrototypes.size || neededPositions.size || neededDifficulties.size) && selected.length < 10) {
    let best: NumCp002PermanentQuestion | undefined;
    let bestScore = -1;
    for (const q of candidates) {
      if (selected.some((picked) => picked.seed === q.seed)) continue;
      const surface = fullQuestionSurface(q);
      const score =
        (neededPrototypes.has(q.temporaryPrototypeId) ? 4 : 0)
        + (neededPositions.has(q.correctIndex) ? 2 : 0)
        + (neededDifficulties.has(q.difficulty) ? 2 : 0)
        + (!selectedSurfaces.has(surface) ? 1 : 0);
      if (score > bestScore) { best = q; bestScore = score; }
    }
    assert(best && bestScore > 0, `${qlId}: unable to complete review coverage`);
    selected.push(best);
    selectedSurfaces.add(fullQuestionSurface(best));
    neededPrototypes.delete(best.temporaryPrototypeId);
    neededPositions.delete(best.correctIndex);
    neededDifficulties.delete(best.difficulty);
  }

  assert(neededPrototypes.size === 0, `${qlId}: review pack misses prototypes ${[...neededPrototypes]}`);
  assert(neededPositions.size === 0, `${qlId}: review pack misses answer positions ${[...neededPositions]}`);
  assert(neededDifficulties.size === 0, `${qlId}: review pack misses difficulty bands ${[...neededDifficulties]}`);

  for (const q of candidates) {
    if (selected.length >= 6) break;
    if (selected.some((picked) => picked.seed === q.seed)) continue;
    const surface = fullQuestionSurface(q);
    if (selectedSurfaces.has(surface)) continue;
    selected.push(q);
    selectedSurfaces.add(surface);
  }
  assert(selected.length >= 4, `${qlId}: review pack needs at least four covered questions`);
  return Object.freeze(selected);
}

const reviewQuestions = NUM_CP002_PERMANENT_QL_IDS.flatMap((qlId) => selectReviewQuestions(qlId));
const reviewPrototypeReach = new Set(reviewQuestions.map((q) => q.temporaryPrototypeId));
const expectedPrototypeReach = new Set(
  NUM_CP002_PERMANENT_ALLOCATION.flatMap((entry) => [...entry.corePrototypeIds, ...entry.adapterPrototypeIds]),
);
assert(
  JSON.stringify([...reviewPrototypeReach].sort()) === JSON.stringify([...expectedPrototypeReach].sort()),
  "review prototype reach",
);
assert(reviewQuestions.length >= 21 * 4 && reviewQuestions.length <= 21 * 10, "review pack size bounds");

const outDir = resolve(process.cwd(), "dist/quant-v4/num-cp002-permanent-english-freeze");
mkdirSync(outDir, { recursive: true });
const jsonPath = resolve(outDir, "num-cp002-permanent-english-review.json");
const mdPath = resolve(outDir, "num-cp002-permanent-english-review.md");
const csvPath = resolve(outDir, "num-cp002-permanent-english-review.csv");
const auditPath = resolve(outDir, "num-cp002-permanent-english-audit.json");

writeFileSync(jsonPath, JSON.stringify(reviewQuestions, null, 2));
writeFileSync(mdPath, [
  "# NUM-CP-002 Permanent English Review Pack", "",
  `Questions: ${reviewQuestions.length}. Permanent QLs: 21. Retained runtime prototypes: ${reviewPrototypeReach.size}.`, "",
  ...reviewQuestions.flatMap((q) => [
    `## ${q.permanentQlId} · ${q.difficulty} · seed ${q.seed} · ${q.temporaryPrototypeId}`, "",
    q.stem, "",
    ...q.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${index === q.correctIndex ? " **[Correct]**" : ""}`),
    "", ...(q.explanation.concept ? [`**Concept:** ${q.explanation.concept}`, ""] : []),
    "**Solution:**", ...q.explanation.solution.map((line) => `- ${line}`), "",
    `**Answer:** ${q.explanation.finalAnswer}`, "",
  ]),
].join("\n"));

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}
const csvRows = [
  ["qlId", "difficulty", "seed", "prototypeId", "stem", "optionA", "optionB", "optionC", "optionD", "correctIndex", "answer", "concept", "solution"],
  ...reviewQuestions.map((q) => [
    q.permanentQlId, q.difficulty, q.seed, q.temporaryPrototypeId, q.stem,
    q.options[0]!.value, q.options[1]!.value, q.options[2]!.value, q.options[3]!.value,
    q.correctIndex, q.canonicalAnswer, q.explanation.concept ?? "", q.explanation.solution.join(" | "),
  ]),
];
writeFileSync(csvPath, csvRows.map((row) => row.map(csvCell).join(",")).join("\n"));

const reviewQuestionsPerQl = Object.fromEntries(
  NUM_CP002_PERMANENT_QL_IDS.map((qlId) => [qlId, reviewQuestions.filter((q) => q.permanentQlId === qlId).length]),
);
const audit = {
  status: "PASS_NUM_CP002_PERMANENT_ENGLISH_EDITORIAL_AUDIT",
  audited,
  permanentQlCount: NUM_CP002_PERMANENT_QL_IDS.length,
  retainedPrototypeCount: expectedPrototypeReach.size,
  uniqueStems: exactStemCounts.size,
  uniqueFullQuestionSurfaces: exactSurfaceCounts.size,
  uniqueExplanations: exactExplanationCounts.size,
  ambiguousRepeatedFullSurfaces: 0,
  crossQlStemCollisions: 0,
  maxStemChars,
  maxStemWords,
  maxExplanationChars,
  reviewQuestionCount: reviewQuestions.length,
  reviewQuestionsPerQl,
  reviewPrototypeReach: reviewPrototypeReach.size,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
};
writeFileSync(auditPath, JSON.stringify(audit, null, 2));
console.log(JSON.stringify({ ...audit, jsonPath, mdPath, csvPath, auditPath }, null, 2));
