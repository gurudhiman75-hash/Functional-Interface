import { listQuantV4Packages } from "../../../../../generation-engine";
import { generateIntCp002Wave03aQuestion } from "./cp002-wave03a-runtime";
import {
  INT_CP002_WAVE03A_PROTOTYPE_IDS,
  type IntCp002Wave03aQuestion,
} from "./cp002-wave03a-types";
import { verifyIntCp002Wave03aCandidate } from "./cp002-wave03a-verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function learnerText(question: IntCp002Wave03aQuestion): string {
  return [
    question.stem,
    ...question.options,
    question.explanation.mainRule,
    ...question.explanation.workedSteps,
    question.explanation.examShortcut,
    question.explanation.verification,
    question.explanation.conclusion,
    ...question.explanation.trapAnalysis.map((item) => item.explanation),
  ].join("\n");
}

const GAP_COVERAGE: Record<string, string[]> = {
  "CP002-GAP-001": ["INT-CP002-W03A-PIECEWISE-MISSING-PRINCIPAL"],
  "CP002-GAP-002": ["INT-CP002-W03A-PIECEWISE-THREE-INTERVAL-DIRECT"],
  "CP002-GAP-003": ["INT-CP002-W03A-THREE-DEPOSIT-DIRECT", "INT-CP002-W03A-THREE-DEPOSIT-MISSING-PRINCIPAL"],
  "CP002-GAP-004": ["INT-CP002-W03A-SPLIT-PRINCIPAL-RATIO", "INT-CP002-W03A-EQUAL-INTEREST-SPLIT"],
  "CP002-GAP-005": ["INT-CP002-W03A-TIME-CHANGE-DIFFERENCE", "INT-CP002-W03A-ORIGINAL-DURATION"],
  "CP002-GAP-006": ["INT-CP002-W03A-TWO-REPAYMENTS-DIRECT"],
  "CP002-GAP-007": ["INT-CP002-W03A-BORROW-LEND-MISSING-PRINCIPAL", "INT-CP002-W03A-BORROW-LEND-MISSING-DURATION"],
  "CP002-GAP-008": ["INT-CP002-W03A-MONTH-BASED-LEDGER", "INT-CP002-W03A-FRACTIONAL-YEAR-LEDGER", "INT-CP002-W03A-MIXED-DAY-YEAR-LEDGER"],
};

const registryBeforePackages = listQuantV4Packages();
const registryBefore = stable(registryBeforePackages);
assert(!registryBeforePackages.some((item) => String(item.packageId) === "INT-001"), "INT-001 is centrally registered before Wave 3A audit");

const answerPositions = [0, 0, 0, 0];
const prototypeCoverage = new Set<string>();
const semanticCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const stemsByPrototype = new Map<string, Set<string>>();
let questions = 0;
let deterministicChecks = 0;
let structuralChecks = 0;
let independentOptionChecks = 0;
let wrongOptionRejections = 0;
let explanationChecks = 0;
let mathIntegrityChecks = 0;
let lifecycleChecks = 0;
let recoveredSeeds = 0;
let maximumGenerationAttempts = 0;

