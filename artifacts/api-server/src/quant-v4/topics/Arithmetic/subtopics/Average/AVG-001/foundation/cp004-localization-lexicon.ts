import { AVG001_CP004_PAIR_HI } from "./cp004-localization-pair-hi";
import { AVG001_CP004_PAIR_PA } from "./cp004-localization-pair-pa";
import {
  AVG001_CP004_MULTI_HI,
  AVG001_CP004_MULTI_PA,
  AVG001_CP004_SPEED_HI,
  AVG001_CP004_SPEED_PA,
} from "./cp004-localization-other-lexicon";
import type { Avg001Cp004PilotLanguage } from "./cp004-localization-types";

export * from "./cp004-localization-types";

export function avg001Cp004PairLexicon(variant: string, language: Avg001Cp004PilotLanguage) {
  const value = (language === "hi" ? AVG001_CP004_PAIR_HI : AVG001_CP004_PAIR_PA)[variant];
  if (!value) throw new Error(`Missing CP-004 pair lexicon for ${variant}`);
  return value;
}

export function avg001Cp004MultiLexicon(variant: string, language: Avg001Cp004PilotLanguage) {
  const value = (language === "hi" ? AVG001_CP004_MULTI_HI : AVG001_CP004_MULTI_PA)[variant];
  if (!value) throw new Error(`Missing CP-004 multi lexicon for ${variant}`);
  return value;
}

export function avg001Cp004SpeedLexicon(variant: string, language: Avg001Cp004PilotLanguage) {
  const value = (language === "hi" ? AVG001_CP004_SPEED_HI : AVG001_CP004_SPEED_PA)[variant];
  if (!value) throw new Error(`Missing CP-004 speed lexicon for ${variant}`);
  return value;
}
