import { createHash } from "node:crypto";

import type { SufficiencyClass } from "../foundation/index.ts";
import {
  generateDsfExamProfileBatch,
  type DsfExamProfileInput,
  type DsfExamProfileQuestion,
} from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import { DSF_CP007_PRODUCTION_PACKAGE } from "../DSF-CP-007/production-readiness-freeze-v1.ts";

export const DSF_CP008_CHECKPOINT_ID = "DSF-CP-008" as const;
export const DSF_CP008_LOCALIZATION_AUTHORITY =
  "DSF_CP008_HI_PA_LOCALIZATION_REVIEW_CANDIDATE_V1" as const;
export const DSF_CP008_HUMAN_REVIEW_BLOCKER =
  "HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

export const DSF_CP008_LOCALIZED_LANGUAGES = ["hi", "pa"] as const;
export const DSF_CP008_SUPPORTED_LANGUAGES = ["en", ...DSF_CP008_LOCALIZED_LANGUAGES] as const;
export type DsfLocalizedLanguage = (typeof DSF_CP008_LOCALIZED_LANGUAGES)[number];
export type DsfLocalizedLocale = "hi-IN" | "pa-IN";

export type DsfLocalizationInput = Omit<DsfExamProfileInput, "language"> & {
  readonly language: DsfLocalizedLanguage;
};

export type DsfLocalizedExamProfileQuestion = Omit<
  DsfExamProfileQuestion,
  | "questionId"
  | "language"
  | "locale"
  | "stem"
  | "questionPrompt"
  | "statements"
  | "options"
  | "explanation"
  | "validation"
  | "lifecycle"
> & {
  readonly questionId: string;
  readonly language: DsfLocalizedLanguage;
  readonly locale: DsfLocalizedLocale;
  readonly canonicalEnglishProfileQuestionId: string;
  readonly localizationCheckpointId: typeof DSF_CP008_CHECKPOINT_ID;
  readonly localizationAuthority: typeof DSF_CP008_LOCALIZATION_AUTHORITY;
  readonly stem: string;
  readonly questionPrompt: string;
  readonly statements: readonly [
    { readonly id: "I"; readonly text: string },
    { readonly id: "II"; readonly text: string },
  ];
  readonly options: readonly {
    readonly key: "A" | "B" | "C" | "D" | "E";
    readonly value: string;
    readonly semanticClass: SufficiencyClass;
    readonly isCorrect: boolean;
  }[];
  readonly explanation: {
    readonly askedTarget: string;
    readonly statementI: string;
    readonly statementII: string;
    readonly together?: string;
    readonly conclusion: string;
    readonly steps: readonly string[];
  };
  readonly localization: {
    readonly sourceLanguage: "en";
    readonly sourceLocale: "en-IN";
    readonly language: DsfLocalizedLanguage;
    readonly locale: DsfLocalizedLocale;
    readonly authority: typeof DSF_CP008_LOCALIZATION_AUTHORITY;
    readonly status: "EXECUTABLE_REVIEW_REQUIRED";
    readonly semanticParity: "EXECUTABLE_PROVED";
    readonly learnerTextLocalized: true;
    readonly optionSemanticOrderPreserved: true;
    readonly correctIndexPreserved: true;
    readonly canonicalAnswerPreserved: true;
    readonly humanLanguageReviewRequired: true;
    readonly activeEditorialBlockers: readonly [typeof DSF_CP008_HUMAN_REVIEW_BLOCKER];
  };
  readonly validation: DsfExamProfileQuestion["validation"] & {
    readonly localizationRecognized: true;
    readonly localizedLearnerText: true;
    readonly semanticParityPreserved: true;
    readonly optionSemanticOrderPreserved: true;
    readonly correctIndexPreserved: true;
    readonly canonicalAnswerPreserved: true;
  };
  readonly lifecycle: {
    readonly questionStudioDiscoverable: true;
    readonly persistenceAllowed: true;
    readonly reviewOnly: true;
    readonly questionBankStatus: "NOT_STORED";
    readonly questionBankWritable: false;
    readonly testEligibility: "INELIGIBLE";
    readonly testEligible: false;
    readonly mockTestEligible: false;
    readonly publiclyPublishable: false;
    readonly manualApprovalRequired: true;
    readonly automaticStudentPublication: false;
  };
};

