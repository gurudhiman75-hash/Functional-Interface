import { generateDi002V2Set } from "./advanced-table-set-v2";
import type { Di002V2ExamProfile, Di002V2TaskKind } from "./advanced-table-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi002V2ReviewQuestion(input: {
  seed: string;
  examProfile: Di002V2ExamProfile;
  taskKind: Di002V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-002 V2 review generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:REVIEW:${input.taskKind}:${attempt}`;
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
      traceability: set.traceability,
    };
  }

  throw new Error(`DI-002 V2 review generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`);
}
