import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2NumberSystemQuestionCandidate } from "../../lib/quant-v2/number-system-admin-adapter";
import { numberSystemExplanationBlueprintForFamily } from "../canonical/number-system-explanation-builder";
import { NUMBER_SYSTEM_FAMILY_IDS } from "../canonical/number-system-motif-factories";
import type { NumberSystemFamilyId } from "../canonical/number-system-types";
import { extractCorpusSchedulerMetadata } from "../corpus-scheduler/corpus-scheduler";
import {
  numberSystemDegenerateReasons,
  validateNumberSystemIndependentSolver,
} from "../validators/number-system-independent-solver";

const pattern: Pattern = {
  id: "number-system-large-audit",
  type: "formula",
  section: "Quant",
  topic: "number_system",
  subtopic: "number_system",
  difficulty: "Medium",
  templateVariants: ["Number System V2 large audit pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-number-system",
};

function argValue(name: string) {
  const eqPrefix = `--${name}=`;
  const eqMatch = process.argv.find((arg) => arg.startsWith(eqPrefix));
  if (eqMatch) return eqMatch.slice(eqPrefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
function parseCount() {
  const raw = Number(argValue("count") ?? "1000");
  return Number.isFinite(raw) ? Math.max(1, Math.min(10000, Math.floor(raw))) : 1000;
}
function normalizeText(value: unknown) {
  return String(value ?? "").normalize("NFKC").toLowerCase().replace(/[,\u20b9]/gu, "").replace(/[^\p{L}\p{N}.:%/]+/gu, " ").replace(/\s+/gu, " ").trim();
}
function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}
function problemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ?? (question.semanticMetadata as any)?.problem;
}
function familyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).familyKey;
}
function topologyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).topologyKey;
}
function exactStemFingerprint(question: FormulaQuestion) {
  return normalizeText(question.text);
}
function normalizedDuplicateFingerprint(question: FormulaQuestion) {
  return normalizeText(question.text);
}
function topologyNumericAnswerFingerprint(question: FormulaQuestion) {
  const problem = problemOf(question);
  const signature = problem?.auditMeta?.numericSignature ?? "";
  return `${topologyOf(question)}::${signature}::${normalizeText(answerText(question))}`;
}
function explanationText(question: FormulaQuestion) {
  return `${question.explanation ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
}
function studentFacingText(question: FormulaQuestion) {
  return [
    question.text,
    question.textHi,
    question.textPa,
    ...(question.options ?? []),
    question.explanation,
    question.explanationHi,
    question.explanationPa,
  ].map((value) => String(value ?? "")).join("\n");
}
const STUDENT_LANGUAGE_FIREWALL_RE = /\b(?:combine\s+(?:conditions|constraints)|constraint\s+chain|optimization|candidate\s+number|valid\s+candidate|feasible\s+value|boundary\s+value|boundary\s+correction|search\s+space|narrowed\s+result|filtered\s+result|tracking\s+(?:factors|exponents)|reconstruction|condition\s+satisfaction|generator\s+logic|reasoning\s+graph|topology|family|canonical\s+problem|solver\s+output|hidden\s+(?:divisor|hcf|lcm)|perfect-power\s+calculation|complete\s+the\s+exponents|apply\s+the\s+cycle\s+method|apply\s+the\s+formula|use\s+the\s+formula|apply\s+the\s+rule|optimization\s+value|required\s+correction|candidate\s+selection|valid\s+selection|constraint\s+filtering|candidate\s+filtering|candidate\s+elimination\s+engine|cycle\s+position\s+engine)\b/iu;
const META_LANGUAGE_RE = STUDENT_LANGUAGE_FIREWALL_RE;
const GENERIC_EXPLANATION_LEAK_RE = /\b(?:Translate every clue|Carry result through next condition|Carry the result through the next condition|Check next fact|Check the number against the next fact|Reconstructed value|Candidate value|Constraint value)\b/iu;
const STANDALONE_PLACEHOLDER_RE = /\\\[\s*(?:x|N|A|Z|M)\s*=\s*-?\d+\s*\\\]/u;
const MOJIBAKE_RE = /[ÃÂ]|à[¤¥¨©]|â(?:Œ|€|†|€¦|„)/u;
function malformedMathJax(question: FormulaQuestion) {
  const text = explanationText(question);
  return (text.match(/\\\[/gu) ?? []).length !== (text.match(/\\\]/gu) ?? []).length ||
    (text.match(/\\\(/gu) ?? []).length !== (text.match(/\\\)/gu) ?? []).length;
}
function rawEnglishInsideDisplayMath(question: FormulaQuestion) {
  const blocks = explanationText(question).match(/\\\[[\s\S]*?\\\]/gu) ?? [];
  return blocks.some((block) => {
    if (/\\(?:text|mathrm)\s*\{/u.test(block)) return true;
    const withoutCommands = block
      .replace(/\\[A-Za-z]+/gu, "")
      .replace(/\b(?:LCM|HCF)\b/gu, "")
      .replace(/\b[a-zA-Z]\b/gu, "");
    return /[A-Za-z]{2,}/u.test(withoutCommands);
  });
}
function rawLatexVisible(question: FormulaQuestion) {
  return /\\\[[^\n][\s\S]*?[^\n]\\\]/u.test(explanationText(question));
}
function genericExplanation(question: FormulaQuestion) {
  return /Use the formula|Substitute the values|Solve for the answer|Required value is|Apply the formula|Concept\n|Let's solve|Let's look|Now let's find|We know that|Observe that|Using the formula/iu.test(explanationText(question));
}
function metaLanguageIssue(question: FormulaQuestion) {
  return META_LANGUAGE_RE.test(studentFacingText(question));
}
function genericExplanationLeakIssue(question: FormulaQuestion) {
  return GENERIC_EXPLANATION_LEAK_RE.test(explanationText(question));
}
function placeholderVariableIssue(question: FormulaQuestion) {
  return STANDALONE_PLACEHOLDER_RE.test(explanationText(question));
}
function familyBlueprintIssue(question: FormulaQuestion) {
  const family = familyOf(question) as NumberSystemFamilyId;
  const blueprint = numberSystemExplanationBlueprintForFamily(family);
  if (!blueprint) return true;
  const text = String(question.explanation ?? "");
  if ((family.includes("digit") || family.includes("remainder") || family.includes("modular")) && /Reconstruction questions/iu.test(text)) return true;
  return false;
}
function utf8LocalizationIssue(question: FormulaQuestion) {
  return MOJIBAKE_RE.test(`${question.textHi ?? ""}\n${question.textPa ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`);
}
function answerFirstIssue(question: FormulaQuestion) {
  const text = String(question.explanation ?? "");
  const answer = answerText(question).replace(/[^\d-]/gu, "");
  const opening = text.slice(0, 260);
  return Boolean(answer && new RegExp(`\\b(?:answer|final answer)\\s*[:=]\\s*${answer}\\b`, "iu").test(opening));
}
function teacherVoiceIssue(question: FormulaQuestion) {
  const text = String(question.explanation ?? "");
  return /generator|engine|candidate filtering|topology|configured|internal/iu.test(text) || (text.match(/\\\[/gu) ?? []).length < 2;
}
function shortcutDuplicateExplanation(question: FormulaQuestion) {
  const text = String(question.explanation ?? "");
  const shortcut = text.split(/Shortcut/iu).at(-1) ?? "";
  const beforeShortcut = text.split(/Shortcut/iu)[0] ?? text;
  const normalize = (value: string) => normalizeText(value.replace(/\\\[[\s\S]*?\\\]/gu, "").replace(/\\\([\s\S]*?\\\)/gu, ""));
  return shortcut.length > 0 && normalize(shortcut) === normalize(beforeShortcut);
}
function reasoningJump(question: FormulaQuestion) {
  const text = String(question.explanation ?? "");
  const beforeVerification = text.split(/Answer Verification/iu)[0] ?? text;
  return (beforeVerification.match(/\\\[/gu) ?? []).length < 2;
}
function randomDistractorIssue(question: FormulaQuestion) {
  const options = question.options ?? [];
  const answer = answerText(question);
  return options.length === 4 && options.every((option) => option === answer || /(?:\+|-)\s*[123]\b/u.test(option));
}
function missingQuestionMark(question: FormulaQuestion) {
  return !/[?]\s*$/u.test(String(question.text ?? "").trim()) ||
    !/[?]\s*$/u.test(String(question.textHi ?? "").trim()) ||
    !/[?]\s*$/u.test(String(question.textPa ?? "").trim());
}
function brokenStem(question: FormulaQuestion) {
  const text = String(question.text ?? "").trim().replace(/[?\s]+$/u, "").toLowerCase();
  return !text || /\b(?:from|with|for|by|and|then)\s*$/u.test(text);
}
function routingLeakage(question: FormulaQuestion) {
  return !/^ns_/u.test(familyOf(question));
}
function schoolDrill(question: FormulaQuestion) {
  return /\bFind (?:HCF|LCM) of \d+ and \d+|How many factors does \d+ have|Find remainder when \d+ is divided by \d+|Find last digit of \d+\^?\d?\b/iu.test(String(question.text ?? ""));
}
function trivialOneStep(question: FormulaQuestion) {
  const problem = problemOf(question);
  return Number(problem?.questionTrivialityScore ?? 1) > 0.2 || schoolDrill(question);
}
function invalidOptions(question: FormulaQuestion) {
  const options = question.options ?? [];
  return options.length !== 4 || new Set(options).size !== options.length || !options.includes(answerText(question));
}

function countsFor(questions: FormulaQuestion[]) {
  const exact = new Map<string, number>();
  const normalized = new Map<string, number>();
  const topoNumeric = new Map<string, number>();
  const familyDistribution: Record<string, number> = {};
  const difficultyDistribution: Record<string, number> = {};
  const complexityDistribution: Record<string, number> = {};
  const familyDiversityBucketDistribution: Record<string, number> = {};
  const situationDiversityBucketDistribution: Record<string, number> = {};
  const stemArchetypeDistribution: Record<string, number> = {};
  const shortcutPatternDistribution: Record<string, number> = {};
  const familyBlueprintDistribution: Record<string, number> = {};
  const examModeDistribution: Record<string, number> = {};
  const topologyDepths: number[] = [];
  const realismScores: number[] = [];
  const sscAuthenticityScores: number[] = [];
  const bankingAuthenticityScores: number[] = [];
  const punjabAuthenticityScores: number[] = [];
  let missingSituationMetadataCount = 0;
  let eliteQuestions = 0;
  const inc = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);
  const incRecord = (record: Record<string, number>, key: string) => {
    record[key] = (record[key] ?? 0) + 1;
  };
  for (const question of questions) {
    const problem = problemOf(question);
    const meta = problem?.auditMeta ?? {};
    const quality = problem?.qualityMetadata ?? {};
    inc(exact, exactStemFingerprint(question));
    inc(normalized, normalizedDuplicateFingerprint(question));
    inc(topoNumeric, topologyNumericAnswerFingerprint(question));
    familyDistribution[familyOf(question)] = (familyDistribution[familyOf(question)] ?? 0) + 1;
    incRecord(familyBlueprintDistribution, numberSystemExplanationBlueprintForFamily(familyOf(question) as NumberSystemFamilyId));
    const diff = String(problem?.difficulty ?? "medium");
    difficultyDistribution[diff] = (difficultyDistribution[diff] ?? 0) + 1;
    incRecord(complexityDistribution, String(problem?.complexity ?? "medium"));
    const familyBucket = String(meta.familyDiversityBucket ?? quality.familyDiversityBucket ?? "");
    const situationBucket = String(meta.situationDiversityBucket ?? quality.situationDiversityBucket ?? "");
    const stemArchetype = String(meta.stemArchetype ?? quality.stemArchetype ?? "");
    const shortcutPattern = String(meta.shortcutPatternId ?? quality.shortcutPatternId ?? "");
    const examMode = String(quality.examMode ?? "");
    if (!familyBucket || !situationBucket || !stemArchetype || !shortcutPattern) missingSituationMetadataCount += 1;
    if (familyBucket) incRecord(familyDiversityBucketDistribution, familyBucket);
    if (situationBucket) incRecord(situationDiversityBucketDistribution, situationBucket);
    if (stemArchetype) incRecord(stemArchetypeDistribution, stemArchetype);
    if (shortcutPattern) incRecord(shortcutPatternDistribution, shortcutPattern);
    if (examMode) incRecord(examModeDistribution, examMode);
    if (meta.eliteTier || problem?.complexity === "elite") eliteQuestions += 1;
    if (Number.isFinite(Number(meta.topologyDepth))) topologyDepths.push(Number(meta.topologyDepth));
    if (Number.isFinite(Number(problem?.realismScore))) realismScores.push(Number(problem.realismScore));
    if (Number.isFinite(Number(meta.sscAuthenticityScore))) sscAuthenticityScores.push(Number(meta.sscAuthenticityScore));
    if (Number.isFinite(Number(meta.bankingAuthenticityScore))) bankingAuthenticityScores.push(Number(meta.bankingAuthenticityScore));
    if (Number.isFinite(Number(meta.punjabAuthenticityScore))) punjabAuthenticityScores.push(Number(meta.punjabAuthenticityScore));
  }
  const repeated = (map: Map<string, number>) => [...map.values()].filter((count) => count > 1).reduce((a, b) => a + b - 1, 0);
  const average = (values: number[]) => values.length > 0 ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0;
  const minimum = (values: number[]) => values.length > 0 ? Math.min(...values) : 0;
  const maximum = (values: number[]) => values.length > 0 ? Math.max(...values) : 0;
  const first8 = new Map<string, number>();
  for (const question of questions) {
    const key = normalizeText(question.text).split(/\s+/u).slice(0, 8).join(" ");
    inc(first8, key);
  }
  const repeatedFirst8WordsMax = Math.max(0, ...first8.values());
  const eliteShare = questions.length > 0 ? eliteQuestions / questions.length : 0;
  const qualityGateCount = [
    repeatedFirst8WordsMax > Math.max(3, Math.ceil(questions.length / 125)),
    eliteShare < 0.18,
    maximum(topologyDepths) < 5,
    average(topologyDepths) < 3.25,
    minimum(realismScores) < 85,
    minimum(sscAuthenticityScores) < 80,
    minimum(bankingAuthenticityScores) < 80,
    minimum(punjabAuthenticityScores) < 80,
    Object.keys(situationDiversityBucketDistribution).length < Math.min(50, Math.ceil(questions.length / 6)),
    Object.keys(stemArchetypeDistribution).length < 12,
    Object.keys(shortcutPatternDistribution).length < 18,
  ].filter(Boolean).length;
  return {
    duplicateEnStemCount: repeated(exact),
    normalizedDuplicateCount: repeated(normalized),
    topologyNumericDuplicateCount: repeated(topoNumeric),
    missingQuestionMarkCount: questions.filter(missingQuestionMark).length,
    brokenStemCount: questions.filter(brokenStem).length,
    malformedMathJaxCount: questions.filter(malformedMathJax).length,
    rawEnglishInsideMathJaxCount: questions.filter(rawEnglishInsideDisplayMath).length,
    rawLatexVisibleCount: questions.filter(rawLatexVisible).length,
    genericExplanationCount: questions.filter(genericExplanation).length,
    metaLanguageCount: questions.filter(metaLanguageIssue).length,
    familyBlueprintAuditCount: questions.filter(familyBlueprintIssue).length,
    genericExplanationLeakCount: questions.filter(genericExplanationLeakIssue).length,
    placeholderVariableCount: questions.filter(placeholderVariableIssue).length,
    teacherVoiceIssueCount: questions.filter(teacherVoiceIssue).length,
    answerFirstCount: questions.filter(answerFirstIssue).length,
    utf8LocalizationIssueCount: questions.filter(utf8LocalizationIssue).length,
    directDrillRejectionCount: questions.filter(schoolDrill).length,
    reasoningJumpCount: questions.filter(reasoningJump).length,
    shortcutDuplicatesExplanationCount: questions.filter(shortcutDuplicateExplanation).length,
    distractorRandomnessCount: questions.filter(randomDistractorIssue).length,
    routingLeakageCount: questions.filter(routingLeakage).length,
    trivialOneStepCount: questions.filter(trivialOneStep).length,
    schoolDrillCount: questions.filter(schoolDrill).length,
    optionIssueCount: questions.filter(invalidOptions).length,
    missingSituationMetadataCount,
    solverMismatchCount: questions.filter((question) => {
      const validation = validateNumberSystemIndependentSolver({
        problem: problemOf(question),
        explanation: question.explanation,
        options: question.options,
        correct: question.correct,
      });
      return !validation.valid;
    }).length,
    degenerateCount: questions.reduce((sum, question) => sum + numberSystemDegenerateReasons(problemOf(question)).length, 0),
    qualityGateCount,
    repeatedFirst8WordsMax,
    eliteQuestions,
    eliteShare: Number(eliteShare.toFixed(3)),
    topologyDepth: {
      min: minimum(topologyDepths),
      avg: average(topologyDepths),
      max: maximum(topologyDepths),
    },
    realism: {
      min: minimum(realismScores),
      avg: average(realismScores),
      max: maximum(realismScores),
    },
    authenticity: {
      ssc: { min: minimum(sscAuthenticityScores), avg: average(sscAuthenticityScores), max: maximum(sscAuthenticityScores) },
      banking: { min: minimum(bankingAuthenticityScores), avg: average(bankingAuthenticityScores), max: maximum(bankingAuthenticityScores) },
      punjab: { min: minimum(punjabAuthenticityScores), avg: average(punjabAuthenticityScores), max: maximum(punjabAuthenticityScores) },
    },
    coverageMatrix: {
      ssc: {
        optimization: familyDiversityBucketDistribution["optimization:OPTIMIZATION_CONSTRAINT_METHOD"] ?? 0,
        perfectPower: familyDiversityBucketDistribution["perfect_power:PERFECT_POWER_COMPLETION_METHOD"] ?? 0,
        reconstruction: familyDiversityBucketDistribution["reconstruction:RECONSTRUCTION_METHOD"] ?? 0,
        eliteHybrid: familyDiversityBucketDistribution["elite_hybrid:ELITE_HYBRID_CHAIN_METHOD"] ?? 0,
      },
      banking: {
        cycles: familyDiversityBucketDistribution["last_digit:LAST_DIGIT_CYCLE_METHOD"] ?? 0,
        remainders: familyDiversityBucketDistribution["remainder:MODULAR_CYCLE_METHOD"] ?? 0,
        digitLogic: familyDiversityBucketDistribution["digit_logic:DIGIT_EQUATION_METHOD"] ?? 0,
      },
      punjab: {
        divisibility: familyDiversityBucketDistribution["divisibility:DIVISIBILITY_RULE_METHOD"] ?? 0,
        hcfLcm: familyDiversityBucketDistribution["hcf_lcm:HCF_LCM_RELATION_METHOD"] ?? 0,
        factorial: (familyDiversityBucketDistribution["factorial:HIGHEST_POWER_METHOD"] ?? 0) + (familyDiversityBucketDistribution["factorial:TRAILING_ZERO_METHOD"] ?? 0),
      },
    },
    eliteTopologyChainDistribution: {
      depth5Plus: topologyDepths.filter((depth) => depth >= 5).length,
      depth6Plus: topologyDepths.filter((depth) => depth >= 6).length,
    },
    familyDistribution,
    difficultyDistribution,
    complexityDistribution,
    examModeDistribution,
    familyDiversityBucketDistribution,
    situationDiversityBucketDistribution,
    stemArchetypeDistribution,
    shortcutPatternDistribution,
    familyBlueprintDistribution,
  };
}

function renderQuestion(question: FormulaQuestion, index: number) {
  return [
    `Q${index + 1}. ${question.text}`,
    `A. ${question.options?.[0]}`,
    `B. ${question.options?.[1]}`,
    `C. ${question.options?.[2]}`,
    `D. ${question.options?.[3]}`,
    `Answer: ${String.fromCharCode(65 + (question.correct ?? 0))}`,
    "",
    "Explanation:",
    question.explanation,
    "",
    "Hindi:",
    question.textHi,
    question.explanationHi,
    "",
    "Punjabi:",
    question.textPa,
    question.explanationPa,
    "",
  ].join("\n");
}

function openingFingerprint(question: FormulaQuestion) {
  return normalizeText(question.text).split(/\s+/u).slice(0, 8).join(" ");
}

function generateSet(count: number, seed: string, openingCap: number) {
  const questions: FormulaQuestion[] = [];
  const seen = new Set<string>();
  const openingCounts = new Map<string, number>();
  const maxAttempts = count * 60;
  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    const family = NUMBER_SYSTEM_FAMILY_IDS[(questions.length + attempt) % NUMBER_SYSTEM_FAMILY_IDS.length]!;
    const question = createQuantV2NumberSystemQuestionCandidate(pattern, {
      seed: `${seed}:${attempt}:${family}`,
      forcedMotifId: family,
      generationContext: { seed: `${seed}:${attempt}`, generationId: seed, timestamp: Date.now() },
    });
    const fingerprint = exactStemFingerprint(question);
    const topo = topologyNumericAnswerFingerprint(question);
    const opening = openingFingerprint(question);
    if (seen.has(fingerprint) || seen.has(topo)) continue;
    if ((openingCounts.get(opening) ?? 0) >= openingCap) continue;
    if (trivialOneStep(question) || invalidOptions(question) || missingQuestionMark(question) || brokenStem(question)) continue;
    seen.add(fingerprint);
    seen.add(topo);
    openingCounts.set(opening, (openingCounts.get(opening) ?? 0) + 1);
    questions.push(question);
  }
  if (questions.length < count) {
    throw new Error(`Number System V2 audit generated only ${questions.length}/${count} questions`);
  }
  return questions;
}

async function main() {
  const count = parseCount();
  const runId = randomUUID();
  const seed = argValue("seed") ?? `number-system-v2:${runId}`;
  const outDir = path.join(process.cwd(), "exports", `number-system-v2-${new Date().toISOString().replace(/[:.]/gu, "-")}`);
  await mkdir(outDir, { recursive: true });
  const production = generateSet(Math.min(300, Math.max(60, Math.floor(count * 0.3))), `${seed}:production`, 3);
  const review = generateSet(Math.min(200, Math.max(100, Math.floor(count * 0.2))), `${seed}:review`, 3);
  const audit = generateSet(count, `${seed}:audit`, 8);
  const summary = {
    status: "PASS",
    runId,
    seed,
    production: countsFor(production),
    review: countsFor(review),
    audit: countsFor(audit),
    exportFolder: outDir,
  };
  const hardGateTotal = Object.entries(summary.audit)
    .filter(([key]) => /Count$/u.test(key) && key !== "repeatedFirst8WordsMax")
    .reduce((sum, [, value]) => sum + (typeof value === "number" ? value : 0), 0);
  if (hardGateTotal > 0) summary.status = "FAIL";
  await writeFile(path.join(outDir, "number-system-production.txt"), production.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "number-system-review.txt"), review.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "number-system-large-audit.txt"), audit.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "audit-summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
  if (summary.status !== "PASS") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
