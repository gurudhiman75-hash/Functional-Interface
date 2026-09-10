import type { DayTimeClue, DayTimePerson, DayTimeSlot, Lp010Child } from "./lp-010.ts";
import type { Lp010LocalizedCaselet, Lp010LocalizedLanguage } from "./lp-010-localization-v1.ts";
import { generateLp010LocalizedBatchV4, LP_010_HI_PA_LOCALIZATION_REVIEW_V4 } from "./lp-010-localization-v4.ts";

export const LP_010_HI_PA_LOCALIZATION_REVIEW_V5 = Object.freeze({
  ...LP_010_HI_PA_LOCALIZATION_REVIEW_V4,
  authorityId: "LP_010_HI_PA_LOCALIZATION_REVIEW_V5" as const,
  supersedes: LP_010_HI_PA_LOCALIZATION_REVIEW_V4.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V5" as const,
  editorialFocus: "PROFILE_SPECIFIC_NATIVE_EXAM_WORDING_CLOSEOUT" as const,
});

const PEOPLE: readonly DayTimePerson[] = ["A", "B", "C", "D", "E", "F"];
const SLOTS: readonly DayTimeSlot[] = [0, 1, 2, 3, 4, 5];
function dayIndex(slot: DayTimeSlot): 0 | 1 | 2 { return Math.floor(slot / 2) as 0 | 1 | 2; }

function list(language: Lp010LocalizedLanguage, values: readonly string[]): string {
  const conjunction = language === "hi" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${conjunction}${values[values.length - 1]}`;
}
function slotList(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): string {
  const values = SLOTS.map((slot) => caselet.labels.slots[slot]);
  const conjunction = language === "hi" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join("; ")};${conjunction}${values[values.length - 1]}`;
}

function subject(language: Lp010LocalizedLanguage, profileId: string, name: string): string {
  if (language === "hi") {
    if (profileId === "STUDENT_PRESENTATIONS" || profileId === "RESEARCH_PRESENTATIONS") return `${name} की प्रस्तुति`;
    if (profileId === "INTERVIEW_SCHEDULE") return `${name} का इंटरव्यू`;
    if (profileId === "TRAINING_DEMOS") return `${name} का प्रदर्शन`;
    if (profileId === "COUNSELLING_APPOINTMENTS") return `${name} की काउंसलिंग`;
    return `${name} की समीक्षा बैठक`;
  }
  if (profileId === "STUDENT_PRESENTATIONS" || profileId === "RESEARCH_PRESENTATIONS") return `${name} ਦੀ ਪੇਸ਼ਕਾਰੀ`;
  if (profileId === "INTERVIEW_SCHEDULE") return `${name} ਦਾ ਇੰਟਰਵਿਊ`;
  if (profileId === "TRAINING_DEMOS") return `${name} ਦਾ ਪ੍ਰਦਰਸ਼ਨ`;
  if (profileId === "COUNSELLING_APPOINTMENTS") return `${name} ਦੀ ਕਾਊਂਸਲਿੰਗ`;
  return `${name} ਦੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ`;
}

