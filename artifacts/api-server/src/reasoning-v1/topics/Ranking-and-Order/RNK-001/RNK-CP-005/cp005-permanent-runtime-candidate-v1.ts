import { createHash } from "node:crypto";

import {
  buildRnkCp005EditorialV3State,
  generateRnkCp005EditorialV3ReleaseQuestion,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
  type RnkCp005EditorialV3Question,
  type RnkCp005EditorialV3SourceForm,
} from "./cp005-partial-order-editorial-v3-release";

export const RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION =
  "RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_V1" as const;

export const RNK_CP005_EXPECTED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256 =
  "UNPINNED" as const;

export type RnkCp005PermanentRuntimeCandidateAuthorityId =
  (typeof RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS)[number];

export type RnkCp005PermanentRuntimeCandidateMode =
  | "MUST"
  | "COULD"
  | "CANNOT"
  | "PAIR_FIRST_ABOVE"
  | "PAIR_SECOND_ABOVE"
  | "PAIR_INDETERMINATE"
  | "HIGHEST_POSSIBLE"
  | "LOWEST_POSSIBLE"
  | "EXACT_DEFINITE"
  | "EXACT_INDETERMINATE";

export interface RnkCp005PermanentRuntimeCandidateProfile {
  readonly version: typeof RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION;
  readonly authorityCandidateId: RnkCp005PermanentRuntimeCandidateAuthorityId;
  readonly mode: RnkCp005PermanentRuntimeCandidateMode;
  readonly sourceForm: RnkCp005EditorialV3SourceForm;
  readonly sourceOrdinal: number;
  readonly ordinalWithinMode: number;
  readonly ordinalWithinAuthority: number;
  readonly questionsWithinAuthority: 192;
  readonly finalOwnershipApproved: false;
  readonly permanentQlId: null;
  readonly englishFreezeApproved: false;
  readonly projectionDigestPinned: false;
}

export type RnkCp005PermanentRuntimeCandidateQuestion =
  RnkCp005EditorialV3Question & {
    readonly candidateRuntimeProfile: RnkCp005PermanentRuntimeCandidateProfile;
    readonly candidateRuntimeFingerprint: string;
    readonly normalizedLearnerFingerprint: string;
  };

interface CandidateGroup {
  readonly authorityCandidateId: RnkCp005PermanentRuntimeCandidateAuthorityId;
  readonly mode: RnkCp005PermanentRuntimeCandidateMode;
  readonly sourceForm: RnkCp005EditorialV3SourceForm;
  readonly count: number;
  readonly matches: (question: RnkCp005EditorialV3Question) => boolean;
}

export const RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_GROUPS: readonly CandidateGroup[] = [
  {
    authorityCandidateId: "RELATION_TRUTH_STATUS",
    mode: "MUST",
    sourceForm: "DEFINITELY_TRUE_RELATION",
    count: 48,
    matches: () => true,
  },
  {
    authorityCandidateId: "RELATION_TRUTH_STATUS",
    mode: "COULD",
    sourceForm: "POSSIBLE_RELATION",
    count: 48,
    matches: () => true,
  },
  {
    authorityCandidateId: "RELATION_TRUTH_STATUS",
    mode: "CANNOT",
    sourceForm: "IMPOSSIBLE_RELATION",
    count: 48,
    matches: () => true,
  },
  {
    authorityCandidateId: "RELATION_TRUTH_STATUS",
    mode: "PAIR_FIRST_ABOVE",
    sourceForm: "PAIR_RELATION_CANNOT_BE_DETERMINED",
    count: 16,
    matches: (question) => question.pairStatusMode === "FIRST_ABOVE",
  },
  {
    authorityCandidateId: "RELATION_TRUTH_STATUS",
    mode: "PAIR_SECOND_ABOVE",
    sourceForm: "PAIR_RELATION_CANNOT_BE_DETERMINED",
    count: 16,
    matches: (question) => question.pairStatusMode === "SECOND_ABOVE",
  },
  {
    authorityCandidateId: "RELATION_TRUTH_STATUS",
    mode: "PAIR_INDETERMINATE",
    sourceForm: "PAIR_RELATION_CANNOT_BE_DETERMINED",
    count: 16,
    matches: (question) => question.pairStatusMode === "INDETERMINATE",
  },
  {
    authorityCandidateId: "POSSIBLE_RANK_BOUND",
    mode: "HIGHEST_POSSIBLE",
    sourceForm: "MINIMUM_POSSIBLE_RANK",
    count: 96,
    matches: () => true,
  },
  {
    authorityCandidateId: "POSSIBLE_RANK_BOUND",
    mode: "LOWEST_POSSIBLE",
    sourceForm: "MAXIMUM_POSSIBLE_RANK",
    count: 96,
    matches: () => true,
  },
  {
    authorityCandidateId: "EXACT_RANK_DETERMINACY",
    mode: "EXACT_DEFINITE",
    sourceForm: "DEFINITE_RANK_OR_INDETERMINATE",
    count: 96,
    matches: (question) => !/cannot be determined uniquely/i.test(question.answer),
  },
  {
    authorityCandidateId: "EXACT_RANK_DETERMINACY",
    mode: "EXACT_INDETERMINATE",
    sourceForm: "DEFINITE_RANK_OR_INDETERMINATE",
    count: 96,
    matches: (question) => /cannot be determined uniquely/i.test(question.answer),
  },
] as const;

