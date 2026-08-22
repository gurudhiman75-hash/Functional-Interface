import { createHash } from "node:crypto";
import { SUFFICIENCY_CLASSES, type SufficiencyClass } from "../foundation/index.ts";
import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { generateDsfCp001NumberSystemEnglish } from "../DSF-CP-001/cp001-editorial-runtime.ts";
import { generateDsfCp001RatioEnglish } from "../DSF-CP-001/cp001-ratio-editorial-runtime.ts";
import { generateDsfCp001PercentageEnglish } from "../DSF-CP-001/cp001-percentage-editorial-runtime.ts";
import { generateDsfCp001AlgebraEnglish } from "../DSF-CP-001/cp001-algebra-runtime.ts";

export const DSF_CP002_QUESTION_STUDIO_AUTHORITY = "DSF_CP002_QUESTION_STUDIO_INTEGRATION_V1" as const;
export const DSF_CP002_PACKAGE_ID = "DATA_SUFFICIENCY" as const;
export const DSF_CP002_LANGUAGES = ["en"] as const;
export const DSF_CP002_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const DSF_CP002_ANSWER_PROFILES = ["GENERIC_DS_STANDARD_5_EN"] as const;

export const DSF_CP002_DOMAINS = [
  {
    id: "NUMBER_SYSTEM",
    label: "Number System",
    sourceChapterId: "NUM-001",
    solveModes: ["DSF-SM-NUM-MISSING-DIGIT", "DSF-SM-NUM-DIGIT-PARITY"],
  },
  {
    id: "RATIO_PROPORTION",
    label: "Ratio & Proportion",
    sourceChapterId: "RAP-001",
    solveModes: ["DSF-SM-RAP-RATIO-AB", "DSF-SM-RAP-GREATER-QUANTITY"],
  },
  {
    id: "PERCENTAGE",
    label: "Percentage",
    sourceChapterId: "PCT-001",
    solveModes: ["DSF-SM-PCT-NET-SUCCESSIVE-CHANGE", "DSF-SM-PCT-FINAL-DIRECTION"],
  },
  {
    id: "ALGEBRA",
    label: "Algebra",
    sourceChapterId: "ALG-002",
    solveModes: ["DSF-SM-ALG-SINGLE-VARIABLE-X", "DSF-SM-ALG-LINEAR-SYSTEM-X"],
  },
] as const;

export type DsfStudioLanguage = (typeof DSF_CP002_LANGUAGES)[number];
export type DsfStudioDifficulty = (typeof DSF_CP002_DIFFICULTIES)[number];
export type DsfStudioDomainId = (typeof DSF_CP002_DOMAINS)[number]["id"];
export type DsfStudioSolveMode = (typeof DSF_CP002_DOMAINS)[number]["solveModes"][number];
export type DsfStudioAnswerProfile = (typeof DSF_CP002_ANSWER_PROFILES)[number];

type FrozenQuestion =
  | ReturnType<typeof generateDsfCp001NumberSystemEnglish>
  | ReturnType<typeof generateDsfCp001RatioEnglish>
  | ReturnType<typeof generateDsfCp001PercentageEnglish>
  | ReturnType<typeof generateDsfCp001AlgebraEnglish>;

export interface DsfQuestionStudioInput {
  readonly seed?: string;
  readonly count?: number;
  readonly domain?: DsfStudioDomainId;
  readonly solveMode?: DsfStudioSolveMode;
  readonly semanticClass?: SufficiencyClass;
  readonly difficulty?: DsfStudioDifficulty;
  readonly language?: DsfStudioLanguage;
  readonly answerProfile?: DsfStudioAnswerProfile;
}

