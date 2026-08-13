import { createHash } from "node:crypto";

import {
  buildRnkCp005EditorialV3State,
  generateRnkCp005EditorialV3ReleaseQuestion,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
  type RnkCp005EditorialV3Question,
  type RnkCp005EditorialV3SourceForm,
} from "./cp005-partial-order-editorial-v3-release";
import type { RnkCp005Context } from "./cp005-partial-order-runtime";

export const RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION =
  "RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_V1" as const;

export const RNK_CP005_EXPECTED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256 =
  "UNPINNED" as const;

export const RNK_CP005_PERMANENT_RUNTIME_CONTEXTS = [
  "MERIT_LIST",
  "INTERVIEW_SHORTLIST",
  "PERFORMANCE_REVIEW",
  "RACE_RESULT",
  "EXAM_SCORE_ORDER",
] as const satisfies readonly RnkCp005Context[];

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
  readonly projectionDigestPinned: boolean;
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

interface SelectedCandidate extends RnkCp005EditorialV3Question {
  readonly selectedMode: RnkCp005PermanentRuntimeCandidateMode;
  readonly selectedSourceOrdinal: number;
  readonly candidateRuntimeFingerprint: string;
  readonly normalizedLearnerFingerprint: string;
}

type GenerationCache = Map<string, RnkCp005EditorialV3Question | null>;

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

function answerPositionTargets(group: CandidateGroup): readonly [number, number, number, number] {
  if (group.mode === "EXACT_DEFINITE") return [48, 0, 48, 0];
  if (group.mode === "EXACT_INDETERMINATE") return [0, 48, 0, 48];
  if (group.count % 4 !== 0) {
    throw new Error(`${group.mode}: count ${group.count} is not divisible by four`);
  }
  const target = group.count / 4;
  return [target, target, target, target];
}

function contextInstruction(context: RnkCp005Context, count: number): string {
  switch (context) {
    case "MERIT_LIST":
      return `${count} candidates are ranked in a merit list from highest rank to lowest rank.`;
    case "INTERVIEW_SHORTLIST":
      return `${count} applicants are ranked in an interview shortlist from highest rank to lowest rank.`;
    case "PERFORMANCE_REVIEW":
      return `${count} employees are ranked from best performance to lowest performance.`;
    case "RACE_RESULT":
      return `${count} runners are ranked from first finisher to last finisher.`;
    case "EXAM_SCORE_ORDER":
      return `${count} students are ranked from highest score to lowest score.`;
  }
}

function contextComparison(
  higher: string,
  lower: string,
  context: RnkCp005Context,
  variant: number,
): string {
  const alternate = variant % 2 === 1;
  switch (context) {
    case "MERIT_LIST":
      return alternate
        ? `${higher} appears before ${lower} in the merit list.`
        : `${higher} is ranked above ${lower}.`;
    case "INTERVIEW_SHORTLIST":
      return alternate
        ? `${higher} has a better interview rank than ${lower}.`
        : `${higher} is placed above ${lower} in the shortlist.`;
    case "PERFORMANCE_REVIEW":
      return alternate
        ? `${higher} performed better than ${lower}.`
        : `${higher} is ranked above ${lower} for performance.`;
    case "RACE_RESULT":
      return alternate
        ? `${lower} finished after ${higher}.`
        : `${higher} finished before ${lower}.`;
    case "EXAM_SCORE_ORDER":
      return alternate
        ? `${higher} scored higher than ${lower}.`
        : `${higher} is ranked above ${lower} based on score.`;
  }
}

function renderQuestionContext(
  question: RnkCp005EditorialV3Question,
  context: RnkCp005Context,
  variantOffset: number,
): RnkCp005EditorialV3Question {
  const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
  if (!state) throw new Error(`${question.discoveryId}: missing V3 state for context render`);
  return {
    ...question,
    context,
    instruction: contextInstruction(context, state.entities.length),
    clues: state.edges.map((edge, index) =>
      contextComparison(
        edge.higher,
        edge.lower,
        context,
        variantOffset + index,
      ),
    ),
  };
}

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
  group: CandidateGroup,
  sourceOrdinal: number,
  ordinalWithinMode: number,
): string {
  return sha256({
    version: RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION,
    baseFingerprint: question.mathematicalFingerprint,
    authorityCandidateId: group.authorityCandidateId,
    mode: group.mode,
    sourceForm: group.sourceForm,
    sourceOrdinal,
    ordinalWithinMode,
    context: question.context,
    instruction: question.instruction,
    clues: question.clues,
  });
}

function generateCached(
  cache: GenerationCache,
  sourceForm: RnkCp005EditorialV3SourceForm,
  sourceOrdinal: number,
): RnkCp005EditorialV3Question | null {
  const key = `${sourceForm}:${sourceOrdinal}`;
  if (cache.has(key)) return cache.get(key) ?? null;
  try {
    const question = generateRnkCp005EditorialV3ReleaseQuestion(sourceForm, sourceOrdinal);
    cache.set(key, question);
    return question;
  } catch {
    cache.set(key, null);
    return null;
  }
}

