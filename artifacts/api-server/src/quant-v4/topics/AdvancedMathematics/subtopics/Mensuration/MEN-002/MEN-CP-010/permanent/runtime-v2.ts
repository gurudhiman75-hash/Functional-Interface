import {
  generateMenCp010PermanentEnglishQuestion as generateEditorialMenCp010PermanentEnglishQuestion,
  listMenCp010PermanentEnglishSources,
  type MenCp010PermanentEnglishQuestion,
} from "./runtime";
import type { MenCp010PermanentQlId } from "./allocation";
import { buildMenCp010WorkedExplanation } from "./worked-explanation-v1";

/**
 * Editorial V2 keeps the mathematically proved permanent runtime and adds a
 * state-specific worked solution. The source generator remains the authority
 * for answer/verification; this layer only improves learner presentation.
 */
export function generateMenCp010PermanentEnglishQuestion(
  qlId: MenCp010PermanentQlId,
  seed: string,
): MenCp010PermanentEnglishQuestion {
  const q = generateEditorialMenCp010PermanentEnglishQuestion(qlId, seed);
  return {
    ...q,
    explanation: buildMenCp010WorkedExplanation(q, q.stem, q.answer),
  };
}

export { listMenCp010PermanentEnglishSources };
export type { MenCp010PermanentEnglishQuestion };
