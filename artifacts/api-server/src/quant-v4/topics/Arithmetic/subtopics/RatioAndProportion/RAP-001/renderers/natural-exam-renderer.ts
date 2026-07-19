import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

function cleanTaggedLatex(line: string | undefined, fallback: string) {
  const value = line?.trim() || fallback;
  return value
    .replace(/^\$+|\$+$/g, "")
    .replace(/^(?:\\text\{[^}]+\}|[A-Za-z ]+)\s*:\s*/, "")
    .trim();
}

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

export class NaturalExamRenderer implements ExplanationRenderer {
  constructor(
    private readonly title: string,
    private readonly solverMathJax: Record<string, string>,
  ) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const answerMath = cleanAnswer(evidence.answer);
    const setup = cleanTaggedLatex(this.solverMathJax.setupLatex, "\\text{given relation}");
    const calculation = cleanTaggedLatex(this.solverMathJax.calculationLatex, answerMath);

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `Start by ${this.title.toLowerCase()}.`,
        mathLatex: setup,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: "Use the relation in the question.",
        mathLatex: setup,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: "Substituting the stated numbers gives",
        mathLatex: calculation,
      },
      {
        stepId: "step-4",
        type: "CONCLUSION",
        narrative: "So, the answer is",
        mathLatex: answerMath,
      },
    ];
  }
}
