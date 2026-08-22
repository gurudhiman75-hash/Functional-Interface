import { createHash } from "node:crypto";

import {
  DS_STANDARD_5_EN,
  type SufficiencyClass,
} from "../foundation/index.ts";
import {
  DSF_BANK_BOB_2015_ORDER,
  DSF_BANK_STANDARD_ORDER,
  DSF_SSC_CGL_2023_FOUR_ORDER,
  DSF_SSC_CGL_2024_FOUR_ORDER,
  DSF_TWO_STATEMENT_SOURCE_PATTERNS,
  type DsSourceEvidenceLevel,
  type DsSourceExamFamily,
} from "../discovery/source-pattern-registry.ts";
import {
  DSF_CP002_QUESTION_STUDIO_AUTHORITY,
  DSF_CP002_QUESTION_STUDIO_PACKAGE,
  generateDsfQuestionStudioBatch,
  type DsfQuestionStudioInput,
  type DsfQuestionStudioQuestion,
} from "../DSF-CP-002/question-studio-integration-v1.ts";

export const DSF_CP003_EXAM_PROFILE_AUTHORITY = "DSF_CP003_EXAM_ANSWER_PROFILE_DELIVERY_V1" as const;
export const DSF_CP003_PROFILE_CHECKPOINT_ID = "DSF-CP-003" as const;

export const DSF_CP003_ANSWER_PROFILE_IDS = [
  "GENERIC_DS_STANDARD_5_EN",
  "BANKING_STANDARD_5_EN",
  "BANKING_BOB_2015_5_EN",
  "SSC_CGL_TIER2_2023_4_EN",
  "SSC_CGL_TIER2_2024_4_EN",
] as const;

export type DsfExamAnswerProfileId = (typeof DSF_CP003_ANSWER_PROFILE_IDS)[number];
export type DsfExamProfileFamily = "GENERIC" | Extract<DsSourceExamFamily, "BANKING" | "SSC">;

type DsfOptionKey = "A" | "B" | "C" | "D" | "E";

export interface DsfExamAnswerProfileDefinition {
  readonly id: DsfExamAnswerProfileId;
  readonly label: string;
  readonly examFamily: DsfExamProfileFamily;
  readonly optionCount: 4 | 5;
  readonly semanticOrder: readonly SufficiencyClass[];
  readonly representedSemanticClasses: readonly SufficiencyClass[];
  readonly omittedSemanticClasses: readonly SufficiencyClass[];
  readonly evidenceLevel: DsSourceEvidenceLevel | "INTERNAL_CANONICAL";
  readonly sourcePatternIds: readonly string[];
  readonly evidenceNote: string;
  readonly enabledInQuestionStudio: true;
  readonly studentPublicationEligible: false;
}

const GENERIC_ORDER = DS_STANDARD_5_EN.options.map((option) => option.semanticClass);
const ALL_CLASSES = GENERIC_ORDER;

function omittedClasses(order: readonly SufficiencyClass[]): readonly SufficiencyClass[] {
  return ALL_CLASSES.filter((semanticClass) => !order.includes(semanticClass));
}

function pattern(patternId: string) {
  const found = DSF_TWO_STATEMENT_SOURCE_PATTERNS.find((entry) => entry.patternId === patternId);
  if (!found) throw new Error(`Missing DSF source-pattern authority ${patternId}`);
  return found;
}

const BANK_STANDARD_SOURCE = pattern("DSF-SRC-BANK-INDIAN-BANK-PO-2011-TWO-STMT");
const BANK_BOB_SOURCE = pattern("DSF-SRC-BANK-BOB-JMG-2015-TWO-STMT");
const SSC_2023_SOURCE = pattern("DSF-SRC-SSC-CGL-TIER2-2023-REASONING-FOUR");
const SSC_2024_SOURCE = pattern("DSF-SRC-SSC-CGL-TIER2-2024-QUANT-FOUR");