function inverseQuestion(language: Lp010LocalizedLanguage, profileId: string): string {
  if (language === "hi") {
    if (profileId === "STUDENT_PRESENTATIONS") return "किस विद्यार्थी की प्रस्तुति है?";
    if (profileId === "INTERVIEW_SCHEDULE") return "किस उम्मीदवार का इंटरव्यू है?";
    if (profileId === "TRAINING_DEMOS") return "किस प्रशिक्षु का प्रदर्शन है?";
    if (profileId === "COUNSELLING_APPOINTMENTS") return "किस उम्मीदवार की काउंसलिंग है?";
    if (profileId === "REVIEW_MEETINGS") return "किस अधिकारी की समीक्षा बैठक है?";
    return "किस शोधकर्ता की प्रस्तुति है?";
  }
  if (profileId === "STUDENT_PRESENTATIONS") return "ਕਿਸ ਵਿਦਿਆਰਥੀ ਦੀ ਪੇਸ਼ਕਾਰੀ ਹੈ?";
  if (profileId === "INTERVIEW_SCHEDULE") return "ਕਿਸ ਉਮੀਦਵਾਰ ਦਾ ਇੰਟਰਵਿਊ ਹੈ?";
  if (profileId === "TRAINING_DEMOS") return "ਕਿਸ ਸਿਖਿਆਰਥੀ ਦਾ ਪ੍ਰਦਰਸ਼ਨ ਹੈ?";
  if (profileId === "COUNSELLING_APPOINTMENTS") return "ਕਿਸ ਉਮੀਦਵਾਰ ਦੀ ਕਾਊਂਸਲਿੰਗ ਹੈ?";
  if (profileId === "REVIEW_MEETINGS") return "ਕਿਸ ਅਧਿਕਾਰੀ ਦੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਹੈ?";
  return "ਕਿਸ ਖੋਜਕਰਤਾ ਦੀ ਪੇਸ਼ਕਾਰੀ ਹੈ?";
}

function nextQuestionTail(language: Lp010LocalizedLanguage, profileId: string): string {
  if (language === "hi") {
    if (profileId === "STUDENT_PRESENTATIONS" || profileId === "RESEARCH_PRESENTATIONS") return "किसकी प्रस्तुति है?";
    if (profileId === "INTERVIEW_SCHEDULE") return "किसका इंटरव्यू है?";
    if (profileId === "TRAINING_DEMOS") return "किसका प्रदर्शन है?";
    if (profileId === "COUNSELLING_APPOINTMENTS") return "किसकी काउंसलिंग है?";
    return "किसकी समीक्षा बैठक है?";
  }
  if (profileId === "STUDENT_PRESENTATIONS" || profileId === "RESEARCH_PRESENTATIONS") return "ਕਿਸ ਦੀ ਪੇਸ਼ਕਾਰੀ ਹੈ?";
  if (profileId === "INTERVIEW_SCHEDULE") return "ਕਿਸ ਦਾ ਇੰਟਰਵਿਊ ਹੈ?";
  if (profileId === "TRAINING_DEMOS") return "ਕਿਸ ਦਾ ਪ੍ਰਦਰਸ਼ਨ ਹੈ?";
  if (profileId === "COUNSELLING_APPOINTMENTS") return "ਕਿਸ ਦੀ ਕਾਊਂਸਲਿੰਗ ਹੈ?";
  return "ਕਿਸ ਦੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਹੈ?";
}

