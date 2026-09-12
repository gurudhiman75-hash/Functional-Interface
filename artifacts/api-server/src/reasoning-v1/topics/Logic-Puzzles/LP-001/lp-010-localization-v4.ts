import type { DayTimeSlot } from "./lp-010.ts";
import type { Lp010LocalizedCaselet, Lp010LocalizedLanguage } from "./lp-010-localization-v1.ts";
import { generateLp010LocalizedBatchV3, LP_010_HI_PA_LOCALIZATION_REVIEW_V3 } from "./lp-010-localization-v3.ts";

export const LP_010_HI_PA_LOCALIZATION_REVIEW_V4 = Object.freeze({
  ...LP_010_HI_PA_LOCALIZATION_REVIEW_V3,
  authorityId: "LP_010_HI_PA_LOCALIZATION_REVIEW_V4" as const,
  supersedes: LP_010_HI_PA_LOCALIZATION_REVIEW_V3.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V4" as const,
  editorialFocus: "DAY_TIME_DOMAIN_READABILITY_CLOSEOUT" as const,
});

const SLOTS: readonly DayTimeSlot[] = [0, 1, 2, 3, 4, 5];

function readableSlotList(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): string {
  const values = SLOTS.map((slot) => caselet.labels.slots[slot]);
  const conjunction = language === "hi" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join("; ")};${conjunction}${values[values.length - 1]}`;
}

function polish(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): Lp010LocalizedCaselet {
  const oldSetup = caselet.questionSetup;
  const marker = language === "hi" ? "दिन और समय के छह स्थान क्रम से हैं:" : "ਦਿਨ ਅਤੇ ਸਮੇਂ ਦੇ ਛੇ ਸਥਾਨ ਕ੍ਰਮ ਅਨੁਸਾਰ ਹਨ:";
  const suffix = language === "hi" ? "प्रत्येक व्यक्ति को एक अलग स्थान दिया गया है।" : "ਹਰੇਕ ਵਿਅਕਤੀ ਨੂੰ ਇੱਕ ਵੱਖਰਾ ਸਥਾਨ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
  const start = oldSetup.indexOf(marker);
  const end = oldSetup.indexOf(suffix);
  if (start < 0 || end < 0 || end <= start) throw new Error(`Unable to polish LP-010 ${language} day-time domain`);
  const prefix = oldSetup.slice(0, start);
  const questionSetup = `${prefix}${marker} ${readableSlotList(language, caselet)}। ${suffix}`;
  return {
    ...caselet,
    questionSetup,
    children: caselet.children.map((child) => {
      const parts = child.stem.split("\n\n");
      parts[0] = questionSetup;
      return { ...child, stem: parts.join("\n\n") };
    }),
  };
}

export function generateLp010LocalizedBatchV4(language: Lp010LocalizedLanguage, seed = "lp-010-localization-review-v4", count = 8): Lp010LocalizedCaselet[] {
  return generateLp010LocalizedBatchV3(language, seed, count).map((caselet) => polish(language, caselet));
}
