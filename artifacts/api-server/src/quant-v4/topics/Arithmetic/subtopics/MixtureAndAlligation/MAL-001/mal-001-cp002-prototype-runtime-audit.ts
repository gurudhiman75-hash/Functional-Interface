import { MAL_CP002_CONTEXT_LIBRARY } from "./foundation/cp002-context-library";
import { MAL_CP002_DISCOVERY_REGISTRY } from "./foundation/cp002-discovery-registry";
import { generateMalCp002DiscoveryPrototype } from "./foundation/cp002-prototype-runtime";
import type { MalCp002ExecutablePrototypeId } from "./foundation/cp002-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

const executablePrototypeIds = MAL_CP002_DISCOVERY_REGISTRY.filter(
  (entry) => entry.discoveryStatus === "EXECUTABLE_DISCOVERY",
).map((entry) => entry.prototypeId as MalCp002ExecutablePrototypeId);

const seedsPerPrototype = 100;
let generatedCount = 0;
let deterministicCount = 0;
let solverValidatedCount = 0;
let optionValidatedCount = 0;
let formulaFirstExplanationCount = 0;
let diagramValidatedCount = 0;
const stems = new Set<string>();
const mathematicalFingerprints = new Set<string>();
const contextCounts = new Map<string, number>();
const domainCounts = new Map<string, number>();
const correctIndexCounts = [0, 0, 0, 0];
const misconceptionCounts = new Map<string, number>();
const diagramStageCounts = new Map<string, number>();

for (const prototypeId of executablePrototypeIds) {
  const prototypeStems = new Set<string>();
  const prototypeFingerprints = new Set<string>();

  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const seed = `cp002-prototype-${prototypeId}-${index}`;
    const first = generateMalCp002DiscoveryPrototype(prototypeId, seed);
    const second = generateMalCp002DiscoveryPrototype(prototypeId, seed);

    assert(
      stable(first) === stable(second),
      `${prototypeId}/${seed}: full learner prototype is not deterministic.`,
    );
    deterministicCount += 1;
    generatedCount += 1;

    assert(
      first.validation.ok,
      `${prototypeId}/${seed}: prototype validation failed: ${first.validation.errors.join("; ")}`,
    );
    assert(
      first.validation.errors.length === 0,
      `${prototypeId}/${seed}: validated prototype still contains errors.`,
    );
    solverValidatedCount += 1;

    assert(first.options.length === 4, `${prototypeId}/${seed}: expected four options.`);
    assert(
      new Set(first.options).size === 4,
      `${prototypeId}/${seed}: visible options are not unique.`,
    );
    assert(
      new Set(first.optionAudit.map((item) => item.canonicalKey)).size === 4,
      `${prototypeId}/${seed}: canonical options are not unique.`,
    );
    assert(
      first.optionAudit.filter((item) => item.isCorrect).length === 1,
      `${prototypeId}/${seed}: option audit does not have exactly one correct answer.`,
    );
    assert(
      first.answer === first.options[first.correctIndex],
      `${prototypeId}/${seed}: answer and correct option differ.`,
    );
    assert(
      first.correctIndex >= 0 && first.correctIndex < 4,
      `${prototypeId}/${seed}: invalid correct option index.`,
    );
    correctIndexCounts[first.correctIndex]! += 1;
    for (const option of first.optionAudit) {
      misconceptionCounts.set(
        option.misconceptionId,
        (misconceptionCounts.get(option.misconceptionId) ?? 0) + 1,
      );
    }
    optionValidatedCount += 1;

    const normalMethodText = [
      first.explanation.coreConcept,
      first.explanation.formula,
      ...first.explanation.steps,
      first.explanation.verification,
      first.explanation.conclusion,
    ].join("\n");
    assert(
      !/alligation/iu.test(normalMethodText),
      `${prototypeId}/${seed}: formula-first method contains alligation.`,
    );
    assert(
      first.explanation.layoutId ===
        "MAL-CP002-EN-FORMULA-FIRST-DISCOVERY-V1",
      `${prototypeId}/${seed}: wrong explanation authority.`,
    );
    assert(
      first.explanation.steps.length >= 4,
      `${prototypeId}/${seed}: incomplete step-by-step solution.`,
    );
    assert(
      first.explanation.examShortcut.length >= 60,
      `${prototypeId}/${seed}: exam shortcut is too shallow.`,
    );
    assert(
      first.explanation.commonTrap.length >= 50,
      `${prototypeId}/${seed}: trap warning is too shallow.`,
    );
    assert(
      first.explanation.conclusion.includes(first.answer),
      `${prototypeId}/${seed}: conclusion does not state the canonical answer.`,
    );
    formulaFirstExplanationCount += 1;

    assert(
      first.diagram.type === "RATIO_ADJUSTMENT",
      `${prototypeId}/${seed}: wrong diagram type.`,
    );
    assert(
      first.diagram.componentALabel === first.context.componentALabel &&
        first.diagram.componentBLabel === first.context.componentBLabel,
      `${prototypeId}/${seed}: diagram/context label mismatch.`,
    );
    if (
      prototypeId ===
      "MAL-CP002-PROT-SINGLE-REMOVE-REFILL-FOR-TARGET-RATIO"
    ) {
      assert(
        first.diagram.operation.stage === "HOMOGENEOUS_REMOVE_REFILL",
        `${prototypeId}/${seed}: replacement diagram hides homogeneous removal.`,
      );
      assert(
        /well-mixed contents/iu.test(first.stem),
        `${prototypeId}/${seed}: replacement stem does not state homogeneous removal.`,
      );
    } else if (
      prototypeId === "MAL-CP002-PROT-COMPONENTS-FROM-TOTAL-AND-RATIO"
    ) {
      assert(
        first.diagram.operation.stage === "PARTITION",
        `${prototypeId}/${seed}: partition diagram stage is missing.`,
      );
    } else {
      assert(
        first.diagram.operation.stage === "PURE_COMPONENT_CHANGE",
        `${prototypeId}/${seed}: pure-component change diagram stage is missing.`,
      );
    }
    diagramStageCounts.set(
      first.diagram.operation.stage,
      (diagramStageCounts.get(first.diagram.operation.stage) ?? 0) + 1,
    );
    diagramValidatedCount += 1;

    assert(first.permanentQlId === null, `${prototypeId}/${seed}: permanent QL leaked in.`);
    assert(first.active === false, `${prototypeId}/${seed}: prototype became active.`);
    assert(
      first.publiclyPublishable === false,
      `${prototypeId}/${seed}: prototype became publishable.`,
    );
    assert(
      first.questionStudioDiscoverable === false,
      `${prototypeId}/${seed}: prototype leaked into Question Studio.`,
    );
    assert(
      first.questionBankWritable === false,
      `${prototypeId}/${seed}: prototype became Question Bank writable.`,
    );
    assert(
      first.testEligible === false,
      `${prototypeId}/${seed}: prototype became test eligible.`,
    );

    stems.add(first.stem);
    prototypeStems.add(first.stem);
    mathematicalFingerprints.add(first.mathematicalFingerprint);
    prototypeFingerprints.add(first.mathematicalFingerprint);
    contextCounts.set(
      first.context.contextId,
      (contextCounts.get(first.context.contextId) ?? 0) + 1,
    );
    domainCounts.set(
      first.context.domain,
      (domainCounts.get(first.context.domain) ?? 0) + 1,
    );
  }

  assert(
    prototypeStems.size >= 95,
    `${prototypeId}: only ${prototypeStems.size}/${seedsPerPrototype} distinct stems.`,
  );
  assert(
    prototypeFingerprints.size >= 95,
    `${prototypeId}: only ${prototypeFingerprints.size}/${seedsPerPrototype} mathematical fingerprints.`,
  );
}

