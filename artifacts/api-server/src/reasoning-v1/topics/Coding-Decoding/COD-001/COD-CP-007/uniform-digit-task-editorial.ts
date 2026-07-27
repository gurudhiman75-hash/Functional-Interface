import type { GeneratedUniformDigitPrototypeQuestion } from "./uniform-digit-types";

export function applyUniformDigitTaskTeachingPath(
  question: GeneratedUniformDigitPrototypeQuestion,
): GeneratedUniformDigitPrototypeQuestion {
  const { taskKind, targetSource, targetCode, missingIndex, displayedTargetCode } = question.structuredPrompt;
  const { shift, correctAnswer } = question.metadata;
  const base = question.explanation;

  if (taskKind === "ENCODE_TARGET") {
    return {
      ...question,
      explanation: {
        ...base,
        quickMethod: `The movement is already stated: apply +${shift} separately to every target digit and keep the positions unchanged.`,
        ruleStatement: `The given rule directly moves each digit forward by ${shift} on the decimal cycle; the examples only confirm how wrapping works.`,
        targetApplication: [
          ...base.targetApplication,
          `Because the rule is supplied in the question, no alternative pattern needs to be inferred before coding ${targetSource}.`,
        ],
      },
    };
  }

  if (taskKind === "INFER_AND_ENCODE") {
    return {
      ...question,
      explanation: {
        ...base,
        quickMethod: `Compare matching positions in both examples, identify the common +${shift} movement, and then apply it to ${targetSource}.`,
        ruleStatement: `The rule is not stated, so compare corresponding columns in both examples: every source digit advances by ${shift}, with wrap after 9.`,
        targetApplication: [
          `Once the same shift is confirmed in both examples, apply it to the unseen target ${targetSource}.`,
          ...base.targetApplication,
        ],
      },
    };
  }

  if (taskKind === "CHOOSE_MATCHING_CODE") {
    return {
      ...question,
      explanation: {
        ...base,
        quickMethod: `Derive the +${shift} movement once, produce the complete code for ${targetSource}, and compare that result with the four options.`,
        ruleStatement: `Both examples use the same position-wise +${shift} digit shift. A matching option must satisfy that movement at every position.`,
        targetApplication: [
          ...base.targetApplication,
          `Only the option ${correctAnswer} matches the complete transformed sequence; a partial match is not enough.`,
        ],
      },
    };
  }

  if (taskKind === "DECODE_TARGET") {
    return {
      ...question,
      explanation: {
        ...base,
        targetApplication: [
          `The displayed value ${targetCode} is already coded, so undo +${shift} rather than applying it again.`,
          ...base.targetApplication,
        ],
      },
    };
  }

  return {
    ...question,
    explanation: {
      ...base,
      quickMethod: `Code ${targetSource} completely with +${shift}, then read only position ${missingIndex! + 1}.`,
      ruleStatement: `The examples fix a +${shift} movement for every position. The blank asks for one member of the fully determined target code.`,
      targetApplication: [
        `First reconstruct the complete code ${targetCode}; do not solve the blank in isolation.`,
        ...base.targetApplication,
        `${displayedTargetCode} has only one valid completion under the established rule.`,
      ],
    },
  };
}
