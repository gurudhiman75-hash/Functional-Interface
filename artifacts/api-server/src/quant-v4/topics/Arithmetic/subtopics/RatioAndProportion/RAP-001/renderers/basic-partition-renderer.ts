import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface BasicPartitionEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
}

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

export class BasicPartitionRenderer implements ExplanationRenderer {
  constructor(_solverMathJax: Record<string, string>) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as BasicPartitionEvidence;
    const v = e.variables;
    const ratios = [Number(v.ratioA), Number(v.ratioB), Number(v.ratioC)];
    const names = [String(v.personA), String(v.personB), String(v.personC)];
    const target = String(v.targetPerson);
    const targetIndex = names.indexOf(target);
    const targetPart = ratios[targetIndex]!;
    const ratioSum = ratios.reduce((sum, part) => sum + part, 0);
    const unitValue = Number(e.derivedValues.unitValue);
    const answer = cleanAnswer(e.answer);

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: "Add the ratio parts.",
        mathLatex: `${ratios.join("+")}=${ratioSum}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: "Find one part.",
        mathLatex: `\\frac{${v.totalAmount}}{${ratioSum}}=${unitValue}`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `${target} has ${targetPart} parts.`,
        mathLatex: `${targetPart}\\times${unitValue}=${answer}`,
      },
      {
        stepId: "step-4",
        type: "CONCLUSION",
        narrative: `So, ${target}'s share is ${answer}.`,
      },
    ];
  }
}
