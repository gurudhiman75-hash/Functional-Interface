import { strict as assert } from "node:assert";
import type {
  EEV2DetailMode,
  StructuredExplanationBlock,
} from "../../../../../../../common/eev2/contracts";
import {
  EEV2_COMPATIBILITY_PROJECTION_VERSION,
  projectCompatibilityLines,
} from "../../../../../../../common/eev2/compatibility-projector";
import {
  PERCENT_OF_KNOWN_NUMBER_BLOCK_SCHEMA_VERSION,
  renderPercentOfKnownNumberBlocks,
} from "./block-renderer";
import type { PercentOfKnownNumberEvidence } from "./evidence";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION } from "./english-language-family";
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

function blocksFor(
  detailMode: EEV2DetailMode,
): readonly StructuredExplanationBlock[] {
  const plan = planPercentOfKnownNumberExplanation(graph, detailMode);
  const renderedRoles = renderPercentOfKnownNumberEnglish(plan, trace);
  return renderPercentOfKnownNumberBlocks(
    plan,
    renderedRoles,
    graph,
    provenanceInput,
  );
}

for (const mode of ["short", "standard", "detailed"] as const) {
  const blocks = blocksFor(mode);
  const blocksBeforeProjection = JSON.stringify(blocks);
  const first = projectCompatibilityLines(blocks);
  const second = projectCompatibilityLines(blocks);

  assert.deepEqual(first, second, `${mode}: projection must be deterministic`);
  assert.equal(
    JSON.stringify(blocks),
    blocksBeforeProjection,
    `${mode}: projection must not mutate authoritative blocks`,
  );

  const visibleContentBlocks = blocks.filter(
    (block) =>
      block.visibility.state === "visible" &&
      (block.renderedContent.text || block.renderedContent.mathLatex),
  );
  assert.equal(
    first.length,
    visibleContentBlocks.length,
    `${mode}: one compatibility line is required per visible content block`,
  );

  for (let index = 0; index < visibleContentBlocks.length; index += 1) {
    const block = visibleContentBlocks[index]!;
    const line = first[index]!;
    if (block.renderedContent.text) {
      assert.ok(
        line.startsWith(block.renderedContent.text),
        `${mode}:${block.semanticRole}: text content must remain unchanged`,
      );
    }
    if (block.renderedContent.mathLatex) {
      assert.ok(
        line.includes(`$$${block.renderedContent.mathLatex}$$`),
        `${mode}:${block.semanticRole}: mathematical content must remain unchanged`,
      );
    }
  }

  const singleUnitIndex = visibleContentBlocks.findIndex(
    (block) => block.semanticRole === "SINGLE_UNIT_DERIVATION",
  );
  const targetScaleIndex = visibleContentBlocks.findIndex(
    (block) => block.semanticRole === "TARGET_SCALE_DERIVATION",
  );
  const answerIndex = visibleContentBlocks.findIndex(
    (block) => block.semanticRole === "ANSWER_INTERPRETATION",
  );
  assert.ok(singleUnitIndex >= 0, `${mode}: one-unit reasoning must survive`);
  assert.ok(
    targetScaleIndex > singleUnitIndex,
    `${mode}: target scaling must follow one-unit reasoning`,
  );
  assert.ok(
    answerIndex > targetScaleIndex,
    `${mode}: answer interpretation must follow target scaling`,
  );
  assert.match(first[singleUnitIndex]!, /1\\%/);
  assert.match(first[targetScaleIndex]!, /25\\%/);
  assert.match(first[answerIndex]!, /required value is 750/i);

  const verificationBlock = blocks.find(
    (block) => block.semanticRole === "VERIFICATION",
  )!;
  const verificationAppears = first.some((line) =>
    line.startsWith(verificationBlock.renderedContent.text ?? "\0"),
  );
  assert.equal(
    verificationAppears,
    verificationBlock.visibility.state === "visible",
    `${mode}: verification visibility must be preserved`,
  );

  for (const block of blocks.filter(
    (candidate) => candidate.visibility.state !== "visible",
  )) {
    if (!block.renderedContent.text) continue;
    assert.equal(
      first.some((line) => line.startsWith(block.renderedContent.text!)),
      false,
      `${mode}:${block.semanticRole}: non-visible content must not be projected`,
    );
  }
}

const orderingBlocks: readonly StructuredExplanationBlock[] = [
  {
    blockId: "block-z",
    semanticRole: "Z_ROLE",
    parentId: "group-z",
    importance: "optional",
    visibility: { state: "visible", detailModes: ["standard"] },
    renderedContent: { text: "First supplied block." },
    evidenceRefs: ["evidence-z"],
    valueRefs: ["value-z"],
    unitRefs: ["unit-z"],
    provenance: {
      ...provenanceInput,
      blockSchemaVersion: PERCENT_OF_KNOWN_NUMBER_BLOCK_SCHEMA_VERSION,
      projectionVersion: "not-projected",
    },
  },
  {
    blockId: "block-a",
    semanticRole: "A_ROLE",
    parentId: "group-a",
    importance: "essential",
    visibility: { state: "visible", detailModes: ["standard"] },
    renderedContent: { text: "Second supplied block." },
    evidenceRefs: ["evidence-a"],
    valueRefs: ["value-a"],
    unitRefs: ["unit-a"],
    provenance: {
      ...provenanceInput,
      blockSchemaVersion: PERCENT_OF_KNOWN_NUMBER_BLOCK_SCHEMA_VERSION,
      projectionVersion: "not-projected",
    },
  },
];
assert.deepEqual(projectCompatibilityLines(orderingBlocks), [
  "First supplied block.",
  "Second supplied block.",
]);

assert.equal(EEV2_COMPATIBILITY_PROJECTION_VERSION, "1.0.0");

console.log("ENG-008 Compatibility Projection tests passed.");
