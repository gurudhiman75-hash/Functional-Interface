import { strict as assert } from "node:assert";
import type {
  EEV2DetailMode,
  ExplanationPlan,
  ExplanationRole,
} from "../../../../../../../common/eev2/contracts";
import type { PercentOfKnownNumberEvidence } from "./evidence";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import {
  PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS,
  planPercentOfKnownNumberExplanation,
} from "./planner";
import { buildPercentOfKnownNumberTrace } from "./trace-builder";

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
    singleUnitValue: { numerator: 600, denominator: 20 },
    targetQuantity: { numerator: 15_000, denominator: 20 },
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

const graph = buildPercentOfKnownNumberGraph(
  buildPercentOfKnownNumberTrace(evidence),
);
const graphBeforePlanning = JSON.stringify(graph);

const modes: readonly EEV2DetailMode[] = ["short", "standard", "detailed"];
const plans = new Map<EEV2DetailMode, ExplanationPlan>();

for (const mode of modes) {
  const first = planPercentOfKnownNumberExplanation(graph, mode);
  const second = planPercentOfKnownNumberExplanation(graph, mode);
  assert.deepEqual(first, second, `${mode}: plan must be deterministic`);
  assert.equal(first.detailMode, mode);
  assert.equal(first.methodFamily, "UNIT_VALUE");
  assert.deepEqual(
    first.roles.map((role) => role.roleKind),
    PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS,
    `${mode}: roles must remain in frozen order`,
  );
  plans.set(mode, first);
}

assert.equal(
  JSON.stringify(graph),
  graphBeforePlanning,
  "Planner must not mutate the reasoning graph.",
);

function role(plan: ExplanationPlan, roleKind: string): ExplanationRole {
  const resolved = plan.roles.find(
    (candidate) => candidate.roleKind === roleKind,
  );
  assert.ok(resolved, `Missing role: ${roleKind}`);
  return resolved;
}

const essentialRoleKinds = PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS.slice(0, 6);
for (const mode of modes) {
  const plan = plans.get(mode)!;
  for (const roleKind of essentialRoleKinds) {
    assert.equal(
      role(plan, roleKind).visibility.state,
      "visible",
      `${mode}: ${roleKind} must be visible`,
    );
  }
  assert.equal(
    role(plan, "SINGLE_UNIT_DERIVATION").visibility.state,
    "visible",
    `${mode}: one-unit derivation must never disappear`,
  );
}

const shortPlan = plans.get("short")!;
assert.equal(role(shortPlan, "VERIFICATION").visibility.state, "hidden");
assert.equal(
  role(shortPlan, "TARGET_UNIT_IDENTIFICATION").metadata.groupId,
  "target-operation",
);
assert.equal(
  role(shortPlan, "TARGET_SCALE_DERIVATION").metadata.groupId,
  "target-operation",
);

const standardPlan = plans.get("standard")!;
assert.equal(
  role(standardPlan, "VERIFICATION").visibility.state,
  "conditional",
);
assert.equal(
  role(standardPlan, "VERIFICATION").visibility.conditionId,
  "verification-requested",
);
assert.equal(role(standardPlan, "VERIFICATION").metadata.preference, "optional");

const detailedPlan = plans.get("detailed")!;
assert.equal(role(detailedPlan, "VERIFICATION").visibility.state, "visible");
assert.equal(
  role(detailedPlan, "VERIFICATION").metadata.preference,
  "preferred",
);

for (const plan of plans.values()) {
  const roleIds = new Set(plan.roles.map((candidate) => candidate.roleId));
  const graphNodeIds = new Set(graph.nodes.map((node) => node.nodeId));

  for (const candidate of plan.roles) {
    for (const dependency of candidate.dependencies) {
      assert.ok(
        roleIds.has(dependency),
        `${candidate.roleKind}: unknown role dependency`,
      );
    }
    for (const graphRef of candidate.graphRefs) {
      assert.ok(
        graphNodeIds.has(graphRef),
        `${candidate.roleKind}: unknown graph reference`,
      );
    }
  }

  const singleUnit = role(plan, "SINGLE_UNIT_DERIVATION");
  const targetScale = role(plan, "TARGET_SCALE_DERIVATION");
  const answer = role(plan, "ANSWER_INTERPRETATION");
  assert.ok(
    targetScale.dependencies.includes(singleUnit.roleId),
    `${plan.detailMode}: target scaling must depend on one-unit derivation`,
  );
  assert.ok(
    answer.dependencies.includes(targetScale.roleId),
    `${plan.detailMode}: answer must depend on target scaling`,
  );
  assert.equal(
    role(plan, "VERIFICATION").dependencies.includes(targetScale.roleId),
    false,
    `${plan.detailMode}: verification must not replace target derivation`,
  );
}

function assertNoLanguageOrRendering(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) assertNoLanguageOrRendering(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(
      !/prose|narrative|text|sentence|equation|latex|math|template|renderedContent|block|locale|language|translation|line/i.test(
        key,
      ),
      `Forbidden planner field detected: ${key}`,
    );
    assertNoLanguageOrRendering(child);
  }
}

for (const plan of plans.values()) assertNoLanguageOrRendering(plan);

console.log("ENG-005 Pedagogical Planner tests passed.");
