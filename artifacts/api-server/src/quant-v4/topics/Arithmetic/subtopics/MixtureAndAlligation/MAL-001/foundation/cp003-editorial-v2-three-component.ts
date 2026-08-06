import type { MalCp003Wave12UnifiedQuestion } from "./cp003-unified-runtime-wave12-editorial";
import { absolute, add, buildOptions, divide, formatNumber, hash, multiply, parseNumber, quantity, ratioText, subtract, type MisconceptionId } from "./cp003-editorial-v2-core";
import { capacityFromStem, componentNames } from "./cp003-editorial-v2-language";

export function ql034Variant(
  question: MalCp003Wave12UnifiedQuestion,
  seed: string,
): MalCp003Wave12UnifiedQuestion {
  if (question.contractId !== "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER") {
    return question;
  }
  const table = diagramFor(question) as any;
  if (table?.type !== "THREE_COMPONENT_STAGE_TABLE") return question;
  const finalValues = table.rows.at(-1)?.values as string[] | undefined;
  if (!finalValues || finalValues.length !== 3) return question;
  const [a, b, c] = finalValues.map(parseNumber);
  const [aLabel, bLabel, cLabel] = table.columns.slice(1) as string[];
  const process = question.stem.replace(/What are the final quantities.+\?$/iu, "").trim();
  const variant = hash(`${seed}:three-component-variant`) % 5;
  let stem = question.stem;
  let answer = question.answer;
  let candidates: { text: string; misconceptionId: MisconceptionId }[] = [];
  let requestedStep = "";
  let conclusion = question.explanation.conclusion;

  if (variant === 1) {
    stem = `${process} How much ${aLabel} remains at the end?`;
    answer = quantity(a!);
    candidates = [
      { text: quantity(b!), misconceptionId: "component_order_swapped" },
      { text: quantity(c!), misconceptionId: "component_order_swapped" },
      { text: quantity(add(a!, b!)), misconceptionId: "stage_skipped" },
      { text: quantity(add(add(a!, b!), c!)), misconceptionId: "initial_state_reported" },
    ];
    requestedStep = `Final ${aLabel} quantity = ${answer}.`;
    conclusion = `${answer} of ${aLabel} remains.`;
  } else if (variant === 2) {
    stem = `${process} What is the final ratio of ${bLabel}:${cLabel}?`;
    answer = ratioText(b!, c!);
    candidates = [
      { text: ratioText(c!, b!), misconceptionId: "ratio_reversal" },
      { text: ratioText(a!, c!), misconceptionId: "component_order_swapped" },
      { text: ratioText(b!, a!), misconceptionId: "component_order_swapped" },
      { text: ratioText(add(a!, b!), c!), misconceptionId: "stage_skipped" },
    ];
    requestedStep = `Using the final row, ${bLabel}:${cLabel} = ${formatNumber(b!)}:${formatNumber(c!)} = ${answer}.`;
    conclusion = `The final ratio of ${bLabel}:${cLabel} is ${answer}.`;
  } else if (variant === 3) {
    stem = `${process} What is the total quantity of ${bLabel} and ${cLabel} at the end?`;
    answer = quantity(add(b!, c!));
    candidates = [
      { text: quantity(a!), misconceptionId: "initial_state_reported" },
      { text: quantity(b!), misconceptionId: "stage_skipped" },
      { text: quantity(c!), misconceptionId: "stage_skipped" },
      { text: quantity(add(a!, b!)), misconceptionId: "component_order_swapped" },
    ];
    requestedStep = `Total ${bLabel} and ${cLabel} = ${formatNumber(b!)} + ${formatNumber(c!)} = ${answer}.`;
    conclusion = `Their total final quantity is ${answer}.`;
  } else if (variant === 4) {
    stem = `${process} What is the difference between the final quantities of ${aLabel} and ${bLabel}?`;
    answer = quantity(absolute(subtract(a!, b!)));
    candidates = [
      { text: quantity(add(a!, b!)), misconceptionId: "component_order_swapped" },
      { text: quantity(absolute(subtract(a!, c!))), misconceptionId: "component_order_swapped" },
      { text: quantity(absolute(subtract(b!, c!))), misconceptionId: "component_order_swapped" },
      { text: quantity(c!), misconceptionId: "stage_skipped" },
    ];
    requestedStep = `Difference = ${formatNumber(a!)} - ${formatNumber(b!)} = ${answer}.`;
    conclusion = `The required difference is ${answer}.`;
  } else {
    return { ...question, diagram: table };
  }

  const options = buildOptions(answer, candidates, `${seed}:three-component-options`);
  return {
    ...question,
    stem,
    answer,
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    diagram: table,
    sourceContractId: `${question.sourceContractId}:V2-${variant}`,
    mathematicalFingerprint: `${question.mathematicalFingerprint}|three-component-output-${variant}`,
    explanation: {
      ...question.explanation,
      steps: [...question.explanation.steps, requestedStep].slice(-5),
      conclusion,
    },
  };
}

export function diagramFor(question: MalCp003Wave12UnifiedQuestion): unknown {
  if (question.contractId !== "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER") {
    return question.diagram;
  }
  const diagram = question.diagram as any;
  const stages = Array.isArray(diagram?.stages) ? diagram.stages : [];
  const capacity = capacityFromStem(question.stem);
  if (!capacity || stages.length < 2) return question.diagram;
  const firstRemoved = parseNumber(String(stages[0]!.removedQuantity));
  const secondRemoved = parseNumber(String(stages[1]!.removedQuantity));
  const firstA = subtract(capacity, firstRemoved);
  const firstB = firstRemoved;
  const secondRetention = divide(subtract(capacity, secondRemoved), capacity);
  const finalA = multiply(firstA, secondRetention);
  const finalB = multiply(firstB, secondRetention);
  const finalC = secondRemoved;
  const names = componentNames(question.stem);
  const aLabel = question.stem.match(/contains \d+(?:\s+\d+\/\d+)? litres of (.+?)\./iu)?.[1] ?? names.original;
  const bLabel = question.stem.match(/replaced with (.+?)\. Then/iu)?.[1] ?? "liquid B";
  const cLabel = question.stem.match(/replaced with (.+?)\. What/iu)?.[1] ?? "liquid C";
  return {
    type: "THREE_COMPONENT_STAGE_TABLE",
    title: "Liquid quantities after each operation",
    quantityUnit: "litres",
    columns: ["Stage", aLabel, bLabel, cLabel],
    rows: [
      { stage: "Initially", values: [formatNumber(capacity), "0", "0"] },
      { stage: "After first replacement", values: [formatNumber(firstA), formatNumber(firstB), "0"] },
      { stage: "After second removal", values: [formatNumber(finalA), formatNumber(finalB), "0"] },
      { stage: `After adding ${cLabel}`, values: [formatNumber(finalA), formatNumber(finalB), formatNumber(finalC)] },
    ],
    finalTotal: formatNumber(add(add(finalA, finalB), finalC)),
    note: "Every liquid already in the vessel is reduced in the same proportion before the new liquid is added.",
  };
}