export const DSF_CP003_ANSWER_PROFILES: readonly DsfExamAnswerProfileDefinition[] = Object.freeze([
  {
    id: "GENERIC_DS_STANDARD_5_EN",
    label: "Generic ExamTree · 5 options",
    examFamily: "GENERIC",
    optionCount: 5,
    semanticOrder: GENERIC_ORDER,
    representedSemanticClasses: GENERIC_ORDER,
    omittedSemanticClasses: [],
    evidenceLevel: "INTERNAL_CANONICAL",
    sourcePatternIds: [],
    evidenceNote: "Canonical ExamTree five-class rendering approved in DSF-CP-002 English review.",
    enabledInQuestionStudio: true,
    studentPublicationEligible: false,
  },
  {
    id: "BANKING_STANDARD_5_EN",
    label: "Banking · standard 5-option order",
    examFamily: "BANKING",
    optionCount: 5,
    semanticOrder: DSF_BANK_STANDARD_ORDER,
    representedSemanticClasses: DSF_BANK_STANDARD_ORDER,
    omittedSemanticClasses: [],
    evidenceLevel: BANK_STANDARD_SOURCE.evidenceLevel,
    sourcePatternIds: [BANK_STANDARD_SOURCE.patternId],
    evidenceNote: "Memory-based Banking evidence supports all five canonical meanings in this displayed order.",
    enabledInQuestionStudio: true,
    studentPublicationEligible: false,
  },
  {
    id: "BANKING_BOB_2015_5_EN",
    label: "Banking · BOB 2015 reordered 5-option profile",
    examFamily: "BANKING",
    optionCount: 5,
    semanticOrder: DSF_BANK_BOB_2015_ORDER,
    representedSemanticClasses: DSF_BANK_BOB_2015_ORDER,
    omittedSemanticClasses: [],
    evidenceLevel: BANK_BOB_SOURCE.evidenceLevel,
    sourcePatternIds: [BANK_BOB_SOURCE.patternId],
    evidenceNote: "Memory-based BOB 2015 evidence demonstrates the same five semantics in a different option order.",
    enabledInQuestionStudio: true,
    studentPublicationEligible: false,
  },
  {
    id: "SSC_CGL_TIER2_2023_4_EN",
    label: "SSC CGL Tier-II 2023 · 4-option profile",
    examFamily: "SSC",
    optionCount: 4,
    semanticOrder: DSF_SSC_CGL_2023_FOUR_ORDER,
    representedSemanticClasses: DSF_SSC_CGL_2023_FOUR_ORDER,
    omittedSemanticClasses: omittedClasses(DSF_SSC_CGL_2023_FOUR_ORDER),
    evidenceLevel: SSC_2023_SOURCE.evidenceLevel,
    sourcePatternIds: [SSC_2023_SOURCE.patternId],
    evidenceNote: "Curated SSC PYQ-platform evidence supports this four-option order. EACH_STATEMENT_ALONE is not representable by this profile.",
    enabledInQuestionStudio: true,
    studentPublicationEligible: false,
  },
  {
    id: "SSC_CGL_TIER2_2024_4_EN",
    label: "SSC CGL Tier-II 2024 · 4-option profile",
    examFamily: "SSC",
    optionCount: 4,
    semanticOrder: DSF_SSC_CGL_2024_FOUR_ORDER,
    representedSemanticClasses: DSF_SSC_CGL_2024_FOUR_ORDER,
    omittedSemanticClasses: omittedClasses(DSF_SSC_CGL_2024_FOUR_ORDER),
    evidenceLevel: SSC_2024_SOURCE.evidenceLevel,
    sourcePatternIds: [SSC_2024_SOURCE.patternId],
    evidenceNote: "Curated SSC PYQ-platform evidence supports this four-option order. EACH_STATEMENT_ALONE is not representable by this profile.",
    enabledInQuestionStudio: true,
    studentPublicationEligible: false,
  },
]);

export const DSF_CP003_DISABLED_EXAM_FAMILIES = Object.freeze([
  {
    examFamily: "PUNJAB_STATE" as const,
    reason: "Official Punjab Data Sufficiency answer-contract evidence is not strong enough to freeze a Punjab-specific renderer.",
  },
]);

