import type {
  ExplanationPlan,
  StructuredExplanationBlock,
} from "../../../../../../../common/eev2/contracts";
import {
  validationResult,
  type EEV2ValidationFailure,
  type EEV2ValidationResult,
} from "./validation-types";

const AI_FILLER =
  /using the formula|substitut(?:e|ing) values|applying percentage formula|completing the arithmetic|notice that/i;
const FORMULA_WORDS =
  /\bformula\b|\bsubstitut(?:e|ion|ing)\b|\bsimplif(?:y|ication)\b/i;
const GENERIC_LABELS = /^(given|calculation|answer)\s*[:.]?$/i;
const ALGEBRA_DUMP = /\blet\s+[a-z]\b|\b[a-z]\s*=\s*[\d(]/i;
const PRECISION_LEAK = /\d+\.\d{7,}/;

function visibleRoleBlocks(
  blocks: readonly StructuredExplanationBlock[],
): readonly StructuredExplanationBlock[] {
  return blocks.filter(
    (block) =>
      block.parentId !== null &&
      block.visibility.state === "visible" &&
      Boolean(block.renderedContent.text || block.renderedContent.mathLatex),
  );
}

function content(block: StructuredExplanationBlock): string {
  return `${block.renderedContent.text ?? ""} ${block.renderedContent.mathLatex ?? ""}`.trim();
}

function terminalNumber(value: string): string | undefined {
  return value.match(/-?\d+(?:\.\d+)?(?!.*\d)/)?.[0];
}

export function validatePercentOfKnownNumberEducation(
  blocks: readonly StructuredExplanationBlock[],
  plan: ExplanationPlan,
): EEV2ValidationResult {
  const failures: EEV2ValidationFailure[] = [];
  const visible = visibleRoleBlocks(blocks);
  const fullText = visible.map(content).join("\n");

  if (
    FORMULA_WORDS.test(fullText) ||
    visible[0]?.semanticRole === "TARGET_SCALE_DERIVATION"
  ) {
    failures.push({
      code: "EDU_FORMULA_FIRST",
      severity: "CRITICAL",
      layer: "EDUCATIONAL",
      message: "Explanation uses formula-first or symbolic-operation language.",
      subjectId: visible[0]?.blockId ?? plan.planId,
    });
  }
  const genericLabels = visible
    .map((block) => block.renderedContent.text?.trim() ?? "")
    .filter((text) => GENERIC_LABELS.test(text));
  if (genericLabels.length > 0) {
    failures.push({
      code: "EDU_GENERIC_STRUCTURE",
      severity: "CRITICAL",
      layer: "EDUCATIONAL",
      message: "Explanation contains generic Given/Calculation/Answer labels.",
      subjectId: plan.planId,
    });
  }
  if (
    genericLabels.some((label) => /^given/i.test(label)) &&
    genericLabels.some((label) => /^calculation/i.test(label)) &&
    genericLabels.some((label) => /^answer/i.test(label))
  ) {
    failures.push({
      code: "EDU_TEACHER_RENDERER_FALLBACK",
      severity: "CRITICAL",
      layer: "EDUCATIONAL",
      message: "Legacy TeacherRenderer structure leaked into EEV2 output.",
      subjectId: plan.planId,
    });
  }
  if (ALGEBRA_DUMP.test(fullText)) {
    failures.push({
      code: "EDU_ALGEBRA_DUMP",
      severity: "CRITICAL",
      layer: "EDUCATIONAL",
      message: "Explanation introduces an algebra dump.",
      subjectId: plan.planId,
    });
  }
  if (AI_FILLER.test(fullText)) {
    failures.push({
      code: "EDU_AI_FILLER",
      severity: "MAJOR",
      layer: "EDUCATIONAL",
      message: "Explanation contains forbidden AI-style filler.",
      subjectId: plan.planId,
    });
  }
  if (PRECISION_LEAK.test(fullText)) {
    failures.push({
      code: "EDU_PRECISION_LEAK",
      severity: "MAJOR",
      layer: "EDUCATIONAL",
      message: "Explanation exposes implementation precision.",
      subjectId: plan.planId,
    });
  }

  const singleUnitIndex = visible.findIndex(
    (block) => block.semanticRole === "SINGLE_UNIT_DERIVATION",
  );
  const targetScaleIndex = visible.findIndex(
    (block) => block.semanticRole === "TARGET_SCALE_DERIVATION",
  );
  const answerIndex = visible.findIndex(
    (block) => block.semanticRole === "ANSWER_INTERPRETATION",
  );
  if (
    singleUnitIndex < 0 ||
    targetScaleIndex < 0 ||
    singleUnitIndex >= targetScaleIndex ||
    !/1\\?%/.test(content(visible[singleUnitIndex]!))
  ) {
    failures.push({
      code: "EDU_UNEXPLAINED_JUMP",
      severity: "MAJOR",
      layer: "EDUCATIONAL",
      message: "Explanation reaches the target without exposing one-unit reasoning.",
      subjectId: plan.planId,
    });
  }
  if (answerIndex < 0 || !visible[answerIndex]?.renderedContent.text) {
    failures.push({
      code: "EDU_ANSWER_INTERPRETATION_MISSING",
      severity: "CRITICAL",
      layer: "EDUCATIONAL",
      message: "Explanation has no contextual answer interpretation.",
      subjectId: plan.planId,
    });
  } else if (
    plan.detailMode !== "short" &&
    visible[answerIndex]!.renderedContent.text!.trim().split(/\s+/).length < 5
  ) {
    failures.push({
      code: "EDU_BARE_CONCLUSION",
      severity: "MAJOR",
      layer: "EDUCATIONAL",
      message: "Standard or detailed explanation ends with a bare conclusion.",
      subjectId: visible[answerIndex]!.blockId,
    });
  }

  if (targetScaleIndex >= 0 && answerIndex >= 0) {
    const targetValue = terminalNumber(content(visible[targetScaleIndex]!));
    if (
      targetValue &&
      !content(visible[answerIndex]!).includes(targetValue)
    ) {
      failures.push({
        code: "EDU_WRONG_ANSWER",
        severity: "CRITICAL",
        layer: "EDUCATIONAL",
        message: "Answer interpretation does not match the rendered target value.",
        subjectId: visible[answerIndex]!.blockId,
      });
    }
  }

  return validationResult(failures);
}
