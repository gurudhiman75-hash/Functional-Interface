import { generateDi008V2ReviewSet } from "./arithmetic-set-v2";
import type { Di008V2ExamProfile, Di008V2TaskKind } from "./arithmetic-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi008PermanentQuestion(input: {
  seed: string;
  examProfile: Di008V2ExamProfile;
  taskKind: Di008V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-008 permanent generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:PERM:${input.taskKind}:${attempt}`;
    const set = generateDi008V2ReviewSet({ seed: sourceSeed, examProfile: input.examProfile });
    const question = set.questions.find((item) => item.kind === input.taskKind);
    if (!question) continue;

    return {
      packageId: "DI-008" as const,
      requestedSeed: seed,
      sourceSeed,
      examProfile: input.examProfile,
      stimulus: set.stimulus,
      question,
      validation: set.validation,
      traceability: {
        representation: "ARITHMETIC_DI" as const,
        questionLogicVersion: "DI-008-QUESTION-LOGIC-V2" as const,
        setContractVersion: "DI-008-SET-CONTRACT-V2" as const,
        arithmeticAuthority: "EXACT_INTEGER_RATIONAL" as const,
        sourceFoundation: "DI-008-ARITHMETIC-DI-V2" as const,
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

  throw new Error(`DI-008 permanent generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`);
}
