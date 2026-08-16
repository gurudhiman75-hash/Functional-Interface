import type { Cp010ReviewLanguage } from "./cp010-corpus-semantic-working";
import { tmwCp009NetRate } from "./cp009-core";
import { compare, divide, multiply, subtract, toLatex } from "./rational";
import type { Rational } from "./types";

type Triplet = readonly [string, string, string];

type ReviewQuestion = {
  canonicalProblemId?: string;
  solveMode?: string;
  stem?: string;
  parameters?: any;
  learnerExplanation?: { method: string; solution: string[]; answer: string; [key: string]: any };
  explanation?: { steps: string[]; conclusion: string; [key: string]: any };
  [key: string]: any;
};

function t(language: Cp010ReviewLanguage, values: Triplet): string {
  return language === "hi" ? values[1] : language === "pa" ? values[2] : values[0];
}

function math(value: string): string { return `\\(${value}\\)`; }
function absR(value: Rational): Rational {
  return { numerator: Math.abs(value.numerator), denominator: value.denominator };
}

function durationText(value: Rational | undefined, language: Cp010ReviewLanguage): string {
  if (!value) return "";
  const rendered = value.denominator === 1 ? String(value.numerator) : math(toLatex(value));
  return `${rendered} ${t(language, ["hours", "घंटे", "ਘੰਟੇ"])}`;
}

function polishLocalizedStem(question: ReviewQuestion, language: Cp010ReviewLanguage): string {
  let stem = question.stem ?? "";
  if (language === "en") return stem;

  const q = question.parameters;
  const mode = question.solveMode ?? "";

  if (language === "hi") {
    stem = stem
      .replace(/आउटलेट/gu, "निकासी पाइप")
      .replace(/(जलाशय शुरू में [^।]+?) भरी है/gu, "$1 भरा है");

    if (stem.includes("$5")) {
      if (mode === "findCompletionAfterDelayedActivation") {
        const target = q?.targetBoundary === "EMPTY" ? "खाली" : "भर";
        stem = stem.replace(/\$5 तक एक साथ चलते हैं/gu, `एक साथ चलते हैं, जब तक टंकी पूरी तरह ${target} न हो जाए`);
      } else {
        const duration = durationText(q?.stages?.[0]?.duration, language);
        stem = stem.replace(/\$5 तक/gu, `${duration} तक`);
      }
    }
  } else {
    stem = stem
      .replace(/ਆਉਟਲੈਟ/gu, "ਨਿਕਾਸੀ ਪਾਈਪ")
      .replace(/(ਜਲਾਸ਼ਯ ਸ਼ੁਰੂ ਵਿੱਚ [^।]+?) ਭਰੀ ਹੈ/gu, "$1 ਭਰਿਆ ਹੈ");

    if (stem.includes("$5")) {
      if (mode === "findCompletionAfterDelayedActivation") {
        const target = q?.targetBoundary === "EMPTY" ? "ਖਾਲੀ" : "ਭਰ";
        stem = stem.replace(/\$5 ਲਈ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ/gu, `ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ, ਜਦ ਤੱਕ ਟੈਂਕੀ ਪੂਰੀ ਤਰ੍ਹਾਂ ${target} ਨਾ ਜਾਵੇ`);
      } else {
        const duration = durationText(q?.stages?.[0]?.duration, language);
        stem = stem.replace(/\$5 ਲਈ/gu, `${duration} ਲਈ`);
      }
    }
  }

  return stem.replace(/\s{2,}/g, " ").trim();
}

function eventTimeWorking(question: ReviewQuestion, language: Cp010ReviewLanguage): string[] | null {
  if (question.solveMode !== "findEventTimeFromKnownCompletion") return null;
  const q = question.parameters;
  if (!q?.stages?.[0]?.pipes || !q?.stages?.[1]?.pipes || !q?.knownCompletionTime || !q?.initialLevel) return null;

  const firstRate = tmwCp009NetRate(q.stages[0].pipes);
  const laterRate = tmwCp009NetRate(q.stages[1].pipes);
  const target = q.targetLevel ?? { numerator: q.targetBoundary === "EMPTY" ? 0 : 1, denominator: 1 };
  const required = subtract(target, q.initialLevel);
  const laterAll = multiply(laterRate, q.knownCompletionTime);
  const difference = absR(subtract(laterAll, required));
  const rateGap = absR(subtract(firstRate, laterRate));
  const eventTime = divide(difference, rateGap);
  const relation = compare(laterAll, required) >= 0
    ? t(language, ["above the required change by", "आवश्यक परिवर्तन से अधिक है", "ਲੋੜੀਂਦੇ ਬਦਲਾਅ ਤੋਂ ਵੱਧ ਹੈ"])
    : t(language, ["below the required change by", "आवश्यक परिवर्तन से कम है", "ਲੋੜੀਂਦੇ ਬਦਲਾਅ ਤੋਂ ਘੱਟ ਹੈ"]);

  return [
    `${t(language, ["Required tank-level change", "आवश्यक टंकी-स्तर परिवर्तन", "ਲੋੜੀਂਦਾ ਟੈਂਕੀ-ਪੱਧਰ ਬਦਲਾਅ"])}: ${math(toLatex(required))}${language === "en" ? "." : "।"}`,
    `${t(language, ["If the later-stage rate ran for the whole known time", "यदि बाद वाले चरण की दर पूरे ज्ञात समय तक चले", "ਜੇ ਬਾਅਦਲੇ ਪੜਾਅ ਦੀ ਦਰ ਪੂਰੇ ਪਤਾ ਸਮੇਂ ਤੱਕ ਚੱਲੇ"])}: ${math(`${toLatex(laterRate)}\\times${toLatex(q.knownCompletionTime)}=${toLatex(laterAll)}`)}, ${relation} ${math(toLatex(difference))}${language === "en" ? "." : "।"}`,
    `${t(language, ["The two stage rates differ by", "दोनों चरणों की प्रति घंटे दरों का अंतर", "ਦੋਨਾਂ ਪੜਾਵਾਂ ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ ਦਾ ਫਰਕ"])} ${math(toLatex(rateGap))}; ${t(language, ["event time", "बदलाव का समय", "ਬਦਲਾਅ ਦਾ ਸਮਾਂ"])}: ${math(`${toLatex(difference)}\\div${toLatex(rateGap)}=${toLatex(eventTime)}`)} ${t(language, ["hours", "घंटे", "ਘੰਟੇ"])}${language === "en" ? "." : "।"}`,
  ];
}

export function polishTmwCp010FinalManualReview<T extends ReviewQuestion>(question: T, language: Cp010ReviewLanguage): T {
  if (question.canonicalProblemId !== "TMW-CP-010") return question;

  const stem = polishLocalizedStem(question, language);
  const eventWorking = eventTimeWorking(question, language);
  if (!eventWorking || !question.learnerExplanation) return { ...question, stem } as T;

  const answer = question.learnerExplanation.answer;
  const learnerExplanation = {
    ...question.learnerExplanation,
    solution: [...eventWorking, answer],
  };
  const explanation = question.explanation
    ? { ...question.explanation, steps: eventWorking, conclusion: answer }
    : question.explanation;

  return { ...question, stem, learnerExplanation, explanation } as T;
}
