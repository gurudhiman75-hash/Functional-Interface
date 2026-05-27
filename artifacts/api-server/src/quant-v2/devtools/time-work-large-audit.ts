import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2TimeWorkQuestionCandidate } from "../../lib/quant-v2/time-work-admin-adapter";
import {
  TIME_WORK_FAMILY_IDS,
  TIME_WORK_FAMILY_STEM_BANK,
  TIME_WORK_STEM_TEMPLATE_COVERAGE,
} from "../canonical/time-work-motif-factories";
import type { TimeWorkFamilyId } from "../canonical/time-work-types";
import {
  createCorpusSchedulerState,
  extractCorpusSchedulerMetadata,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
  type CorpusSchedulerProfileId,
} from "../corpus-scheduler/corpus-scheduler";
import {
  timeWorkDegenerateReasons,
  validateTimeWorkIndependentSolver,
} from "../validators/time-work-independent-solver";

const timeWorkPattern: Pattern = {
  id: "time-work-large-audit",
  type: "formula",
  section: "Quant",
  topic: "time_work",
  subtopic: "time_work",
  difficulty: "Medium",
  templateVariants: ["Time & Work / Pipes & Cisterns V2 large audit pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-time-work",
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

function exactStemFingerprint(question: FormulaQuestion) {
  return normalizeText(question.text);
}

function topologyOpeningAnswerFingerprint(question: FormulaQuestion) {
  return [
    topologyOf(question),
    repeatedOpeningKey(question),
    normalizeText(answerText(question)),
  ].join("::");
}

function appliedContextKey(question: FormulaQuestion) {
  const family = familyOf(question);
  if (/machine|typing|printer|productivity|parallel_machine/u.test(family)) return "machine-output";
  if (/man_days|farm_harvest|road_construction|painting/u.test(family)) return "man-days-hours";
  if (/leak|fill_empty|fillers|pipe|tank|capacity/u.test(family)) return "pipes-leaks";
  if (/alternating|cycle|work_rest|conditional/u.test(family)) return "alternating-cycles";
  if (/wage|contract/u.test(family)) return "wages-contracts";
  if (/food|resource/u.test(family)) return "food-resources";
  return "";
}

function appliedContextCap(count: number) {
  return Math.max(12, Math.floor(count * 0.22));
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

function bareEquationFragment(question: FormulaQuestion) {
  return /(?:^|\n)\s*=\s*-?\d/u.test(explanationText(question));
}

function shortcutIssue(question: FormulaQuestion) {
  const text = explanationText(question);
  return !/Shortcut \/ Exam Method/u.test(String(question.explanation ?? "")) ||
    !/शॉर्टकट \/ परीक्षा विधि/u.test(String(question.explanationHi ?? "")) ||
    !/ਸ਼ਾਰਟਕਟ \/ ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ/u.test(String(question.explanationPa ?? ""));
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
  if (/\b(?:day|hour|minute|worker|litres|pages|sheets|units|items)\b/u.test(answer)) {
    const unit = answer.replace(/^.*?\b(day|days|hour|hours|minute|minutes|worker|workers|litres|pages|sheets|units|items)\b.*$/u, "$1").replace(/s$/u, "");
    if (options.some((option) => !new RegExp(`${unit}s?\\b`, "u").test(String(option)))) {
      return "unit option format mismatch";
    }
  }
  return undefined;
}

function hiPaLeakage(question: FormulaQuestion) {
  const text = `${question.textHi ?? ""}\n${question.textPa ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
  return /\b(?:undefined|null|NaN|Find the|Answer =|days?|hours?|minutes?|workers?|pipes?|tank|work units|Shortcut \/ Exam Method)\b/u.test(text);
}

function invalidNoneStem(question: FormulaQuestion) {
  return /\bnone\b|none hours|none days|empty time none/iu.test(String(question.text ?? ""));
}

function mechanicalStem(question: FormulaQuestion) {
  return /^(?:Pipe data are|Parallel rates are|Use net pipe rate)\b/u.test(String(question.text ?? "").trim());
}

function internalStemPhrase(question: FormulaQuestion) {
  return /\b(?:motif|topology|rate-state|rate|rates|asked value|required value|combined time|completion time in|one-day output|one-day outputs are|produce units per turn|final cycle|terminal|full cycles|net rate|phase relation|parallel rates|pipe data|work system|configured|scenario|working capacity|work in the ratio|A:B working capacity|Find A'?s individual time in days|Three machines work in parallel|total work is|find the output in|worker counts|daily counts|daily file counts|daily item counts|active working days|given operating hours|known worker time|given individual times|stated hours|work may finish before both turns are over)\b/iu.test(String(question.text ?? ""));
}

function missingQuestionMark(question: FormulaQuestion) {
  return !/\?\s*$/u.test(String(question.text ?? "").trim());
}

function missingClearAskPhrase(question: FormulaQuestion) {
  return !/\b(?:how many|how long|how much|what|when|find|for how many|in how many|by how many)\b/iu.test(String(question.text ?? ""));
}

function missingAnswerUnit(question: FormulaQuestion) {
  const text = String(question.text ?? "");
  const answer = answerText(question);
  if (/\bdays?\b/u.test(answer)) return !/\b(?:days?|how long|duration|time|last|take|needed|when)\b/iu.test(text);
  if (/\bhours?\b/u.test(answer)) return !/\b(?:hours?|how long|duration|time|take|needed|when)\b/iu.test(text);
  if (/\bminutes?\b/u.test(answer)) return !/\b(?:minutes?|how long|duration|time|take|needed|when)\b/iu.test(text);
  if (/\bworkers?\b/u.test(answer)) return !/\b(?:workers?|men|women|painters|typists|printers)\b/iu.test(text);
  if (/\bpages?\b/u.test(answer)) return !/\bpages?\b/iu.test(text);
  if (/\blitres?\b/u.test(answer)) return !/\b(?:litres?|water|tank)\b/iu.test(text);
  if (/\bitems?\b/u.test(answer)) return !/\b(?:items?|forms?|files?|records?|documents?|toys?|boxes|parts?)\b/iu.test(text);
  if (/\bsheets?\b/u.test(answer)) return !/\b(?:sheets?|answer sheets?)\b/iu.test(text);
  if (/^₹/u.test(answer)) return !/₹|share|payment|wage|earning|amount/iu.test(text);
  if (/^\d+\s*:\s*\d+/u.test(answer)) return !/(?:\bratio\b|A:B|B:C|A:B:C)/iu.test(text);
  if (/^\d+\s*\/\s*\d+/u.test(answer)) return !/\b(?:fraction|part|what part|what fraction)\b/iu.test(text);
  return false;
}

function genericUnitsOfWork(question: FormulaQuestion) {
  return /\b(?:units of work|work units|total work is \d+ units|produce \d+[^.?!]*units per turn|one-day outputs? are)\b/iu.test(String(question.text ?? ""));
}

function hiPaStemSkeletonLeakage(question: FormulaQuestion) {
  const text = `${question.textHi ?? ""}\n${question.textPa ?? ""}`;
  return /\b(?:Find the|How many|What is|in how many|workers?|days?|hours?|minutes?|files?|forms?|pages?|tank|pipe data|parallel rates|given opening|condition|Pipe A is|Pipe B is|scenario|units of work|work units)\b/iu.test(text);
}

function genericExplanationShell(question: FormulaQuestion) {
  return /Use the governing rate-state formula|Substitute the given values|Therefore the required answer is obtained/u.test(explanationText(question));
}

function hiPaFormulaEnglishLeakage(question: FormulaQuestion) {
  const text = `${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
  const formulas = text.match(/\\\[[\s\S]*?\\\]/gu) ?? [];
  return formulas.some((formula) =>
    /\b(?:work left|remaining|net rate|full cycles|terminal fill|phase1|phase2|required|current|total rate|active days|acceptance rate|extra inflow)\b/iu.test(formula),
  );
}

function genericShortcutIssue(question: FormulaQuestion) {
  const text = explanationText(question);
  return /Shortcut \/ Exam Method:[\s\S]*?(?:remaining\/net|full\\ cycles|terminal\\ fill|phase1|phase2|required-current|total\\ rate|rate\\times time|stock\/rate)/u.test(text) ||
    /शॉर्टकट \/ परीक्षा विधि:[\s\S]*?(?:remaining|net rate|full cycles|terminal fill|phase1|phase2|required-current|total rate)/iu.test(text) ||
    /ਸ਼ਾਰਟਕਟ \/ ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ:[\s\S]*?(?:remaining|net rate|full cycles|terminal fill|phase1|phase2|required-current|total rate)/iu.test(text);
}

function uglyDecimalIssue(question: FormulaQuestion) {
  const text = [
    question.text,
    question.explanation,
    question.explanationHi,
    question.explanationPa,
    ...(question.options ?? []),
  ].filter(Boolean).join("\n");
  return /\d+\.(?:33|67)\b/u.test(text);
}

function repeatedOpeningKey(question: FormulaQuestion) {
  return String(question.text ?? "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 8)
    .join(" ")
    .toLowerCase();
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
  if (count >= 500) return 12;
  if (count > 60) return 4;
  return 2;
}

function forcedFamily(slot: number, attempt: number, count: number, keptFamilyCounts: Map<string, number>): TimeWorkFamilyId {
  for (let offset = 0; offset < TIME_WORK_FAMILY_IDS.length; offset += 1) {
    const family = TIME_WORK_FAMILY_IDS[(slot + attempt + offset) % TIME_WORK_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap(family, count)) {
      return family;
    }
  }
  return TIME_WORK_FAMILY_IDS[(slot + attempt) % TIME_WORK_FAMILY_IDS.length]!;
}

function validateQuestion(question: FormulaQuestion) {
  const problem = problemOf(question);
  const solver = validateTimeWorkIndependentSolver({
    problem,
    explanation: question.explanation,
    options: question.options,
    correct: question.correct,
  });
  return [...solver.issues, ...timeWorkDegenerateReasons(problem)];
}

function generateQuestions(count: number, seed: string, profileId: CorpusSchedulerProfileId) {
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId,
  });
  const questions: FormulaQuestion[] = [];
  const keptFingerprints = new Set<string>();
  const keptStemFingerprints = new Set<string>();
  const keptTopologyNumericFingerprints = new Set<string>();
  const keptTopologyOpeningAnswerFingerprints = new Set<string>();
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
  const maxAttempts = Math.max(count * 35, count + 2500);

  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    generationStats.totalAttempts += 1;
    try {
      const forcedMotifId = forcedFamily(questions.length, attempt, count, keptFamilyCounts);
      const result = generateScheduledQuestion({
        state,
        index: questions.length,
        seedPrefix: `${seed}:time-work-audit:${attempt}`,
        examProfile: "ssc",
        forcedMotifId,
        generate: (options) =>
          createQuantV2TimeWorkQuestionCandidate(timeWorkPattern, options),
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
      const stemFingerprint = exactStemFingerprint(question);
      if (keptStemFingerprints.has(stemFingerprint)) {
        reject("exact duplicate EN stem");
        continue;
      }
      const numericFingerprint = topologyNumericAnswerFingerprint(question);
      if (keptTopologyNumericFingerprints.has(numericFingerprint)) {
        reject("topology numeric answer duplicate");
        continue;
      }
      const openingAnswerFingerprint = topologyOpeningAnswerFingerprint(question);
      if (keptTopologyOpeningAnswerFingerprints.has(openingAnswerFingerprint)) {
        reject("topology opening answer duplicate");
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
      keptStemFingerprints.add(stemFingerprint);
      keptTopologyNumericFingerprints.add(numericFingerprint);
      keptTopologyOpeningAnswerFingerprints.add(openingAnswerFingerprint);
      increment(keptFamilyCounts, family);
      questions.push(question);
    } catch (error) {
      reject(error instanceof Error ? `generation throw: ${error.message}` : "generation throw");
    }
  }

  if (questions.length < count) {
    throw new Error(
      `Time Work audit generated ${questions.length}/${count} clean questions. ${JSON.stringify(generationStats)}`,
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
  const seed = explicitSeed ?? `time-work-large:${count}:${randomUUID()}`;
  const timestamp = new Date().toISOString().replace(/[:.]/gu, "-");
  const exportDir = path.resolve(process.cwd(), "exports", `time-work-v2-${timestamp}`);

  const production = generateQuestions(60, `${seed}:production-60`, "time_work_production_60");
  const review = generateQuestions(100, `${seed}:review-100`, "time_work_review_100");
  const large = generateQuestions(count, seed, "time_work_balanced");

  const familyDistribution = new Map<string, number>();
  const topologyDistribution = new Map<string, number>();
  const difficultyDistribution = new Map<string, number>();
  const duplicateSeen = new Set<string>();
  const exactStemSeen = new Set<string>();
  const topologyNumericSeen = new Set<string>();
  const topologyOpeningAnswerSeen = new Set<string>();
  const openingCounts = new Map<string, number>();
  const appliedContextCounts = new Map<string, number>();
  const examples: AuditExample[] = [];
  const counters = {
    solverMismatch: 0,
    explanationMismatch: 0,
    duplicateFingerprint: 0,
    exactDuplicateStem: 0,
    topologyNumericDuplicate: 0,
    topologyOpeningAnswerDuplicate: 0,
    topologyMismatch: 0,
    malformedMathJax: 0,
    bareEquationFragment: 0,
    shortcutIssue: 0,
    optionFormatIssues: 0,
    hiPaLeakage: 0,
    invalidNoneStem: 0,
    mechanicalStem: 0,
    internalStemPhrase: 0,
    missingQuestionMark: 0,
    missingAskPhrase: 0,
    missingAnswerUnit: 0,
    genericUnitsOfWork: 0,
    hiPaStemSkeletonLeakage: 0,
    familyTemplateCoverage: 0,
    genericExplanationShell: 0,
    hiPaFormulaEnglishLeakage: 0,
    genericShortcutIssue: 0,
    uglyDecimal: 0,
    repeatedOpening: 0,
    repeatedAppliedContext: 0,
    familyCapViolation: 0,
    same50BatchRepeat: 0,
  };
  let realismTotal = 0;
  let realismMin = Number.POSITIVE_INFINITY;
  let realismMax = 0;
  const familyTemplateCoverageFailures = TIME_WORK_FAMILY_IDS.filter((family) => {
    const bank = TIME_WORK_FAMILY_STEM_BANK[family];
    return (TIME_WORK_STEM_TEMPLATE_COVERAGE[bank] ?? 0) < 4;
  });
  counters.familyTemplateCoverage = familyTemplateCoverageFailures.length;
  let repeatedContextMax = 0;

  const scanSetDuplicateGates = (label: string, questions: readonly FormulaQuestion[]) => {
    const stems = new Set<string>();
    const numericFingerprints = new Set<string>();
    const openingAnswerFingerprints = new Set<string>();
    const contextCounts = new Map<string, number>();
    questions.forEach((question, index) => {
      const stem = exactStemFingerprint(question);
      if (stems.has(stem)) {
        counters.exactDuplicateStem += 1;
        addExample(examples, question, index, `${label}: exact duplicate EN stem`);
      }
      stems.add(stem);

      const numeric = topologyNumericAnswerFingerprint(question);
      if (numericFingerprints.has(numeric)) {
        counters.topologyNumericDuplicate += 1;
        addExample(examples, question, index, `${label}: same topology + numeric tuple + answer`);
      }
      numericFingerprints.add(numeric);

      const openingAnswer = topologyOpeningAnswerFingerprint(question);
      if (openingAnswerFingerprints.has(openingAnswer)) {
        counters.topologyOpeningAnswerDuplicate += 1;
        addExample(examples, question, index, `${label}: same topology + opening + answer`);
      }
      openingAnswerFingerprints.add(openingAnswer);

      if (internalStemPhrase(question)) {
        counters.internalStemPhrase += 1;
        addExample(examples, question, index, `${label}: stem contains internal generator wording`);
      }

      const context = appliedContextKey(question);
      if (context) increment(contextCounts, context);
    });
    for (const [context, actual] of contextCounts) {
      repeatedContextMax = Math.max(repeatedContextMax, actual);
      const cap = appliedContextCap(questions.length);
      if (actual > cap) {
        counters.repeatedAppliedContext += 1;
        examples.push({
          index: -1,
          family: context,
          topology: context,
          issue: `${label}: applied context repeated ${actual}/${cap}`,
          question: "(distribution)",
          answer: "",
        });
      }
    }
  };

  scanSetDuplicateGates("production-60", production.questions);
  scanSetDuplicateGates("review-100", review.questions);

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

    const opening = repeatedOpeningKey(question);
    if (opening) increment(openingCounts, opening);
    const context = appliedContextKey(question);
    if (context) increment(appliedContextCounts, context);

    const validationIssues = validateQuestion(question);
    for (const issue of validationIssues) {
      if (/explanation final answer mismatch/u.test(issue)) counters.explanationMismatch += 1;
      else if (/topology|cycle|pipe|phase|resource|wage|efficiency/u.test(issue)) counters.topologyMismatch += 1;
      else counters.solverMismatch += 1;
      addExample(examples, question, index, issue);
    }
    const fingerprint = duplicateFingerprint(question);
    if (duplicateSeen.has(fingerprint)) {
      counters.duplicateFingerprint += 1;
      addExample(examples, question, index, "duplicate fingerprint");
    }
    duplicateSeen.add(fingerprint);
    const stemFingerprint = exactStemFingerprint(question);
    if (exactStemSeen.has(stemFingerprint)) {
      counters.exactDuplicateStem += 1;
      addExample(examples, question, index, "exact duplicate EN stem");
    }
    exactStemSeen.add(stemFingerprint);
    const numericFingerprint = topologyNumericAnswerFingerprint(question);
    if (topologyNumericSeen.has(numericFingerprint)) {
      counters.topologyNumericDuplicate += 1;
      addExample(examples, question, index, "same topology + numeric tuple + answer");
    }
    topologyNumericSeen.add(numericFingerprint);
    const openingAnswerFingerprint = topologyOpeningAnswerFingerprint(question);
    if (topologyOpeningAnswerSeen.has(openingAnswerFingerprint)) {
      counters.topologyOpeningAnswerDuplicate += 1;
      addExample(examples, question, index, "same topology + opening + answer");
    }
    topologyOpeningAnswerSeen.add(openingAnswerFingerprint);
    if (malformedMathJax(question)) {
      counters.malformedMathJax += 1;
      addExample(examples, question, index, "malformed MathJax");
    }
    if (bareEquationFragment(question)) {
      counters.bareEquationFragment += 1;
      addExample(examples, question, index, "bare equation fragment");
    }
    if (shortcutIssue(question)) {
      counters.shortcutIssue += 1;
      addExample(examples, question, index, "missing shortcut block");
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
    if (invalidNoneStem(question)) {
      counters.invalidNoneStem += 1;
      addExample(examples, question, index, "stem contains invalid none text");
    }
    if (mechanicalStem(question)) {
      counters.mechanicalStem += 1;
      addExample(examples, question, index, "mechanical stem opening");
    }
    if (internalStemPhrase(question)) {
      counters.internalStemPhrase += 1;
      addExample(examples, question, index, "stem contains internal generator wording");
    }
    if (missingQuestionMark(question)) {
      counters.missingQuestionMark += 1;
      addExample(examples, question, index, "stem does not end with question mark");
    }
    if (missingClearAskPhrase(question)) {
      counters.missingAskPhrase += 1;
      addExample(examples, question, index, "stem has no clear ask phrase");
    }
    if (missingAnswerUnit(question)) {
      counters.missingAnswerUnit += 1;
      addExample(examples, question, index, "stem does not expose answer unit clearly");
    }
    if (genericUnitsOfWork(question)) {
      counters.genericUnitsOfWork += 1;
      addExample(examples, question, index, "stem exposes generic units of work");
    }
    if (hiPaStemSkeletonLeakage(question)) {
      counters.hiPaStemSkeletonLeakage += 1;
      addExample(examples, question, index, "HI/PA stem contains English skeleton phrase");
    }
    if (genericExplanationShell(question)) {
      counters.genericExplanationShell += 1;
      addExample(examples, question, index, "generic explanation shell");
    }
    if (hiPaFormulaEnglishLeakage(question)) {
      counters.hiPaFormulaEnglishLeakage += 1;
      addExample(examples, question, index, "HI/PA formula English leakage");
    }
    if (genericShortcutIssue(question)) {
      counters.genericShortcutIssue += 1;
      addExample(examples, question, index, "generic shortcut block");
    }
    if (uglyDecimalIssue(question)) {
      counters.uglyDecimal += 1;
      addExample(examples, question, index, "ugly decimal");
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
        issue: `first eight words repeated ${actual} times: ${opening}`,
        question: "(distribution)",
        answer: "",
      });
    }
  }
  for (const [context, actual] of appliedContextCounts) {
    repeatedContextMax = Math.max(repeatedContextMax, actual);
    const cap = appliedContextCap(large.questions.length);
    if (actual > cap) {
      counters.repeatedAppliedContext += 1;
      examples.push({
        index: -1,
        family: context,
        topology: context,
        issue: `large audit: applied context repeated ${actual}/${cap}`,
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

  const randomA = generateQuestions(50, `time-work-random-a:${randomUUID()}`, "time_work_balanced");
  const randomB = generateQuestions(50, `time-work-random-b:${randomUUID()}`, "time_work_balanced");
  if (previewBatchSignature(randomA.questions) === previewBatchSignature(randomB.questions)) {
    counters.same50BatchRepeat += 1;
  }

  const summary = {
    status: Object.values(counters).every((value) => value === 0) ? "PASS" : "FAIL",
    seed,
    explicitSeed: Boolean(explicitSeed),
    exportDir,
    count: large.questions.length,
    motifsFullyImplemented: TIME_WORK_FAMILY_IDS,
    motifsHiddenTodo: [],
    familyDistribution: toRecord(familyDistribution),
    topologyDistribution: toRecord(topologyDistribution),
    difficultyDistribution: toRecord(difficultyDistribution),
    realism: {
      min: realismMin,
      average: Number((realismTotal / large.questions.length).toFixed(2)),
      max: realismMax,
    },
    duplicateCount: counters.duplicateFingerprint,
    exactDuplicateStemCount: counters.exactDuplicateStem,
    nearDuplicateCount: counters.topologyNumericDuplicate,
    topologyOpeningAnswerDuplicateCount: counters.topologyOpeningAnswerDuplicate,
    topologyMismatchCount: counters.topologyMismatch,
    hiPaLeakageCount: counters.hiPaLeakage,
    invalidNoneCount: counters.invalidNoneStem,
    mechanicalStemCount: counters.mechanicalStem,
    bannedInternalPhraseCount: counters.internalStemPhrase,
    missingQuestionMarkCount: counters.missingQuestionMark,
    missingAskPhraseCount: counters.missingAskPhrase,
    missingAnswerUnitCount: counters.missingAnswerUnit,
    genericUnitsOfWorkCount: counters.genericUnitsOfWork,
    hiPaStemSkeletonLeakageCount: counters.hiPaStemSkeletonLeakage,
    familyTemplateCoverageCount: {
      total: TIME_WORK_FAMILY_IDS.length,
      passing: TIME_WORK_FAMILY_IDS.length - familyTemplateCoverageFailures.length,
      failing: familyTemplateCoverageFailures,
    },
    genericExplanationShellCount: counters.genericExplanationShell,
    hiPaFormulaEnglishLeakageCount: counters.hiPaFormulaEnglishLeakage,
    uglyDecimalCount: counters.uglyDecimal,
    repeatedOpeningMax,
    repeatedContextMax,
    repeatedAppliedContextCount: counters.repeatedAppliedContext,
    counters,
    schedulerSummary: large.schedulerSummary,
    generationStats: large.generationStats,
    worstExamples: examples.slice(0, 30),
  };

  await mkdir(exportDir, { recursive: true });
  await writeFile(path.join(exportDir, "time-work-production-60.txt"), renderQuestionText(production.questions), "utf8");
  await writeFile(path.join(exportDir, "time-work-review-100.txt"), renderQuestionText(review.questions), "utf8");
  await writeFile(path.join(exportDir, "time-work-large-audit.txt"), renderQuestionText(large.questions), "utf8");
  await writeFile(path.join(exportDir, "time-work-large-summary.json"), JSON.stringify(summary, null, 2), "utf8");

  console.log(JSON.stringify(summary, null, 2));
  if (summary.status !== "PASS") {
    process.exitCode = 1;
  }
}

if (process.argv[1]?.endsWith("time-work-large-audit.mjs")) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
