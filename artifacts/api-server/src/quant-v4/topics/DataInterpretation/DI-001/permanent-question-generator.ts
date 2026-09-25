import { generateDi001TableV2Set } from "./table-set-v2";
import type { Di001ExamProfile } from "./types";
import type { Di001V2TaskKind } from "./table-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi001PermanentQuestion(input: {
  seed: string;
  examProfile: Di001ExamProfile;
  taskKind: Di001V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-001 permanent generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:PERM:${input.taskKind}:${attempt}`;
    const set = generateDi001TableV2Set({ seed: sourceSeed, examProfile: input.examProfile });
    const question = set.questions.find((item) => item.kind === input.taskKind);
    if (!question) continue;

    return {
      packageId: "DI-001" as const,
      requestedSeed: seed,
      sourceSeed,
      examProfile: input.examProfile,
      stimulus: set.stimulus,
      question,
      traceability: {
        representation: "TABLE" as const,
        questionLogicVersion: "DI-001-QUESTION-LOGIC-V3" as const,
        setContractVersion: "DI-001-SET-CONTRACT-V2" as const,
        arithmeticAuthority: "EXACT_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING" as const,
        sourceFoundation: "DI-001-PHASE0-TABLE-STATE" as const,
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

  throw new Error(
    `DI-001 permanent generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`,
  );
}
