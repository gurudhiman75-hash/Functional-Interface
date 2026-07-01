import type { TutorThinkingTrace } from "../../../../../../../common/eev2/contracts";
import { PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS } from "./trace-builder";
import {
  validationResult,
  type EEV2ValidationFailure,
  type EEV2ValidationResult,
} from "./validation-types";

const FORBIDDEN_FIELD =
  /prose|narrative|text|sentence|equation|latex|math|template|render|visibility|language/i;

const EXPECTED_DEPENDENCIES: readonly (readonly number[])[] = [
  [],
  [0],
  [0],
  [0],
  [1, 2],
  [4, 3],
  [5],
];

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
    if (FORBIDDEN_FIELD.test(key)) {
      failures.push({
        code: "TRACE_PROSE_FIELD",
        severity: "CRITICAL",
        layer: "TRACE",
        message: `Tutor Thinking Trace contains forbidden field "${key}".`,
        subjectId,
      });
    }
    inspectForbiddenFields(child, failures, subjectId);
  }
}

export function validatePercentOfKnownNumberTrace(
  trace: TutorThinkingTrace,
): EEV2ValidationResult {
  const failures: EEV2ValidationFailure[] = [];
  const ideaIds = new Set(trace.ideas.map((idea) => idea.ideaId));
  const valueRefIds = new Set(trace.valueRefs.map((ref) => ref.refId));
  const unitRefIds = new Set(trace.unitRefs.map((ref) => ref.refId));

  if (
    JSON.stringify(trace.ideas.map((idea) => idea.ideaKind)) !==
    JSON.stringify(PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS)
  ) {
    failures.push({
      code: "TRACE_IDEA_SEQUENCE",
      severity: "CRITICAL",
      layer: "TRACE",
      message: "Tutor Thinking Trace does not match the frozen idea sequence.",
      subjectId: trace.traceId,
    });
  }
  if (ideaIds.size !== trace.ideas.length) {
    failures.push({
      code: "TRACE_DUPLICATE_ID",
      severity: "CRITICAL",
      layer: "TRACE",
      message: "Tutor Thinking Trace contains duplicate idea IDs.",
      subjectId: trace.traceId,
    });
  }

  trace.ideas.forEach((idea, index) => {
    const expectedId = `${trace.traceId}:idea:${String(index + 1).padStart(2, "0")}`;
    if (idea.ideaId !== expectedId) {
      failures.push({
        code: "TRACE_UNSTABLE_ORDER",
        severity: "CRITICAL",
        layer: "TRACE",
        message: "Tutor Thinking Trace idea identity or ordering is unstable.",
        subjectId: idea.ideaId,
      });
    }
    const expectedDependencies: readonly (string | undefined)[] =
      EXPECTED_DEPENDENCIES[index]!.map(
      (dependencyIndex) => trace.ideas[dependencyIndex]?.ideaId,
      );
    if (
      expectedDependencies.includes(undefined) ||
      JSON.stringify(idea.dependencies) !==
        JSON.stringify(expectedDependencies)
    ) {
      failures.push({
        code: "TRACE_DEPENDENCY_MISMATCH",
        severity: "CRITICAL",
        layer: "TRACE",
        message: "Tutor Thinking Trace dependencies do not match the frozen path.",
        subjectId: idea.ideaId,
      });
    }
    if (
      JSON.stringify(trace.dependencies[idea.ideaId]) !==
      JSON.stringify(idea.dependencies)
    ) {
      failures.push({
        code: "TRACE_DEPENDENCY_REGISTRY",
        severity: "CRITICAL",
        layer: "TRACE",
        message: "Trace dependency registry does not match the idea.",
        subjectId: idea.ideaId,
      });
    }
    for (const dependency of idea.dependencies) {
      if (!ideaIds.has(dependency)) {
        failures.push({
          code: "TRACE_UNKNOWN_DEPENDENCY",
          severity: "CRITICAL",
          layer: "TRACE",
          message: "Trace idea references an unknown dependency.",
          subjectId: idea.ideaId,
        });
      }
      if (
        trace.ideas.findIndex((candidate) => candidate.ideaId === dependency) >=
        index
      ) {
        failures.push({
          code: "TRACE_CYCLE",
          severity: "CRITICAL",
          layer: "TRACE",
          message: "Trace dependency is cyclic or forward-referencing.",
          subjectId: idea.ideaId,
        });
      }
    }
    for (const valueRef of idea.valueRefs) {
      if (!valueRefIds.has(valueRef)) {
        failures.push({
          code: "TRACE_UNKNOWN_VALUE_REF",
          severity: "CRITICAL",
          layer: "TRACE",
          message: "Trace idea references an unknown value.",
          subjectId: idea.ideaId,
        });
      }
    }
    for (const unitRef of idea.unitRefs) {
      if (!unitRefIds.has(unitRef)) {
        failures.push({
          code: "TRACE_UNKNOWN_UNIT_REF",
          severity: "CRITICAL",
          layer: "TRACE",
          message: "Trace idea references an unknown unit.",
          subjectId: idea.ideaId,
        });
      }
    }
  });

  inspectForbiddenFields(trace, failures, trace.traceId);
  return validationResult(failures);
}
