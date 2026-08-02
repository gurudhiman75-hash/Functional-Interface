import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP002_FINAL_QL_IDS,
  INT_CP002_FINAL_REGISTRY,
  INT_CP002_RELEASE_CANDIDATE_ID,
  type IntCp002FinalQlId,
} from "./cp002-final-registry";
import { generateIntCp002FinalQuestion } from "./cp002-final-runtime";
import { INT_CP002_WAVE01_PROTOTYPE_IDS } from "./cp002-wave01-types";
import { INT_CP002_WAVE02_PROTOTYPE_IDS } from "./cp002-wave02-types";
import { INT_CP002_FINAL_CLOSURE_PROTOTYPE_IDS } from "./cp002-final-closure-types";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function fail(message: string): never {
  throw new Error(message);
}

function expectedQlId(index: number): string {
  return `INT-QL-${String(index + 22).padStart(3, "0")}`;
}

const expectedSourcePrototypes = new Set<string>([
  ...INT_CP002_WAVE01_PROTOTYPE_IDS,
  ...INT_CP002_WAVE02_PROTOTYPE_IDS,
  ...INT_CP002_FINAL_CLOSURE_PROTOTYPE_IDS,
]);

const observedSourcePrototypes = new Set<string>();
const observedRepresentations = new Set<string>();
const observedAnswerSemantics = new Set<string>();
const observedDifficulties = new Set<string>();
const answerPositions = [0, 0, 0, 0];
const fingerprintsByQl = new Map<IntCp002FinalQlId, Set<string>>();
const stemsByQl = new Map<IntCp002FinalQlId, Set<string>>();
let questionCount = 0;
let deterministicChecks = 0;
let structuralChecks = 0;
let lifecycleChecks = 0;
let optionOwnershipChecks = 0;
let exactSourceChecks = 0;
let maximumGenerationAttempts = 1;

if (INT_CP002_FINAL_QL_IDS.length !== 31) {
  fail(`Expected 31 proposed permanent QLs, found ${INT_CP002_FINAL_QL_IDS.length}.`);
}
if (INT_CP002_FINAL_REGISTRY.length !== INT_CP002_FINAL_QL_IDS.length) {
  fail("Registry and QL identity counts differ.");
}

for (const [index, qlId] of INT_CP002_FINAL_QL_IDS.entries()) {
  if (qlId !== expectedQlId(index)) fail(`Non-contiguous final QL identity at index ${index}: ${qlId}.`);
}
if (new Set(INT_CP002_FINAL_QL_IDS).size !== INT_CP002_FINAL_QL_IDS.length) {
  fail("Duplicate CP-002 final QL identity.");
}
if (new Set(INT_CP002_FINAL_REGISTRY.map((entry) => entry.solveContract)).size !== INT_CP002_FINAL_REGISTRY.length) {
  fail("Duplicate final solve contract.");
}
if (INT_CP002_FINAL_QL_IDS.some((qlId) => Number(qlId.slice(-3)) <= 21)) {
  fail("CP-002 final registry overlaps the CP-001 QL range.");
}

const sourceKindCounts = new Map<string, number>();
for (const registryEntry of INT_CP002_FINAL_REGISTRY) {
  sourceKindCounts.set(
    registryEntry.sourceAdapter.kind,
    (sourceKindCounts.get(registryEntry.sourceAdapter.kind) ?? 0) + 1,
  );
  if (registryEntry.active || registryEntry.questionStudioDiscoverable || registryEntry.publiclyPublishable) {
    fail(`${registryEntry.qlId}: candidate registry opened a delivery gate.`);
  }
  if (!expectedSourcePrototypes.has(registryEntry.sourceAdapter.prototypeId)) {
    fail(`${registryEntry.qlId}: unknown source prototype '${registryEntry.sourceAdapter.prototypeId}'.`);
  }
}
if (sourceKindCounts.get("WAVE01") !== 8) fail("Expected all eight Wave-1 source ancestries exactly once.");
if (sourceKindCounts.get("WAVE02") !== 13) fail("Expected all thirteen Wave-2 source ancestries exactly once.");
if (sourceKindCounts.get("CLOSURE") !== 10) fail("Expected all ten final-closure source ancestries exactly once.");

