import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

function cleanLatex(line: string | undefined, fallback: string) {
  return (line?.replace(/.*?:/, "")?.trim() || fallback).replace(/^\$+|\$+$/g, "");
}

export class NaturalExamRenderer implements ExplanationRenderer {
  constructor(
    private readonly title: string,
    private readonly solverMathJax: Record<string, string>,
  ) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const answer = evidence.answer;
    const setup = cleanLatex(this.solverMathJax.setupLatex, "\\text{given relation}");
    const calculation = cleanLatex(this.solverMathJax.calculationLatex, `${answer}`);

    return [
      { stepId: "step-1", type: "GOAL", narrative: `Concept: ${this.title}.`, mathLatex: setup },
      { stepId: "step-2", type: "FORMULA", narrative: "Why: use one common ratio unit.", mathLatex: setup },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: "Write the given relation.", mathLatex: setup },
      { stepId: "step-4", type: "SUBSTITUTION", narrative: "Insert the given numbers.", mathLatex: calculation },
      { stepId: "step-5", type: "SIMPLIFICATION", narrative: "Calculate and simplify.", mathLatex: calculation },
      { stepId: "step-6", type: "SIMPLIFICATION", narrative: "Check: the relation is preserved.", mathLatex: calculation },
      { stepId: "step-7", type: "CONCLUSION", narrative: `Therefore, the required value is ${answer}.`, mathLatex: `${answer}` },
    ];
  }
}
