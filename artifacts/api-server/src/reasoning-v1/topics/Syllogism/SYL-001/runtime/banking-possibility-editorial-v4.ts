import type { SylLocale } from "../foundation/types";
import {
  generateBankingPossibilityEditorialV3,
  type BankingPossibilityEditorialV3Question,
} from "./banking-possibility-editorial-v3";

export type BankingPossibilityEditorialV4Question = Omit<
  BankingPossibilityEditorialV3Question,
  "editorialAuthority" | "explanation"
> & {
  editorialAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4";
  explanation: readonly [string, string];
};

function polishLocalizedExplanation(line: string): string {
  return line
    .replaceAll("वर्ग वर्ग", "वर्ग")
    .replaceAll("ਵਰਗ ਵਰਗ", "ਵਰਗ");
}

export function generateBankingPossibilityEditorialV4(
  seed: number,
  locale: SylLocale,
): BankingPossibilityEditorialV4Question {
  const base = generateBankingPossibilityEditorialV3(seed, locale);
  const explanation = base.explanation.map(polishLocalizedExplanation) as [string, string];
  return {
    ...base,
    editorialAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
    explanation,
  };
}

export const SYL_BANKING_POSSIBILITY_EDITORIAL_V4 = Object.freeze({
  authorityId: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
  semanticAuthority: "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
  priorEditorialAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3",
  explanationPolicy: "LOCALIZATION_DUPLICATE_CLASS_TOKEN_POLISH_V4",
  changesSemantics: false,
  changesStatements: false,
  changesConclusions: false,
  changesOptions: false,
  changesCorrectIndex: false,
  changesDiagram: false,
  changesVisualPolicy: false,
  activationPermitted: false,
});