for (const qlId of INT_CP002_FINAL_QL_IDS) {
  const fingerprintSet = new Set<string>();
  const stemSet = new Set<string>();
  fingerprintsByQl.set(qlId, fingerprintSet);
  stemsByQl.set(qlId, stemSet);

  for (let seedIndex = 0; seedIndex < 80; seedIndex += 1) {
    const seed = `int-cp002-final:${qlId}:${seedIndex}`;
    const question = generateIntCp002FinalQuestion(qlId, seed);
    const replay = generateIntCp002FinalQuestion(qlId, seed);
    questionCount += 1;
    deterministicChecks += 1;
    if (stable(question) !== stable(replay)) fail(`${qlId}/${seed}: deterministic replay changed.`);

    structuralChecks += 8;
    if (!question.validation.ok) fail(`${qlId}/${seed}: ${question.validation.errors.join("; ")}`);
    if (question.packageId !== "INT-001" || question.canonicalProblemId !== "INT-CP-002") {
      fail(`${qlId}/${seed}: package or CP identity mismatch.`);
    }
    if (question.qlId !== qlId || question.permanentQlId !== qlId) {
      fail(`${qlId}/${seed}: permanent identity mismatch.`);
    }
    if (question.releaseCandidateId !== INT_CP002_RELEASE_CANDIDATE_ID) {
      fail(`${qlId}/${seed}: release candidate mismatch.`);
    }
    if (question.options.length !== 4 || new Set(question.options).size !== 4) {
      fail(`${qlId}/${seed}: options are not four unique values.`);
    }
    if (question.correctIndex < 0 || question.correctIndex > 3) {
      fail(`${qlId}/${seed}: invalid correct index.`);
    }
    if (question.optionAudit[question.correctIndex]?.misconceptionId !== "CORRECT") {
      fail(`${qlId}/${seed}: correct option ownership mismatch.`);
    }
    if (!question.explanation.conclusion.includes(question.options[question.correctIndex]!)) {
      fail(`${qlId}/${seed}: conclusion omits displayed answer.`);
    }
    if (question.explanation.workedSteps.length < 4) {
      fail(`${qlId}/${seed}: insufficient worked steps.`);
    }

    optionOwnershipChecks += 4;
    if (question.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1) {
      fail(`${qlId}/${seed}: correct-option ownership is not unique.`);
    }
    if (question.explanation.trapAnalysis.length !== 3) {
      fail(`${qlId}/${seed}: missing wrong-option analysis.`);
    }

    lifecycleChecks += 7;
    if (
      question.enabled
      || question.stagingStatus !== "NOT_STAGED"
      || question.registrationStatus !== "NOT_REGISTERED"
      || question.questionStudioDiscoverable
      || question.questionBankStatus !== "NOT_STORED"
      || question.testEligibility !== "INELIGIBLE"
      || question.publiclyPublishable
    ) {
      fail(`${qlId}/${seed}: review-only lifecycle boundary changed.`);
    }

    const learnerText = [
      question.stem,
      ...question.options,
      question.explanation.mainRule,
      ...question.explanation.workedSteps,
      question.explanation.examShortcut,
      question.explanation.verification,
      question.explanation.conclusion,
      ...question.explanation.trapAnalysis.map((item) => item.explanation),
    ].join(" ");
    if (/INT-CP|INT-QL|PROT-|WAVE0|CLOSE-|prototypeId|effectiveSeed|generationAttempts/iu.test(learnerText)) {
      fail(`${qlId}/${seed}: learner text leaks internal metadata.`);
    }

    exactSourceChecks += 1;
    observedSourcePrototypes.add(question.internalProvenance.sourcePrototypeId);
    const sourceState = question.internalProvenance.sourceState as { representation?: string; values?: { generationAttempts?: number } } | undefined;
    if (sourceState?.representation) observedRepresentations.add(sourceState.representation);
    const attempts = sourceState?.values?.generationAttempts;
    if (typeof attempts === "number") maximumGenerationAttempts = Math.max(maximumGenerationAttempts, attempts);

    observedAnswerSemantics.add(question.answerSemantic);
    observedDifficulties.add(question.difficulty);
    answerPositions[question.correctIndex] += 1;
    fingerprintSet.add(question.mathematicalFingerprint);
    stemSet.add(question.stem);
  }

  if (fingerprintSet.size < 20) fail(`${qlId}: insufficient mathematical diversity (${fingerprintSet.size}).`);
  if (stemSet.size < 20) fail(`${qlId}: insufficient stem diversity (${stemSet.size}).`);
}

