import { strict as assert } from "node:assert";
import type { PercentOfKnownNumberEvidence } from "./evidence";
import {
  buildPercentOfKnownNumberTrace,
  PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS,
} from "./trace-builder";

const evidence: PercentOfKnownNumberEvidence = {
  evidenceId: "PCT-001:PCT-QL-017:case-001:unit-value-evidence",
  evidenceVersion: "1.0.0",
  taskKind: "percentOfKnownNumber",
  methodFamily: "UNIT_VALUE",
  sourceValues: {
    knownUnitCount: 20,
    knownQuantity: 600,
    targetUnitCount: 25,
  },
  derivedValues: {
    singleUnitValue: 30,
    targetQuantity: 750,
  },
  exactValues: {
    singleUnitValue: {
      numerator: 600,
      denominator: 20,
    },
    targetQuantity: {
      numerator: 15_000,
      denominator: 20,
    },
  },
  units: {
    knownUnitCount: "percentage-point",
    knownQuantity: "abstract-number",
    targetUnitCount: "percentage-point",
    singleUnitValue: "abstract-number",
    targetQuantity: "abstract-number",
  },
  metadata: {
    exactness: "rational",
    roundingPolicy: "defer-to-presentation",
    countIntegrity: "not-required",
  },
};

const first = buildPercentOfKnownNumberTrace(evidence);
const second = buildPercentOfKnownNumberTrace(evidence);

assert.deepEqual(first, second, "Trace output must be deterministic.");
assert.equal(first.methodFamily, "UNIT_VALUE");
assert.equal(first.taskKind, "percentOfKnownNumber");
assert.deepEqual(
  first.ideas.map((idea) => idea.ideaKind),
  PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS,
  "Trace must contain the exact frozen idea sequence.",
);

const ideaIds = new Set(first.ideas.map((idea) => idea.ideaId));
const valueRefIds = new Set(first.valueRefs.map((ref) => ref.refId));
const unitRefIds = new Set(first.unitRefs.map((ref) => ref.refId));

for (const idea of first.ideas) {
  assert.deepEqual(
    idea.dependencies,
    first.dependencies[idea.ideaId],
    `${idea.ideaId}: dependency registry mismatch`,
  );
  for (const dependency of idea.dependencies) {
    assert.ok(ideaIds.has(dependency), `${idea.ideaId}: unknown dependency`);
  }
  for (const valueRef of idea.valueRefs) {
    assert.ok(valueRefIds.has(valueRef), `${idea.ideaId}: unknown value reference`);
  }
  for (const unitRef of idea.unitRefs) {
    assert.ok(unitRefIds.has(unitRef), `${idea.ideaId}: unknown unit reference`);
  }
}

const ideaIndex = new Map(
  first.ideas.map((idea, index) => [idea.ideaId, index] as const),
);
for (const idea of first.ideas) {
  for (const dependency of idea.dependencies) {
    assert.ok(
      ideaIndex.get(dependency)! < ideaIndex.get(idea.ideaId)!,
      `${idea.ideaId}: dependencies must be acyclic and precede dependants`,
    );
  }
}

const dependantCounts = new Map(first.ideas.map((idea) => [idea.ideaId, 0]));
for (const idea of first.ideas) {
  for (const dependency of idea.dependencies) {
    dependantCounts.set(dependency, dependantCounts.get(dependency)! + 1);
  }
}
for (const idea of first.ideas.slice(0, -1)) {
  assert.ok(
    dependantCounts.get(idea.ideaId)! > 0,
    `${idea.ideaId}: non-terminal idea must not be orphaned`,
  );
}

assert.deepEqual(
  Object.fromEntries(first.valueRefs.map((ref) => [ref.sourceKey, ref.value])),
  {
    rate1: 20,
    value1: 600,
    rate2: 25,
    singleUnitValue: 30,
    targetQuantity: 750,
  },
  "Trace values must be copied from evidence without recomputation.",
);

function assertNoProseOrRenderingFields(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) assertNoProseOrRenderingFields(item);
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    assert.ok(
      !/prose|narrative|text|sentence|equation|latex|math|template|render|visibility|language/i.test(
        key,
      ),
      `Forbidden trace field detected: ${key}`,
    );
    assertNoProseOrRenderingFields(child);
  }
}

assertNoProseOrRenderingFields(first);

console.log("ENG-003 Tutor Thinking Trace tests passed.");