assert(
  stems.size >= generatedCount * 0.96,
  `Only ${stems.size}/${generatedCount} chapter-wide distinct stems.`,
);
assert(
  mathematicalFingerprints.size >= generatedCount * 0.96,
  `Only ${mathematicalFingerprints.size}/${generatedCount} distinct mathematical fingerprints.`,
);
assert(
  correctIndexCounts.every((count) => count >= generatedCount * 0.18),
  `Correct option positions are unbalanced: ${correctIndexCounts.join(", ")}.`,
);
assert(
  misconceptionCounts.size >= 10,
  `Only ${misconceptionCounts.size} misconception strategies were exercised.`,
);
assert(
  contextCounts.size === MAL_CP002_CONTEXT_LIBRARY.length,
  `Only ${contextCounts.size}/${MAL_CP002_CONTEXT_LIBRARY.length} contexts were exercised.`,
);
const milkWaterCount = domainCounts.get("MILK_WATER") ?? 0;
const milkWaterPercent = (milkWaterCount / generatedCount) * 100;
assert(
  milkWaterPercent <= 22,
  `Milk-water context share is ${milkWaterPercent.toFixed(2)}%, above 22%.`,
);

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP002_INACTIVE_LEARNER_PROTOTYPES",
      canonicalProblemId: "MAL-CP-002",
      permanentQlCount: 0,
      frozenSolveModeCount: 0,
      executablePrototypeCount: executablePrototypeIds.length,
      seedsPerPrototype,
      generatedCount,
      deterministicCount,
      solverValidatedCount,
      optionValidatedCount,
      formulaFirstExplanationCount,
      diagramValidatedCount,
      distinctStemCount: stems.size,
      distinctMathematicalFingerprintCount: mathematicalFingerprints.size,
      correctIndexCounts,
      misconceptionStrategyCount: misconceptionCounts.size,
      misconceptionCounts: Object.fromEntries(
        [...misconceptionCounts.entries()].sort(),
      ),
      contextCount: contextCounts.size,
      contextCounts: Object.fromEntries([...contextCounts.entries()].sort()),
      domainCounts: Object.fromEntries([...domainCounts.entries()].sort()),
      milkWaterCount,
      milkWaterPercent: Number(milkWaterPercent.toFixed(2)),
      diagramStageCounts: Object.fromEntries(
        [...diagramStageCounts.entries()].sort(),
      ),
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      discoveryCountsFrozen: false,
    },
    null,
    2,
  ),
);
