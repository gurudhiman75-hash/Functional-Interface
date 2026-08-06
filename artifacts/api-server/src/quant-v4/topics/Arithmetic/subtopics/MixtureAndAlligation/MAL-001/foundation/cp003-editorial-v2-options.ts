import type { MalCp003Wave12UnifiedQuestion } from "./cp003-unified-runtime-wave12-editorial";
import {
  add,
  buildOptions,
  compare,
  divide,
  formatNumber,
  mapMisconception,
  multiply,
  parseNumber,
  power,
  quantity,
  rational,
  subtract,
} from "./cp003-editorial-v2-core";
import {
  capacityFromStem,
  initialOriginalFromStem,
  retainedFractionFrom,
} from "./cp003-editorial-v2-language";

type OptionPackage = {
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: {
    text: string;
    misconceptionId: string;
    isCorrect: boolean;
  }[];
};

function optionCycle(seed: string): number {
  const diversity = seed.match(/diversity-set:(\d+)/u);
  if (diversity) return Number(diversity[1]) % 4;
  const beforeCandidate = seed.match(/:(\d+):candidate-\d+/u);
  if (beforeCandidate) return Number(beforeCandidate[1]) % 4;
  let value = 0;
  for (const character of seed) {
    value = Math.imul(value ^ (character.codePointAt(0) ?? 0), 16777619) >>> 0;
  }
  return value % 4;
}

function cycleOptionConstruction(
  result: OptionPackage,
  seed: string,
): OptionPackage {
  const ordered = result.optionAudit
    .map((audit, index) => ({
      text: result.options[index]!,
      audit: { ...audit, text: result.options[index]! },
    }))
    .sort((left, right) =>
      left.audit.misconceptionId.localeCompare(right.audit.misconceptionId),
    );
  const shift = optionCycle(seed);
  const rotated = [
    ...ordered.slice(shift),
    ...ordered.slice(0, shift),
  ];
  const correctIndex = rotated.findIndex((entry) => entry.audit.isCorrect);
  if (correctIndex < 0) {
    throw new Error(`${seed}: conceptual option cycle lost the correct answer.`);
  }
  return {
    answer: result.answer,
    options: rotated.map((entry) => entry.text),
    correctIndex,
    optionAudit: rotated.map((entry) => entry.audit),
  };
}

export function ql029Options(
  question: MalCp003Wave12UnifiedQuestion,
  seed: string,
) {
  const diagram = question.diagram as any;
  const rows = diagram?.stages as any[];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("QL-029 stage rows are missing.");
  }
  const retention = retainedFractionFrom(question);
  const removed = subtract(rational(1), retention);
  const operationCount = rows.length;

  if (question.representationVariant === "FINAL_ORIGINAL_FRACTION") {
    return buildOptions(
      question.answer,
      [
        {
          text: formatNumber(power(retention, Math.max(1, operationCount - 1))),
          misconceptionId: "one_stage_short",
        },
        {
          text: formatNumber(power(retention, operationCount + 1)),
          misconceptionId: "one_stage_extra",
        },
        {
          text: formatNumber(power(removed, operationCount)),
          misconceptionId: "removed_fraction_error",
        },
        {
          text: formatNumber(
            compare(
              rational(1),
              multiply(removed, rational(operationCount)),
            ) > 0
              ? subtract(
                  rational(1),
                  multiply(removed, rational(operationCount)),
                )
              : removed,
          ),
          misconceptionId: "linear_subtraction_error",
        },
      ],
      seed,
    );
  }

  const finalOriginal = parseNumber(
    String(rows.at(-1)!.originalQuantityAfterStage),
  );
  const previousOriginal =
    operationCount === 1
      ? capacityFromStem(question.stem) ?? divide(finalOriginal, retention)
      : parseNumber(String(rows.at(-2)!.originalQuantityAfterStage));
  const nextOriginal = multiply(finalOriginal, retention);
  const capacity =
    capacityFromStem(question.stem) ??
    divide(parseNumber(String(rows[0]!.removedQuantity)), removed);
  const refillFinal = subtract(capacity, finalOriginal);
  const refillPrevious = subtract(capacity, previousOriginal);
  const refillNext = subtract(capacity, nextOriginal);
  const removedPerStage = parseNumber(String(rows[0]!.removedQuantity));

  if (question.representationVariant === "FINAL_REFILL_QUANTITY") {
    return buildOptions(
      question.answer,
      [
        {
          text: quantity(refillPrevious),
          misconceptionId: "one_stage_short",
        },
        {
          text: quantity(refillNext),
          misconceptionId: "one_stage_extra",
        },
        {
          text: quantity(finalOriginal),
          misconceptionId: "replacement_component_reported",
        },
        {
          text: quantity(
            multiply(removedPerStage, rational(operationCount)),
          ),
          misconceptionId: "ignored_mixture_change",
        },
      ],
      seed,
    );
  }

  const linear = subtract(
    capacity,
    multiply(removedPerStage, rational(operationCount)),
  );
  return buildOptions(
    question.answer,
    [
      {
        text: quantity(previousOriginal),
        misconceptionId: "one_stage_short",
      },
      {
        text: quantity(nextOriginal),
        misconceptionId: "one_stage_extra",
      },
      {
        text: quantity(refillFinal),
        misconceptionId: "replacement_component_reported",
      },
      {
        text: quantity(
          compare(linear, rational(0)) > 0 ? linear : removedPerStage,
        ),
        misconceptionId: "linear_subtraction_error",
      },
    ],
    seed,
  );
}

