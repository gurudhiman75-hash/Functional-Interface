import { strict as assert } from "node:assert";
import type {
  EEV2DetailMode,
  ExplanationPlan,
  StructuredExplanationBlock,
} from "../../../../../../../common/eev2/contracts";
import type { PercentOfKnownNumberEvidence } from "./evidence";
import {
  PERCENT_OF_KNOWN_NUMBER_BLOCK_SCHEMA_VERSION,
  renderPercentOfKnownNumberBlocks,
} from "./block-renderer";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import {
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
} from "./english-language-family";
import { renderPercentOfKnownNumberEnglish } from "./language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "./planner";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
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

const trace = buildPercentOfKnownNumberTrace(evidence);
const graph = buildPercentOfKnownNumberGraph(trace);
const provenanceInput = {
  solverVersion: "PCT-001-solver-v1",
  traceVersion: PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  graphVersion: graph.graphVersion,
  plannerVersion: PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  languageFamilyVersion: PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
};

function roleBlock(
  blocks: readonly StructuredExplanationBlock[],
  roleKind: string,
): StructuredExplanationBlock {
  const block = blocks.find((candidate) => candidate.semanticRole === roleKind);
  assert.ok(block, `Missing role block: ${roleKind}`);
  return block;
}

function groupBlock(
  blocks: readonly StructuredExplanationBlock[],
  groupKind: string,
): StructuredExplanationBlock {
  const block = blocks.find((candidate) => candidate.semanticRole === groupKind);
  assert.ok(block, `Missing group block: ${groupKind}`);
  return block;
}

const expectedOrder = [
  "RELATIONSHIP_GROUP",
  "RELATIONSHIP_CONTEXT",
  "KNOWN_UNIT_MAPPING",
  "UNIT_VALUE_GROUP",
  "SINGLE_UNIT_DERIVATION",
  "TARGET_GROUP",
  "TARGET_UNIT_IDENTIFICATION",
  "TARGET_SCALE_DERIVATION",
  "VERIFICATION_GROUP",
  "VERIFICATION",
  "ANSWER_GROUP",
  "ANSWER_INTERPRETATION",
] as const;

for (const mode of ["short", "standard", "detailed"] as const satisfies readonly EEV2DetailMode[]) {
  const plan = planPercentOfKnownNumberExplanation(graph, mode);
  const renderedRoles = renderPercentOfKnownNumberEnglish(plan, trace);
  const planBefore = JSON.stringify(plan);
  const renderedBefore = JSON.stringify(renderedRoles);

  const first = renderPercentOfKnownNumberBlocks(
    plan,
    renderedRoles,
    graph,
    provenanceInput,
  );
  const second = renderPercentOfKnownNumberBlocks(
    plan,
    renderedRoles,
    graph,
    provenanceInput,
  );

  assert.deepEqual(first, second, `${mode}: blocks must be deterministic`);
  assert.deepEqual(
    first.map((block) => block.semanticRole),
    expectedOrder,
    `${mode}: block ordering must remain stable`,
  );
  assert.equal(
    JSON.stringify(plan),
    planBefore,
    `${mode}: block rendering must not mutate the plan`,
  );
  assert.equal(
    JSON.stringify(renderedRoles),
    renderedBefore,
    `${mode}: block rendering must not mutate rendered roles`,
  );

  for (const block of first) {
    assert.equal(block.provenance.solverVersion, "PCT-001-solver-v1");
    assert.equal(
      block.provenance.traceVersion,
      PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
    );
    assert.equal(block.provenance.graphVersion, graph.graphVersion);
    assert.equal(
      block.provenance.plannerVersion,
      PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
    );
    assert.equal(
      block.provenance.languageFamilyVersion,
      PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
    );
    assert.equal(
      block.provenance.blockSchemaVersion,
      PERCENT_OF_KNOWN_NUMBER_BLOCK_SCHEMA_VERSION,
    );
    assert.equal(block.provenance.projectionVersion, "not-projected");
    assert.ok(block.evidenceRefs.length > 0);
    assert.ok(block.valueRefs.length > 0);
    assert.ok(block.unitRefs.length > 0);
  }

  for (const role of plan.roles) {
    const block = roleBlock(first, role.roleKind);
    const rendered = renderedRoles.roles.find(
      (candidate) => candidate.roleId === role.roleId,
    )!;
    assert.deepEqual(
      block.visibility,
      role.visibility,
      `${mode}:${role.roleKind}: visibility must match the planner`,
    );
    assert.deepEqual(
      block.renderedContent,
      {
        text: rendered.sentence,
        mathLatex: rendered.math,
      },
      `${mode}:${role.roleKind}: rendered content must be preserved exactly`,
    );
  }

  const unitGroup = groupBlock(first, "UNIT_VALUE_GROUP");
  const singleUnit = roleBlock(first, "SINGLE_UNIT_DERIVATION");
  assert.equal(unitGroup.visibility.state, "visible");
  assert.equal(unitGroup.importance, "essential");
  assert.equal(singleUnit.parentId, unitGroup.blockId);
  assert.equal(singleUnit.visibility.state, "visible");

  const answerGroup = groupBlock(first, "ANSWER_GROUP");
  const answer = roleBlock(first, "ANSWER_INTERPRETATION");
  assert.equal(answerGroup.visibility.state, "visible");
  assert.equal(answer.parentId, answerGroup.blockId);
  assert.equal(answer.visibility.state, "visible");

  const verificationGroup = groupBlock(first, "VERIFICATION_GROUP");
  const verification = roleBlock(first, "VERIFICATION");
  assert.equal(verification.parentId, verificationGroup.blockId);
  assert.deepEqual(verificationGroup.visibility, verification.visibility);
}

const standardPlan: ExplanationPlan =
  planPercentOfKnownNumberExplanation(graph, "standard");
const standardRoles = renderPercentOfKnownNumberEnglish(standardPlan, trace);
const standardBlocks = renderPercentOfKnownNumberBlocks(
  standardPlan,
  standardRoles,
  graph,
  provenanceInput,
);
const targetScale = roleBlock(standardBlocks, "TARGET_SCALE_DERIVATION");
assert.ok(targetScale.evidenceRefs.some((reference) => reference.includes("target-quantity")));
assert.ok(targetScale.valueRefs.includes("value:single-unit-value"));
assert.ok(targetScale.valueRefs.includes("value:target-unit-count"));
assert.ok(targetScale.valueRefs.includes("value:target-quantity"));
assert.ok(targetScale.unitRefs.includes("unit:percentage-point"));
assert.ok(targetScale.unitRefs.includes("unit:quantity"));

console.log("ENG-007 Structured Blocks tests passed.");
