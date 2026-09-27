import { generateDi004V2Set } from "./line-set-v2";
import type { Di004V2ExamProfile, Di004V2TaskKind } from "./line-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi004PermanentQuestion(input: {
  seed: string;
  examProfile: Di004V2ExamProfile;
  taskKind: Di004V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-004 permanent generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:PERM:${input.taskKind}:${attempt}`;
    const set = generateDi004V2Set({ seed: sourceSeed, examProfile: input.examProfile });
    const question = set.questions.find((item) => item.kind === input.taskKind);
    if (!question) continue;

    return {
      packageId: "DI-004" as const,
      requestedSeed: seed,
      sourceSeed,
      examProfile: input.examProfile,
      stimulus: set.stimulus,
      question,
      validation: set.validation,
      traceability: {
        representation: "LINE" as const,
        questionLogicVersion: "DI-004-QUESTION-LOGIC-V2" as const,
        setContractVersion: "DI-004-SET-CONTRACT-V2" as const,
        arithmeticAuthority: "INTEGER_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING" as const,
        sourceFoundation: "DI-004-LINE-V2" as const,
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

  throw new Error(`DI-004 permanent generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`);
}
