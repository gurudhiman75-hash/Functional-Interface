import { strict as assert } from "node:assert";
import type {
  EEV2DetailMode,
  ExplanationPlan,
  RichReasoningGraph,
  StructuredExplanationBlock,
  TutorThinkingTrace,
} from "../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../common/eev2/compatibility-projector";
import {
  renderPercentOfKnownNumberBlocks,
} from "./block-renderer";
import { validatePercentOfKnownNumberBlocks } from "./block-validator";
import { validatePercentOfKnownNumberCompatibility } from "./compatibility-validator";
import type { PercentOfKnownNumberEvidence } from "./evidence";
import { validatePercentOfKnownNumberEducation } from "./educational-validator";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import { validatePercentOfKnownNumberGraph } from "./graph-validator";
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION } from "./english-language-family";
import { renderPercentOfKnownNumberEnglish } from "./language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "./planner";
import { validatePercentOfKnownNumberPlan } from "./plan-validator";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "./trace-builder";
import { validatePercentOfKnownNumberTrace } from "./trace-validator";
import type {
  EEV2FailureSeverity,
  EEV2ValidationResult,
} from "./validation-types";

const evidence: PercentOfKnownNumberEvidence = {
  evidenceId: "PCT-001:PCT-QL-017:validator-golden:unit-value-evidence",
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

function buildGolden(detailMode: EEV2DetailMode) {
  const plan = planPercentOfKnownNumberExplanation(graph, detailMode);
  const rendered = renderPercentOfKnownNumberEnglish(plan, trace);
  const blocks = renderPercentOfKnownNumberBlocks(
    plan,
    rendered,
    graph,
    provenanceInput,
  );
  const lines = projectCompatibilityLines(blocks);
  return { plan, blocks, lines };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function assertFailure(
  result: EEV2ValidationResult,
  code: string,
  severity: EEV2FailureSeverity,
): void {
  const failure = result.failures.find((candidate) => candidate.code === code);
  assert.ok(failure, `Expected validation failure: ${code}`);
  assert.equal(failure.severity, severity, `${code}: severity mismatch`);
}

for (const mode of ["short", "standard", "detailed"] as const) {
  const golden = buildGolden(mode);
  const before = JSON.stringify({
    trace,
    graph,
    plan: golden.plan,
    blocks: golden.blocks,
    lines: golden.lines,
  });
  const results = [
    validatePercentOfKnownNumberTrace(trace),
    validatePercentOfKnownNumberGraph(graph, trace),
    validatePercentOfKnownNumberPlan(golden.plan, graph),
    validatePercentOfKnownNumberBlocks(
      golden.blocks,
      golden.plan,
      graph,
      trace,
    ),
    validatePercentOfKnownNumberEducation(golden.blocks, golden.plan),
    validatePercentOfKnownNumberCompatibility(golden.blocks, golden.lines),
  ];
  for (const result of results) {
    assert.equal(
      result.valid,
      true,
      `${mode}: ${result.failures.map((failure) => failure.code).join(", ")}`,
    );
    assert.deepEqual(result, clone(result), `${mode}: result must be deterministic`);
  }
  assert.equal(
    JSON.stringify({
      trace,
      graph,
      plan: golden.plan,
      blocks: golden.blocks,
      lines: golden.lines,
    }),
    before,
    `${mode}: validators must not mutate artifacts`,
  );
}

const standard = buildGolden("standard");

const missingIdea = clone(trace) as TutorThinkingTrace;
(missingIdea.ideas as unknown as unknown[]).splice(4, 1);
assertFailure(
  validatePercentOfKnownNumberTrace(missingIdea),
  "TRACE_IDEA_SEQUENCE",
  "CRITICAL",
);

const graphWithoutSingleUnit = clone(graph) as RichReasoningGraph;
(graphWithoutSingleUnit.nodes as unknown as { nodeKind: string }[]) =
  graphWithoutSingleUnit.nodes.filter(
    (node) => node.nodeKind !== "single-percent-value",
  ) as { nodeKind: string }[];
assertFailure(
  validatePercentOfKnownNumberGraph(graphWithoutSingleUnit, trace),
  "GRAPH_CORE_COMPLETENESS",
  "CRITICAL",
);

const hiddenSingleUnitPlan = clone(standard.plan) as ExplanationPlan;
const hiddenSingleUnitRole = hiddenSingleUnitPlan.roles.find(
  (role) => role.roleKind === "SINGLE_UNIT_DERIVATION",
)!;
(hiddenSingleUnitRole.visibility as { state: string }).state = "hidden";
assertFailure(
  validatePercentOfKnownNumberPlan(hiddenSingleUnitPlan, graph),
  "PLAN_SINGLE_UNIT_REQUIRED",
  "CRITICAL",
);

const badParentBlocks = clone(
  standard.blocks,
) as StructuredExplanationBlock[];
badParentBlocks.find(
  (block) => block.semanticRole === "SINGLE_UNIT_DERIVATION",
)!.parentId = "missing-parent";
assertFailure(
  validatePercentOfKnownNumberBlocks(
    badParentBlocks,
    standard.plan,
    graph,
    trace,
  ),
  "BLOCK_PARENT_INVALID",
  "CRITICAL",
);

const lostValueBlocks = clone(
  standard.blocks,
) as StructuredExplanationBlock[];
const lostValueBlock = lostValueBlocks.find(
  (block) => block.semanticRole === "TARGET_SCALE_DERIVATION",
)!;
lostValueBlock.valueRefs = lostValueBlock.valueRefs.filter(
  (reference) => reference !== "value:target-quantity",
);
assertFailure(
  validatePercentOfKnownNumberBlocks(
    lostValueBlocks,
    standard.plan,
    graph,
    trace,
  ),
  "BLOCK_VALUE_LOSS",
  "CRITICAL",
);

function mutateText(
  blocks: readonly StructuredExplanationBlock[],
  roleKind: string,
  text: string,
): StructuredExplanationBlock[] {
  const mutated = clone(blocks) as StructuredExplanationBlock[];
  mutated.find((block) => block.semanticRole === roleKind)!.renderedContent.text =
    text;
  return mutated;
}

assertFailure(
  validatePercentOfKnownNumberEducation(
    mutateText(standard.blocks, "RELATIONSHIP_CONTEXT", "Formula."),
    standard.plan,
  ),
  "EDU_FORMULA_FIRST",
  "CRITICAL",
);

const genericBlocks = mutateText(
  standard.blocks,
  "RELATIONSHIP_CONTEXT",
  "Given",
);
genericBlocks.find(
  (block) => block.semanticRole === "SINGLE_UNIT_DERIVATION",
)!.renderedContent.text = "Calculation";
genericBlocks.find(
  (block) => block.semanticRole === "ANSWER_INTERPRETATION",
)!.renderedContent.text = "Answer";
const genericResult = validatePercentOfKnownNumberEducation(
  genericBlocks,
  standard.plan,
);
assertFailure(genericResult, "EDU_GENERIC_STRUCTURE", "CRITICAL");
assertFailure(genericResult, "EDU_TEACHER_RENDERER_FALLBACK", "CRITICAL");

assertFailure(
  validatePercentOfKnownNumberEducation(
    mutateText(
      standard.blocks,
      "RELATIONSHIP_CONTEXT",
      "Let x be the required number.",
    ),
    standard.plan,
  ),
  "EDU_ALGEBRA_DUMP",
  "CRITICAL",
);

const jumpBlocks = clone(standard.blocks) as StructuredExplanationBlock[];
const jumpBlock = jumpBlocks.find(
  (block) => block.semanticRole === "SINGLE_UNIT_DERIVATION",
)!;
jumpBlock.visibility = { state: "hidden", detailModes: ["standard"] };
assertFailure(
  validatePercentOfKnownNumberEducation(jumpBlocks, standard.plan),
  "EDU_UNEXPLAINED_JUMP",
  "MAJOR",
);

assertFailure(
  validatePercentOfKnownNumberEducation(
    mutateText(
      standard.blocks,
      "RELATIONSHIP_CONTEXT",
      "Using the formula, begin with the known values.",
    ),
    standard.plan,
  ),
  "EDU_AI_FILLER",
  "MAJOR",
);

const precisionBlocks = clone(standard.blocks) as StructuredExplanationBlock[];
precisionBlocks.find(
  (block) => block.semanticRole === "SINGLE_UNIT_DERIVATION",
)!.renderedContent.mathLatex = "1\\% = 3.3333333333333335";
assertFailure(
  validatePercentOfKnownNumberEducation(precisionBlocks, standard.plan),
  "EDU_PRECISION_LEAK",
  "MAJOR",
);

assertFailure(
  validatePercentOfKnownNumberEducation(
    mutateText(
      standard.blocks,
      "ANSWER_INTERPRETATION",
      "So, the required value is 751.",
    ),
    standard.plan,
  ),
  "EDU_WRONG_ANSWER",
  "CRITICAL",
);

assertFailure(
  validatePercentOfKnownNumberCompatibility(
    standard.blocks,
    [...standard.lines].reverse(),
  ),
  "COMPAT_PARITY",
  "CRITICAL",
);

const standardVerification = standard.blocks.find(
  (block) => block.semanticRole === "VERIFICATION",
)!;
const leakedVerificationLine = [
  ...standard.lines,
  `${standardVerification.renderedContent.text} | $$${standardVerification.renderedContent.mathLatex}$$`,
];
assertFailure(
  validatePercentOfKnownNumberCompatibility(
    standard.blocks,
    leakedVerificationLine,
  ),
  "COMPAT_VISIBILITY_LEAK",
  "MAJOR",
);

console.log("ENG-009 Validation System tests passed.");