export type DsfExamProfileInput = Omit<DsfQuestionStudioInput, "answerProfile"> & {
  readonly answerProfile?: DsfExamAnswerProfileId;
};

export type DsfExamProfileQuestion = Omit<
  DsfQuestionStudioQuestion,
  "answerProfile" | "options" | "correctIndex" | "questionId" | "validation"
> & {
  readonly answerProfile: DsfExamAnswerProfileId;
  readonly sourceQuestionId: string;
  readonly questionId: string;
  readonly profileCheckpointId: typeof DSF_CP003_PROFILE_CHECKPOINT_ID;
  readonly deliveryProfileAuthority: typeof DSF_CP003_EXAM_PROFILE_AUTHORITY;
  readonly examFamily: DsfExamProfileFamily;
  readonly profileEvidenceLevel: DsfExamAnswerProfileDefinition["evidenceLevel"];
  readonly profileSourcePatternIds: readonly string[];
  readonly profileRepresentedSemanticClasses: readonly SufficiencyClass[];
  readonly profileOmittedSemanticClasses: readonly SufficiencyClass[];
  readonly options: readonly {
    readonly key: DsfOptionKey;
    readonly value: string;
    readonly semanticClass: SufficiencyClass;
    readonly isCorrect: boolean;
  }[];
  readonly correctIndex: number;
  readonly validation: DsfQuestionStudioQuestion["validation"] & {
    readonly profileRepresentable: true;
    readonly semanticTruthPreserved: true;
    readonly optionOrderMatchesProfile: true;
  };
};

export const DSF_CP003_QUESTION_STUDIO_PACKAGE = Object.freeze({
  ...DSF_CP002_QUESTION_STUDIO_PACKAGE,
  label: "Data Sufficiency · Frozen semantics + exam answer profiles",
  profileCheckpointId: DSF_CP003_PROFILE_CHECKPOINT_ID,
  profileDeliveryAuthority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
  supportedAnswerProfiles: DSF_CP003_ANSWER_PROFILE_IDS,
  answerProfiles: DSF_CP003_ANSWER_PROFILES,
  defaultAnswerProfile: "GENERIC_DS_STANDARD_5_EN" as const,
  examSpecificAnswerProfilesImplemented: true as const,
  supportedExamFamilies: ["BANKING", "SSC"] as const,
  disabledExamFamilies: DSF_CP003_DISABLED_EXAM_FAMILIES,
  reviewStatus: "QUESTION_STUDIO_EXAM_PROFILE_REVIEW_CONNECTED" as const,
  studentPublicationEligible: false as const,
});

function profileById(profileId: DsfExamAnswerProfileId): DsfExamAnswerProfileDefinition {
  const found = DSF_CP003_ANSWER_PROFILES.find((profile) => profile.id === profileId);
  if (!found) throw new Error(`Unsupported DSF answer profile '${profileId}'.`);
  return found;
}

function semanticText(semanticClass: SufficiencyClass): string {
  const option = DS_STANDARD_5_EN.options.find((candidate) => candidate.semanticClass === semanticClass);
  if (!option) throw new Error(`No canonical DS text exists for ${semanticClass}.`);
  return option.text;
}

