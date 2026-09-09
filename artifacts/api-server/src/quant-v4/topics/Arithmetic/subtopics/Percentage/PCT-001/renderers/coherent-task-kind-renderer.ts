import type {
  ExplanationEvidence,
  ExplanationRenderer,
  ExplanationStep,
} from "../../../../../common/explanation-engine";
import { TaskKindTeacherRenderer as LegacyMathRenderer } from "../../../../../common/teacher-renderer";

const TASK_RELATION: Record<string, string> = {
  percentToFraction: "Write the percentage over 100 and reduce the fraction.",
  valueAsPercent: "Compare the given value with the total on a base of 100.",
  directRelation: "The required quantity is the stated percentage of the base quantity.",
  moreToLess: "The percentage decrease must be measured on the larger quantity.",
  lessToMore: "The percentage increase must be measured on the smaller quantity.",
  ratioFromPercentEquality: "Equate the two percentage amounts and reverse the percentage coefficients to form the ratio.",
  reversePercent: "Work back from the stated percentage value to the full 100% value.",
  increaseNewValue: "Add the stated percentage increase to the original value.",
  decreaseNewValue: "Remove the stated percentage decrease from the original value.",
  reverseIncrease: "The final value represents more than 100% of the original value.",
  reverseDecrease: "The final value is the percentage left after the decrease.",
  increaseByAmount: "The added amount itself represents the stated percentage of the original value.",
  percentOfKnownNumber: "Both percentage amounts refer to the same underlying number.",
  differenceOfPercents: "The difference between the two percentage rates represents the given difference in value.",
  restoreAfterDecrease: "The lost amount must be restored on the smaller remaining base.",
  successiveIncrease: "The second increase acts on the value already increased once.",
  successiveChange: "Apply each percentage change to the value produced by the previous change.",
  compoundGrowth: "Each period multiplies the quantity by the same growth factor.",
  compoundDecay: "Each period leaves the same fraction of the previous value.",
  areaChange: "Area changes with both length and breadth, so both change factors must be combined.",
  squareAreaChange: "The area of a square changes as the square of its side.",
  invarianceDecrease: "The product of the two quantities must remain unchanged.",
  invarianceIncrease: "The product of the two quantities must remain unchanged.",
  restoreAfterIncrease: "The reduction is calculated on the increased value, not on the original base.",
  revenueChange: "Revenue depends on both the rate and the number of sales.",
  circleAreaDecrease: "The area of a circle changes as the square of its radius.",
  incomePartition: "Savings are the part left after all stated expenses are removed.",
  successiveExpense: "Each later expense is taken from the amount still remaining.",
  winnerVotes: "With two candidates, compare the winner's share with the complementary losing share.",
  cancelledVotes: "First account for invalid votes; only the valid votes are divided between the candidates.",
  passMarks: "First find the passing marks, then use the pass percentage to recover the maximum marks.",
  partToTotal: "Match the known part with the percentage of the total that it represents.",
  complementOfTotal: "The required group is the percentage left after removing the stated group.",
  moreMarksBase: "The larger score represents more than 100% of the smaller score, so work back to the base.",
  twoShareRemainder: "The final share is the percentage left after the first two shares.",
  loserVotes: "With two candidates, the winner receives the complementary share; their difference gives the margin percentage.",
  dilutionAddWater: "Adding only water leaves the amount of acid unchanged.",
  dryFromFresh: "Dry matter remains unchanged while water is removed.",
  addSolute: "Adding pure solute leaves the original amount of water unchanged.",
  dilutedPercent: "Adding water leaves the amount of alcohol unchanged while increasing total volume.",
  freshFromDry: "The solid matter is unchanged in the fresh and dry states.",
  addPureComponent: "Adding pure alcohol leaves the original non-alcohol part unchanged.",
  evaporationOriginal: "Only water evaporates, so the amount of sugar remains unchanged.",
  alloyComplement: "The second metal forms the percentage left after the stated metal percentage.",
};

function joinWorking(left?: string, right?: string) {
  const a = String(left ?? "").trim();
  const b = String(right ?? "").trim();
  if (!a) return b;
  if (!b) return a;
  return b.startsWith("=") ? `${a}${b}` : `${a}\\quad ${b}`;
}

/**
 * PCT-001 adapter for the shared arithmetic engine.
 *
 * The legacy shared renderer remains the source of deterministic mathematics,
 * but this adapter removes the mechanical Given/Calculation/=/Answer shell.
 * Learners instead see one relation, the actual working, and the conclusion.
 */
export class CoherentPct001TaskKindRenderer implements ExplanationRenderer {
  private readonly legacy: LegacyMathRenderer;

  constructor(
    private readonly taskKind: string,
    solverMathJax: Record<string, string>,
  ) {
    this.legacy = new LegacyMathRenderer(taskKind, solverMathJax);
  }

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const raw = this.legacy.render(evidence);
    const context = String(evidence.entities.reasoningContext ?? "").trim();
    const relation = context || TASK_RELATION[this.taskKind];
    if (!relation) {
      throw new Error(`PCT-001 coherent relation missing for taskKind: ${this.taskKind}`);
    }

    const firstMath = raw[0]?.mathLatex ?? "";
    const workingMath = joinWorking(raw[1]?.mathLatex, raw[2]?.mathLatex);
    const conclusion = raw[4]?.narrative?.trim() || `Hence, the required answer is ${evidence.answer}.`;

    return [
      {
        stepId: "relation",
        type: "GOAL",
        narrative: relation,
        mathLatex: firstMath,
      },
      {
        stepId: "working",
        type: "SIMPLIFICATION",
        narrative: "This gives",
        mathLatex: workingMath,
      },
      {
        stepId: "conclusion",
        type: "CONCLUSION",
        narrative: conclusion,
      },
    ];
  }
}
