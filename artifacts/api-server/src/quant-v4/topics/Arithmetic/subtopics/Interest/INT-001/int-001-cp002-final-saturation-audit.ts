import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP002_FINAL_QL_IDS,
  INT_CP002_FINAL_REGISTRY,
  INT_CP002_RELEASE_CANDIDATE_ID,
  type IntCp002FinalQlId,
  type IntCp002FinalSourceKind,
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
const registryByQl = new Map(INT_CP002_FINAL_REGISTRY.map((entry) => [entry.qlId, entry]));
const sourceKindCounts = new Map<IntCp002FinalSourceKind, number>();
const observedSourcePrototypes = new Set<string>();
const observedRepresentations = new Set<string>();
const observedAnswerSemantics = new Set<string>();
const observedDifficulties = new Set<string>();
const answerPositions = [0, 0, 0, 0];
const diversityByQl: Record<string, { fingerprints: number; stems: number; sourceKind: IntCp002FinalSourceKind }> = {};
let questionCount = 0;
let deterministicChecks = 0;
let structuralChecks = 0;
let lifecycleChecks = 0;
let optionOwnershipChecks = 0;
let exactSourceChecks = 0;

if (INT_CP002_FINAL_QL_IDS.length !== 31 || INT_CP002_FINAL_REGISTRY.length !== 31) {
  fail("CP-002 final candidate must contain exactly 31 registry entries.");
}
for (const [index, qlId] of INT_CP002_FINAL_QL_IDS.entries()) {
  if (qlId !== expectedQlId(index)) fail(`Non-contiguous final QL identity: ${qlId}.`);
}
if (new Set(INT_CP002_FINAL_QL_IDS).size !== 31) fail("Duplicate final QL identity.");
if (new Set(INT_CP002_FINAL_REGISTRY.map((entry) => entry.solveContract)).size !== 31) {
  fail("Duplicate final solve contract.");
}

for (const entry of INT_CP002_FINAL_REGISTRY) {
  sourceKindCounts.set(entry.sourceAdapter.kind, (sourceKindCounts.get(entry.sourceAdapter.kind) ?? 0) + 1);
  if (!expectedSourcePrototypes.has(entry.sourceAdapter.prototypeId)) {
    fail(`${entry.qlId}: unknown source prototype '${entry.sourceAdapter.prototypeId}'.`);
  }
  if (entry.active || entry.questionStudioDiscoverable || entry.publiclyPublishable) {
    fail(`${entry.qlId}: candidate registry opened a delivery gate.`);
  }
}
if (sourceKindCounts.get("WAVE01") !== 8) fail("Expected eight Wave-1 source authorities.");
if (sourceKindCounts.get("WAVE02") !== 13) fail("Expected thirteen Wave-2 source authorities.");
if (sourceKindCounts.get("CLOSURE") !== 10) fail("Expected ten closure source authorities.");

for (const qlId of INT_CP002_FINAL_QL_IDS) {
  const registryEntry = registryByQl.get(qlId);
  if (!registryEntry) fail(`${qlId}: missing registry entry.`);
  const fingerprints = new Set<string>();
  const stems = new Set<string>();

  for (let seedIndex = 0; seedIndex < 80; seedIndex += 1) {
    const seed = `int-cp002-final:${qlId}:${seedIndex}`;
    const question = generateIntCp002FinalQuestion(qlId, seed);
    const replay = generateIntCp002FinalQuestion(qlId, seed);
    questionCount += 1;
    deterministicChecks += 1;
    if (stable(question) !== stable(replay)) fail(`${qlId}/${seed}: deterministic replay changed.`);

    structuralChecks += 10;
    if (!question.validation.ok) fail(`${qlId}/${seed}: ${question.validation.errors.join("; ")}`);
    if (question.packageId !== "INT-001" || question.canonicalProblemId !== "INT-CP-002") {
      fail(`${qlId}/${seed}: package identity mismatch.`);
    }
    if (question.qlId !== qlId || question.permanentQlId !== qlId) fail(`${qlId}/${seed}: QL identity mismatch.`);
    if (question.releaseCandidateId !== INT_CP002_RELEASE_CANDIDATE_ID) fail(`${qlId}/${seed}: release mismatch.`);
    if (question.solveContract !== registryEntry.solveContract) fail(`${qlId}/${seed}: solve contract mismatch.`);
    if (question.answerSemantic !== registryEntry.answerSemantic) fail(`${qlId}/${seed}: answer semantic mismatch.`);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) fail(`${qlId}/${seed}: invalid options.`);
    if (question.correctIndex < 0 || question.correctIndex > 3) fail(`${qlId}/${seed}: invalid correct index.`);
    if (question.optionAudit[question.correctIndex]?.misconceptionId !== "CORRECT") {
      fail(`${qlId}/${seed}: correct-option ownership mismatch.`);
    }
    if (!question.explanation.conclusion.includes(question.options[question.correctIndex]!)) {
      fail(`${qlId}/${seed}: conclusion omits the displayed answer.`);
    }
    if (question.explanation.workedSteps.length < 4) fail(`${qlId}/${seed}: fewer than four worked steps.`);

    optionOwnershipChecks += 4;
    if (question.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1) {
      fail(`${qlId}/${seed}: correct ownership is not unique.`);
    }
    if (question.explanation.trapAnalysis.length !== 3) fail(`${qlId}/${seed}: trap analysis is incomplete.`);
    for (const trap of question.explanation.trapAnalysis) {
      const option = question.optionAudit[trap.optionNumber - 1];
      if (!option || option.misconceptionId !== trap.misconceptionId || option.explanation !== trap.explanation) {
        fail(`${qlId}/${seed}: trap analysis is misaligned at option ${trap.optionNumber}.`);
      }
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
    const sourceState = question.internalProvenance.sourceState as { representation?: string } | undefined;
    if (sourceState?.representation) observedRepresentations.add(sourceState.representation);
    observedAnswerSemantics.add(question.answerSemantic);
    observedDifficulties.add(question.difficulty);
    answerPositions[question.correctIndex] += 1;
    fingerprints.add(question.mathematicalFingerprint);
    stems.add(question.stem);
  }

  const minimumMathStates = registryEntry.sourceAdapter.kind === "CLOSURE" ? 2 : 3;
  if (fingerprints.size < minimumMathStates) {
    fail(`${qlId}: source-math preservation failed (${fingerprints.size}/${minimumMathStates}).`);
  }
  if (stems.size < 20) fail(`${qlId}: presentation diversity failed (${stems.size}/20).`);
  diversityByQl[qlId] = {
    fingerprints: fingerprints.size,
    stems: stems.size,
    sourceKind: registryEntry.sourceAdapter.kind,
  };
}

