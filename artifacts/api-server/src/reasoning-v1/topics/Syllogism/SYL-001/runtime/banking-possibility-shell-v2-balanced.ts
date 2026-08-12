import type { SylLocale } from "../foundation/types";
import {
  generateBankingPossibilityShellV2,
  type BankingPossibilityShellQuestionV2,
} from "./banking-possibility-shell-v2";
import { createPrng, shuffle } from "./prng";

export function generateBalancedBankingPossibilityShellV2(
  seed: number,
  locale: SylLocale,
): BankingPossibilityShellQuestionV2 {
  const base = generateBankingPossibilityShellV2(seed, locale);
  const correct = base.options.find((entry) => entry.isCorrect);
  if (!correct) throw new Error(`Seed ${seed} has no correct V2 option.`);

  const distractors = shuffle(
    base.options.filter((entry) => !entry.isCorrect),
    createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-002:${seed}:balanced-distractors`),
  );
  const targetIndex = Math.abs(seed) % base.options.length;
  const ordered = [...distractors];
  ordered.splice(targetIndex, 0, correct);
  const options = ordered.map((entry, index) => ({
    ...entry,
    optionId: `OPTION-${index + 1}`,
  }));

  return {
    ...base,
    options,
    correctIndex: targetIndex,
  };
}

export const SYL_BANKING_POSSIBILITY_BALANCE_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_POSSIBILITY_BALANCE_V1",
  wrapsSemanticAuthority: "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
  policy: "EXACT_SEED_MOD_5_BALANCE_V1",
  changesStatements: false,
  changesConclusions: false,
  changesSemanticAnswer: false,
  changesExplanations: false,
  changesOptionLabels: false,
  changesOnlyOptionOrderAndCorrectIndex: true,
  activationPermitted: false,
});