function textFor(locale: DsfLocalizedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function localeFor(language: DsfLocalizedLanguage): DsfLocalizedLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function statementLabel(label: string, locale: DsfLocalizedLocale): string {
  if (label === "Statement I") return textFor(locale, "कथन I", "ਕਥਨ I");
  if (label === "Statement II") return textFor(locale, "कथन II", "ਕਥਨ II");
  throw new Error(`Unsupported DSF statement label '${label}'.`);
}

function parityWord(value: string, locale: DsfLocalizedLocale): string {
  if (value.toLowerCase() === "even") return textFor(locale, "सम", "ਜੁੜਾ");
  if (value.toLowerCase() === "odd") return textFor(locale, "विषम", "ਬੇਜੋੜ");
  throw new Error(`Unsupported parity '${value}'.`);
}

function semanticText(semanticClass: SufficiencyClass, locale: DsfLocalizedLocale): string {
  const hi: Record<SufficiencyClass, string> = {
    STATEMENT_I_ONLY: "केवल कथन I पर्याप्त है।",
    STATEMENT_II_ONLY: "केवल कथन II पर्याप्त है।",
    EACH_STATEMENT_ALONE: "प्रत्येक कथन अकेले पर्याप्त है।",
    BOTH_TOGETHER_ONLY: "दोनों कथन साथ में पर्याप्त हैं, लेकिन कोई भी कथन अकेले पर्याप्त नहीं है।",
    INSUFFICIENT_EVEN_TOGETHER: "दोनों कथनों को साथ लेने पर भी वे पर्याप्त नहीं हैं।",
  };
  const pa: Record<SufficiencyClass, string> = {
    STATEMENT_I_ONLY: "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ।",
    STATEMENT_II_ONLY: "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ।",
    EACH_STATEMENT_ALONE: "ਹਰ ਕਥਨ ਆਪਣੇ ਆਪ ਵਿੱਚ ਕਾਫ਼ੀ ਹੈ।",
    BOTH_TOGETHER_ONLY: "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
    INSUFFICIENT_EVEN_TOGETHER: "ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ 'ਤੇ ਵੀ ਉਹ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।",
  };
  return locale === "hi-IN" ? hi[semanticClass] : pa[semanticClass];
}

function localizeListFragment(value: string, locale: DsfLocalizedLocale): string {
  let result = value;
  const replacements: readonly [string, string, string][] = [
    ["the final value is above the original value", "अंतिम मान मूल मान से अधिक है", "ਅੰਤਿਮ ਮੁੱਲ ਮੂਲ ਮੁੱਲ ਤੋਂ ਵੱਧ ਹੈ"],
    ["the final value is below the original value", "अंतिम मान मूल मान से कम है", "ਅੰਤਿਮ ਮੁੱਲ ਮੂਲ ਮੁੱਲ ਤੋਂ ਘੱਟ ਹੈ"],
    ["the final value is equal to the original value", "अंतिम मान मूल मान के बराबर है", "ਅੰਤਿਮ ਮੁੱਲ ਮੂਲ ਮੁੱਲ ਦੇ ਬਰਾਬਰ ਹੈ"],
    ["A is greater than B", "A, B से बड़ा है", "A, B ਤੋਂ ਵੱਡਾ ਹੈ"],
    ["B is greater than A", "B, A से बड़ा है", "B, A ਤੋਂ ਵੱਡਾ ਹੈ"],
    [" and others", " और अन्य", " ਅਤੇ ਹੋਰ"],
    [" or ", " या ", " ਜਾਂ "],
  ];
  for (const [from, hi, pa] of replacements) {
    result = result.split(from).join(textFor(locale, hi, pa));
  }
  return result;
}

function questionPrompt(source: DsfExamProfileQuestion, locale: DsfLocalizedLocale): string {
  switch (source.targetKind) {
    case "MISSING_DIGIT":
      return textFor(locale, "X का मान क्या है?", "X ਦਾ ਮੁੱਲ ਕੀ ਹੈ?");
    case "DIGIT_PARITY":
      return textFor(locale, "क्या X सम है या विषम?", "ਕੀ X ਜੁੜਾ ਹੈ ਜਾਂ ਬੇਜੋੜ?");
    case "RATIO_AB":
      return textFor(locale, "A:B का सरलतम अनुपात क्या है?", "A:B ਦਾ ਸਭ ਤੋਂ ਸਰਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?");
    case "GREATER_QUANTITY":
      return textFor(locale, "A और B में कौन बड़ा है?", "A ਅਤੇ B ਵਿੱਚੋਂ ਕਿਹੜਾ ਵੱਡਾ ਹੈ?");
    case "NET_PERCENT_CHANGE":
      return textFor(locale, "मूल मान से शुद्ध प्रतिशत परिवर्तन कितना है?", "ਮੂਲ ਮੁੱਲ ਤੋਂ ਸ਼ੁੱਧ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਕਿੰਨਾ ਹੈ?");
    case "FINAL_DIRECTION":
      return textFor(locale, "क्या अंतिम मान मूल मान से अधिक, कम या बराबर है?", "ਕੀ ਅੰਤਿਮ ਮੁੱਲ ਮੂਲ ਮੁੱਲ ਤੋਂ ਵੱਧ, ਘੱਟ ਜਾਂ ਬਰਾਬਰ ਹੈ?");
    case "EXACT_VALUE_X":
      return textFor(
        locale,
        "निर्णय कीजिए कि कथन I, कथन II या दोनों मिलकर x का एकमात्र मान निर्धारित करने के लिए पर्याप्त हैं।",
        "ਫੈਸਲਾ ਕਰੋ ਕਿ ਕਥਨ I, ਕਥਨ II ਜਾਂ ਦੋਵੇਂ ਮਿਲ ਕੇ x ਦਾ ਇਕੋ ਇਕ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਹਨ।",
      );
    default:
      throw new Error(`${source.questionId}: unsupported localized target kind '${source.targetKind}'.`);
  }
}

function localizedStem(source: DsfExamProfileQuestion, prompt: string, locale: DsfLocalizedLocale): string {
  if (source.domain === "NUMBER_SYSTEM") {
    const template = source.stem.match(/number\s+([0-9]{2}X)/i)?.[1];
    if (!template) throw new Error(`${source.questionId}: unable to recover Number System numeral template.`);
    return textFor(
      locale,
      `तीन अंकों की संख्या ${template} में X एक अंक है। ${prompt}`,
      `ਤਿੰਨ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ${template} ਵਿੱਚ X ਇੱਕ ਅੰਕ ਹੈ। ${prompt}`,
    );
  }
  if (source.domain === "RATIO_PROPORTION") {
    return textFor(
      locale,
      `A और B, 2 से 18 के बीच अलग-अलग धनात्मक पूर्णांक हैं। ${prompt}`,
      `A ਅਤੇ B, 2 ਤੋਂ 18 ਦੇ ਵਿਚਕਾਰ ਵੱਖ-ਵੱਖ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਹਨ। ${prompt}`,
    );
  }
  if (source.domain === "PERCENTAGE") {
    return textFor(
      locale,
      `P और Q प्रतिशत दरें हैं; दोनों 5% से 50% तक 5 के गुणज हैं। किसी मान को पहले P% बढ़ाया जाता है और फिर Q% घटाया जाता है। ${prompt}`,
      `P ਅਤੇ Q ਪ੍ਰਤੀਸ਼ਤ ਦਰਾਂ ਹਨ; ਦੋਵੇਂ 5% ਤੋਂ 50% ਤੱਕ 5 ਦੇ ਗੁਣਜ ਹਨ। ਕਿਸੇ ਮੁੱਲ ਨੂੰ ਪਹਿਲਾਂ P% ਵਧਾਇਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਫਿਰ Q% ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ। ${prompt}`,
    );
  }
  if (source.domain === "ALGEBRA") {
    return textFor(
      locale,
      "क्या नीचे दिए गए कथनों से x का मान uniquely निर्धारित किया जा सकता है?".replace("uniquely", "एकमात्र रूप से"),
      "ਕੀ ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ x ਦਾ ਮੁੱਲ ਇਕੋ ਇਕ ਰੂਪ ਵਿੱਚ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?",
    );
  }
  throw new Error(`${source.questionId}: unsupported localization domain '${source.domain}'.`);
}

function localizeNumberStatement(text: string, locale: DsfLocalizedLocale): string {
  let match = text.match(/^The completed number is divisible by (\d+)\.$/);
  if (match) return textFor(locale, `पूर्ण संख्या ${match[1]} से विभाज्य है।`, `ਪੂਰੀ ਸੰਖਿਆ ${match[1]} ਨਾਲ ਭਾਗਯੋਗ ਹੈ।`);
  match = text.match(/^X is an (even|odd) digit\.$/);
  if (match) return textFor(locale, `X एक ${parityWord(match[1]!, locale)} अंक है।`, `X ਇੱਕ ${parityWord(match[1]!, locale)} ਅੰਕ ਹੈ।`);
  if (text === "X is a prime digit.") return textFor(locale, "X एक अभाज्य अंक है।", "X ਇੱਕ ਅਭਾਜ ਅੰਕ ਹੈ।");
  match = text.match(/^X is a multiple of (\d+)\.$/);
  if (match) return textFor(locale, `X, ${match[1]} का गुणज है।`, `X, ${match[1]} ਦਾ ਗੁਣਜ ਹੈ।`);
  match = text.match(/^X is less than (\d+)\.$/);
  if (match) return textFor(locale, `X, ${match[1]} से छोटा है।`, `X, ${match[1]} ਤੋਂ ਛੋਟਾ ਹੈ।`);
  match = text.match(/^X is greater than (\d+)\.$/);
  if (match) return textFor(locale, `X, ${match[1]} से बड़ा है।`, `X, ${match[1]} ਤੋਂ ਵੱਡਾ ਹੈ।`);
  throw new Error(`Unrecognized Number System DSF statement: ${text}`);
}

function localizeRatioStatement(text: string, locale: DsfLocalizedLocale): string {
  if (/^[AB]\s*[+:=]\s*[AB0-9 :+=.-]+\.$/.test(text) || /^[AB]\s*=\s*-?\d+\.$/.test(text)) return text;
  let match = text.match(/^([AB]) is (\d+) greater than ([AB])\.$/);
  if (match) return textFor(locale, `${match[1]}, ${match[3]} से ${match[2]} अधिक है।`, `${match[1]}, ${match[3]} ਤੋਂ ${match[2]} ਵੱਧ ਹੈ।`);
  match = text.match(/^([AB]) is greater than ([AB])\.$/);
  if (match) return textFor(locale, `${match[1]}, ${match[2]} से बड़ा है।`, `${match[1]}, ${match[2]} ਤੋਂ ਵੱਡਾ ਹੈ।`);
  match = text.match(/^([AB]) is (even|odd)\.$/);
  if (match) return textFor(locale, `${match[1]} ${parityWord(match[2]!, locale)} है।`, `${match[1]} ${parityWord(match[2]!, locale)} ਹੈ।`);
  match = text.match(/^([AB]) is greater than (-?\d+)\.$/);
  if (match) return textFor(locale, `${match[1]}, ${match[2]} से बड़ा है।`, `${match[1]}, ${match[2]} ਤੋਂ ਵੱਡਾ ਹੈ।`);
  match = text.match(/^([AB]) is less than (-?\d+)\.$/);
  if (match) return textFor(locale, `${match[1]}, ${match[2]} से छोटा है।`, `${match[1]}, ${match[2]} ਤੋਂ ਛੋਟਾ ਹੈ।`);
  match = text.match(/^The product of A and B is (-?\d+)\.$/);
  if (match) return textFor(locale, `A और B का गुणनफल ${match[1]} है।`, `A ਅਤੇ B ਦਾ ਗੁਣਨਫਲ ${match[1]} ਹੈ।`);
  match = text.match(/^A \+ B is (even|odd)\.$/);
  if (match) return textFor(locale, `A + B ${parityWord(match[1]!, locale)} है।`, `A + B ${parityWord(match[1]!, locale)} ਹੈ।`);
  throw new Error(`Unrecognized Ratio DSF statement: ${text}`);
}

function localizePercentageStatement(text: string, locale: DsfLocalizedLocale): string {
  if (/^[PQ](?:\s*\+\s*[PQ])?\s*=\s*[0-9]+%?\.$/.test(text) || /^P\s*:\s*Q\s*=/.test(text) || /^P\s*=\s*Q\.$/.test(text)) return text;
  let match = text.match(/^([PQ]) is (\d+) percentage points greater than ([PQ])\.$/);
  if (match) return textFor(locale, `${match[1]}, ${match[3]} से ${match[2]} प्रतिशत अंक अधिक है।`, `${match[1]}, ${match[3]} ਤੋਂ ${match[2]} ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਵੱਧ ਹੈ।`);
  if (text === "P and Q are equal.") return textFor(locale, "P और Q बराबर हैं।", "P ਅਤੇ Q ਬਰਾਬਰ ਹਨ।");
  let product = text.match(/^The product of the numerical values of P and Q is (\d+)\.$/);
  if (product) return textFor(locale, `P और Q के संख्यात्मक मानों का गुणनफल ${product[1]} है।`, `P ਅਤੇ Q ਦੇ ਅੰਕੀ ਮੁੱਲਾਂ ਦਾ ਗੁਣਨਫਲ ${product[1]} ਹੈ।`);
  match = text.match(/^([PQ]) is greater than ([PQ])\.$/);
  if (match) return textFor(locale, `${match[1]}, ${match[2]} से बड़ा है।`, `${match[1]}, ${match[2]} ਤੋਂ ਵੱਡਾ ਹੈ।`);
  match = text.match(/^([PQ]) is at least (\d+)%\.$/);
  if (match) return textFor(locale, `${match[1]} कम से कम ${match[2]}% है।`, `${match[1]} ਘੱਟੋ-ਘੱਟ ${match[2]}% ਹੈ।`);
  match = text.match(/^([PQ]) is at most (\d+)%\.$/);
  if (match) return textFor(locale, `${match[1]} अधिकतम ${match[2]}% है।`, `${match[1]} ਵੱਧ ਤੋਂ ਵੱਧ ${match[2]}% ਹੈ।`);
  match = text.match(/^P \+ Q is at least (\d+)%\.$/);
  if (match) return textFor(locale, `P + Q कम से कम ${match[1]}% है।`, `P + Q ਘੱਟੋ-ਘੱਟ ${match[1]}% ਹੈ।`);
  match = text.match(/^P \+ Q is at most (\d+)%\.$/);
  if (match) return textFor(locale, `P + Q अधिकतम ${match[1]}% है।`, `P + Q ਵੱਧ ਤੋਂ ਵੱਧ ${match[1]}% ਹੈ।`);
  throw new Error(`Unrecognized Percentage DSF statement: ${text}`);
}

function localizeStatement(source: DsfExamProfileQuestion, text: string, locale: DsfLocalizedLocale): string {
  if (source.domain === "NUMBER_SYSTEM") return localizeNumberStatement(text, locale);
  if (source.domain === "RATIO_PROPORTION") return localizeRatioStatement(text, locale);
  if (source.domain === "PERCENTAGE") return localizePercentageStatement(text, locale);
  if (source.domain === "ALGEBRA") {
    if (/^[0-9xyXY+\-*/=<>.\s]+$/.test(text)) return text;
    throw new Error(`Unrecognized Algebra DSF statement: ${text}`);
  }
  throw new Error(`${source.questionId}: unsupported localization domain '${source.domain}'.`);
}

function localizeNumberExplanation(text: string, locale: DsfLocalizedLocale): string {
  if (text === "We need to determine the value of X.") return textFor(locale, "हमें X का मान निर्धारित करना है।", "ਸਾਨੂੰ X ਦਾ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕਰਨਾ ਹੈ।");
  if (text === "We need to determine whether X is even or odd.") return textFor(locale, "हमें निर्धारित करना है कि X सम है या विषम।", "ਸਾਨੂੰ ਨਿਰਧਾਰਤ ਕਰਨਾ ਹੈ ਕਿ X ਜੁੜਾ ਹੈ ਜਾਂ ਬੇਜੋੜ।");
  let m = text.match(/^(Statement I|Statement II) gives X = (.+)\. Therefore, \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} से X = ${m[2]} मिलता है। इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਤੋਂ X = ${m[2]} ਮਿਲਦਾ ਹੈ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) allows X to be (.+)\. Since X is not fixed, \1 alone is not sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); const v = localizeListFragment(m[2]!, locale); return textFor(locale, `${l} से X के मान ${v} हो सकते हैं। X निश्चित नहीं है, इसलिए ${l} अकेले पर्याप्त नहीं है।`, `${l} ਨਾਲ X ਦੇ ਮੁੱਲ ${v} ਹੋ ਸਕਦੇ ਹਨ। X ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) gives X = (.+), which is (even|odd)\. Therefore, \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); const p = parityWord(m[3]!, locale); return textFor(locale, `${l} से X = ${m[2]} मिलता है, जो ${p} है। इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਤੋਂ X = ${m[2]} ਮਿਲਦਾ ਹੈ, ਜੋ ${p} ਹੈ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) allows X to be (.+)\. Every possible value is (even|odd), so \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); const v = localizeListFragment(m[2]!, locale); const p = parityWord(m[3]!, locale); return textFor(locale, `${l} से X के मान ${v} हो सकते हैं। हर संभव मान ${p} है, इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਨਾਲ X ਦੇ ਮੁੱਲ ${v} ਹੋ ਸਕਦੇ ਹਨ। ਹਰ ਸੰਭਵ ਮੁੱਲ ${p} ਹੈ, ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) allows X to be (.+)\. These possibilities do not all have the same parity, so \1 alone is not sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); const v = localizeListFragment(m[2]!, locale); return textFor(locale, `${l} से X के मान ${v} हो सकते हैं। इन सभी की सम-विषम प्रकृति समान नहीं है, इसलिए ${l} अकेले पर्याप्त नहीं है।`, `${l} ਨਾਲ X ਦੇ ਮੁੱਲ ${v} ਹੋ ਸਕਦੇ ਹਨ। ਇਨ੍ਹਾਂ ਸਭ ਦੀ ਜੁੜਾ-ਬੇਜੋੜ ਪ੍ਰਕਿਰਤੀ ਇੱਕੋ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`); }
  m = text.match(/^Using both statements together gives X = (.+)\. Thus the two statements together are sufficient\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने पर X = ${m[1]} मिलता है। अतः दोनों कथन साथ में पर्याप्त हैं।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਨਾਲ X = ${m[1]} ਮਿਲਦਾ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ।`);
  m = text.match(/^Using both statements together, X can be (.+)\. Every remaining value is (even|odd), so together the statements are sufficient\.$/);
  if (m) { const v = localizeListFragment(m[1]!, locale); const p = parityWord(m[2]!, locale); return textFor(locale, `दोनों कथनों को साथ लेने पर X के मान ${v} हो सकते हैं। बचा हुआ हर मान ${p} है, इसलिए दोनों कथन साथ में पर्याप्त हैं।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਨਾਲ X ਦੇ ਮੁੱਲ ${v} ਹੋ ਸਕਦੇ ਹਨ। ਬਚਿਆ ਹਰ ਮੁੱਲ ${p} ਹੈ, ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ।`); }
  m = text.match(/^Even after using both statements, X can still be (.+)\. Therefore, the value of X cannot be determined\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने के बाद भी X के मान ${localizeListFragment(m[1]!, locale)} हो सकते हैं। इसलिए X का मान निर्धारित नहीं किया जा सकता।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਤੋਂ ਬਾਅਦ ਵੀ X ਦੇ ਮੁੱਲ ${localizeListFragment(m[1]!, locale)} ਹੋ ਸਕਦੇ ਹਨ। ਇਸ ਲਈ X ਦਾ ਮੁੱਲ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।`);
  m = text.match(/^Even after using both statements, X can still be (.+), including different parities\. Therefore, the answer cannot be determined\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने के बाद भी X के मान ${localizeListFragment(m[1]!, locale)} हो सकते हैं और उनकी सम-विषम प्रकृति अलग हो सकती है। इसलिए उत्तर निर्धारित नहीं किया जा सकता।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਤੋਂ ਬਾਅਦ ਵੀ X ਦੇ ਮੁੱਲ ${localizeListFragment(m[1]!, locale)} ਹੋ ਸਕਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਜੁੜਾ-ਬੇਜੋੜ ਪ੍ਰਕਿਰਤੀ ਵੱਖ ਹੋ ਸਕਦੀ ਹੈ। ਇਸ ਲਈ ਉੱਤਰ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।`);
  throw new Error(`Unrecognized Number System DSF explanation: ${text}`);
}

