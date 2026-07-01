import type {
  ExplanationPlan,
  RichReasoningGraph,
  StructuredExplanationBlock,
  TutorThinkingTrace,
} from "../../../../../../../common/eev2/contracts";
import {
  validationResult,
  type EEV2ValidationFailure,
  type EEV2ValidationResult,
} from "./validation-types";

const GROUP_CHILDREN = {
  RELATIONSHIP_GROUP: ["RELATIONSHIP_CONTEXT", "KNOWN_UNIT_MAPPING"],
  UNIT_VALUE_GROUP: ["SINGLE_UNIT_DERIVATION"],
  TARGET_GROUP: ["TARGET_UNIT_IDENTIFICATION", "TARGET_SCALE_DERIVATION"],
  VERIFICATION_GROUP: ["VERIFICATION"],
  ANSWER_GROUP: ["ANSWER_INTERPRETATION"],
} as const;

const EXPECTED_BLOCK_ORDER = [
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

export function validatePercentOfKnownNumberBlocks(
  blocks: readonly StructuredExplanationBlock[],
  plan: ExplanationPlan,
  graph: RichReasoningGraph,
  trace: TutorThinkingTrace,
): EEV2ValidationResult {
  const failures: EEV2ValidationFailure[] = [];
  const blockIds = new Set(blocks.map((block) => block.blockId));
  const graphNodes = new Map(graph.nodes.map((node) => [node.nodeId, node]));
  const traceIds = new Set(trace.ideas.map((idea) => idea.ideaId));
  const valueRefs = new Set(trace.valueRefs.map((ref) => ref.refId));
  const unitRefs = new Set(trace.unitRefs.map((ref) => ref.refId));
  const evidenceRefs = new Set([...graphNodes.keys(), ...traceIds]);
  const frozenProvenance = blocks[0]
    ? JSON.stringify(blocks[0].provenance)
    : undefined;

  if (
    JSON.stringify(blocks.map((block) => block.semanticRole)) !==
    JSON.stringify(EXPECTED_BLOCK_ORDER)
  ) {
    failures.push({
      code: "BLOCK_ORDER",
      severity: "CRITICAL",
      layer: "BLOCK",
      message: "Structured blocks do not match the frozen canonical order.",
      subjectId: plan.planId,
    });
  }

  for (const block of blocks) {
    if (block.parentId !== null && !blockIds.has(block.parentId)) {
      failures.push({
        code: "BLOCK_PARENT_INVALID",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: "Structured block references an unknown parent.",
        subjectId: block.blockId,
      });
    }
    if (
      block.parentId !== null &&
      !block.renderedContent.text &&
      !block.renderedContent.mathLatex
    ) {
      failures.push({
        code: "BLOCK_CONTENT_MISSING",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: "Role block has no rendered content.",
        subjectId: block.blockId,
      });
    }
    for (const reference of block.evidenceRefs) {
      if (!evidenceRefs.has(reference)) {
        failures.push({
          code: "BLOCK_EVIDENCE_REF_INVALID",
          severity: "CRITICAL",
          layer: "BLOCK",
          message: "Structured block contains an unknown evidence reference.",
          subjectId: block.blockId,
        });
      }
    }
    for (const reference of block.valueRefs) {
      if (!valueRefs.has(reference)) {
        failures.push({
          code: "BLOCK_VALUE_REF_INVALID",
          severity: "CRITICAL",
          layer: "BLOCK",
          message: "Structured block contains an unknown value reference.",
          subjectId: block.blockId,
        });
      }
    }
    for (const reference of block.unitRefs) {
      if (!unitRefs.has(reference)) {
        failures.push({
          code: "BLOCK_UNIT_REF_INVALID",
          severity: "CRITICAL",
          layer: "BLOCK",
          message: "Structured block contains an unknown unit reference.",
          subjectId: block.blockId,
        });
      }
    }
    if (
      Object.values(block.provenance).some(
        (version) => typeof version !== "string" || version.length === 0,
      )
    ) {
      failures.push({
        code: "BLOCK_PROVENANCE_INCOMPLETE",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: "Structured block has incomplete provenance.",
        subjectId: block.blockId,
      });
    }
    if (
      frozenProvenance !== undefined &&
      JSON.stringify(block.provenance) !== frozenProvenance
    ) {
      failures.push({
        code: "BLOCK_PROVENANCE_MISMATCH",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: "Structured blocks do not share a single provenance lock.",
        subjectId: block.blockId,
      });
    }
  }

  for (const [groupKind, children] of Object.entries(GROUP_CHILDREN)) {
    const group = blocks.find((block) => block.semanticRole === groupKind);
    if (!group || group.parentId !== null) {
      failures.push({
        code: "BLOCK_GROUP_MISSING",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: `Required block group "${groupKind}" is missing.`,
        subjectId: group?.blockId ?? plan.planId,
      });
      continue;
    }
    for (const childKind of children) {
      const child = blocks.find((block) => block.semanticRole === childKind);
      if (!child || child.parentId !== group.blockId) {
        failures.push({
          code: "BLOCK_HIERARCHY_INVALID",
          severity: "CRITICAL",
          layer: "BLOCK",
          message: `Role block "${childKind}" is not inside "${groupKind}".`,
          subjectId: child?.blockId ?? group.blockId,
        });
      }
    }
    const childBlocks = children
      .map((childKind) =>
        blocks.find((block) => block.semanticRole === childKind),
      )
      .filter(
        (block): block is StructuredExplanationBlock => block !== undefined,
      );
    const expectedGroupState = childBlocks.some(
      (child) => child.visibility.state === "visible",
    )
      ? "visible"
      : childBlocks.some((child) => child.visibility.state === "conditional")
        ? "conditional"
        : "hidden";
    if (group.visibility.state !== expectedGroupState) {
      failures.push({
        code: "BLOCK_GROUP_VISIBILITY",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: `Group "${groupKind}" visibility differs from its children.`,
        subjectId: group.blockId,
      });
    }
  }

  for (const role of plan.roles) {
    const block = blocks.find((candidate) => candidate.semanticRole === role.roleKind);
    if (!block) {
      failures.push({
        code:
          role.roleKind === "SINGLE_UNIT_DERIVATION"
            ? "BLOCK_SINGLE_UNIT_REQUIRED"
            : "BLOCK_ROLE_MISSING",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: `Structured block for role "${role.roleKind}" is missing.`,
        subjectId: plan.planId,
      });
      continue;
    }
    if (JSON.stringify(block.visibility) !== JSON.stringify(role.visibility)) {
      failures.push({
        code: "BLOCK_VISIBILITY_MISMATCH",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: "Structured block visibility differs from the planner.",
        subjectId: block.blockId,
      });
    }
    const roleGraphNodes = role.graphRefs
      .map((reference) => graphNodes.get(reference))
      .filter((node): node is NonNullable<typeof node> => Boolean(node));
    const requiredEvidence = new Set([
      ...role.graphRefs,
      ...roleGraphNodes.flatMap((node) => node.traceRefs),
    ]);
    const requiredValues = new Set(
      roleGraphNodes.flatMap((node) => node.valueRefs),
    );
    const requiredUnits = new Set(
      roleGraphNodes.flatMap((node) => node.unitRefs),
    );
    if ([...requiredEvidence].some((ref) => !block.evidenceRefs.includes(ref))) {
      failures.push({
        code: "BLOCK_EVIDENCE_LOSS",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: "Structured block lost graph or trace evidence.",
        subjectId: block.blockId,
      });
    }
    if ([...requiredValues].some((ref) => !block.valueRefs.includes(ref))) {
      failures.push({
        code: "BLOCK_VALUE_LOSS",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: "Structured block lost a value reference.",
        subjectId: block.blockId,
      });
    }
    if ([...requiredUnits].some((ref) => !block.unitRefs.includes(ref))) {
      failures.push({
        code: "BLOCK_UNIT_LOSS",
        severity: "CRITICAL",
        layer: "BLOCK",
        message: "Structured block lost a unit reference.",
        subjectId: block.blockId,
      });
    }
  }

  return validationResult(failures);
}
