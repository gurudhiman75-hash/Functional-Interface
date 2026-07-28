import {
  MAL_CP001_DISCOVERY_PROTOTYPE_IDS,
} from "./foundation/cp001-gap-registry";
import {
  generateMalCp001DiscoveryPrototype,
  stableMalCp001DiscoveryPrototype,
} from "./foundation/cp001-gap-pipeline";

function assertEqual(actual: unknown, expected: unknown, message = "Values are not equal"): void {
  if (actual !== expected) throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
}

function assertDeepEqual(actual: unknown, expected: unknown, message = "Values are not deeply equal"): void {
  const left = stableMalCp001DiscoveryPrototype(actual);
  const right = stableMalCp001DiscoveryPrototype(expected);
  if (left !== right) throw new Error(`${message}: ${left} !== ${right}`);
}

function assertOk(value: unknown, message = "Assertion failed"): asserts value {
  if (!value) throw new Error(message);
}

assertEqual(
  new Set(MAL_CP001_DISCOVERY_PROTOTYPE_IDS).size,
  MAL_CP001_DISCOVERY_PROTOTYPE_IDS.length,
  "Discovery prototype IDs must be unique",
);

let generated = 0;
const allDifficulties = new Set<string>();
const summaries: Record<string, unknown> = {};

for (const prototypeId of MAL_CP001_DISCOVERY_PROTOTYPE_IDS) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const contexts = new Set<string>();

  for (let index = 0; index < 120; index += 1) {
    const seed = `discovery-proof-${index}`;
    const first = generateMalCp001DiscoveryPrototype(prototypeId, seed);
    const second = generateMalCp001DiscoveryPrototype(prototypeId, seed);

    assertEqual(
      stableMalCp001DiscoveryPrototype(first),
      stableMalCp001DiscoveryPrototype(second),
      `${prototypeId}/${seed} is not deterministic`,
    );
    assertEqual(first.validation.ok, true, `${prototypeId}/${seed} failed validation`);
    assertEqual(first.options.length, 4);
    assertEqual(new Set(first.options).size, 4);
    assertEqual(first.optionAudit[first.correctIndex].misconceptionId, "CORRECT");
    assertEqual(first.permanentQlId, null);
    assertEqual(first.publiclyPublishable, false);
    assertEqual(first.questionStudioDiscoverable, false);
    assertEqual(first.language, "en");
    assertOk(first.stem.endsWith("?"), `${prototypeId}/${seed} stem is not interrogative`);
    assertOk(first.explanation.verification.length > 20);
    assertOk(
      first.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION"),
      `${prototypeId}/${seed} lacks a verification node`,
    );

    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    contexts.add(first.parameters.context.scenarioId);
    allDifficulties.add(first.difficulty);
    generated += 1;
  }

  assertDeepEqual(
    [...answerPositions].sort(),
    [0, 1, 2, 3],
    `${prototypeId} did not cover all answer positions`,
  );
  assertOk(stems.size >= 80, `${prototypeId} has insufficient stem diversity: ${stems.size}`);
  assertOk(
    fingerprints.size >= 80,
    `${prototypeId} has insufficient mathematical diversity: ${fingerprints.size}`,
  );
  assertEqual(contexts.size, 5, `${prototypeId} did not reach all five contexts`);

  summaries[prototypeId] = {
    answerPositions: [...answerPositions].sort(),
    distinctStems: stems.size,
    distinctFingerprints: fingerprints.size,
    contexts: [...contexts].sort(),
  };
}

assertDeepEqual([...allDifficulties].sort(), ["Easy", "Hard", "Medium"]);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  permanentQlCount: 0,
  prototypeCount: MAL_CP001_DISCOVERY_PROTOTYPE_IDS.length,
  difficulties: [...allDifficulties].sort(),
  summaries,
}, null, 2));
