import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface DirectRelationEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
}

export class DirectRelationRenderer implements ExplanationRenderer {
  private solverMathJax: Record<string, string>;

  constructor(solverMathJax: Record<string, string>) {
    this.solverMathJax = solverMathJax;
  }

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as DirectRelationEvidence;
    const answer = e.answer;
    const setup = this.solverMathJax.setupLatex?.replace(/.*?:/, "")?.trim() || "\\text{Formula setup}";
    const calc = this.solverMathJax.calculationLatex?.replace(/.*?:/, "")?.trim() || `${answer}`;

    const variantIndex = (Number(Object.values(e.variables)[0] || 0)) % 3;

    if (variantIndex === 0) {
      return [
        { stepId: "step-1", type: "GOAL", narrative: `We need to calculate the target value for this problem.` },
        { stepId: "step-2", type: "FORMULA", narrative: `Using the appropriate formula:`, mathLatex: setup.replace(/^\$+|\$+$/g, "") },
        { stepId: "step-3", type: "SUBSTITUTION", narrative: `Substitute the values:`, mathLatex: calc.replace(/^\$+|\$+$/g, "") },
        { stepId: "step-4", type: "SIMPLIFICATION", narrative: `Simplify the expression to get the result.` },
        { stepId: "step-5", type: "CONCLUSION", narrative: `Thus, the answer is ${answer}.` },
      ];
    } else if (variantIndex === 1) {
       return [
        { stepId: "step-1", type: "GOAL", narrative: `Let's determine the final amount for the scenario.` },
        { stepId: "step-2", type: "FORMULA", narrative: `The mathematical relationship is:`, mathLatex: setup.replace(/^\$+|\$+$/g, "") },
        { stepId: "step-3", type: "SUBSTITUTION", narrative: `Inserting the given numbers:`, mathLatex: calc.replace(/^\$+|\$+$/g, "") },
        { stepId: "step-4", type: "SIMPLIFICATION", narrative: `Solving it yields the final answer.` },
        { stepId: "step-5", type: "CONCLUSION", narrative: `The computed result is ${answer}.` },
      ];
    } else {
       return [
        { stepId: "step-1", type: "GOAL", narrative: `Our objective is to find the required quantity.` },
        { stepId: "step-2", type: "FORMULA", narrative: `We apply the standard rule:`, mathLatex: setup.replace(/^\$+|\$+$/g, "") },
        { stepId: "step-3", type: "SUBSTITUTION", narrative: `Plugging in the parameters:`, mathLatex: calc.replace(/^\$+|\$+$/g, "") },
        { stepId: "step-4", type: "SIMPLIFICATION", narrative: `Calculating the final value.` },
        { stepId: "step-5", type: "CONCLUSION", narrative: `Therefore, we get ${answer}.` },
      ];
    }
  }
}