for (const prototypeId of expectedSourcePrototypes) {
  if (!observedSourcePrototypes.has(prototypeId)) fail(`Source prototype not exercised: ${prototypeId}.`);
}
if (answerPositions.some((count) => count === 0)) fail("Not all answer positions were reached.");
for (const semantic of ["MONEY", "PRINCIPAL", "RATE_PERCENT", "TIME_YEARS", "DAYS", "RATIO"]) {
  if (!observedAnswerSemantics.has(semantic)) fail(`Missing answer semantic: ${semantic}.`);
}
for (const difficulty of ["Easy", "Medium", "Hard"]) {
  if (!observedDifficulties.has(difficulty)) fail(`Missing difficulty: ${difficulty}.`);
}
for (const representation of ["NARRATIVE", "TABLE", "TIMELINE", "COMPARISON_CARD"]) {
  if (!observedRepresentations.has(representation)) fail(`Missing closure representation: ${representation}.`);
}

const disposition = {
  retainedPermanentAuthorities: 31,
  representationOnly: ["table", "timeline", "comparison card", "shared-data shell"],
  mergedAsParameters: [
    "year/month/day display within one solve contract",
    "different-duration split principal",
    "extra-interest versus interest-saved wording",
    "greater-plan versus difference direction",
  ],
  reassigned: [
    "equal recurring instalments -> INT-CP-008",
    "heterogeneous dated cash flows/equated dates -> INT-CP-009",
    "commercial sale margin -> Profit & Loss",
    "capital-time profit sharing -> Partnership",
    "true discount/banker's discount -> commercial-discount authority",
  ],
  rejected: [
    "unstated 360/365 convention",
    "zero-length interval",
    "repayment at horizon with no effect",
    "unsupported three-part unique inverse",
    "unsupported two-repayment contract",
  ],
  openMeaningfulOwnedGaps: 0,
};

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp002-final-saturation");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  releaseCandidateId: INT_CP002_RELEASE_CANDIDATE_ID,
  qlRange: `${INT_CP002_FINAL_QL_IDS[0]}..${INT_CP002_FINAL_QL_IDS.at(-1)}`,
  qlCount: 31,
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
  diversityPolicy: {
    inheritedSourceMathMinimum: 3,
    newClosureMathMinimum: 2,
    presentationStemMinimum: 20,
    inheritedSourceNote: "Wave-1 and Wave-2 mathematics retain their separate exact source audits; this audit proves final-adapter preservation.",
    closureEdgeNote: "Every new closure authority must reach at least two exact states, all four answer positions chapter-wide and at least twenty distinct stems; observed counts are recorded per QL.",
  },
  diversityByQl,
  disposition,
};
writeFileSync(join(outputDirectory, "int-cp002-final-saturation-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(join(outputDirectory, "int-cp002-final-registry.json"), `${JSON.stringify(INT_CP002_FINAL_REGISTRY, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP002_FINAL_SATURATION_AND_QL_PROPOSAL");
