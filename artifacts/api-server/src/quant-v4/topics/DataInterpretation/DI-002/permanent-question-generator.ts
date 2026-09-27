import { generateDi002V2Set } from "./advanced-table-set-v2";
import type { Di002V2ExamProfile, Di002V2TaskKind } from "./advanced-table-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi002PermanentQuestion(input: {
  seed: string;
  examProfile: Di002V2ExamProfile;
  taskKind: Di002V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-002 permanent generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:PERM:${input.taskKind}:${attempt}`;
    const set = generateDi002V2Set({ seed: sourceSeed, examProfile: input.examProfile });
    const question = set.questions.find((item) => item.kind === input.taskKind);
    if (!question) continue;

    return {
      packageId: "DI-002" as const,
      requestedSeed: seed,
      sourceSeed,
      examProfile: input.examProfile,
      stimulus: set.stimulus,
      question,
      validation: set.validation,
      traceability: {
        representation: "TABLE" as const,
        questionLogicVersion: "DI-002-QUESTION-LOGIC-V2" as const,
        setContractVersion: "DI-002-SET-CONTRACT-V2" as const,
        arithmeticAuthority: "EXACT_INTEGER_RATIONAL_WITH_EXPLICIT_WHOLE_PERCENT_ROUNDING" as const,
        sourceFoundation: "DI-002-ADVANCED-TABLE-V2" as const,
        reviewStatus: "ENGLISH_REVIEW_APPROVED" as const,
        questionStudioDiscoverable: false as const,
        questionBankStatus: "NOT_STORED" as const,
        questionBankWritable: false as const,
        testEligibility: "INELIGIBLE" as const,
        testEligible: false as const,
        mockTestEligible: false as const,
        publiclyPublishable: false as const,
        automaticStudentPublication: false as const,
        productionReleaseAuthorized: false as const,
      },
    };
  }

  throw new Error(`DI-002 permanent generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`);
}
