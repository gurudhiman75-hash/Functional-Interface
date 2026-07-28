import { INT_CP001_PROTOTYPE_REGISTRY } from "./foundation/cp001-registry";
import { assertGeneratorFoundation } from "./foundation/cp001-parameter-generator";
import { generateIntCp001Prototype } from "./foundation/cp001-pipeline";
import { INT_CP001_PROTOTYPE_IDS } from "./foundation/types";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function assertEqual(actual: unknown, expected: unknown, message = "Values are not equal"): void {
  if (actual !== expected) throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
}

function assertOk(value: unknown, message = "Assertion failed"): void {
  if (!value) throw new Error(message);
}

function assertDeepEqual(actual: unknown, expected: unknown, message = "Values are not deeply equal"): void {
  const left = stable(actual);
  const right = stable(expected);
  if (left !== right) throw new Error(`${message}: ${left} !== ${right}`);
}

assertGeneratorFoundation();
assertEqual(INT_CP001_PROTOTYPE_REGISTRY.length, INT_CP001_PROTOTYPE_IDS.length);
assertEqual(new Set(INT_CP001_PROTOTYPE_IDS).size, INT_CP001_PROTOTYPE_IDS.length);

let generated = 0;
const allDifficulties = new Set<string>();
const allSemantics = new Set<string>();
const summaries: Record<string, unknown> = {};

for (const prototypeId of INT_CP001_PROTOTYPE_IDS) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const fingerprints = new Set<string>();
  const mathematicalAnswers = new Set<string>();

  for (let index = 0; index < 120; index += 1) {
    const seed = `proof-${index}`;
    const first = generateIntCp001Prototype(prototypeId, seed);
    const second = generateIntCp001Prototype(prototypeId, seed);

    assertEqual(stable(first), stable(second), `${prototypeId}/${seed} is not deterministic`);
    assertEqual(first.validation.ok, true, `${prototypeId}/${seed}: ${first.validation.errors.join(" | ")}`);
    assertEqual(first.options.length, 4);
    assertEqual(new Set(first.options).size, 4);
    assertEqual(first.optionAudit[first.correctIndex]?.misconceptionId, "CORRECT");
    assertEqual(first.permanentQlId, null);
    assertEqual(first.reviewStatus, "UNREVIEWED");
    assertEqual(first.questionBankStatus, "NOT_STORED");
    assertEqual(first.testEligibility, "INELIGIBLE");
    assertEqual(first.publiclyPublishable, false);
    assertEqual(first.questionStudioDiscoverable, false);
    assertOk(first.stem.endsWith("?"));
    assertOk(first.explanation.verification.trim().length >= 12);
    assertOk(/\d|₹|%|=|matches|reproduces|confirm|exactly|equals/iu.test(first.explanation.verification));
    assertOk(first.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION"));
    assertOk(first.reasoningGraph.nodes.some((node) => node.kind === "NORMALISATION"));
    assertOk(first.difficultyEvidence.length > 0);

    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    explanations.add(stable(first.explanation));
    fingerprints.add(first.mathematicalFingerprint);
    mathematicalAnswers.add(`${first.solution.value.numerator}/${first.solution.value.denominator}`);
    allDifficulties.add(first.difficulty);
    allSemantics.add(first.answerSemantic);
    generated += 1;
  }

  assertDeepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${prototypeId} lacks answer-position coverage`);
  assertOk(stems.size >= 55, `${prototypeId} stem diversity is too low: ${stems.size}`);
  assertOk(explanations.size >= 45, `${prototypeId} explanation diversity is too low: ${explanations.size}`);
  assertOk(fingerprints.size >= 55, `${prototypeId} fingerprint diversity is too low: ${fingerprints.size}`);
  assertOk(mathematicalAnswers.size >= 8, `${prototypeId} answer diversity is too low: ${mathematicalAnswers.size}`);

  summaries[prototypeId] = {
    answerPositions: [...answerPositions].sort(),
    distinctStems: stems.size,
    distinctExplanations: explanations.size,
    distinctFingerprints: fingerprints.size,
    distinctAnswers: mathematicalAnswers.size,
  };
}

assertDeepEqual([...allDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assertDeepEqual(
  [...allSemantics].sort(),
  ["ANNUAL_INTEREST", "ANNUAL_RATE_PERCENT", "PRINCIPAL", "SIMPLE_INTEREST", "TIME_YEARS", "TOTAL_AMOUNT"],
);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  prototypeCount: INT_CP001_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  difficulties: [...allDifficulties].sort(),
  answerSemantics: [...allSemantics].sort(),
  summaries,
}, null, 2));
