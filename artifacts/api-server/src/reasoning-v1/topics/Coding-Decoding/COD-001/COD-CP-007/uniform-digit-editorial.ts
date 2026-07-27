import { digitTranslationTrace } from "./uniform-digit-rule";
import type { GeneratedUniformDigitPrototypeQuestion } from "./uniform-digit-types";

function movementLabel(shift: number): string {
  return `${shift} place${shift === 1 ? "" : "s"}`;
}

function trapReason(errorLabel: string | undefined, value: string): string {
  switch (errorLabel) {
    case "WRONG_SHIFT_DIRECTION":
      return `${value} moves the digits in the opposite direction.`;
    case "OFF_BY_ONE_SHIFT":
      return `${value} changes every digit by one place too many.`;
    case "REVERSED_CODE":
      return `${value} reverses the correct code, although the examples keep all positions fixed.`;
    case "RULE_NOT_APPLIED":
      return `${value} leaves the target unchanged instead of applying the code.`;
    case "ONE_POSITION_OFF_BY_ONE":
    case "FIRST_DIGIT_OFF_BY_ONE":
      return `${value} changes one position by an extra step.`;
    case "ENCODED_INSTEAD_OF_DECODED":
      return `${value} applies the forward rule again instead of undoing it.`;
    case "WRONG_INVERSE_SHIFT":
      return `${value} moves backward by the wrong number of places.`;
    case "REVERSED_DECODE":
      return `${value} reverses the decoded digits, but no reversal appears in the examples.`;
    case "NEXT_DIGIT":
      return `${value} is one digit above the required value.`;
    case "PREVIOUS_DIGIT":
      return `${value} is one digit below the required value.`;
    case "OPPOSITE_DIGIT":
      return `${value} is chosen by distance on the number cycle rather than by the coding rule.`;
    default:
      return `${value} changes a digit without following the movement shown in both examples.`;
  }
}

export function applyUniformDigitEditorialVariation(
  question: GeneratedUniformDigitPrototypeQuestion,
): GeneratedUniformDigitPrototypeQuestion {
  const { structuredPrompt: prompt, metadata } = question;
  const shift = metadata.shift;
  const inverse = prompt.taskKind === "DECODE_TARGET";
  const missing = prompt.taskKind === "RECOVER_MISSING_TOKEN";
  const style = question.seed % 4;
  const first = prompt.evidence[0]!;
  const second = prompt.evidence[1]!;
  const firstTrace = digitTranslationTrace(first.source, shift).join(", ");
  const targetTrace = inverse
    ? digitTranslationTrace(prompt.targetCode, -shift).join(", ")
    : digitTranslationTrace(prompt.targetSource, shift).join(", ");
  const shiftText = movementLabel(shift);
  const trap = question.options.find((option) => !option.isCorrect)!;
  const correct = metadata.correctAnswer;

  const referenceAids = [
    [
      "Read the code one digit at a time; the complete string is not treated as a number.",
      "The decimal cycle continues from 9 to 0, and from 0 to 9 when moving backward.",
    ],
    [
      "Keep the positions fixed and compare each source digit with the digit directly below it.",
      "A zero at the beginning is a real code digit and must not be removed.",
    ],
    [
      "Work column by column. No carrying or borrowing passes from one position to another.",
      "Use the ten-digit cycle 0–9 whenever the movement crosses an end.",
    ],
    [
      "Separate-digit coding preserves the length and order of the original string.",
      "For decoding, reverse the movement rather than testing whole-number arithmetic.",
    ],
  ] as const;

  const forwardRules = [
    `Each digit keeps its position and moves ${shiftText} forward on the 0–9 cycle.`,
    `The common rule is a digit-wise forward movement of ${shiftText}; the digits are not added as one number.`,
    `Comparing the columns shows the same change everywhere: add ${shift} to each digit separately and wrap after 9.`,
    `The code preserves order and replaces every digit by the digit ${shiftText} ahead of it.`,
  ];
  const inverseRules = [
    `The examples encode by moving every digit ${shiftText} forward; decoding therefore moves each coded digit ${shiftText} backward.`,
    `First identify the forward change of +${shift}. To recover the original string, undo that change at every position.`,
    `Every column uses the same decimal shift. The inverse code subtracts ${shift} separately, wrapping below 0 when needed.`,
    `Since the forward code advances each digit by ${shift}, the original is found by the opposite movement of ${shiftText}.`,
  ];
  const quickMethods = inverse
    ? [
      `Move each coded digit ${shiftText} backward; keep the order unchanged.`,
      `Undo +${shift} as −${shift} in every column, using decimal wrap.`,
      `Decode from left to right by subtracting ${shift} independently from each digit.`,
      `Reverse the shift, not the digit order: move every code digit back by ${shift}.`,
    ]
    : [
      `Move each target digit ${shiftText} forward and write the results in the same order.`,
      `Apply +${shift} separately in every column; after 9, restart at 0.`,
      `Translate left to right with the same ${shiftText} movement at each position.`,
      `Keep the positions fixed and replace each digit by its +${shift} partner on the decimal cycle.`,
    ];

  const secondEvidenceLines = [
    `${second.source} → ${second.code} repeats the same change at every position.`,
    `Checking ${second.source} → ${second.code} rules out a one-off or whole-number calculation.`,
    `The pair ${second.source} → ${second.code} confirms both the direction and size of the shift.`,
    `${second.source} is coded as ${second.code}, so the same column-wise rule works on a different length too.`,
  ];

  const targetApplications = missing
    ? [
      `${prompt.targetSource} gives ${prompt.targetCode}: ${targetTrace}.`,
      `At position ${prompt.missingIndex! + 1}, the code digit is ${correct}; hence ${prompt.displayedTargetCode} becomes ${prompt.targetCode}.`,
    ]
    : inverse
      ? [
        `Undoing the shift in ${prompt.targetCode} gives ${targetTrace}.`,
        `Reading those recovered digits in their original positions gives ${correct}.`,
      ]
      : [
        `${prompt.targetSource} changes as follows: ${targetTrace}.`,
        `Keeping the results in order produces ${correct}.`,
      ];

  const conclusions = missing
    ? [
      `Thus, the blank must contain ${correct}.`,
      `Therefore, ${correct} is the missing code digit.`,
      `So the required digit is ${correct}.`,
      `Hence, replace the question mark with ${correct}.`,
    ]
    : [
      `Thus, the required answer is ${correct}.`,
      `Therefore, the matching option is ${correct}.`,
      `So the code gives ${correct}.`,
      `Hence, ${correct} is correct.`,
    ];

  return {
    ...question,
    stem: question.stem.replace(/\b1 places\b/gu, "1 place"),
    explanation: {
      referenceAid: referenceAids[style],
      quickMethod: quickMethods[style]!,
      ruleStatement: (inverse ? inverseRules : forwardRules)[style]!,
      sourceDemonstration: [
        `${first.source} → ${first.code}: ${firstTrace}.`,
        secondEvidenceLines[style]!,
      ],
      targetApplication: targetApplications,
      conclusion: conclusions[style]!,
      commonTrapAlert: trapReason(trap.errorLabel, trap.value),
    },
  };
}
