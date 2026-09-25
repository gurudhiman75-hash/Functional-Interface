import { generateDi003GroupedBarV2Set } from "./grouped-bar-set-v2";
import type { Di003V2ExamProfile, Di003V2TaskKind } from "./grouped-bar-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi003PermanentQuestion(input: {
  seed: string;
  examProfile: Di003V2ExamProfile;
  taskKind: Di003V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-003 permanent generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:PERM:${input.taskKind}:${attempt}`;
    const set = generateDi003GroupedBarV2Set({ seed: sourceSeed, examProfile: input.examProfile });
    const question = set.questions.find((item) => item.kind === input.taskKind);
    if (!question) continue;

    return {
      packageId: "DI-003" as const,
      requestedSeed: seed,
      sourceSeed,
      examProfile: input.examProfile,
      stimulus: set.stimulus,
      question,
      traceability: {
        representation: "GROUPED_BAR" as const,
        questionLogicVersion: "DI-003-QUESTION-LOGIC-V3" as const,
        setContractVersion: "DI-003-SET-CONTRACT-V2" as const,
        arithmeticAuthority: "EXACT_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING" as const,
        sourceFoundation: "DI-003-GROUPED-BAR-V2" as const,
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

  throw new Error(`DI-003 permanent generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`);
}
