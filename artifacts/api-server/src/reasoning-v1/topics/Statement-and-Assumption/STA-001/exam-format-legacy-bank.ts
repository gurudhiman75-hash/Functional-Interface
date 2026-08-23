import {
  generateStaExamFormatQuestion,
  type StaExamFormatQuestion,
  type StaExamLocale,
} from "./exam-format-extension.ts";
import type { StaAnswerSet } from "./types.ts";

export interface StaLegacyBankAnswerOption {
  readonly code: 1 | 2 | 3 | 4 | 5;
  readonly kind: "ANSWER_SET" | "EITHER_I_OR_II";
  readonly display: string;
  readonly semanticAnswerSet: StaAnswerSet | null;
  readonly isCorrect: boolean;
}

export interface StaLegacyBankQuestion extends Omit<StaExamFormatQuestion, "presentationProfile" | "options" | "answerIndex" | "instruction"> {
  readonly presentationProfile: "BANK_LEGACY_2X5";
  readonly instruction: string;
  readonly options: readonly [StaLegacyBankAnswerOption, StaLegacyBankAnswerOption, StaLegacyBankAnswerOption, StaLegacyBankAnswerOption, StaLegacyBankAnswerOption];
  readonly answerIndex: 0 | 1 | 3 | 4;
}

function sameAnswerSet(a: StaAnswerSet, b: StaAnswerSet): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function instruction(locale: StaExamLocale): string {
  if (locale === "hi-IN") return "कथन के बाद दो पूर्वधारणाएँ I और II दी गई हैं। तय करें कि कौन-सी पूर्वधारणा कथन में निहित है।";
  if (locale === "pa-IN") return "ਕਥਨ ਤੋਂ ਬਾਅਦ ਦੋ ਧਾਰਨਾਵਾਂ I ਅਤੇ II ਦਿੱਤੀਆਂ ਹਨ। ਫੈਸਲਾ ਕਰੋ ਕਿ ਕਿਹੜੀ ਧਾਰਨਾ ਕਥਨ ਵਿੱਚ ਨਿਹਿਤ ਹੈ।";
  return "A statement is followed by two assumptions I and II. Decide which assumption is implicit in the statement.";
}

function labels(locale: StaExamLocale): readonly [string, string, string, string, string] {
  if (locale === "hi-IN") return [
    "यदि केवल पूर्वधारणा I निहित है",
    "यदि केवल पूर्वधारणा II निहित है",
    "यदि I या II में से कोई एक निहित है",
    "यदि न तो I और न ही II निहित है",
    "यदि I और II दोनों निहित हैं",
  ];
  if (locale === "pa-IN") return [
    "ਜੇ ਕੇਵਲ ਧਾਰਨਾ I ਨਿਹਿਤ ਹੈ",
    "ਜੇ ਕੇਵਲ ਧਾਰਨਾ II ਨਿਹਿਤ ਹੈ",
    "ਜੇ I ਜਾਂ II ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਨਿਹਿਤ ਹੈ",
    "ਜੇ ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਨਿਹਿਤ ਹੈ",
    "ਜੇ I ਅਤੇ II ਦੋਵੇਂ ਨਿਹਿਤ ਹਨ",
  ];
  return [
    "If only assumption I is implicit",
    "If only assumption II is implicit",
    "If either I or II is implicit",
    "If neither I nor II is implicit",
    "If both I and II are implicit",
  ];
}

function correctLegacyIndex(answerSet: StaAnswerSet): 0 | 1 | 3 | 4 {
  if (answerSet.length === 0) return 3;
  if (sameAnswerSet(answerSet, [0])) return 0;
  if (sameAnswerSet(answerSet, [1])) return 1;
  if (sameAnswerSet(answerSet, [0, 1])) return 4;
  throw new Error(`Unsupported legacy two-assumption answer set: ${answerSet.join(",")}`);
}

export function generateStaLegacyBankQuestion(seed: string, locale: StaExamLocale): StaLegacyBankQuestion {
  const base = generateStaExamFormatQuestion(seed, locale, "BANK_2X5");
  const display = labels(locale);
  const answerIndex = correctLegacyIndex(base.answerSet);
  const semanticSets: readonly (StaAnswerSet | null)[] = [[0], [1], null, [], [0, 1]];
  const options = display.map((text, index) => ({
    code: (index + 1) as 1 | 2 | 3 | 4 | 5,
    kind: index === 2 ? "EITHER_I_OR_II" as const : "ANSWER_SET" as const,
    display: text,
    semanticAnswerSet: semanticSets[index]!,
    isCorrect: index === answerIndex,
  })) as unknown as StaLegacyBankQuestion["options"];

  const question: StaLegacyBankQuestion = {
    ...base,
    presentationProfile: "BANK_LEGACY_2X5",
    instruction: instruction(locale),
    options,
    answerIndex,
  };
  assertStaLegacyBankQuestionIntegrity(question);
  return question;
}

export function assertStaLegacyBankQuestionIntegrity(question: StaLegacyBankQuestion): void {
  if (question.candidateCount !== 2 || question.optionCount !== 5) throw new Error(`${question.questionId}: legacy profile must be 2 assumptions / 5 codes`);
  if (question.options.length !== 5) throw new Error(`${question.questionId}: legacy profile must expose five choices`);
  if (question.options.map((option) => option.code).join(",") !== "1,2,3,4,5") throw new Error(`${question.questionId}: legacy option codes changed`);
  if (question.options.filter((option) => option.kind === "EITHER_I_OR_II").length !== 1) throw new Error(`${question.questionId}: legacy either option missing`);
  if (question.options[2].isCorrect) throw new Error(`${question.questionId}: unresolved either-option cannot be correct without an explicit exclusive-alternative authority`);
  if (question.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${question.questionId}: legacy option correctness is not unique`);
  if (!question.options[question.answerIndex].isCorrect) throw new Error(`${question.questionId}: legacy answer index mismatch`);
  if (question.lifecycle.questionStudioDiscoverable || question.lifecycle.questionBankWritable || question.lifecycle.testEligible || question.lifecycle.publiclyPublishable) {
    throw new Error(`${question.questionId}: product lock opened before exam-format freeze`);
  }
}
