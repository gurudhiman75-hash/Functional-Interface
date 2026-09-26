import { generateDi004V2Set } from "./line-set-v2";
import type { Di004V2ExamProfile, Di004V2TaskKind } from "./line-v2-types";

const MAX_TASK_SEARCH_ATTEMPTS = 256;

export function generateDi004V2ReviewQuestion(input: {
  seed: string;
  examProfile: Di004V2ExamProfile;
  taskKind: Di004V2TaskKind;
}) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-004 V2 review generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_TASK_SEARCH_ATTEMPTS; attempt += 1) {
    const sourceSeed = `${seed}:REVIEW:${input.taskKind}:${attempt}`;
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
      traceability: set.traceability,
    };
  }

  throw new Error(`DI-004 V2 review generation could not materialize ${input.taskKind} within ${MAX_TASK_SEARCH_ATTEMPTS} deterministic attempts.`);
}