for (const prototypeId of expectedSourcePrototypes) {
  if (!observedSourcePrototypes.has(prototypeId)) fail(`Source prototype not exercised: ${prototypeId}.`);
}
for (const position of [0, 1, 2, 3]) {
  if (answerPositions[position] === 0) fail(`Answer position ${position} was never reached.`);
}
for (const semantic of ["MONEY", "PRINCIPAL", "RATE_PERCENT", "TIME_YEARS", "DAYS", "RATIO"]) {
  if (!observedAnswerSemantics.has(semantic)) fail(`Answer semantic not covered: ${semantic}.`);
}
for (const difficulty of ["Easy", "Medium", "Hard"]) {
  if (!observedDifficulties.has(difficulty)) fail(`Difficulty not covered: ${difficulty}.`);
}
for (const rep of ["NARRATIVE", "TABLE", "TIMELINE", "COMPARISON_CARD"]) {
  if (!observedRepresentations.has(rep)) fail(`Closure representation not covered: ${rep}.`);
}

const disposition = {
  retainedPermanentAuthorities: 31,
  representationOnly: [
    "table of deposits",
    "rate timeline",
    "two-plan comparison card",
    "shared-data caselet shell",
  ],
  mergedAsParameters: [
    "year/month/day display within an already owned contract",
    "different-duration split principal",
    "interest saved versus extra interest wording",
    "which plan is greater versus by-how-much direction",
  ],
  reassigned: [
    "equal recurring instalments -> INT-CP-008",
    "heterogeneous dated cash flows/equated dates -> INT-CP-009",
    "commercial sale margin -> Profit & Loss",
    "capital-time profit sharing -> Partnership",
    "true discount/banker's discount -> separate commercial-discount authority",
  ],
  rejected: [
    "unstated 360/365 convention",
    "zero-length interval as learner contract",
    "repayment at horizon with no mathematical effect",
    "three-part split without source-backed unique inverse",
    "two repayments without an exam-supported distinct contract",
  ],
  openMeaningfulOwnedGaps: 0,
};

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp002-final-saturation");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  releaseCandidateId: INT_CP002_RELEASE_CANDIDATE_ID,
  qlRange: `${INT_CP002_FINAL_QL_IDS[0]}..${INT_CP002_FINAL_QL_IDS.at(-1)}`,
  qlCount: INT_CP002_FINAL_QL_IDS.length,
  sourceKindCounts: Object.fromEntries(sourceKindCounts),
  sourcePrototypeCount: observedSourcePrototypes.size,
  questionCount,
  deterministicChecks,
  structuralChecks,
  lifecycleChecks,
  optionOwnershipChecks,
  exactSourceChecks,
  answerPositions,
  answerSemantics: [...observedAnswerSemantics].sort(),
  difficulties: [...observedDifficulties].sort(),
  representations: [...observedRepresentations].sort(),
  maximumGenerationAttempts,
  disposition,
};
writeFileSync(join(outputDirectory, "int-cp002-final-saturation-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(
  join(outputDirectory, "int-cp002-final-registry.json"),
  `${JSON.stringify(INT_CP002_FINAL_REGISTRY, null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP002_FINAL_SATURATION_AND_QL_PROPOSAL");
