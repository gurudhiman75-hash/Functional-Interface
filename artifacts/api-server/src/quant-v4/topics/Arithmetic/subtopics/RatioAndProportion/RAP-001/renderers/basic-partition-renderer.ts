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
        narrative: "First add the ratio parts.",
        mathLatex: `${ratios.join("+")}=${ratioSum}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: "Divide the total by the number of parts to find the value of one part.",
        mathLatex: `\\frac{${v.totalAmount}}{${ratioSum}}=${unitValue}`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `${target} corresponds to ${targetPart} ratio parts.`,
        mathLatex: `${targetPart}\\times${unitValue}=${answer}`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `Thus, the share for ${target} is`,
        mathLatex: answer,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: "So, the required share is",
        mathLatex: answer,
      },
    ];
  }
}
