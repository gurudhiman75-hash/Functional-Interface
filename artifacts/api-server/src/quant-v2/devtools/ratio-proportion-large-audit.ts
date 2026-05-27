import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2RatioProportionQuestionCandidate } from "../../lib/quant-v2/ratio-proportion-admin-adapter";
import {
  RATIO_PROPORTION_FAMILY_IDS,
} from "../canonical/ratio-proportion-motif-factories";
import type { RatioProportionFamilyId } from "../canonical/ratio-proportion-types";
import {
  createCorpusSchedulerState,
  extractCorpusSchedulerMetadata,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
  type CorpusSchedulerProfileId,
} from "../corpus-scheduler/corpus-scheduler";
import {
  ratioProportionDegenerateReasons,
  validateRatioProportionIndependentSolver,
} from "../validators/ratio-proportion-independent-solver";

const ratioPattern: Pattern = {
  id: "ratio-proportion-large-audit",
  type: "formula",
  section: "Quant",
  topic: "ratio_proportion",
  subtopic: "ratio_proportion",
  difficulty: "Medium",
  templateVariants: ["Ratio, Proportion & Variation V2 large audit pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-ratio-proportion",
};

type AuditExample = {
  index: number;
  family: string;
  topology: string;
  issue: string;
  question: string;
  answer: string;
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
    .replace(/[^\p{L}\p{N}.:%/]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}

function familyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).familyKey;
}

function topologyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).topologyKey;
}

function problemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ??
    (question.semanticMetadata as any)?.problem;
}

function realismOf(question: FormulaQuestion) {
  return Number(question.examRealismMetadata?.realismScore ?? 0);
}

function duplicateFingerprint(question: FormulaQuestion) {
  return [
    normalizeText(question.text),
    normalizeText(answerText(question)),
    [...(question.options ?? [])].map(normalizeText).sort().join("|"),
  ].join("::");
}

function topologyNumericAnswerFingerprint(question: FormulaQuestion) {
  const problem = problemOf(question);
  const signature = problem?.auditMeta?.numericSignature ??
    Object.entries(problem?.variables ?? {})
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}:${value}`)
      .join("|");
  return `${topologyOf(question)}::${signature}::${normalizeText(answerText(question))}`;
}

function explanationText(question: FormulaQuestion) {
  return `${question.explanation ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
}

function malformedMathJax(question: FormulaQuestion) {
  const text = explanationText(question);
  const inlineOpen = (text.match(/\\\(/gu) ?? []).length;
  const inlineClose = (text.match(/\\\)/gu) ?? []).length;
  const displayOpen = (text.match(/\\\[/gu) ?? []).length;
  const displayClose = (text.match(/\\\]/gu) ?? []).length;
  return inlineOpen !== inlineClose || displayOpen !== displayClose;
}

function mathJaxTextLabel(question: FormulaQuestion) {
  return /\\text\{[^}]*[A-Za-z][^}]*\}/u.test(explanationText(question));
}

function bareEquationFragment(question: FormulaQuestion) {
  return /(?:^|\n)\s*=\s*-?\d/u.test(explanationText(question));
}

function optionFormatIssue(question: FormulaQuestion) {
  const options = question.options ?? [];
  const answer = answerText(question);
  if (!options.includes(answer)) return "answer missing from options";
  if (new Set(options).size !== options.length) return "duplicate options";
  if (answer.startsWith("₹") && options.some((option) => !String(option).startsWith("₹"))) {
    return "rupee option format mismatch";
  }
  if (answer.includes(":") && options.some((option) => !String(option).includes(":"))) {
    return "ratio option format mismatch";
  }
  if (/^\d+\/\d+$/u.test(answer) && options.some((option) => !/^\d+\/\d+$/u.test(String(option)))) {
    return "fraction option format mismatch";
  }
  if (answer.endsWith("%") && options.some((option) => !String(option).endsWith("%"))) {
    return "percentage option format mismatch";
  }
  return undefined;
}

