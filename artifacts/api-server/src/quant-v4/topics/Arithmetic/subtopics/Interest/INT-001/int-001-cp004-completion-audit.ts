import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP004_QL_IDS,
  INT_CP004_REGISTRY,
  canonicalCp004Answer,
  generateIntCp004Question,
  verifyCp004Answer,
  type IntCp004Question,
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

const FORBIDDEN_STEM = /\b(?:population|depreciation|simple versus compound|simple-interest difference|instalment|repayment|different annual rates|successive rates|banker'?s discount|true discount)\b/iu;
const FORBIDDEN_EXPLANATION = /\b(?:annual factor|growth factor|accumulated multiplier|geometric progression|inverse relation|canonical|verifier|mathematical state|rate substitution|period topology)\b/iu;
const METHOD_HINT = /\b(?:use .*? to find|divide .*? to obtain|work backwards by|reconstruct|apply the formula)\b/iu;
const INVERSE_QLS = new Set(["INT-QL-069", "INT-QL-070", "INT-QL-071", "INT-QL-072", "INT-QL-077", "INT-QL-081", "INT-QL-082", "INT-QL-083"]);

let questionCount = 0;
let verifierChecks = 0;
let deterministicChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;
let inverseLeakChecks = 0;
const qlCounts = new Map<string, number>();
const answerPositions = [0, 0, 0, 0];
const frequencies = new Set<number>();
const representations = new Set<string>();
const difficulties = new Set<string>();
const semantics = new Set<string>();
const domains = new Set<string>();
const templateKeys = new Set<string>();

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

    explanationChecks += 6;
    const explanationText = [question.explanation.whatAsked, ...question.explanation.steps, question.explanation.finalAnswer, question.explanation.commonMistake].join(" ");
    if (!question.explanation.whatAsked.startsWith("We need to find")) fail(`${qlId}/${seed}: explanation does not first state the target.`);
    if (wordCount(explanationText) < 55) fail(`${qlId}/${seed}: explanation is too short (${wordCount(explanationText)} words).`);
    if (question.explanation.steps.length < 3) fail(`${qlId}/${seed}: explanation has fewer than three teaching steps.`);
    if (!question.explanation.steps.some((step) => /[=÷×+−]/u.test(step))) fail(`${qlId}/${seed}: explanation shows no intermediate calculation.`);
    if (FORBIDDEN_EXPLANATION.test(explanationText)) fail(`${qlId}/${seed}: technical internal wording reached the explanation.`);
    if (!question.explanation.finalAnswer.includes(question.correctAnswer)) fail(`${qlId}/${seed}: final answer does not match the keyed option.`);

    if (FORBIDDEN_STEM.test(question.stem)) fail(`${qlId}/${seed}: stem drifted outside CP-004.`);
    if (METHOD_HINT.test(question.stem)) fail(`${qlId}/${seed}: stem reveals the method.`);
    if (!question.stem.includes("?")) {
      if (!/\bFind\b/u.test(question.stem)) fail(`${qlId}/${seed}: stem has no clear task prompt.`);
    }

    if (INVERSE_QLS.has(qlId)) {
      inverseLeakChecks += 1;
      if (containsExactDisplay(question.stem, question.correctAnswer)) fail(`${qlId}/${seed}: inverse answer leaked into the displayed stem.`);
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
for (const expected of ["Easy", "Medium", "Hard"]) if (!difficulties.has(expected)) fail(`Difficulty ${expected} is missing.`);
for (const expected of ["MONEY", "RATE_PERCENT", "DURATION", "FREQUENCY"]) if (!semantics.has(expected)) fail(`Answer semantic ${expected} is missing.`);
for (const expected of ["COMPLETE_PERIODS", "FREQUENCY_COMPARISON", "EFFECTIVE_RATE", "BROKEN_PERIOD", "MIXED_FREQUENCY"]) if (!domains.has(expected)) fail(`Domain ${expected} is missing.`);
if (answerPositions.some((count) => count < 350)) fail(`Answer positions are poorly distributed: ${answerPositions.join("/")}.`);
if (templateKeys.size < 70) fail(`Editorial template coverage is too low: ${templateKeys.size}.`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-frequency-broken-periods");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "INT_CP004_ENGLISH_IMPLEMENTATION_COMPLETE_REVIEW_REQUIRED",
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: INT_CP004_QL_IDS.length,
  questionCount,
  verifierChecks,
  deterministicChecks,
  optionChecks,
  explanationChecks,
  inverseLeakChecks,
  lifecycleChecks,
  frozenObjectChecks,
  answerPositions,
  frequencies: [...frequencies].sort((a, b) => a - b),
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