function comparisonLocalized(value: string, locale: DsfLocalizedLocale): string {
  if (value === "A is greater than B") return textFor(locale, "A, B से बड़ा है", "A, B ਤੋਂ ਵੱਡਾ ਹੈ");
  if (value === "B is greater than A") return textFor(locale, "B, A से बड़ा है", "B, A ਤੋਂ ਵੱਡਾ ਹੈ");
  throw new Error(`Unsupported comparison meaning '${value}'.`);
}

function localizeRatioExplanation(text: string, locale: DsfLocalizedLocale): string {
  if (text === "We need to determine the ratio A:B.") return textFor(locale, "हमें A:B का अनुपात निर्धारित करना है।", "ਸਾਨੂੰ A:B ਦਾ ਅਨੁਪਾਤ ਨਿਰਧਾਰਤ ਕਰਨਾ ਹੈ।");
  if (text === "We need to determine whether A or B is greater.") return textFor(locale, "हमें निर्धारित करना है कि A और B में कौन बड़ा है।", "ਸਾਨੂੰ ਨਿਰਧਾਰਤ ਕਰਨਾ ਹੈ ਕਿ A ਅਤੇ B ਵਿੱਚੋਂ ਕਿਹੜਾ ਵੱਡਾ ਹੈ।");
  let m = text.match(/^(Statement I|Statement II) allows more than one pair of values for A and B, but every valid pair has A:B = (.+)\. So \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} से A और B के एक से अधिक मान-युग्म संभव हैं, लेकिन हर वैध युग्म में A:B = ${m[2]} है। इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਨਾਲ A ਅਤੇ B ਦੇ ਇੱਕ ਤੋਂ ਵੱਧ ਮੁੱਲ-ਜੋੜੇ ਸੰਭਵ ਹਨ, ਪਰ ਹਰ ਵੈਧ ਜੋੜੇ ਵਿੱਚ A:B = ${m[2]} ਹੈ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) fixes A:B = (.+)\. So \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} से A:B = ${m[2]} निश्चित हो जाता है। इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਨਾਲ A:B = ${m[2]} ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) still allows different ratios for A:B, such as (.+)\. So \1 alone is not sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} से A:B के अलग-अलग अनुपात, जैसे ${localizeListFragment(m[2]!, locale)}, अभी भी संभव हैं। इसलिए ${l} अकेले पर्याप्त नहीं है।`, `${l} ਨਾਲ A:B ਦੇ ਵੱਖ-ਵੱਖ ਅਨੁਪਾਤ, ਜਿਵੇਂ ${localizeListFragment(m[2]!, locale)}, ਹਾਲੇ ਵੀ ਸੰਭਵ ਹਨ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) shows that (A is greater than B|B is greater than A) in every valid case\. So \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); const c = comparisonLocalized(m[2]!, locale); return textFor(locale, `${l} हर वैध स्थिति में दिखाता है कि ${c}। इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਹਰ ਵੈਧ ਹਾਲਤ ਵਿੱਚ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ${c}। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) allows cases with A greater than B and cases with B greater than A\. So \1 alone is not sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} में A > B वाली और B > A वाली दोनों स्थितियाँ संभव हैं। इसलिए ${l} अकेले पर्याप्त नहीं है।`, `${l} ਵਿੱਚ A > B ਵਾਲੀਆਂ ਅਤੇ B > A ਵਾਲੀਆਂ ਦੋਵੇਂ ਹਾਲਤਾਂ ਸੰਭਵ ਹਨ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`); }
  m = text.match(/^Using both statements together fixes A:B = (.+)\. Therefore, the two statements together are sufficient\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने पर A:B = ${m[1]} निश्चित हो जाता है। इसलिए दोनों कथन साथ में पर्याप्त हैं।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਨਾਲ A:B = ${m[1]} ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ।`);
  m = text.match(/^Using both statements together shows that (A is greater than B|B is greater than A)\. Therefore, the two statements together are sufficient\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने पर स्पष्ट होता है कि ${comparisonLocalized(m[1]!, locale)}। इसलिए दोनों कथन साथ में पर्याप्त हैं।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਨਾਲ ਸਪਸ਼ਟ ਹੁੰਦਾ ਹੈ ਕਿ ${comparisonLocalized(m[1]!, locale)}। ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ।`);
  m = text.match(/^Even after using both statements, different ratios for A:B are still possible, such as (.+)\. Therefore, the ratio cannot be determined\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने के बाद भी A:B के अलग-अलग अनुपात, जैसे ${localizeListFragment(m[1]!, locale)}, संभव हैं। इसलिए अनुपात निर्धारित नहीं किया जा सकता।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਤੋਂ ਬਾਅਦ ਵੀ A:B ਦੇ ਵੱਖ-ਵੱਖ ਅਨੁਪਾਤ, ਜਿਵੇਂ ${localizeListFragment(m[1]!, locale)}, ਸੰਭਵ ਹਨ। ਇਸ ਲਈ ਅਨੁਪਾਤ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।`);
  if (text === "Even after using both statements, both A > B and B > A remain possible. Therefore, which quantity is greater cannot be determined.") return textFor(locale, "दोनों कथनों को साथ लेने के बाद भी A > B और B > A दोनों संभव हैं। इसलिए कौन-सी राशि बड़ी है, यह निर्धारित नहीं किया जा सकता।", "ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਤੋਂ ਬਾਅਦ ਵੀ A > B ਅਤੇ B > A ਦੋਵੇਂ ਸੰਭਵ ਹਨ। ਇਸ ਲਈ ਕਿਹੜੀ ਰਾਸ਼ੀ ਵੱਡੀ ਹੈ, ਇਹ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।");
  throw new Error(`Unrecognized Ratio DSF explanation: ${text}`);
}

function directionLocalized(value: string, locale: DsfLocalizedLocale): string {
  return localizeListFragment(value, locale);
}

function localizePercentageExplanation(text: string, locale: DsfLocalizedLocale): string {
  if (text === "We need to determine the net percentage change from the original value.") return textFor(locale, "हमें मूल मान से शुद्ध प्रतिशत परिवर्तन निर्धारित करना है।", "ਸਾਨੂੰ ਮੂਲ ਮੁੱਲ ਤੋਂ ਸ਼ੁੱਧ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਨਿਰਧਾਰਤ ਕਰਨਾ ਹੈ।");
  if (text === "We need to determine whether the final value is above, below or equal to the original value.") return textFor(locale, "हमें निर्धारित करना है कि अंतिम मान मूल मान से अधिक, कम या बराबर है।", "ਸਾਨੂੰ ਨਿਰਧਾਰਤ ਕਰਨਾ ਹੈ ਕਿ ਅੰਤਿਮ ਮੁੱਲ ਮੂਲ ਮੁੱਲ ਤੋਂ ਵੱਧ, ਘੱਟ ਜਾਂ ਬਰਾਬਰ ਹੈ।");
  let m = text.match(/^(Statement I|Statement II) allows more than one pair of rates P and Q, but every valid pair gives the same net change of (.+)\. So \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} से P और Q की एक से अधिक दर-युग्म संभव हैं, लेकिन हर वैध युग्म ${m[2]} का वही शुद्ध परिवर्तन देता है। इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਨਾਲ P ਅਤੇ Q ਦੇ ਇੱਕ ਤੋਂ ਵੱਧ ਦਰ-ਜੋੜੇ ਸੰਭਵ ਹਨ, ਪਰ ਹਰ ਵੈਧ ਜੋੜਾ ${m[2]} ਦਾ ਉਹੀ ਸ਼ੁੱਧ ਬਦਲਾਅ ਦਿੰਦਾ ਹੈ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) fixes the net change at (.+)\. So \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} से शुद्ध परिवर्तन ${m[2]} निश्चित हो जाता है। इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਨਾਲ ਸ਼ੁੱਧ ਬਦਲਾਅ ${m[2]} ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) still allows different net changes, such as (.+)\. So \1 alone is not sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} से ${localizeListFragment(m[2]!, locale)} जैसे अलग-अलग शुद्ध परिवर्तन अभी भी संभव हैं। इसलिए ${l} अकेले पर्याप्त नहीं है।`, `${l} ਨਾਲ ${localizeListFragment(m[2]!, locale)} ਵਰਗੇ ਵੱਖ-ਵੱਖ ਸ਼ੁੱਧ ਬਦਲਾਅ ਹਾਲੇ ਵੀ ਸੰਭਵ ਹਨ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) shows that (.+) in every valid case\. So \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} हर वैध स्थिति में दिखाता है कि ${directionLocalized(m[2]!, locale)}। इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਹਰ ਵੈਧ ਹਾਲਤ ਵਿੱਚ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ${directionLocalized(m[2]!, locale)}। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) still allows different outcomes: (.+)\. So \1 alone is not sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} में अलग-अलग परिणाम संभव हैं: ${directionLocalized(m[2]!, locale)}। इसलिए ${l} अकेले पर्याप्त नहीं है।`, `${l} ਵਿੱਚ ਵੱਖ-ਵੱਖ ਨਤੀਜੇ ਸੰਭਵ ਹਨ: ${directionLocalized(m[2]!, locale)}। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`); }
  m = text.match(/^Using both statements together fixes the net change at (.+)\. Therefore, the two statements together are sufficient\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने पर शुद्ध परिवर्तन ${m[1]} निश्चित हो जाता है। इसलिए दोनों कथन साथ में पर्याप्त हैं।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਨਾਲ ਸ਼ੁੱਧ ਬਦਲਾਅ ${m[1]} ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ।`);
  m = text.match(/^Using both statements together shows that (.+)\. Therefore, the two statements together are sufficient\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने पर स्पष्ट होता है कि ${directionLocalized(m[1]!, locale)}। इसलिए दोनों कथन साथ में पर्याप्त हैं।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਨਾਲ ਸਪਸ਼ਟ ਹੁੰਦਾ ਹੈ ਕਿ ${directionLocalized(m[1]!, locale)}। ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ।`);
  m = text.match(/^Even after using both statements, different net changes remain possible, such as (.+)\. Therefore, the net percentage change cannot be determined\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने के बाद भी ${localizeListFragment(m[1]!, locale)} जैसे अलग-अलग शुद्ध परिवर्तन संभव हैं। इसलिए शुद्ध प्रतिशत परिवर्तन निर्धारित नहीं किया जा सकता।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਤੋਂ ਬਾਅਦ ਵੀ ${localizeListFragment(m[1]!, locale)} ਵਰਗੇ ਵੱਖ-ਵੱਖ ਸ਼ੁੱਧ ਬਦਲਾਅ ਸੰਭਵ ਹਨ। ਇਸ ਲਈ ਸ਼ੁੱਧ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।`);
  m = text.match(/^Even after using both statements, different outcomes remain possible: (.+)\. Therefore, the final direction cannot be determined\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने के बाद भी अलग-अलग परिणाम संभव हैं: ${directionLocalized(m[1]!, locale)}। इसलिए अंतिम दिशा निर्धारित नहीं की जा सकती।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਤੋਂ ਬਾਅਦ ਵੀ ਵੱਖ-ਵੱਖ ਨਤੀਜੇ ਸੰਭਵ ਹਨ: ${directionLocalized(m[1]!, locale)}। ਇਸ ਲਈ ਅੰਤਿਮ ਦਿਸ਼ਾ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।`);
  throw new Error(`Unrecognized Percentage DSF explanation: ${text}`);
}

