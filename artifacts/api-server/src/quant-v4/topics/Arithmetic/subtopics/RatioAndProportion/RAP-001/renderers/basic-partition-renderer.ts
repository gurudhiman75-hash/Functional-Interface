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
      { stepId: "step-1", type: "GOAL", narrative: "Concept: a ratio partition splits one total into equal ratio units.", mathLatex: `${ratios.join(":")}` },
      { stepId: "step-2", type: "FORMULA", narrative: "Why: every ratio part is one equal unit.", mathLatex: `${ratios.join(":")}` },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: "Count all ratio parts.", mathLatex: `${ratios.join("+")}=${ratioSum}` },
      { stepId: "step-4", type: "FORMULA", narrative: "Divide the total by that count to find one unit.", mathLatex: `\\frac{${v.totalAmount}}{${ratioSum}}=${unitValue}` },
      { stepId: "step-5", type: "SUBSTITUTION", narrative: `${target} receives ${ratios[targetIndex]} units.`, mathLatex: `${ratios[targetIndex]}\\times${unitValue}` },
      { stepId: "step-6", type: "SIMPLIFICATION", narrative: "The recovered shares add back to the total.", mathLatex: `${e.answer}` },
      { stepId: "step-7", type: "CONCLUSION", narrative: `Therefore, ${target} receives ${e.answer}.` },
    ];
  }
}
