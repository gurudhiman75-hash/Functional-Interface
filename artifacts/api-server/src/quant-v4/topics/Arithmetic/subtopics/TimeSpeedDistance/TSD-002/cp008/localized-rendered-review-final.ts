import { TSD_CP008_QL099_SAME_DIRECTION_GUARDS } from "./localization-final";
import {
  TSD_CP008_RENDERED_HINDI_QUESTIONS as RAW_HINDI,
  TSD_CP008_RENDERED_PUNJABI_QUESTIONS as RAW_PUNJABI,
  type TsdCp008RenderedLocalizedQuestion,
} from "./localized-rendered-review";

function finalize(
  questions: readonly TsdCp008RenderedLocalizedQuestion[],
  sameDirectionMarker: RegExp,
  guard: string,
): readonly TsdCp008RenderedLocalizedQuestion[] {
  return Object.freeze(questions.map((question) => {
    const needsGuard = question.qlId === "TSD-QL-099" && sameDirectionMarker.test(question.stem);
    return Object.freeze({
      ...question,
      stem: needsGuard ? `${guard} ${question.stem}` : question.stem,
    });
  }));
}

export const TSD_CP008_FINAL_RENDERED_HINDI_QUESTIONS = finalize(
  RAW_HINDI,
  /एक ही दिशा में/,
  TSD_CP008_QL099_SAME_DIRECTION_GUARDS.hi,
);

export const TSD_CP008_FINAL_RENDERED_PUNJABI_QUESTIONS = finalize(
  RAW_PUNJABI,
  /ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ/,
  TSD_CP008_QL099_SAME_DIRECTION_GUARDS.pa,
);

export const TSD_CP008_FINAL_RENDERED_LOCALIZED_QUESTIONS = Object.freeze([
  ...TSD_CP008_FINAL_RENDERED_HINDI_QUESTIONS,
  ...TSD_CP008_FINAL_RENDERED_PUNJABI_QUESTIONS,
]);

export type { TsdCp008RenderedLocalizedQuestion } from "./localized-rendered-review";