for (const prototypeId of INT_CP002_WAVE03A_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  stemsByPrototype.set(prototypeId, stems);
  for (let index = 1; index <= 100; index += 1) {
    const seed = `int-cp002-wave03a-audit:${prototypeId}:${index}`;
    const question = generateIntCp002Wave03aQuestion({ prototypeId, seed });
    const replay = generateIntCp002Wave03aQuestion({ prototypeId, seed });
    assert(stable(question) === stable(replay), `${prototypeId}/${index}: deterministic replay drift`);
    deterministicChecks += 1;

    assert(question.prototypeId === prototypeId, `${prototypeId}/${index}: prototype identity drift`);
    assert(question.permanentQlId === null, `${prototypeId}/${index}: permanent QL allocated prematurely`);
    assert(question.frozenSolveContractId === null, `${prototypeId}/${index}: solve contract frozen prematurely`);
    assert(question.validation.ok, `${prototypeId}/${index}: runtime validation failed: ${question.validation.errors.join("; ")}`);
    assert(question.options.length === 4 && new Set(question.options).size === 4, `${prototypeId}/${index}: options are not distinct`);
    assert(question.optionAudit.length === 4, `${prototypeId}/${index}: option audit mismatch`);
    assert(question.optionAudit.filter((item) => item.misconceptionId === "CORRECT").length === 1, `${prototypeId}/${index}: correct ownership mismatch`);
    assert(question.optionAudit[question.correctIndex]?.misconceptionId === "CORRECT", `${prototypeId}/${index}: correct index mismatch`);
    assert(question.explanation.trapAnalysis.length === 3, `${prototypeId}/${index}: trap analysis incomplete`);
    structuralChecks += 8;

    let accepted = 0;
    for (const option of question.optionAudit) {
      const verifies = verifyIntCp002Wave03aCandidate(question, option.value);
      if (verifies) accepted += 1;
      if (option.misconceptionId === "CORRECT") {
        assert(verifies, `${prototypeId}/${index}: correct option failed independent verification`);
      } else {
        assert(!verifies, `${prototypeId}/${index}: wrong option ${option.misconceptionId} passed independent verification`);
        wrongOptionRejections += 1;
      }
      independentOptionChecks += 1;
    }
    assert(accepted === 1, `${prototypeId}/${index}: independent verifier accepted ${accepted} options`);

    assert(question.explanation.workedSteps.length >= 4, `${prototypeId}/${index}: fewer than four worked steps`);
    assert(question.explanation.workedSteps.every((step) => /\d/u.test(step)), `${prototypeId}/${index}: step lacks numerical values`);
    assert(question.explanation.workedSteps.some((step) => step.includes("=")), `${prototypeId}/${index}: no visible equality`);
    assert(/\d/u.test(question.explanation.verification), `${prototypeId}/${index}: numerical verification missing`);
    assert(question.explanation.conclusion.includes(question.options[question.correctIndex]!), `${prototypeId}/${index}: conclusion omits answer`);
    explanationChecks += 5;

    const text = learnerText(question);
    assert(!/[\u0000-\u0008\u0009\u000B\u000C\u000E-\u001F]/u.test(text), `${prototypeId}/${index}: control character in learner text`);
    const mathText = (text.match(/\$\$[\s\S]*?\$\$|\$[^$]+\$/gu) ?? []).join("\n");
    assert(!/(^|[^\\])(?:frac\{|times\b|text\{|Delta\b|qquad\b|sum\b)/u.test(mathText), `${prototypeId}/${index}: bare TeX command`);
    assert(!/<sub>Trace:|INT-QL-|INT-CP002-W03A-|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(text), `${prototypeId}/${index}: internal metadata leaked`);
    assert(!/\[object Object\]/u.test(text), `${prototypeId}/${index}: malformed object leaked`);
    assert((text.match(/\$\$/gu) ?? []).length % 2 === 0, `${prototypeId}/${index}: unbalanced display math`);
    mathIntegrityChecks += 5;

    assert(question.enabled === false, `${prototypeId}/${index}: enabled prematurely`);
    assert(question.stagingStatus === "NOT_STAGED", `${prototypeId}/${index}: staging drift`);
    assert(question.registrationStatus === "NOT_REGISTERED", `${prototypeId}/${index}: registration drift`);
    assert(question.questionStudioDiscoverable === false, `${prototypeId}/${index}: discoverability drift`);
    assert(question.questionBankStatus === "NOT_STORED", `${prototypeId}/${index}: storage drift`);
    assert(question.testEligibility === "INELIGIBLE", `${prototypeId}/${index}: test eligibility drift`);
    assert(question.publiclyPublishable === false, `${prototypeId}/${index}: publication drift`);
    lifecycleChecks += 7;

    assert(question.generationAttempts >= 1 && question.generationAttempts <= 32, `${prototypeId}/${index}: attempt count out of range`);
    if (question.generationAttempts > 1) recoveredSeeds += 1;
    maximumGenerationAttempts = Math.max(maximumGenerationAttempts, question.generationAttempts);
    answerPositions[question.correctIndex] += 1;
    prototypeCoverage.add(prototypeId);
    semanticCoverage.add(question.answerSemantic);
    difficultyCoverage.add(question.difficulty);
    stems.add(question.stem);
    questions += 1;
  }
}

for (const prototypeId of INT_CP002_WAVE03A_PROTOTYPE_IDS) {
  const count = stemsByPrototype.get(prototypeId)?.size ?? 0;
  assert(count >= 20, `${prototypeId}: insufficient stem diversity (${count}/100)`);
}
assert(prototypeCoverage.size === INT_CP002_WAVE03A_PROTOTYPE_IDS.length, "Wave 3A prototype coverage incomplete");
assert(semanticCoverage.size === 4, `Wave 3A semantic coverage incomplete: ${[...semanticCoverage].join(",")}`);
assert(difficultyCoverage.has("Medium") && difficultyCoverage.has("Hard"), "Wave 3A difficulty coverage incomplete");
assert(answerPositions.every((count) => count > 0), `Wave 3A answer-position coverage incomplete: ${answerPositions.join(",")}`);
assert(maximumGenerationAttempts <= 32, "Wave 3A attempt ceiling exceeded");

const gapCoverage = Object.fromEntries(
  Object.entries(GAP_COVERAGE).map(([gapId, prototypeIds]) => {
    const covered = prototypeIds.every((prototypeId) => prototypeCoverage.has(prototypeId));
    assert(covered, `${gapId}: executable gap coverage incomplete`);
    return [gapId, prototypeIds.length];
  }),
);
assert(Object.keys(gapCoverage).length === 8, "Wave 3A did not close all eight executable gap records");

const registryAfterPackages = listQuantV4Packages();
const registryAfter = stable(registryAfterPackages);
assert(registryAfter === registryBefore, "Central Quant V4 registry changed during Wave 3A audit");
assert(!registryAfterPackages.some((item) => String(item.packageId) === "INT-001"), "Wave 3A introduced INT-001 into the central registry");

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  auditId: "INT-CP-002-WAVE03A-EDGE-RUNTIME",
  provisionalPrototypeCount: INT_CP002_WAVE03A_PROTOTYPE_IDS.length,
  executableGapRecordsClosed: Object.keys(gapCoverage).length,
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  questions,
  deterministicChecks,
  structuralChecks,
  independentOptionChecks,
  wrongOptionRejections,
  explanationChecks,
  mathIntegrityChecks,
  lifecycleChecks,
  recoveredSeeds,
  maximumGenerationAttempts,
  answerPositions,
  semanticCoverage: [...semanticCoverage],
  difficultyCoverage: [...difficultyCoverage],
  gapCoverage,
  distinctStemsByPrototype: Object.fromEntries(
    [...stemsByPrototype.entries()].map(([prototypeId, stems]) => [prototypeId, stems.size]),
  ),
  registryChecks: 3,
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP002_WAVE03A_EDGE_RUNTIME");
