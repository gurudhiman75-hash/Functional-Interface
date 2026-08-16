import type { NumCp003PermanentQlId } from "./allocation";
import { buildNumCp003FinalQuestionSpecificConcept } from "./editorial-v2-concept-final";
import {
  NUM_CP003_EDITORIAL_V2_RELEASE,
  runNumCp003EditorialV2,
  type NumCp003EditorialV2Question,
} from "./editorial-v2";
import { buildNumCp003FinalTeachingSolution } from "./editorial-v2-teaching-solution-final";
import type { NumCp003PermanentRuntimeInput } from "./runtime";

export { NUM_CP003_EDITORIAL_V2_RELEASE };
export type { NumCp003EditorialV2Question };

function refineQuestion(question: NumCp003EditorialV2Question): NumCp003EditorialV2Question {
  const solution = buildNumCp003FinalTeachingSolution(question.hiddenState);
  if (solution.length < 2 || solution.length > 4) {
    throw new Error(`${question.permanentQlId}/${question.seed}: final V2 solution must contain 2-4 lines`);
  }

  const concept = buildNumCp003FinalQuestionSpecificConcept(question.hiddenState);
  if (!concept.startsWith("This question tests ")) {
    throw new Error(`${question.permanentQlId}/${question.seed}: concept does not identify the tested skill`);
  }

  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      concept,
      solution,
    }),
  });
}

export function runNumCp003EditorialV2Final(
  input: NumCp003PermanentRuntimeInput = {},
): NumCp003EditorialV2Question {
  return refineQuestion(runNumCp003EditorialV2(input));
}

export function runNumCp003EditorialV2FinalForQl(
  questionLanguageId: NumCp003PermanentQlId,
  seed: string,
): NumCp003EditorialV2Question {
  return runNumCp003EditorialV2Final({ questionLanguageId, seed, language: "en" });
}
