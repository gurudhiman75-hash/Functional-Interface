import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2InterestQuestionCandidate } from "../../lib/quant-v2/interest-admin-adapter";
import { INTEREST_FAMILY_IDS } from "../canonical/interest-motif-factories";
import type { InterestFamilyId } from "../canonical/interest-types";
import {
  createCorpusSchedulerState,
  extractCorpusSchedulerMetadata,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
} from "../corpus-scheduler/corpus-scheduler";
import {
  interestDegenerateReasons,
  validateInterestIndependentSolver,
} from "../validators/interest-independent-solver";

const interestPattern: Pattern = {
  id: "interest-large-audit",
  type: "formula",
  section: "Quant",
  topic: "interest",
  subtopic: "interest",
  difficulty: "Medium",
  templateVariants: ["Interest V2 large audit pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-interest",
};

type AuditExample = {
  index: number;
  family: string;
  topology: string;
  realism: number;
  issue: string;
  question: string;
  answer: string;
  details?: Record<string, unknown>;
};

function argValue(name: string) {
  const eqPrefix = `--${name}=`;
  const eqMatch = process.argv.find((arg) => arg.startsWith(eqPrefix));
  if (eqMatch) return eqMatch.slice(eqPrefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseCount() {
  const raw = Number(argValue("count") ?? "500");
  if (!Number.isFinite(raw)) return 500;
  return Math.max(1, Math.min(2000, Math.floor(raw)));
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[₹,]/gu, "")
    .replace(/[^\p{L}\p{N}.%]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}

function duplicateFingerprint(question: FormulaQuestion) {
  return [
    normalizeText(question.text),
    normalizeText(answerText(question)),
    [...(question.options ?? [])].map(normalizeText).sort().join("|"),
  ].join("::");
}

function familyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).familyKey;
}

function topologyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).topologyKey;
}

function macroFamily(family: string) {
  if (/^int_si_/u.test(family)) return "si_basic";
  if (/^int_ci_/u.test(family)) return "ci_basic";
  if (/bankers|present_worth|true_discount/u.test(family)) return "banker_discount";
  if (/installment|loan|partial_payment|discharge/u.test(family)) return "repayment";
  return family;
}

function problemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ??
    (question.semanticMetadata as any)?.problem;
}

function realismOf(question: FormulaQuestion) {
  return Number(question.examRealismMetadata?.realismScore ?? 0);
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function toRecord(map: Map<string, number>) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1]));
}

function addExample(
  examples: AuditExample[],
  question: FormulaQuestion,
  index: number,
  issue: string,
  details?: Record<string, unknown>,
) {
  if (examples.length >= 80) return;
  examples.push({
    index,
    family: familyOf(question),
    topology: topologyOf(question),
    realism: realismOf(question),
    issue,
    question: question.text,
    answer: answerText(question),
    details,
  });
}

function configuredFamilyCap(family: string, count: number) {
  if (count >= 500) {
    if (/from_prt|amount_from_prt|principal_from_si|rate_from_si|time_from_si/u.test(family)) return 35;
    if (/bankers|installment|partial|alligation|mixed|specific_year|nominal/u.test(family)) return 35;
    return 35;
  }
  return 3;
}

function validateQuestion(question: FormulaQuestion) {
  const problem = problemOf(question);
  const solver = validateInterestIndependentSolver({
    problem,
    explanation: question.explanation,
    options: question.options,
    correct: question.correct,
  });
  return [...solver.issues, ...interestDegenerateReasons(problem)];
}

