import type {
  ExplanationPlan,
  RichReasoningGraph,
} from "../../../../../../../common/eev2/contracts";
import { PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS } from "./planner";
import {
  validationResult,
  type EEV2ValidationFailure,
  type EEV2ValidationResult,
} from "./validation-types";

function inspectForbiddenFields(
  value: unknown,
  failures: EEV2ValidationFailure[],
  subjectId: string,
): void {
  if (Array.isArray(value)) {
    for (const item of value) inspectForbiddenFields(item, failures, subjectId);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (
      /prose|narrative|text|sentence|equation|latex|math|template|renderedContent|block|locale|language|translation|line/i.test(
        key,
      )
    ) {
      failures.push({
        code: "PLAN_LANGUAGE_FIELD",
        severity: "CRITICAL",
        layer: "PLAN",
        message: `Explanation Plan contains forbidden field "${key}".`,
        subjectId,
      });
    }
    inspectForbiddenFields(child, failures, subjectId);
  }
}

export function validatePercentOfKnownNumberPlan(
  plan: ExplanationPlan,
  graph: RichReasoningGraph,
): EEV2ValidationResult {
  const failures: EEV2ValidationFailure[] = [];
  const roleIds = new Set(plan.roles.map((role) => role.roleId));
  const graphNodeIds = new Set(graph.nodes.map((node) => node.nodeId));

  if (
    JSON.stringify(plan.roles.map((role) => role.roleKind)) !==
    JSON.stringify(PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS)
  ) {
    failures.push({
      code: "PLAN_ROLE_SEQUENCE",
      severity: "CRITICAL",
      layer: "PLAN",
      message: "Explanation Plan does not match the frozen role sequence.",
      subjectId: plan.planId,
    });
  }

  for (const role of plan.roles) {
    for (const dependency of role.dependencies) {
      if (!roleIds.has(dependency)) {
        failures.push({
          code: "PLAN_UNKNOWN_DEPENDENCY",
          severity: "CRITICAL",
          layer: "PLAN",
          message: "Explanation role references an unknown dependency.",
          subjectId: role.roleId,
        });
      }
      if (
        plan.roles.findIndex((candidate) => candidate.roleId === dependency) >=
        plan.roles.findIndex((candidate) => candidate.roleId === role.roleId)
      ) {
        failures.push({
          code: "PLAN_DEPENDENCY_ORDER",
          severity: "CRITICAL",
          layer: "PLAN",
          message: "Explanation role dependency is cyclic or forward-referencing.",
          subjectId: role.roleId,
        });
      }
    }
    for (const graphRef of role.graphRefs) {
      if (!graphNodeIds.has(graphRef)) {
        failures.push({
          code: "PLAN_UNKNOWN_GRAPH_REF",
          severity: "CRITICAL",
          layer: "PLAN",
          message: "Explanation role references an unknown graph node.",
          subjectId: role.roleId,
        });
      }
    }
  }

  const role = (roleKind: string) =>
    plan.roles.find((candidate) => candidate.roleKind === roleKind);
  const essentialKinds = PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS.slice(0, 6);
  for (const roleKind of essentialKinds) {
    const essentialRole = role(roleKind);
    if (!essentialRole || essentialRole.visibility.state !== "visible") {
      failures.push({
        code:
          roleKind === "SINGLE_UNIT_DERIVATION"
            ? "PLAN_SINGLE_UNIT_REQUIRED"
            : "PLAN_ESSENTIAL_ROLE_HIDDEN",
        severity: "CRITICAL",
        layer: "PLAN",
        message: `Essential explanation role "${roleKind}" must remain visible.`,
        subjectId: essentialRole?.roleId ?? plan.planId,
      });
    }
  }

  const singleUnit = role("SINGLE_UNIT_DERIVATION");
  const targetIdentification = role("TARGET_UNIT_IDENTIFICATION");
  const targetScale = role("TARGET_SCALE_DERIVATION");
  const answer = role("ANSWER_INTERPRETATION");
  if (
    singleUnit &&
    targetIdentification &&
    targetScale &&
    (!targetScale.dependencies.includes(singleUnit.roleId) ||
      !targetScale.dependencies.includes(targetIdentification.roleId))
  ) {
    failures.push({
      code: "PLAN_ANSWER_JUMP",
      severity: "CRITICAL",
      layer: "PLAN",
      message: "Target scaling bypasses required unit-value reasoning.",
      subjectId: targetScale.roleId,
    });
  }
  if (targetScale && answer && !answer.dependencies.includes(targetScale.roleId)) {
    failures.push({
      code: "PLAN_ANSWER_DEPENDENCY",
      severity: "CRITICAL",
      layer: "PLAN",
      message: "Answer interpretation does not depend on target scaling.",
      subjectId: answer.roleId,
    });
  }

  const verification = role("VERIFICATION");
  const expectedVerificationState =
    plan.detailMode === "short"
      ? "hidden"
      : plan.detailMode === "standard"
        ? "conditional"
        : "visible";
  if (!verification || verification.visibility.state !== expectedVerificationState) {
    failures.push({
      code: "PLAN_VERIFICATION_POLICY",
      severity: "MAJOR",
      layer: "PLAN",
      message: "Verification visibility does not match the detail-mode policy.",
      subjectId: verification?.roleId ?? plan.planId,
    });
  }

  inspectForbiddenFields(plan, failures, plan.planId);
  return validationResult(failures);
}
