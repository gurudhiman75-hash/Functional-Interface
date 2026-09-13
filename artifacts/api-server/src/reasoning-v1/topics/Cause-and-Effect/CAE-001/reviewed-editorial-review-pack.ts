import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_PROVISIONAL_QL_IDS, type CaeDifficulty, type GeneratedCaeQuestion } from "./types.ts";

const DIFFICULTY_ORDER: readonly CaeDifficulty[] = ["EASY", "MEDIUM", "HARD"];
const LETTERS = ["A", "B", "C", "D", "E"] as const;

export type Cae001ReviewedEditorialSample = Readonly<{
  seed: number;
  question: GeneratedCaeQuestion;
}>;

function selectForQl(qlId: (typeof CAE_PROVISIONAL_QL_IDS)[number]): readonly Cae001ReviewedEditorialSample[] {
  const generated: Cae001ReviewedEditorialSample[] = [];
  const seenCausalStates = new Set<string>();
  for (let seed = 0; seed < 5_000 && generated.length < 320; seed += 1) {
    const question = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    if (!seenCausalStates.has(question.causalStateId)) {
      seenCausalStates.add(question.causalStateId);
      generated.push({ seed, question });
    }
  }
  const availableDifficulties = new Set(generated.map((entry) => entry.question.difficulty));
  const selected: Cae001ReviewedEditorialSample[] = [];
  const selectedCausalStates = new Set<string>();
  const add = (entry: Cae001ReviewedEditorialSample | undefined) => {
    if (entry && !selectedCausalStates.has(entry.question.causalStateId)) {
      selected.push(entry);
      selectedCausalStates.add(entry.question.causalStateId);
    }
  };
  for (const difficulty of DIFFICULTY_ORDER) if (availableDifficulties.has(difficulty)) add(generated.find((entry) => entry.question.difficulty === difficulty));
  for (const familyId of new Set(generated.map((entry) => entry.question.scenarioFamilyId))) add(generated.find((entry) => entry.question.scenarioFamilyId === familyId));
  for (const entry of generated) {
    add(entry);
    if (selected.length === 10) break;
  }
  if (selected.length !== 10) throw new Error(`${qlId}: reviewed editorial selection did not reach ten distinct causal states.`);
  return Object.freeze(selected);
}

export const CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW: Readonly<Record<(typeof CAE_PROVISIONAL_QL_IDS)[number], readonly Cae001ReviewedEditorialSample[]>> = Object.freeze(
  Object.fromEntries(CAE_PROVISIONAL_QL_IDS.map((qlId) => [qlId, selectForQl(qlId)])) as Record<(typeof CAE_PROVISIONAL_QL_IDS)[number], readonly Cae001ReviewedEditorialSample[]>,
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

export function renderCae001ReviewedEditorialRealnessReview(): string {
  const lines = [
    "# CAE-001 reviewed editorial-realness pack",
    "",
    "Deterministic English (`en-IN`) review-only samples. Ten distinct causal states are selected per CP/QL. CP-007 uses the reviewed false-causation/common-factor authorities while the frozen V3 regression pack remains separate.",
  ];
  for (const qlId of CAE_PROVISIONAL_QL_IDS) {
    const samples = CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW[qlId];
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
