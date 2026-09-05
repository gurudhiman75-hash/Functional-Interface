import type { Com003ReviewQuestionV162 } from "./com003-review-synthesis-v16-2";

export type Com003DifficultyV1 = "Easy" | "Medium" | "Hard";
export type Com003DifficultyRequestV1 = Com003DifficultyV1 | "Mixed";

export const COM003_DIFFICULTY_AUTHORITY_VERSION_V1 =
  "COM-003-DIFFICULTY-V1-CANDIDATE-1" as const;

export type Com003DifficultyTopologyV1 =
  | "DIRECT_SINGLE_FACT"
  | "APPLIED_SINGLE_FACT"
  | "EXAMPLE_IDENTIFICATION"
  | "CONTRAST_DISCRIMINATION"
  | "REFERENCE_BEHAVIOR_INTERPRETATION"
  | "VERSION_SCOPED_SHORTCUT_CONTEXT"
  | "CLOSE_CONCEPT_SCOPE_TIMING";

export type Com003DifficultyDecisionV1 = {
  difficulty: Com003DifficultyV1;
  topology: Com003DifficultyTopologyV1;
  rationale: string;
  authorityVersion: typeof COM003_DIFFICULTY_AUTHORITY_VERSION_V1;
  productionClaimAuthorized: false;
};

function decision(
  difficulty: Com003DifficultyV1,
  topology: Com003DifficultyTopologyV1,
  rationale: string,
): Com003DifficultyDecisionV1 {
  return {
    difficulty,
    topology,
    rationale,
    authorityVersion: COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
    productionClaimAuthorized: false,
  };
}

export function classifyCom003DifficultyV1(
  question: Com003ReviewQuestionV162,
): Com003DifficultyDecisionV1 {
  if (question.qlId === "COM-003-QL-011") {
    return decision(
      "Medium",
      "REFERENCE_BEHAVIOR_INTERPRETATION",
      "Requires interpreting relative/absolute reference behavior or notation rather than recalling an isolated Office label.",
    );
  }

  if (question.qlId === "COM-003-QL-015") {
    return decision(
      "Medium",
      "VERSION_SCOPED_SHORTCUT_CONTEXT",
      "Uses application-specific shortcut or access-key knowledge whose correct use depends on explicit Windows desktop Excel context.",
    );
  }

  if (question.qlId === "COM-003-QL-018") {
    return decision(
      "Medium",
      "CLOSE_CONCEPT_SCOPE_TIMING",
      "Requires distinguishing closely related PowerPoint concepts such as transition versus animation or duration versus automatic advance timing.",
    );
  }

  if (question.examSurfaceFamily === "CONTRAST_DISCRIMINATION") {
    return decision(
      "Medium",
      "CONTRAST_DISCRIMINATION",
      "Requires discriminating between two or more plausible neighboring Office concepts rather than recalling one fact directly.",
    );
  }

  if (question.examSurfaceFamily === "EXAMPLE_RECOGNITION") {
    return decision(
      "Medium",
      "EXAMPLE_IDENTIFICATION",
      "Requires mapping a described example or behavior back to the correct Office concept.",
    );
  }

  if (question.examSurfaceFamily === "FUNCTIONAL_APPLICATION") {
    return decision(
      "Easy",
      "APPLIED_SINGLE_FACT",
      "Applies one canonical Office fact to a straightforward user task without multi-step reasoning or competing constraints.",
    );
  }

  if (question.examSurfaceFamily === "DIRECT_RECALL") {
    return decision(
      "Easy",
      "DIRECT_SINGLE_FACT",
      "Directly recalls one canonical Office fact in a familiar question direction.",
    );
  }

  throw new Error(`COM-003 difficulty authority has no rule for ${question.questionId}`);
}

export function filterCom003ByDifficultyV1(
  questions: readonly Com003ReviewQuestionV162[],
  request: Com003DifficultyRequestV1,
) {
  if (request === "Mixed") return [...questions];
  return questions.filter((question) => classifyCom003DifficultyV1(question).difficulty === request);
}

export const COM003_HARD_DIFFICULTY_STATUS_V1 = {
  authorized: false,
  reason:
    "The frozen V16.2 corpus contains no genuine multi-step, multi-fact or multi-constraint Office topology. Hard requests therefore fail closed instead of relabeling basic awareness questions as Hard.",
} as const;