export interface DsfQuestionStudioQuestion {
  readonly packageId: "DSF-001";
  readonly sourceCheckpointId: "DSF-CP-001";
  readonly integrationCheckpointId: "DSF-CP-002";
  readonly qlId: "DSF-QL-001";
  readonly questionId: string;
  readonly language: "en";
  readonly locale: "en-IN";
  readonly answerProfile: "GENERIC_DS_STANDARD_5_EN";
  readonly domain: DsfStudioDomainId;
  readonly domainLabel: string;
  readonly sourceChapterId: string;
  readonly solveModeId: DsfStudioSolveMode;
  readonly targetKind: string;
  readonly difficulty: DsfStudioDifficulty;
  readonly seed: number;
  readonly stem: string;
  readonly questionPrompt: string;
  readonly statements: readonly [
    { readonly id: "I"; readonly text: string },
    { readonly id: "II"; readonly text: string },
  ];
  readonly options: readonly {
    readonly key: "A" | "B" | "C" | "D" | "E";
    readonly value: string;
    readonly semanticClass: SufficiencyClass;
    readonly isCorrect: boolean;
  }[];
  readonly correctIndex: number;
  readonly canonicalAnswer: SufficiencyClass;
  readonly explanation: {
    readonly askedTarget: string;
    readonly statementI: string;
    readonly statementII: string;
    readonly together?: string;
    readonly conclusion: string;
    readonly steps: readonly string[];
  };
  readonly sourceGenerationIdentity: string;
  readonly integrationAuthority: typeof DSF_CP002_QUESTION_STUDIO_AUTHORITY;
  readonly sourceFreezeAuthority: typeof DSF_CP001_FREEZE_AUTHORITY.authorityId;
  readonly validation: {
    readonly valid: true;
    readonly sourceFrozen: true;
    readonly sourceValidated: true;
    readonly exactlyOneCorrect: true;
    readonly standardFiveOptionContract: true;
    readonly qlIdentityPreserved: true;
    readonly questionBankLocked: true;
    readonly testMockLocked: true;
    readonly publicationLocked: true;
  };
  readonly lifecycle: {
    readonly questionStudioDiscoverable: true;
    readonly persistenceAllowed: true;
    readonly reviewOnly: true;
    readonly questionBankStatus: "NOT_STORED";
    readonly questionBankWritable: false;
    readonly testEligibility: "INELIGIBLE";
    readonly testEligible: false;
    readonly mockTestEligible: false;
    readonly publiclyPublishable: false;
    readonly manualApprovalRequired: true;
    readonly automaticStudentPublication: false;
  };
}

export const DSF_CP002_QUESTION_STUDIO_PACKAGE = Object.freeze({
  packageId: DSF_CP002_PACKAGE_ID,
  label: "Data Sufficiency · Frozen CP-001 Production",
  integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
  sourceFreezeAuthority: DSF_CP001_FREEZE_AUTHORITY.authorityId,
  sourceCheckpointId: "DSF-CP-001" as const,
  integrationCheckpointId: "DSF-CP-002" as const,
  permanentQlIds: ["DSF-QL-001"] as const,
  nextAvailableQlId: "DSF-QL-002" as const,
  domains: DSF_CP002_DOMAINS,
  solveModeCount: 8 as const,
  supportedSemanticClasses: SUFFICIENCY_CLASSES,
  supportedDifficulties: DSF_CP002_DIFFICULTIES,
  supportedLanguages: DSF_CP002_LANGUAGES,
  supportedAnswerProfiles: DSF_CP002_ANSWER_PROFILES,
  defaultAnswerProfile: "GENERIC_DS_STANDARD_5_EN" as const,
  examSpecificAnswerProfilesImplemented: false as const,
  runtimeMode: "FROZEN_CP001_REVIEW_RUNTIME" as const,
  reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED" as const,
  questionStudioDiscoverable: true as const,
  persistenceAllowed: true as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  manualApprovalRequired: true as const,
  automaticStudentPublication: false as const,
});

