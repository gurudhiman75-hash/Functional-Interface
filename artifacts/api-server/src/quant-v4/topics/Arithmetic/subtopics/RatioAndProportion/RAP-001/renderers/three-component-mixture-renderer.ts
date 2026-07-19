import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface ThreeComponentMixtureEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
}

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

function display(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}

export class ThreeComponentMixtureRenderer implements ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as ThreeComponentMixtureEvidence;
    const ratio1 = Number(e.variables.ratio1);
    const ratio2 = Number(e.variables.ratio2);
    const ratio3 = Number(e.variables.ratio3);
    const finalRatio1 = Number(e.variables.finalRatio1);
    const finalRatio2 = Number(e.variables.finalRatio2);
    const addedAmount = Number(e.variables.addedAmount);
    const unit = Number(e.derivedValues.unit);
    const ratioSum = ratio1 + ratio2 + ratio3;
    const coefficient = finalRatio2 * ratio1 / finalRatio1 - ratio2;
    const total = ratioSum * unit;
    const answer = cleanAnswer(e.answer);

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: "Let each part of the original ratio be x litres.",
        mathLatex: `${ratio1}x:${ratio2}x:${ratio3}x`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: "The first component is unchanged, so it fixes the scale of the new ratio.",
        mathLatex: `\text{new scale}=\frac{${ratio1}x}{${finalRatio1}}`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `After adding ${addedAmount} litres to the second component,`,
        mathLatex: `${ratio2}x+${addedAmount}=${finalRatio2}\left(\frac{${ratio1}x}{${finalRatio1}}\right)`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: "Solving this equation gives one original ratio part.",
        mathLatex: `${display(coefficient)}x=${addedAmount}\Rightarrow x=${display(unit)}`,
      },
      {
        stepId: "step-5",
        type: "SUBSTITUTION",
        narrative: `The original ratio has ${ratioSum} parts in total.`,
        mathLatex: `(${ratio1}+${ratio2}+${ratio3})\times${display(unit)}=${display(total)}`,
      },
      {
        stepId: "step-6",
        type: "CONCLUSION",
        narrative: "So, the starting volume is",
        mathLatex: answer,
      },
    ];
  }
}
