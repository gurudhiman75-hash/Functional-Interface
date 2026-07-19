import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface SimpleLinkageEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function lcm(a: number, b: number) {
  return Math.abs(a * b) / gcd(a, b);
}

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
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
    const answer = cleanAnswer(e.answer);

    if (rB1 === rB2) {
      return [
        {
          stepId: "step-1",
          type: "GOAL",
          narrative: `The ${personB} part is already ${rB1} in both ratios.`,
          mathLatex: `${personA}:${personB}=${rA1}:${rB1},\\quad ${personB}:${personC}=${rB2}:${rC2}`,
        },
        {
          stepId: "step-2",
          type: "FORMULA",
          narrative: "The two ratios can therefore be joined directly.",
          mathLatex: `${personA}:${personB}:${personC}=${rA1}:${rB1}:${rC2}`,
        },
        {
          stepId: "step-3",
          type: "SUBSTITUTION",
          narrative: "The three-part ratio is already in simplest form.",
          mathLatex: `${linkedA}:${linkedB}:${linkedC}`,
        },
        {
          stepId: "step-4",
          type: "CONCLUSION",
          narrative: `So, ${personA}:${personB}:${personC} is`,
          mathLatex: answer,
        },
      ];
    }

    const commonPart = lcm(rB1, rB2);
    const firstMultiplier = commonPart / rB1;
    const secondMultiplier = commonPart / rB2;
    const alignedA = rA1 * firstMultiplier;
    const alignedC = rC2 * secondMultiplier;

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `Make the ${personB} part equal in both ratios.`,
        mathLatex: `${personA}:${personB}=${rA1}:${rB1},\\quad ${personB}:${personC}=${rB2}:${rC2}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `The least common value of the two ${personB} parts is ${commonPart}.`,
        mathLatex: `\\operatorname{LCM}(${rB1},${rB2})=${commonPart}`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: "Scale the first ratio.",
        mathLatex: `${personA}:${personB}=(${rA1}\\times${firstMultiplier}):(${rB1}\\times${firstMultiplier})=${alignedA}:${commonPart}`,
      },
      {
        stepId: "step-4",
        type: "SUBSTITUTION",
        narrative: "Scale the second ratio.",
        mathLatex: `${personB}:${personC}=(${rB2}\\times${secondMultiplier}):(${rC2}\\times${secondMultiplier})=${commonPart}:${alignedC}`,
      },
      {
        stepId: "step-5",
        type: "SIMPLIFICATION",
        narrative: "Join the aligned ratios and reduce if necessary.",
        mathLatex: `${alignedA}:${commonPart}:${alignedC}=${linkedA}:${linkedB}:${linkedC}`,
      },
      {
        stepId: "step-6",
        type: "CONCLUSION",
        narrative: `So, ${personA}:${personB}:${personC} is`,
        mathLatex: answer,
      },
    ];
  }
}
