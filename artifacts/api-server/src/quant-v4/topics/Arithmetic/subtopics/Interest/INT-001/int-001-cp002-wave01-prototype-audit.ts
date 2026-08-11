import { listQuantV4Packages } from "../../../../../generation-engine";
import {
  addRational,
  equalsRational,
  rational,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import {
  verifyIntCp002LedgerCandidate,
  verifyIntCp002LedgerDifferenceCandidate,
  verifyIntCp002SplitPrincipalCandidate,
  verifyIntCp002UnknownContributionCandidate,
} from "./cp002-foundation/verifier";
import { generateIntCp002Wave01Prototype } from "./cp002-wave01-runtime";
import {
  INT_CP002_WAVE01_PROTOTYPE_IDS,
  type IntCp002Wave01GeneratedPrototype,
  type IntCp002Wave01PrototypeId,
} from "./cp002-wave01-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function asRational(value: unknown, label: string): Rational {
  const candidate = value as Rational;
  assert(candidate && typeof candidate.numerator === "bigint" && typeof candidate.denominator === "bigint", `${label}: rational value missing`);
  return candidate;
}

function candidateVerifies(
  question: IntCp002Wave01GeneratedPrototype,
  candidate: Rational,
): boolean {
  const values = question.sourceState.values;
  switch (question.prototypeId) {
    case "INT-CP002-PROT-PIECEWISE-RATES":
    case "INT-CP002-PROT-MULTIPLE-DEPOSITS":
    case "INT-CP002-PROT-PARTIAL-REPAYMENT":
    case "INT-CP002-PROT-DAY-COUNT":
      return Boolean(question.sourceState.ledger)
        && verifyIntCp002LedgerCandidate(question.sourceState.ledger!, candidate).ok;
    case "INT-CP002-PROT-SPLIT-PRINCIPAL": {
      const totalPrincipal = asRational(values.totalPrincipal, "split total principal");
      return verifyIntCp002SplitPrincipalCandidate({
        totalPrincipal,
        firstPrincipal: candidate,
        secondPrincipal: subtractRational(totalPrincipal, candidate),
        firstAnnualRatePercent: asRational(values.firstRate, "split first rate"),
        firstDurationYears: asRational(values.firstTime, "split first time"),
        secondAnnualRatePercent: asRational(values.secondRate, "split second rate"),
        secondDurationYears: asRational(values.secondTime, "split second time"),
        expectedTotalInterest: asRational(values.totalInterest, "split total interest"),
      }).ok;
    }
    case "INT-CP002-PROT-EQUAL-INTEREST":
      return verifyIntCp002UnknownContributionCandidate({
        knownContributions: [],
        unknownContributionTemplate: {
          contributionId: "audit-second-investment",
          annualRatePercent: asRational(values.secondRate, "equal-interest second rate"),
          durationYears: asRational(values.secondTime, "equal-interest second time"),
          startsAtYears: rational(0),
          endsAtYears: asRational(values.secondTime, "equal-interest end time"),
          sourceKind: "INDEPENDENT_DEPOSIT",
        },
        candidatePrincipal: candidate,
        expectedTotalInterest: asRational(values.commonInterest, "equal-interest target"),
      }).ok;
    case "INT-CP002-PROT-COUNTERFACTUAL-CHANGE":
    case "INT-CP002-PROT-BORROW-LEND-SPREAD":
      return Boolean(question.sourceState.ledger && question.sourceState.comparisonLedger)
        && verifyIntCp002LedgerDifferenceCandidate({
          left: question.sourceState.ledger!,
          right: question.sourceState.comparisonLedger!,
          candidateDifference: candidate,
        }).ok;
  }
}

