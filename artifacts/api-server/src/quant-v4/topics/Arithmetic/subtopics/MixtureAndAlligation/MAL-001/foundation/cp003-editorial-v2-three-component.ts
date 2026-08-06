import type { MalCp003Wave12UnifiedQuestion } from "./cp003-unified-runtime-wave12-editorial";
import {
  absolute,
  add,
  buildOptions,
  divide,
  formatNumber,
  hash,
  multiply,
  parseNumber,
  quantity,
  ratioText,
  subtract,
  type MisconceptionId,
} from "./cp003-editorial-v2-core";
import {
  capacityFromStem,
  componentNames,
} from "./cp003-editorial-v2-language";

export function ql034Variant(
  question: MalCp003Wave12UnifiedQuestion,
  seed: string,
): MalCp003Wave12UnifiedQuestion {
  if (
    question.contractId !==
    "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER"
  ) {
    return question;
  }
  const table = diagramFor(question) as any;
  if (table?.type !== "THREE_COMPONENT_STAGE_TABLE") return question;
  const finalValues = table.rows.at(-1)?.values as string[] | undefined;
  const firstStageValues = table.rows[1]?.values as string[] | undefined;
  if (
    !finalValues ||
    finalValues.length !== 3 ||
    !firstStageValues ||
    firstStageValues.length !== 3
  ) {
    return question;
  }
  const [a, b, c] = finalValues.map(parseNumber);
  const [firstA, firstB] = firstStageValues.slice(0, 2).map(parseNumber);
  const capacity = add(add(a!, b!), c!);
  const [aLabel, bLabel, cLabel] = table.columns.slice(1) as string[];
  const process = question.stem
    .replace(/What are the final quantities.+\?$/iu, "")
    .trim();
  const variant = hash(`${seed}:three-component-variant`) % 5;
  let stem = question.stem;
  let answer = question.answer;
  let candidates: {
    text: string;
    misconceptionId: MisconceptionId;
  }[] = [];
  let requestedStep = "";
  let conclusion = question.explanation.conclusion;

  if (variant === 1) {
    stem = `${process} How much ${aLabel} remains at the end?`;
    answer = quantity(a!);
    candidates = [
      {
        text: quantity(firstA!),
        misconceptionId: "stage_skipped",
      },
      {
        text: quantity(capacity),
        misconceptionId: "initial_state_reported",
      },
      {
        text: quantity(add(a!, b!)),
        misconceptionId: "ignored_mixture_change",
      },
      {
        text: quantity(c!),
        misconceptionId: "replacement_component_reported",
      },
      {
        text: quantity(b!),
        misconceptionId: "component_order_swapped",
      },
    ];
    requestedStep = `Final ${aLabel} quantity = ${answer}.`;
    conclusion = `${answer} of ${aLabel} remains.`;
  } else if (variant === 2) {
    stem = `${process} What is the final ratio of ${bLabel}:${cLabel}?`;
    answer = ratioText(b!, c!);
    candidates = [
      {
        text: ratioText(c!, b!),
        misconceptionId: "ratio_reversal",
      },
      {
        text: ratioText(add(a!, b!), c!),
        misconceptionId: "stage_skipped",
      },
      {
        text: ratioText(b!, add(a!, c!)),
        misconceptionId: "ignored_mixture_change",
      },
      {
        text: ratioText(capacity, c!),
        misconceptionId: "initial_state_reported",
      },
      {
        text: ratioText(firstA!, firstB!),
        misconceptionId: "component_order_swapped",
      },
    ];
    requestedStep = `Using the final row, ${bLabel}:${cLabel} = ${formatNumber(
      b!,
    )}:${formatNumber(c!)} = ${answer}.`;
    conclusion = `The final ratio of ${bLabel}:${cLabel} is ${answer}.`;
  } else if (variant === 3) {
    stem = `${process} What is the total quantity of ${bLabel} and ${cLabel} at the end?`;
    answer = quantity(add(b!, c!));
    candidates = [
      {
        text: quantity(b!),
        misconceptionId: "stage_skipped",
      },
      {
        text: quantity(capacity),
        misconceptionId: "initial_state_reported",
      },
      {
        text: quantity(absolute(subtract(b!, c!))),
        misconceptionId: "component_order_swapped",
      },
      {
        text: quantity(firstB!),
        misconceptionId: "ignored_mixture_change",
      },
      {
        text: quantity(c!),
        misconceptionId: "replacement_component_reported",
      },
    ];
    requestedStep = `Total ${bLabel} and ${cLabel} = ${formatNumber(
      b!,
    )} + ${formatNumber(c!)} = ${answer}.`;
    conclusion = `Their total final quantity is ${answer}.`;
  } else if (variant === 4) {
    stem = `${process} What is the difference between the final quantities of ${aLabel} and ${bLabel}?`;
    answer = quantity(absolute(subtract(a!, b!)));
    candidates = [
      {
        text: quantity(add(a!, b!)),
        misconceptionId: "component_order_swapped",
      },
      {
        text: quantity(c!),
        misconceptionId: "replacement_component_reported",
      },
      {
        text: quantity(capacity),
        misconceptionId: "initial_state_reported",
      },
      {
        text: quantity(absolute(subtract(firstA!, firstB!))),
        misconceptionId: "stage_skipped",
      },
      {
        text: quantity(absolute(subtract(a!, c!))),
        misconceptionId: "ignored_mixture_change",
      },
    ];
    requestedStep = `Difference = ${formatNumber(a!)} - ${formatNumber(
      b!,
    )} = ${answer}.`;
    conclusion = `The required difference is ${answer}.`;
  } else {
    candidates = [
      {
        text: `${quantity(firstA!)}, ${quantity(firstB!)}, 0 litres`,
        misconceptionId: "stage_skipped",
      },
      {
        text: `${quantity(capacity)}, 0 litres, 0 litres`,
        misconceptionId: "initial_state_reported",
      },
      {
        text: `${quantity(a!)}, 0 litres, ${quantity(c!)}`,
        misconceptionId: "ignored_mixture_change",
      },
      {
        text: `0 litres, ${quantity(b!)}, ${quantity(c!)}`,
        misconceptionId: "component_order_swapped",
      },
      {
        text: `${quantity(a!)}, ${quantity(b!)}, 0 litres`,
        misconceptionId: "replacement_component_reported",
      },
    ];
    requestedStep = `The final row gives ${aLabel} = ${quantity(
      a!,
    )}, ${bLabel} = ${quantity(b!)} and ${cLabel} = ${quantity(c!)}.`;
    conclusion = question.explanation.conclusion;
  }

  const options = buildOptions(
    answer,
    candidates,
    `${seed}:three-component-options`,
  );
  return {
    ...question,
    stem,
    answer,
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    diagram: table,
    sourceContractId: `${question.sourceContractId}:V2-${variant}`,
    mathematicalFingerprint:
      `${question.mathematicalFingerprint}|three-component-output-${variant}`,
    explanation: {
      ...question.explanation,
      steps: [...question.explanation.steps, requestedStep].slice(-5),
      conclusion,
    },
  };
}