function assertFrozenSourceAuthority(): void {
  if (DSF_CP001_FREEZE_AUTHORITY.status !== "FROZEN") {
    throw new Error("DSF CP-002 cannot expose an unfrozen CP-001 source runtime");
  }
  if (DSF_CP001_FREEZE_AUTHORITY.permanentQl.qlId !== "DSF-QL-001") {
    throw new Error("DSF permanent QL identity changed after CP-001 freeze");
  }
  if (DSF_CP001_FREEZE_AUTHORITY.proofGate.productionDomainCount !== 4) {
    throw new Error("DSF CP-001 production domain count changed after freeze");
  }
  if (DSF_CP001_FREEZE_AUTHORITY.proofGate.productionSolveModeCount !== 8) {
    throw new Error("DSF CP-001 solve-mode count changed after freeze");
  }
  if (DSF_CP001_FREEZE_AUTHORITY.lifecycle.questionStudioDiscoverable) {
    throw new Error("CP-001 source authority must remain delivery-locked; CP-002 owns Studio exposure");
  }
}

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function numericSeed(seed: string, itemIndex: number, attempt: number): number {
  return hashText(`${DSF_CP002_QUESTION_STUDIO_AUTHORITY}:${seed}:${itemIndex}:${attempt}`) & 0x7fffffff;
}

function domainForQuestion(question: FrozenQuestion): DsfStudioDomainId {
  switch (question.sourceChapterId) {
    case "NUM-001": return "NUMBER_SYSTEM";
    case "RAP-001": return "RATIO_PROPORTION";
    case "PCT-001": return "PERCENTAGE";
    case "ALG-002": return "ALGEBRA";
    default: throw new Error(`Unsupported frozen DSF source chapter ${(question as FrozenQuestion).sourceChapterId}`);
  }
}

function generateFrozen(domain: DsfStudioDomainId, seed: number): FrozenQuestion {
  if (domain === "NUMBER_SYSTEM") return generateDsfCp001NumberSystemEnglish(seed);
  if (domain === "RATIO_PROPORTION") return generateDsfCp001RatioEnglish(seed);
  if (domain === "PERCENTAGE") return generateDsfCp001PercentageEnglish(seed);
  return generateDsfCp001AlgebraEnglish(seed);
}

function normalizeQuestion(question: FrozenQuestion): DsfQuestionStudioQuestion {
  const domain = domainForQuestion(question);
  const domainEntry = DSF_CP002_DOMAINS.find((entry) => entry.id === domain)!;
  const correctCount = question.options.filter((option) => option.isCorrect).length;
  if (question.qlId !== "DSF-QL-001" || question.checkpointId !== "DSF-CP-001") {
    throw new Error("Question Studio adapter received a question outside frozen DSF-QL-001 / CP-001");
  }
  if (question.options.length !== 5 || correctCount !== 1 || question.correctIndex < 0) {
    throw new Error(`${question.generationIdentity}: frozen DSF option contract is invalid`);
  }
  if (!question.validation.ok) {
    throw new Error(`${question.generationIdentity}: frozen DSF source validation failed`);
  }
  if (question.lifecycle.questionStudioDiscoverable) {
    throw new Error(`${question.generationIdentity}: CP-001 source lifecycle unexpectedly became Studio-visible`);
  }
  const steps = [
    question.explanation.askedTarget,
    question.explanation.statementI,
    question.explanation.statementII,
    ...(question.explanation.together ? [question.explanation.together] : []),
    question.explanation.conclusion,
  ];
  const questionId = createHash("sha256")
    .update(`${DSF_CP002_QUESTION_STUDIO_AUTHORITY}:${question.generationIdentity}`)
    .digest("hex")
    .slice(0, 24);

  return Object.freeze({
    packageId: "DSF-001",
    sourceCheckpointId: "DSF-CP-001",
    integrationCheckpointId: "DSF-CP-002",
    qlId: "DSF-QL-001",
    questionId: `DSF-QS-${questionId}`,
    language: "en",
    locale: "en-IN",
    answerProfile: "GENERIC_DS_STANDARD_5_EN",
    domain,
    domainLabel: domainEntry.label,
    sourceChapterId: question.sourceChapterId,
    solveModeId: question.solveModeId as DsfStudioSolveMode,
    targetKind: question.targetKind,
    difficulty: question.difficulty,
    seed: question.seed,
    stem: question.stem,
    questionPrompt: question.questionPrompt,
    statements: [
      { id: "I", text: question.statements[0].text },
      { id: "II", text: question.statements[1].text },
    ],
    options: question.options.map((option) => ({
      key: option.key,
      value: option.value,
      semanticClass: option.semanticClass,
      isCorrect: option.isCorrect,
    })),
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
    explanation: {
      ...question.explanation,
      steps,
    },
    sourceGenerationIdentity: question.generationIdentity,
    integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
    sourceFreezeAuthority: DSF_CP001_FREEZE_AUTHORITY.authorityId,
    validation: {
      valid: true,
      sourceFrozen: true,
      sourceValidated: true,
      exactlyOneCorrect: true,
      standardFiveOptionContract: true,
      qlIdentityPreserved: true,
      questionBankLocked: true,
      testMockLocked: true,
      publicationLocked: true,
    },
    lifecycle: {
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      reviewOnly: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
    },
  });
}