function hiPaLeakage(question: FormulaQuestion) {
  const text = `${question.textHi ?? ""}\n${question.textPa ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
  return /\b(?:undefined|null|NaN|Find the|Answer =|Let the|total students|original amount|new ratio|years?|days?|hours?)\b/u.test(text);
}

function hiPaEnglishFormulaLabel(question: FormulaQuestion) {
  return /\\text\{[^}]*[A-Za-z][^}]*\}/u.test(`${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`);
}

function ageSanityIssue(question: FormulaQuestion) {
  const problem = problemOf(question);
  if (
    problem?.family !== "rp_age_future_ratio" &&
    problem?.family !== "rp_age_past_ratio" &&
    problem?.family !== "rp_age_difference_constant" &&
    problem?.family !== "rp_age_multi_generation"
  ) return undefined;
  const variables = problem.variables ?? {};
  const a = Number(variables.a);
  const b = Number(variables.b);
  const k = Number(variables.k);
  const years = Number(variables.years);
  const presentA = a * k;
  const presentB = b * k;
  const answer = Number(problem.answer);
  if (presentA < 5 || presentA > 90 || presentB < 5 || presentB > 90) {
    return `age sanity failure: present ages ${presentA}, ${presentB}`;
  }
  if (answer > 100) return `age sanity failure: answer age ${answer}`;
  const optionAges = (question.options ?? []).map((option) => Number(String(option).match(/-?\d+(?:\.\d+)?/u)?.[0]));
  const badOption = optionAges.find((optionAge) => !Number.isFinite(optionAge) || optionAge <= 0 || optionAge > 100);
  if (badOption !== undefined) return `age sanity failure: option age ${badOption}`;
  if (Number.isFinite(years) && years > 30) return `age sanity failure: offset ${years}`;
  if (problem.family === "rp_age_future_ratio" && (presentA + years > 100 || presentB + years > 100)) {
    return `age sanity failure: future ages ${presentA + years}, ${presentB + years}`;
  }
  if (problem.family === "rp_age_past_ratio" && (presentA - years <= 0 || presentB - years <= 0)) {
    return `age sanity failure: past ages ${presentA - years}, ${presentB - years}`;
  }
  return undefined;
}

function difficultyInflation(question: FormulaQuestion) {
  const family = familyOf(question);
  return /direct_sharing|sum_based|missing_term|ratio_to_fraction|fraction_to_ratio|equivalent_ratio|ratio_to_percentage|percentage_to_ratio/u.test(family) &&
    String(question.difficulty ?? "").toLowerCase() === "hard";
}

function realismInflation(question: FormulaQuestion) {
  const family = familyOf(question);
  return /direct_sharing|sum_based|missing_term|ratio_to_fraction|fraction_to_ratio|equivalent_ratio|ratio_to_percentage|percentage_to_ratio/u.test(family) &&
    realismOf(question) > 80;
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function toRecord(map: Map<string, number>) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1]));
}

function addExample(examples: AuditExample[], question: FormulaQuestion, index: number, issue: string) {
  if (examples.length >= 80) return;
  examples.push({
    index,
    family: familyOf(question),
    topology: topologyOf(question),
    issue,
    question: question.text,
    answer: answerText(question),
  });
}

function configuredFamilyCap(family: string, count: number) {
  if (count >= 500) return 35;
  if (count > 60) return 8;
  return 3;
}

function forcedFamily(slot: number, attempt: number, count: number, keptFamilyCounts: Map<string, number>): RatioProportionFamilyId {
  for (let offset = 0; offset < RATIO_PROPORTION_FAMILY_IDS.length; offset += 1) {
    const family = RATIO_PROPORTION_FAMILY_IDS[(slot + attempt + offset) % RATIO_PROPORTION_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap(family, count)) {
      return family;
    }
  }
  return RATIO_PROPORTION_FAMILY_IDS[(slot + attempt) % RATIO_PROPORTION_FAMILY_IDS.length]!;
}

function validateQuestion(question: FormulaQuestion) {
  const problem = problemOf(question);
  const solver = validateRatioProportionIndependentSolver({
    problem,
    explanation: question.explanation,
    options: question.options,
    correct: question.correct,
  });
  return [...solver.issues, ...ratioProportionDegenerateReasons(problem)];
}

function generateQuestions(count: number, seed: string, profileId: CorpusSchedulerProfileId) {
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId,
  });
  const questions: FormulaQuestion[] = [];
  const keptFingerprints = new Set<string>();
  const keptTopologyNumericFingerprints = new Set<string>();
  const keptFamilyCounts = new Map<string, number>();
  const generationStats = {
    totalAttempts: 0,
    skippedCandidates: 0,
    localRejectReasons: {} as Record<string, number>,
  };
  const reject = (reason: string) => {
    generationStats.skippedCandidates += 1;
    generationStats.localRejectReasons[reason] =
      (generationStats.localRejectReasons[reason] ?? 0) + 1;
  };
  const maxAttempts = Math.max(count * 45, count + 2500);

  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    generationStats.totalAttempts += 1;
    try {
      const forcedMotifId = forcedFamily(questions.length, attempt, count, keptFamilyCounts);
      const result = generateScheduledQuestion({
        state,
        index: questions.length,
        seedPrefix: `${seed}:ratio-audit:${attempt}`,
        examProfile: "ssc",
        forcedMotifId,
        generate: (options) =>
          createQuantV2RatioProportionQuestionCandidate(ratioPattern, options),
      });
      const question = result.question;
      const family = familyOf(question);
      if ((keptFamilyCounts.get(family) ?? 0) >= configuredFamilyCap(family, count)) {
        reject(`family cap reached: ${family}`);
        continue;
      }
      const fingerprint = duplicateFingerprint(question);
      if (keptFingerprints.has(fingerprint)) {
        reject("duplicate fingerprint");
        continue;
      }
      const numericFingerprint = topologyNumericAnswerFingerprint(question);
      if (keptTopologyNumericFingerprints.has(numericFingerprint)) {
        reject("topology numeric answer duplicate");
        continue;
      }
      const optionIssue = optionFormatIssue(question);
      if (optionIssue) {
        reject(optionIssue);
        continue;
      }
      const validationIssues = validateQuestion(question);
      if (validationIssues.length) {
        reject(`validation: ${validationIssues[0]}`);
        continue;
      }
      keptFingerprints.add(fingerprint);
      keptTopologyNumericFingerprints.add(numericFingerprint);
      increment(keptFamilyCounts, family);
      questions.push(question);
    } catch (error) {
      reject(error instanceof Error ? `generation throw: ${error.message}` : "generation throw");
    }
  }

  if (questions.length < count) {
    throw new Error(
      `Ratio/Proportion audit generated ${questions.length}/${count} clean questions. ${JSON.stringify(generationStats)}`,
    );
  }

  return {
    questions: interleaveScheduledPreviewQuestions(questions, seed, familyOf),
    schedulerSummary: summarizeCorpusScheduler(state),
    generationStats,
  };
}

function renderQuestionText(questions: readonly FormulaQuestion[]) {
  return questions.map((question, index) => {
    const options = question.options.map((option, optionIndex) =>
      `${String.fromCharCode(65 + optionIndex)}. ${option}`,
    ).join("\n");
    return [
      `Q${index + 1}. ${question.text}`,
      options,
      `Answer: ${answerText(question)}`,
      `Difficulty: ${question.difficulty}`,
      `Family: ${familyOf(question)}`,
      "Explanation:",
      question.explanation,
    ].join("\n");
  }).join("\n\n---\n\n");
}

function previewBatchSignature(questions: readonly FormulaQuestion[]) {
  return questions.slice(0, 50).map(duplicateFingerprint).join("\n");
}

async function main() {
  const count = parseCount();
  const explicitSeed = argValue("seed");
  const seed = explicitSeed ?? `ratio-proportion-large:${count}:${randomUUID()}`;
  const timestamp = new Date().toISOString().replace(/[:.]/gu, "-");
  const exportDir = path.resolve(process.cwd(), "exports", `ratio-proportion-v2-${timestamp}`);

  const production = generateQuestions(60, `${seed}:production-60`, "ratio_production_60");
  const review = generateQuestions(100, `${seed}:review-100`, "ratio_review_100");
  const large = generateQuestions(count, seed, "ratio_balanced");

  const familyDistribution = new Map<string, number>();
  const topologyDistribution = new Map<string, number>();
  const difficultyDistribution = new Map<string, number>();
  const duplicateSeen = new Set<string>();
  const topologyNumericSeen = new Set<string>();
  const openingCounts = new Map<string, number>();
  const examples: AuditExample[] = [];
  const counters = {
    solverMismatch: 0,
    explanationMismatch: 0,
    duplicateFingerprint: 0,
    topologyNumericDuplicate: 0,
    topologyMismatch: 0,
    malformedMathJax: 0,
    mathJaxTextLabels: 0,
    bareEquationFragment: 0,
    optionFormatIssues: 0,
    hiPaLeakage: 0,
    hiPaEnglishFormulaLabels: 0,
    ageSanityFailures: 0,
    difficultyInflation: 0,
    realismInflation: 0,
    repeatedOpening: 0,
    familyCapViolation: 0,
    same50BatchRepeat: 0,
  };
  let realismTotal = 0;
  let realismMin = Number.POSITIVE_INFINITY;
  let realismMax = 0;

  large.questions.forEach((question, index) => {
    const family = familyOf(question);
    const topology = topologyOf(question);
    const realism = realismOf(question);
    realismTotal += realism;
    realismMin = Math.min(realismMin, realism);
    realismMax = Math.max(realismMax, realism);
    increment(familyDistribution, family);
    increment(topologyDistribution, topology);
    increment(difficultyDistribution, String(question.difficulty ?? "unknown").toLowerCase());

    const opening = String(question.text ?? "")
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .split(/\s+/u)
      .filter(Boolean)
      .slice(0, 6)
      .join(" ")
      .toLowerCase();
    if (opening) increment(openingCounts, opening);

    const validationIssues = validateQuestion(question);
    for (const issue of validationIssues) {
      if (/explanation final answer mismatch/u.test(issue)) counters.explanationMismatch += 1;
      else if (/topology|variation|transfer|geometry|chain|sharing|recovery/u.test(issue)) counters.topologyMismatch += 1;
      else counters.solverMismatch += 1;
      addExample(examples, question, index, issue);
    }
    const fingerprint = duplicateFingerprint(question);
    if (duplicateSeen.has(fingerprint)) {
      counters.duplicateFingerprint += 1;
      addExample(examples, question, index, "duplicate fingerprint");
    }
    duplicateSeen.add(fingerprint);
    const numericFingerprint = topologyNumericAnswerFingerprint(question);
    if (topologyNumericSeen.has(numericFingerprint)) {
      counters.topologyNumericDuplicate += 1;
      addExample(examples, question, index, "same topology + numeric tuple + answer");
    }
    topologyNumericSeen.add(numericFingerprint);
    if (malformedMathJax(question)) {
      counters.malformedMathJax += 1;
      addExample(examples, question, index, "malformed MathJax");
    }
    if (mathJaxTextLabel(question)) {
      counters.mathJaxTextLabels += 1;
      addExample(examples, question, index, "MathJax text label");
    }
    if (bareEquationFragment(question)) {
      counters.bareEquationFragment += 1;
      addExample(examples, question, index, "bare equation fragment");
    }
    const optionIssue = optionFormatIssue(question);
    if (optionIssue) {
      counters.optionFormatIssues += 1;
      addExample(examples, question, index, optionIssue);
    }
    if (hiPaLeakage(question)) {
      counters.hiPaLeakage += 1;
      addExample(examples, question, index, "HI/PA leakage");
    }
    if (hiPaEnglishFormulaLabel(question)) {
      counters.hiPaEnglishFormulaLabels += 1;
      addExample(examples, question, index, "HI/PA English formula label");
    }
    const ageIssue = ageSanityIssue(question);
    if (ageIssue) {
      counters.ageSanityFailures += 1;
      addExample(examples, question, index, ageIssue);
    }
    if (difficultyInflation(question)) {
      counters.difficultyInflation += 1;
      addExample(examples, question, index, "direct formula marked Hard");
    }
    if (realismInflation(question)) {
      counters.realismInflation += 1;
      addExample(examples, question, index, "basic formula realism > 80");
    }
  });

  let repeatedOpeningMax = 0;
  for (const [, actual] of openingCounts) {
    repeatedOpeningMax = Math.max(repeatedOpeningMax, actual);
  }

  for (const [opening, actual] of openingCounts) {
    if (actual > Math.max(6, Math.floor(large.questions.length * 0.025))) {
      counters.repeatedOpening += 1;
      examples.push({
        index: -1,
        family: "opening",
        topology: "opening",
        issue: `first six words repeated ${actual} times: ${opening}`,
        question: "(distribution)",
        answer: "",
      });
    }
  }
  for (const [family, actual] of familyDistribution) {
    const cap = configuredFamilyCap(family, count);
    if (actual > cap) {
      counters.familyCapViolation += 1;
      examples.push({
        index: -1,
        family,
        topology: family,
        issue: `family cap exceeded ${actual}/${cap}`,
        question: "(distribution)",
        answer: "",
      });
    }
  }

  const randomA = generateQuestions(50, `ratio-random-a:${randomUUID()}`, "ratio_balanced");
  const randomB = generateQuestions(50, `ratio-random-b:${randomUUID()}`, "ratio_balanced");
  if (previewBatchSignature(randomA.questions) === previewBatchSignature(randomB.questions)) {
    counters.same50BatchRepeat += 1;
  }

  const summary = {
    status: Object.values(counters).every((value) => value === 0) ? "PASS" : "FAIL",
    seed,
    explicitSeed: Boolean(explicitSeed),
    exportDir,
    count: large.questions.length,
    motifsFullyImplemented: RATIO_PROPORTION_FAMILY_IDS,
    familyDistribution: toRecord(familyDistribution),
    topologyDistribution: toRecord(topologyDistribution),
    difficultyDistribution: toRecord(difficultyDistribution),
    realism: {
      min: realismMin,
      average: Number((realismTotal / large.questions.length).toFixed(2)),
      max: realismMax,
    },
    duplicateCount: counters.duplicateFingerprint,
    topologyMismatchCount: counters.topologyMismatch,
    hiPaLeakageCount: counters.hiPaLeakage,
    repeatedOpeningMax,
    counters,
    schedulerSummary: large.schedulerSummary,
    generationStats: large.generationStats,
    worstExamples: examples.slice(0, 30),
  };

  await mkdir(exportDir, { recursive: true });
  await writeFile(path.join(exportDir, "ratio-proportion-production-60.txt"), renderQuestionText(production.questions), "utf8");
  await writeFile(path.join(exportDir, "ratio-proportion-review-100.txt"), renderQuestionText(review.questions), "utf8");
  await writeFile(path.join(exportDir, "ratio-proportion-large-audit.txt"), renderQuestionText(large.questions), "utf8");
  await writeFile(path.join(exportDir, "ratio-proportion-large-summary.json"), JSON.stringify(summary, null, 2), "utf8");

  console.log(JSON.stringify(summary, null, 2));
  if (summary.status !== "PASS") {
    process.exitCode = 1;
  }
}

if (process.argv[1]?.endsWith("ratio-proportion-large-audit.mjs")) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
