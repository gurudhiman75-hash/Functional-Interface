import { runAvg001Cp004Pipeline } from "./cp004-runtime";
import type {
  Avg001Language,
  Avg001QuestionPackage,
} from "./types";

function restoreExternalIdentity(
  pkg: Avg001QuestionPackage,
  questionLanguageId: string,
  seed: string,
): Avg001QuestionPackage {
  return {
    ...pkg,
    questionId: `AVG-001:${questionLanguageId}:${seed}`,
    seed,
    parameters: {
      ...pkg.parameters,
      seed,
    },
  };
}

export function runAvg001Cp004ExactPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001QuestionPackage {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const internalSeed =
      attempt === 0 ? input.seed : `${input.seed}:cp004-exact-retry:${attempt}`;
    try {
      return restoreExternalIdentity(
        runAvg001Cp004Pipeline({
          ...input,
          seed: internalSeed,
        }),
        input.questionLanguageId,
        input.seed,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/not exact at (?:1|2) decimal places/.test(message)) throw error;
    }
  }

  throw new Error(
    `Unable to construct an exact-display CP-004 state for ${input.questionLanguageId}`,
  );
}