function candidateDomains(input: DsfQuestionStudioInput): readonly DsfStudioDomainId[] {
  if (input.language && input.language !== "en") throw new Error(`Unsupported DSF language '${input.language}'.`);
  if (input.answerProfile && input.answerProfile !== "GENERIC_DS_STANDARD_5_EN") {
    throw new Error(`Unsupported DSF answer profile '${input.answerProfile}'.`);
  }

  let domains = input.domain
    ? [input.domain]
    : DSF_CP002_DOMAINS.map((entry) => entry.id);

  if (input.solveMode) {
    domains = domains.filter((domain) =>
      DSF_CP002_DOMAINS.find((entry) => entry.id === domain)!.solveModes.includes(input.solveMode as never),
    );
  }
  if (domains.length === 0) {
    throw new Error("The selected DSF domain and solve mode are incompatible.");
  }
  return domains;
}

function matches(question: DsfQuestionStudioQuestion, input: DsfQuestionStudioInput): boolean {
  if (input.domain && question.domain !== input.domain) return false;
  if (input.solveMode && question.solveModeId !== input.solveMode) return false;
  if (input.semanticClass && question.canonicalAnswer !== input.semanticClass) return false;
  if (input.difficulty && question.difficulty !== input.difficulty) return false;
  return true;
}

export function generateDsfQuestionStudioBatch(input: DsfQuestionStudioInput = {}) {
  assertFrozenSourceAuthority();
  const count = Math.min(50, Math.max(1, Math.floor(input.count ?? 5)));
  const seedText = input.seed?.trim() || "dsf-question-studio";
  const domains = candidateDomains(input);
  const questions: DsfQuestionStudioQuestion[] = [];
  const seen = new Set<string>();

  for (let itemIndex = 0; itemIndex < count; itemIndex += 1) {
    let found: DsfQuestionStudioQuestion | undefined;
    for (let attempt = 0; attempt < 12000; attempt += 1) {
      const domain = domains[(hashText(`${seedText}:domain:${itemIndex}:${attempt}`)) % domains.length]!;
      const sourceSeed = numericSeed(seedText, itemIndex, attempt);
      const question = normalizeQuestion(generateFrozen(domain, sourceSeed));
      if (!matches(question, input) || seen.has(question.sourceGenerationIdentity)) continue;
      found = question;
      break;
    }
    if (!found) {
      throw new Error(
        `Unable to satisfy DSF Question Studio filters after exhaustive deterministic search: ${JSON.stringify({
          domain: input.domain ?? null,
          solveMode: input.solveMode ?? null,
          semanticClass: input.semanticClass ?? null,
          difficulty: input.difficulty ?? null,
        })}`,
      );
    }
    seen.add(found.sourceGenerationIdentity);
    questions.push(found);
  }

  return Object.freeze({
    packageId: DSF_CP002_PACKAGE_ID,
    integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
    sourceFreezeAuthority: DSF_CP001_FREEZE_AUTHORITY.authorityId,
    questionCount: questions.length,
    questions,
    filters: {
      language: "en" as const,
      answerProfile: "GENERIC_DS_STANDARD_5_EN" as const,
      domain: input.domain ?? null,
      solveMode: input.solveMode ?? null,
      semanticClass: input.semanticClass ?? null,
      difficulty: input.difficulty ?? null,
      seed: seedText,
    },
    reviewOnly: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
  });
}
