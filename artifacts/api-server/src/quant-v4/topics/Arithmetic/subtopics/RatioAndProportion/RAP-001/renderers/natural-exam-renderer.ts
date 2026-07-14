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
    const answerMath = cleanLatex(answer, answer);
    const setup = cleanLatex(this.solverMathJax.setupLatex, "\\text{given relation}");
    const calculation = cleanLatex(this.solverMathJax.calculationLatex, `${answer}`);

    return [
      { stepId: "step-1", type: "GOAL", narrative: `Concept: this question uses ${this.title.toLowerCase()}.`, mathLatex: setup },
      { stepId: "step-2", type: "FORMULA", narrative: "Why: use one common ratio scale.", mathLatex: setup },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: "Use the common term or total to fix one ratio unit.", mathLatex: setup },
      { stepId: "step-4", type: "SUBSTITUTION", narrative: "Evaluate the relation with the stated values.", mathLatex: calculation },
      { stepId: "step-5", type: "SIMPLIFICATION", narrative: "Reduce the result in the form requested.", mathLatex: calculation },
      { stepId: "step-6", type: "SIMPLIFICATION", narrative: "Check that it reproduces the stated relation or total.", mathLatex: calculation },
      { stepId: "step-7", type: "CONCLUSION", narrative: `Therefore, the requested value is ${answerMath}.`, mathLatex: answerMath },
    ];
  }
}