function generateQuestions(count: number, seed: string) {
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId: "interest_pyq",
  });
  const questions: FormulaQuestion[] = [];
  const keptFingerprints = new Set<string>();
  const keptFamilyCounts = new Map<string, number>();
  const generationStats = {
    totalAttempts: 0,
    skippedCandidates: 0,
    replacementRegenerations: 0,
    localRejectReasons: {} as Record<string, number>,
  };
  const reject = (reason: string) => {
    generationStats.skippedCandidates += 1;
    generationStats.localRejectReasons[reason] =
      (generationStats.localRejectReasons[reason] ?? 0) + 1;
  };
  const maxAttempts = Math.max(count * 30, count + 2000);
  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    generationStats.totalAttempts += 1;
    const slot = questions.length + attempt;
    const family = INTEREST_FAMILY_IDS[slot % INTEREST_FAMILY_IDS.length]! as InterestFamilyId;
    if ((keptFamilyCounts.get(family) ?? 0) >= configuredFamilyCap(family, count)) {
      continue;
    }
    let question: FormulaQuestion;
    try {
      question = createQuantV2InterestQuestionCandidate(interestPattern, {
        seed: `${seed}:${attempt}:${family}`,
        forcedMotifId: family,
        targetDifficulty: attempt % 4 === 0 ? "Hard" : attempt % 3 === 0 ? "Easy" : "Medium",
        useCorpusScheduler: true,
      });
    } catch (error) {
      reject(`generation-error:${String((error as Error).message).slice(0, 80)}`);
      continue;
    }
    const issues = validateQuestion(question);
    if (issues.length) {
      reject(`validation:${issues[0]}`);
      continue;
    }
    const fingerprint = duplicateFingerprint(question);
    if (keptFingerprints.has(fingerprint)) {
      generationStats.replacementRegenerations += 1;
      reject("duplicate fingerprint");
      continue;
    }
    keptFingerprints.add(fingerprint);
    keptFamilyCounts.set(family, (keptFamilyCounts.get(family) ?? 0) + 1);
    questions.push(question);
  }
  const ordered = interleaveScheduledPreviewQuestions(questions, seed, familyOf);
  for (const question of ordered) {
    const metadata = extractCorpusSchedulerMetadata(question);
    state.acceptedCount += 1;
    state.familyCounts[metadata.familyKey] = (state.familyCounts[metadata.familyKey] ?? 0) + 1;
    state.topologyCounts[metadata.topologyKey] = (state.topologyCounts[metadata.topologyKey] ?? 0) + 1;
    state.topologyGroupCounts[metadata.topologyGroup] = (state.topologyGroupCounts[metadata.topologyGroup] ?? 0) + 1;
    state.difficultyCounts[metadata.difficulty] = (state.difficultyCounts[metadata.difficulty] ?? 0) + 1;
  }
  return { questions: ordered, generationStats, schedulerSummary: summarizeCorpusScheduler(state) };
}

function opening(question: FormulaQuestion, words: number) {
  return normalizeText(question.text).split(/\s+/u).slice(0, words).join(" ");
}

function fullOpening(question: FormulaQuestion) {
  return normalizeText(String(question.text ?? "").split(/[.?!]/u)[0] ?? "");
}

async function writeProductionExport(questions: FormulaQuestion[]) {
  const folder = path.resolve("exports/interest-production-60");
  await mkdir(folder, { recursive: true });
  const corpus = [
    "# Interest V2 Production Export",
    "",
    ...questions.slice(0, 60).map((question, index) => [
      `[Q${index + 1}]`,
      `Family: ${familyOf(question)}`,
      `EN: ${question.text}`,
      `HI: ${question.textHi ?? ""}`,
      `PA: ${question.textPa ?? ""}`,
      `Options: ${(question.options ?? []).join(" | ")}`,
      `Answer: ${answerText(question)}`,
      `Explanation EN:\n${question.explanation}`,
      "",
    ].join("\n")),
  ].join("\n");
  await writeFile(path.join(folder, "corpus.txt"), corpus, "utf8");
  return folder;
}