function localizeAlgebraExplanation(text: string, locale: DsfLocalizedLocale): string {
  if (text === "We need to determine one unique value of x.") return textFor(locale, "हमें x का एकमात्र मान निर्धारित करना है।", "ਸਾਨੂੰ x ਦਾ ਇਕੋ ਇਕ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕਰਨਾ ਹੈ।");
  let m = text.match(/^(Statement I|Statement II) fixes x = (.+)\. So \1 alone is sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} से x = ${m[2]} निश्चित हो जाता है। इसलिए ${l} अकेले पर्याप्त है।`, `${l} ਨਾਲ x = ${m[2]} ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) only restricts x to a range, so more than one value of x is still possible\. Therefore \1 alone is not sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} केवल x को एक परास तक सीमित करता है, इसलिए x के एक से अधिक मान अभी भी संभव हैं। अतः ${l} अकेले पर्याप्त नहीं है।`, `${l} ਸਿਰਫ਼ x ਨੂੰ ਇੱਕ ਰੇਂਜ ਤੱਕ ਸੀਮਿਤ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ x ਦੇ ਇੱਕ ਤੋਂ ਵੱਧ ਮੁੱਲ ਹਾਲੇ ਵੀ ਸੰਭਵ ਹਨ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) is one equation involving both x and y, so x can still take more than one value\. Therefore \1 alone is not sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} x और y दोनों वाला एक समीकरण है, इसलिए x के एक से अधिक मान संभव हैं। अतः ${l} अकेले पर्याप्त नहीं है।`, `${l} x ਅਤੇ y ਦੋਵੇਂ ਵਾਲਾ ਇੱਕ ਸਮੀਕਰਨ ਹੈ, ਇਸ ਲਈ x ਦੇ ਇੱਕ ਤੋਂ ਵੱਧ ਮੁੱਲ ਸੰਭਵ ਹਨ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`); }
  m = text.match(/^(Statement I|Statement II) leaves more than one possible value of x\. Therefore \1 alone is not sufficient\.$/);
  if (m) { const l = statementLabel(m[1]!, locale); return textFor(locale, `${l} के बाद x के एक से अधिक मान संभव रहते हैं। अतः ${l} अकेले पर्याप्त नहीं है।`, `${l} ਤੋਂ ਬਾਅਦ x ਦੇ ਇੱਕ ਤੋਂ ਵੱਧ ਮੁੱਲ ਸੰਭਵ ਰਹਿੰਦੇ ਹਨ। ਇਸ ਲਈ ${l} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`); }
  m = text.match(/^Using both statements together fixes x = (.+)\. Therefore the two statements together are sufficient\.$/);
  if (m) return textFor(locale, `दोनों कथनों को साथ लेने पर x = ${m[1]} निश्चित हो जाता है। इसलिए दोनों कथन साथ में पर्याप्त हैं।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਨਾਲ x = ${m[1]} ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ।`);
  if (text === "The two equations are dependent, so they still describe only one independent constraint in x and y. More than one value of x remains possible.") return textFor(locale, "दोनों समीकरण आश्रित हैं, इसलिए वे x और y पर केवल एक स्वतंत्र प्रतिबंध देते हैं। x के एक से अधिक मान संभव रहते हैं।", "ਦੋਵੇਂ ਸਮੀਕਰਨ ਆਧਾਰਿਤ ਹਨ, ਇਸ ਲਈ ਉਹ x ਅਤੇ y ਉੱਤੇ ਕੇਵਲ ਇੱਕ ਸੁਤੰਤਰ ਪਾਬੰਦੀ ਦਿੰਦੇ ਹਨ। x ਦੇ ਇੱਕ ਤੋਂ ਵੱਧ ਮੁੱਲ ਸੰਭਵ ਰਹਿੰਦੇ ਹਨ।");
  if (text === "Even after using both statements, more than one value of x remains possible, so x cannot be uniquely determined.") return textFor(locale, "दोनों कथनों को साथ लेने के बाद भी x के एक से अधिक मान संभव हैं, इसलिए x का एकमात्र मान निर्धारित नहीं किया जा सकता।", "ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਣ ਤੋਂ ਬਾਅਦ ਵੀ x ਦੇ ਇੱਕ ਤੋਂ ਵੱਧ ਮੁੱਲ ਸੰਭਵ ਹਨ, ਇਸ ਲਈ x ਦਾ ਇਕੋ ਇਕ ਮੁੱਲ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।");
  throw new Error(`Unrecognized Algebra DSF explanation: ${text}`);
}

function localizeExplanation(source: DsfExamProfileQuestion, text: string, locale: DsfLocalizedLocale): string {
  if (source.domain === "NUMBER_SYSTEM") return localizeNumberExplanation(text, locale);
  if (source.domain === "RATIO_PROPORTION") return localizeRatioExplanation(text, locale);
  if (source.domain === "PERCENTAGE") return localizePercentageExplanation(text, locale);
  if (source.domain === "ALGEBRA") return localizeAlgebraExplanation(text, locale);
  throw new Error(`${source.questionId}: unsupported localization domain '${source.domain}'.`);
}

export function localizeDsfExamProfileQuestion(
  source: DsfExamProfileQuestion,
  language: DsfLocalizedLanguage,
): DsfLocalizedExamProfileQuestion {
  const locale = localeFor(language);
  const prompt = questionPrompt(source, locale);
  const stem = localizedStem(source, prompt, locale);
  const statementI = localizeStatement(source, source.statements[0].text, locale);
  const statementII = localizeStatement(source, source.statements[1].text, locale);
  const askedTarget = localizeExplanation(source, source.explanation.askedTarget, locale);
  const explanationI = localizeExplanation(source, source.explanation.statementI, locale);
  const explanationII = localizeExplanation(source, source.explanation.statementII, locale);
  const together = source.explanation.together
    ? localizeExplanation(source, source.explanation.together, locale)
    : undefined;
  const conclusion = semanticText(source.canonicalAnswer, locale);
  const options = source.options.map((option) => ({
    ...option,
    value: semanticText(option.semanticClass, locale),
  }));
  const steps = [askedTarget, explanationI, explanationII, ...(together ? [together] : []), conclusion];
  const localizedId = createHash("sha256")
    .update(`${DSF_CP008_LOCALIZATION_AUTHORITY}:${locale}:${source.questionId}`)
    .digest("hex")
    .slice(0, 24);

  return Object.freeze({
    ...source,
    questionId: `DSF-QS-L10N-${localizedId}`,
    language,
    locale,
    canonicalEnglishProfileQuestionId: source.questionId,
    localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
    localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
    stem,
    questionPrompt: prompt,
    statements: [
      { id: "I", text: statementI },
      { id: "II", text: statementII },
    ],
    options,
    explanation: {
      askedTarget,
      statementI: explanationI,
      statementII: explanationII,
      ...(together ? { together } : {}),
      conclusion,
      steps,
    },
    localization: {
      sourceLanguage: "en",
      sourceLocale: "en-IN",
      language,
      locale,
      authority: DSF_CP008_LOCALIZATION_AUTHORITY,
      status: "EXECUTABLE_REVIEW_REQUIRED",
      semanticParity: "EXECUTABLE_PROVED",
      learnerTextLocalized: true,
      optionSemanticOrderPreserved: true,
      correctIndexPreserved: true,
      canonicalAnswerPreserved: true,
      humanLanguageReviewRequired: true,
      activeEditorialBlockers: [DSF_CP008_HUMAN_REVIEW_BLOCKER],
    },
    validation: {
      ...source.validation,
      localizationRecognized: true,
      localizedLearnerText: true,
      semanticParityPreserved: true,
      optionSemanticOrderPreserved: true,
      correctIndexPreserved: true,
      canonicalAnswerPreserved: true,
    },
    lifecycle: {
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      reviewOnly: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
    },
  });
}

export function generateDsfLocalizedExamProfileBatch(input: DsfLocalizationInput) {
  const source = generateDsfExamProfileBatch({
    ...input,
    language: "en",
  });
  const questions = source.questions.map((question) => localizeDsfExamProfileQuestion(question, input.language));
  return Object.freeze({
    generationSystem: "reasoning-v1" as const,
    sourceCheckpointId: source.sourceCheckpointId,
    integrationCheckpointId: source.integrationCheckpointId,
    profileCheckpointId: source.profileCheckpointId,
    localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
    integrationAuthority: source.integrationAuthority,
    profileDeliveryAuthority: source.profileDeliveryAuthority,
    localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
    answerProfile: source.answerProfile,
    profile: source.profile,
    language: input.language,
    locale: localeFor(input.language),
    questionCount: questions.length,
    questions,
    reviewOnly: true as const,
    humanLanguageReviewRequired: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  });
}

export const DSF_CP008_LOCALIZATION_REVIEW_PACKAGE = Object.freeze({
  ...DSF_CP007_PRODUCTION_PACKAGE,
  label: "Data Sufficiency · English production + Hindi/Punjabi localization review",
  localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
  localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
  supportedLanguages: DSF_CP008_SUPPORTED_LANGUAGES,
  productionLanguages: ["en"] as const,
  localizationReviewLanguages: DSF_CP008_LOCALIZED_LANGUAGES,
  localizationStatus: "EXECUTABLE_REVIEW_REQUIRED" as const,
  humanLanguageReviewRequired: true as const,
  localizedQuestionBankWritable: false as const,
  localizedTestEligible: false as const,
  localizedMockTestEligible: false as const,
  localizedPubliclyPublishable: false as const,
  localizedAutomaticStudentPublication: false as const,
  localizationDoesNotMutateEnglishProductionFreeze: true as const,
  localizationDoesNotMutateProfileSemanticOrder: true as const,
  localizationDoesNotAllocateNewQl: true as const,
  localizationEditorialBlockers: [DSF_CP008_HUMAN_REVIEW_BLOCKER] as const,
  perLanguageLifecycle: {
    en: {
      status: "PRODUCTION_READY_FROZEN" as const,
      questionBankWritable: true as const,
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: true as const,
      automaticStudentPublication: false as const,
    },
    hi: {
      status: "LOCALIZED_REVIEW_REQUIRED" as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
    pa: {
      status: "LOCALIZED_REVIEW_REQUIRED" as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
  },
});
