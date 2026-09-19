import { generateDi007V2ReviewSet } from "./missing-set-v2";
import type { Di007V2ExamProfile, Di007V2TaskKind } from "./missing-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi007PermanentQuestion(input: {
  seed: string;
  examProfile: Di007V2ExamProfile;
  taskKind: Di007V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-007 permanent generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:PERM:${input.taskKind}:${attempt}`;
    const set = generateDi007V2ReviewSet({ seed: sourceSeed, examProfile: input.examProfile });
    const question = set.questions.find((item) => item.kind === input.taskKind);
    if (!question) continue;

    return {
      packageId: "DI-007" as const,
      requestedSeed: seed,
      sourceSeed,
      examProfile: input.examProfile,
      stimulus: set.stimulus,
      question,
      validation: set.validation,
      traceability: {
        representation: "MISSING_DI" as const,
        questionLogicVersion: "DI-007-QUESTION-LOGIC-V2" as const,
        setContractVersion: "DI-007-SET-CONTRACT-V2" as const,
        arithmeticAuthority: "EXACT_INTEGER_RATIONAL" as const,
        sourceFoundation: "DI-007-MISSING-DI-V2" as const,
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

  throw new Error(`DI-007 permanent generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`);
}
