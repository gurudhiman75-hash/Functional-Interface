import type { GeneratedUniformDigitPrototypeQuestion } from "./uniform-digit-types";

export function applyUniformDigitTaskTeachingPath(
  question: GeneratedUniformDigitPrototypeQuestion,
): GeneratedUniformDigitPrototypeQuestion {
  const { taskKind, targetSource, targetCode, missingIndex, displayedTargetCode } = question.structuredPrompt;
  const { shift, correctAnswer } = question.metadata;
  const base = question.explanation;
  const style = question.seed % 4;

  if (taskKind === "ENCODE_TARGET") {
    const quickMethods = [
      `The movement is already stated: apply +${shift} separately to every target digit and keep the positions unchanged.`,
      `Use the supplied +${shift} rule directly; translate the target from left to right without inferring a new pattern.`,
      `Since the question gives the rule, code each position with +${shift} and preserve any leading zero in the result.`,
      `Follow the stated decimal movement of ${shift} at every position; no comparison between answer options is needed first.`,
    ];
    const ruleStatements = [
      `The given rule directly moves each digit forward by ${shift} on the decimal cycle; the examples only confirm how wrapping works.`,
      `This is an application question: +${shift} is supplied, and every digit is changed independently while its position stays fixed.`,
      `The question states the complete code rule—advance each digit by ${shift}, returning to 0 after 9.`,
      `No hidden pattern has to be discovered here; the displayed method is a position-wise forward shift of ${shift}.`,
    ];
    return {
      ...question,
      explanation: {
        ...base,
        quickMethod: quickMethods[style]!,
        ruleStatement: ruleStatements[style]!,
        targetApplication: [
          ...base.targetApplication,
          `Because the rule is supplied in the question, no alternative pattern needs to be inferred before coding ${targetSource}.`,
        ],
      },
    };
  }

  if (taskKind === "INFER_AND_ENCODE") {
    const quickMethods = [
      `Compare matching positions in both examples, identify the common +${shift} movement, and then apply it to ${targetSource}.`,
      `Find the difference in one column, verify the same +${shift} change in the second example, and code the target.`,
      `Use both examples to rule out whole-number arithmetic; the surviving rule is +${shift} at each position.`,
      `Infer the repeated column-wise movement first, then translate ${targetSource} without changing its digit order.`,
    ];
    const ruleStatements = [
      `The rule is not stated, so compare corresponding columns in both examples: every source digit advances by ${shift}, with wrap after 9.`,
      `Both example pairs reveal the same hidden operation—each digit moves forward by ${shift} independently.`,
      `The evidence supports one simple rule: a uniform +${shift} decimal shift, not an addition applied to the complete number.`,
      `Matching the digits position by position shows a constant forward movement of ${shift} across both examples.`,
    ];
    return {
      ...question,
      explanation: {
        ...base,
        quickMethod: quickMethods[style]!,
        ruleStatement: ruleStatements[style]!,
        targetApplication: [
          `Once the same shift is confirmed in both examples, apply it to the unseen target ${targetSource}.`,
          ...base.targetApplication,
        ],
      },
    };
  }

  if (taskKind === "CHOOSE_MATCHING_CODE") {
    const quickMethods = [
      `Derive the +${shift} movement once, produce the complete code for ${targetSource}, and compare that result with the four options.`,
      `Do not test the options digit by digit at random; first calculate the full +${shift} code, then locate it.`,
      `Infer +${shift}, write the target code in full, and reject every option that differs at even one position.`,
      `Build the correct sequence before looking for a match; the valid option must satisfy all target positions.`,
    ];
    const ruleStatements = [
      `Both examples use the same position-wise +${shift} digit shift. A matching option must satisfy that movement at every position.`,
      `The common code advances each digit by ${shift}; therefore an option is correct only when its entire sequence follows the rule.`,
      `The examples establish a uniform +${shift} translation with fixed positions, which can be used to calculate the one matching option.`,
      `Every source digit has the code digit ${shift} places ahead, so partial agreement cannot make an option correct.`,
    ];
    return {
      ...question,
      explanation: {
        ...base,
        quickMethod: quickMethods[style]!,
        ruleStatement: ruleStatements[style]!,
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

  const quickMethods = [
    `Code ${targetSource} completely with +${shift}, then read only position ${missingIndex! + 1}.`,
    `Reconstruct the whole target code first; the digit at the blank's position is then fixed.`,
    `Apply +${shift} at every target position and use the completed sequence to fill the question mark.`,
    `Do not guess from neighbouring digits—calculate the full code and take the member aligned with the blank.`,
  ];
  const ruleStatements = [
    `The examples fix a +${shift} movement for every position. The blank asks for one member of the fully determined target code.`,
    `Each position follows the same +${shift} rule, so the incomplete display can be completed from the target's full code.`,
    `The missing digit is not a new rule: it is the code member produced at one specified position by the established shift.`,
    `Once the uniform movement of ${shift} is known, every target code digit—including the hidden one—is uniquely determined.`,
  ];
  return {
    ...question,
    explanation: {
      ...base,
      quickMethod: quickMethods[style]!,
      ruleStatement: ruleStatements[style]!,
      targetApplication: [
        `First reconstruct the complete code ${targetCode}; do not solve the blank in isolation.`,
        ...base.targetApplication,
        `${displayedTargetCode} has only one valid completion under the established rule.`,
      ],
    },
  };
}
