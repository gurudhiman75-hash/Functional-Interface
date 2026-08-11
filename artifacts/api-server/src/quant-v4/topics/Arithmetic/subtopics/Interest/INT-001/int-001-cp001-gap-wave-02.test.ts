import { isWholeRational } from "./foundation/rational";
import {
  assertIntCp001Wave2GeneratorFoundation,
  generateIntCp001Wave2Prototype,
  INT_CP001_WAVE2_PROTOTYPE_IDS,
  INT_CP001_WAVE2_REGISTRY,
} from "./gap-wave-02";

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

function isMoneySemantic(value: string): boolean {
  return value === "TOTAL_AMOUNT" || value === "PRINCIPAL" || value === "ANNUAL_INTEREST";
}

assertIntCp001Wave2GeneratorFoundation();
assertEqual(INT_CP001_WAVE2_REGISTRY.length, INT_CP001_WAVE2_PROTOTYPE_IDS.length);
assertEqual(new Set(INT_CP001_WAVE2_PROTOTYPE_IDS).size, INT_CP001_WAVE2_PROTOTYPE_IDS.length);

let generated = 0;
const difficulties = new Set<string>();
const semantics = new Set<string>();
const summaries: Record<string, unknown> = {};

for (const prototypeId of INT_CP001_WAVE2_PROTOTYPE_IDS) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const answers = new Set<string>();
  const contexts = new Set<string>();
  const misconceptionLabels = new Set<string>();

  for (let index = 0; index < 120; index += 1) {
    const seed = `wave2-proof-${index}`;
    const first = generateIntCp001Wave2Prototype(prototypeId, seed);
    const second = generateIntCp001Wave2Prototype(prototypeId, seed);

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
    assertOk(first.explanation.steps.length >= 3);
    assertOk(first.explanation.verification.length >= 25);
    assertOk(first.reasoningGraph.nodes.some((node) => node.kind === "NORMALISATION"));
    assertOk(first.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION"));
    assertOk(first.difficultyEvidence.length > 0);

    if (isMoneySemantic(first.solution.semantic)) {
      assertOk(isWholeRational(first.solution.value), `${prototypeId}/${seed} has fractional money answer`);
      for (const option of first.optionAudit) {
        assertOk(isWholeRational(option.result.value), `${prototypeId}/${seed} has fractional money option`);
      }
    }

    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    answers.add(`${first.solution.value.numerator}/${first.solution.value.denominator}`);
    contexts.add(first.parameters.context.scenarioId);
    for (const option of first.optionAudit) misconceptionLabels.add(option.misconceptionId);
    difficulties.add(first.difficulty);
    semantics.add(first.answerSemantic);
    generated += 1;
  }

  assertDeepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${prototypeId} lacks answer-position coverage`);
  assertOk(stems.size >= 55, `${prototypeId} stem diversity is too low: ${stems.size}`);
  assertOk(fingerprints.size >= 55, `${prototypeId} mathematical diversity is too low: ${fingerprints.size}`);
  assertOk(answers.size >= 8, `${prototypeId} answer diversity is too low: ${answers.size}`);
  assertOk(contexts.size >= 6, `${prototypeId} context coverage is too low: ${contexts.size}`);
  assertOk(misconceptionLabels.size >= 4, `${prototypeId} misconception coverage is too low: ${misconceptionLabels.size}`);

  summaries[prototypeId] = {
    answerPositions: [...answerPositions].sort(),
    distinctStems: stems.size,
    distinctFingerprints: fingerprints.size,
    distinctAnswers: answers.size,
    contexts: [...contexts].sort(),
    misconceptionLabels: [...misconceptionLabels].sort(),
  };
}

assertDeepEqual([...difficulties].sort(), ["Hard", "Medium"]);
assertDeepEqual(
  [...semantics].sort(),
  [
    "AMOUNT_MULTIPLE",
    "ANNUAL_INTEREST",
    "ANNUAL_RATE_PERCENT",
    "INTEREST_TO_PRINCIPAL_RATIO",
    "PRINCIPAL",
    "TIME_MONTHS",
    "TOTAL_AMOUNT",
  ],
);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  discoveryWaveId: "INT-CP001-GAP-WAVE-02",
  prototypeCount: INT_CP001_WAVE2_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  difficulties: [...difficulties].sort(),
  answerSemantics: [...semantics].sort(),
  summaries,
}, null, 2));
