import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  runMalCp002EnglishReleasePipeline,
  serializeMalCp002RatioVisual,
  type MalCp002PermanentQlId,
  type MalCp002RatioVisual,
  type MalCp002ReleasedQuestion,
} from "./cp002-permanent-runtime";
import type { MalReasoningGraph, Rational } from "./types";

export const MAL_CP002_EDITORIAL_V2 = Object.freeze({
  presentationRevisionId: "MAL-CP002-EN-NATURAL-MATHJAX-V2",
  editorialAuthority: "MAL-CP002-EN-CONSERVED-RATIO-PART-V2",
  methodName: "Conserved Ratio Part Method",
  approvedLanguage: "en" as const,
  alligationAllowed: false,
  syntheticRoleOpeningsAllowed: false,
  learnerJargonAllowed: false,
  mathJaxArithmeticRequired: true,
});

type JsonRecord = Record<string, unknown>;

type EditorialCopy = {
  stem: string;
  coreConcept: string;
  formula: string;
  steps: string[];
  verification: string;
  conclusion: string;
  examShortcut: string;
  commonTrap: string;
  visual: MalCp002RatioVisual;
};

export type MalCp002EditorialV2Question = MalCp002ReleasedQuestion & {
  presentationRevisionId: typeof MAL_CP002_EDITORIAL_V2.presentationRevisionId;
  editorialAuthority: typeof MAL_CP002_EDITORIAL_V2.editorialAuthority;
  explanation: MalCp002ReleasedQuestion["explanation"] & {
    editorialRevisionId: typeof MAL_CP002_EDITORIAL_V2.presentationRevisionId;
    methodName: typeof MAL_CP002_EDITORIAL_V2.methodName;
  };
  traceability: MalCp002ReleasedQuestion["traceability"] & {
    presentationRevisionId: typeof MAL_CP002_EDITORIAL_V2.presentationRevisionId;
    editorialAuthority: typeof MAL_CP002_EDITORIAL_V2.editorialAuthority;
  };
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

function asRecord(value: unknown): JsonRecord {
  return isRecord(value) ? value : {};
}

function isRational(value: unknown): value is Rational {
  if (!isRecord(value)) return false;
  return (
    (typeof value.numerator === "bigint" || typeof value.numerator === "string" || typeof value.numerator === "number") &&
    (typeof value.denominator === "bigint" || typeof value.denominator === "string" || typeof value.denominator === "number")
  );
}

function toRational(value: unknown, fallback = rational(0)): Rational {
  if (!isRational(value)) return fallback;
  return rational(Number(value.numerator), Number(value.denominator));
}

function requestOf(question: MalCp002ReleasedQuestion): JsonRecord {
  return asRecord(asRecord(question.parameters).request);
}

function solutionOf(question: MalCp002ReleasedQuestion): JsonRecord {
  return asRecord(question.solution);
}

function parameterRational(
  question: MalCp002ReleasedQuestion,
  key: string,
  fallback = rational(0),
): Rational {
  return toRational(asRecord(question.parameters)[key], fallback);
}

function requestRational(
  question: MalCp002ReleasedQuestion,
  key: string,
  fallback = rational(0),
): Rational {
  return toRational(requestOf(question)[key], fallback);
}

function solutionRational(
  question: MalCp002ReleasedQuestion,
  key: string,
  fallback = rational(0),
): Rational {
  return toRational(solutionOf(question)[key], fallback);
}

function rationalState(value: unknown): { componentA: Rational; componentB: Rational } {
  const record = asRecord(value);
  return {
    componentA: toRational(record.componentA),
    componentB: toRational(record.componentB),
  };
}

function ratioParts(value: unknown): [Rational, Rational] {
  const record = asRecord(value);
  return [
    toRational(record.componentAPart, rational(1)),
    toRational(record.componentBPart, rational(1)),
  ];
}

function stripUnit(value: string, unit: string): string {
  return value
    .replace(new RegExp(`\\s*${unit.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\s*$`, "iu"), "")
    .replace(/\s*ratio parts?\s*$/iu, "")
    .trim();
}

function latexNumber(rawValue: string): string {
  const value = rawValue.trim().replace(/−/gu, "-");
  const mixed = value.match(/^(-?\d+)\s+(\d+)\/(\d+)$/u);
  if (mixed) {
    return `${mixed[1]}\\frac{${mixed[2]}}{${mixed[3]}}`;
  }
  const fraction = value.match(/^(-?\d+)\/(\d+)$/u);
  if (fraction) {
    return `\\frac{${fraction[1]}}{${fraction[2]}}`;
  }
  return value;
}

function rationalLatex(value: Rational): string {
  return latexNumber(formatRational(value));
}

function mathNumber(value: string | Rational): string {
  const rendered = typeof value === "string" ? latexNumber(value) : rationalLatex(value);
  return `$${rendered}$`;
}

function mathQuantity(
  value: string | Rational,
  unit: string,
  bold = false,
): string {
  const raw = typeof value === "string" ? stripUnit(value, unit) : formatRational(value);
  const body = `${latexNumber(raw)}\\,\\text{${unit}}`;
  return bold ? `$\\mathbf{${body}}$` : `$${body}$`;
}

function mathRatio(value: string | readonly Rational[]): string {
  const parts =
    typeof value === "string"
      ? value.split(":").map((part) => latexNumber(part.trim()))
      : value.map((part) => rationalLatex(part));
  return `$${parts.join(" : ")}$`;
}

function ratioRaw(value: string | readonly Rational[]): string {
  if (typeof value === "string") return value.trim();
  return value.map((part) => formatRational(part)).join(" : ");
}

function equation(value: string): string {
  return `$${value}$`;
}

function boldEquation(value: string): string {
  return `$\\mathbf{${value}}$`;
}

function capitalize(value: string): string {
  return value.length === 0 ? value : `${value[0]!.toUpperCase()}${value.slice(1)}`;
}

function unitQuestion(unit: string, label: string): string {
  return unit === "kg" ? `How many kilograms of ${label}` : `How many litres of ${label}`;
}

function seedHash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function pickStem(seed: string, stems: readonly string[]): string {
  return stems[seedHash(`${seed}:editorial-v2-stem`) % stems.length]!;
}

function normalizeVisual(
  question: MalCp002ReleasedQuestion,
  operation: string,
  note: string,
): MalCp002RatioVisual {
  const unit = question.diagram.quantityUnit;
  return {
    ...question.diagram,
    before: question.diagram.before.map((item) => ({
      ...item,
      quantity: stripUnit(item.quantity, unit),
    })),
    operation: operation.replace(/\bpure\s+/giu, ""),
    after: question.diagram.after.map((item) => ({
      ...item,
      quantity: stripUnit(item.quantity, unit),
    })),
    note,
  };
}

function changedIndex(question: MalCp002ReleasedQuestion): 0 | 1 {
  const unit = question.diagram.quantityUnit;
  const firstChanged =
    stripUnit(question.diagram.before[0]!.quantity, unit) !==
    stripUnit(question.diagram.after[0]!.quantity, unit);
  return firstChanged ? 0 : 1;
}

function formatAnswerText(value: string): string {
  let output = value.replace(/\bpure\s+/giu, "");
  output = output.replace(
    /(-?\d+(?:\s+\d+\/\d+|\/\d+)?)(\s*)(kg|litres)\b/giu,
    (_match, number: string, _space: string, unit: string) =>
      mathQuantity(number, unit.toLowerCase()),
  );
  output = output.replace(
    /(?<![\d$])(-?\d+(?:\s+\d+\/\d+|\/\d+)?\s*:\s*-?\d+(?:\s+\d+\/\d+|\/\d+)?(?:\s*:\s*-?\d+(?:\s+\d+\/\d+|\/\d+)?)?)(?![\d$])/gu,
    (match) => mathRatio(match),
  );
  return output;
}

function buildGraph(copy: EditorialCopy): MalReasoningGraph {
  const nodes: MalReasoningGraph["nodes"] = [
    {
      id: "given",
      kind: "GIVEN",
      text: copy.stem,
      dependsOn: [],
    },
    {
      id: "relation",
      kind: "RELATION",
      text: copy.coreConcept,
      dependsOn: ["given"],
    },
  ];
  copy.steps.forEach((text, index) => {
    nodes.push({
      id: `step-${index + 1}`,
      kind: "DERIVATION",
      text,
      dependsOn: [index === 0 ? "relation" : `step-${index}`],
    });
  });
  nodes.push({
    id: "verification",
    kind: "VERIFICATION",
    text: copy.verification,
    dependsOn: [`step-${copy.steps.length}`],
  });
  nodes.push({
    id: "conclusion",
    kind: "CONCLUSION",
    text: copy.conclusion,
    dependsOn: ["verification"],
  });
  return { nodes };
}

function explanationLines(
  question: MalCp002ReleasedQuestion,
  copy: EditorialCopy,
): string[] {
  return [
    question.explanation.sectionTitles.coreConcept,
    copy.coreConcept,
    `Formula: ${copy.formula}`,
    question.explanation.sectionTitles.steps,
    ...copy.steps,
    `Quick check: ${copy.verification}`,
    `Final answer: ${copy.conclusion}`,
    question.explanation.sectionTitles.shortcut,
    serializeMalCp002RatioVisual(copy.visual),
    copy.examShortcut,
    question.explanation.sectionTitles.trap,
    copy.commonTrap.replace(/^Common trap:\s*/iu, ""),
  ];
}

function explicitTargetCopy(
  question: MalCp002ReleasedQuestion,
  action: "added" | "removed",
): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const before = question.diagram.before;
  const after = question.diagram.after;
  const index = changedIndex(question);
  const otherIndex = index === 0 ? 1 : 0;
  const changed = before[index]!;
  const other = before[otherIndex]!;
  const targetParts = question.diagram.targetRatio!.split(":").map((part) => part.trim());
  const changedPart = targetParts[index]!;
  const otherPart = targetParts[otherIndex]!;
  const initialChanged = stripUnit(changed.quantity, unit);
  const otherQuantity = stripUnit(other.quantity, unit);
  const requiredChanged = stripUnit(after[index]!.quantity, unit);
  const amount = stripUnit(question.answer, unit);
  const partWord = otherPart === "1" ? "part" : "parts";
  const actionVerb = action === "added" ? "add" : "remove";
  const differenceEquation =
    action === "added"
      ? `${latexNumber(requiredChanged)}-${latexNumber(initialChanged)}=${latexNumber(amount)}`
      : `${latexNumber(initialChanged)}-${latexNumber(requiredChanged)}=${latexNumber(amount)}`;
  const stem = pickStem(question.seed, [
    `A vessel contains ${mathQuantity(changed.quantity, unit)} of ${changed.label} and ${mathQuantity(other.quantity, unit)} of ${other.label}. ${unitQuestion(unit, changed.label)} should be ${action} so that the ratio of ${question.diagram.before[0]!.label} to ${question.diagram.before[1]!.label} becomes ${mathRatio(question.diagram.targetRatio!)}?`,
    `A mixture contains ${mathQuantity(before[0]!.quantity, unit)} of ${before[0]!.label} and ${mathQuantity(before[1]!.quantity, unit)} of ${before[1]!.label}. Find the quantity of ${changed.label} to be ${action} to obtain the ratio ${mathRatio(question.diagram.targetRatio!)}.`,
    `In a two-item mixture, the quantities of ${before[0]!.label} and ${before[1]!.label} are ${mathQuantity(before[0]!.quantity, unit)} and ${mathQuantity(before[1]!.quantity, unit)} respectively. What quantity of ${changed.label} must be ${action} to make their ratio ${mathRatio(question.diagram.targetRatio!)}?`,
  ]);
  const coreConcept = `Since only ${changed.label} is ${action}, the quantity of ${other.label} remains constant at ${mathQuantity(otherQuantity, unit)}. Use this constant quantity to find the value of one part in the target ratio.`;
  const formula = `If ${other.label} represents ${mathNumber(otherPart)} ${partWord}, then one part is ${equation(`\\dfrac{${latexNumber(otherQuantity)}}{${latexNumber(otherPart)}}`)}. The required quantity of ${changed.label} is then ${equation(`${latexNumber(changedPart)}\\times\\text{one part}`)}.`;
  const steps = [
    `Step 1: In the target ratio ${mathRatio(question.diagram.targetRatio!)}, ${other.label} represents ${mathNumber(otherPart)} ${partWord}.`,
    `Step 2: The quantity of ${other.label} does not change, so ${equation(`\\text{one part}=\\dfrac{${latexNumber(otherQuantity)}}{${latexNumber(otherPart)}}=${latexNumber(String(Number(otherQuantity) / Number(otherPart)))}`)} ${unit}.`,
    `Step 3: Therefore, the required quantity of ${changed.label} is ${equation(`${latexNumber(changedPart)}\\times${latexNumber(String(Number(otherQuantity) / Number(otherPart)))}=${latexNumber(requiredChanged)}`)} ${unit}.`,
    `Step 4: The quantity to ${actionVerb} is ${equation(differenceEquation)} ${unit}.`,
    `Step 5: Hence, the required change is ${mathQuantity(amount, unit, true)}.`,
  ];
  const verification = `After the change, the quantities are ${mathQuantity(after[0]!.quantity, unit)} and ${mathQuantity(after[1]!.quantity, unit)}; their ratio is ${mathRatio(question.diagram.afterRatio)}, which matches the target.`;
  const conclusion = `${capitalize(actionVerb)} ${mathQuantity(amount, unit, true)} of ${changed.label}.`;
  const examShortcut = `${other.label} stays at ${mathQuantity(otherQuantity, unit)}. Match it with its ${mathNumber(otherPart)} target ${partWord}, find one part, and then calculate the required quantity of ${changed.label}.`;
  const commonTrap = `Do not apply the target ratio to the original total. Adding or removing ${changed.label} changes the total quantity, while ${other.label} remains the same.`;
  const visual = normalizeVisual(
    question,
    `${capitalize(actionVerb)} ${amount} ${unit} of ${changed.label}`,
    `${capitalize(other.label)} remains at ${otherQuantity} ${unit}.`,
  );
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function forwardPureChangeCopy(
  question: MalCp002ReleasedQuestion,
  action: "added" | "removed",
): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const index = changedIndex(question);
  const otherIndex = index === 0 ? 1 : 0;
  const before = question.diagram.before;
  const after = question.diagram.after;
  const changed = before[index]!;
  const other = before[otherIndex]!;
  const initial = stripUnit(changed.quantity, unit);
  const final = stripUnit(after[index]!.quantity, unit);
  const amount = formatRational(requestRational(question, "adjustmentQuantity", rational(Math.abs(Number(final) - Number(initial)))));
  const sign = action === "added" ? "+" : "-";
  const stem = pickStem(question.seed, [
    `A mixture contains ${mathQuantity(before[0]!.quantity, unit)} of ${before[0]!.label} and ${mathQuantity(before[1]!.quantity, unit)} of ${before[1]!.label}. If ${mathQuantity(amount, unit)} of ${changed.label} is ${action}, find the new ratio of ${before[0]!.label} to ${before[1]!.label}.`,
    `In a two-item mixture, ${before[0]!.label} and ${before[1]!.label} are present in quantities ${mathQuantity(before[0]!.quantity, unit)} and ${mathQuantity(before[1]!.quantity, unit)}. After ${action === "added" ? "adding" : "removing"} ${mathQuantity(amount, unit)} of ${changed.label}, what is the new ratio?`,
    `A container holds ${mathQuantity(before[0]!.quantity, unit)} of ${before[0]!.label} and ${mathQuantity(before[1]!.quantity, unit)} of ${before[1]!.label}. Find their resulting ratio when ${mathQuantity(amount, unit)} of ${changed.label} is ${action}.`,
  ]);
  const coreConcept = `Only ${changed.label} changes. The quantity of ${other.label} remains ${mathQuantity(other.quantity, unit)}, so update ${changed.label} first and then reduce the two final quantities to their simplest ratio.`;
  const formula = `${capitalize(changed.label)} after the change ${equation(`=${latexNumber(initial)}${sign}${latexNumber(amount)}`)}; final ratio ${equation(`=${question.diagram.before[0]!.label.replace(/\s+/gu, "\\,")}:${question.diagram.before[1]!.label.replace(/\s+/gu, "\\,")}`)} using the final quantities.`;
  const steps = [
    `Step 1: Initial ${changed.label} ${equation(`=${latexNumber(initial)}`)} ${unit}.`,
    `Step 2: New ${changed.label} ${equation(`=${latexNumber(initial)}${sign}${latexNumber(amount)}=${latexNumber(final)}`)} ${unit}.`,
    `Step 3: ${capitalize(other.label)} is not involved in the operation, so it remains ${mathQuantity(other.quantity, unit)}.`,
    `Step 4: The final ratio is ${equation(`${latexNumber(stripUnit(after[0]!.quantity, unit))}:${latexNumber(stripUnit(after[1]!.quantity, unit))}`)} ${equation(`=${question.diagram.afterRatio.split(":").map((part) => latexNumber(part.trim())).join(":")}`)}.`,
  ];
  const verification = `The final quantities shown in the vessel are ${mathQuantity(after[0]!.quantity, unit)} and ${mathQuantity(after[1]!.quantity, unit)}, and they reduce to ${mathRatio(question.diagram.afterRatio)}.`;
  const conclusion = `The resulting ratio is ${boldEquation(question.diagram.afterRatio.split(":").map((part) => latexNumber(part.trim())).join(" : "))}.`;
  const examShortcut = `Change only ${changed.label}: ${equation(`${latexNumber(initial)}${sign}${latexNumber(amount)}=${latexNumber(final)}`)}. Pair this with the unchanged ${other.label} quantity and reduce the ratio.`;
  const commonTrap = `Do not add or subtract ${mathQuantity(amount, unit)} from both items. The operation affects only ${changed.label}.`;
  const visual = normalizeVisual(
    question,
    `${action === "added" ? "Add" : "Remove"} ${amount} ${unit} of ${changed.label}`,
    `${capitalize(other.label)} remains at ${stripUnit(other.quantity, unit)} ${unit}.`,
  );
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function reversePureChangeCopy(
  question: MalCp002ReleasedQuestion,
  priorAction: "addition" | "removal",
): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const index = changedIndex(question);
  const otherIndex = index === 0 ? 1 : 0;
  const before = question.diagram.before;
  const after = question.diagram.after;
  const changed = before[index]!;
  const other = before[otherIndex]!;
  const original = stripUnit(changed.quantity, unit);
  const final = stripUnit(after[index]!.quantity, unit);
  const amount = formatRational(requestRational(question, "adjustmentQuantity", rational(Math.abs(Number(final) - Number(original)))));
  const undoSign = priorAction === "addition" ? "-" : "+";
  const actionText = priorAction === "addition" ? "was added" : "was removed";
  const stem = pickStem(question.seed, [
    `After ${mathQuantity(amount, unit)} of ${changed.label} ${actionText}, a mixture contains ${mathQuantity(after[0]!.quantity, unit)} of ${after[0]!.label} and ${mathQuantity(after[1]!.quantity, unit)} of ${after[1]!.label}. Find the original ratio of ${before[0]!.label} to ${before[1]!.label}.`,
    `A mixture finally contains ${mathQuantity(after[0]!.quantity, unit)} of ${after[0]!.label} and ${mathQuantity(after[1]!.quantity, unit)} of ${after[1]!.label}. This was after ${priorAction === "addition" ? "adding" : "removing"} ${mathQuantity(amount, unit)} of ${changed.label}. What was the original ratio?`,
  ]);
  const coreConcept = `Reverse the stated operation on ${changed.label}. The quantity of ${other.label} is the same before and after, because the operation involved only ${changed.label}.`;
  const formula = `Original ${changed.label} ${equation(`=\\text{final ${changed.label}}${undoSign}\\text{stated amount}`)}; then reduce the original quantities.`;
  const steps = [
    `Step 1: Final ${changed.label} ${equation(`=${latexNumber(final)}`)} ${unit}.`,
    `Step 2: Undo the ${priorAction}: original ${changed.label} ${equation(`=${latexNumber(final)}${undoSign}${latexNumber(amount)}=${latexNumber(original)}`)} ${unit}.`,
    `Step 3: ${capitalize(other.label)} remains ${mathQuantity(other.quantity, unit)} because it was not changed.`,
    `Step 4: Original ratio ${equation(`=${latexNumber(stripUnit(before[0]!.quantity, unit))}:${latexNumber(stripUnit(before[1]!.quantity, unit))}`)} ${equation(`=${question.diagram.beforeRatio.split(":").map((part) => latexNumber(part.trim())).join(":")}`)}.`,
  ];
  const verification = `Applying the stated ${priorAction} again changes ${mathQuantity(original, unit)} of ${changed.label} to ${mathQuantity(final, unit)}, reproducing the given final state.`;
  const conclusion = `The original ratio was ${boldEquation(question.diagram.beforeRatio.split(":").map((part) => latexNumber(part.trim())).join(" : "))}.`;
  const examShortcut = `Undo the operation on ${changed.label} only, then write the original quantities as a ratio and reduce.`;
  const commonTrap = `Do not reverse the operation on ${other.label}; its quantity never changed.`;
  const visual = normalizeVisual(
    question,
    `${priorAction === "addition" ? "Add" : "Remove"} ${amount} ${unit} of ${changed.label}`,
    `${capitalize(other.label)} has the same quantity before and after.`,
  );
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function totalAndRatioPartitionCopy(question: MalCp002ReleasedQuestion): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const labels = question.diagram.after;
  const request = requestOf(question);
  const total = toRational(request.totalQuantity);
  const parts = ratioParts(request.ratio);
  const totalParts = addRational(parts[0], parts[1]);
  const onePart = divideRational(total, totalParts);
  const quantities = [
    multiplyRational(onePart, parts[0]),
    multiplyRational(onePart, parts[1]),
  ] as const;
  const stem = pickStem(question.seed, [
    `A mixture of ${mathQuantity(total, unit)} contains ${labels[0]!.label} and ${labels[1]!.label} in the ratio ${mathRatio(parts)}. Find the quantities of the two items respectively.`,
    `${capitalize(labels[0]!.label)} and ${labels[1]!.label} are mixed in the ratio ${mathRatio(parts)}. If the total mixture is ${mathQuantity(total, unit)}, find the quantity of each item.`,
  ]);
  const coreConcept = `Divide the total quantity according to the ratio parts. First find the value of one part, then multiply it by each item’s number of parts.`;
  const formula = `One part ${equation(`=\\dfrac{\\text{total quantity}}{\\text{sum of ratio parts}}`)}; item quantity ${equation(`=\\text{its parts}\\times\\text{one part}`)}.`;
  const steps = [
    `Step 1: Total ratio parts ${equation(`=${rationalLatex(parts[0])}+${rationalLatex(parts[1])}=${rationalLatex(totalParts)}`)}.`,
    `Step 2: One part ${equation(`=\\dfrac{${rationalLatex(total)}}{${rationalLatex(totalParts)}}=${rationalLatex(onePart)}`)} ${unit}.`,
    `Step 3: ${capitalize(labels[0]!.label)} ${equation(`=${rationalLatex(parts[0])}\\times${rationalLatex(onePart)}=${rationalLatex(quantities[0])}`)} ${unit}.`,
    `Step 4: ${capitalize(labels[1]!.label)} ${equation(`=${rationalLatex(parts[1])}\\times${rationalLatex(onePart)}=${rationalLatex(quantities[1])}`)} ${unit}.`,
  ];
  const verification = `${equation(`${rationalLatex(quantities[0])}+${rationalLatex(quantities[1])}=${rationalLatex(total)}`)} ${unit}, and ${mathRatio([quantities[0], quantities[1]])} reduces to ${mathRatio(parts)}.`;
  const conclusion = `${capitalize(labels[0]!.label)} ${mathQuantity(quantities[0], unit, true)} and ${labels[1]!.label} ${mathQuantity(quantities[1], unit, true)}.`;
  const examShortcut = `Add the ratio parts, divide the total by that sum, and multiply once for each item.`;
  const commonTrap = `Do not divide the total by either ratio number separately. Divide by the sum of the parts first.`;
  const visual = normalizeVisual(
    question,
    `Divide ${formatRational(total)} ${unit} in the ratio ${ratioRaw(parts)}`,
    `The two quantities add back to ${formatRational(total)} ${unit}.`,
  );
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function singleReplacementTargetCopy(question: MalCp002ReleasedQuestion): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const request = requestOf(question);
  const initial = rationalState(request.initialState);
  const final = rationalState(solutionOf(question).finalState);
  const replacementComponent = request.replacementComponent === "B" ? 1 : 0;
  const retainedIndex = replacementComponent === 0 ? 1 : 0;
  const labels = question.diagram.before;
  const total = addRational(initial.componentA, initial.componentB);
  const initialOther = retainedIndex === 0 ? initial.componentA : initial.componentB;
  const finalOther = retainedIndex === 0 ? final.componentA : final.componentB;
  const retainedFraction = divideRational(finalOther, initialOther);
  const replacedFraction = subtractRational(rational(1), retainedFraction);
  const quantity = solutionRational(question, "quantity");
  const targetParts = ratioParts(request.targetRatio);
  const replacementLabel = labels[replacementComponent]!.label;
  const otherLabel = labels[retainedIndex]!.label;
  const stem = `A vessel contains ${mathQuantity(initial.componentA, unit)} of ${labels[0]!.label} and ${mathQuantity(initial.componentB, unit)} of ${labels[1]!.label}. A well-mixed quantity is removed once and replaced with the same quantity of ${replacementLabel}. What quantity should be replaced so that the final ratio becomes ${mathRatio(targetParts)}?`;
  const coreConcept = `The removed sample has the same composition as the mixture. Therefore, both original items are reduced by the same fraction before the replacement item is added.`;
  const formula = `Retained fraction ${equation(`=\\dfrac{V-x}{V}`)}. Use the item that is not added back: ${equation(`\\text{final ${otherLabel}}=\\text{initial ${otherLabel}}\\times\\dfrac{V-x}{V}`)}.`;
  const steps = [
    `Step 1: Total quantity ${equation(`V=${rationalLatex(initial.componentA)}+${rationalLatex(initial.componentB)}=${rationalLatex(total)}`)} ${unit}.`,
    `Step 2: From the target ratio, the final quantity of ${otherLabel} is ${mathQuantity(finalOther, unit)}.`,
    `Step 3: Retained fraction ${equation(`=\\dfrac{${rationalLatex(finalOther)}}{${rationalLatex(initialOther)}}=${rationalLatex(retainedFraction)}`)}.`,
    `Step 4: Replaced fraction ${equation(`=1-${rationalLatex(retainedFraction)}=${rationalLatex(replacedFraction)}`)}.`,
    `Step 5: Replaced quantity ${equation(`=${rationalLatex(total)}\\times${rationalLatex(replacedFraction)}=${rationalLatex(quantity)}`)} ${unit}.`,
  ];
  const verification = `Removing and replacing ${mathQuantity(quantity, unit)} gives final quantities ${mathQuantity(final.componentA, unit)} and ${mathQuantity(final.componentB, unit)}, whose ratio is ${mathRatio(targetParts)}.`;
  const conclusion = `Replace ${mathQuantity(quantity, unit, true)} with ${replacementLabel}.`;
  const examShortcut = `Track ${otherLabel}, because none of it is added back. Its final-to-initial fraction is the retained fraction of the whole mixture.`;
  const commonTrap = `Do not subtract the replaced quantity from ${replacementLabel} alone. The removed quantity is a well-mixed sample containing both items.`;
  const visual = normalizeVisual(
    question,
    `Remove ${formatRational(quantity)} ${unit} of mixture; add the same amount of ${replacementLabel}`,
    `Both original items are reduced proportionally before ${replacementLabel} is added.`,
  );
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function totalRatioTargetCopy(question: MalCp002ReleasedQuestion): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const params = asRecord(question.parameters);
  const total = toRational(params.initialTotal);
  const initialParts = ratioParts(params.initialRatio);
  const targetParts = ratioParts(params.targetRatio);
  const changedComponent = params.changedComponent === "B" ? 1 : 0;
  const otherIndex = changedComponent === 0 ? 1 : 0;
  const action = params.adjustmentKind === "REMOVE" ? "remove" : "add";
  const labels = question.diagram.before;
  const initialState = rationalState(solutionOf(question).initialState);
  const finalState = rationalState(solutionOf(question).finalState);
  const initialValues = [initialState.componentA, initialState.componentB] as const;
  const finalValues = [finalState.componentA, finalState.componentB] as const;
  const totalParts = addRational(initialParts[0], initialParts[1]);
  const onePart = divideRational(total, totalParts);
  const otherQuantity = initialValues[otherIndex];
  const targetOnePart = divideRational(otherQuantity, targetParts[otherIndex]);
  const requiredChanged = finalValues[changedComponent];
  const amount = solutionRational(question, "quantity");
  const stem = `A mixture of ${mathQuantity(total, unit)} contains ${labels[0]!.label} and ${labels[1]!.label} in the ratio ${mathRatio(initialParts)}. ${unitQuestion(unit, labels[changedComponent]!.label)} should be ${action === "add" ? "added" : "removed"} to make the ratio ${mathRatio(targetParts)}?`;
  const coreConcept = `First divide the original total in the given ratio. Then use the quantity of ${labels[otherIndex]!.label}, which does not change, to scale the target ratio.`;
  const formula = `Original one part ${equation(`=\\dfrac{\\text{total}}{\\text{initial parts}}`)}; target one part ${equation(`=\\dfrac{\\text{quantity of ${labels[otherIndex]!.label}}}{\\text{its target parts}}`)}.`;
  const operationEquation =
    action === "add"
      ? `${rationalLatex(requiredChanged)}-${rationalLatex(initialValues[changedComponent])}=${rationalLatex(amount)}`
      : `${rationalLatex(initialValues[changedComponent])}-${rationalLatex(requiredChanged)}=${rationalLatex(amount)}`;
  const steps = [
    `Step 1: Initial ratio parts ${equation(`=${rationalLatex(initialParts[0])}+${rationalLatex(initialParts[1])}=${rationalLatex(totalParts)}`)}.`,
    `Step 2: Initial one part ${equation(`=\\dfrac{${rationalLatex(total)}}{${rationalLatex(totalParts)}}=${rationalLatex(onePart)}`)} ${unit}.`,
    `Step 3: Initial quantities are ${mathQuantity(initialValues[0], unit)} and ${mathQuantity(initialValues[1], unit)}.`,
    `Step 4: ${capitalize(labels[otherIndex]!.label)} remains ${mathQuantity(otherQuantity, unit)}. In the target ratio it represents ${mathNumber(targetParts[otherIndex])} parts, so target one part ${equation(`=\\dfrac{${rationalLatex(otherQuantity)}}{${rationalLatex(targetParts[otherIndex])}}=${rationalLatex(targetOnePart)}`)} ${unit}.`,
    `Step 5: Required ${labels[changedComponent]!.label} ${equation(`=${rationalLatex(targetParts[changedComponent])}\\times${rationalLatex(targetOnePart)}=${rationalLatex(requiredChanged)}`)} ${unit}.`,
    `Step 6: Quantity to ${action} ${equation(`=${operationEquation}`)} ${unit} ${equation(`=${rationalLatex(amount)}`)} ${unit}.`,
  ];
  const verification = `The final quantities are ${mathQuantity(finalValues[0], unit)} and ${mathQuantity(finalValues[1], unit)}, which give ${mathRatio(targetParts)}.`;
  const conclusion = `${capitalize(action)} ${mathQuantity(amount, unit, true)} of ${labels[changedComponent]!.label}.`;
  const examShortcut = `Find the original quantities first. Keep ${labels[otherIndex]!.label} at ${mathQuantity(otherQuantity, unit)} and use it to scale the target ratio.`;
  const commonTrap = `Do not divide the original total in the target ratio. The total changes after the operation.`;
  const visual = normalizeVisual(
    question,
    `${capitalize(action)} ${formatRational(amount)} ${unit} of ${labels[changedComponent]!.label}`,
    `${capitalize(labels[otherIndex]!.label)} remains ${formatRational(otherQuantity)} ${unit}.`,
  );
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function oneKnownComponentCopy(question: MalCp002ReleasedQuestion): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const params = asRecord(question.parameters);
  const parts = ratioParts(params.ratio);
  const knownIndex = params.knownComponent === "B" ? 1 : 0;
  const otherIndex = knownIndex === 0 ? 1 : 0;
  const known = toRational(params.knownQuantity);
  const other = solutionRational(question, "otherQuantity");
  const onePart = divideRational(known, parts[knownIndex]);
  const labels = question.diagram.before;
  const stem = `${capitalize(labels[0]!.label)} and ${labels[1]!.label} are in the ratio ${mathRatio(parts)}. If the quantity of ${labels[knownIndex]!.label} is ${mathQuantity(known, unit)}, find the quantity of ${labels[otherIndex]!.label}.`;
  const coreConcept = `The known item fixes the value of one ratio part. Divide its quantity by its number of parts, then multiply by the other item’s parts.`;
  const formula = `One part ${equation(`=\\dfrac{\\text{known quantity}}{\\text{known parts}}`)}; required quantity ${equation(`=\\text{other parts}\\times\\text{one part}`)}.`;
  const steps = [
    `Step 1: ${capitalize(labels[knownIndex]!.label)} represents ${mathNumber(parts[knownIndex])} ratio parts.`,
    `Step 2: One part ${equation(`=\\dfrac{${rationalLatex(known)}}{${rationalLatex(parts[knownIndex])}}=${rationalLatex(onePart)}`)} ${unit}.`,
    `Step 3: ${capitalize(labels[otherIndex]!.label)} represents ${mathNumber(parts[otherIndex])} parts.`,
    `Step 4: Required quantity ${equation(`=${rationalLatex(parts[otherIndex])}\\times${rationalLatex(onePart)}=${rationalLatex(other)}`)} ${unit}.`,
  ];
  const verification = `${mathRatio([knownIndex === 0 ? known : other, knownIndex === 0 ? other : known])} reduces to ${mathRatio(parts)}.`;
  const conclusion = `${capitalize(labels[otherIndex]!.label)} ${mathQuantity(other, unit, true)}.`;
  const examShortcut = `Known quantity ÷ known parts × required parts.`;
  const commonTrap = `Match each quantity with the correct side of the ratio; do not reverse the parts.`;
  const visual = normalizeVisual(question, `Scale ${ratioRaw(parts)} from the known quantity`, `One part is ${formatRational(onePart)} ${unit}.`);
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function originalTotalShiftCopy(
  question: MalCp002ReleasedQuestion,
  action: "addition" | "removal",
): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const params = asRecord(question.parameters);
  const initialParts = ratioParts(params.initialRatio);
  const finalParts = ratioParts(params.finalRatio);
  const changedIndex = params.changedComponent === "B" ? 1 : 0;
  const otherIndex = changedIndex === 0 ? 1 : 0;
  const amount = toRational(params.adjustmentQuantity);
  const scale = solutionRational(question, "originalScale");
  const originalTotal = solutionRational(question, "originalTotal");
  const originalState = rationalState(solutionOf(question).originalState);
  const finalState = rationalState(solutionOf(question).finalState);
  const originalValues = [originalState.componentA, originalState.componentB] as const;
  const finalValues = [finalState.componentA, finalState.componentB] as const;
  const labels = question.diagram.before;
  const sign = action === "addition" ? "+" : "-";
  const actionWord = action === "addition" ? "added" : "removed";
  const stem = `${capitalize(labels[0]!.label)} and ${labels[1]!.label} were initially in the ratio ${mathRatio(initialParts)}. After ${mathQuantity(amount, unit)} of ${labels[changedIndex]!.label} was ${actionWord}, the ratio became ${mathRatio(finalParts)}. Find the original total quantity.`;
  const coreConcept = `Use separate scale factors for the original and final ratios. Since only ${labels[changedIndex]!.label} changes, ${labels[otherIndex]!.label} has the same quantity in both states.`;
  const formula = `Original quantities ${equation(`=${rationalLatex(initialParts[0])}x,${rationalLatex(initialParts[1])}x`)} and final quantities ${equation(`=${rationalLatex(finalParts[0])}y,${rationalLatex(finalParts[1])}y`)}.`;
  const steps = [
    `Step 1: Let the original quantities be ${equation(`${rationalLatex(initialParts[0])}x`)} and ${equation(`${rationalLatex(initialParts[1])}x`)}.`,
    `Step 2: Let the final quantities be ${equation(`${rationalLatex(finalParts[0])}y`)} and ${equation(`${rationalLatex(finalParts[1])}y`)}.`,
    `Step 3: ${capitalize(labels[otherIndex]!.label)} does not change, so ${equation(`${rationalLatex(initialParts[otherIndex])}x=${rationalLatex(finalParts[otherIndex])}y`)}.`,
    `Step 4: For ${labels[changedIndex]!.label}, ${equation(`${rationalLatex(initialParts[changedIndex])}x${sign}${rationalLatex(amount)}=${rationalLatex(finalParts[changedIndex])}y`)}. Solving the two equations gives ${equation(`x=${rationalLatex(scale)}`)}.`,
    `Step 5: Original total ${equation(`=(${rationalLatex(initialParts[0])}+${rationalLatex(initialParts[1])})\\times${rationalLatex(scale)}=${rationalLatex(originalTotal)}`)} ${unit}.`,
  ];
  const verification = `The reconstructed original quantities are ${mathQuantity(originalValues[0], unit)} and ${mathQuantity(originalValues[1], unit)}. After the stated ${action}, they become ${mathQuantity(finalValues[0], unit)} and ${mathQuantity(finalValues[1], unit)}, giving ${mathRatio(finalParts)}.`;
  const conclusion = `The original total was ${mathQuantity(originalTotal, unit, true)}.`;
  const examShortcut = `Connect the two ratio scales through ${labels[otherIndex]!.label}, whose quantity stays the same, then use the stated ${action} to find the scale.`;
  const commonTrap = `Do not use one scale factor for both ratios. The ratio changes, so the original and final states need separate scales.`;
  const visual = normalizeVisual(question, `${capitalize(action)} of ${formatRational(amount)} ${unit} of ${labels[changedIndex]!.label}`, `${capitalize(labels[otherIndex]!.label)} has the same quantity before and after.`);
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function forwardReplacementCopy(question: MalCp002ReleasedQuestion): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const params = asRecord(question.parameters);
  const initial = rationalState(params.initialState);
  const removed = toRational(params.removedQuantity);
  const replacementIndex = params.replacementComponent === "B" ? 1 : 0;
  const total = addRational(initial.componentA, initial.componentB);
  const retained = toRational(solutionOf(question).retainedFraction);
  const final = rationalState(solutionOf(question).finalState);
  const labels = question.diagram.before;
  const retainedA = multiplyRational(initial.componentA, retained);
  const retainedB = multiplyRational(initial.componentB, retained);
  const stem = `A vessel contains ${mathQuantity(initial.componentA, unit)} of ${labels[0]!.label} and ${mathQuantity(initial.componentB, unit)} of ${labels[1]!.label}. A well-mixed sample of ${mathQuantity(removed, unit)} is removed and replaced with the same quantity of ${labels[replacementIndex]!.label}. Find the final ratio.`;
  const coreConcept = `Removing a well-mixed sample reduces both items by the same retained fraction. Add the replacement quantity only after calculating the retained amounts.`;
  const formula = `Retained fraction ${equation(`=\\dfrac{V-r}{V}`)}; retained item ${equation(`=\\text{initial item}\\times\\text{retained fraction}`)}.`;
  const steps = [
    `Step 1: Total quantity ${equation(`=${rationalLatex(initial.componentA)}+${rationalLatex(initial.componentB)}=${rationalLatex(total)}`)} ${unit}.`,
    `Step 2: Retained fraction ${equation(`=\\dfrac{${rationalLatex(total)}-${rationalLatex(removed)}}{${rationalLatex(total)}}=${rationalLatex(retained)}`)}.`,
    `Step 3: Retained ${labels[0]!.label} ${equation(`=${rationalLatex(initial.componentA)}\\times${rationalLatex(retained)}=${rationalLatex(retainedA)}`)} ${unit}.`,
    `Step 4: Retained ${labels[1]!.label} ${equation(`=${rationalLatex(initial.componentB)}\\times${rationalLatex(retained)}=${rationalLatex(retainedB)}`)} ${unit}.`,
    `Step 5: Add ${mathQuantity(removed, unit)} to ${labels[replacementIndex]!.label}. The final quantities are ${mathQuantity(final.componentA, unit)} and ${mathQuantity(final.componentB, unit)}, giving ${mathRatio(question.diagram.afterRatio)}.`,
  ];
  const verification = `${equation(`${rationalLatex(final.componentA)}+${rationalLatex(final.componentB)}=${rationalLatex(total)}`)} ${unit}; the vessel returns to its original total after refill.`;
  const conclusion = `The final ratio is ${boldEquation(question.diagram.afterRatio.split(":").map((part) => latexNumber(part.trim())).join(" : "))}.`;
  const examShortcut = `Multiply both original quantities by the retained fraction, then add the refill to only one item.`;
  const commonTrap = `Do not remove the whole sample from one item. A well-mixed sample contains both items in the current ratio.`;
  const visual = normalizeVisual(question, `Remove ${formatRational(removed)} ${unit} of mixture; add ${labels[replacementIndex]!.label}`, `Both original items are reduced by the same fraction before refill.`);
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function homogeneousRemovalCopy(question: MalCp002ReleasedQuestion): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const params = asRecord(question.parameters);
  const initialParts = ratioParts(params.initialRatio);
  const removed = toRational(params.removedQuantity);
  const final = rationalState(solutionOf(question).finalState);
  const retained = toRational(solutionOf(question).retainedFraction);
  const labels = question.diagram.before;
  const stem = `A vessel contains ${labels[0]!.label} and ${labels[1]!.label} in the ratio ${mathRatio(initialParts)}. A well-mixed sample of ${mathQuantity(removed, unit)} is removed and nothing is added back. Find the ratio in the remaining mixture.`;
  const coreConcept = `A well-mixed sample has the same composition as the whole vessel. Both items are therefore reduced by the same fraction, so their ratio does not change.`;
  const formula = `${equation(`A(1-r/V):B(1-r/V)=A:B`)}.`;
  const steps = [
    `Step 1: The removed sample contains the two items in the same ratio ${mathRatio(initialParts)}.`,
    `Step 2: Both quantities are multiplied by the same retained fraction ${mathNumber(retained)}.`,
    `Step 3: The remaining quantities are ${mathQuantity(final.componentA, unit)} and ${mathQuantity(final.componentB, unit)}.`,
    `Step 4: Their ratio is ${mathRatio([final.componentA, final.componentB])}, which reduces to ${mathRatio(initialParts)}.`,
  ];
  const verification = `Because the same non-zero factor multiplies both sides of a ratio, it cancels during reduction.`;
  const conclusion = `The ratio remains ${boldEquation(initialParts.map((part) => rationalLatex(part)).join(" : "))}.`;
  const examShortcut = `Removing a well-mixed sample without refill never changes the ratio.`;
  const commonTrap = `Do not treat this as removal of only one item. The sample is taken from the mixture, so it contains both items.`;
  const visual = normalizeVisual(question, `Remove ${formatRational(removed)} ${unit} of well-mixed contents`, `Both items are reduced by the same fraction, so the ratio is preserved.`);
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function operationChoiceCopy(question: MalCp002ReleasedQuestion): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const params = asRecord(question.parameters);
  const initial = rationalState(params.initialState);
  const targetParts = ratioParts(params.targetRatio);
  const solution = solutionOf(question);
  const changedIndex = solution.changedComponent === "B" ? 1 : 0;
  const otherIndex = changedIndex === 0 ? 1 : 0;
  const action = solution.adjustmentKind === "REMOVE" ? "remove" : "add";
  const amount = toRational(solution.quantity);
  const final = rationalState(solution.finalState);
  const initialValues = [initial.componentA, initial.componentB] as const;
  const finalValues = [final.componentA, final.componentB] as const;
  const labels = question.diagram.before;
  const targetOnePart = divideRational(initialValues[otherIndex], targetParts[otherIndex]);
  const requiredChanged = multiplyRational(targetOnePart, targetParts[changedIndex]);
  const stem = `A mixture contains ${mathQuantity(initial.componentA, unit)} of ${labels[0]!.label} and ${mathQuantity(initial.componentB, unit)} of ${labels[1]!.label}. Which single-item operation will change the ratio to ${mathRatio(targetParts)}?`;
  const coreConcept = `Use the item that remains at its current quantity to scale the target ratio. The required quantity of the other item shows whether it must be added or removed.`;
  const formula = `Target one part ${equation(`=\\dfrac{\\text{constant item quantity}}{\\text{its target parts}}`)}.`;
  const steps = [
    `Step 1: Keep ${labels[otherIndex]!.label} at ${mathQuantity(initialValues[otherIndex], unit)}. In the target ratio it represents ${mathNumber(targetParts[otherIndex])} parts.`,
    `Step 2: Target one part ${equation(`=\\dfrac{${rationalLatex(initialValues[otherIndex])}}{${rationalLatex(targetParts[otherIndex])}}=${rationalLatex(targetOnePart)}`)} ${unit}.`,
    `Step 3: Required ${labels[changedIndex]!.label} ${equation(`=${rationalLatex(targetParts[changedIndex])}\\times${rationalLatex(targetOnePart)}=${rationalLatex(requiredChanged)}`)} ${unit}.`,
    `Step 4: Current ${labels[changedIndex]!.label} is ${mathQuantity(initialValues[changedIndex], unit)}, so ${action} ${equation(`|${rationalLatex(requiredChanged)}-${rationalLatex(initialValues[changedIndex])}|=${rationalLatex(amount)}`)} ${unit}.`,
  ];
  const verification = `The operation gives final quantities ${mathQuantity(finalValues[0], unit)} and ${mathQuantity(finalValues[1], unit)}, whose ratio is ${mathRatio(targetParts)}.`;
  const conclusion = `${capitalize(action)} ${mathQuantity(amount, unit, true)} of ${labels[changedIndex]!.label}.`;
  const examShortcut = `Hold one item constant, scale the target ratio, and compare the required quantity of the other item with its current quantity.`;
  const commonTrap = `Do not decide the operation by looking only at the ratio numbers. Convert the target ratio to actual quantities first.`;
  const visual = normalizeVisual(question, `${capitalize(action)} ${formatRational(amount)} ${unit} of ${labels[changedIndex]!.label}`, `${capitalize(labels[otherIndex]!.label)} remains ${formatRational(initialValues[otherIndex])} ${unit}.`);
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function threeComponentCopy(question: MalCp002ReleasedQuestion): EditorialCopy {
  const unit = question.diagram.quantityUnit;
  const params = asRecord(question.parameters);
  const initialPartsRecord = asRecord(params.initialRatio);
  const finalPartsRecord = asRecord(params.finalRatio);
  const initialParts = [
    toRational(initialPartsRecord.componentA),
    toRational(initialPartsRecord.componentB),
    toRational(initialPartsRecord.componentC),
  ];
  const finalParts = [
    toRational(finalPartsRecord.componentA),
    toRational(finalPartsRecord.componentB),
    toRational(finalPartsRecord.componentC),
  ];
  const additionA = toRational(params.additionA);
  const additionB = toRational(params.additionB);
  const scale = solutionRational(question, "scale");
  const requested = solutionRational(question, "requestedQuantity");
  const labels = question.diagram.before.map((item) => item.label);
  const stem = `${capitalize(labels[0]!)} , ${labels[1]} and ${labels[2]} are initially in the ratio ${mathRatio(initialParts)}. After adding ${mathQuantity(additionA, unit)} to ${labels[0]} and ${mathQuantity(additionB, unit)} to ${labels[1]}, the ratio becomes ${mathRatio(finalParts)}. Find the final quantity of ${labels[2]}.`;
  const coreConcept = `${capitalize(labels[2]!)} is not changed, so it links the original and final ratio scales. Use either stated addition to find the common scale.`;
  const formula = `Initial quantities ${equation(`=${rationalLatex(initialParts[0]!)}x,${rationalLatex(initialParts[1]!)}x,${rationalLatex(initialParts[2]!)}x`)}.`;
  const steps = [
    `Step 1: Let the initial quantities be ${equation(`${rationalLatex(initialParts[0]!)}x`)} , ${equation(`${rationalLatex(initialParts[1]!)}x`)} and ${equation(`${rationalLatex(initialParts[2]!)}x`)}.`,
    `Step 2: Using the first addition, ${equation(`${rationalLatex(initialParts[0]!)}x+${rationalLatex(additionA)}=${rationalLatex(finalParts[0]!)}x`)}.`,
    `Step 3: Therefore, ${equation(`x=${rationalLatex(scale)}`)}.`,
    `Step 4: Check with the second addition: ${equation(`${rationalLatex(initialParts[1]!)}\\times${rationalLatex(scale)}+${rationalLatex(additionB)}=${rationalLatex(finalParts[1]!)}\\times${rationalLatex(scale)}`)}.`,
    `Step 5: Final ${labels[2]} ${equation(`=${rationalLatex(finalParts[2]!)}\\times${rationalLatex(scale)}=${rationalLatex(requested)}`)} ${unit}.`,
  ];
  const verification = `The final quantities displayed in the three-item state are in the ratio ${mathRatio(finalParts)}.`;
  const conclusion = `${capitalize(labels[2]!)} ${mathQuantity(requested, unit, true)}.`;
  const examShortcut = `Use the addition that changes one ratio part by a simple amount to find the scale immediately, then multiply by the third item’s final part.`;
  const commonTrap = `Do not add anything to ${labels[2]}; its quantity is the link between the two ratios.`;
  const visual = normalizeVisual(question, `Add ${formatRational(additionA)} ${unit} to ${labels[0]} and ${formatRational(additionB)} ${unit} to ${labels[1]}`, `${capitalize(labels[2]!)} is not changed.`);
  return { stem, coreConcept, formula, steps, verification, conclusion, examShortcut, commonTrap, visual };
}

function buildEditorialCopy(question: MalCp002ReleasedQuestion): EditorialCopy {
  switch (question.traceability.familyId) {
    case "EXPLICIT_ADD_TO_TARGET":
      return explicitTargetCopy(question, "added");
    case "EXPLICIT_REMOVE_TO_TARGET":
      return explicitTargetCopy(question, "removed");
    case "RATIO_AFTER_PURE_ADDITION":
      return forwardPureChangeCopy(question, "added");
    case "RATIO_AFTER_PURE_REMOVAL":
      return forwardPureChangeCopy(question, "removed");
    case "ORIGINAL_RATIO_BEFORE_ADDITION":
      return reversePureChangeCopy(question, "addition");
    case "ORIGINAL_RATIO_BEFORE_REMOVAL":
      return reversePureChangeCopy(question, "removal");
    case "COMPONENTS_FROM_TOTAL_AND_RATIO":
      return totalAndRatioPartitionCopy(question);
    case "SINGLE_REPLACEMENT_TO_TARGET":
      return singleReplacementTargetCopy(question);
    case "TOTAL_RATIO_ADD_TO_TARGET":
    case "TOTAL_RATIO_REMOVE_TO_TARGET":
      return totalRatioTargetCopy(question);
    case "OTHER_COMPONENT_FROM_ONE_COMPONENT_AND_RATIO":
      return oneKnownComponentCopy(question);
    case "ORIGINAL_TOTAL_FROM_ADDITION_RATIO_SHIFT":
      return originalTotalShiftCopy(question, "addition");
    case "ORIGINAL_TOTAL_FROM_REMOVAL_RATIO_SHIFT":
      return originalTotalShiftCopy(question, "removal");
    case "RATIO_AFTER_SINGLE_REPLACEMENT":
      return forwardReplacementCopy(question);
    case "HOMOGENEOUS_REMOVAL_RATIO_INVARIANCE":
      return homogeneousRemovalCopy(question);
    case "REQUIRED_OPERATION_AND_QUANTITY":
      return operationChoiceCopy(question);
    case "THREE_COMPONENT_COUPLED_ADDITION":
      return threeComponentCopy(question);
  }
}

function containsLearnerJargon(value: string): boolean {
  return /\b(?:pure|counterpart|unaltered component|unchanged component|fixed counterpart)\b/iu.test(value);
}

function rawDigitsOutsideMath(value: string): boolean {
  const withoutMath = value.replace(/\$[^$]+\$/gu, "");
  return /\d/u.test(withoutMath);
}

export function applyMalCp002EditorialV2(
  question: MalCp002ReleasedQuestion,
): MalCp002EditorialV2Question {
  const copy = buildEditorialCopy(question);
  const answer = formatAnswerText(question.answer);
  const options = question.options.map(formatAnswerText);
  const optionAudit = question.optionAudit.map((item, index) => ({
    ...item,
    text: options[index]!,
  }));
  const searchable = [
    copy.stem,
    copy.coreConcept,
    copy.formula,
    ...copy.steps,
    copy.verification,
    copy.conclusion,
    copy.examShortcut,
    copy.commonTrap,
  ].join("\n");
  if (/alligation/iu.test(searchable)) {
    throw new Error(`${question.questionLanguageId}: CP-002 editorial V2 must not use alligation.`);
  }
  if (containsLearnerJargon(searchable)) {
    throw new Error(`${question.questionLanguageId}: CP-002 editorial V2 contains learner-facing engine jargon.`);
  }
  if (/\b(?:A|An) (?:beverage maker|coffee roaster|fuel technician|site supervisor|pulse merchant|grain merchant|alloy maker|oil packer|depot worker|mill operator|tea seller)\b/u.test(copy.stem)) {
    throw new Error(`${question.questionLanguageId}: synthetic role-playing stem survived editorial V2.`);
  }
  for (const value of [copy.stem, copy.formula, ...copy.steps, copy.verification, ...options]) {
    if (rawDigitsOutsideMath(value)) {
      throw new Error(`${question.questionLanguageId}: learner arithmetic is not fully enclosed in MathJax: ${value}`);
    }
  }
  if (/−|\|\s*\d/u.test(searchable)) {
    throw new Error(`${question.questionLanguageId}: raw Unicode-minus or ASCII absolute-value arithmetic survived editorial V2.`);
  }
  const explanationWithoutLines = {
    ...question.explanation,
    editorialRevisionId: MAL_CP002_EDITORIAL_V2.presentationRevisionId,
    methodName: MAL_CP002_EDITORIAL_V2.methodName,
    coreConcept: copy.coreConcept,
    formula: copy.formula,
    steps: copy.steps,
    verification: copy.verification,
    conclusion: copy.conclusion,
    examShortcut: copy.examShortcut,
    commonTrap: copy.commonTrap,
    ratioVisual: copy.visual,
  };
  const checks = [
    ...question.validation.checks,
    {
      name: "natural-exam-voice-v2",
      passed: true as const,
      message: "The stem uses direct competitive-exam voice without synthetic occupational role-play.",
    },
    {
      name: "conserved-ratio-part-method-v2",
      passed: true as const,
      message: "CP-002 uses conserved ratio parts or proportional retention, never an alligation cross.",
    },
    {
      name: "teacher-language-v2",
      passed: true as const,
      message: "Learner-facing system jargon is absent.",
    },
    {
      name: "mathjax-zero-skip-v2",
      passed: true as const,
      message: "Displayed arithmetic, ratios, values and units use MathJax with explicit intermediate working.",
    },
  ];
  return {
    ...question,
    presentationRevisionId: MAL_CP002_EDITORIAL_V2.presentationRevisionId,
    editorialAuthority: MAL_CP002_EDITORIAL_V2.editorialAuthority,
    stem: copy.stem,
    answer,
    options,
    optionAudit,
    explanationId: `${question.questionLanguageId}-EN-NATURAL-MATHJAX-V2`,
    explanation: {
      ...explanationWithoutLines,
      lines: explanationLines(question, copy),
    },
    reasoningGraph: buildGraph(copy),
    diagram: copy.visual,
    validation: {
      ...question.validation,
      checks,
    },
    traceability: {
      ...question.traceability,
      presentationRevisionId: MAL_CP002_EDITORIAL_V2.presentationRevisionId,
      editorialAuthority: MAL_CP002_EDITORIAL_V2.editorialAuthority,
    },
  };
}

export function runMalCp002EnglishEditorialV2Pipeline(input: {
  questionLanguageId?: MalCp002PermanentQlId | string;
  seed?: string;
  language?: "en";
} = {}): MalCp002EditorialV2Question {
  return applyMalCp002EditorialV2(runMalCp002EnglishReleasePipeline(input));
}
