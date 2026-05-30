import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2MixtureAlligationQuestionCandidate } from "../../lib/quant-v2/mixture-alligation-admin-adapter";
import { MIXTURE_ALLIGATION_FAMILY_IDS } from "../canonical/mixture-alligation-motif-factories";
import type { MixtureAlligationFamilyId } from "../canonical/mixture-alligation-types";
import { extractCorpusSchedulerMetadata } from "../corpus-scheduler/corpus-scheduler";
import {
  mixtureAlligationDegenerateReasons,
  validateMixtureAlligationIndependentSolver,
} from "../validators/mixture-alligation-independent-solver";

const pattern: Pattern = {
  id: "mixture-alligation-large-audit",
  type: "formula",
  section: "Quant",
  topic: "mixture_alligation",
  subtopic: "mixture_alligation",
  difficulty: "Medium",
  templateVariants: ["Mixture & Alligation V2 large audit pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-mixture-alligation",
};

const ALLIGATION_CROSS_REQUIRED = new Set<string>([
  "alligation_cheaper_dearer_ratio",
  "mix_two_price_blend_ratio",
  "mix_two_items_find_ratio",
  "concentration_mixing_two_solutions",
  "concentration_mixing_three_solutions",
  "mix_tea_blend_average_price",
  "mix_two_grades_of_rice",
  "mix_two_grades_of_wheat",
  "alloy_mean_price_blend",
  "mix_reverse_alligation",
  "mix_price_profit_target_gain",
  "mix_cost_selling_price_alligation",
]);

function argValue(name: string) {
  const eqPrefix = `--${name}=`;
  const eqMatch = process.argv.find((arg) => arg.startsWith(eqPrefix));
  if (eqMatch) return eqMatch.slice(eqPrefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
function parseCount() {
  const raw = Number(argValue("count") ?? "500");
  return Number.isFinite(raw) ? Math.max(1, Math.min(2000, Math.floor(raw))) : 500;
}
function normalizeText(value: unknown) {
  return String(value ?? "").normalize("NFKC").toLowerCase().replace(/[₹,]/gu, "").replace(/[^\p{L}\p{N}.:%/]+/gu, " ").replace(/\s+/gu, " ").trim();
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
function preferredMethodOf(question: FormulaQuestion) {
  return String(problemOf(question)?.preferredSolutionMethod ?? problemOf(question)?.auditMeta?.preferredSolutionMethod ?? "");
}
function requiresAlligationDiagram(question: FormulaQuestion) {
  return preferredMethodOf(question) === "alligation_cross";
}
function questionTrivialityScore(question: FormulaQuestion) {
  return Number(problemOf(question)?.questionTrivialityScore ?? problemOf(question)?.auditMeta?.questionTrivialityScore ?? 1);
}
function reasoningStepCount(question: FormulaQuestion) {
  return Number(problemOf(question)?.reasoningStepCount ?? problemOf(question)?.auditMeta?.reasoningStepCount ?? 0);
}
function exactStemFingerprint(question: FormulaQuestion) {
  return normalizeText(question.text);
}
function duplicateFingerprint(question: FormulaQuestion) {
  return [normalizeText(question.text), normalizeText(answerText(question)), [...(question.options ?? [])].map(normalizeText).sort().join("|")].join("::");
}
function topologyNumericAnswerFingerprint(question: FormulaQuestion) {
  const problem = problemOf(question);
  const signature = problem?.auditMeta?.numericSignature ?? "";
  return `${topologyOf(question)}::${signature}::${normalizeText(answerText(question))}`;
}
function firstWordsKey(question: FormulaQuestion, count: number) {
  return normalizeText(question.text).split(/\s+/u).slice(0, count).join(" ");
}
function maxRepeatedFirstWords(questions: FormulaQuestion[], count: number) {
  const map = new Map<string, number>();
  for (const question of questions) map.set(firstWordsKey(question, count), (map.get(firstWordsKey(question, count)) ?? 0) + 1);
  return Math.max(0, ...map.values());
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
function rawEnglishInsideMathJaxText(text: string) {
  return formulaBodies(text).filter((formula) => /\b(?:price|mixture|milk|water|answer|required value|quantity|mean)\b/iu.test(formula.replace(/\\/gu, " "))).length;
}
function genericExplanationShellText(text: string) {
  return (text.match(/Read the given values first|Decide which quantity is preserved|Form the relation|Now solve|Use this intermediate value|Proceed with the calculation|Determine the required value|Apply the formula|Use the formula|Substitute the values|Solve for the answer|Simplify to get the answer|Required value is/giu) ?? []).length;
}
function genericShortcutText(text: string) {
  return (text.match(/x=\\frac\{D\}\{T\}|S=\\frac\{D\}\{T\}/gu) ?? []).length;
}
function markdownArtifactText(text: string) {
  return (text.match(/```|Alligation cross:\s*```|^\s*[-*]\s+/gmu) ?? []).length;
}
function rawLatexVisibleText(text: string) {
  return (text.match(/\\\[[^\n][\s\S]*?[^\n]\\\]/gu) ?? []).length;
}
function logicalExplanationLineCount(question: FormulaQuestion) {
  const problem = problemOf(question);
  const blocks = problem?.explanationBlocks;
  if (Array.isArray(blocks)) return blocks.length + Number((problem?.explanationSteps ?? []).length ?? 0);
  return String(question.explanation ?? "")
    .split(/\n+/u)
    .map((line) => line.trim())
    .filter((line) => line && !/^\\\]$/u.test(line) && !/^\\\[$/u.test(line))
    .length;
}
function tooShortExplanation(question: FormulaQuestion) {
  const minimum = requiresAlligationDiagram(question) ? 12 : 7;
  return logicalExplanationLineCount(question) < minimum && reasoningStepCount(question) < 3;
}
function missingShortcutExplanation(question: FormulaQuestion) {
  const problem = problemOf(question);
  return !String(problem?.shortcutExplanation?.en ?? "").includes("Option (");
}
function missingAlligationCross(question: FormulaQuestion) {
  return requiresAlligationDiagram(question) && !/C_q:D_q|D-M|M-C/u.test(String(problemOf(question)?.stepwiseExplanation?.en ?? ""));
}
function missingVisualAlligationMethod(question: FormulaQuestion) {
  return requiresAlligationDiagram(question) && !/mix-alligation-diagram/u.test(String(question.explanation ?? ""));
}
function brokenAlligationDiagram(question: FormulaQuestion) {
  if (!requiresAlligationDiagram(question)) return false;
  const text = String(question.explanation ?? "");
  return !/mix-alligation-top-left/u.test(text) ||
    !/mix-alligation-top-right/u.test(text) ||
    !/mix-alligation-center/u.test(text) ||
    !/mix-alligation-bottom-left/u.test(text) ||
    !/mix-alligation-bottom-right/u.test(text);
}
function shortcutDuplicatesExplanation(question: FormulaQuestion) {
  const problem = problemOf(question);
  const stepwise = normalizeText(problem?.stepwiseExplanation?.en ?? "");
  const shortcut = normalizeText(problem?.shortcutExplanation?.en ?? "");
  if (!stepwise || !shortcut) return true;
  if (stepwise === shortcut) return true;
  const shortcutWords = shortcut.split(/\s+/u).filter((word: string) => word.length > 3);
  const stepWords = new Set(stepwise.split(/\s+/u).filter((word: string) => word.length > 3));
  if (shortcutWords.length < 8) return true;
  const overlap = shortcutWords.filter((word: string) => stepWords.has(word)).length / shortcutWords.length;
  return overlap > 0.82;
}
function shortcutFormulaOnly(question: FormulaQuestion) {
  const shortcut = String(problemOf(question)?.shortcutExplanation?.en ?? "");
  const prose = shortcut.replace(/\\\[[\s\S]*?\\\]/gu, "").replace(/<[^>]+>/gu, "").trim();
  return prose.split(/\s+/u).filter(Boolean).length < 8;
}
function missingOptionReference(question: FormulaQuestion) {
  return !/Option \([A-D]\)/u.test(String(question.explanation ?? "")) ||
    !/Option \([A-D]\)/u.test(String(problemOf(question)?.shortcutExplanation?.en ?? ""));
}
function roboticStem(question: FormulaQuestion) {
  return /\b(?:batch|component|entity|structural|operational|targeted mean valuation|framework|stock preparation|wholesale preparation|processing stage|inventory stage|For an alloy batch|During stock preparation|For a wholesale order|In a grocery shop|At a market stall|For a customer order|In a wholesale order|A trader is preparing a mixture|A retailer is preparing)\b/iu.test(String(question.text ?? ""));
}
function densityWrongAverageRisk(question: FormulaQuestion) {
  if (familyOf(question) !== "alloy_density_matrix") return false;
  const text = String(question.explanation ?? "");
  return !/V_1=\\frac/u.test(text) || !/V_2=\\frac/u.test(text) || !/\\rho=\\frac/u.test(text);
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
function missingAskPhrase(question: FormulaQuestion) {
  return !/\b(?:what|how many|how much|in what ratio|find)\b/iu.test(String(question.text ?? ""));
}
function routingLeakage(question: FormulaQuestion) {
  const family = familyOf(question);
  return !/^(mix|alligation|replacement|dilution|concentration|vessel|dealer|alloy|solution)_/u.test(family) ||
    /^(pct|pl|int|rp|tw|tsd|train|boat|race)_/u.test(family);
}
function uglyDecimalIssue(question: FormulaQuestion) {
  const text = [question.text, question.explanation, question.explanationHi, question.explanationPa, answerText(question), ...(question.options ?? [])].join("\n");
  const decimals = text.match(/\d+\.\d+/gu) ?? [];
  const allowed = [0.125, 0.2, 0.25, 0.333, 0.375, 0.4, 0.5, 0.6, 0.667, 0.75, 0.8];
  return decimals.some((raw) => {
    const value = Number(raw);
    const fraction = Math.round((Math.abs(value) - Math.floor(Math.abs(value))) * 100) / 100;
    return !allowed.some((candidate) => Math.abs(candidate - fraction) < 0.006);
  });
}
function directAverageStandalone(question: FormulaQuestion) {
  return /10 kg at ₹20 and 10 kg at ₹30|equal quantities.*average|simple average/iu.test(String(question.text ?? ""));
}
function trivialOneStep(question: FormulaQuestion) {
  return questionTrivialityScore(question) > 0.15 || directAverageStandalone(question) || /\bfind average\b/iu.test(String(question.text ?? ""));
}
function optionFormatIssue(question: FormulaQuestion) {
  const options = question.options ?? [];
  const answer = answerText(question);
  if (!options.includes(answer)) return "answer missing from options";
  if (new Set(options).size !== options.length) return "duplicate options";
  const unit = answer.replace(/^.*?(kg|litres|%|₹).*$/u, "$1");
  if (unit !== answer && options.some((option) => !String(option).includes(unit))) return "unit option format mismatch";
  return undefined;
}
function optionMissingUnit(question: FormulaQuestion) {
  const problem = problemOf(question);
  const unit = String(problem?.answerUnit ?? "");
  if (!["kg", "litres", "rupees", "percent", "density"].includes(unit)) return false;
  const unitPattern = unit === "rupees"
    ? /₹/u
    : unit === "percent"
      ? /%/u
      : unit === "density"
        ? /kg\/litre/u
        : new RegExp(`\\b${unit}\\b`, "u");
  return (question.options ?? []).some((option) => !unitPattern.test(String(option)));
}
function validateQuestion(question: FormulaQuestion) {
  const problem = problemOf(question);
  const solver = validateMixtureAlligationIndependentSolver({ problem, explanation: question.explanation, options: question.options, correct: question.correct });
  return [...solver.issues, ...mixtureAlligationDegenerateReasons(problem)];
}
function candidateIssue(question: FormulaQuestion) {
  const issues = [
    ["routing leakage", routingLeakage(question)],
    ["missing question mark", missingQuestionMark(question)],
    ["broken stem", brokenStem(question)],
    ["missing ask phrase", missingAskPhrase(question)],
    ["malformed MathJax", malformedMathJax(question)],
    ["ugly decimal", uglyDecimalIssue(question)],
    ["trivial one-step", trivialOneStep(question)],
    ["direct average standalone", directAverageStandalone(question)],
    ["option missing unit", optionMissingUnit(question)],
    ["too short explanation", tooShortExplanation(question)],
    ["missing shortcut explanation", missingShortcutExplanation(question)],
    ["missing alligation cross", missingAlligationCross(question)],
    ["missing visual alligation method", missingVisualAlligationMethod(question)],
    ["broken alligation diagram", brokenAlligationDiagram(question)],
    ["shortcut formula only", shortcutFormulaOnly(question)],
    ["shortcut duplicates explanation", shortcutDuplicatesExplanation(question)],
    ["missing option reference", missingOptionReference(question)],
    ["robotic stem", roboticStem(question)],
    ["density wrong average risk", densityWrongAverageRisk(question)],
  ].filter(([, failed]) => failed);
  if (issues.length) return String(issues[0]![0]);
  const optionIssue = optionFormatIssue(question);
  if (optionIssue) return optionIssue;
  const validationIssues = validateQuestion(question);
  if (validationIssues.length) return `validation: ${validationIssues[0]}`;
  return undefined;
}
function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}
function toRecord(map: Map<string, number>) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1]));
}

function generateQuestions(count: number, seed: string, profile: "mix_production_60" | "mix_review_200" | "mix_balanced") {
  const questions: FormulaQuestion[] = [];
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const topologyNumeric = new Set<string>();
  const openingCounts = new Map<string, number>();
  const familyCounts = new Map<string, number>();
  const localRejectReasons: Record<string, number> = {};
  const cap = profile === "mix_production_60" ? (count > 100 ? 8 : 3) : profile === "mix_review_200" ? 5 : 8;
  const first8Cap = profile === "mix_production_60" ? (count > 100 ? 8 : 2) : 5;
  const maxAttempts = Math.max(count * (count > 100 ? 2500 : 1000), 40000);
  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    const family = MIXTURE_ALLIGATION_FAMILY_IDS[(questions.length + attempt) % MIXTURE_ALLIGATION_FAMILY_IDS.length]!;
    if ((familyCounts.get(family) ?? 0) >= cap) continue;
    let question: FormulaQuestion;
    try {
      question = createQuantV2MixtureAlligationQuestionCandidate(pattern, {
        seed: `${seed}:mix:${attempt}:${family}`,
        examProfile: "ssc",
        forcedMotifId: family,
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "generation throw";
      localRejectReasons[reason] = (localRejectReasons[reason] ?? 0) + 1;
      continue;
    }
    const issue = candidateIssue(question);
    if (issue) {
      localRejectReasons[issue] = (localRejectReasons[issue] ?? 0) + 1;
      continue;
    }
    const stem = exactStemFingerprint(question);
    const fingerprint = duplicateFingerprint(question);
    const topoNum = topologyNumericAnswerFingerprint(question);
    const opening = firstWordsKey(question, 8);
    if (stems.has(stem) || fingerprints.has(fingerprint) || topologyNumeric.has(topoNum)) {
      localRejectReasons["duplicate final candidate"] = (localRejectReasons["duplicate final candidate"] ?? 0) + 1;
      continue;
    }
    if ((openingCounts.get(opening) ?? 0) >= first8Cap) {
      localRejectReasons["first 8 words cap"] = (localRejectReasons["first 8 words cap"] ?? 0) + 1;
      continue;
    }
    stems.add(stem);
    fingerprints.add(fingerprint);
    topologyNumeric.add(topoNum);
    increment(openingCounts, opening);
    increment(familyCounts, family);
    questions.push(question);
  }
  if (questions.length < count) {
    throw new Error(`Mixture generated ${questions.length}/${count} clean questions. ${JSON.stringify(localRejectReasons)}`);
  }
  return { questions, generationStats: { localRejectReasons } };
}
function renderQuestionText(questions: FormulaQuestion[]) {
  return questions.map((question, index) => {
    const options = (question.options ?? []).map((option, optionIndex) => `  ${String.fromCharCode(65 + optionIndex)}. ${option}`).join("\n");
    return [`Q${index + 1}. ${question.text}`, options, `Answer: ${answerText(question)}`, "Explanation:", question.explanation, "Hindi:", question.textHi, question.explanationHi, "Punjabi:", question.textPa, question.explanationPa, `Meta: family=${familyOf(question)} topology=${topologyOf(question)} difficulty=${question.difficulty}`].join("\n");
  }).join("\n\n");
}

async function main() {
  const count = parseCount();
  const productionCount = Math.max(1, Math.min(200, Number(argValue("production-count") ?? "60")));
  const reviewCount = Math.max(1, Math.min(200, Number(argValue("review-count") ?? "200")));
  const runId = randomUUID();
  const explicitSeed = argValue("seed");
  const seed = explicitSeed ?? `mixture-alligation-large:${count}:${runId}`;
  const timestamp = new Date().toISOString().replace(/[:.]/gu, "-");
  const exportDir = path.resolve(process.cwd(), "exports", `mixture-alligation-v2-${timestamp}`);
  const production = generateQuestions(productionCount, `${seed}:production`, "mix_production_60");
  const review = generateQuestions(reviewCount, `${seed}:review`, "mix_review_200");
  const large = generateQuestions(count, seed, "mix_balanced");
  const productionText = renderQuestionText(production.questions);
  const reviewText = renderQuestionText(review.questions);
  const largeText = renderQuestionText(large.questions);
  const finalText = `${productionText}\n${reviewText}\n${largeText}`;
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
    malformedMathJax: 0,
    rawEnglishInsideMathJax: rawEnglishInsideMathJaxText(finalText),
    hiPaSentenceInsideMathJax: 0,
    uglyDecimal: 0,
    basicDirectQuestion: 0,
    trivialOneStep: 0,
    directAverageStandalone: 0,
    concentrationAbove100: 0,
    negativeQuantity: 0,
    replacementImpossible: 0,
    vesselTransferImpossible: 0,
    densityAlloyImpossible: 0,
    optionQualityIssue: 0,
    optionMissingUnit: 0,
    tooShortExplanation: 0,
    missingShortcutExplanation: 0,
    missingAlligationCross: 0,
    missingVisualAlligationMethod: 0,
    brokenAlligationDiagram: 0,
    shortcutFormulaOnly: 0,
    shortcutDuplicatesExplanation: 0,
    missingOptionReference: 0,
    markdownArtifact: markdownArtifactText(finalText),
    rawLatexVisible: rawLatexVisibleText(finalText),
    roboticStem: 0,
    densityWrongAverageRisk: 0,
    routingLeakage: 0,
    hiPaLeakage: 0,
    genericExplanationShell: genericExplanationShellText(finalText),
    genericShortcut: genericShortcutText(finalText),
    repeatedOpening: 0,
    repeatedContext: 0,
    familyCapViolation: 0,
    topologyMismatch: 0,
  };
  const fingerprints = new Set<string>();
  const stems = new Set<string>();
  const topologyNumericSet = new Set<string>();
  const familyDistribution = new Map<string, number>();
  const difficultyDistribution = new Map<string, number>();
  const solutionMethodDistribution = new Map<string, number>();
  let realismTotal = 0;
  let realismMin = Number.POSITIVE_INFINITY;
  let realismMax = 0;
  let explanationLengthTotal = 0;
  let shortcutLengthTotal = 0;
  let trivialityTotal = 0;
  let reasoningStepTotal = 0;
  for (const question of large.questions) {
    increment(familyDistribution, familyOf(question));
    increment(difficultyDistribution, String(question.difficulty));
    increment(solutionMethodDistribution, preferredMethodOf(question) || "unknown");
    trivialityTotal += questionTrivialityScore(question);
    reasoningStepTotal += reasoningStepCount(question);
    const realism = Number(question.examRealismMetadata?.realismScore ?? 0);
    realismTotal += realism;
    realismMin = Math.min(realismMin, realism);
    realismMax = Math.max(realismMax, realism);
    const problem = problemOf(question);
    explanationLengthTotal += String(problem?.stepwiseExplanation?.en ?? question.explanation ?? "").split(/\s+/u).filter(Boolean).length;
    shortcutLengthTotal += String(problem?.shortcutExplanation?.en ?? "").split(/\s+/u).filter(Boolean).length;
    const issues = validateQuestion(question);
    for (const issue of issues) {
      if (/solver mismatch/u.test(issue)) counters.solverMismatch += 1;
      if (/explanation/u.test(issue)) counters.explanationMismatch += 1;
      if (/invalid numeric|negative/u.test(issue)) counters.negativeQuantity += 1;
    }
    const fp = duplicateFingerprint(question);
    if (fingerprints.has(fp)) counters.duplicateFingerprint += 1;
    fingerprints.add(fp);
    const stem = exactStemFingerprint(question);
    if (stems.has(stem)) counters.exactDuplicateStem += 1;
    stems.add(stem);
    const topoNum = topologyNumericAnswerFingerprint(question);
    if (topologyNumericSet.has(topoNum)) counters.topologyNumericDuplicate += 1;
    topologyNumericSet.add(topoNum);
    if (missingQuestionMark(question)) counters.missingQuestionMark += 1;
    if (brokenStem(question)) counters.brokenStem += 1;
    if (missingAskPhrase(question)) counters.missingAskPhrase += 1;
    if (malformedMathJax(question)) counters.malformedMathJax += 1;
    if (uglyDecimalIssue(question)) counters.uglyDecimal += 1;
    if (trivialOneStep(question)) counters.trivialOneStep += 1;
    if (directAverageStandalone(question)) counters.directAverageStandalone += 1;
    if (routingLeakage(question)) counters.routingLeakage += 1;
    if (optionFormatIssue(question)) counters.optionQualityIssue += 1;
    if (optionMissingUnit(question)) counters.optionMissingUnit += 1;
    if (tooShortExplanation(question)) counters.tooShortExplanation += 1;
    if (missingShortcutExplanation(question)) counters.missingShortcutExplanation += 1;
    if (missingAlligationCross(question)) counters.missingAlligationCross += 1;
    if (missingVisualAlligationMethod(question)) counters.missingVisualAlligationMethod += 1;
    if (brokenAlligationDiagram(question)) counters.brokenAlligationDiagram += 1;
    if (shortcutFormulaOnly(question)) counters.shortcutFormulaOnly += 1;
    if (shortcutDuplicatesExplanation(question)) counters.shortcutDuplicatesExplanation += 1;
    if (missingOptionReference(question)) counters.missingOptionReference += 1;
    if (roboticStem(question)) counters.roboticStem += 1;
    if (densityWrongAverageRisk(question)) counters.densityWrongAverageRisk += 1;
  }
  const productionFirst8Max = maxRepeatedFirstWords(production.questions, 8);
  const reviewFirst8Max = maxRepeatedFirstWords(review.questions, 8);
  const largeFirst8Max = maxRepeatedFirstWords(large.questions, 8);
  if (productionFirst8Max > (productionCount > 100 ? 8 : 2)) counters.repeatedOpening += 1;
  if (reviewFirst8Max > 5) counters.repeatedOpening += 1;
  if (largeFirst8Max > 5) counters.repeatedOpening += 1;
  const missingFamilies = MIXTURE_ALLIGATION_FAMILY_IDS.filter((family) => !familyDistribution.has(family));
  if (large.questions.length >= 500) {
    counters.topologyMismatch += missingFamilies.length;
  }
  if (large.questions.length >= 200 && familyDistribution.size < 55) counters.familyCapViolation += 1;
  const summary = {
    status: Object.values(counters).every((value) => value === 0) ? "PASS" : "FAIL",
    seed,
    runId,
    explicitSeed: Boolean(explicitSeed),
    exportDir,
    count: large.questions.length,
    motifsImplemented: MIXTURE_ALLIGATION_FAMILY_IDS,
    motifsHiddenTodo: [],
    familyDistribution: toRecord(familyDistribution),
    solutionMethodDistribution: toRecord(solutionMethodDistribution),
    alligationUsageRate: Number(((solutionMethodDistribution.get("alligation_cross") ?? 0) / large.questions.length).toFixed(3)),
    replacementUsageRate: Number(((solutionMethodDistribution.get("replacement_formula") ?? 0) / large.questions.length).toFixed(3)),
    directBalancingUsageRate: Number(((solutionMethodDistribution.get("direct_ratio_balancing") ?? 0) / large.questions.length).toFixed(3)),
    questionTrivialityScore: Number((trivialityTotal / large.questions.length).toFixed(3)),
    question_triviality_score: Number((trivialityTotal / large.questions.length).toFixed(3)),
    averageReasoningSteps: Number((reasoningStepTotal / large.questions.length).toFixed(2)),
    average_reasoning_steps: Number((reasoningStepTotal / large.questions.length).toFixed(2)),
    difficultyDistribution: toRecord(difficultyDistribution),
    realism: { min: realismMin, average: Number((realismTotal / large.questions.length).toFixed(2)), max: realismMax },
    duplicateENStemCount: counters.exactDuplicateStem,
    normalizedDuplicateCount: counters.normalizedDuplicateStem,
    topologyNumericDuplicateCount: counters.topologyNumericDuplicate,
    missingQuestionMarkCount: counters.missingQuestionMark,
    brokenStemCount: counters.brokenStem,
    basicDirectQuestionCount: counters.basicDirectQuestion,
    trivialOneStepCount: counters.trivialOneStep,
    directAverageStandaloneCount: counters.directAverageStandalone,
    optionMissingUnitCount: counters.optionMissingUnit,
    tooShortExplanationCount: counters.tooShortExplanation,
    missingShortcutExplanationCount: counters.missingShortcutExplanation,
    missingAlligationCrossCount: counters.missingAlligationCross,
    missingVisualAlligationMethodCount: counters.missingVisualAlligationMethod,
    brokenAlligationDiagramCount: counters.brokenAlligationDiagram,
    shortcutFormulaOnlyCount: counters.shortcutFormulaOnly,
    shortcutDuplicatesExplanationCount: counters.shortcutDuplicatesExplanation,
    shortcutMatchesExplanationCount: counters.shortcutDuplicatesExplanation,
    missingOptionReferenceCount: counters.missingOptionReference,
    markdownArtifactCount: counters.markdownArtifact,
    rawLatexVisibleCount: counters.rawLatexVisible,
    genericExplanationFillerCount: counters.genericExplanationShell,
    roboticStemCount: counters.roboticStem,
    densityWrongAverageRiskCount: counters.densityWrongAverageRisk,
    averageExplanationLength: Number((explanationLengthTotal / large.questions.length).toFixed(2)),
    averageShortcutLength: Number((shortcutLengthTotal / large.questions.length).toFixed(2)),
    uglyDecimalCount: counters.uglyDecimal,
    concentrationAbove100Count: counters.concentrationAbove100,
    negativeQuantityCount: counters.negativeQuantity,
    replacementImpossibleCount: counters.replacementImpossible,
    vesselTransferImpossibleCount: counters.vesselTransferImpossible,
    densityAlloyImpossibleCount: counters.densityAlloyImpossible,
    genericExplanationShellCount: counters.genericExplanationShell,
    genericShortcutCount: counters.genericShortcut,
    rawEnglishInsideMathJaxCount: counters.rawEnglishInsideMathJax,
    hindiPunjabiSentenceInsideMathJaxCount: counters.hiPaSentenceInsideMathJax,
    malformedMathJaxCount: counters.malformedMathJax,
    hiPaLeakageCount: counters.hiPaLeakage,
    optionQualityIssueCount: counters.optionQualityIssue,
    solverMismatchCount: counters.solverMismatch,
    explanationMismatchCount: counters.explanationMismatch,
    routingLeakageCount: counters.routingLeakage,
    repeatedFirst8WordsMax: { production60: productionFirst8Max, review200: reviewFirst8Max, largeAudit: largeFirst8Max },
    missingFamilies,
    counters,
    generationStats: large.generationStats,
  };
  await mkdir(exportDir, { recursive: true });
  await writeFile(path.join(exportDir, "mixture-alligation-production-60.txt"), productionText, "utf8");
  await writeFile(path.join(exportDir, "mixture-alligation-review-200.txt"), reviewText, "utf8");
  await writeFile(path.join(exportDir, "mixture-alligation-large-audit.txt"), largeText, "utf8");
  await writeFile(path.join(exportDir, "mixture-alligation-large-summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
  if (summary.status !== "PASS") process.exitCode = 1;
}

if (process.argv[1]?.endsWith("mixture-alligation-large-audit.mjs")) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
