import { CAE_001_SATURATION_WAVE1_FAMILIES } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES } from "./causal-world-saturation-wave2.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_PROVISIONAL_QL_IDS, type CaeDifficulty, type GeneratedCaeQuestion } from "./types.ts";

const DIFFICULTY_ORDER: readonly CaeDifficulty[] = ["EASY", "MEDIUM", "HARD"];
const LETTERS = ["A", "B", "C", "D", "E"] as const;
const SATURATION_FAMILY_IDS = new Set([...CAE_001_SATURATION_WAVE1_FAMILIES, ...CAE_001_SATURATION_WAVE2_FAMILIES].map((family) => family.id));
const CONTROLLED_SATURATION_QL_IDS = new Set(["CAE-QL-003", "CAE-QL-004", "CAE-QL-005", "CAE-QL-008", "CAE-QL-009"] as const);
const CONTROLLED_REVIEW_SATURATION_MAX = 2;

export type Cae001ReviewedEditorialSample = Readonly<{
  seed: number;
  question: GeneratedCaeQuestion;
}>;

function operationKey(question: GeneratedCaeQuestion): string {
  const parts = question.causalStructure.split(":");
  if (question.qlId === "CAE-QL-006") return `${question.projectionId}:${parts[0] ?? ""}`;
  if (question.qlId === "CAE-QL-008" || question.qlId === "CAE-QL-009") return `${question.projectionId}:${parts[1] ?? parts[0] ?? ""}`;
  return question.projectionId;
}

function selectForQl(qlId: (typeof CAE_PROVISIONAL_QL_IDS)[number]): readonly Cae001ReviewedEditorialSample[] {
  const generated: Cae001ReviewedEditorialSample[] = [];
  for (let seed = 0; seed < 5_000 && generated.length < 320; seed += 1) {
    generated.push({ seed, question: generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed }) });
  }

  const availableDifficulties = new Set(generated.map((entry) => entry.question.difficulty));
  const selected: Cae001ReviewedEditorialSample[] = [];
  const selectedCausalStates = new Set<string>();
  const saturationCapped = CONTROLLED_SATURATION_QL_IDS.has(qlId as never);
  const saturationSelected = () => selected.filter((entry) => SATURATION_FAMILY_IDS.has(entry.question.scenarioFamilyId)).length;
  const canAdd = (entry: Cae001ReviewedEditorialSample) => !(
    saturationCapped
    && SATURATION_FAMILY_IDS.has(entry.question.scenarioFamilyId)
    && saturationSelected() >= CONTROLLED_REVIEW_SATURATION_MAX
  );
  const add = (entry: Cae001ReviewedEditorialSample | undefined) => {
    if (selected.length >= 10) return;
    if (entry && canAdd(entry) && !selectedCausalStates.has(entry.question.causalStateId)) {
      selected.push(entry);
      selectedCausalStates.add(entry.question.causalStateId);
    }
  };
  const findUnseen = (predicate: (entry: Cae001ReviewedEditorialSample) => boolean) =>
    generated.find((entry) => predicate(entry) && canAdd(entry) && !selectedCausalStates.has(entry.question.causalStateId));

  for (const difficulty of DIFFICULTY_ORDER) {
    if (availableDifficulties.has(difficulty)) add(findUnseen((entry) => entry.question.difficulty === difficulty));
  }

  for (const key of new Set(generated.map((entry) => operationKey(entry.question)))) {
    add(findUnseen((entry) => operationKey(entry.question) === key));
  }

  for (const familyId of new Set(generated.map((entry) => entry.question.scenarioFamilyId))) {
    add(findUnseen((entry) => entry.question.scenarioFamilyId === familyId));
  }

  for (const entry of generated) add(entry);

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
    "Deterministic English (`en-IN`) review-only samples. Ten distinct causal states are selected per CP/QL with difficulty, learner-operation and family breadth prioritised. QLs using controlled saturation keep that expansion to at most two of ten review samples so the pack mirrors the intended reviewed allocation. CP007 remains on its inference-calibrated specialised renderers. The frozen V3 regression pack remains separate.",
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
        `**Projection / operation:** ${question.projectionId} / ${operationKey(question)}`,
        `**causalStateId:** \`${question.causalStateId}\``,
        `**itemVariantId:** \`${question.itemVariantId}\``,
        `**Difficulty evidence:** ${difficultyEvidence(question)}`,
        `**Distractor mechanisms:** ${mechanisms(question)}`,
      );
    }
  }
  return `${lines.join("\n")}\n`;
}
