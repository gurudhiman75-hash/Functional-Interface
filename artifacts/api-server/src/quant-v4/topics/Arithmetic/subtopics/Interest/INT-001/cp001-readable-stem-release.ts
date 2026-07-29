export const INT_CP001_ENGLISH_READABLE_RELEASE_ID = "INT-CP-001-EN-v4" as const;
export const INT_CP001_HINDI_READABLE_RELEASE_ID = "INT-CP-001-HI-v3" as const;
export const INT_CP001_PUNJABI_READABLE_RELEASE_ID = "INT-CP-001-PA-v3" as const;

export const INT_CP001_READABLE_STEM_STANDARD = "FOUR_TIER_GOLD_READABLE_STEMS_V1" as const;
export const INT_CP001_READABLE_STEM_PATCH_ID = "INT-CP001-ACTIVE-SCANNABLE-STEMS-V1" as const;

export type IntCp001ReadableLanguage = "en" | "hi" | "pa";

export function getIntCp001ReadableReleaseId(language: IntCp001ReadableLanguage):
  | typeof INT_CP001_ENGLISH_READABLE_RELEASE_ID
  | typeof INT_CP001_HINDI_READABLE_RELEASE_ID
  | typeof INT_CP001_PUNJABI_READABLE_RELEASE_ID {
  if (language === "en") return INT_CP001_ENGLISH_READABLE_RELEASE_ID;
  return language === "hi"
    ? INT_CP001_HINDI_READABLE_RELEASE_ID
    : INT_CP001_PUNJABI_READABLE_RELEASE_ID;
}
