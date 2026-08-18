import { createHash } from "node:crypto";

import {
  TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
  TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS,
  generateExamRealLocalizedTrg002Question as generateRemediatedQuestion,
  type Trg002ExamRealnessLocale,
} from "./localization-exam-realness-v2-remediated";

export {
  TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
  TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS,
};
export type { Trg002ExamRealnessLocale };

type AnyQuestion = Record<string, any>;

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}
function sha256(value: unknown) {
  return createHash("sha256").update(typeof value === "string" ? value : stableJson(value), "utf8").digest("hex");
}

function editorialPolish(text: string, locale: Trg002ExamRealnessLocale) {
  if (locale === "hi-IN") {
    return text
      .replaceAll("दृष्टि-रेखाs", "दृष्टि-रेखाएँ")
      .replaceAll("दोनों दृष्टि-रेखाएँ को साथ हल करें", "दोनों दृष्टि-रेखाओं के समीकरणों को साथ हल करें")
      .replaceAll("ऊँचाइयों का ऊँचाई का अंतर", "दोनों ऊँचाइयों का अंतर")
      .replaceAll("ऊँचाइयों का ऊँचाई में अंतर", "दोनों ऊँचाइयों का अंतर")
      .replaceAll("टैन", "tan")
      .replaceAll("tan θ में लंबवत भुजा आँख के स्तर से इमारत के शीर्ष तक की ऊँचाई होती है।", "tan θ = आँख के स्तर से इमारत के शीर्ष तक की ऊँचाई / क्षैतिज दूरी।");
  }
  return text
    .replaceAll("ਡਿਪ੍ਰੈਸ਼ਨ", "ਅਵਨਮਨ")
    .replaceAll("ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾs", "ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾਵਾਂ")
    .replaceAll("ਦੋਵੇਂ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾਵਾਂ ਇਕੱਠੇ ਹੱਲ ਕਰੋ", "ਦੋਵੇਂ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾਵਾਂ ਦੇ ਸਮੀਕਰਨ ਇਕੱਠੇ ਹੱਲ ਕਰੋ")
    .replaceAll("ਉਚਾਈਆਂ ਦਾ ਉਚਾਈ ਦਾ ਅੰਤਰ", "ਦੋਵੇਂ ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ")
    .replaceAll("ਉਚਾਈਆਂ ਦਾ ਉਚਾਈ ਵਿੱਚ ਅੰਤਰ", "ਦੋਵੇਂ ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ")
    .replaceAll("ਟੈਨ", "tan")
    .replaceAll("tan θ ਵਿੱਚ ਲੰਬ ਭੁਜਾ ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਇਮਾਰਤ ਦੀ ਚੋਟੀ ਤੱਕ ਦੀ ਉਚਾਈ ਹੁੰਦੀ ਹੈ।", "tan θ = ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਇਮਾਰਤ ਦੀ ਚੋਟੀ ਤੱਕ ਦੀ ਉਚਾਈ / ਖਿਤਿਜੀ ਦੂਰੀ।");
}

function polishExplanation(explanation: AnyQuestion, locale: Trg002ExamRealnessLocale) {
  return {
    ...explanation,
    keyRule: editorialPolish(explanation.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({ ...step, body: editorialPolish(step.body, locale) })),
    shortcut: editorialPolish(explanation.shortcut, locale),
    traps: explanation.traps.map((trap: string) => editorialPolish(trap, locale)),
  };
}

export function generateExamRealLocalizedTrg002Question(qlId: string, seed: string, locale: Trg002ExamRealnessLocale) {
  const base: AnyQuestion = generateRemediatedQuestion(qlId, seed, locale);
  const stem = editorialPolish(base.stem, locale);
  const explanation = polishExplanation(base.explanation, locale);
  const localizationFingerprint = sha256({
    version: TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
    locale,
    qlId,
    seed,
    canonicalSemanticFingerprint: base.localizationProof.canonicalSemanticFingerprint,
    stem,
    explanation,
  });
  return {
    ...base,
    stem,
    explanation,
    localizationProof: {
      ...base.localizationProof,
      localizationFingerprint,
      finalExamLanguageEditorialPolish: true,
    },
    realnessRemediation: {
      ...base.realnessRemediation,
      finalExamLanguageEditorialPolish: true,
    },
  };
}

export function buildTrg002ExamRealnessV2ReviewBank(locale: Trg002ExamRealnessLocale, seedsPerQl = 12) {
  return TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, index) => generateExamRealLocalizedTrg002Question(
      qlId,
      `trg002-exam-realness-v2-${String(index + 1).padStart(2, "0")}`,
      locale,
    )),
  );
}
