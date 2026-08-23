import {
  TSD_CP008_RENDERED_HINDI_QUESTIONS as RAW_HINDI,
  TSD_CP008_RENDERED_PUNJABI_QUESTIONS as RAW_PUNJABI,
  type TsdCp008RenderedLocalizedQuestion,
} from "./localized-rendered-review";

function finalize(
  questions: readonly TsdCp008RenderedLocalizedQuestion[],
  guard: string,
): readonly TsdCp008RenderedLocalizedQuestion[] {
  return Object.freeze(questions.map((question) => Object.freeze({
    ...question,
    stem: question.qlId === "TSD-QL-099" ? `${guard} ${question.stem}` : question.stem,
  })));
}

export const TSD_CP008_FINAL_RENDERED_HINDI_QUESTIONS = finalize(
  RAW_HINDI,
  "समान दिशा वाली स्थिति में पहली ट्रेन को तेज माना जाए।",
);

export const TSD_CP008_FINAL_RENDERED_PUNJABI_QUESTIONS = finalize(
  RAW_PUNJABI,
  "ਇੱਕੋ ਦਿਸ਼ਾ ਵਾਲੀ ਸਥਿਤੀ ਵਿੱਚ ਪਹਿਲੀ ਰੇਲਗੱਡੀ ਨੂੰ ਤੇਜ਼ ਮੰਨਿਆ ਜਾਵੇ।",
);

export const TSD_CP008_FINAL_RENDERED_LOCALIZED_QUESTIONS = Object.freeze([
  ...TSD_CP008_FINAL_RENDERED_HINDI_QUESTIONS,
  ...TSD_CP008_FINAL_RENDERED_PUNJABI_QUESTIONS,
]);

export type { TsdCp008RenderedLocalizedQuestion } from "./localized-rendered-review";
