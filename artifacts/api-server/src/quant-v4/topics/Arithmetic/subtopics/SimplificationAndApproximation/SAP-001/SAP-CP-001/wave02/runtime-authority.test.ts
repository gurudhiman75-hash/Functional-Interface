import {
  generateSapCp001Wave02Package,
  generateSapCp001Wave02Sweep,
} from "./runtime";
import {
  SAP_CP001_WAVE02_PROTOTYPE_IDS,
  type SapDifficulty,
} from "./types";
import { equalRational } from "../../../shared/exact-rational";
import { evaluateIndependent } from "../../../shared/independent-evaluator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item.toString()}n` : item);
}

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateSapCp001Wave02Sweep(SEEDS_PER_PROTOTYPE);
assert(SAP_CP001_WAVE02_PROTOTYPE_IDS.length === 5, "Expected five Wave 02 prototypes.");
assert(packages.length === 500, "Expected 500 generated packages.");

const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<SapDifficulty>>();
const fingerprints = new Map<string, Set<string>>();
const answerSemantics = new Set<string>();
const taskDirections = new Set<string>();
const comparisonClasses = new Set<string>();
const incorrectSteps = new Set<number>();
const firstStepModes = new Set<number>();
const partialModes = new Set<number>();
let equivalentGroupingPackages = 0;
let firstValidStepPackages = 0;
let incorrectChainPackages = 0;
let partialPackages = 0;

for (const pkg of packages) {
  const replay = generateSapCp001Wave02Package(pkg.temporaryPrototypeId, pkg.seed);
  assert(stable(replay) === stable(pkg), `${pkg.temporaryPrototypeId} seed ${pkg.seed} is not deterministic.`);
  assert(pkg.packageId === "SAP-001", "Wrong package ID.");
  assert(pkg.checkpointId === "SAP-CP-001", "Wrong checkpoint ID.");
  assert(pkg.permanentQlId === null, "Permanent QL ID escaped discovery.");
  assert(pkg.locale === "en-IN", "Wrong locale.");
  assert(pkg.validation.ok, `${pkg.temporaryPrototypeId} seed ${pkg.seed}: ${pkg.validation.errors.join(" | ")}`);
  assert(pkg.canonicalAnswer === pkg.verifierAnswer, "Canonical/verifier mismatch.");
  assert(pkg.options.length === 4, "Four options required.");
  assert(new Set(pkg.options.map((option) => option.value)).size === 4, "Duplicate options.");
  assert(pkg.options.filter((option) => option.isCorrect).length === 1, "Exactly one correct option required.");
  assert(pkg.options[pkg.correctIndex]?.isCorrect, "correctIndex is not correct.");
  assert(pkg.options[pkg.correctIndex]?.value === pkg.canonicalAnswer, "Correct option does not match answer.");
  assert(pkg.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length > 0), "Wrong option missing diagnostic evidence.");
  assert(pkg.explanation.commonTraps.length === 3, "Expected three explanation traps.");
  assert(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer), "Final answer missing canonical answer.");
  assert(pkg.sourceAncestry.length >= 5, "Source ancestry incomplete.");
  assert(pkg.prototypeAncestry.includes(pkg.temporaryPrototypeId), "Prototype ancestry incomplete.");
  assert(pkg.lifecycle.permanentQlId === null, "Lifecycle permanent ID must remain null.");
  assert(pkg.lifecycle.maturity === "EXECUTABLE_DISCOVERY_PROOF", "Wrong maturity.");
  assert(pkg.lifecycle.reviewStatus === "UNREVIEWED_DISCOVERY_CANDIDATE", "Wrong review state.");
  assert(pkg.lifecycle.questionBankStatus === "NOT_STORED", "Wrong bank state.");
  assert(pkg.lifecycle.testEligibility === "INELIGIBLE", "Wrong test state.");
  assert(!pkg.lifecycle.active && !pkg.lifecycle.questionStudioDiscoverable && !pkg.lifecycle.questionBankWritable && !pkg.lifecycle.testEligible && !pkg.lifecycle.publiclyPublishable, "Lifecycle lock escaped.");

  const positions = answerPositions.get(pkg.temporaryPrototypeId) ?? new Set<number>();
  positions.add(pkg.correctIndex);
  answerPositions.set(pkg.temporaryPrototypeId, positions);
  const bands = difficulties.get(pkg.temporaryPrototypeId) ?? new Set<SapDifficulty>();
  bands.add(pkg.difficulty);
  difficulties.set(pkg.temporaryPrototypeId, bands);
  const states = fingerprints.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  states.add(pkg.mathematicalFingerprint);
  fingerprints.set(pkg.temporaryPrototypeId, states);
  answerSemantics.add(pkg.answerSemantic);
  taskDirections.add(pkg.taskDirection);

  switch (pkg.questionState.kind) {
    case "COMPARISON":
      comparisonClasses.add(pkg.canonicalAnswer);
      break;
    case "EQUIVALENT_GROUPING": {
      equivalentGroupingPackages += 1;
      const sourceValue = evaluateIndependent(pkg.questionState.sourceExpression);
      const matches = pkg.questionState.candidateExpressions.filter((candidate) => equalRational(evaluateIndependent(candidate), sourceValue));
      assert(matches.length === 1, "Equivalent grouping is not unique.");
      break;
    }
    case "FIRST_VALID_STEP": {
      firstValidStepPackages += 1;
      firstStepModes.add(Number(pkg.hiddenState.mode));
      const sourceValue = evaluateIndependent(pkg.questionState.sourceExpression);
      const matches = pkg.questionState.candidateAfterExpressions.filter((candidate) => equalRational(evaluateIndependent(candidate), sourceValue));
      assert(matches.length === 1, "First valid step is not unique.");
      break;
    }
    case "INCORRECT_CHAIN": {
      incorrectChainPackages += 1;
      incorrectSteps.add(Number(pkg.hiddenState.wrongStep));
      const sourceValue = evaluateIndependent(pkg.questionState.sourceExpression);
      const firstMismatch = pkg.questionState.chainExpressions.findIndex((step) => !equalRational(evaluateIndependent(step), sourceValue));
      assert(firstMismatch + 1 === Number(pkg.hiddenState.wrongStep), "Incorrect-chain first mismatch does not match hidden state.");
      break;
    }
    case "PARTIAL_EVALUATION":
      partialPackages += 1;
      partialModes.add(Number(pkg.hiddenState.mode));
      assert(equalRational(evaluateIndependent(pkg.questionState.sourceExpression), evaluateIndependent(pkg.questionState.substitutedExpression)), "Partial substitution changed the exact value.");
      break;
  }
}

