import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

export class VariableReplacementRenderer implements ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const volume = Number(evidence.variables.initialVolume);
    const removedFirst = Number(evidence.variables.removedVolume1);
    const removedSecond = Number(evidence.variables.removedVolume2);
    const originalLiquid = String(evidence.variables.liquidA ?? "original liquid");
    const addedLiquid = String(evidence.variables.liquidB ?? "replacement liquid");
    const exactOriginalNumerator = Number(evidence.derivedValues.exactOriginalNumerator);
    const exactAddedNumerator = Number(evidence.derivedValues.exactAddedNumerator);
    const answer = cleanAnswer(evidence.answer);

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `First replacement leaves ${originalLiquid}.`,
        mathLatex: `${volume}-${removedFirst}=${volume - removedFirst}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: "Use the second retention fraction.",
        mathLatex: `1-\\frac{${removedSecond}}{${volume}}=\\frac{${volume - removedSecond}}{${volume}}`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: "Keep the ratio exact.",
        mathLatex: `${originalLiquid}:${addedLiquid}=${exactOriginalNumerator}:${exactAddedNumerator}`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: "Reduce the ratio.",
        mathLatex: `${exactOriginalNumerator}:${exactAddedNumerator}=${answer}`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `So, the final ${originalLiquid}:${addedLiquid} ratio is ${answer}.`,
      },
    ];
  }
}