function normalizeLearnerText(question: RnkCp005EditorialV3Question): string {
  return [
    question.instruction,
    ...question.clues,
    question.stem,
    ...question.options.map((option) => `${option.label} ${option.explanation}`),
    question.answer,
    ...question.explanation,
  ]
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:?!])/g, "$1")
    .trim();
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function candidateRuntimeFingerprint(
  question: RnkCp005EditorialV3Question,
  profile: Omit<
    RnkCp005PermanentRuntimeCandidateProfile,
    "version" | "questionsWithinAuthority" | "finalOwnershipApproved" | "permanentQlId" | "englishFreezeApproved" | "projectionDigestPinned"
  >,
): string {
  return sha256({
    version: RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION,
    baseFingerprint: question.mathematicalFingerprint,
    ...profile,
  });
}

function buildGroup(
  group: CandidateGroup,
  seenLearnerFingerprints: Set<string>,
  seenRuntimeFingerprints: Set<string>,
  seenStateKeys: Set<string>,
): readonly Omit<
  RnkCp005PermanentRuntimeCandidateQuestion,
  "candidateRuntimeProfile"
>[] {
  if (group.count % 4 !== 0) {
    throw new Error(`${group.mode}: count ${group.count} is not divisible by four`);
  }
  const targetPerAnswerPosition = group.count / 4;
  const answerCounts = [0, 0, 0, 0];
  const output: Omit<
    RnkCp005PermanentRuntimeCandidateQuestion,
    "candidateRuntimeProfile"
  >[] = [];

  for (let sourceOrdinal = 0; sourceOrdinal < 20_000 && output.length < group.count; sourceOrdinal += 1) {
    const question = generateRnkCp005EditorialV3ReleaseQuestion(
      group.sourceForm,
      sourceOrdinal,
    );
    if (!group.matches(question)) continue;
    if (answerCounts[question.correctIndex]! >= targetPerAnswerPosition) continue;

    const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
    if (!state || state.validOrders.length < 2) continue;

    const normalizedLearnerFingerprint = sha256(normalizeLearnerText(question));
    if (seenLearnerFingerprints.has(normalizedLearnerFingerprint)) continue;

    const stateKey = `${question.prototypeId}:${question.seed}:${question.v3Topology}:${question.pairStatusMode ?? "NONE"}`;
    if (seenStateKeys.has(stateKey)) continue;

    const runtimeFingerprint = candidateRuntimeFingerprint(question, {
      authorityCandidateId: group.authorityCandidateId,
      mode: group.mode,
      sourceForm: group.sourceForm,
      sourceOrdinal,
      ordinalWithinMode: output.length + 1,
      ordinalWithinAuthority: 0,
    });
    if (seenRuntimeFingerprints.has(runtimeFingerprint)) continue;

    output.push({
      ...question,
      candidateRuntimeFingerprint: runtimeFingerprint,
      normalizedLearnerFingerprint,
    });
    answerCounts[question.correctIndex]! += 1;
    seenLearnerFingerprints.add(normalizedLearnerFingerprint);
    seenRuntimeFingerprints.add(runtimeFingerprint);
    seenStateKeys.add(stateKey);
  }

  if (output.length !== group.count) {
    throw new Error(
      `${group.mode}: produced ${output.length}/${group.count} candidates after bounded search`,
    );
  }
  if (answerCounts.some((count) => count !== targetPerAnswerPosition)) {
    throw new Error(`${group.mode}: answer-position balance failed: ${answerCounts.join("/")}`);
  }
  return output;
}