function learnerText(question: IntCp002Wave01GeneratedPrototype): string {
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

const registryBefore = stable(listQuantV4Packages());
assert(!listQuantV4Packages().some((item) => String(item.packageId) === "INT-001"), "INT-001 is centrally registered before Wave 1 audit");

const answerPositions = [0, 0, 0, 0];
const prototypeCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const stemsByPrototype = new Map<string, Set<string>>();
let generatedQuestions = 0;
let deterministicChecks = 0;
let structuralChecks = 0;
let independentOptionChecks = 0;
let tamperRejectionChecks = 0;
let explanationChecks = 0;
let learnerTextChecks = 0;
let lifecycleChecks = 0;
let recoveredSeeds = 0;
let maximumGenerationAttempts = 0;

for (const prototypeId of INT_CP002_WAVE01_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  stemsByPrototype.set(prototypeId, stems);
  for (let index = 1; index <= 100; index += 1) {
    const seed = `int-cp002-wave01-audit:${prototypeId}:${index}`;
    const question = generateIntCp002Wave01Prototype({ prototypeId, seed });
    const replay = generateIntCp002Wave01Prototype({ prototypeId, seed });
    assert(stable(question) === stable(replay), `${prototypeId}/${index}: deterministic replay drift`);
    deterministicChecks += 1;

    assert(question.prototypeId === prototypeId, `${prototypeId}/${index}: prototype identity drift`);
    assert(question.permanentQlId === null, `${prototypeId}/${index}: permanent QL allocated prematurely`);
    assert(question.frozenSolveContractId === null, `${prototypeId}/${index}: solve contract frozen prematurely`);
    assert(question.validation.ok, `${prototypeId}/${index}: runtime validation failed: ${question.validation.errors.join("; ")}`);
    assert(question.options.length === 4 && new Set(question.options).size === 4, `${prototypeId}/${index}: options are not four distinct values`);
    assert(question.optionAudit.length === 4, `${prototypeId}/${index}: option audit length mismatch`);
    assert(question.optionAudit.filter((item) => item.misconceptionId === "CORRECT").length === 1, `${prototypeId}/${index}: correct option ownership mismatch`);
    assert(question.optionAudit[question.correctIndex]?.misconceptionId === "CORRECT", `${prototypeId}/${index}: correct index mismatch`);
    assert(question.explanation.trapAnalysis.length === 3, `${prototypeId}/${index}: trap analysis does not cover all wrong options`);
    assert(new Set(question.explanation.trapAnalysis.map((item) => item.optionNumber)).size === 3, `${prototypeId}/${index}: duplicate trap option numbers`);
    structuralChecks += 8;

    let verifiedCount = 0;
    for (const option of question.optionAudit) {
      const verifies = candidateVerifies(question, option.value);
      if (verifies) verifiedCount += 1;
      if (option.misconceptionId === "CORRECT") {
        assert(verifies, `${prototypeId}/${index}: correct option failed independent verification`);
      } else {
        assert(!verifies, `${prototypeId}/${index}: wrong option ${option.misconceptionId} passed independent verification`);
        tamperRejectionChecks += 1;
      }
      independentOptionChecks += 1;
    }
    assert(verifiedCount === 1, `${prototypeId}/${index}: independent verifier accepted ${verifiedCount} options`);

    assert(question.explanation.workedSteps.length >= 4, `${prototypeId}/${index}: fewer than four worked steps`);
    assert(question.explanation.workedSteps.every((step) => /\d/u.test(step)), `${prototypeId}/${index}: worked step lacks actual numerical values`);
    assert(question.explanation.workedSteps.some((step) => step.includes("=")), `${prototypeId}/${index}: no visible calculation equality`);
    assert(/\d/u.test(question.explanation.verification), `${prototypeId}/${index}: verification lacks numerical evidence`);
    assert(question.explanation.conclusion.includes(question.options[question.correctIndex]!), `${prototypeId}/${index}: conclusion does not state the displayed answer`);
    explanationChecks += 5;

    const text = learnerText(question);
    assert(!/<sub>Trace:|INT-QL-|INT-CP002-PROT-|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(text), `${prototypeId}/${index}: internal metadata leaked into learner text`);
    assert(!/\[object Object\]/u.test(text), `${prototypeId}/${index}: malformed object leaked into learner text`);
    assert(text.length > 300, `${prototypeId}/${index}: learner explanation is unexpectedly thin`);
    learnerTextChecks += 3;

    assert(question.enabled === false, `${prototypeId}/${index}: runtime enabled prematurely`);
    assert(question.stagingStatus === "NOT_STAGED", `${prototypeId}/${index}: staging status changed`);
    assert(question.registrationStatus === "NOT_REGISTERED", `${prototypeId}/${index}: registration status changed`);
    assert(question.questionStudioDiscoverable === false, `${prototypeId}/${index}: Question Studio discoverability enabled`);
    assert(question.questionBankStatus === "NOT_STORED", `${prototypeId}/${index}: Question Bank storage enabled`);
    assert(question.testEligibility === "INELIGIBLE", `${prototypeId}/${index}: test eligibility enabled`);
    assert(question.publiclyPublishable === false, `${prototypeId}/${index}: publication enabled`);
    lifecycleChecks += 7;

    const attempts = Number(question.sourceState.values.generationAttempts);
    assert(Number.isInteger(attempts) && attempts >= 1 && attempts <= 32, `${prototypeId}/${index}: invalid generation attempt count`);
    if (attempts > 1) recoveredSeeds += 1;
    maximumGenerationAttempts = Math.max(maximumGenerationAttempts, attempts);

    answerPositions[question.correctIndex] += 1;
    prototypeCoverage.add(prototypeId);
    difficultyCoverage.add(question.difficulty);
    stems.add(question.stem);
    generatedQuestions += 1;
  }
}

for (const prototypeId of INT_CP002_WAVE01_PROTOTYPE_IDS) {
  const distinctStems = stemsByPrototype.get(prototypeId)?.size ?? 0;
  assert(distinctStems >= 30, `${prototypeId}: insufficient stem diversity (${distinctStems}/100)`);
}
assert(prototypeCoverage.size === INT_CP002_WAVE01_PROTOTYPE_IDS.length, "Wave 1 prototype coverage incomplete");
assert(difficultyCoverage.has("Easy") && difficultyCoverage.has("Medium") && difficultyCoverage.has("Hard"), "Wave 1 difficulty coverage incomplete");
assert(answerPositions.every((count) => count > 0), `Answer-position coverage incomplete: ${answerPositions.join(",")}`);
assert(maximumGenerationAttempts <= 32, "Generation attempt ceiling exceeded");

const registryAfter = stable(listQuantV4Packages());
assert(registryAfter === registryBefore, "Central Quant V4 registry changed during Wave 1 audit");
assert(!listQuantV4Packages().some((item) => String(item.packageId) === "INT-001"), "Wave 1 introduced INT-001 into the central registry");

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  auditId: "INT-CP-002-WAVE01-ARCHITECTURE-PROTOTYPES",
  provisionalPrototypeCount: INT_CP002_WAVE01_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  generatedQuestions,
  deterministicChecks,
  structuralChecks,
  independentOptionChecks,
  tamperRejectionChecks,
  explanationChecks,
  learnerTextChecks,
  lifecycleChecks,
  recoveredSeeds,
  maximumGenerationAttempts,
  answerPositions,
  prototypeCoverage: [...prototypeCoverage],
  difficultyCoverage: [...difficultyCoverage],
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
console.log("PASS_INT_CP002_WAVE01_ARCHITECTURE_PROTOTYPES");
