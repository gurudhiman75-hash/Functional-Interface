import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP004_QL_IDS,
  INT_CP004_REGISTRY,
  INT_CP004_EDITORIAL_REMEDIATION_VERSION,
  canonicalCp004Answer,
  generateIntCp004Question,
  verifyCp004Answer,
} from "./cp004-frequency-runtime";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}
function fail(message: string): never { throw new Error(message); }
function wordCount(value: string): number { return value.match(/[A-Za-z0-9₹%]+/gu)?.length ?? 0; }
function containsExactDisplay(text: string, display: string): boolean {
  const escaped = display.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^0-9.])${escaped}($|[^0-9])`, "u").test(text);
}
function assertDeepFrozen(value: unknown, path: string, seen = new WeakSet<object>()): number {
  if (typeof value !== "object" || value === null) return 0;
  if (seen.has(value)) return 0;
  seen.add(value);
  if (!Object.isFrozen(value)) fail(`${path}: mutable object reached runtime output.`);
  let count = 1;
  for (const key of Reflect.ownKeys(value)) count += assertDeepFrozen((value as Record<PropertyKey, unknown>)[key], `${path}.${String(key)}`, seen);
  return count;
}
function pairKey(left: number, right: number): string { return [left, right].sort((a, b) => a - b).join("-"); }

const FORBIDDEN_STEM = /\b(?:population|depreciation|simple versus compound|simple-interest difference|instalment|repayment|different annual rates|successive rates|banker'?s discount|true discount)\b/iu;
const FORBIDDEN_EXPLANATION = /\b(?:annual factor|growth factor|accumulated multiplier|geometric progression|inverse relation|canonical|verifier|mathematical state|rate substitution|period topology)\b/iu;
const METHOD_HINT = /\b(?:use .*? to find|divide .*? to obtain|work backwards by|reconstruct|apply the formula)\b/iu;
const HIGH_RATE_BANKING_CONTEXT = /\b(?:bank|banking|fixed deposit|savings account|loan|borrowed|lender)\b/iu;
const INVERSE_QLS = new Set(["INT-QL-069", "INT-QL-070", "INT-QL-071", "INT-QL-072", "INT-QL-077", "INT-QL-081", "INT-QL-082", "INT-QL-083"]);
const EXACT_RATIO_QLS = new Set(["INT-QL-069", "INT-QL-070", "INT-QL-081"]);
const REPRESENTATION_TABLES = new Set(["TERMS_TABLE", "BALANCE_RECORD", "SCHEME_COMPARISON"]);
const EASY_DIRECT_QLS = new Set(["INT-QL-067", "INT-QL-068", "INT-QL-073", "INT-QL-074"]);

let questionCount = 0;
let verifierChecks = 0;
let deterministicChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;
let inverseLeakChecks = 0;
let inversePedagogyChecks = 0;
let misconceptionOwnershipChecks = 0;
let representationStructureChecks = 0;
let contextRateChecks = 0;
let examArithmeticChecks = 0;
let moneyAnswerQuestions = 0;
let decimalMoneyAnswerQuestions = 0;
const qlCounts = new Map<string, number>();
const answerPositions = [0, 0, 0, 0];
const frequencies = new Set<number>();
const representations = new Set<string>();
const difficulties = new Set<string>();
const semantics = new Set<string>();
const domains = new Set<string>();
const templateKeys = new Set<string>();
const ql077Frequencies = new Set<number>();
const ql075Pairs = new Set<string>();
const ql076Frequencies = new Set<number>();
const ql078Frequencies = new Set<number>();
const brokenTailMonths = new Set<number>();
const mixedFrequencies = new Set<number>();

for (const qlId of INT_CP004_QL_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp004-completion:${qlId}:${index}`;
    const question = generateIntCp004Question(qlId, seed);
    const replay = generateIntCp004Question(qlId, seed);
    questionCount += 1;
    qlCounts.set(qlId, (qlCounts.get(qlId) ?? 0) + 1);

    deterministicChecks += 1;
    if (stable(question) !== stable(replay)) fail(`${qlId}/${seed}: generation is not deterministic.`);

    const canonical = canonicalCp004Answer(question.mathematicalState);
    verifierChecks += 2;
    if (stable(canonical) !== stable(question.solution)) fail(`${qlId}/${seed}: canonical answer changed after generation.`);
    if (!verifyCp004Answer(question.mathematicalState, question.solution)) fail(`${qlId}/${seed}: independent relation verification failed.`);

    optionChecks += 6;
    if (question.options.length !== 4) fail(`${qlId}/${seed}: option count is not four.`);
    if (question.options.filter((option) => option.isCorrect).length !== 1) fail(`${qlId}/${seed}: correct-option count is not one.`);
    if (question.correctIndex < 0 || question.correctIndex > 3 || !question.options[question.correctIndex]?.isCorrect) fail(`${qlId}/${seed}: correct index is invalid.`);
    if (new Set(question.options.map((option) => stable(option.value))).size !== 4) fail(`${qlId}/${seed}: duplicate option values.`);
    if (new Set(question.options.map((option) => option.text)).size !== 4) fail(`${qlId}/${seed}: duplicate option display values.`);
    if (question.options.some((option) => !option.isCorrect && option.misconceptionId === "CORRECT")) fail(`${qlId}/${seed}: wrong option has correct metadata.`);

    misconceptionOwnershipChecks += 1;
    const wrongMisconceptions = question.options.filter((option) => !option.isCorrect).map((option) => option.misconceptionId);
    if (wrongMisconceptions.some((id) => id === "NEARBY_RATE" || id === "ARITHMETIC_SLIP" || id === "ARITHMETIC_SLIP_FALLBACK")) {
      fail(`${qlId}/${seed}: generic or arbitrary distractor reached the review corpus.`);
    }
    if (new Set(wrongMisconceptions).size !== 3) fail(`${qlId}/${seed}: wrong options do not have three distinct misconception owners.`);

    explanationChecks += 6;
    const explanationText = [question.explanation.whatAsked, ...question.explanation.steps, question.explanation.finalAnswer, question.explanation.commonMistake].join(" ");
    if (!question.explanation.whatAsked.startsWith("We need to find")) fail(`${qlId}/${seed}: explanation does not first state the target.`);
    if (wordCount(explanationText) < 65) fail(`${qlId}/${seed}: explanation is too short (${wordCount(explanationText)} words).`);
    if (question.explanation.steps.length < 3) fail(`${qlId}/${seed}: explanation has fewer than three teaching steps.`);
    if (!question.explanation.steps.some((step) => /[=÷×+−]/u.test(step))) fail(`${qlId}/${seed}: explanation shows no intermediate calculation.`);
    if (FORBIDDEN_EXPLANATION.test(explanationText)) fail(`${qlId}/${seed}: technical internal wording reached the explanation.`);
    if (!question.explanation.finalAnswer.includes(question.correctAnswer)) fail(`${qlId}/${seed}: final answer does not match the keyed option.`);
    if (/Continue the same calculation/iu.test(explanationText)) fail(`${qlId}/${seed}: explanation hides undisplayed repeated arithmetic.`);

    if (INVERSE_QLS.has(qlId)) {
      inversePedagogyChecks += 1;
      if (question.explanation.steps.length < 5) fail(`${qlId}/${seed}: inverse explanation is not sufficiently worked.`);
      if (!question.explanation.steps.some((step) => step.includes(question.correctAnswer) || step.includes(question.correctAnswer.replace(/ complete years?$/u, "")))) {
        fail(`${qlId}/${seed}: inverse explanation never numerically establishes the keyed answer.`);
      }
      if (EXACT_RATIO_QLS.has(qlId) && !/\b\d+\/\d+\b/u.test(explanationText)) {
        fail(`${qlId}/${seed}: exact-ratio inverse uses only rounded decimal arithmetic.`);
      }
    }

    if (FORBIDDEN_STEM.test(question.stem)) fail(`${qlId}/${seed}: stem drifted outside CP-004.`);
    if (METHOD_HINT.test(question.stem)) fail(`${qlId}/${seed}: stem reveals the method.`);
    if (!question.stem.includes("?") && !/\bFind\b/u.test(question.stem)) fail(`${qlId}/${seed}: stem has no clear task prompt.`);

    if (INVERSE_QLS.has(qlId)) {
      inverseLeakChecks += 1;
      if (containsExactDisplay(question.stem, question.correctAnswer)) fail(`${qlId}/${seed}: inverse answer leaked into the displayed stem.`);
    }

    representationStructureChecks += 1;
    if (REPRESENTATION_TABLES.has(question.representation) && !/\|\s*---/u.test(question.stem)) {
      fail(`${qlId}/${seed}: ${question.representation} is labelled as structured but contains no actual table.`);
    }
    if (question.representation === "STANDARD_PROSE" && /\|\s*---/u.test(question.stem)) {
      fail(`${qlId}/${seed}: standard prose unexpectedly contains a table.`);
    }

    contextRateChecks += 1;
    const rate = question.mathematicalState.nominalAnnualRatePercent;
    const highRate = rate.numerator > 20n * rate.denominator;
    if (highRate && HIGH_RATE_BANKING_CONTEXT.test(question.stem)) {
      fail(`${qlId}/${seed}: high nominal rate is presented as a normal banking product.`);
    }

    examArithmeticChecks += 1;
    if (EASY_DIRECT_QLS.has(qlId) && question.mathematicalState.periods > 6) {
      fail(`${qlId}/${seed}: Easy direct question exceeds six compounding periods.`);
    }
    if (question.answerSemantic === "MONEY") {
      moneyAnswerQuestions += 1;
      if (question.solution.denominator !== 1n) decimalMoneyAnswerQuestions += 1;
      if ((question.solution.numerator * 100n) % question.solution.denominator !== 0n) {
        fail(`${qlId}/${seed}: money answer requires hidden precision beyond paise.`);
      }
    }

    lifecycleChecks += 8;
    if (question.approvalStatus !== "NOT_APPROVED" || question.enabled || question.stagingStatus !== "NOT_STAGED"
      || question.registrationStatus !== "NOT_REGISTERED" || question.questionStudioDiscoverable
      || question.questionBankStatus !== "NOT_STORED" || question.testEligibility !== "INELIGIBLE"
      || question.publiclyPublishable) fail(`${qlId}/${seed}: inactive lifecycle boundary changed.`);

    frozenObjectChecks += assertDeepFrozen(question, `${qlId}/${seed}`);
    answerPositions[question.correctIndex] += 1;
    frequencies.add(question.mathematicalState.frequency);
    frequencies.add(question.mathematicalState.firstFrequency);
    frequencies.add(question.mathematicalState.secondFrequency);
    if (qlId === "INT-QL-075") ql075Pairs.add(pairKey(question.mathematicalState.frequency, question.mathematicalState.comparisonFrequency));
    if (qlId === "INT-QL-076") ql076Frequencies.add(question.mathematicalState.frequency);
    if (qlId === "INT-QL-077") ql077Frequencies.add(question.mathematicalState.frequency);
    if (qlId === "INT-QL-078") ql078Frequencies.add(question.mathematicalState.frequency);
    if (["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(qlId)) brokenTailMonths.add(question.mathematicalState.tailMonths);
    if (qlId === "INT-QL-084" || qlId === "INT-QL-085") {
      mixedFrequencies.add(question.mathematicalState.firstFrequency);
      mixedFrequencies.add(question.mathematicalState.secondFrequency);
    }
    representations.add(question.representation);
    difficulties.add(question.difficulty);
    semantics.add(question.answerSemantic);
    domains.add(INT_CP004_REGISTRY.find((entry) => entry.qlId === qlId)!.domain);
    templateKeys.add(`${qlId}|${question.stem.replace(/₹[0-9,.]+/gu, "₹X").replace(/[0-9]+(?:\.[0-9]+)?%/gu, "R%").replace(/\b[0-9]+\b/gu, "N")}`);
  }
}

