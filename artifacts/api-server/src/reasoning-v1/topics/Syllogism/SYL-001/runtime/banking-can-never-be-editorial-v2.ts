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
      ? `ऐसी कोई वैध व्यवस्था नहीं है जिसमें सभी ${subject} ${predicate} हों।`
      : `कुछ सदस्य ${subject} समूह में हैं और उनका ${predicate} समूह में होना असंभव है।`;
  }
  return conclusion.surfaceKind === "ALL_CAN_NEVER"
    ? `ਕੋਈ ਵੀ ਵੈਧ ਬਣਤਰ ਐਸੀ ਨਹੀਂ ਹੈ ਜਿਸ ਵਿੱਚ ਸਾਰੇ ${subject} ${predicate} ਹੋਣ।`
    : `ਕੁਝ ਮੈਂਬਰ ${subject} ਸਮੂਹ ਵਿੱਚ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ${predicate} ਸਮੂਹ ਵਿੱਚ ਹੋਣਾ ਅਸੰਭਵ ਹੈ।`;
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
        ? `${label}: कम-से-कम एक सदस्य ${subject} समूह में रहकर ${predicate} समूह से बाहर होना ही चाहिए। इसलिए ऐसी कोई वैध व्यवस्था नहीं है जिसमें सभी ${subject} ${predicate} हों।`
        : `${label}: कम-से-कम एक वैध व्यवस्था में ${subject} समूह का हर सदस्य ${predicate} समूह में भी रखा जा सकता है। इसलिए “कभी संभव नहीं” सिद्ध नहीं होता।`;
    }
    return conclusion.follows
      ? `${label}: कम-से-कम एक सदस्य का ${subject} समूह में होना और ${predicate} समूह से बाहर रहना निश्चित है। इसलिए यह निष्कर्ष अनुसरण करता है।`
      : `${label}: किसी सदस्य का ${subject} समूह में होना और साथ ही ${predicate} समूह से बाहर रहना हर वैध व्यवस्था में निश्चित नहीं है। इसलिए यह निष्कर्ष अनुसरण नहीं करता।`;
  }

  if (question.locale === "pa-IN") {
    if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
      return conclusion.follows
        ? `${label}: ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਦਾ ${subject} ਸਮੂਹ ਵਿੱਚ ਰਹਿ ਕੇ ${predicate} ਸਮੂਹ ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਲਾਜ਼ਮੀ ਹੈ। ਇਸ ਲਈ ਕੋਈ ਵੀ ਵੈਧ ਬਣਤਰ ਐਸੀ ਨਹੀਂ ਹੈ ਜਿਸ ਵਿੱਚ ਸਾਰੇ ${subject} ${predicate} ਹੋਣ।`
        : `${label}: ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ${subject} ਸਮੂਹ ਦਾ ਹਰ ਮੈਂਬਰ ${predicate} ਸਮੂਹ ਵਿੱਚ ਵੀ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ। ਇਸ ਲਈ “ਕਦੇ ਸੰਭਵ ਨਹੀਂ” ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।`;
    }
    return conclusion.follows
      ? `${label}: ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਦਾ ${subject} ਸਮੂਹ ਵਿੱਚ ਹੋਣਾ ਅਤੇ ${predicate} ਸਮੂਹ ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਪੱਕਾ ਹੈ। ਇਸ ਲਈ ਇਹ ਨਤੀਜਾ ਸਹੀ ਹੈ।`
      : `${label}: ਕਿਸੇ ਮੈਂਬਰ ਦਾ ${subject} ਸਮੂਹ ਵਿੱਚ ਹੋਣਾ ਅਤੇ ਨਾਲ ਹੀ ${predicate} ਸਮੂਹ ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਪੱਕਾ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਇਹ ਨਤੀਜਾ ਸਹੀ ਨਹੀਂ ਹੈ।`;
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
