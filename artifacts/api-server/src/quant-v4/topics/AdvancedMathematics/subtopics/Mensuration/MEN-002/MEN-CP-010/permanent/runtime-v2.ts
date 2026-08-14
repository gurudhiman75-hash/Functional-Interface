import {
  generateMenCp010PermanentEnglishQuestion as generateEditorialMenCp010PermanentEnglishQuestion,
  listMenCp010PermanentEnglishSources,
  type MenCp010PermanentEnglishQuestion,
} from "./runtime";
import type { MenCp010PermanentQlId } from "./allocation";
import { buildMenCp010WorkedExplanation } from "./worked-explanation-v1";

function simplifySurdDisplay(text: string) {
  const match = /^√(\d+)(\s.*)?$/.exec(text.trim());
  if (!match) return text;
  const radicand = Number(match[1]);
  if (!Number.isSafeInteger(radicand) || radicand <= 0) return text;
  for (let factor = Math.floor(Math.sqrt(radicand)); factor >= 2; factor -= 1) {
    const square = factor * factor;
    if (radicand % square !== 0) continue;
    const remaining = radicand / square;
    const exact = remaining === 1 ? `${factor}` : `${factor}√${remaining}`;
    return `${exact}${match[2] ?? ""}`;
  }
  return text;
}

function finalEditorialPolish(q: MenCp010PermanentEnglishQuestion): MenCp010PermanentEnglishQuestion {
  let stem = q.stem;
  let answer = q.answer;
  let options = q.options;

  if (q.sourceId === "CP010-D2-APP-BUCKET-CAPACITY-LITRES") {
    stem = stem.replace("A bucket is shaped like a conical frustum", "A storage vessel is shaped like a conical frustum");
  }
  if (q.sourceId === "V3-REGULAR-FRUSTUM-VOLUME") {
    stem = stem.replace("Find volume.", "Find its volume.");
  }
  if (q.sourceId === "V3-SURD-SLANT-REPRESENTATION") {
    answer = simplifySurdDisplay(answer);
    options = q.options.map((option) => ({ ...option, display: simplifySurdDisplay(option.display) }));
  }

  return { ...q, stem, answer, options };
}

/**
 * Editorial V2 keeps the mathematically proved permanent runtime and adds a
 * state-specific worked solution. The source generator remains the authority
 * for answer/verification; this layer only improves learner presentation.
 */
export function generateMenCp010PermanentEnglishQuestion(
  qlId: MenCp010PermanentQlId,
  seed: string,
): MenCp010PermanentEnglishQuestion {
  const q = finalEditorialPolish(generateEditorialMenCp010PermanentEnglishQuestion(qlId, seed));
  return {
    ...q,
    explanation: buildMenCp010WorkedExplanation(q, q.stem, q.answer),
  };
}

export { listMenCp010PermanentEnglishSources };
export type { MenCp010PermanentEnglishQuestion };
