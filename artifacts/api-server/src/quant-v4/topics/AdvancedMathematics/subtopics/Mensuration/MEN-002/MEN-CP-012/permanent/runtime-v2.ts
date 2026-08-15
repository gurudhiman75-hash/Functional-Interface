import {
  MEN_CP_012_PERMANENT_EDITORIAL_V2_AUTHORITY,
  generateMenCp012SecondaryMeasureDiversityV2,
  polishMenCp012PermanentEnglishV2,
} from "./editorial-v2";
import {
  generateMenCp012PermanentEnglishQuestion,
  generateMenCp012PermanentEnglishQuestionFromSource,
  listMenCp012PermanentEnglishSources,
  type MenCp012PermanentEnglishQuestion,
} from "./runtime-v1";
import type { MenCp012PermanentQlId } from "./allocation";

export const MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY =
  "MEN-CP012-PERMANENT-ENGLISH-RUNTIME-V2-SETTER-HARDENED" as const;

export type MenCp012PermanentEnglishQuestionV2 = Omit<
  MenCp012PermanentEnglishQuestion,
  "authority"
> & {
  readonly authority: typeof MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY;
  readonly editorialAuthority: typeof MEN_CP_012_PERMANENT_EDITORIAL_V2_AUTHORITY;
  readonly sourceRuntimeAuthority: string;
};

function applySecondaryDiversity(
  question: MenCp012PermanentEnglishQuestion & { readonly editorialAuthority: typeof MEN_CP_012_PERMANENT_EDITORIAL_V2_AUTHORITY },
) {
  if (question.sourceId !== "V3-UNEQUAL-SPHERES-TO-SPHERE-SURFACE-DECREASE") return question;
  const diversity = generateMenCp012SecondaryMeasureDiversityV2(question.seed);
  const wrongIds = [1, 2, 3];
  let wrongIndex = 0;
  const options = diversity.options.map((option) => ({
    ...option,
    misconceptionId: option.isCorrect
      ? null
      : `${question.sourceId}-SECONDARY-MEASURE-DISTRACTOR-${wrongIds[wrongIndex++]}`,
  }));
  const traps = [...new Set([...diversity.sourceTraps, ...question.explanation.traps])].slice(0, 4);
  return {
    ...question,
    sourceAuthority: diversity.sourceAuthority,
    stem: diversity.stem,
    options,
    correctIndex: diversity.correctIndex,
    answer: diversity.answer,
    explanation: {
      ...question.explanation,
      steps: diversity.steps,
      traps,
    },
    verification: diversity.verification,
  };
}

function harden(question: MenCp012PermanentEnglishQuestion): MenCp012PermanentEnglishQuestionV2 {
  const sourceRuntimeAuthority = question.sourceAuthority;
  const polished = polishMenCp012PermanentEnglishV2(question);
  const diversified = applySecondaryDiversity(polished);
  const result = {
    ...diversified,
    authority: MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY,
    sourceRuntimeAuthority,
    editorialAuthority: MEN_CP_012_PERMANENT_EDITORIAL_V2_AUTHORITY,
  } as MenCp012PermanentEnglishQuestionV2;

  if (!result.verification.valid) throw new Error(`${result.permanentQlId}/${result.seed}: V2 verification failed.`);
  if (result.options.length !== 4 || new Set(result.options.map((option) => option.display)).size !== 4) {
    throw new Error(`${result.permanentQlId}/${result.seed}: V2 option contract failed.`);
  }
  if (result.options.filter((option) => option.isCorrect).length !== 1 || result.options[result.correctIndex]?.display !== result.answer) {
    throw new Error(`${result.permanentQlId}/${result.seed}: V2 answer-position parity failed.`);
  }
  return result;
}

export function generateMenCp012PermanentEnglishQuestionV2(qlId: MenCp012PermanentQlId, seed: string) {
  return harden(generateMenCp012PermanentEnglishQuestion(qlId, seed));
}

export function generateMenCp012PermanentEnglishQuestionFromSourceV2(
  qlId: MenCp012PermanentQlId,
  sourceId: string,
  seed: string,
) {
  return harden(generateMenCp012PermanentEnglishQuestionFromSource(qlId, sourceId, seed));
}

export function listMenCp012PermanentEnglishSourcesV2() {
  return listMenCp012PermanentEnglishSources();
}