export function ql030Options(
  question: MalCp003Wave12UnifiedQuestion,
  seed: string,
) {
  const diagram = question.diagram as any;
  const rows = diagram?.stages as any[];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("QL-030 stage rows are missing.");
  }
  const capacity = capacityFromStem(question.stem);
  if (!capacity) throw new Error("QL-030 capacity is missing.");
  const initial = parseNumber(question.answer);
  const final = parseNumber(
    String(rows.at(-1)!.originalQuantityAfterStage),
  );
  const retention = retainedFractionFrom(question);
  const totalRetention = power(retention, rows.length);
  const removed = parseNumber(String(rows[0]!.removedQuantity));
  return buildOptions(
    question.answer,
    [
      {
        text: quantity(subtract(capacity, initial)),
        misconceptionId: "initial_component_complement",
      },
      {
        text: quantity(divide(final, retention)),
        misconceptionId: "one_stage_short",
      },
      {
        text: quantity(multiply(final, totalRetention)),
        misconceptionId: "applied_retention_forward",
      },
      {
        text: quantity(removed),
        misconceptionId: "total_removed_reported",
      },
    ],
    seed,
  );
}

export function ql033Options(
  question: MalCp003Wave12UnifiedQuestion,
  seed: string,
) {
  const diagram = question.diagram as any;
  const rows = diagram?.stages as any[];
  if (!Array.isArray(rows) || rows.length < 2) {
    throw new Error("QL-033 stage rows are incomplete.");
  }
  const capacity = capacityFromStem(question.stem);
  const initial = initialOriginalFromStem(question.stem);
  if (!capacity || !initial) {
    throw new Error("QL-033 initial state is missing.");
  }
  const fractions = rows.map((row) =>
    parseNumber(String(row.retainedFraction)),
  );
  const removed = rows.map((row) =>
    parseNumber(String(row.removedQuantity)),
  );
  const skipLast = fractions
    .slice(0, -1)
    .reduce((current, value) => multiply(current, value), initial);
  const firstRepeated = multiply(
    initial,
    power(fractions[0]!, fractions.length),
  );
  const averageRemoved = divide(
    removed.reduce((current, value) => add(current, value), rational(0)),
    rational(removed.length),
  );
  const averageRetention = subtract(
    rational(1),
    divide(averageRemoved, capacity),
  );
  const averageAnswer = multiply(
    initial,
    power(averageRetention, fractions.length),
  );
  const linear = subtract(
    initial,
    removed.reduce((current, value) => add(current, value), rational(0)),
  );
  return buildOptions(
    question.answer,
    [
      {
        text: quantity(skipLast),
        misconceptionId: "stage_skipped",
      },
      {
        text: quantity(firstRepeated),
        misconceptionId: "ignored_mixture_change",
      },
      {
        text: quantity(averageAnswer),
        misconceptionId: "average_loss_divided_by_rounds",
      },
      {
        text: quantity(
          compare(linear, rational(0)) > 0
            ? linear
            : subtract(capacity, parseNumber(question.answer)),
        ),
        misconceptionId: "linear_subtraction_error",
      },
    ],
    seed,
  );
}

export function conceptualOptions(
  question: MalCp003Wave12UnifiedQuestion,
  seed: string,
): OptionPackage {
  let result: OptionPackage;
  switch (question.contractId) {
    case "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE":
      result = ql029Options(question, seed);
      break;
    case "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL":
      result = ql030Options(question, seed);
      break;
    case "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL":
      result = ql033Options(question, seed);
      break;
    default: {
      if (
        question.optionAudit.some(
          (option) => option.misconceptionId === "ARITHMETIC_SLIP",
        )
      ) {
        throw new Error(
          "Generic arithmetic distractor reached the V2 remediation layer.",
        );
      }
      const mapped = question.optionAudit.map((option) => ({
        text: option.text,
        misconceptionId: mapMisconception(option.misconceptionId),
        isCorrect: option.isCorrect,
      }));
      if (
        new Set(mapped.map((option) => option.misconceptionId)).size !== 4
      ) {
        throw new Error("Distractor authorities are not distinct.");
      }
      result = {
        answer: question.answer,
        options: [...question.options],
        correctIndex: question.correctIndex,
        optionAudit: mapped,
      };
      break;
    }
  }
  return cycleOptionConstruction(result, seed);
}