function buildGroup(
  group: CandidateGroup,
  generationCache: GenerationCache,
  seenLearnerFingerprints: Set<string>,
  seenRuntimeFingerprints: Set<string>,
  seenStateKeys: Set<string>,
): readonly SelectedCandidate[] {
  const answerTargets = answerPositionTargets(group);
  const answerCounts = [0, 0, 0, 0];
  const output: SelectedCandidate[] = [];

  for (let sourceOrdinal = 0; sourceOrdinal < 20_000 && output.length < group.count; sourceOrdinal += 1) {
    const question = generateCached(generationCache, group.sourceForm, sourceOrdinal);
    if (!question) continue;
    if (!group.matches(question)) continue;
    if (answerCounts[question.correctIndex]! >= answerTargets[question.correctIndex]!) continue;

    const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
    if (!state || state.validOrders.length < 2) continue;

    const normalizedLearnerFingerprint = sha256(normalizeLearnerText(question));
    if (seenLearnerFingerprints.has(normalizedLearnerFingerprint)) continue;

    const stateKey = `${question.prototypeId}:${question.seed}:${question.v3Topology}:${question.pairStatusMode ?? "NONE"}`;
    if (seenStateKeys.has(stateKey)) continue;

    const runtimeFingerprint = candidateRuntimeFingerprint(
      question,
      group,
      sourceOrdinal,
      output.length + 1,
    );
    if (seenRuntimeFingerprints.has(runtimeFingerprint)) continue;

    output.push({
      ...question,
      selectedMode: group.mode,
      selectedSourceOrdinal: sourceOrdinal,
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
  if (answerCounts.some((count, index) => count !== answerTargets[index])) {
    throw new Error(
      `${group.mode}: answer-position target failed: ${answerCounts.join("/")} vs ${answerTargets.join("/")}`,
    );
  }
  return output;
}

export function buildRnkCp005PermanentRuntimeCandidate(): readonly RnkCp005PermanentRuntimeCandidateQuestion[] {
  const generationCache: GenerationCache = new Map();
  const seenLearnerFingerprints = new Set<string>();
  const seenRuntimeFingerprints = new Set<string>();
  const seenStateKeys = new Set<string>();
  const grouped = new Map<
    RnkCp005PermanentRuntimeCandidateAuthorityId,
    SelectedCandidate[]
  >(
    RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [authority, []]),
  );

  for (const group of RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_GROUPS) {
    grouped.get(group.authorityCandidateId)!.push(
      ...buildGroup(
        group,
        generationCache,
        seenLearnerFingerprints,
        seenRuntimeFingerprints,
        seenStateKeys,
      ),
    );
  }

  const finalLearnerFingerprints = new Set<string>();
  const finalRuntimeFingerprints = new Set<string>();

  return RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.flatMap((authorityCandidateId, authorityIndex) => {
    const authorityQuestions = grouped.get(authorityCandidateId)!;
    if (authorityQuestions.length !== 192) {
      throw new Error(
        `${authorityCandidateId}: expected 192 questions, found ${authorityQuestions.length}`,
      );
    }
    const modeOrdinals = new Map<RnkCp005PermanentRuntimeCandidateMode, number>();
    return authorityQuestions.map((selected, index) => {
      const {
        selectedMode,
        selectedSourceOrdinal,
        ...genericQuestion
      } = selected;
      const ordinalWithinMode = (modeOrdinals.get(selectedMode) ?? 0) + 1;
      modeOrdinals.set(selectedMode, ordinalWithinMode);
      const context = RNK_CP005_PERMANENT_RUNTIME_CONTEXTS[
        (index + authorityIndex * 2) % RNK_CP005_PERMANENT_RUNTIME_CONTEXTS.length
      ]!;
      const rendered = renderQuestionContext(
        genericQuestion,
        context,
        selectedSourceOrdinal + index,
      );
      const normalizedLearnerFingerprint = sha256(normalizeLearnerText(rendered));
      if (finalLearnerFingerprints.has(normalizedLearnerFingerprint)) {
        throw new Error(`${rendered.discoveryId}: duplicate final learner surface`);
      }
      finalLearnerFingerprints.add(normalizedLearnerFingerprint);

      const group = RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_GROUPS.find(
        (candidate) =>
          candidate.authorityCandidateId === authorityCandidateId &&
          candidate.mode === selectedMode,
      );
      if (!group) throw new Error(`${rendered.discoveryId}: candidate group missing`);
      const runtimeFingerprint = candidateRuntimeFingerprint(
        rendered,
        group,
        selectedSourceOrdinal,
        ordinalWithinMode,
      );
      if (finalRuntimeFingerprints.has(runtimeFingerprint)) {
        throw new Error(`${rendered.discoveryId}: duplicate final runtime fingerprint`);
      }
      finalRuntimeFingerprints.add(runtimeFingerprint);

      return {
        ...rendered,
        normalizedLearnerFingerprint,
        candidateRuntimeFingerprint: runtimeFingerprint,
        candidateRuntimeProfile: {
          version: RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION,
          authorityCandidateId,
          mode: selectedMode,
          sourceForm: selected.prototypeId as RnkCp005EditorialV3SourceForm,
          sourceOrdinal: selectedSourceOrdinal,
          ordinalWithinMode,
          ordinalWithinAuthority: index + 1,
          questionsWithinAuthority: 192,
          finalOwnershipApproved: false,
          permanentQlId: null,
          englishFreezeApproved: false,
          projectionDigestPinned:
            RNK_CP005_EXPECTED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256 !== "UNPINNED",
        },
      };
    });
  });
}

function projectionRecord(question: RnkCp005PermanentRuntimeCandidateQuestion): unknown {
  return {
    authorityCandidateId: question.candidateRuntimeProfile.authorityCandidateId,
    mode: question.candidateRuntimeProfile.mode,
    sourceForm: question.candidateRuntimeProfile.sourceForm,
    sourceOrdinal: question.candidateRuntimeProfile.sourceOrdinal,
    ordinalWithinAuthority: question.candidateRuntimeProfile.ordinalWithinAuthority,
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
