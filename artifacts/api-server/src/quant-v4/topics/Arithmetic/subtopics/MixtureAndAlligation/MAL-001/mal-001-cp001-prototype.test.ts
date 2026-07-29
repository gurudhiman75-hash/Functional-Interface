import { MAL_CP001_PROTOTYPE_REGISTRY } from "./foundation/cp001-registry";
import { generateMalCp001Prototype } from "./foundation/pipeline";
import { MAL_CP001_PROTOTYPE_IDS } from "./foundation/types";

function assertEqual(actual: unknown, expected: unknown, message = "Values are not equal"): void {
  if (actual !== expected) throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
}

function assertDeepEqual(actual: unknown, expected: unknown, message = "Values are not deeply equal"): void {
  if (stable(actual) !== stable(expected)) throw new Error(`${message}: ${stable(actual)} !== ${stable(expected)}`);
}

function assertOk(value: unknown, message = "Assertion failed"): void {
  if (!value) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

assertEqual(MAL_CP001_PROTOTYPE_REGISTRY.length, MAL_CP001_PROTOTYPE_IDS.length);
assertEqual(new Set(MAL_CP001_PROTOTYPE_IDS).size, MAL_CP001_PROTOTYPE_IDS.length);

let generated = 0;
const allDifficulties = new Set<string>();
const summaries: Record<string, unknown> = {};

for (const prototypeId of MAL_CP001_PROTOTYPE_IDS) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  for (let index = 0; index < 120; index += 1) {
    const seed = `proof-${index}`;
    const first = generateMalCp001Prototype(prototypeId, seed);
    const second = generateMalCp001Prototype(prototypeId, seed);
    assertEqual(stable(first), stable(second), `${prototypeId}/${seed} is not deterministic`);
    assertEqual(first.validation.ok, true);
    assertEqual(first.options.length, 4);
    assertEqual(new Set(first.options).size, 4);
    assertEqual(first.optionAudit[first.correctIndex].misconceptionId, "CORRECT");
    assertEqual(first.permanentQlId, null);
    assertEqual(first.publiclyPublishable, false);
    assertEqual(first.questionStudioDiscoverable, false);
    assertOk(first.stem.endsWith("?"));
    assertOk(first.explanation.verification.length > 20);
    assertOk(first.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION"));
    if (prototypeId === "MAL-CP001-PROT-RATIO-FROM-TARGET" || prototypeId === "MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL") {
      assertEqual(first.diagram?.type, "ALLIGATION_CROSS");
    }
    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    allDifficulties.add(first.difficulty);
    generated += 1;
  }
  assertDeepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${prototypeId} did not cover all answer positions`);
  assertOk(stems.size >= 80, `${prototypeId} has insufficient stem diversity: ${stems.size}`);
  assertOk(fingerprints.size >= 80, `${prototypeId} has insufficient mathematical diversity: ${fingerprints.size}`);
  summaries[prototypeId] = {
    answerPositions: [...answerPositions].sort(),
    distinctStems: stems.size,
    distinctFingerprints: fingerprints.size,
  };
}

assertDeepEqual([...allDifficulties].sort(), ["Easy", "Hard", "Medium"]);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  permanentQlCount: 0,
  prototypeCount: MAL_CP001_PROTOTYPE_IDS.length,
  difficulties: [...allDifficulties].sort(),
  summaries,
}, null, 2));
