import { generateDi005V2ReviewSet } from "./pie-set-v2-quality";
import type { Di005V2ExamProfile, Di005V2TaskKind } from "./pie-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi005PermanentQuestion(input: {
  seed: string;
  examProfile: Di005V2ExamProfile;
  taskKind: Di005V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-005 permanent generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:PERM:${input.taskKind}:${attempt}`;
    const set = generateDi005V2ReviewSet({ seed: sourceSeed, examProfile: input.examProfile });
    const question = set.questions.find((item) => item.kind === input.taskKind);
    if (!question) continue;

    return {
      packageId: "DI-005" as const,
      requestedSeed: seed,
      sourceSeed,
      examProfile: input.examProfile,
      stimulus: set.stimulus,
      question,
      validation: set.validation,
      traceability: {
        representation: "PIE" as const,
        questionLogicVersion: "DI-005-QUESTION-LOGIC-V2" as const,
        setContractVersion: "DI-005-SET-CONTRACT-V2" as const,
        presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS" as const,
        arithmeticAuthority: "EXACT_INTEGER_RATIONAL" as const,
        sourceFoundation: "DI-005-PIE-V2-QUALITY" as const,
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

  throw new Error(`DI-005 permanent generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`);
}
