import type { SylLocale } from "../foundation/types";
import {
  generateBankingCanNeverEditorialV4,
  type BankingCanNeverEditorialV4Question,
} from "./banking-can-never-be-editorial-v4";

export type BankingCanNeverEditorialV5Question = Omit<
  BankingCanNeverEditorialV4Question,
  "editorialAuthority" | "explanation"
> & {
  editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5";
  explanation: readonly [string, string];
};

const REPLACEMENTS: Readonly<Record<SylLocale, readonly (readonly [string, string])[]>> = Object.freeze({
  "en-IN": Object.freeze([
    [
      "; “all can never be” is not proved",
      "; therefore, the whole-class impossibility claim is not proved",
    ],
    [
      "; an outside member is impossible",
      "; therefore, no such outside member can exist",
    ],
  ]),
  "hi-IN": Object.freeze([
    [
      "; इसलिए “सभी कभी नहीं” सिद्ध नहीं होता",
      "; इसलिए पूरे वर्ग के लिए असंभवता का दावा सिद्ध नहीं होता",
    ],
    [
      "; इसलिए बाहर वाला आवश्यक सदस्य असंभव है",
      "; इसलिए निष्कर्ष के लिए जरूरी बाहर वाला सदस्य हो ही नहीं सकता",
    ],
    [
      ", इसलिए बाहर वाला सदस्य असंभव है",
      ", इसलिए ऐसा बाहर वाला सदस्य हो ही नहीं सकता",
    ],
  ]),
  "pa-IN": Object.freeze([
    [
      "; ਇਸ ਲਈ “ਸਾਰੇ ਕਦੇ ਨਹੀਂ” ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ",
      "; ਇਸ ਲਈ ਪੂਰੇ ਵਰਗ ਲਈ ਅਸੰਭਵਤਾ ਦਾ ਦਾਅਵਾ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ",
    ],
    [
      "; ਇਸ ਲਈ ਬਾਹਰਲਾ ਲੋੜੀਂਦਾ ਮੈਂਬਰ ਅਸੰਭਵ ਹੈ",
      "; ਇਸ ਲਈ ਨਤੀਜੇ ਲਈ ਲੋੜੀਂਦਾ ਬਾਹਰਲਾ ਮੈਂਬਰ ਹੋ ਹੀ ਨਹੀਂ ਸਕਦਾ",
    ],
    [
      ", ਇਸ ਲਈ ਬਾਹਰਲਾ ਮੈਂਬਰ ਅਸੰਭਵ ਹੈ",
      ", ਇਸ ਲਈ ਅਜਿਹਾ ਬਾਹਰਲਾ ਮੈਂਬਰ ਹੋ ਹੀ ਨਹੀਂ ਸਕਦਾ",
    ],
  ]),
});

function polishLine(locale: SylLocale, line: string): string {
  return REPLACEMENTS[locale].reduce(
    (result, [from, to]) => result.replace(from, to),
    line,
  );
}

export function generateBankingCanNeverEditorialV5(
  seed: number,
  locale: SylLocale,
): BankingCanNeverEditorialV5Question {
  const base = generateBankingCanNeverEditorialV4(seed, locale);
  const explanation = base.explanation.map((line) => polishLine(locale, line)) as [string, string];
  return {
    ...base,
    editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
    explanation,
  };
}

export const SYL_BANKING_CAN_NEVER_BE_EDITORIAL_V5 = Object.freeze({
  authorityId: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
  semanticAuthority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  priorEditorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4",
  explanationPolicy: "NATURAL_LANGUAGE_POLISH_OVER_V4_V5",
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