async function main() {
  const count = parseCount();
  const seed = String(argValue("seed") ?? `interest-large:${count}`);
  const { questions, generationStats, schedulerSummary } = generateQuestions(count, seed);
  const familyDistribution = new Map<string, number>();
  const topologyDistribution = new Map<string, number>();
  const opening8 = new Map<string, number>();
  const openingFull = new Map<string, number>();
  const explanationIntro = new Map<string, number>();
  const worst: AuditExample[] = [];
  let solverMismatch = 0;
  let explanationMismatch = 0;
  let duplicateCount = 0;
  let undefinedCount = 0;
  let leakageCount = 0;
  let optionIssues = 0;
  let degenerateCount = 0;
  let lowRealism = 0;
  let realismTotal = 0;
  const fingerprints = new Set<string>();

  questions.forEach((question, index) => {
    const family = familyOf(question);
    increment(familyDistribution, family);
    increment(topologyDistribution, topologyOf(question));
    increment(opening8, opening(question, 8));
    increment(openingFull, fullOpening(question));
    const intro = normalizeText(String(question.explanation ?? "").split(/\r?\n/u).find(Boolean) ?? "");
    increment(explanationIntro, intro);
    const realism = realismOf(question);
    realismTotal += realism;
    if (realism < 70) {
      lowRealism += 1;
      addExample(worst, question, index + 1, "low realism");
    }
    const fp = duplicateFingerprint(question);
    if (fingerprints.has(fp)) {
      duplicateCount += 1;
      addExample(worst, question, index + 1, "duplicate fingerprint");
    }
    fingerprints.add(fp);
    const textBlob = `${question.text} ${question.textHi} ${question.textPa} ${question.explanation} ${question.explanationHi} ${question.explanationPa} ${(question.options ?? []).join(" ")}`;
    if (/\b(?:undefined|null|NaN)\b/u.test(textBlob)) {
      undefinedCount += 1;
      addExample(worst, question, index + 1, "undefined/null/NaN");
    }
    if (/\b(?:principal|compound interest|simple interest|Find|The)\b/u.test(`${question.textHi} ${question.textPa}`)) {
      leakageCount += 1;
      addExample(worst, question, index + 1, "HI/PA English leakage");
    }
    if (!question.options?.includes(answerText(question)) || new Set(question.options).size !== question.options.length) {
      optionIssues += 1;
      addExample(worst, question, index + 1, "option quality issue");
    }
    const problem = problemOf(question);
    const solver = validateInterestIndependentSolver({ problem, explanation: question.explanation, options: question.options, correct: question.correct });
    if (solver.issues.some((issue) => /answer mismatch/u.test(issue))) solverMismatch += 1;
    if (solver.issues.some((issue) => /explanation final/u.test(issue))) explanationMismatch += 1;
    const degenerate = interestDegenerateReasons(problem);
    if (degenerate.length) {
      degenerateCount += 1;
      addExample(worst, question, index + 1, "degenerate", { degenerate });
    }
  });

  const familyCapViolations = [...familyDistribution.entries()]
    .filter(([family, actual]) => actual > configuredFamilyCap(family, count))
    .map(([family, actual]) => ({ family, actual, cap: configuredFamilyCap(family, count) }));
  const repeatedOpeningViolations = [...opening8.entries()].filter(([, value]) => value > 15).length +
    [...openingFull.entries()].filter(([, value]) => value > 5).length;
  const firstWindows = [0, 1, 2, 3, 4].map((seedIndex) => {
    const sample = generateQuestions(Math.min(60, count), `${seed}:preview:${seedIndex}`).questions.slice(0, 6);
    return sample.map(familyOf);
  });
  const previewPass = firstWindows.every((families) => new Set(families).size >= 4 && new Set(families.slice(0, 3).map(macroFamily)).size > 1);
  const averageRealism = questions.length ? realismTotal / questions.length : 0;
  const status =
    questions.length === count &&
    solverMismatch === 0 &&
    explanationMismatch === 0 &&
    duplicateCount === 0 &&
    undefinedCount === 0 &&
    leakageCount === 0 &&
    optionIssues === 0 &&
    degenerateCount === 0 &&
    familyCapViolations.length === 0 &&
    previewPass &&
    repeatedOpeningViolations === 0 &&
    averageRealism >= 80 &&
    lowRealism / Math.max(1, questions.length) < 0.05
      ? "PASS"
      : "FAIL";
  const exportFolder = await writeProductionExport(questions);
  const report = {
    status,
    totalGenerated: questions.length,
    requestedCount: count,
    averageRealism: Number(averageRealism.toFixed(2)),
    solverMismatch,
    explanationMismatch,
    duplicateFingerprint: duplicateCount,
    undefinedNullNaN: undefinedCount,
    hiPaEnglishLeakage: leakageCount,
    optionQualityIssues: optionIssues,
    degenerateCases: degenerateCount,
    lowRealism,
    familyCapViolations,
    firstWindowPreview: { pass: previewPass, firstWindows },
    repeatedOpening: {
      violations: repeatedOpeningViolations,
      topFirst8: [...opening8.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
      topFullOpening: [...openingFull.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
      topExplanationIntro: [...explanationIntro.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
    },
    familyDistribution: toRecord(familyDistribution),
    topologyDistribution: toRecord(topologyDistribution),
    difficultyDistribution: schedulerSummary.difficultyDistribution,
    generationStats,
    productionExportFolder: exportFolder,
    worst20: worst.slice(0, 20),
  };
  console.log(JSON.stringify(report, null, 2));
  if (status !== "PASS") process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