for (const prototypeId of SAP_CP001_WAVE02_PROTOTYPE_IDS) {
  assert(stable([...answerPositions.get(prototypeId)!].sort()) === stable([0, 1, 2, 3]), `${prototypeId} did not reach every answer position.`);
  assert(stable([...difficulties.get(prototypeId)!].sort()) === stable(["EASY", "HARD", "MEDIUM"]), `${prototypeId} did not reach all difficulty bands.`);
  assert((fingerprints.get(prototypeId)?.size ?? 0) >= 12, `${prototypeId} collapsed below twelve mathematical fingerprints.`);
}

assert(stable([...comparisonClasses].sort()) === stable([
  "Left expression < Right expression",
  "Left expression = Right expression",
  "Left expression > Right expression",
]), "Comparison prototype did not cover <, = and >.");
assert(equivalentGroupingPackages === SEEDS_PER_PROTOTYPE, "Equivalent grouping package count mismatch.");
assert(firstValidStepPackages === SEEDS_PER_PROTOTYPE, "First valid step package count mismatch.");
assert(incorrectChainPackages === SEEDS_PER_PROTOTYPE, "Incorrect chain package count mismatch.");
assert(partialPackages === SEEDS_PER_PROTOTYPE, "Partial package count mismatch.");
assert(stable([...incorrectSteps].sort()) === stable([1, 2, 3, 4]), "Incorrect-step injection did not reach every transition.");
assert(stable([...firstStepModes].sort()) === stable([0, 1, 2, 3]), "First-step diagnostics did not cover all precedence families.");
assert(stable([...partialModes].sort()) === stable([0, 1, 2, 3]), "Partial evaluation did not cover all substitution families.");
assert(stable([...answerSemantics].sort()) === stable(["COMPARISON_CLASS", "EXACT_VALUE", "EXPRESSION_SELECTION", "STEP_SELECTION"]), "Answer-semantic coverage mismatch.");
assert(stable([...taskDirections].sort()) === stable(["COMPARISON", "DIAGNOSIS", "PARTIAL_EVALUATION", "SELECTION"]), "Task-direction coverage mismatch.");

let threw = false;
try { generateSapCp001Wave02Package(SAP_CP001_WAVE02_PROTOTYPE_IDS[0], 0); } catch { threw = true; }
assert(threw, "Seed zero should be rejected.");
threw = false;
try { generateSapCp001Wave02Sweep(0); } catch { threw = true; }
assert(threw, "Zero seeds per prototype should be rejected.");

console.log(JSON.stringify({
  status: "PASS_SAP_CP001_WAVE02_DIAGNOSTIC_AUTHORITY",
  temporaryPrototypeCount: SAP_CP001_WAVE02_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries([...fingerprints].map(([id, values]) => [id, values.size])),
  comparisonClasses: [...comparisonClasses].sort(),
  incorrectStepCoverage: [...incorrectSteps].sort(),
  firstStepModeCoverage: [...firstStepModes].sort(),
  partialModeCoverage: [...partialModes].sort(),
  answerSemantics: [...answerSemantics].sort(),
  taskDirections: [...taskDirections].sort(),
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));