export function diagramFor(
  question: MalCp003Wave12UnifiedQuestion,
): unknown {
  if (
    question.contractId !==
    "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER"
  ) {
    return question.diagram;
  }
  const diagram = question.diagram as any;
  const stages = Array.isArray(diagram?.stages) ? diagram.stages : [];
  if (stages.length < 2) return question.diagram;
  const firstRetention = parseNumber(
    String(stages[0]!.retainedFraction),
  );
  const firstOriginalAfter = parseNumber(
    String(stages[0]!.originalQuantityAfterStage),
  );
  const capacity =
    capacityFromStem(question.stem) ??
    divide(firstOriginalAfter, firstRetention);
  const firstRemoved = parseNumber(String(stages[0]!.removedQuantity));
  const secondRemoved = parseNumber(String(stages[1]!.removedQuantity));
  const firstA = subtract(capacity, firstRemoved);
  const firstB = firstRemoved;
  const secondRetention = divide(
    subtract(capacity, secondRemoved),
    capacity,
  );
  const finalA = multiply(firstA, secondRetention);
  const finalB = multiply(firstB, secondRetention);
  const finalC = secondRemoved;
  const names = componentNames(question.stem);
  const aLabel =
    question.stem.match(
      /contains \d+(?:\s+\d+\/\d+)? litres of (.+?)\./iu,
    )?.[1] ?? names.original;
  const bLabel =
    question.stem.match(/replaced with (.+?)\. Then/iu)?.[1] ??
    "liquid B";
  const cLabel =
    question.stem.match(/replaced with (.+?)\. What/iu)?.[1] ??
    "liquid C";
  return {
    type: "THREE_COMPONENT_STAGE_TABLE",
    title: "Liquid quantities after each operation",
    quantityUnit: "litres",
    columns: ["Stage", aLabel, bLabel, cLabel],
    rows: [
      {
        stage: "Initially",
        values: [formatNumber(capacity), "0", "0"],
      },
      {
        stage: "After first replacement",
        values: [formatNumber(firstA), formatNumber(firstB), "0"],
      },
      {
        stage: "After second removal",
        values: [formatNumber(finalA), formatNumber(finalB), "0"],
      },
      {
        stage: `After adding ${cLabel}`,
        values: [
          formatNumber(finalA),
          formatNumber(finalB),
          formatNumber(finalC),
        ],
      },
    ],
    finalTotal: formatNumber(add(add(finalA, finalB), finalC)),
    note:
      "Every liquid already in the vessel is reduced in the same proportion before the new liquid is added.",
  };
}
