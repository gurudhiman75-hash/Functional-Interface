import { generateDi006V2Set } from "./caselet-set-v2";
import type { Di006V2ExamProfile, Di006V2TaskKind } from "./caselet-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi006PermanentQuestion(input: {
  seed: string;
  examProfile: Di006V2ExamProfile;
  taskKind: Di006V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-006 permanent generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:PERM:${input.taskKind}:${attempt}`;
    const set = generateDi006V2Set({ seed: sourceSeed, examProfile: input.examProfile });
    const question = set.questions.find((item) => item.kind === input.taskKind);
    if (!question) continue;

    return {
      packageId: "DI-006" as const,
      requestedSeed: seed,
      sourceSeed,
      examProfile: input.examProfile,
      stimulus: set.stimulus,
      question,
      validation: set.validation,
      traceability: {
        representation: "CASELET" as const,
        questionLogicVersion: "DI-006-QUESTION-LOGIC-V2" as const,
        setContractVersion: "DI-006-SET-CONTRACT-V2" as const,
        arithmeticAuthority: "EXACT_INTEGER_RATIONAL" as const,
        sourceFoundation: "DI-006-CASELET-V2" as const,
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

  throw new Error(`DI-006 permanent generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`);
}
