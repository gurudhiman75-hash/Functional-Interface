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

  return undefined;
}
