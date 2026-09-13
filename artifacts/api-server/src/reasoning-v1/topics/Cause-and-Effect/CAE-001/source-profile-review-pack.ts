import {
  CAE_SOURCE_PROFILE_AUTHORITIES,
  CaeSourceProfileIncompatibleError,
  generateCaeSourceProfileQuestion,
  type CaeSourceProfileId,
  type GeneratedCaeSourceProfileQuestion,
} from "./source-profiles.ts";
import type { CaeQlId } from "./types.ts";

const LETTERS = ["A", "B", "C", "D", "E"] as const;

export type Cae001SourceProfileReviewSample = Readonly<{
  seed: number;
  question: GeneratedCaeSourceProfileQuestion;
}>;

const QL_BY_PROFILE: Readonly<Record<CaeSourceProfileId, readonly CaeQlId[]>> = Object.freeze({
  CLASSIC_BANK_FIVE_RELATION: ["CAE-QL-001", "CAE-QL-002"],
  PUNJAB_POLICE_SI_2016_FOUR_RELATION: ["CAE-QL-001", "CAE-QL-002"],
  SSC_SELECTION_POST_DIRECT_RECOGNITION: ["CAE-QL-001"],
});

function collect(profileId: CaeSourceProfileId): readonly Cae001SourceProfileReviewSample[] {
  const pool: Cae001SourceProfileReviewSample[] = [];
  const seenStates = new Set<string>();
  for (const qlId of QL_BY_PROFILE[profileId]) {
    for (let seed = 0; seed < 5_000 && pool.length < 200; seed += 1) {
      try {
        const question = generateCaeSourceProfileQuestion({ qlId, locale: "en-IN", seed, sourceProfileId: profileId });
        if (!seenStates.has(question.causalStateId)) {
          seenStates.add(question.causalStateId);
          pool.push({ seed, question });
        }
      } catch (error) {
        if (!(error instanceof CaeSourceProfileIncompatibleError)) throw error;
      }
    }
  }

  const selected: Cae001SourceProfileReviewSample[] = [];
  const selectedStates = new Set<string>();
  const add = (entry: Cae001SourceProfileReviewSample | undefined) => {
    if (entry && !selectedStates.has(entry.question.causalStateId)) {
      selected.push(entry);
      selectedStates.add(entry.question.causalStateId);
    }
  };

  // For paired profiles, expose every answer relationship supported by the source schema first.
  const authority = CAE_SOURCE_PROFILE_AUTHORITIES[profileId];
  for (const relationshipId of authority.relationshipIds) add(pool.find((entry) => entry.question.answerId === relationshipId));
  // Then expose every family before filling the ten-item human-review quota.
  for (const familyId of new Set(pool.map((entry) => entry.question.scenarioFamilyId))) add(pool.find((entry) => entry.question.scenarioFamilyId === familyId));
  for (const entry of pool) {
    add(entry);
    if (selected.length === 10) break;
  }
  if (selected.length !== 10) throw new Error(`${profileId}: source-profile review did not reach ten distinct causal states.`);
  return Object.freeze(selected);
}

export const CAE_001_SOURCE_PROFILE_REVIEW: Readonly<Record<CaeSourceProfileId, readonly Cae001SourceProfileReviewSample[]>> = Object.freeze({
  CLASSIC_BANK_FIVE_RELATION: collect("CLASSIC_BANK_FIVE_RELATION"),
  PUNJAB_POLICE_SI_2016_FOUR_RELATION: collect("PUNJAB_POLICE_SI_2016_FOUR_RELATION"),
  SSC_SELECTION_POST_DIRECT_RECOGNITION: collect("SSC_SELECTION_POST_DIRECT_RECOGNITION"),
});

export function renderCae001SourceProfileReview(): string {
  const lines = [
    "# CAE-001 — Source-profile review pack",
    "",
    "Thirty deterministic English review-only questions: ten semantically distinct causal states for each currently implemented source profile.",
  ];
  for (const profileId of Object.keys(CAE_001_SOURCE_PROFILE_REVIEW) as CaeSourceProfileId[]) {
    const authority = CAE_SOURCE_PROFILE_AUTHORITIES[profileId];
    lines.push("", `## ${profileId}`, "", authority.sourceLabel);
    for (const { seed, question } of CAE_001_SOURCE_PROFILE_REVIEW[profileId]) {
      lines.push(
        "",
        `### ${question.qlId} — seed ${seed}`,
        "",
        question.stem,
        "",
        ...question.options.map((option, index) => `${LETTERS[index]}. ${option}`),
        "",
        `**Answer:** ${LETTERS[question.correctIndex]}. ${question.options[question.correctIndex]}`,
        "",
        `**Explanation:** ${question.explanation}`,
        "",
        `**causalStateId:** \`${question.causalStateId}\``,
        `**itemVariantId:** \`${question.itemVariantId}\``,
      );
    }
  }
  return `${lines.join("\n")}\n`;
}
