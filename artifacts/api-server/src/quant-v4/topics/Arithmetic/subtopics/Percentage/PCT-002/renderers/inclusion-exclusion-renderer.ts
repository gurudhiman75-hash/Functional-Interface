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
        narrative: `Let the total population be 100%. We need to find the percentage belonging to at least one category.`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `Percentage belonging to at least one = 100% - Percentage belonging to neither.`,
        mathLatex: `100 - ${neitherPercentage} = ${atLeastOne}\\%`,
      },
      {
        stepId: "step-3",
        type: "FORMULA",
        narrative: `Using the set theory formula for intersections:`,
        mathLatex: `Both = n(${entityA}) + n(${entityB}) - n(\\text{At least one})`,
      },
      {
        stepId: "step-4",
        type: "SUBSTITUTION",
        narrative: `Substituting the given values:`,
        mathLatex: `Both = ${groupAPercentage} + ${groupBPercentage} - ${atLeastOne} = ${overlap}\\%`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `The final percentage of the population that belongs to both ${entityA} and ${entityB} is ${overlap}%.`,
      },
    ];
  }
}
