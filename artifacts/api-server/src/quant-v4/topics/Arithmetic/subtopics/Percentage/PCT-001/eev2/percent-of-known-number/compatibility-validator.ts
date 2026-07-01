import type { StructuredExplanationBlock } from "../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../common/eev2/compatibility-projector";
import {
  validationResult,
  type EEV2ValidationFailure,
  type EEV2ValidationResult,
} from "./validation-types";

export function validatePercentOfKnownNumberCompatibility(
  blocks: readonly StructuredExplanationBlock[],
  lines: readonly string[],
): EEV2ValidationResult {
  const failures: EEV2ValidationFailure[] = [];
  const expected = projectCompatibilityLines(blocks);

  if (JSON.stringify(lines) !== JSON.stringify(expected)) {
    failures.push({
      code: "COMPAT_PARITY",
      severity: "CRITICAL",
      layer: "COMPATIBILITY",
      message: "Compatibility lines do not exactly match the one-way block projection.",
    });
  }

  const requiredRoles = [
    "SINGLE_UNIT_DERIVATION",
    "TARGET_SCALE_DERIVATION",
    "ANSWER_INTERPRETATION",
  ] as const;
  for (const roleKind of requiredRoles) {
    const block = blocks.find(
      (candidate) =>
        candidate.semanticRole === roleKind &&
        candidate.visibility.state === "visible",
    );
    if (!block) {
      failures.push({
        code: "COMPAT_REQUIRED_BLOCK_MISSING",
        severity: "CRITICAL",
        layer: "COMPATIBILITY",
        message: `Required visible block "${roleKind}" is missing.`,
      });
      continue;
    }
    const projected = projectCompatibilityLines([block]);
    if (
      projected.length !== 1 ||
      !lines.includes(projected[0]!)
    ) {
      failures.push({
        code:
          roleKind === "SINGLE_UNIT_DERIVATION"
            ? "COMPAT_SINGLE_UNIT_LOSS"
            : roleKind === "ANSWER_INTERPRETATION"
              ? "COMPAT_ANSWER_LOSS"
              : "COMPAT_TARGET_SCALE_LOSS",
        severity: "CRITICAL",
        layer: "COMPATIBILITY",
        message: `Compatibility projection lost "${roleKind}".`,
        subjectId: block.blockId,
      });
    }
  }

  for (const hiddenBlock of blocks.filter(
    (block) => block.visibility.state !== "visible",
  )) {
    const hiddenLine = projectCompatibilityLines([
      {
        ...hiddenBlock,
        visibility: {
          ...hiddenBlock.visibility,
          state: "visible",
        },
      },
    ])[0];
    if (hiddenLine && lines.includes(hiddenLine)) {
      failures.push({
        code: "COMPAT_VISIBILITY_LEAK",
        severity: "MAJOR",
        layer: "COMPATIBILITY",
        message: "Compatibility lines expose a non-visible block.",
        subjectId: hiddenBlock.blockId,
      });
    }
  }

  return validationResult(failures);
}
