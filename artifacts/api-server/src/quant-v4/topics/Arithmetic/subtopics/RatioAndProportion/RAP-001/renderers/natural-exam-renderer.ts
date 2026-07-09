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
      { stepId: "step-1", type: "GOAL", narrative: `Problem: ${this.title}.`, mathLatex: setup },
      { stepId: "step-2", type: "FORMULA", narrative: `Method 1: form the relation.`, mathLatex: setup },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: `Step 1: put values.`, mathLatex: calculation },
      { stepId: "step-4", type: "SIMPLIFICATION", narrative: `Method 2: shortcut check.`, mathLatex: calculation },
      { stepId: "step-5", type: "CONCLUSION", narrative: `Answer:`, mathLatex: `${answer}` },
    ];
  }
}
