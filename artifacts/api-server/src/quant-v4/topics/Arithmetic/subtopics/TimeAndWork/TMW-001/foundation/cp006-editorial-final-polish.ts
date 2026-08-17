import type { TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import type { TmwCp006Parameters, TmwCp006Solution } from "./cp006-types";

type Language = "en" | "hi" | "pa";

interface Cp006Question {
  canonicalProblemId?: string;
  cpId?: string;
  stem?: string;
  parameters?: TmwCp006Parameters;
  solution?: TmwCp006Solution;
  learnerExplanation?: TmwLearnerExplanationV2;
  publiclyPublishable?: boolean;
}

function t(language: Language, en: string, hi: string, pa: string): string {
  return language === "hi" ? hi : language === "pa" ? pa : en;
}

function exactDimensionalMeasure(question: Cp006Question, language: Language): "area" | "volume" | "क्षेत्रफल" | "आयतन" | "ਖੇਤਰਫਲ" | "ਆਇਤਨ" {
  const dimensions = question.parameters?.dimensionsA?.length ?? 3;
  if (language === "hi") return dimensions === 2 ? "क्षेत्रफल" : "आयतन";
  if (language === "pa") return dimensions === 2 ? "ਖੇਤਰਫਲ" : "ਆਇਤਨ";
  return dimensions === 2 ? "area" : "volume";
}

function answerMath(answerText: string): string {
  const inner = /\\\(([\s\S]*?)\\\)/.exec(answerText)?.[1];
  if (inner) {
    const numericMath = inner.replace(/\\text\{[^}]*\}/g, "").trim();
    if (numericMath) return `\\(${numericMath}\\)`;
  }
  const scalar = /-?\d+(?:\.\d+)?/.exec(answerText)?.[0];
  return scalar ? `\\(${scalar}\\)` : answerText;
}

export function polishTmwCp006EditorialReview<T extends Cp006Question>(
  question: T,
  qlId: string,
  language: Language,
): T {
  if ((question.canonicalProblemId ?? question.cpId) !== "TMW-CP-006" || !question.learnerExplanation) return question;

  let stem = question.stem ?? "";
  let learnerExplanation = question.learnerExplanation;

  if (qlId === "TMW-QL-108") {
    const answer = t(
      language,
      `Therefore, the required working time is ${question.solution?.answerText ?? ""}.`,
      `अतः आवश्यक कार्य-समय ${question.solution?.answerText ?? ""} है।`,
      `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਕੰਮ-ਸਮਾਂ ${question.solution?.answerText ?? ""} ਹੈ।`,
    );
    learnerExplanation = {
      ...learnerExplanation,
      answer,
      solution: [...learnerExplanation.solution.slice(0, -1), answer],
    };
  }

  if (qlId === "TMW-QL-116") {
    if (language === "hi") {
      stem = stem.replace(/वर्तमान प्रति-(.+?) गति समान रहे/g, "प्रति-$1 वर्तमान उत्पादकता समान रहे");
    } else if (language === "pa") {
      stem = stem.replace(/ਮੌਜੂਦਾ ਪ੍ਰਤੀ-(.+?) ਗਤੀ ਇੱਕੋ ਰਹੇ/g, "ਪ੍ਰਤੀ-$1 ਮੌਜੂਦਾ ਉਤਪਾਦਕਤਾ ਇੱਕੋ ਰਹੇ");
    }
  }

  if (qlId === "TMW-QL-119" && question.solution) {
    const overtime = answerMath(question.solution.answerText);
    const answer = t(
      language,
      `Therefore, each remaining worker must do ${overtime} hours of overtime per day.`,
      `अतः प्रत्येक शेष कर्मचारी को प्रतिदिन ${overtime} घंटे ओवरटाइम करना होगा।`,
      `ਇਸ ਲਈ ਹਰ ਬਚੇ ਕਰਮਚਾਰੀ ਨੂੰ ਹਰ ਦਿਨ ${overtime} ਘੰਟੇ ਓਵਰਟਾਈਮ ਕਰਨਾ ਪਵੇਗਾ।`,
    );
    learnerExplanation = {
      ...learnerExplanation,
      answer,
      solution: [...learnerExplanation.solution.slice(0, -1), answer],
    };
  }

  if (qlId === "TMW-QL-121") {
    const measure = exactDimensionalMeasure(question, language);
    if (language === "en") {
      stem = stem.replace(/relevant area or volume/gi, String(measure));
      learnerExplanation = {
        ...learnerExplanation,
        method: `Find each job's ${measure} from its dimensions, then compare the two values`,
      };
    } else if (language === "hi") {
      stem = stem.replace(/संबंधित क्षेत्रफल या आयतन/g, String(measure));
      learnerExplanation = {
        ...learnerExplanation,
        method: `दोनों कामों का ${measure} आयामों से निकालें और फिर उनका अनुपात लें`,
        solution: learnerExplanation.solution.map((item) => item.replace(/क्षेत्रफल\/आयतन/g, String(measure))),
      };
    } else {
      stem = stem.replace(/ਸੰਬੰਧਿਤ ਖੇਤਰਫਲ ਜਾਂ ਆਇਤਨ/g, String(measure));
      learnerExplanation = {
        ...learnerExplanation,
        method: `ਦੋਵੇਂ ਕੰਮਾਂ ਦਾ ${measure} ਮਾਪਾਂ ਤੋਂ ਕੱਢੋ ਅਤੇ ਫਿਰ ਉਨ੍ਹਾਂ ਦਾ ਅਨੁਪਾਤ ਲਓ`,
        solution: learnerExplanation.solution.map((item) => item.replace(/ਖੇਤਰਫਲ\/ਆਇਤਨ/g, String(measure))),
      };
    }
  }

  if (qlId === "TMW-QL-127") {
    const answer = t(
      language,
      `Therefore, the equivalent total is ${question.solution?.answerText ?? ""}.`,
      `अतः समतुल्य कुल ${question.solution?.answerText ?? ""} है।`,
      `ਇਸ ਲਈ ਸਮਤੁੱਲ ਕੁੱਲ ${question.solution?.answerText ?? ""} ਹੈ।`,
    );
    learnerExplanation = {
      ...learnerExplanation,
      answer,
      solution: [...learnerExplanation.solution.slice(0, -1), answer],
    };
  }

  return {
    ...question,
    stem,
    learnerExplanation,
    publiclyPublishable: false,
  };
}