function withText(clue: DayTimeClue, text: string): DayTimeClue { return { ...clue, text } as DayTimeClue; }
function renderClue(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet, clue: DayTimeClue): DayTimeClue {
  const p = (person: DayTimePerson) => caselet.labels.people[person];
  const s = (person: DayTimePerson) => subject(language, caselet.scenarioProfileId, p(person));
  if (language === "hi") {
    if (clue.kind === "PERSON_SLOT") return withText(clue, `${s(clue.person)} ${caselet.labels.days[dayIndex(clue.slot)]} को ${caselet.labels.slotTimes[clue.slot]} पर है।`);
    if (clue.kind === "PERSON_DAY") return withText(clue, `${s(clue.person)} ${caselet.labels.days[clue.dayIndex]} को है।`);
    if (clue.kind === "PERSON_TIME") return withText(clue, `${s(clue.person)} का समय ${clue.timeLabel} है।`);
    if (clue.kind === "BEFORE") return withText(clue, `${s(clue.left)} ${s(clue.right)} से पहले है।`);
    if (clue.kind === "BETWEEN") return withText(clue, `${p(clue.left)} और ${p(clue.right)} के बीच ठीक ${clue.count === 1 ? "एक स्थान है" : `${clue.count} स्थान हैं`}।`);
    if (clue.kind === "IMMEDIATE_BEFORE") return withText(clue, `${s(clue.right)} ${s(clue.left)} के ठीक बाद है।`);
    if (clue.kind === "SAME_TIME") return withText(clue, `${p(clue.left)} और ${p(clue.right)} को एक ही समय दिया गया है, लेकिन दिन अलग हैं।`);
    if (clue.kind === "SAME_DAY") return withText(clue, `${p(clue.left)} और ${p(clue.right)} को एक ही दिन रखा गया है।`);
    return withText(clue, `${s(clue.person)} ${caselet.labels.days[clue.dayIndex]} को नहीं है।`);
  }
  if (clue.kind === "PERSON_SLOT") return withText(clue, `${s(clue.person)} ${caselet.labels.days[dayIndex(clue.slot)]} ਨੂੰ ${caselet.labels.slotTimes[clue.slot]} ਵਜੇ ਹੈ।`);
  if (clue.kind === "PERSON_DAY") return withText(clue, `${s(clue.person)} ${caselet.labels.days[clue.dayIndex]} ਨੂੰ ਹੈ।`);
  if (clue.kind === "PERSON_TIME") return withText(clue, `${s(clue.person)} ਦਾ ਸਮਾਂ ${clue.timeLabel} ਹੈ।`);
  if (clue.kind === "BEFORE") return withText(clue, `${s(clue.left)} ${s(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਹੈ।`);
  if (clue.kind === "BETWEEN") return withText(clue, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${clue.count === 1 ? "ਇੱਕ ਸਥਾਨ ਹੈ" : `${clue.count} ਸਥਾਨ ਹਨ`}।`);
  if (clue.kind === "IMMEDIATE_BEFORE") return withText(clue, `${s(clue.right)} ${s(clue.left)} ਤੋਂ ਠੀਕ ਬਾਅਦ ਹੈ।`);
  if (clue.kind === "SAME_TIME") return withText(clue, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਨੂੰ ਇੱਕੋ ਸਮਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ, ਪਰ ਦਿਨ ਵੱਖਰੇ ਹਨ।`);
  if (clue.kind === "SAME_DAY") return withText(clue, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਨੂੰ ਇੱਕੋ ਦਿਨ ਰੱਖਿਆ ਗਿਆ ਹੈ।`);
  return withText(clue, `${s(clue.person)} ${caselet.labels.days[clue.dayIndex]} ਨੂੰ ਨਹੀਂ ਹੈ।`);
}

function setup(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): string {
  const people = list(language, PEOPLE.map((person) => caselet.labels.people[person]));
  const days = list(language, caselet.labels.days);
  if (language === "hi") return `${caselet.scenario} इनके नाम ${people} हैं। निर्धारित दिन ${days} हैं और हर दिन दो समय दिए गए हैं। दिन और समय के छह स्थान क्रम से हैं: ${slotList(language, caselet)}। प्रत्येक व्यक्ति को एक अलग स्थान दिया गया है।`;
  return `${caselet.scenario} ਇਨ੍ਹਾਂ ਦੇ ਨਾਮ ${people} ਹਨ। ਨਿਰਧਾਰਤ ਦਿਨ ${days} ਹਨ ਅਤੇ ਹਰ ਦਿਨ ਦੋ ਸਮੇਂ ਦਿੱਤੇ ਗਏ ਹਨ। ਦਿਨ ਅਤੇ ਸਮੇਂ ਦੇ ਛੇ ਸਥਾਨ ਕ੍ਰਮ ਅਨੁਸਾਰ ਹਨ: ${slotList(language, caselet)}। ਹਰੇਕ ਵਿਅਕਤੀ ਨੂੰ ਇੱਕ ਵੱਖਰਾ ਸਥਾਨ ਦਿੱਤਾ ਗਿਆ ਹੈ।`;
}

function tail(stem: string): string { return stem.split("\n\n").at(-1) ?? stem; }
function targetPerson(caselet: Lp010LocalizedCaselet, child: Lp010Child): DayTimePerson | undefined {
  const text = tail(child.stem);
  return PEOPLE.find((person) => text.includes(caselet.englishCaselet.labels.people[person]));
}
function targetSlot(caselet: Lp010LocalizedCaselet, child: Lp010Child): DayTimeSlot | undefined {
  const text = tail(child.stem);
  return SLOTS.find((slot) => text.includes(caselet.englishCaselet.labels.slots[slot]));
}
function question(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet, child: Lp010Child): string {
  const person = targetPerson(caselet, child);
  const slot = targetSlot(caselet, child);
  if (language === "hi") {
    if (child.qlId === "LP-QL-037") return `${subject(language, caselet.scenarioProfileId, caselet.labels.people[person!])} किस दिन और किस समय है?`;
    if (child.qlId === "LP-QL-038") return `${caselet.labels.days[dayIndex(slot!)]} को ${caselet.labels.slotTimes[slot!]} पर ${inverseQuestion(language, caselet.scenarioProfileId)}`;
    if (child.qlId === "LP-QL-039") return "निम्न में से कौन-सा विकल्प दो व्यक्तियों के दिन और समय का सही मिलान करता है?";
    return `दिए गए क्रम में ${subject(language, caselet.scenarioProfileId, caselet.labels.people[person!])} के ठीक बाद ${nextQuestionTail(language, caselet.scenarioProfileId)}`;
  }
  if (child.qlId === "LP-QL-037") return `${subject(language, caselet.scenarioProfileId, caselet.labels.people[person!])} ਕਿਹੜੇ ਦਿਨ ਅਤੇ ਕਿਸ ਸਮੇਂ ਹੈ?`;
  if (child.qlId === "LP-QL-038") return `${caselet.labels.days[dayIndex(slot!)]} ਨੂੰ ${caselet.labels.slotTimes[slot!]} ਵਜੇ ${inverseQuestion(language, caselet.scenarioProfileId)}`;
  if (child.qlId === "LP-QL-039") return "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਦੋ ਵਿਅਕਤੀਆਂ ਦੇ ਦਿਨ ਅਤੇ ਸਮੇਂ ਦਾ ਸਹੀ ਮਿਲਾਨ ਕਰਦਾ ਹੈ?";
  return `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${subject(language, caselet.scenarioProfileId, caselet.labels.people[person!])} ਤੋਂ ਠੀਕ ਬਾਅਦ ${nextQuestionTail(language, caselet.scenarioProfileId)}`;
}

function polish(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): Lp010LocalizedCaselet {
  const oldClues = caselet.clues;
  const clues = oldClues.map((clue) => renderClue(language, caselet, clue));
  const questionSetup = setup(language, caselet);
  const heading = language === "hi" ? "शर्तें:" : "ਸ਼ਰਤਾਂ:";
  const children = caselet.children.map((child, index) => {
    const englishChild = caselet.englishCaselet.children[index]!;
    const stem = `${questionSetup}\n\n${heading}\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${question(language, caselet, englishChild)}`;
    const explanation = {
      ...child.explanation,
      lines: child.explanation.lines.map((line) => {
        let rendered = line;
        for (let clueIndex = 0; clueIndex < oldClues.length; clueIndex += 1) rendered = rendered.split(oldClues[clueIndex]!.text).join(clues[clueIndex]!.text);
        return language === "hi" ? rendered.replace("अब पूरा कार्यक्रम निश्चित है।", "अब पूरा क्रम निश्चित है।") : rendered.replace("ਹੁਣ ਪੂਰਾ ਕਾਰਜਕ੍ਰਮ ਨਿਸ਼ਚਿਤ ਹੈ।", "ਹੁਣ ਪੂਰਾ ਕ੍ਰਮ ਨਿਸ਼ਚਿਤ ਹੈ।");
      }),
    };
    return { ...child, stem, explanation };
  });
  return { ...caselet, questionSetup, clues, children };
}

export function generateLp010LocalizedBatchV5(language: Lp010LocalizedLanguage, seed = "lp-010-localization-review-v5", count = 8): Lp010LocalizedCaselet[] {
  return generateLp010LocalizedBatchV4(language, seed, count).map((caselet) => polish(language, caselet));
}
