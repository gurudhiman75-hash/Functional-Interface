import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface SimpleLinkageEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
}

export class SimpleLinkageRenderer implements ExplanationRenderer {
  constructor(_solverMathJax: Record<string, string>) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as SimpleLinkageEvidence;
    const v = e.variables;
    const rA1 = Number(v.ratioA1);
    const rB1 = Number(v.ratioB1);
    const rB2 = Number(v.ratioB2);
    const rC2 = Number(v.ratioC2);
    const linkedA = Number(e.derivedValues.linkedA);
    const linkedB = Number(e.derivedValues.linkedB);
    const linkedC = Number(e.derivedValues.linkedC);
    const personA = String(v.personA);
    const personB = String(v.personB);
    const personC = String(v.personC);
    const sharedB = rB1 * rB2;
    const rawA = rA1 * rB2;
    const rawC = rB1 * rC2;

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `Problem: align the ${personB} part.`,
        mathLatex: `${personA}:${personB}=${rA1}:${rB1},\\quad ${personB}:${personC}=${rB2}:${rC2}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `Why it applies: ${personB} refers to the same quantity in both ratios, so its two ratio values must be made equal.`,
        mathLatex: `${personA}:${personB}=(${rA1}\\times${rB2}):(${rB1}\\times${rB2})`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `Scale the second ratio too.`,
        mathLatex: `${personB}:${personC}=(${rB2}\\times${rB1}):(${rC2}\\times${rB1})`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `Now combine the aligned parts.`,
        mathLatex: `${rawA}:${sharedB}:${rawC}`,
      },
      {
        stepId: "step-5",
        type: "SIMPLIFICATION",
        narrative: `Method 2: reduce if possible.`,
        mathLatex: `${rawA}:${sharedB}:${rawC}=${linkedA}:${linkedB}:${linkedC}`,
      },
      {
        stepId: "step-6",
        type: "SIMPLIFICATION",
        narrative: `Check: both original pairwise ratios are preserved in ${linkedA}:${linkedB}:${linkedC}.`,
        mathLatex: `${linkedA}:${linkedB}:${linkedC}`,
      },
      {
        stepId: "step-7",
        type: "CONCLUSION",
        narrative: `Therefore, ${personA}:${personB}:${personC} is`,
        mathLatex: `${e.answer}`,
      },
    ];
  }
}
