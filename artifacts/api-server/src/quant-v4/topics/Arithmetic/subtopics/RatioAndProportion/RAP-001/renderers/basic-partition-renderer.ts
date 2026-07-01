import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface BasicPartitionEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
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
    const ratioSum = ratios.reduce((sum, part) => sum + part, 0);
    const unitValue = Number(e.derivedValues.unitValue);
    return [
      { stepId: "step-1", type: "GOAL", narrative: `Sum of ratio terms`, mathLatex: `${ratios.join("+")}=${ratioSum}` },
      { stepId: "step-2", type: "FORMULA", narrative: `Value of one part`, mathLatex: `\\frac{${v.totalAmount}}{${ratioSum}}=${unitValue}` },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: `${target}'s share`, mathLatex: `${ratios[targetIndex]}\\times${unitValue}` },
      { stepId: "step-4", type: "SIMPLIFICATION", narrative: `=`, mathLatex: `${e.answer}` },
      { stepId: "step-5", type: "CONCLUSION", narrative: `Hence, ${target} receives ${e.answer}.` },
    ];
  }
}
