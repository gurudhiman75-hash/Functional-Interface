import type { QuantMotif } from "./types";
import {
  quantTopicMotifs,
} from "./quant";

export const practicalQuantPolicies = {
  examRealismPolicies: [
    "prefer compact exam-style arithmetic phrasing",
    "avoid decorative wording when a direct competitive-exam statement is cleaner",
  ],
  arithmeticCleanlinessRules: [
    "prefer integral or short-decimal intermediate values",
    "avoid degenerate edge cases that trivialize the target",
  ],
  difficultyOrchestration: [
    "easy relies on direct transformation with clean numbers",
    "medium adds one hidden dependency or normalization step",
    "hard prefers chained inference over bigger raw numbers",
  ],
  wordingPolicies: [
    "keep stems readable and exam-oriented",
    "let motifs shape reasoning, not verbose narration",
  ],
  motifWeightingPreferences: [
    "prefer hidden-base and weighted inference motifs for medium/hard generation",
    "penalize repetitive direct templates across consecutive generations",
  ],
  crossTopicGenerationControls: [
    "rotate motif groups to improve diversity",
    "reuse topic-specific parameter rules instead of ad hoc global tuning",
  ],
} as const;

export const practicalQuantMotifs: QuantMotif[] =
  quantTopicMotifs;

export { quantTopicMotifs } from "./quant";
export {
  fundamentalsMotifs,
  numberSystemMotifs,
  percentageMotifs,
  ratioProportionMotifs,
  averagesMotifs,
  profitLossMotifs,
  simpleCompoundInterestMotifs,
  simpleInterestMotifs,
  compoundInterestMotifs,
  timeWorkMotifs,
  speedDistanceMotifs,
  mixtureAlligationMotifs,
  algebraBasicsMotifs,
  mensurationMotifs,
} from "./quant";
