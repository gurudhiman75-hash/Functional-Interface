import {
  INT_CP001_FINAL_QL_IDS,
  INT_CP001_FINAL_REGISTRY,
} from "./cp001-final-registry";
import { INT_CP001_EDITORIAL_RELEASE_ID, INT_CP001_EDITORIAL_STANDARD } from "./cp001-editorial-release";
import { generateIntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import { containsRawAsciiMath, hasGenericTextbookStemOpening } from "./cp001-editorial-v3";
import { assertIntCp001ClosureFoundation } from "./final-closure/final-closure";
import { runIntCp001LegacyFixtureAudit } from "./cp001-legacy-fixture-audit";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function fail(message: string): never {
  throw new Error(message);
}

function hasBalancedDisplayMath(value: string): boolean {
  const delimiters = value.match(/\$\$/gu) ?? [];
  return value.startsWith("$$") && value.endsWith("$$") && delimiters.length % 2 === 0;
}

assertIntCp001ClosureFoundation();
const legacy = runIntCp001LegacyFixtureAudit();
if (!legacy.ok) fail(`Legacy fixture audit failed: ${legacy.errors.join(" | ")}`);

if (INT_CP001_FINAL_REGISTRY.length !== 21) fail(`Expected 21 final QLs; found ${INT_CP001_FINAL_REGISTRY.length}.`);
if (new Set(INT_CP001_FINAL_QL_IDS).size !== INT_CP001_FINAL_QL_IDS.length) fail("Final QL registry contains duplicate IDs.");

for (const [index, qlId] of INT_CP001_FINAL_QL_IDS.entries()) {
  const expected = `INT-QL-${String(index + 1).padStart(3, "0")}`;
  if (qlId !== expected) fail(`Non-consecutive QL allocation at ${qlId}; expected ${expected}.`);
}

const perQl: Record<string, unknown> = {};
const difficultyCounts = new Map<string, number>();
const semanticCounts = new Map<string, number>();
const topologyCounts = new Map<string, number>();
const sourceKindCounts = new Map<string, number>();
const globalStems = new Map<string, string>();
let generated = 0;
let internalLeaks = 0;
let fractionalMoneyOptions = 0;
let ungroupedCurrencyFindings = 0;
let fourTierPackages = 0;
let shortcutPackages = 0;
let shortcutMathPackages = 0;
let inlineMathPackages = 0;
let genericTextbookOpenings = 0;
let analysedDistractors = 0;

for (const entry of INT_CP001_FINAL_REGISTRY) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const answers = new Set<string>();
  const positions = new Set<number>();
  const adapters = new Set<string>();
  const representations = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const seed = `freeze-${index}`;
    const item = generateIntCp001FinalEditorialV3Question(entry.qlId, seed);
    const repeat = generateIntCp001FinalEditorialV3Question(entry.qlId, seed);
    generated += 1;

    if (stable(item) !== stable(repeat)) fail(`${entry.qlId}/${seed} is not deterministic.`);
    if (!item.validation.ok) fail(`${entry.qlId}/${seed}: ${item.validation.errors.join(" | ")}`);
    if (item.permanentQlId !== entry.qlId || item.qlId !== entry.qlId) fail(`${entry.qlId}/${seed} lost permanent identity.`);
    if (item.releaseId !== INT_CP001_EDITORIAL_RELEASE_ID || item.maturity !== "FROZEN_ENGLISH_CONTRACT") fail(`${entry.qlId}/${seed} lost editorial release traceability.`);
    if (item.publiclyPublishable || item.questionStudioDiscoverable) fail(`${entry.qlId}/${seed} breached review-only safety.`);
    if (item.questionBankStatus !== "NOT_STORED" || item.testEligibility !== "INELIGIBLE") fail(`${entry.qlId}/${seed} breached storage/test safety.`);
    if (item.options.length !== 4 || new Set(item.options).size !== 4) fail(`${entry.qlId}/${seed} does not have four unique options.`);
    if (item.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1) fail(`${entry.qlId}/${seed} has an invalid correct-option audit.`);
    if (item.options[item.correctIndex] !== item.optionAudit[item.correctIndex]?.text) fail(`${entry.qlId}/${seed} option audit ordering mismatch.`);
    if (!item.explanation.stepByStep.conclusion.includes(item.options[item.correctIndex]!)) fail(`${entry.qlId}/${seed} conclusion does not state the answer.`);

    const explanation = item.explanation;
    if (explanation.coreConcept.heading !== "📌 Core Concept & Formula") fail(`${entry.qlId}/${seed} lacks the core-concept tier.`);
    if (explanation.stepByStep.heading !== "📝 Step-by-Step Solution") fail(`${entry.qlId}/${seed} lacks the step-by-step tier.`);
    if (explanation.examShortcut.heading !== "⚡ Exam Speed Shortcut") fail(`${entry.qlId}/${seed} lacks the shortcut tier.`);
    if (explanation.trapAnalysis.heading !== "⚠️ Common Traps & Distractor Analysis") fail(`${entry.qlId}/${seed} lacks the trap-analysis tier.`);
    if (!hasBalancedDisplayMath(explanation.coreConcept.displayMath)) fail(`${entry.qlId}/${seed} has invalid core MathJax.`);
    if (!explanation.examShortcut.displayMath || !hasBalancedDisplayMath(explanation.examShortcut.displayMath)) fail(`${entry.qlId}/${seed} has invalid shortcut MathJax.`);
    if (!explanation.examShortcut.narrative.trim()) fail(`${entry.qlId}/${seed} has an empty exam shortcut.`);
    if (/^(?:Find|Determine)\b/u.test(explanation.examShortcut.narrative)) fail(`${entry.qlId}/${seed} shortcut begins with an imperative fragment.`);
    if (explanation.trapAnalysis.items.length !== 3) fail(`${entry.qlId}/${seed} does not analyse all three distractors.`);
    for (const trap of explanation.trapAnalysis.items) {
      const optionIndex = trap.optionNumber - 1;
      if (optionIndex === item.correctIndex) fail(`${entry.qlId}/${seed} analyses the correct option as a trap.`);
      if (trap.optionText !== item.options[optionIndex]) fail(`${entry.qlId}/${seed} trap option text is out of sync.`);
      if (trap.misconceptionId !== item.optionAudit[optionIndex]?.misconceptionId) fail(`${entry.qlId}/${seed} trap misconception ID is out of sync.`);
      if (!trap.explanation.trim()) fail(`${entry.qlId}/${seed} contains an empty distractor explanation.`);
    }
    fourTierPackages += 1;
    shortcutPackages += 1;
    shortcutMathPackages += 1;
    analysedDistractors += explanation.trapAnalysis.items.length;

    const learnerText = [
      item.stem,
      ...item.options,
      explanation.coreConcept.narrative,
      explanation.coreConcept.displayMath,
      ...explanation.stepByStep.steps,
      explanation.stepByStep.verification,
      explanation.stepByStep.conclusion,
      explanation.examShortcut.narrative,
      explanation.examShortcut.displayMath,
      ...explanation.trapAnalysis.items.flatMap((trap) => [trap.optionText, trap.explanation]),
    ].join(" ");
    const hasInternalIdentity = /INT-(?:CP|QL)|PROT-/iu.test(learnerText);
    const hasUnresolvedToken = /\b(?:undefined|null|NaN|Infinity|PLACEHOLDER|TODO|TBD)\b/iu.test(learnerText);
    if (hasInternalIdentity || hasUnresolvedToken) {
      internalLeaks += 1;
      fail(`${entry.qlId}/${seed} contains an internal or unresolved learner token.`);
    }
    if (/\{\{[^}]+\}\}/u.test(learnerText)) fail(`${entry.qlId}/${seed} contains a template placeholder.`);
    if (/\ba (?:education|equipment) loan\b/iu.test(learnerText)) fail(`${entry.qlId}/${seed} contains an article error.`);
    if (/₹\s*-?\d{4,}(?![\d,])/u.test(learnerText)) {
      ungroupedCurrencyFindings += 1;
      fail(`${entry.qlId}/${seed} contains an ungrouped four-or-more-digit rupee value.`);
    }
    if (containsRawAsciiMath(learnerText)) fail(`${entry.qlId}/${seed} contains raw ASCII fractions or variable notation outside MathJax.`);
    inlineMathPackages += 1;
    if (hasGenericTextbookStemOpening(item.stem)) {
      genericTextbookOpenings += 1;
      fail(`${entry.qlId}/${seed} retains a generic textbook opening that should be contextualised.`);
    }
    if (!item.stem.endsWith("?")) fail(`${entry.qlId}/${seed} stem is not a complete interrogative question.`);
    if (/(?:^|[.!?]\s+)(?:Find|Determine)\b/u.test(item.stem)) fail(`${entry.qlId}/${seed} uses an imperative question fragment.`);
    if (/^For [A-Z][\p{L}-]*'s .+ earns /u.test(item.stem)) fail(`${entry.qlId}/${seed} uses a malformed 'For <name>\'s ... earns' opening.`);
    if (/\bratio\s+\d+:\d+\s+of\b/iu.test(item.stem)) fail(`${entry.qlId}/${seed} uses an unreadable ratio-of construction.`);

    if (entry.qlId === "INT-QL-021") {
      for (const [optionIndex, option] of item.optionAudit.entries()) {
        const value = option.result.value as { denominator?: bigint };
        if (typeof value.denominator !== "bigint" || value.denominator > 2n) {
          fail(`${entry.qlId}/${seed} option ${optionIndex + 1} is not a whole- or half-year duration.`);
        }
      }
    }

    for (const option of item.options) {
      if (/^₹-?[\d,]+ \d+\/\d+$/u.test(option) || /^₹-?[\d,]+\/\d+$/u.test(option)) fractionalMoneyOptions += 1;
    }

    stems.add(item.stem);
    fingerprints.add(item.mathematicalFingerprint);
    answers.add(item.options[item.correctIndex]!);
    positions.add(item.correctIndex);
    adapters.add(`${item.internalProvenance.sourceKind}:${item.internalProvenance.sourcePrototypeId}`);
    representations.add(item.internalProvenance.representation ?? "DEFAULT");
    difficultyCounts.set(item.difficulty, (difficultyCounts.get(item.difficulty) ?? 0) + 1);
    semanticCounts.set(item.answerSemantic, (semanticCounts.get(item.answerSemantic) ?? 0) + 1);
    topologyCounts.set(item.topology, (topologyCounts.get(item.topology) ?? 0) + 1);
    sourceKindCounts.set(item.internalProvenance.sourceKind, (sourceKindCounts.get(item.internalProvenance.sourceKind) ?? 0) + 1);

    const normalisedStem = item.stem
      .toLowerCase()
      .replace(/₹[\d,.]+/gu, "₹#")
      .replace(/\$-?\d*\\frac\{\d+\}\{\d+\}\$/gu, "#")
      .replace(/\d+(?:\.\d+)?(?:\/\d+)?/gu, "#");
    const existingQl = globalStems.get(normalisedStem);
    if (existingQl && existingQl !== entry.qlId) fail(`Cross-QL normalised stem collision: ${existingQl} and ${entry.qlId}.`);
    globalStems.set(normalisedStem, entry.qlId);
  }

  if (stems.size < 35) fail(`${entry.qlId} has insufficient rendered-stem diversity: ${stems.size}.`);
  if (fingerprints.size < 35) fail(`${entry.qlId} has insufficient mathematical diversity: ${fingerprints.size}.`);
  if (answers.size < 8) fail(`${entry.qlId} has insufficient answer diversity: ${answers.size}.`);
  if (stable([...positions].sort()) !== stable([0, 1, 2, 3])) fail(`${entry.qlId} lacks all answer positions.`);
  if (adapters.size !== entry.sourceAdapters.length) fail(`${entry.qlId} did not exercise every frozen source adapter: ${adapters.size}/${entry.sourceAdapters.length}.`);

  perQl[entry.qlId] = {
    solveContract: entry.solveContract,
    distinctStems: stems.size,
    distinctFingerprints: fingerprints.size,
    distinctAnswers: answers.size,
    answerPositions: [...positions].sort(),
    adapters: [...adapters].sort(),
    representations: [...representations].sort(),
    fourTierPackages: 80,
    shortcutPackages: 80,
    shortcutMathPackages: 80,
    inlineMathPackages: 80,
    analysedDistractors: 240,
  };
}

for (const difficulty of ["Easy", "Medium", "Hard"]) {
  if (!difficultyCounts.has(difficulty)) fail(`Final audit does not reach ${difficulty}.`);
}
for (const sourceKind of ["FOUNDATION", "WAVE2", "CLOSURE"]) {
  if (!sourceKindCounts.has(sourceKind)) fail(`Final audit does not exercise source kind ${sourceKind}.`);
}
if (fractionalMoneyOptions !== 0) fail(`Final audit found ${fractionalMoneyOptions} fractional-money options.`);
if (fourTierPackages !== generated) fail(`Only ${fourTierPackages}/${generated} packages passed the four-tier gate.`);
if (shortcutPackages !== generated) fail(`Only ${shortcutPackages}/${generated} packages contain shortcuts.`);
if (shortcutMathPackages !== generated) fail(`Only ${shortcutMathPackages}/${generated} packages contain shortcut MathJax.`);
if (inlineMathPackages !== generated) fail(`Only ${inlineMathPackages}/${generated} packages passed inline-MathJax normalisation.`);
if (genericTextbookOpenings !== 0) fail(`Final audit found ${genericTextbookOpenings} generic textbook openings.`);
if (analysedDistractors !== generated * 3) fail(`Expected ${generated * 3} distractor analyses; found ${analysedDistractors}.`);

console.log(JSON.stringify({
  status: "PASS",
  releaseId: INT_CP001_EDITORIAL_RELEASE_ID,
  editorialStandard: INT_CP001_EDITORIAL_STANDARD,
  cpId: "INT-CP-001",
  finalQlCount: INT_CP001_FINAL_REGISTRY.length,
  generated,
  legacyFixturesChecked: legacy.checked,
  legacyDispositions: legacy.dispositions,
  difficultyCounts: Object.fromEntries([...difficultyCounts.entries()].sort()),
  semanticCounts: Object.fromEntries([...semanticCounts.entries()].sort()),
  topologyCounts: Object.fromEntries([...topologyCounts.entries()].sort()),
  sourceKindCounts: Object.fromEntries([...sourceKindCounts.entries()].sort()),
  fourTierPackages,
  shortcutPackages,
  shortcutMathPackages,
  inlineMathPackages,
  genericTextbookOpenings,
  analysedDistractors,
  fractionalMoneyOptions,
  ungroupedCurrencyFindings,
  internalLeaks,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  perQl,
}, null, 2));
