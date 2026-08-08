import { runTmwCp011Pipeline } from "./cp011-runtime";
import {
  localizeTmwCp011Question,
  type TmwCp011LocalizedQuestion,
} from "./localization-cp011";
import { remediateTmwCp011LocalizedQuestion } from "./cp011-editorial-review-remediation";
import { remediateTmwCp011TeachingLanguage } from "./cp011-teaching-language-remediation";
import type { TmwLocalizedLanguage } from "./localization-types";

function learnerText(question: TmwCp011LocalizedQuestion): string {
  return [
    question.stem,
    ...question.options,
    question.explanation.opening,
    question.explanation.formula,
    ...question.explanation.givens,
    ...question.explanation.steps,
    question.explanation.shortcut.title,
    ...question.explanation.shortcut.steps,
    question.explanation.commonTrap.explanation,
    question.explanation.conclusion,
  ].join("\n");
}

function naturalizeSeedDependentTrap(
  question: TmwCp011LocalizedQuestion,
): TmwCp011LocalizedQuestion {
  const current = question.explanation.commonTrap.explanation;
  const explanation = question.language === "hi"
    ? current
        .replaceAll("AP के कुल", "समान अंतर वाली दर-श्रृंखला के कुल")
        .replaceAll(
          "n दिनों में दर केवल n−1 बार बदलती है",
          "दिए दिनों में दर, दिनों की संख्या से एक कम बार बदलती है",
        )
        .replaceAll("r की घात", "दैनिक गुणक की घात")
        .replaceAll(
          "गुणक r को प्रतिदिन जोड़ने वाली निश्चित मात्रा समझ लिया गया; यहाँ दर को r से गुणा करना है",
          "दैनिक गुणक को प्रतिदिन जोड़ने वाली निश्चित मात्रा समझ लिया गया; यहाँ हर नई दर पिछली दर को उसी गुणक से गुणा करके बनती है",
        )
    : current
        .replaceAll("AP ਦੇ ਕੁੱਲ", "ਇੱਕੋ ਫਰਕ ਵਾਲੀ ਦਰ-ਲੜੀ ਦੇ ਕੁੱਲ")
        .replaceAll(
          "n ਦਿਨਾਂ ਵਿੱਚ ਦਰ ਕੇਵਲ n−1 ਵਾਰ ਬਦਲਦੀ ਹੈ",
          "ਦਿੱਤੇ ਦਿਨਾਂ ਵਿੱਚ ਦਰ, ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਘੱਟ ਵਾਰ ਬਦਲਦੀ ਹੈ",
        )
        .replaceAll("r ਦੀ ਘਾਤ", "ਰੋਜ਼ਾਨਾ ਗੁਣਕ ਦੀ ਘਾਤ")
        .replaceAll(
          "ਗੁਣਕ r ਨੂੰ ਹਰ ਦਿਨ ਜੋੜੀ ਜਾਣ ਵਾਲੀ ਨਿਰਧਾਰਤ ਮਾਤਰਾ ਸਮਝ ਲਿਆ ਗਿਆ; ਇੱਥੇ ਦਰ ਨੂੰ r ਨਾਲ ਗੁਣਾ ਕਰਨਾ ਹੈ",
          "ਰੋਜ਼ਾਨਾ ਗੁਣਕ ਨੂੰ ਹਰ ਦਿਨ ਜੋੜੀ ਜਾਣ ਵਾਲੀ ਨਿਰਧਾਰਤ ਮਾਤਰਾ ਸਮਝ ਲਿਆ ਗਿਆ; ਇੱਥੇ ਹਰ ਨਵੀਂ ਦਰ ਪਿਛਲੀ ਦਰ ਨੂੰ ਉਸੇ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਬਣਦੀ ਹੈ",
        );

  if (explanation === current) return question;
  return {
    ...question,
    explanation: {
      ...question.explanation,
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation,
      },
    },
  };
}

function removePunjabiDandaFalsePositive(
  question: TmwCp011LocalizedQuestion,
): TmwCp011LocalizedQuestion {
  if (question.language !== "pa") return question;
  if (!question.validation.errors.includes("Punjabi delivery contains Devanagari text")) return question;

  const outsideMath = learnerText(question).replace(/\\\([\s\S]*?\\\)/g, "");
  const hasActualDevanagari = /[\u0900-\u0963\u0966-\u097F]/.test(outsideMath);
  if (hasActualDevanagari) return question;

  const errors = question.validation.errors.filter(
    (error) => error !== "Punjabi delivery contains Devanagari text",
  );
  return {
    ...question,
    validation: {
      valid: errors.length === 0,
      errors,
    },
  };
}

export function runTmwCp011LocalizedPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: TmwLocalizedLanguage;
}): TmwCp011LocalizedQuestion {
  const source = runTmwCp011Pipeline(input.questionLanguageId, input.seed);
  const localized = localizeTmwCp011Question(source, input.language);
  const remediated = remediateTmwCp011LocalizedQuestion(source, localized);
  const teachingRemediated = remediateTmwCp011TeachingLanguage(
    remediated,
    source.questionLanguageId,
  );
  const trapRemediated = naturalizeSeedDependentTrap(teachingRemediated);
  return removePunjabiDandaFalsePositive(trapRemediated);
}