function renderProfile(
  source: DsfQuestionStudioQuestion,
  profile: DsfExamAnswerProfileDefinition,
): DsfExamProfileQuestion {
  if (!profile.representedSemanticClasses.includes(source.canonicalAnswer)) {
    throw new Error(
      `${profile.id} cannot represent ${source.canonicalAnswer}; choose a five-option profile or another semantic class.`,
    );
  }

  const keys: readonly DsfOptionKey[] = ["A", "B", "C", "D", "E"];
  const options = profile.semanticOrder.map((semanticClass, index) => ({
    key: keys[index]!,
    value: semanticText(semanticClass),
    semanticClass,
    isCorrect: semanticClass === source.canonicalAnswer,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${profile.id}/${source.questionId}: rendered profile did not produce exactly one correct option.`);
  }

  const profileQuestionId = createHash("sha256")
    .update(`${DSF_CP003_EXAM_PROFILE_AUTHORITY}:${profile.id}:${source.questionId}`)
    .digest("hex")
    .slice(0, 24);

  return Object.freeze({
    ...source,
    answerProfile: profile.id,
    sourceQuestionId: source.questionId,
    questionId: `DSF-QS-PROFILE-${profileQuestionId}`,
    profileCheckpointId: DSF_CP003_PROFILE_CHECKPOINT_ID,
    deliveryProfileAuthority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
    examFamily: profile.examFamily,
    profileEvidenceLevel: profile.evidenceLevel,
    profileSourcePatternIds: profile.sourcePatternIds,
    profileRepresentedSemanticClasses: profile.representedSemanticClasses,
    profileOmittedSemanticClasses: profile.omittedSemanticClasses,
    options,
    correctIndex,
    validation: {
      ...source.validation,
      profileRepresentable: true,
      semanticTruthPreserved: true,
      optionOrderMatchesProfile: true,
    },
  });
}

function sourceInput(input: DsfExamProfileInput, seed: string, count: number): DsfQuestionStudioInput {
  return {
    seed,
    count,
    domain: input.domain,
    solveMode: input.solveMode,
    semanticClass: input.semanticClass,
    difficulty: input.difficulty,
    language: input.language ?? "en",
    answerProfile: "GENERIC_DS_STANDARD_5_EN",
  };
}

export function generateDsfExamProfileBatch(input: DsfExamProfileInput = {}) {
  if (DSF_CP002_QUESTION_STUDIO_PACKAGE.integrationAuthority !== DSF_CP002_QUESTION_STUDIO_AUTHORITY) {
    throw new Error("DSF CP-003 lost its CP-002 Question Studio source authority.");
  }
  const profileId = input.answerProfile ?? "GENERIC_DS_STANDARD_5_EN";
  const profile = profileById(profileId);
  if (input.semanticClass && !profile.representedSemanticClasses.includes(input.semanticClass)) {
    throw new Error(
      `${profile.id} cannot render ${input.semanticClass}. Omitted classes: ${profile.omittedSemanticClasses.join(", ")}.`,
    );
  }

  const count = Math.min(50, Math.max(1, Math.floor(input.count ?? 5)));
  const seedText = input.seed?.trim() || "dsf-exam-profile-studio";
  const rendered: DsfExamProfileQuestion[] = [];
  const seen = new Set<string>();

  for (let itemIndex = 0; itemIndex < count; itemIndex += 1) {
    let found: DsfExamProfileQuestion | undefined;
    for (let attempt = 0; attempt < 300; attempt += 1) {
      const candidateSeed = `${seedText}:${profile.id}:${itemIndex}:${attempt}`;
      const sourceResult = generateDsfQuestionStudioBatch(sourceInput(input, candidateSeed, 1));
      const source = sourceResult.questions[0]!;
      if (!profile.representedSemanticClasses.includes(source.canonicalAnswer)) continue;
      const candidate = renderProfile(source, profile);
      if (seen.has(candidate.sourceQuestionId)) continue;
      found = candidate;
      break;
    }
    if (!found) {
      throw new Error(`${profile.id}: unable to satisfy the requested DSF filters after 300 deterministic attempts.`);
    }
    seen.add(found.sourceQuestionId);
    rendered.push(found);
  }

  return Object.freeze({
    generationSystem: "reasoning-v1" as const,
    sourceCheckpointId: "DSF-CP-001" as const,
    integrationCheckpointId: "DSF-CP-002" as const,
    profileCheckpointId: DSF_CP003_PROFILE_CHECKPOINT_ID,
    integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
    profileDeliveryAuthority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
    answerProfile: profile.id,
    profile,
    questionCount: rendered.length,
    questions: rendered,
    reviewOnly: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
  });
}
