import { STC_V2_QL001_LOCALIZATION } from "./editorial-v2-localization-ql001.ts";
import { STC_V2_QL002_LOCALIZATION } from "./editorial-v2-localization-ql002.ts";
import { STC_V2_QL003_LOCALIZATION } from "./editorial-v2-localization-ql003.ts";
import { STC_V2_QL004_LOCALIZATION } from "./editorial-v2-localization-ql004.ts";
import { STC_V2_QL005_LOCALIZATION } from "./editorial-v2-localization-ql005.ts";
import { STC_V2_QL006_LOCALIZATION } from "./editorial-v2-localization-ql006.ts";
import type { StcV2LocalizedLocale, StcV2LocalizedText, StcV2LocalizationEntry } from "./editorial-v2-localization-types.ts";

export const STC_V2_LOCALIZATION_ENTRIES: readonly StcV2LocalizationEntry[] = [
  ...STC_V2_QL001_LOCALIZATION,
  ...STC_V2_QL002_LOCALIZATION,
  ...STC_V2_QL003_LOCALIZATION,
  ...STC_V2_QL004_LOCALIZATION,
  ...STC_V2_QL005_LOCALIZATION,
  ...STC_V2_QL006_LOCALIZATION,
] as const;

const LOCALIZATION_BY_ID = new Map(STC_V2_LOCALIZATION_ENTRIES.map((entry) => [entry.id, entry] as const));

export function getStcV2LocalizedText(id: string, locale: StcV2LocalizedLocale): StcV2LocalizedText {
  const entry = LOCALIZATION_BY_ID.get(id);
  if (!entry) throw new Error(`Missing STC V2 localization entry for ${id}.`);
  return entry.localized[locale];
}

export {
  STC_V2_QL001_LOCALIZATION,
  STC_V2_QL002_LOCALIZATION,
  STC_V2_QL003_LOCALIZATION,
  STC_V2_QL004_LOCALIZATION,
  STC_V2_QL005_LOCALIZATION,
  STC_V2_QL006_LOCALIZATION,
};