if (INT_CP004_REGISTRY.length !== 19 || INT_CP004_QL_IDS.length !== 19) fail("CP-004 QL count changed from the executable discovery result of 19.");
if (questionCount !== 1900) fail(`Question count changed: ${questionCount}.`);
if ([...qlCounts.values()].some((count) => count !== 100)) fail("One or more QLs did not receive 100 audit seeds.");
if (frequencies.size !== 4) fail(`Frequency coverage changed: ${frequencies.size}/4.`);
if (representations.size < 4) fail(`Representation coverage changed: ${representations.size}/4.`);
if (ql077Frequencies.size !== 2 || !ql077Frequencies.has(2) || !ql077Frequencies.has(4)) fail("INT-QL-077 must cover half-yearly and quarterly inverse effective-rate cases.");
if (!ql075Pairs.has("1-2")) fail("INT-QL-075 audit corpus must include annual-versus-half-yearly comparison.");
if (!ql076Frequencies.has(12)) fail("INT-QL-076 audit corpus must include monthly effective-rate questions.");
if (ql078Frequencies.size !== 4) fail("INT-QL-078 must identify all four supported compounding frequencies across the audit corpus.");
if (brokenTailMonths.size !== 3) fail("Broken-period QLs must cover 3, 6 and 9 month tails across the corpus.");
if (mixedFrequencies.size !== 4 || !mixedFrequencies.has(12)) fail("Mixed-frequency QLs must include annual, half-yearly, quarterly and monthly intervals across the corpus.");
if (moneyAnswerQuestions !== 1200) fail(`Money-answer audit count changed: ${moneyAnswerQuestions}.`);
if (decimalMoneyAnswerQuestions / moneyAnswerQuestions > 0.30) fail(`Decimal-money share is too high: ${decimalMoneyAnswerQuestions}/${moneyAnswerQuestions}.`);
for (const expected of ["Easy", "Medium", "Hard"]) if (!difficulties.has(expected)) fail(`Difficulty ${expected} is missing.`);
for (const expected of ["MONEY", "RATE_PERCENT", "DURATION", "FREQUENCY"]) if (!semantics.has(expected)) fail(`Answer semantic ${expected} is missing.`);
for (const expected of ["COMPLETE_PERIODS", "FREQUENCY_COMPARISON", "EFFECTIVE_RATE", "BROKEN_PERIOD", "MIXED_FREQUENCY"]) if (!domains.has(expected)) fail(`Domain ${expected} is missing.`);
if (answerPositions.some((count) => count < 350)) fail(`Answer positions are poorly distributed: ${answerPositions.join("/")}.`);
if (templateKeys.size < 75) fail(`Editorial template coverage is too low: ${templateKeys.size}.`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-frequency-broken-periods");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "INT_CP004_ENGLISH_IMPLEMENTATION_COMPLETE_REVIEW_REQUIRED",
  editorialRemediationStatus: "INT_CP004_EXAM_READINESS_V4_REVIEW_REQUIRED",
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: INT_CP004_QL_IDS.length,
  questionCount,
  verifierChecks,
  deterministicChecks,
  optionChecks,
  explanationChecks,
  inverseLeakChecks,
  inversePedagogyChecks,
  misconceptionOwnershipChecks,
  representationStructureChecks,
  contextRateChecks,
  examArithmeticChecks,
  moneyAnswerQuestions,
  decimalMoneyAnswerQuestions,
  decimalMoneyShare: Number((decimalMoneyAnswerQuestions / moneyAnswerQuestions).toFixed(4)),
  lifecycleChecks,
  frozenObjectChecks,
  answerPositions,
  frequencies: [...frequencies].sort((a, b) => a - b),
  frequencyComparisonPairs: [...ql075Pairs].sort(),
  effectiveRateFrequencies: [...ql076Frequencies].sort((a, b) => a - b),
  effectiveRateInverseFrequencies: [...ql077Frequencies].sort((a, b) => a - b),
  frequencyIdentificationFrequencies: [...ql078Frequencies].sort((a, b) => a - b),
  brokenTailMonths: [...brokenTailMonths].sort((a, b) => a - b),
  mixedIntervalFrequencies: [...mixedFrequencies].sort((a, b) => a - b),
  representations: [...representations].sort(),
  difficulties: [...difficulties].sort(),
  answerSemantics: [...semantics].sort(),
  domains: [...domains].sort(),
  normalizedTemplateCount: templateKeys.size,
  versions: {
    authority: "INT-CP-004-MATH-AUTHORITY-v1",
    generator: "INT-CP-004-EXAM-GENERATOR-v1",
    solver: "INT-CP-004-CANONICAL-SOLVER-v1",
    verifier: "INT-CP-004-RELATION-VERIFIER-v1",
    editorialRemediation: INT_CP004_EDITORIAL_REMEDIATION_VERSION,
  },
  lifecycle: {
    approvalStatus: "NOT_APPROVED",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
writeFileSync(join(outputDirectory, "int-cp004-completion-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_FREQUENCY_BROKEN_PERIODS_COMPLETION");
