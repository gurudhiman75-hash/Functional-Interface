import type { SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  generateBankingCanNeverShellV1,
  type BankingCanNeverConclusionV1,
  type BankingCanNeverShellQuestionV1,
} from "./banking-can-never-be-shell-v1";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

export type BankingCanNeverEditorialV2Question = BankingCanNeverShellQuestionV1 & {
  editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V2";
};

interface TermPair {
  subject: string;
  predicate: string;
}

function termPair(
  question: BankingCanNeverShellQuestionV1,
  conclusion: BankingCanNeverConclusionV1,
): TermPair {
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) =>
    entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing scenario for editorial V2.`);
  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", question.seed, analysis.termOrder);
  const subject = assignment[conclusion.canonicalConclusion.subject]?.labels[question.locale];
  const predicate = assignment[conclusion.canonicalConclusion.predicate]?.labels[question.locale];
  if (!subject || !predicate) {
    throw new Error(`${question.seed}/${question.locale}: missing term labels for editorial V2.`);
  }
  return { subject, predicate };
}

function renderNegativeConclusion(
  question: BankingCanNeverShellQuestionV1,
  conclusion: BankingCanNeverConclusionV1,
): string {
  if (conclusion.mode !== "CAN_NEVER_BE" || !conclusion.surfaceKind) return conclusion.text;
  const { subject, predicate } = termPair(question, conclusion);

  if (question.locale === "en-IN") {
    return conclusion.surfaceKind === "ALL_CAN_NEVER"
      ? `All ${subject} can never be ${predicate}.`
      : `Some ${subject} can never be ${predicate}.`;
  }
  if (question.locale === "hi-IN") {
    return conclusion.surfaceKind === "ALL_CAN_NEVER"
      ? `“${subject}” वर्ग के सभी सदस्यों का “${predicate}” वर्ग में होना असंभव है।`
      : `“${subject}” वर्ग का कम-से-कम एक सदस्य “${predicate}” वर्ग का सदस्य कभी नहीं हो सकता।`;
  }
  return conclusion.surfaceKind === "ALL_CAN_NEVER"
    ? `“${subject}” ਵਰਗ ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦਾ “${predicate}” ਵਰਗ ਵਿੱਚ ਹੋਣਾ ਅਸੰਭਵ ਹੈ।`
    : `“${subject}” ਵਰਗ ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ “${predicate}” ਵਰਗ ਦਾ ਮੈਂਬਰ ਕਦੇ ਨਹੀਂ ਹੋ ਸਕਦਾ।`;
}

function negativeExplanation(
  label: "I" | "II",
  question: BankingCanNeverShellQuestionV1,
  conclusion: BankingCanNeverConclusionV1,
): string {
  const { subject, predicate } = termPair(question, conclusion);

  if (question.locale === "hi-IN") {
    if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
      return conclusion.follows
        ? `${label}: “${subject}” वर्ग का कम-से-कम एक सदस्य “${predicate}” वर्ग से बाहर रहना ही चाहिए। इसलिए “${subject}” वर्ग के सभी सदस्यों का “${predicate}” वर्ग में होना असंभव है।`
        : `${label}: कम-से-कम एक वैध व्यवस्था में “${subject}” वर्ग के सभी सदस्य “${predicate}” वर्ग में रखे जा सकते हैं। इसलिए “कभी संभव नहीं” सिद्ध नहीं होता।`;
    }
    return conclusion.follows
      ? `${label}: “${subject}” वर्ग का कम-से-कम एक सदस्य “${predicate}” वर्ग से बाहर रहना निश्चित है। इसलिए यह निष्कर्ष अनुसरण करता है।`
      : `${label}: “${subject}” वर्ग का कोई सदस्य हर वैध व्यवस्था में “${predicate}” वर्ग से बाहर रहने के लिए बाध्य नहीं है। इसलिए यह निष्कर्ष अनुसरण नहीं करता।`;
  }

  if (question.locale === "pa-IN") {
    if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
      return conclusion.follows
        ? `${label}: “${subject}” ਵਰਗ ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ “${predicate}” ਵਰਗ ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਲਾਜ਼ਮੀ ਹੈ। ਇਸ ਲਈ “${subject}” ਵਰਗ ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦਾ “${predicate}” ਵਰਗ ਵਿੱਚ ਹੋਣਾ ਅਸੰਭਵ ਹੈ।`
        : `${label}: ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ “${subject}” ਵਰਗ ਦੇ ਸਾਰੇ ਮੈਂਬਰ “${predicate}” ਵਰਗ ਵਿੱਚ ਰੱਖੇ ਜਾ ਸਕਦੇ ਹਨ। ਇਸ ਲਈ “ਕਦੇ ਸੰਭਵ ਨਹੀਂ” ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।`;
    }
    return conclusion.follows
      ? `${label}: “${subject}” ਵਰਗ ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ “${predicate}” ਵਰਗ ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਪੱਕਾ ਹੈ। ਇਸ ਲਈ ਇਹ ਨਤੀਜਾ ਸਹੀ ਹੈ।`
      : `${label}: “${subject}” ਵਰਗ ਦਾ ਕੋਈ ਮੈਂਬਰ ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ “${predicate}” ਵਰਗ ਤੋਂ ਬਾਹਰ ਰਹਿਣ ਲਈ ਮਜਬੂਰ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਇਹ ਨਤੀਜਾ ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }

  if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
    return conclusion.follows
      ? `${label}: At least one member of ${subject} must stay outside ${predicate}. Therefore no valid arrangement can place all ${subject} inside ${predicate}.`
      : `${label}: At least one valid arrangement can place every member of ${subject} inside ${predicate}. Therefore “can never be” is not proved.`;
  }
  return conclusion.follows
    ? `${label}: At least one member of ${subject} is forced to stay outside ${predicate}. Therefore the conclusion follows.`
    : `${label}: No member of ${subject} is forced to stay outside ${predicate} in every valid arrangement. Therefore the conclusion does not follow.`;
}

export function generateBankingCanNeverEditorialV2(
  seed: number,
  locale: SylLocale,
): BankingCanNeverEditorialV2Question {
  const base = generateBankingCanNeverShellV1(seed, locale);
  const conclusions = base.conclusions.map((entry) => ({
    ...entry,
    text: renderNegativeConclusion(base, entry),
  }));
  const explanation = conclusions.map((entry, index) => {
    if (entry.mode !== "CAN_NEVER_BE") return base.explanation[index] ?? "";
    return negativeExplanation(index === 0 ? "I" : "II", base, entry);
  });

  return {
    ...base,
    conclusions,
    explanation,
    editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V2",
  };
}

export const SYL_BANKING_CAN_NEVER_BE_EDITORIAL_V2 = Object.freeze({
  authorityId: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V2",
  semanticAuthority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V1",
  changesSemantics: false,
  changesStatements: false,
  changesOptions: false,
  changesCorrectIndex: false,
  changesOnlyNegativeModalCopyAndExplanation: true,
  localizationPolicy: "AGREEMENT_SAFE_GROUP_WORDING_V1",
  activationPermitted: false,
});
