import type { IntCp001Locale } from "./cp001-multilingual-release";

export const INT_CP001_HINDI_RELEASE_V2_ID = "INT-CP-001-HI-v2" as const;
export const INT_CP001_PUNJABI_RELEASE_V2_ID = "INT-CP-001-PA-v2" as const;
export const INT_CP001_MULTILINGUAL_V2_STANDARD = "FOUR_TIER_GOLD_MULTILINGUAL_V2" as const;
export const INT_CP001_CASH_FLOW_PATCH_ID = "INT-CP001-CASH-FLOW-DIRECTION-V1" as const;

export function getIntCp001LocaleReleaseV2Id(locale: IntCp001Locale):
  | typeof INT_CP001_HINDI_RELEASE_V2_ID
  | typeof INT_CP001_PUNJABI_RELEASE_V2_ID {
  return locale === "hi" ? INT_CP001_HINDI_RELEASE_V2_ID : INT_CP001_PUNJABI_RELEASE_V2_ID;
}
