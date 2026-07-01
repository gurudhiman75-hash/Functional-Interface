import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface InclusionExclusionEvidence extends ExplanationEvidence {
  variables: {
    groupAPercentage: number;
    groupBPercentage: number;
    neitherPercentage: number;
  };
  derivedValues: {
    atLeastOne: number;
    overlap: number;
  };
  entities: {
    entityA: string;
    entityB: string;
  };
}

export class InclusionExclusionRenderer implements ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as InclusionExclusionEvidence;
    const { groupAPercentage, groupBPercentage, neitherPercentage } = e.variables;
    const { atLeastOne, overlap } = e.derivedValues;
    const entityA = e.entities.entityA || "the first subject";
    const entityB = e.entities.entityB || "the second subject";

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `At least one of ${entityA} or ${entityB}`,
        mathLatex: `100-${neitherPercentage}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `=`,
        mathLatex: `100 - ${neitherPercentage} = ${atLeastOne}\\%`,
      },
      {
        stepId: "step-3",
        type: "FORMULA",
        narrative: `Both ${entityA} and ${entityB}`,
        mathLatex: `${groupAPercentage}+${groupBPercentage}-${atLeastOne}`,
      },
      {
        stepId: "step-4",
        type: "SUBSTITUTION",
        narrative: `=`,
        mathLatex: `${overlap}\\%`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `Hence, ${overlap}% belong to both ${entityA} and ${entityB}.`,
      },
    ];
  }
}
