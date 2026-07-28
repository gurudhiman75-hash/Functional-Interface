export const INT_CP001_HINDI_RELEASE_ID = "INT-CP-001-HI-v1" as const;
export const INT_CP001_PUNJABI_RELEASE_ID = "INT-CP-001-PA-v1" as const;
export const INT_CP001_MULTILINGUAL_STANDARD = "FOUR_TIER_GOLD_MULTILINGUAL_V1" as const;

export type IntCp001Locale = "hi" | "pa";

export function getIntCp001LocaleReleaseId(locale: IntCp001Locale):
  | typeof INT_CP001_HINDI_RELEASE_ID
  | typeof INT_CP001_PUNJABI_RELEASE_ID {
  return locale === "hi" ? INT_CP001_HINDI_RELEASE_ID : INT_CP001_PUNJABI_RELEASE_ID;
}
