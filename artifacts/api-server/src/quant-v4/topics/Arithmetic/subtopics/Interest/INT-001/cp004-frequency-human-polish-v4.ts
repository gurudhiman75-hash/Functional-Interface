import { deepFreeze, type Cp004Explanation, type Cp004MathematicalState, type Cp004Representation } from "./cp004-frequency-math";

type Presentation = Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }>;

const OBSERVED_VALUE_LABEL: Readonly<Partial<Record<Cp004MathematicalState["qlId"], string>>> = Object.freeze({
  "INT-QL-067": "Maturity amount",
  "INT-QL-068": "Compound interest",
  "INT-QL-069": "Maturity amount",
  "INT-QL-070": "Compound interest",
  "INT-QL-071": "Maturity amount",
  "INT-QL-072": "Maturity amount",
  "INT-QL-073": "Maturity amount",
  "INT-QL-074": "Compound interest",
});

export function polishCp004PresentationHumanV4(
  state: Cp004MathematicalState,
  presentation: Presentation,
): Presentation {
  const label = OBSERVED_VALUE_LABEL[state.qlId];
  if (!label || !presentation.stem.includes("Observed / required value")) return presentation;
  return deepFreeze({
    ...presentation,
    stem: presentation.stem.replace(/Observed \/ required value/gu, label),
  });
}

function plainLanguage(text: string): string {
  return text
    .replace(/Use a reference principal of ₹100\./gu, "Suppose the original sum were ₹100.")
    .replace(/Start with a reference principal of ₹100\./gu, "Suppose the original sum were ₹100.")
    .replace(/reference principal/giu, "₹100 example")
    .replace(/The exact A\/P ratio is ([0-9]+\/[0-9]+)\./gu, "In fraction form, the final amount is $1 of the original sum.")
    .replace(/The exact CI\/P ratio is ([0-9]+\/[0-9]+)\./gu, "In fraction form, the interest is $1 of the original sum.")
    .replace(/A\/P ratio/gu, "final amount compared with the original sum")
    .replace(/CI\/P ratio/gu, "interest compared with the original sum")
    .replace(/Use the annual-rate choices in the exact two-stage rule\./gu, "Check the annual-rate choices using the two stages stated in the question.")
    .replace(/the exact two-stage rule/giu, "the two stages stated in the question")
    .replace(
      /Do not use the unknown principal to manufacture the amount ratio\./gu,
      "Do not guess the original sum from the final amount. First see what ₹100 would become, then scale back to the given final amount.",
    )
    .replace(/exact amount ratio/giu, "exact comparison between the final amount and the original sum")
    .replace(/amount ratio/giu, "comparison between the final amount and the original sum");
}

export function polishCp004ExplanationHumanV4(
  _state: Cp004MathematicalState,
  explanation: Cp004Explanation,
): Cp004Explanation {
  return deepFreeze({
    ...explanation,
    whatAsked: plainLanguage(explanation.whatAsked),
    steps: Object.freeze(explanation.steps.map(plainLanguage)),
    finalAnswer: plainLanguage(explanation.finalAnswer),
    commonMistake: plainLanguage(explanation.commonMistake),
  });
}
