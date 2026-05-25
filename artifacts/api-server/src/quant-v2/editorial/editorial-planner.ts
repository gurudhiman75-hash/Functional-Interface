import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import type {
  EditorialPlan,
  EditorialStyle,
  ScenarioContext,
} from "./editorial-types";

const STYLE_ROTATION = [
  "exam_standard",
  "coaching",
  "compact",
  "shortcut_first",
] as const satisfies readonly EditorialStyle[];

function hashText(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function selectEditorialStyle(
  seed: number | string | undefined,
): EditorialStyle {
  const index = hashText(String(seed ?? 1)) % STYLE_ROTATION.length;
  return STYLE_ROTATION[index]!;
}

function askVariable(problem: CanonicalPercentageProblem) {
  if (problem.subtype === "election_margin") {
    if (problem.topology?.variant === "filtered_valid_vote_margin") {
      return "winnerVotes";
    }
    if (problem.topology?.variant === "turnout_margin") {
      return "registeredVoters";
    }
    return "totalVotes";
  }
  if (problem.subtype === "pass_fail") {
    return "totalMarks";
  }
  if (problem.subtype === "population_growth") {
    return "finalPopulation";
  }

  return "answer";
}

function revealStructure(
  problem: CanonicalPercentageProblem,
): EditorialPlan["revealStructure"] {
  if (problem.topology?.filteringChain) {
    return problem.topology.filteringChain.stages.length > 1
      ? "layered"
      : "filtered";
  }
  if (problem.topology?.remainingComponent) {
    return "remaining";
  }
  if (problem.topology?.multiEntity) {
    return "component";
  }

  return "direct";
}

export function createEditorialPlan(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  scenario: ScenarioContext;
  style?: EditorialStyle;
  seed?: number | string;
}): EditorialPlan {
  const style =
    input.style ?? selectEditorialStyle(input.seed);
  const variableNames = new Set([
    ...Object.keys(input.problem.variables),
    ...input.graph.steps.flatMap((step) => step.inputVariables),
  ]);

  return {
    style,
    scenario: input.scenario,
    informationOrder: [...variableNames],
    askVariable: askVariable(input.problem),
    revealStructure: revealStructure(input.problem),
    targetLength:
      style === "compact"
        ? "short"
        : input.problem.topology?.filteringChain
          ? "expanded"
          : "balanced",
  };
}
