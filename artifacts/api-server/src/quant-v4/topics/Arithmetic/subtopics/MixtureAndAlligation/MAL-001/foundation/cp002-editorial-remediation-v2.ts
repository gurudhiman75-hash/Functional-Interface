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

export const MAL_CP002_EDITORIAL_REMEDIATION_V2 = Object.freeze({
  presentationRevisionId: "MAL-CP002-EN-EDITORIAL-V2",
  editorialAuthority: "MAL-CP002-CONSERVED-RATIO-PART-V2",
  methodName: "Conserved Ratio Part Method",
  alligationAllowed: false,
  syntheticRoleOpeningsAllowed: false,
  engineJargonAllowed: false,
  mathJaxArithmeticRequired: true,
});

type JsonRecord = Record<string, unknown>;

type EditorialFields = {
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

export type MalCp002EditorialRemediationV2Question =
  MalCp002ReleasedQuestion & {
    presentationRevisionId:
      typeof MAL_CP002_EDITORIAL_REMEDIATION_V2.presentationRevisionId;
    editorialAuthority:
      typeof MAL_CP002_EDITORIAL_REMEDIATION_V2.editorialAuthority;
    explanation: MalCp002ReleasedQuestion["explanation"] & {
      editorialRevisionId:
        typeof MAL_CP002_EDITORIAL_REMEDIATION_V2.presentationRevisionId;
      methodName: typeof MAL_CP002_EDITORIAL_REMEDIATION_V2.methodName;
    };
    traceability: MalCp002ReleasedQuestion["traceability"] & {
      presentationRevisionId:
        typeof MAL_CP002_EDITORIAL_REMEDIATION_V2.presentationRevisionId;
      editorialAuthority:
        typeof MAL_CP002_EDITORIAL_REMEDIATION_V2.editorialAuthority;
    };
  };

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

function record(value: unknown): JsonRecord {
  return isRecord(value) ? value : {};
}

function toRational(value: unknown, fallback = rational(0)): Rational {
  if (!isRecord(value)) return fallback;
  const numerator = value.numerator;
  const denominator = value.denominator;
  if (
    (typeof numerator !== "bigint" &&
      typeof numerator !== "number" &&
      typeof numerator !== "string") ||
    (typeof denominator !== "bigint" &&
      typeof denominator !== "number" &&
      typeof denominator !== "string")
  ) {
    return fallback;
  }
  return rational(Number(numerator), Number(denominator));
}

function request(question: MalCp002ReleasedQuestion): JsonRecord {
  return record(record(question.parameters).request);
}

function solution(question: MalCp002ReleasedQuestion): JsonRecord {
  return record(question.solution);
}

function state(value: unknown): { componentA: Rational; componentB: Rational } {
  const item = record(value);
  return {
    componentA: toRational(item.componentA),
    componentB: toRational(item.componentB),
  };
}

function ratio(value: unknown): [Rational, Rational] {
  const item = record(value);
  return [
    toRational(item.componentAPart, rational(1)),
    toRational(item.componentBPart, rational(1)),
  ];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function stripUnit(value: string, unit: string): string {
  return value
    .replace(new RegExp(`\\s*${escapeRegExp(unit)}\\s*$`, "iu"), "")
    .replace(/\s*ratio parts?\s*$/iu, "")
    .trim();
}

function latexNumber(value: string): string {
  const normalized = value.trim().replace(/−/gu, "-");
  const mixed = normalized.match(/^(-?\d+)\s+(\d+)\/(\d+)$/u);
  if (mixed) return `${mixed[1]}\\frac{${mixed[2]}}{${mixed[3]}}`;
  const fraction = normalized.match(/^(-?\d+)\/(\d+)$/u);
  if (fraction) return `\\frac{${fraction[1]}}{${fraction[2]}}`;
  return normalized;
}

function rationalLatex(value: Rational): string {
  return latexNumber(formatRational(value));
}

function mathQuantity(
  value: string | Rational,
  unit: string,
  bold = false,
): string {
  const raw =
    typeof value === "string" ? stripUnit(value, unit) : formatRational(value);
  const body = `${latexNumber(raw)}\\,\\text{${unit}}`;
  return bold ? `$\\mathbf{${body}}$` : `$${body}$`;
}

function mathRatio(value: string | readonly Rational[]): string {
  const parts =
    typeof value === "string"
      ? value.split(":").map((part) => latexNumber(part.trim()))
      : value.map(rationalLatex);
  return `$${parts.join(" : ")}$`;
}

function mathNumber(value: string | Rational): string {
  return `$${
    typeof value === "string" ? latexNumber(value) : rationalLatex(value)
  }$`;
}

function equation(value: string): string {
  return `$${value}$`;
}

function boldEquation(value: string): string {
  return `$\\mathbf{${value}}$`;
}

function capitalize(value: string): string {
  return value ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

function changedIndex(question: MalCp002ReleasedQuestion): 0 | 1 {
  const unit = question.diagram.quantityUnit;
  return stripUnit(question.diagram.before[0]!.quantity, unit) ===
    stripUnit(question.diagram.after[0]!.quantity, unit)
    ? 1
    : 0;
}

function normalizedVisual(
  question: MalCp002ReleasedQuestion,
  operation?: string,
  note?: string,
): MalCp002RatioVisual {
  const unit = question.diagram.quantityUnit;
  return {
    ...question.diagram,
    before: question.diagram.before.map((item) => ({
      ...item,
      quantity: stripUnit(item.quantity, unit),
    })),
    operation: (operation ?? question.diagram.operation)
      .replace(/\bpure\s+/giu, "")
      .replace(/\bcounterpart\b/giu, "other item"),
    after: question.diagram.after.map((item) => ({
      ...item,
      quantity: stripUnit(item.quantity, unit),
    })),
    note: (note ?? question.diagram.note)
      .replace(/\bpure\s+/giu, "")
      .replace(/\bcounterpart\b/giu, "other item")
      .replace(/\bstays fixed\b/giu, "remains the same")
      .replace(/\bunchanged component\b/giu, "item not involved in the operation"),
  };
}

function mathifyPlainSegment(value: string): string {
  const tokens: string[] = [];
  const protect = (latex: string): string => {
    const key = `@@MATH_${tokens.length}@@`;
    tokens.push(`$${latex}$`);
    return key;
  };

  let output = value
    .replace(/−/gu, "-")
    .replace(/\b1 parts\b/giu, "1 part")
    .replace(/\bpure\s+/giu, "")
    .replace(/\bthe unchanged component\b/giu, "the item not involved in the operation")
    .replace(/\bunchanged component\b/giu, "item not involved in the operation")
    .replace(/\bthe unaltered component\b/giu, "the other item")
    .replace(/\bunaltered component\b/giu, "other item")
    .replace(/\bcounterpart component\b/giu, "other item")
    .replace(/\bcounterpart\b/giu, "other item")
    .replace(/\bstays fixed\b/giu, "remains the same")
    .replace(/\bfixed ([a-z][a-z ]*)/giu, "the current quantity of $1")
    .replace(/\|([^|]+)\|/gu, "$1");

  output = output.replace(/Step\s+(\d+):/giu, (_match, number: string) => {
    const key = `@@STEP_${number}@@`;
    return key;
  });

  output = output.replace(
    /(-?\d+(?:\s+\d+\/\d+|\/\d+)?)(?:\s*)(kg|litres)\b/giu,
    (_match, number: string, unit: string) =>
      protect(`${latexNumber(number)}\\,\\text{${unit.toLowerCase()}}`),
  );

  output = output.replace(
    /(?<![\d@])(-?\d+(?:\s+\d+\/\d+|\/\d+)?\s*:\s*-?\d+(?:\s+\d+\/\d+|\/\d+)?(?:\s*:\s*-?\d+(?:\s+\d+\/\d+|\/\d+)?)?)(?![\d@])/gu,
    (match) =>
      protect(
        match
          .split(":")
          .map((part) => latexNumber(part.trim()))
          .join(" : "),
      ),
  );

  output = output.replace(
    /(?<![\w@])(-?\d+(?:\s+\d+\/\d+|\/\d+)?(?:\s*[+\-×÷=]\s*-?\d+(?:\s+\d+\/\d+|\/\d+)?)+)(?![\w@])/gu,
    (match) =>
      protect(
        match
          .replace(/×/gu, "\\times")
          .replace(/÷/gu, "\\div")
          .replace(/(-?\d+(?:\s+\d+\/\d+|\/\d+)?)/gu, (number) =>
            latexNumber(number),
          ),
      ),
  );

  output = output.replace(
    /(?<![\w@])(-?\d+(?:\s+\d+\/\d+|\/\d+)?)(?![\w@])/gu,
    (match) => protect(latexNumber(match)),
  );

  output = output.replace(/@@STEP_(\d+)@@/gu, "Step $1:");
  tokens.forEach((token, index) => {
    output = output.replace(`@@MATH_${index}@@`, token);
  });
  return output;
}

function mathify(value: string): string {
  return value
    .split(/(\$[^$]*\$)/gu)
    .map((part) => (part.startsWith("$") ? part : mathifyPlainSegment(part)))
    .join("");
}

function cleanTeacherText(
  value: string,
  changedLabel?: string,
  otherLabel?: string,
): string {
  let output = value
    .replace(/\bpure\s+/giu, "")
    .replace(/\bthe unchanged component\b/giu, otherLabel ?? "the other item")
    .replace(/\bunchanged component\b/giu, otherLabel ?? "the other item")
    .replace(/\bthe unaltered component\b/giu, otherLabel ?? "the other item")
    .replace(/\bunaltered component\b/giu, otherLabel ?? "the other item")
    .replace(/\bcounterpart component\b/giu, otherLabel ?? "the other item")
    .replace(/\bcounterpart\b/giu, "other item")
    .replace(/\bfixed counterpart\b/giu, "quantity of the other item")
    .replace(/\bstays fixed\b/giu, "remains the same")
    .replace(/\b1 parts\b/giu, "1 part")
    .replace(/\bchanged component\b/giu, changedLabel ?? "item being changed")
    .replace(/\bFinal changed component\b/gu, `New quantity of ${changedLabel ?? "the item"}`)
    .replace(/\bInitial changed component\b/gu, `Initial quantity of ${changedLabel ?? "the item"}`);
  output = mathify(output);
  return output;
}

function naturalStem(question: MalCp002ReleasedQuestion): string {
  let stem = question.stem.replace(/\bpure\s+/giu, "");
  stem = stem
    .replace(
      /^(?:A|An) [^,.]+ has a ([^,.]+) containing /iu,
      (_match, container: string) => `A ${container} contains `,
    )
    .replace(/^(?:A|An) [^,.]+ starts with /iu, "A mixture contains ")
    .replace(
      /^(After [^,]+), (?:a|an) [^,.]+ has /iu,
      "$1, the mixture contains ",
    )
    .replace(
      /^(?:A|An) [^,.]+ has ([^,.]+) of a mixture in which /iu,
      "A mixture of $1 contains ",
    )
    .replace(
      /^(?:A|An) [^,.]+ has ([^,.]+) in a ([^,]+), with /iu,
      "A $2 contains $1, with ",
    )
    .replace(/^(?:A|An) [^,.]+ has a ([^,.]+) containing /iu, "A $1 contains ")
    .replace(/^Three components /u, "Three items — ")
    .replace(/\bHow much must be replaced\b/giu, "What quantity should be replaced")
    .replace(/\bwhat is\b/giu, "find")
    .replace(/\?$/u, "?");
  return mathify(capitalize(stem));
}

function explicitTargetFields(
  question: MalCp002ReleasedQuestion,
  action: "add" | "remove",
): EditorialFields {
  const unit = question.diagram.quantityUnit;
  const before = question.diagram.before;
  const after = question.diagram.after;
  const index = changedIndex(question);
  const otherIndex = index === 0 ? 1 : 0;
  const changed = before[index]!;
  const other = before[otherIndex]!;
  const target = question.diagram.targetRatio!;
  const parts = target.split(":").map((part) => part.trim());
  const changedPart = parts[index]!;
  const otherPart = parts[otherIndex]!;
  const initialChanged = stripUnit(changed.quantity, unit);
  const otherQuantity = stripUnit(other.quantity, unit);
  const requiredChanged = stripUnit(after[index]!.quantity, unit);
  const amount = stripUnit(question.answer, unit);
  const onePart = divideRational(
    rational(Number(otherQuantity)),
    rational(Number(otherPart)),
  );
  const difference =
    action === "add"
      ? `${latexNumber(requiredChanged)}-${latexNumber(initialChanged)}=${latexNumber(amount)}`
      : `${latexNumber(initialChanged)}-${latexNumber(requiredChanged)}=${latexNumber(amount)}`;
  const stem = `A vessel contains ${mathQuantity(before[0]!.quantity, unit)} of ${before[0]!.label} and ${mathQuantity(before[1]!.quantity, unit)} of ${before[1]!.label}. What quantity of ${changed.label} should be ${action === "add" ? "added" : "removed"} so that the ratio of ${before[0]!.label} to ${before[1]!.label} becomes ${mathRatio(target)}?`;
  const partWord = otherPart === "1" ? "part" : "parts";
  const fields: EditorialFields = {
    stem,
    coreConcept: `Since only ${changed.label} is ${action === "add" ? "added" : "removed"}, the quantity of ${other.label} remains constant at ${mathQuantity(otherQuantity, unit)}. Use it to find the value of one part in the target ratio.`,
    formula: `One part ${equation(`=\\dfrac{\\text{constant quantity}}{\\text{its target parts}}`)}; required ${changed.label} ${equation(`=\\text{its target parts}\\times\\text{one part}`)}.`,
    steps: [
      `Step 1: In the target ratio ${mathRatio(target)}, ${other.label} represents ${mathNumber(otherPart)} ${partWord}.`,
      `Step 2: One part ${equation(`=\\dfrac{${latexNumber(otherQuantity)}}{${latexNumber(otherPart)}}=${rationalLatex(onePart)}`)} ${unit}.`,
      `Step 3: Required ${changed.label} ${equation(`=${latexNumber(changedPart)}\\times${rationalLatex(onePart)}=${latexNumber(requiredChanged)}`)} ${unit}.`,
      `Step 4: Quantity to ${action} ${equation(`=${difference}`)} ${unit}.`,
      `Step 5: Required change ${equation(`=${latexNumber(amount)}`)} ${unit}.`,
    ],
    verification: `After the change, the two quantities are ${mathQuantity(after[0]!.quantity, unit)} and ${mathQuantity(after[1]!.quantity, unit)}. Their ratio is ${mathRatio(question.diagram.afterRatio)}, exactly the target.`,
    conclusion: `${capitalize(action)} ${mathQuantity(amount, unit, true)} of ${changed.label}.`,
    examShortcut: `${capitalize(other.label)} remains ${mathQuantity(otherQuantity, unit)}. Match it with ${mathNumber(otherPart)} target ${partWord}, find one part, and calculate the required ${changed.label}.`,
    commonTrap: `Do not apply the target ratio to the original total. The total changes when ${changed.label} is ${action === "add" ? "added" : "removed"}.`,
    visual: normalizedVisual(
      question,
      `${capitalize(action)} ${amount} ${unit} of ${changed.label}`,
      `${capitalize(other.label)} remains ${otherQuantity} ${unit}.`,
    ),
  };
  return fields;
}

function totalRatioTargetFields(
  question: MalCp002ReleasedQuestion,
): EditorialFields {
  const unit = question.diagram.quantityUnit;
  const params = record(question.parameters);
  const total = toRational(params.initialTotal);
  const initialParts = ratio(params.initialRatio);
  const targetParts = ratio(params.targetRatio);
  const changed = params.changedComponent === "B" ? 1 : 0;
  const other = changed === 0 ? 1 : 0;
  const action = params.adjustmentKind === "REMOVE" ? "remove" : "add";
  const initialState = state(solution(question).initialState);
  const finalState = state(solution(question).finalState);
  const initialValues = [initialState.componentA, initialState.componentB] as const;
  const finalValues = [finalState.componentA, finalState.componentB] as const;
  const labels = question.diagram.before.map((item) => item.label);
  const totalParts = addRational(initialParts[0], initialParts[1]);
  const initialOnePart = divideRational(total, totalParts);
  const targetOnePart = divideRational(
    initialValues[other],
    targetParts[other],
  );
  const requiredChanged = finalValues[changed];
  const amount = toRational(solution(question).quantity);
  const difference =
    action === "add"
      ? `${rationalLatex(requiredChanged)}-${rationalLatex(initialValues[changed])}=${rationalLatex(amount)}`
      : `${rationalLatex(initialValues[changed])}-${rationalLatex(requiredChanged)}=${rationalLatex(amount)}`;
  return {
    stem: `A mixture of ${mathQuantity(total, unit)} contains ${labels[0]} and ${labels[1]} in the ratio ${mathRatio(initialParts)}. What quantity of ${labels[changed]} should be ${action === "add" ? "added" : "removed"} so that the ratio becomes ${mathRatio(targetParts)}?`,
    coreConcept: `First find the original quantities from the total and the initial ratio. Then keep ${labels[other]} at the same quantity and use it to scale the target ratio.`,
    formula: `Initial one part ${equation(`=\\dfrac{\\text{total}}{\\text{sum of initial parts}}`)}; target one part ${equation(`=\\dfrac{\\text{quantity of ${labels[other]}}}{\\text{its target parts}}`)}.`,
    steps: [
      `Step 1: Initial ratio parts ${equation(`=${rationalLatex(initialParts[0])}+${rationalLatex(initialParts[1])}=${rationalLatex(totalParts)}`)}.`,
      `Step 2: Initial one part ${equation(`=\\dfrac{${rationalLatex(total)}}{${rationalLatex(totalParts)}}=${rationalLatex(initialOnePart)}`)} ${unit}.`,
      `Step 3: Initial quantities are ${mathQuantity(initialValues[0], unit)} and ${mathQuantity(initialValues[1], unit)}.`,
      `Step 4: ${capitalize(labels[other]!)} remains ${mathQuantity(initialValues[other], unit)} and represents ${mathNumber(targetParts[other])} target parts. Therefore, target one part ${equation(`=\\dfrac{${rationalLatex(initialValues[other])}}{${rationalLatex(targetParts[other])}}=${rationalLatex(targetOnePart)}`)} ${unit}.`,
      `Step 5: Required ${labels[changed]} ${equation(`=${rationalLatex(targetParts[changed])}\\times${rationalLatex(targetOnePart)}=${rationalLatex(requiredChanged)}`)} ${unit}.`,
      `Step 6: Quantity to ${action} ${equation(`=${difference}`)} ${unit}.`,
    ],
    verification: `The final quantities are ${mathQuantity(finalValues[0], unit)} and ${mathQuantity(finalValues[1], unit)}, which give ${mathRatio(targetParts)}.`,
    conclusion: `${capitalize(action)} ${mathQuantity(amount, unit, true)} of ${labels[changed]}.`,
    examShortcut: `Find the original quantities, keep ${labels[other]} constant, and scale the target ratio from that quantity.`,
    commonTrap: `Do not divide the original total in the target ratio. The total changes after the operation.`,
    visual: normalizedVisual(
      question,
      `${capitalize(action)} ${formatRational(amount)} ${unit} of ${labels[changed]}`,
      `${capitalize(labels[other]!)} remains ${formatRational(initialValues[other])} ${unit}.`,
    ),
  };
}

function operationChoiceFields(
  question: MalCp002ReleasedQuestion,
): EditorialFields {
  const unit = question.diagram.quantityUnit;
  const params = record(question.parameters);
  const initial = state(params.initialState);
  const targetParts = ratio(params.targetRatio);
  const solved = solution(question);
  const changed = solved.changedComponent === "B" ? 1 : 0;
  const other = changed === 0 ? 1 : 0;
  const action = solved.adjustmentKind === "REMOVE" ? "remove" : "add";
  const amount = toRational(solved.quantity);
  const final = state(solved.finalState);
  const initialValues = [initial.componentA, initial.componentB] as const;
  const finalValues = [final.componentA, final.componentB] as const;
  const labels = question.diagram.before.map((item) => item.label);
  const targetOnePart = divideRational(
    initialValues[other],
    targetParts[other],
  );
  const requiredChanged = multiplyRational(
    targetOnePart,
    targetParts[changed],
  );
  const difference =
    action === "add"
      ? `${rationalLatex(requiredChanged)}-${rationalLatex(initialValues[changed])}=${rationalLatex(amount)}`
      : `${rationalLatex(initialValues[changed])}-${rationalLatex(requiredChanged)}=${rationalLatex(amount)}`;
  return {
    stem: `A mixture contains ${mathQuantity(initial.componentA, unit)} of ${labels[0]} and ${mathQuantity(initial.componentB, unit)} of ${labels[1]}. Which single-item operation will change the ratio to ${mathRatio(targetParts)}?`,
    coreConcept: `Keep one item at its current quantity and use it to scale the target ratio. The required quantity of the other item shows whether it must be added or removed.`,
    formula: `Target one part ${equation(`=\\dfrac{\\text{constant item quantity}}{\\text{its target parts}}`)}.`,
    steps: [
      `Step 1: Keep ${labels[other]} at ${mathQuantity(initialValues[other], unit)}. In the target ratio it represents ${mathNumber(targetParts[other])} parts.`,
      `Step 2: Target one part ${equation(`=\\dfrac{${rationalLatex(initialValues[other])}}{${rationalLatex(targetParts[other])}}=${rationalLatex(targetOnePart)}`)} ${unit}.`,
      `Step 3: Required ${labels[changed]} ${equation(`=${rationalLatex(targetParts[changed])}\\times${rationalLatex(targetOnePart)}=${rationalLatex(requiredChanged)}`)} ${unit}.`,
      `Step 4: Current ${labels[changed]} is ${mathQuantity(initialValues[changed], unit)}, so ${action} ${equation(difference)} ${unit}.`,
    ],
    verification: `The operation gives ${mathQuantity(finalValues[0], unit)} and ${mathQuantity(finalValues[1], unit)}, whose ratio is ${mathRatio(targetParts)}.`,
    conclusion: `${capitalize(action)} ${mathQuantity(amount, unit, true)} of ${labels[changed]}.`,
    examShortcut: `Hold one item constant, scale the target ratio, and compare the required quantity of the other item with its current quantity.`,
    commonTrap: `Do not choose the operation by looking only at the ratio numbers. Convert the target ratio into actual quantities first.`,
    visual: normalizedVisual(
      question,
      `${capitalize(action)} ${formatRational(amount)} ${unit} of ${labels[changed]}`,
      `${capitalize(labels[other]!)} remains ${formatRational(initialValues[other])} ${unit}.`,
    ),
  };
}

function genericFields(question: MalCp002ReleasedQuestion): EditorialFields {
  const index = question.diagram.kind === "TWO_COMPONENT" ? changedIndex(question) : 0;
  const other = index === 0 ? 1 : 0;
  const changedLabel = question.diagram.before[index]?.label;
  const otherLabel = question.diagram.before[other]?.label;
  const stem = naturalStem(question);
  const steps = question.explanation.steps.map((step) =>
    cleanTeacherText(step, changedLabel, otherLabel),
  );
  const coreConcept = cleanTeacherText(
    question.explanation.coreConcept,
    changedLabel,
    otherLabel,
  );
  const formula = cleanTeacherText(
    question.explanation.formula,
    changedLabel,
    otherLabel,
  );
  const verification = cleanTeacherText(
    question.explanation.verification,
    changedLabel,
    otherLabel,
  );
  const conclusion = cleanTeacherText(
    question.explanation.conclusion,
    changedLabel,
    otherLabel,
  );
  const examShortcut = cleanTeacherText(
    question.explanation.examShortcut,
    changedLabel,
    otherLabel,
  );
  const commonTrap = cleanTeacherText(
    question.explanation.commonTrap,
    changedLabel,
    otherLabel,
  );
  return {
    stem,
    coreConcept,
    formula,
    steps,
    verification,
    conclusion,
    examShortcut,
    commonTrap,
    visual: normalizedVisual(question),
  };
}

function editorialFields(question: MalCp002ReleasedQuestion): EditorialFields {
  switch (question.traceability.familyId) {
    case "EXPLICIT_ADD_TO_TARGET":
      return explicitTargetFields(question, "add");
    case "EXPLICIT_REMOVE_TO_TARGET":
      return explicitTargetFields(question, "remove");
    case "TOTAL_RATIO_ADD_TO_TARGET":
    case "TOTAL_RATIO_REMOVE_TO_TARGET":
      return totalRatioTargetFields(question);
    case "REQUIRED_OPERATION_AND_QUANTITY":
      return operationChoiceFields(question);
    default:
      return genericFields(question);
  }
}

function displayAnswer(value: string): string {
  return mathify(value.replace(/\bpure\s+/giu, ""));
}

function buildReasoningGraph(fields: EditorialFields): MalReasoningGraph {
  const nodes: MalReasoningGraph["nodes"] = [
    {
      id: "given",
      kind: "GIVEN",
      text: fields.stem,
      dependsOn: [],
    },
    {
      id: "method",
      kind: "RELATION",
      text: fields.coreConcept,
      dependsOn: ["given"],
    },
  ];
  fields.steps.forEach((text, index) => {
    nodes.push({
      id: `step-${index + 1}`,
      kind: "DERIVATION",
      text,
      dependsOn: [index === 0 ? "method" : `step-${index}`],
    });
  });
  nodes.push({
    id: "verification",
    kind: "VERIFICATION",
    text: fields.verification,
    dependsOn: [`step-${fields.steps.length}`],
  });
  nodes.push({
    id: "conclusion",
    kind: "CONCLUSION",
    text: fields.conclusion,
    dependsOn: ["verification"],
  });
  return { nodes };
}

function explanationLines(
  question: MalCp002ReleasedQuestion,
  fields: EditorialFields,
): string[] {
  return [
    question.explanation.sectionTitles.coreConcept,
    fields.coreConcept,
    `Formula: ${fields.formula}`,
    question.explanation.sectionTitles.steps,
    ...fields.steps,
    `Quick check: ${fields.verification}`,
    `Final answer: ${fields.conclusion}`,
    question.explanation.sectionTitles.shortcut,
    serializeMalCp002RatioVisual(fields.visual),
    fields.examShortcut,
    question.explanation.sectionTitles.trap,
    fields.commonTrap.replace(/^Common trap:\s*/iu, ""),
  ];
}

function learnerText(fields: EditorialFields): string {
  return [
    fields.stem,
    fields.coreConcept,
    fields.formula,
    ...fields.steps,
    fields.verification,
    fields.conclusion,
    fields.examShortcut,
    fields.commonTrap,
  ].join("\n");
}

function hasRawDigitOutsideMath(value: string): boolean {
  const withoutMath = value
    .replace(/\$[^$]*\$/gu, "")
    .replace(/Step\s+\d+:/giu, "Step:");
  return /\d/u.test(withoutMath);
}

export function applyMalCp002EditorialRemediationV2(
  question: MalCp002ReleasedQuestion,
): MalCp002EditorialRemediationV2Question {
  const fields = editorialFields(question);
  const answer = displayAnswer(question.answer);
  const options = question.options.map(displayAnswer);
  const optionAudit = question.optionAudit.map((item, index) => ({
    ...item,
    text: options[index]!,
  }));
  const text = learnerText(fields);
  if (/alligation/iu.test(text)) {
    throw new Error(`${question.questionLanguageId}: alligation is forbidden in MAL-CP-002.`);
  }
  if (
    /\b(?:pure|counterpart|unaltered component|unchanged component|fixed counterpart)\b/iu.test(
      text,
    )
  ) {
    throw new Error(`${question.questionLanguageId}: engine jargon survived editorial remediation.`);
  }
  if (
    /^(?:A|An) (?:beverage maker|coffee roaster|fuel technician|site supervisor|pulse merchant|grain merchant|alloy maker|oil packer|depot worker|mill operator|tea seller)\b/iu.test(
      fields.stem,
    )
  ) {
    throw new Error(`${question.questionLanguageId}: synthetic occupational stem survived editorial remediation.`);
  }
  for (const value of [
    fields.stem,
    fields.formula,
    ...fields.steps,
    fields.verification,
    ...options,
  ]) {
    if (hasRawDigitOutsideMath(value)) {
      throw new Error(`${question.questionLanguageId}: unformatted learner number: ${value}`);
    }
  }
  if (/−|\|\s*\d/u.test(text)) {
    throw new Error(`${question.questionLanguageId}: raw minus or absolute-value notation survived remediation.`);
  }
  const explanationBase = {
    ...question.explanation,
    editorialRevisionId:
      MAL_CP002_EDITORIAL_REMEDIATION_V2.presentationRevisionId,
    methodName: MAL_CP002_EDITORIAL_REMEDIATION_V2.methodName,
    coreConcept: fields.coreConcept,
    formula: fields.formula,
    steps: fields.steps,
    verification: fields.verification,
    conclusion: fields.conclusion,
    examShortcut: fields.examShortcut,
    commonTrap: fields.commonTrap,
    ratioVisual: fields.visual,
  };
  return {
    ...question,
    presentationRevisionId:
      MAL_CP002_EDITORIAL_REMEDIATION_V2.presentationRevisionId,
    editorialAuthority:
      MAL_CP002_EDITORIAL_REMEDIATION_V2.editorialAuthority,
    stem: fields.stem,
    answer,
    options,
    optionAudit,
    explanationId: `${question.questionLanguageId}-EN-EDITORIAL-V2`,
    explanation: {
      ...explanationBase,
      lines: explanationLines(question, fields),
    },
    reasoningGraph: buildReasoningGraph(fields),
    diagram: fields.visual,
    validation: {
      ...question.validation,
      checks: [
        ...question.validation.checks,
        {
          name: "natural-exam-voice-v2",
          passed: true,
          message: "The stem uses direct competitive-exam voice without synthetic occupational role-play.",
        },
        {
          name: "conserved-ratio-part-v2",
          passed: true,
          message: "Ratio adjustment uses conserved parts or proportional retention, not alligation.",
        },
        {
          name: "teacher-language-v2",
          passed: true,
          message: "Learner-facing engine jargon is absent.",
        },
        {
          name: "mathjax-working-v2",
          passed: true,
          message: "Displayed values, units, ratios and arithmetic are enclosed in MathJax.",
        },
      ],
    },
    traceability: {
      ...question.traceability,
      presentationRevisionId:
        MAL_CP002_EDITORIAL_REMEDIATION_V2.presentationRevisionId,
      editorialAuthority:
        MAL_CP002_EDITORIAL_REMEDIATION_V2.editorialAuthority,
    },
  } as MalCp002EditorialRemediationV2Question;
}

export function runMalCp002EnglishEditorialRemediationV2Pipeline(
  input: {
    questionLanguageId?: MalCp002PermanentQlId | string;
    seed?: string;
    language?: "en";
  } = {},
): MalCp002EditorialRemediationV2Question {
  return applyMalCp002EditorialRemediationV2(
    runMalCp002EnglishReleasePipeline(input),
  );
}
