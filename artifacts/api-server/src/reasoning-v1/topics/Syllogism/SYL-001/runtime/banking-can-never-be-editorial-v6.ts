import type { SylLocale } from "../foundation/types";
import {
  generateBankingCanNeverEditorialV5,
  type BankingCanNeverEditorialV5Question,
} from "./banking-can-never-be-editorial-v5";

export type BankingCanNeverEditorialV6Question = Omit<
  BankingCanNeverEditorialV5Question,
  "editorialAuthority" | "explanation"
> & {
  editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6";
  explanation: readonly [string, string];
};

function polishWholeClassPhrase(locale: SylLocale, line: string): string {
  if (locale === "hi-IN") {
    return line
      .replace(/सभी (“[^”]+” वर्ग) का/gu, "$1 के सभी सदस्यों का")
      .replace(/सभी (“[^”]+” वर्ग) को/gu, "$1 के सभी सदस्यों को");
  }
  if (locale === "pa-IN") {
    return line
      .replace(/ਸਾਰੇ (“[^”]+” ਵਰਗ) ਦਾ/gu, "$1 ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦਾ")
      .replace(/ਸਾਰੇ (“[^”]+” ਵਰਗ) ਨੂੰ/gu, "$1 ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਨੂੰ");
  }
  return line;
}

export function generateBankingCanNeverEditorialV6(
  seed: number,
  locale: SylLocale,
): BankingCanNeverEditorialV6Question {
  const base = generateBankingCanNeverEditorialV5(seed, locale);
  const explanation = base.explanation.map((line) => polishWholeClassPhrase(locale, line)) as [string, string];
  return {
    ...base,
    editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6",
    explanation,
  };
}

export const SYL_BANKING_CAN_NEVER_BE_EDITORIAL_V6 = Object.freeze({
  authorityId: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6",
  semanticAuthority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  priorEditorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
  explanationPolicy: "WHOLE_CLASS_MEMBER_PHRASE_LOCALIZATION_POLISH_V6",
  changesSemantics: false,
  changesStatements: false,
  changesConclusions: false,
  changesOptions: false,
  changesCorrectIndex: false,
  changesDiagram: false,
  changesVisualPolicy: false,
  completePremiseEvidenceRetainedInternally: true,
  humanApprovalImplied: false,
  activationPermitted: false,
});