export function buildRnkCp005PermanentRuntimeCandidate(): readonly RnkCp005PermanentRuntimeCandidateQuestion[] {
  const seenLearnerFingerprints = new Set<string>();
  const seenRuntimeFingerprints = new Set<string>();
  const seenStateKeys = new Set<string>();
  const grouped = new Map<
    RnkCp005PermanentRuntimeCandidateAuthorityId,
    Omit<RnkCp005PermanentRuntimeCandidateQuestion, "candidateRuntimeProfile">[]
  >(
    RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [authority, []]),
  );

  for (const group of RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_GROUPS) {
    grouped.get(group.authorityCandidateId)!.push(
      ...buildGroup(
        group,
        seenLearnerFingerprints,
        seenRuntimeFingerprints,
        seenStateKeys,
      ),
    );
  }

  return RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.flatMap((authorityCandidateId) => {
    const authorityQuestions = grouped.get(authorityCandidateId)!;
    if (authorityQuestions.length !== 192) {
      throw new Error(
        `${authorityCandidateId}: expected 192 questions, found ${authorityQuestions.length}`,
      );
    }
    const modeOrdinals = new Map<RnkCp005PermanentRuntimeCandidateMode, number>();
    return authorityQuestions.map((question, index) => {
      const group = RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_GROUPS.find(
        (candidate) =>
          candidate.authorityCandidateId === authorityCandidateId &&
          candidate.sourceForm === question.prototypeId &&
          candidate.matches(question),
      );
      if (!group) throw new Error(`${question.discoveryId}: no candidate group`);
      const ordinalWithinMode = (modeOrdinals.get(group.mode) ?? 0) + 1;
      modeOrdinals.set(group.mode, ordinalWithinMode);
      const sourceOrdinal = Number(
        question.candidateRuntimeFingerprint.length > 0
          ? question.candidateRuntimeFingerprint.length
          : 0,
      );
      void sourceOrdinal;
      return {
        ...question,
        candidateRuntimeProfile: {
          version: RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION,
          authorityCandidateId,
          mode: group.mode,
          sourceForm: group.sourceForm,
          sourceOrdinal: -1,
          ordinalWithinMode,
          ordinalWithinAuthority: index + 1,
          questionsWithinAuthority: 192,
          finalOwnershipApproved: false,
          permanentQlId: null,
          englishFreezeApproved: false,
          projectionDigestPinned: false,
        },
      };
    });
  });
}

function projectionRecord(question: RnkCp005PermanentRuntimeCandidateQuestion): unknown {
  return {
    authorityCandidateId: question.candidateRuntimeProfile.authorityCandidateId,
    mode: question.candidateRuntimeProfile.mode,
    ordinalWithinAuthority: question.candidateRuntimeProfile.ordinalWithinAuthority,
    sourceForm: question.prototypeId,
    seed: question.seed,
    context: question.context,
    topology: question.v3Topology,
    pairStatusMode: question.pairStatusMode ?? null,
    difficulty: question.difficulty,
    instruction: question.instruction,
    clues: question.clues,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    candidateRuntimeFingerprint: question.candidateRuntimeFingerprint,
    normalizedLearnerFingerprint: question.normalizedLearnerFingerprint,
  };
}

export function rnkCp005PermanentRuntimeCandidateProjectionSha256(
  questions: readonly RnkCp005PermanentRuntimeCandidateQuestion[],
): string {
  return sha256(questions.map(projectionRecord));
}
