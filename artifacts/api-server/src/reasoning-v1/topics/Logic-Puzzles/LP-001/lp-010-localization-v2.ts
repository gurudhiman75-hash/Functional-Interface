import type { DayTimePerson, DayTimeSlot } from "./lp-010.ts";
import {
  generateLp010LocalizedBatch,
  LP_010_HI_PA_LOCALIZATION_REVIEW_V1,
  type Lp010LocalizedCaselet,
  type Lp010LocalizedLanguage,
} from "./lp-010-localization-v1.ts";

export const LP_010_HI_PA_LOCALIZATION_REVIEW_V2 = Object.freeze({
  ...LP_010_HI_PA_LOCALIZATION_REVIEW_V1,
  authorityId: "LP_010_HI_PA_LOCALIZATION_REVIEW_V2" as const,
  supersedes: LP_010_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V2" as const,
  editorialFocus: "NATIVE_EXAM_WORDING_AND_PLURAL_GRAMMAR_POLISH" as const,
});

const PEOPLE: readonly DayTimePerson[] = ["A", "B", "C", "D", "E", "F"];
const SLOTS: readonly DayTimeSlot[] = [0, 1, 2, 3, 4, 5];

function list(language: Lp010LocalizedLanguage, values: readonly string[]): string {
  const conjunction = language === "hi" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${conjunction}${values[values.length - 1]}`;
}

function polishedSetup(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): string {
  const people = list(language, PEOPLE.map((person) => caselet.labels.people[person]));
  const days = list(language, caselet.labels.days);
  const slots = list(language, SLOTS.map((slot) => caselet.labels.slots[slot]));
  if (language === "hi") {
    return `${caselet.scenario} इनके नाम ${people} हैं। कार्यक्रम के दिन ${days} हैं और हर दिन दो समय दिए गए हैं। दिन और समय के छह स्थान क्रम से हैं: ${slots}। प्रत्येक व्यक्ति को एक अलग स्थान दिया गया है।`;
  }
  return `${caselet.scenario} ਇਨ੍ਹਾਂ ਦੇ ਨਾਮ ${people} ਹਨ। ਕਾਰਜਕ੍ਰਮ ਦੇ ਦਿਨ ${days} ਹਨ ਅਤੇ ਹਰ ਦਿਨ ਦੋ ਸਮੇਂ ਦਿੱਤੇ ਗਏ ਹਨ। ਦਿਨ ਅਤੇ ਸਮੇਂ ਦੇ ਛੇ ਸਥਾਨ ਕ੍ਰਮ ਅਨੁਸਾਰ ਹਨ: ${slots}। ਹਰੇਕ ਵਿਅਕਤੀ ਨੂੰ ਇੱਕ ਵੱਖਰਾ ਸਥਾਨ ਦਿੱਤਾ ਗਿਆ ਹੈ।`;
}

function pairQuestion(language: Lp010LocalizedLanguage): string {
  return language === "hi"
    ? "निम्न में से कौन-सा विकल्प दो व्यक्तियों के दिन और समय का सही मिलान करता है?"
    : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਦੋ ਵਿਅਕਤੀਆਂ ਦੇ ਦਿਨ ਅਤੇ ਸਮੇਂ ਦਾ ਸਹੀ ਮਿਲਾਨ ਕਰਦਾ ਹੈ?";
}

function polishCaselet(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): Lp010LocalizedCaselet {
  const questionSetup = polishedSetup(language, caselet);
  return {
    ...caselet,
    questionSetup,
    children: caselet.children.map((child) => {
      const parts = child.stem.split("\n\n");
      parts[0] = questionSetup;
      if (child.qlId === "LP-QL-039") parts[parts.length - 1] = pairQuestion(language);
      return { ...child, stem: parts.join("\n\n") };
    }),
  };
}

export function generateLp010LocalizedBatchV2(language: Lp010LocalizedLanguage, seed = "lp-010-localization-review-v2", count = 8): Lp010LocalizedCaselet[] {
  return generateLp010LocalizedBatch(language, seed, count).map((caselet) => polishCaselet(language, caselet));
}
