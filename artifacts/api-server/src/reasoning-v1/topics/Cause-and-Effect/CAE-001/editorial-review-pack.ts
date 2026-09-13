import { generateCaeQuestion } from "./chapter-generator.ts";
import { CAE_PROVISIONAL_QL_IDS, type CaeDifficulty, type GeneratedCaeQuestion } from "./types.ts";

const DIFFICULTY_ORDER: readonly CaeDifficulty[] = ["EASY", "MEDIUM", "HARD"];
const LETTERS = ["A", "B", "C", "D", "E"] as const;

export type Cae001EditorialReviewSample = Readonly<{
  seed: number;
  question: GeneratedCaeQuestion;
}>;

/**
 * Frozen-V3 regression selection. The candidate pool keeps presentation-level
 * variation long enough to expose every generated difficulty band. Selection
 * itself still admits each semantic causal state at most once, so option/order
 * variation cannot consume another human-review slot.
 */
function selectForQl(qlId: (typeof CAE_PROVISIONAL_QL_IDS)[number]): readonly Cae001EditorialReviewSample[] {
  const generated: Cae001EditorialReviewSample[] = [];
  for (let seed = 0; seed < 5_000 && generated.length < 320; seed += 1) {
    generated.push({ seed, question: generateCaeQuestion({ qlId, locale: "en-IN", seed }) });
  }

  const availableDifficulties = new Set(generated.map((entry) => entry.question.difficulty));
  const selected: Cae001EditorialReviewSample[] = [];
  const selectedCausalStates = new Set<string>();
  const add = (entry: Cae001EditorialReviewSample | undefined) => {
    if (selected.length >= 10) return;
    if (entry && !selectedCausalStates.has(entry.question.causalStateId)) {
      selected.push(entry);
      selectedCausalStates.add(entry.question.causalStateId);
    }
  };
  const findUnseen = (predicate: (entry: Cae001EditorialReviewSample) => boolean) =>
    generated.find((entry) => predicate(entry) && !selectedCausalStates.has(entry.question.causalStateId));

  // Difficulty is a presentation property for some causal states. Choose a
  // fresh semantic state for every available band rather than discarding the
  // later rendering before selection starts.
  for (const difficulty of DIFFICULTY_ORDER) {
    if (availableDifficulties.has(difficulty)) add(findUnseen((entry) => entry.question.difficulty === difficulty));
  }

  // Then expose family breadth, again without reusing a causal state already
  // selected for another review purpose.
  for (const familyId of new Set(generated.map((entry) => entry.question.scenarioFamilyId))) {
    add(findUnseen((entry) => entry.question.scenarioFamilyId === familyId));
  }

  // Fill the quota with fresh semantic states only.
  for (const entry of generated) add(entry);

  if (selected.length !== 10) throw new Error(`${qlId}: editorial review selection did not reach ten distinct causal states.`);
  return Object.freeze(selected);
}

export const CAE_001_EDITORIAL_REALNESS_REVIEW: Readonly<Record<(typeof CAE_PROVISIONAL_QL_IDS)[number], readonly Cae001EditorialReviewSample[]>> = Object.freeze(
  Object.fromEntries(CAE_PROVISIONAL_QL_IDS.map((qlId) => [qlId, selectForQl(qlId)])) as Record<(typeof CAE_PROVISIONAL_QL_IDS)[number], readonly Cae001EditorialReviewSample[]>,
);

function difficultyEvidence(question: GeneratedCaeQuestion): string {
  const evidence = question.difficultyEvidence;
  return `distance=${evidence.causalDistance}; hiddenLinks=${evidence.hiddenLinks}; topology=${evidence.topologyComplexity}; credibleDistractors=${evidence.plausibleDistractors}; candidateBurden=${evidence.candidatePlausibilityBurden}; inference=${evidence.inferenceBurden}; score=${evidence.score}`;
}

function mechanisms(question: GeneratedCaeQuestion): string {
  return question.candidateComparisons.length === 0
    ? question.distractorMechanisms.join(", ")
    : question.candidateComparisons.map((candidate) => `${candidate.mechanism} (${candidate.editorialPlausibility})`).join(", ");
}

/** Render the frozen-V3 90-question regression pack. */
export function renderCae001EditorialRealnessReview(): string {
  const lines = [
    "# CAE-001 V3 editorial-realness regression pack",
    "",
    "Deterministic English (`en-IN`) frozen-V3 regression samples. There are ten semantically distinct generated causal states for each current CP/QL, with every available difficulty represented. Reviewed checkpoint overrides are rendered separately.",
  ];
  for (const qlId of CAE_PROVISIONAL_QL_IDS) {
    const samples = CAE_001_EDITORIAL_REALNESS_REVIEW[qlId];
    lines.push("", `## ${samples[0]!.question.checkpointId} / ${qlId}`);
    for (const { seed, question } of samples) {
      lines.push(
        "",
        `### ${question.difficulty} — seed ${seed}`,
        "",
        question.stem,
        "",
        ...question.options.map((option, index) => `${LETTERS[index]}. ${option}`),
        "",
        `**Answer:** ${LETTERS[question.correctIndex]}. ${question.options[question.correctIndex]}`,
        "",
        `**Explanation:** ${question.explanation}`,
        "",
        `**Family / variant:** ${question.scenarioFamilyId} / ${question.scenarioVariantId}`,
        `**causalStateId:** \`${question.causalStateId}\``,
        `**itemVariantId:** \`${question.itemVariantId}\``,
        `**Difficulty evidence:** ${difficultyEvidence(question)}`,
        `**Distractor mechanisms:** ${mechanisms(question)}`,
      );
    }
  }
  return `${lines.join("\n")}\n`;
}
