import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import type { ReasoningStep } from "../reasoning/reasoning-graph-types";

export function contextualOutputLabel(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
) {
  const output = step.outputVariable ?? "";

  if (problem.subtype === "election_margin") {
    if (output === "validVotes") {
      return "Effective valid votes";
    }
    if (output === "votedVotes") {
      return "Votes polled";
    }
    if (output === "registeredVoters") {
      return "Registered voters";
    }
    if (step.type === "derive_remaining_component") {
      return "Votes remaining for other candidates";
    }
  }

  if (problem.subtype === "pass_fail") {
    if (step.descriptionKey.includes("remaining_required")) {
      return "Required percentage gap";
    }
    if (output === "scoredMarks" || output === "completedMarks") {
      return "Marks already secured";
    }
    if (output === "remainingMarksRequired" || output === "requiredMarks") {
      return "Required marks gap";
    }
  }

  if (problem.subtype === "population_growth") {
    if (output === "femaleAfterDecay") {
      return "Female population after decrease";
    }
    if (output === "maleAfterGrowth") {
      return "Male population after growth";
    }
    if (step.descriptionKey.includes("female_population_decay")) {
      return "Female population after decrease";
    }
    if (step.descriptionKey.includes("male_population_growth")) {
      return "Male population after growth";
    }
  }

  if (problem.subtype === "mixture_percentage") {
    if (output === "fixedComponent") {
      return "Water quantity";
    }
    if (output === "finalMixtureTotal") {
      return "Final mixture quantity";
    }
  }

  if (problem.subtype === "commission") {
    if (output === "baseCommission") return "Base commission";
    if (output === "excessCommission") return "Commission above base quota";
    if (output === "totalBonusRate") return "Total commission rate on excess sales";
    if (output === "excessSales") return "Sales above base quota";
    if (output === "totalCommission") return "Total commission";
    if (output === "totalSales") return "Total sales";
  }

  if (problem.subtype === "taxation") {
    if (output === "taxRateDifference") return "Tax rate difference";
    if (output === "taxDifference") return "Tax decrease";
    if (output === "income") return "Total taxable income";
  }

  if (problem.subtype === "venn_diagram") {
    if (output === "unionPct") return "Percentage in at least one subject";
    if (output === "nonePct") return "Percentage passing both subjects / failing neither";
    if (output === "total") return "Total students";
  }

  if (problem.subtype === "price_consumption") {
    if (output === "priceRatio") return "Price increase multiplier";
    if (output === "priceGap") return "Expenditure per unit difference";
    if (output === "newPriceIndex") return "New price index";
    if (output === "newExpenditureIndex") return "New expenditure index";
    if (output === "consumptionGap") return "Consumption difference";
    if (output === "consumptionIndex") return "New consumption index";
    if (output === "consumptionReduction") return "Reduction in consumption";
  }

  return undefined;
}
