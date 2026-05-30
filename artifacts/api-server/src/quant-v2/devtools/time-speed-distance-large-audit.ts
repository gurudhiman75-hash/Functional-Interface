import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2TimeSpeedDistanceQuestionCandidate } from "../../lib/quant-v2/time-speed-distance-admin-adapter";
import {
  TIME_SPEED_DISTANCE_FAMILY_IDS,
  TIME_SPEED_DISTANCE_FAMILY_STEM_BANK,
  TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS,
  TIME_SPEED_DISTANCE_STEM_TEMPLATE_COVERAGE,
} from "../canonical/time-speed-distance-motif-factories";
import type { TimeSpeedDistanceFamilyId } from "../canonical/time-speed-distance-types";
import {
  createCorpusSchedulerState,
  extractCorpusSchedulerMetadata,
  generateScheduledQuestion,
  summarizeCorpusScheduler,
} from "../corpus-scheduler/corpus-scheduler";
import {
  timeSpeedDistanceDegenerateReasons,
  validateTimeSpeedDistanceIndependentSolver,
} from "../validators/time-speed-distance-independent-solver";

const tsdPattern: Pattern = {
  id: "time-speed-distance-large-audit",
  type: "formula",
  section: "Quant",
  topic: "time_speed_distance",
  subtopic: "time_speed_distance",
  difficulty: "Medium",
  templateVariants: ["Time, Speed & Distance V2 large audit pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-time-speed-distance",
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

function explanationText(question: FormulaQuestion) {
  return `${question.explanation ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
}

function malformedMathJax(question: FormulaQuestion) {
  const text = explanationText(question);
  return (text.match(/\\\[/gu) ?? []).length !== (text.match(/\\\]/gu) ?? []).length ||
    (text.match(/\\\(/gu) ?? []).length !== (text.match(/\\\)/gu) ?? []).length;
}

function formulaBodies(text: string) {
  return text.match(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/gu) ?? [];
}

function normalizedFormulaText(formula: string) {
  return formula.replace(/\\/gu, " ").replace(/[_{}^]/gu, " ").replace(/\s+/gu, " ").trim();
}

function rawEnglishInsideMathJaxText(text: string) {
  return formulaBodies(text).filter((formula) =>
    /\b(?:speed|distance|time|relative|head start|crossing|platform|bridge|train length|average|downstream|upstream|stream|race|lead|steps|answer|asked value|required value)\b/iu.test(normalizedFormulaText(formula)),
  ).length;
}

function genericExplanationShellText(text: string) {
  return (text.match(/Use the governing formula|Substitute the given values|Substitute the values|Solve for the asked value|Simplify to get the answer|Write the rate relation used in this question|Substitute the two speeds|Solve for the usual time|The resulting average speed is obtained|Simplify the average speed/gu) ?? []).length;
}

function genericShortcutText(text: string) {
  return (text.match(/S=\\frac\{D\}\{T\}/gu) ?? []).length;
}

function firstWordsKey(question: FormulaQuestion, count: number) {
  return normalizeText(question.text)
    .split(/\s+/u)
    .slice(0, count)
    .join(" ");
}

function maxRepeatedFirstWords(questions: FormulaQuestion[], count: number) {
  const openings = new Map<string, number>();
  for (const question of questions) {
    const key = firstWordsKey(question, count);
    if (!key) continue;
    openings.set(key, (openings.get(key) ?? 0) + 1);
  }
  return Math.max(0, ...openings.values());
}

function missingQuestionMark(question: FormulaQuestion) {
  return !/[?]\s*$/u.test(String(question.text ?? "").trim()) ||
    !/[?]\s*$/u.test(String(question.textHi ?? "").trim()) ||
    !/[?]\s*$/u.test(String(question.textPa ?? "").trim());
}

function brokenStem(question: FormulaQuestion) {
  const text = String(question.text ?? "").trim();
  const withoutQuestion = text.replace(/[?\s]+$/u, "").trim().toLowerCase();
  return !text || /\b(?:from|with|for|by|and|then|starting with)\s*$/u.test(withoutQuestion);
}

function missingAskPhrase(question: FormulaQuestion) {
  return !/\b(?:what|how far|how many|after how many|in how many|for how many)\b/iu.test(String(question.text ?? ""));
}

function missingAnswerUnit(question: FormulaQuestion) {
  const text = String(question.text ?? "");
  const answer = answerText(question);
  if (/\bkm\/h|m\/s\b/u.test(answer)) return !/\b(?:speed|गति|ਗਤੀ)\b/iu.test(text);
  if (/\bhours?|minutes?|seconds?\b/u.test(answer)) return !/\b(?:hours?|minutes?|seconds?|time|when|ਕਿੰਨੇ|कितने)\b/iu.test(text);
  if (/\bkm|m\b/u.test(answer)) return !/\b(?:distance|length|how far|दूरी|लंबाई|ਦੂਰੀ|ਲੰਬਾਈ)\b/iu.test(text);
  return false;
}

function routingLeakage(question: FormulaQuestion) {
  const family = familyOf(question);
  return !/^(tsd|train|boat|race|circular|escalator|moving_walkway|dog)_/u.test(family) || /^(pct|pl|int|rp|tw|pc)_/u.test(family);
}

function uglyDecimalIssue(question: FormulaQuestion) {
  const text = [question.text, question.explanation, question.explanationHi, question.explanationPa, answerText(question), ...(question.options ?? [])].join("\n");
  const decimals = text.match(/\d+\.\d+/gu) ?? [];
  const allowed = [0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8];
  return decimals.some((raw) => {
    const value = Number(raw);
    const fraction = Math.round((Math.abs(value) - Math.floor(Math.abs(value))) * 100) / 100;
    return !allowed.some((candidate) => Math.abs(candidate - fraction) < 0.006);
  });
}

function basicDirectQuestion(question: FormulaQuestion) {
  const text = String(question.text ?? "");
  return /\btravels \d+ km in \d+ hours?\.?\s*find speed|convert \d+ km\/h|crosses a pole\b/iu.test(text);
}

function trivialOneStep(question: FormulaQuestion) {
  return basicDirectQuestion(question) || /\bfind (?:speed|distance|time)\b/iu.test(String(question.text ?? ""));
}

function optionFormatIssue(question: FormulaQuestion) {
  const options = question.options ?? [];
  const answer = answerText(question);
  if (!options.includes(answer)) return "answer missing from options";
  if (new Set(options).size !== options.length) return "duplicate options";
  const unit = answer.replace(/^.*?\b(km\/h|m\/s|km|m|hours?|minutes?|seconds?|steps)\b.*$/u, "$1");
  if (unit !== answer && options.some((option) => !String(option).includes(unit))) return "unit option format mismatch";
  return undefined;
}

function validateQuestion(question: FormulaQuestion) {
  const problem = problemOf(question);
  const solver = validateTimeSpeedDistanceIndependentSolver({
    problem,
    explanation: question.explanation,
    options: question.options,
    correct: question.correct,
  });
  return [...solver.issues, ...timeSpeedDistanceDegenerateReasons(problem)];
}

function candidateQualityIssue(question: FormulaQuestion, profileId: "tsd_balanced" | "tsd_production_60" | "tsd_review_200") {
  const qualityIssues = [
    ["routing leakage", routingLeakage(question)],
    ["missing question mark", missingQuestionMark(question)],
    ["broken stem", brokenStem(question)],
    ["missing ask phrase", missingAskPhrase(question)],
    ["missing answer unit", missingAnswerUnit(question)],
    ["malformed MathJax", malformedMathJax(question)],
    ["ugly decimal", uglyDecimalIssue(question)],
    ["basic direct question", profileId !== "tsd_basic" && basicDirectQuestion(question)],
    ["trivial one-step", trivialOneStep(question)],
  ].filter(([, failed]) => failed);
  if (qualityIssues.length) return String(qualityIssues[0]![0]);
  const optionIssue = optionFormatIssue(question);
  if (optionIssue) return optionIssue;
  const validationIssues = validateQuestion(question);
  if (validationIssues.length) return `validation: ${validationIssues[0]}`;
  return undefined;
}

function collectionIssue(questions: FormulaQuestion[], profileId: "tsd_balanced" | "tsd_production_60" | "tsd_review_200") {
  const fingerprints = new Set<string>();
  const stems = new Set<string>();
  const topologyNumeric = new Set<string>();
  const openings = new Map<string, number>();
  for (const question of questions) {
    const fingerprint = duplicateFingerprint(question);
    if (fingerprints.has(fingerprint)) return "duplicate fingerprint";
    fingerprints.add(fingerprint);
    const stem = exactStemFingerprint(question);
    if (stems.has(stem)) return "duplicate stem";
    stems.add(stem);
    const topoNumeric = topologyNumericAnswerFingerprint(question);
    if (topologyNumeric.has(topoNumeric)) return "duplicate topology numeric answer";
    topologyNumeric.add(topoNumeric);
    const openingKey = firstWordsKey(question, 8);
    openings.set(openingKey, (openings.get(openingKey) ?? 0) + 1);
    if ((openings.get(openingKey) ?? 0) > firstEightCap(profileId)) return "first 8 words cap";
  }
  return undefined;
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

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function toRecord(map: Map<string, number>) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1]));
}

function configuredFamilyCap(count: number) {
  if (count >= 500) return 18;
  if (count > 60) return 5;
  return 3;
}

function phaseCTarget(count: number) {
  if (count >= 500) return 180;
  if (count > 60) return 48;
  return 12;
}

function firstEightCap(profileId: "tsd_balanced" | "tsd_production_60" | "tsd_review_200") {
  if (profileId === "tsd_production_60") return 2;
  if (profileId === "tsd_review_200") return 3;
  return 5;
}

function forcedFamily(
  slot: number,
  attempt: number,
  count: number,
  keptFamilyCounts: Map<string, number>,
  keptPhaseCCount: number,
): TimeSpeedDistanceFamilyId {
  const neededPhaseC = Math.floor(((slot + 1) * phaseCTarget(count)) / count) > keptPhaseCCount;
  const pool = neededPhaseC
    ? TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS
    : TIME_SPEED_DISTANCE_FAMILY_IDS.filter((family) => !TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS.includes(family as any));
  if (neededPhaseC && count >= 500) {
    const missing = TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS.filter((family) => (keptFamilyCounts.get(family) ?? 0) === 0);
    if (missing.length > 0) return missing[(slot + attempt) % missing.length]!;
  }
  for (let offset = 0; offset < pool.length; offset += 1) {
    const family = pool[(slot + attempt + offset) % pool.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap(count)) return family;
  }
  return pool[(slot + attempt) % pool.length]!;
}

function generateQuestions(count: number, seed: string, profileId: "tsd_balanced" | "tsd_production_60" | "tsd_review_200") {
  const state = createCorpusSchedulerState({ targetCount: count, profileId });
  const questions: FormulaQuestion[] = [];
  const keptFingerprints = new Set<string>();
  const keptStems = new Set<string>();
  const keptTopologyNumeric = new Set<string>();
  const keptFamilyCounts = new Map<string, number>();
  const keptOpeningCounts = new Map<string, number>();
  let keptPhaseCCount = 0;
  const generationStats = {
    totalAttempts: 0,
    skippedCandidates: 0,
    localRejectReasons: {} as Record<string, number>,
  };
  const reject = (reason: string) => {
    generationStats.skippedCandidates += 1;
    generationStats.localRejectReasons[reason] = (generationStats.localRejectReasons[reason] ?? 0) + 1;
  };
  const maxAttempts = Math.max(count * 180, count + 5000);
  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    generationStats.totalAttempts += 1;
    try {
      const forcedMotifId = forcedFamily(questions.length, attempt, count, keptFamilyCounts, keptPhaseCCount);
      const mustKeepExactPhaseC =
        count > 60 &&
        TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS.includes(forcedMotifId) &&
        (keptFamilyCounts.get(forcedMotifId) ?? 0) === 0;
      const question = mustKeepExactPhaseC
        ? createQuantV2TimeSpeedDistanceQuestionCandidate(tsdPattern, {
          seed: `${seed}:tsd:${attempt}:direct:${forcedMotifId}`,
          examProfile: "ssc",
          forcedMotifId,
        })
        : generateScheduledQuestion({
          state,
          index: questions.length,
          seedPrefix: `${seed}:tsd:${attempt}`,
          examProfile: "ssc",
          forcedMotifId,
          generate: (options) => createQuantV2TimeSpeedDistanceQuestionCandidate(tsdPattern, options),
        }).question;
      const questionIsPhaseC = TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS.includes(familyOf(question) as TimeSpeedDistanceFamilyId);
      if (questionIsPhaseC && keptPhaseCCount >= phaseCTarget(count) && !mustKeepExactPhaseC) {
        reject("phase c cap");
        continue;
      }
      const qualityIssue = candidateQualityIssue(question, profileId);
      if (qualityIssue) {
        reject(qualityIssue);
        continue;
      }
      const fingerprint = duplicateFingerprint(question);
      const stem = exactStemFingerprint(question);
      const topologyNumeric = topologyNumericAnswerFingerprint(question);
      if (keptFingerprints.has(fingerprint) || keptStems.has(stem) || keptTopologyNumeric.has(topologyNumeric)) {
        reject("duplicate final candidate");
        continue;
      }
      const openingKey = firstWordsKey(question, 8);
      if ((keptOpeningCounts.get(openingKey) ?? 0) >= firstEightCap(profileId)) {
        reject("first 8 words cap");
        continue;
      }
      keptFingerprints.add(fingerprint);
      keptStems.add(stem);
      keptTopologyNumeric.add(topologyNumeric);
      increment(keptOpeningCounts, openingKey);
      increment(keptFamilyCounts, familyOf(question));
      if (questionIsPhaseC) keptPhaseCCount += 1;
      questions.push(question);
    } catch (error) {
      reject(error instanceof Error ? `generation throw: ${error.message}` : "generation throw");
    }
  }
  if (questions.length < count) {
    throw new Error(`TSD generated ${questions.length}/${count} clean questions. ${JSON.stringify(generationStats)}`);
  }

  if (count > 60) {
    const familyCount = (family: TimeSpeedDistanceFamilyId) =>
      questions.filter((question) => familyOf(question) === family).length;
    for (const missingFamily of TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS.filter((family) => familyCount(family) === 0)) {
      let replaced = false;
      let lastReject = "not attempted";
      const currentFamilyCounts = new Map<string, number>();
      const currentFingerprints = new Map<string, number>();
      const currentStems = new Map<string, number>();
      const currentTopologyNumeric = new Map<string, number>();
      const currentOpenings = new Map<string, number>();
      for (const question of questions) increment(currentFamilyCounts, familyOf(question));
      for (const question of questions) {
        increment(currentFingerprints, duplicateFingerprint(question));
        increment(currentStems, exactStemFingerprint(question));
        increment(currentTopologyNumeric, topologyNumericAnswerFingerprint(question));
        increment(currentOpenings, firstWordsKey(question, 8));
      }
      const replacementOrder = questions
        .map((question, index) => ({ index, family: familyOf(question) as TimeSpeedDistanceFamilyId }))
        .filter(({ family }) => !TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS.includes(family))
        .map(({ index }) => index);
      const replaceablePhaseC = questions
        .map((question, index) => ({ index, family: familyOf(question) as TimeSpeedDistanceFamilyId }))
        .filter(({ family }) =>
          TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS.includes(family) &&
          family !== missingFamily &&
          (currentFamilyCounts.get(family) ?? 0) > 1,
        )
        .map(({ index }) => index);
      for (let retry = 0; retry < 700 && !replaced; retry += 1) {
        let candidate: FormulaQuestion;
        try {
          candidate = createQuantV2TimeSpeedDistanceQuestionCandidate(tsdPattern, {
            seed: `${seed}:phase-c-coverage:${missingFamily}:${retry}`,
            examProfile: "ssc",
            forcedMotifId: missingFamily,
          });
        } catch (error) {
          lastReject = error instanceof Error ? error.message : "generation throw";
          continue;
        }
        const qualityIssue = candidateQualityIssue(candidate, profileId);
        if (qualityIssue) {
          lastReject = qualityIssue;
          continue;
        }
        const candidateFingerprint = duplicateFingerprint(candidate);
        const candidateStem = exactStemFingerprint(candidate);
        const candidateTopologyNumeric = topologyNumericAnswerFingerprint(candidate);
        const candidateOpening = firstWordsKey(candidate, 8);
        for (const replaceIndex of [...replacementOrder, ...replaceablePhaseC]) {
          const oldQuestion = questions[replaceIndex]!;
          const oldFingerprint = duplicateFingerprint(oldQuestion);
          const oldStem = exactStemFingerprint(oldQuestion);
          const oldTopologyNumeric = topologyNumericAnswerFingerprint(oldQuestion);
          const oldOpening = firstWordsKey(oldQuestion, 8);
          const fingerprintAfter = (currentFingerprints.get(candidateFingerprint) ?? 0) - (oldFingerprint === candidateFingerprint ? 1 : 0);
          const stemAfter = (currentStems.get(candidateStem) ?? 0) - (oldStem === candidateStem ? 1 : 0);
          const topologyNumericAfter = (currentTopologyNumeric.get(candidateTopologyNumeric) ?? 0) -
            (oldTopologyNumeric === candidateTopologyNumeric ? 1 : 0);
          const openingAfter = (currentOpenings.get(candidateOpening) ?? 0) - (oldOpening === candidateOpening ? 1 : 0) + 1;
          if (fingerprintAfter > 0 || stemAfter > 0 || topologyNumericAfter > 0) {
            lastReject = "duplicate final candidate";
            continue;
          }
          if (openingAfter > firstEightCap(profileId)) {
            lastReject = "first 8 words cap";
            continue;
          }
          questions[replaceIndex] = candidate;
          replaced = true;
          generationStats.skippedCandidates += retry;
          break;
        }
      }
      if (!replaced) {
        throw new Error(`TSD could not force Phase C family ${missingFamily}; last reject: ${lastReject}`);
      }
    }
  }

  const finalPhaseCCount = questions.filter((question) =>
    TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS.includes(familyOf(question) as TimeSpeedDistanceFamilyId),
  ).length;
  return { questions, schedulerSummary: summarizeCorpusScheduler(state), generationStats, phaseCCount: finalPhaseCCount };
}

function renderQuestionText(questions: FormulaQuestion[]) {
  return questions.map((question, index) => {
    const options = (question.options ?? []).map((option, optionIndex) => `  ${String.fromCharCode(65 + optionIndex)}. ${option}`).join("\n");
    return [
      `Q${index + 1}. ${question.text}`,
      options,
      `Answer: ${answerText(question)}`,
      "Explanation:",
      question.explanation,
      "Hindi:",
      question.textHi,
      question.explanationHi,
      "Punjabi:",
      question.textPa,
      question.explanationPa,
      `Meta: family=${familyOf(question)} topology=${topologyOf(question)} difficulty=${question.difficulty}`,
    ].join("\n");
  }).join("\n\n");
}

async function main() {
  const count = parseCount();
  const runId = randomUUID();
  const explicitSeed = argValue("seed");
  const seed = explicitSeed ?? `time-speed-distance-large:${count}:${runId}`;
  const timestamp = new Date().toISOString().replace(/[:.]/gu, "-");
  const exportDir = path.resolve(process.cwd(), "exports", `time-speed-distance-v2-${timestamp}`);
  const production = generateQuestions(60, `${seed}:production`, "tsd_production_60");
  const review = generateQuestions(200, `${seed}:review`, "tsd_review_200");
  const large = generateQuestions(count, `${seed}:large`, "tsd_balanced");
  const counters = {
    solverMismatch: 0,
    explanationMismatch: 0,
    duplicateFingerprint: 0,
    exactDuplicateStem: 0,
    normalizedDuplicateStem: 0,
    topologyNumericDuplicate: 0,
    missingQuestionMark: 0,
    brokenStem: 0,
    missingAskPhrase: 0,
    missingAnswerUnit: 0,
    malformedMathJax: 0,
    rawEnglishInsideMathJax: 0,
    hiPaSentenceInsideMathJax: 0,
    uglyDecimal: 0,
    basicDirectQuestion: 0,
    trivialOneStep: 0,
    directFormulaStandalone: 0,
    optionQualityIssue: 0,
    routingLeakage: 0,
    hiPaLeakage: 0,
    genericExplanationShell: 0,
    genericShortcut: 0,
    repeatedOpening: 0,
    repeatedContext: 0,
    familyCapViolation: 0,
    topologyMismatch: 0,
  };
  const examples: AuditExample[] = [];
  const fingerprints = new Set<string>();
  const stems = new Set<string>();
  const normalizedStems = new Set<string>();
  const topologyNumeric = new Set<string>();
  const familyDistribution = new Map<string, number>();
  const topologyDistribution = new Map<string, number>();
  const difficultyDistribution = new Map<string, number>();
  let realismTotal = 0;
  let realismMin = Number.POSITIVE_INFINITY;
  let realismMax = 0;
  for (const [index, question] of large.questions.entries()) {
    const family = familyOf(question);
    const topology = topologyOf(question);
    increment(familyDistribution, family);
    increment(topologyDistribution, topology);
    increment(difficultyDistribution, String(question.difficulty));
    const realism = realismOf(question);
    realismTotal += realism;
    realismMin = Math.min(realismMin, realism);
    realismMax = Math.max(realismMax, realism);
    const validationIssues = validateQuestion(question);
    for (const issue of validationIssues) {
      if (/solver mismatch/u.test(issue)) counters.solverMismatch += 1;
      if (/explanation/u.test(issue)) counters.explanationMismatch += 1;
      addExample(examples, question, index + 1, issue);
    }
    const dup = duplicateFingerprint(question);
    if (fingerprints.has(dup)) counters.duplicateFingerprint += 1;
    fingerprints.add(dup);
    const stem = exactStemFingerprint(question);
    if (stems.has(stem)) counters.exactDuplicateStem += 1;
    stems.add(stem);
    if (normalizedStems.has(stem)) counters.normalizedDuplicateStem += 1;
    normalizedStems.add(stem);
    const topoNum = topologyNumericAnswerFingerprint(question);
    if (topologyNumeric.has(topoNum)) counters.topologyNumericDuplicate += 1;
    topologyNumeric.add(topoNum);
    if (missingQuestionMark(question)) counters.missingQuestionMark += 1;
    if (brokenStem(question)) counters.brokenStem += 1;
    if (missingAskPhrase(question)) counters.missingAskPhrase += 1;
    if (missingAnswerUnit(question)) counters.missingAnswerUnit += 1;
    if (malformedMathJax(question)) counters.malformedMathJax += 1;
    if (uglyDecimalIssue(question)) counters.uglyDecimal += 1;
    if (basicDirectQuestion(question)) counters.basicDirectQuestion += 1;
    if (trivialOneStep(question)) counters.trivialOneStep += 1;
    if (routingLeakage(question)) counters.routingLeakage += 1;
    if (optionFormatIssue(question)) counters.optionQualityIssue += 1;
  }
  const productionText = renderQuestionText(production.questions);
  const reviewText = renderQuestionText(review.questions);
  const largeText = renderQuestionText(large.questions);
  const finalText = `${productionText}\n${reviewText}\n${largeText}`;
  const productionFirst8Max = maxRepeatedFirstWords(production.questions, 8);
  const reviewFirst8Max = maxRepeatedFirstWords(review.questions, 8);
  const largeFirst8Max = maxRepeatedFirstWords(large.questions, 8);
  if (productionFirst8Max > 2) counters.repeatedOpening += 1;
  if (reviewFirst8Max > 3) counters.repeatedOpening += 1;
  if (largeFirst8Max > 5) counters.repeatedOpening += 1;
  if (production.phaseCCount < 10 || production.phaseCCount > 16) counters.familyCapViolation += 1;
  if (review.phaseCCount < 45 || review.phaseCCount > 70) counters.familyCapViolation += 1;
  if (large.phaseCCount < 130 || large.phaseCCount > 200) counters.familyCapViolation += 1;
  counters.genericExplanationShell += genericExplanationShellText(finalText);
  counters.genericShortcut += genericShortcutText(finalText);
  counters.rawEnglishInsideMathJax += rawEnglishInsideMathJaxText(finalText);
  counters.directFormulaStandalone += (finalText.match(/\b(?:speed\s*=\s*distance|distance\s*=\s*speed|time\s*=\s*distance)\b/giu) ?? []).length;
  const familyTemplateCoverageFailures = TIME_SPEED_DISTANCE_FAMILY_IDS.filter((family) => {
    const bank = TIME_SPEED_DISTANCE_FAMILY_STEM_BANK[family];
    return (TIME_SPEED_DISTANCE_STEM_TEMPLATE_COVERAGE[bank] ?? 0) < 4;
  });
  counters.familyCapViolation += familyTemplateCoverageFailures.length;
  const missingPhaseCFamilies = TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS.filter((family) => !familyDistribution.has(family));
  counters.topologyMismatch += missingPhaseCFamilies.length;
  const summary = {
    status: Object.values(counters).every((value) => value === 0) ? "PASS" : "FAIL",
    seed,
    runId,
    explicitSeed: Boolean(explicitSeed),
    exportDir,
    count: large.questions.length,
    motifsImplemented: TIME_SPEED_DISTANCE_FAMILY_IDS,
    motifsHiddenTodo: [],
    familyDistribution: toRecord(familyDistribution),
    topologyDistribution: toRecord(topologyDistribution),
    difficultyDistribution: toRecord(difficultyDistribution),
    realism: {
      min: realismMin,
      average: Number((realismTotal / large.questions.length).toFixed(2)),
      max: realismMax,
    },
    duplicateENStemCount: counters.exactDuplicateStem,
    normalizedDuplicateCount: counters.normalizedDuplicateStem,
    topologyNumericDuplicateCount: counters.topologyNumericDuplicate,
    missingQuestionMarkCount: counters.missingQuestionMark,
    brokenStemCount: counters.brokenStem,
    basicDirectQuestionCount: counters.basicDirectQuestion,
    trivialOneStepCount: counters.trivialOneStep,
    directFormulaStandaloneCount: counters.directFormulaStandalone,
    uglyDecimalCount: counters.uglyDecimal,
    genericExplanationShellCount: counters.genericExplanationShell,
    genericShortcutCount: counters.genericShortcut,
    repeatedFirst8WordsMax: {
      production60: productionFirst8Max,
      review200: reviewFirst8Max,
      largeAudit: largeFirst8Max,
    },
    phaseCCount: {
      production60: production.phaseCCount,
      review200: review.phaseCCount,
      largeAudit: large.phaseCCount,
    },
    missingPhaseCFamilies,
    rawEnglishInsideMathJaxCount: counters.rawEnglishInsideMathJax,
    hindiPunjabiSentenceInsideMathJaxCount: counters.hiPaSentenceInsideMathJax,
    malformedMathJaxCount: counters.malformedMathJax,
    hiPaLeakageCount: counters.hiPaLeakage,
    optionQualityIssueCount: counters.optionQualityIssue,
    solverMismatchCount: counters.solverMismatch,
    explanationMismatchCount: counters.explanationMismatch,
    routingLeakageCount: counters.routingLeakage,
    counters,
    schedulerSummary: large.schedulerSummary,
    generationStats: large.generationStats,
    worstExamples: examples.slice(0, 30),
  };
  await mkdir(exportDir, { recursive: true });
  await writeFile(path.join(exportDir, "time-speed-distance-production-60.txt"), productionText, "utf8");
  await writeFile(path.join(exportDir, "time-speed-distance-review-200.txt"), reviewText, "utf8");
  await writeFile(path.join(exportDir, "time-speed-distance-large-audit.txt"), largeText, "utf8");
  await writeFile(path.join(exportDir, "time-speed-distance-large-summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
  if (summary.status !== "PASS") process.exitCode = 1;
}

if (process.argv[1]?.endsWith("time-speed-distance-large-audit.mjs")) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
