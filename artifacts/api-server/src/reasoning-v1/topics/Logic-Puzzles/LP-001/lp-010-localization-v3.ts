import {
  solveLp010,
  type DayTimeAssignment,
  type DayTimeClue,
  type DayTimePerson,
  type DayTimeSlot,
  type Lp010Child,
} from "./lp-010.ts";
import type { Lp010LocalizedCaselet, Lp010LocalizedLanguage, Lp010LocalizedProfile } from "./lp-010-localization-v1.ts";
import { generateLp010LocalizedBatchV2, LP_010_HI_PA_LOCALIZATION_REVIEW_V2 } from "./lp-010-localization-v2.ts";

export const LP_010_HI_PA_LOCALIZATION_REVIEW_V3 = Object.freeze({
  ...LP_010_HI_PA_LOCALIZATION_REVIEW_V2,
  authorityId: "LP_010_HI_PA_LOCALIZATION_REVIEW_V3" as const,
  supersedes: LP_010_HI_PA_LOCALIZATION_REVIEW_V2.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V3" as const,
  editorialFocus: "NATIVE_RENDERING_NAME_UNIQUENESS_AND_DAY_TIME_GRAMMAR_CLOSEOUT" as const,
});

const PEOPLE: readonly DayTimePerson[] = ["A", "B", "C", "D", "E", "F"];
const SLOTS: readonly DayTimeSlot[] = [0, 1, 2, 3, 4, 5];

function list(language: Lp010LocalizedLanguage, values: readonly string[]): string {
  const conjunction = language === "hi" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${conjunction}${values[values.length - 1]}`;
}
function dayIndex(slot: DayTimeSlot): 0 | 1 | 2 { return Math.floor(slot / 2) as 0 | 1 | 2; }
function correctedName(language: Lp010LocalizedLanguage, englishName: string, current: string): string {
  if (language === "hi" && englishName === "Eshan") return "एशान";
  return current;
}
function correctedProfile(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): Lp010LocalizedProfile {
  const people = Object.fromEntries(PEOPLE.map((person) => [person, correctedName(language, caselet.englishCaselet.labels.people[person], caselet.labels.people[person])])) as Record<DayTimePerson, string>;
  return { ...caselet.labels, people };
}
function withText(clue: DayTimeClue, text: string): DayTimeClue { return { ...clue, text } as DayTimeClue; }

function renderClue(language: Lp010LocalizedLanguage, clue: DayTimeClue, profile: Lp010LocalizedProfile): DayTimeClue {
  const p = (person: DayTimePerson) => profile.people[person];
  if (language === "hi") {
    if (clue.kind === "PERSON_SLOT") return withText(clue, `${p(clue.person)} का कार्यक्रम ${profile.days[dayIndex(clue.slot)]} को ${profile.slotTimes[clue.slot]} पर है।`);
    if (clue.kind === "PERSON_DAY") return withText(clue, `${p(clue.person)} का कार्यक्रम ${profile.days[clue.dayIndex]} को है।`);
    if (clue.kind === "PERSON_TIME") return withText(clue, `${p(clue.person)} का समय ${clue.timeLabel} है।`);
    if (clue.kind === "BEFORE") return withText(clue, `${p(clue.left)} का कार्यक्रम ${p(clue.right)} से पहले है।`);
    if (clue.kind === "BETWEEN") return withText(clue, `${p(clue.left)} और ${p(clue.right)} के बीच ठीक ${clue.count === 1 ? "एक स्थान है" : `${clue.count} स्थान हैं`}।`);
    if (clue.kind === "IMMEDIATE_BEFORE") return withText(clue, `${p(clue.right)} का कार्यक्रम ${p(clue.left)} के ठीक बाद है।`);
    if (clue.kind === "SAME_TIME") return withText(clue, `${p(clue.left)} और ${p(clue.right)} का समय समान है, लेकिन दिन अलग हैं।`);
    if (clue.kind === "SAME_DAY") return withText(clue, `${p(clue.left)} और ${p(clue.right)} का कार्यक्रम एक ही दिन है।`);
    return withText(clue, `${p(clue.person)} का कार्यक्रम ${profile.days[clue.dayIndex]} को नहीं है।`);
  }
  if (clue.kind === "PERSON_SLOT") return withText(clue, `${p(clue.person)} ਦਾ ਕਾਰਜਕ੍ਰਮ ${profile.days[dayIndex(clue.slot)]} ਨੂੰ ${profile.slotTimes[clue.slot]} ਵਜੇ ਹੈ।`);
  if (clue.kind === "PERSON_DAY") return withText(clue, `${p(clue.person)} ਦਾ ਕਾਰਜਕ੍ਰਮ ${profile.days[clue.dayIndex]} ਨੂੰ ਹੈ।`);
  if (clue.kind === "PERSON_TIME") return withText(clue, `${p(clue.person)} ਦਾ ਸਮਾਂ ${clue.timeLabel} ਹੈ।`);
  if (clue.kind === "BEFORE") return withText(clue, `${p(clue.left)} ਦਾ ਕਾਰਜਕ੍ਰਮ ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਹੈ।`);
  if (clue.kind === "BETWEEN") return withText(clue, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${clue.count === 1 ? "ਇੱਕ ਸਥਾਨ ਹੈ" : `${clue.count} ਸਥਾਨ ਹਨ`}।`);
  if (clue.kind === "IMMEDIATE_BEFORE") return withText(clue, `${p(clue.right)} ਦਾ ਕਾਰਜਕ੍ਰਮ ${p(clue.left)} ਤੋਂ ਠੀਕ ਬਾਅਦ ਹੈ।`);
  if (clue.kind === "SAME_TIME") return withText(clue, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦਾ ਸਮਾਂ ਇੱਕੋ ਹੈ, ਪਰ ਦਿਨ ਵੱਖਰੇ ਹਨ।`);
  if (clue.kind === "SAME_DAY") return withText(clue, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦਾ ਕਾਰਜਕ੍ਰਮ ਇੱਕੋ ਦਿਨ ਹੈ।`);
  return withText(clue, `${p(clue.person)} ਦਾ ਕਾਰਜਕ੍ਰਮ ${profile.days[clue.dayIndex]} ਨੂੰ ਨਹੀਂ ਹੈ।`);
}

function setup(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet, profile: Lp010LocalizedProfile): string {
  const people = list(language, PEOPLE.map((person) => profile.people[person]));
  const days = list(language, profile.days);
  const slots = list(language, SLOTS.map((slot) => profile.slots[slot]));
  if (language === "hi") return `${caselet.scenario} इनके नाम ${people} हैं। कार्यक्रम ${days} को है और हर दिन दो समय दिए गए हैं। दिन और समय के छह स्थान क्रम से हैं: ${slots}। प्रत्येक व्यक्ति को एक अलग स्थान दिया गया है।`;
  return `${caselet.scenario} ਇਨ੍ਹਾਂ ਦੇ ਨਾਮ ${people} ਹਨ। ਕਾਰਜਕ੍ਰਮ ${days} ਨੂੰ ਹੈ ਅਤੇ ਹਰ ਦਿਨ ਦੋ ਸਮੇਂ ਦਿੱਤੇ ਗਏ ਹਨ। ਦਿਨ ਅਤੇ ਸਮੇਂ ਦੇ ਛੇ ਸਥਾਨ ਕ੍ਰਮ ਅਨੁਸਾਰ ਹਨ: ${slots}। ਹਰੇਕ ਵਿਅਕਤੀ ਨੂੰ ਇੱਕ ਵੱਖਰਾ ਸਥਾਨ ਦਿੱਤਾ ਗਿਆ ਹੈ।`;
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
function question(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet, child: Lp010Child, profile: Lp010LocalizedProfile): string {
  const person = targetPerson(caselet, child);
  const slot = targetSlot(caselet, child);
  if (language === "hi") {
    if (child.qlId === "LP-QL-037") return `${profile.people[person!]} का कार्यक्रम किस दिन और किस समय है?`;
    if (child.qlId === "LP-QL-038") return `${profile.days[dayIndex(slot!)]} को ${profile.slotTimes[slot!]} पर किसका कार्यक्रम है?`;
    if (child.qlId === "LP-QL-039") return "निम्न में से कौन-सा विकल्प दो व्यक्तियों के दिन और समय का सही मिलान करता है?";
    return `दिए गए क्रम में ${profile.people[person!]} के ठीक बाद किसका कार्यक्रम है?`;
  }
  if (child.qlId === "LP-QL-037") return `${profile.people[person!]} ਦਾ ਕਾਰਜਕ੍ਰਮ ਕਿਹੜੇ ਦਿਨ ਅਤੇ ਕਿਸ ਸਮੇਂ ਹੈ?`;
  if (child.qlId === "LP-QL-038") return `${profile.days[dayIndex(slot!)]} ਨੂੰ ${profile.slotTimes[slot!]} ਵਜੇ ਕਿਸ ਦਾ ਕਾਰਜਕ੍ਰਮ ਹੈ?`;
  if (child.qlId === "LP-QL-039") return "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਦੋ ਵਿਅਕਤੀਆਂ ਦੇ ਦਿਨ ਅਤੇ ਸਮੇਂ ਦਾ ਸਹੀ ਮਿਲਾਨ ਕਰਦਾ ਹੈ?";
  return `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${profile.people[person!]} ਤੋਂ ਠੀਕ ਬਾਅਦ ਕਿਸ ਦਾ ਕਾਰਜਕ੍ਰਮ ਹੈ?`;
}

function optionText(input: string, caselet: Lp010LocalizedCaselet, profile: Lp010LocalizedProfile): string {
  let result = input;
  for (const slot of SLOTS) result = result.split(caselet.englishCaselet.labels.slots[slot]).join(profile.slots[slot]);
  for (const person of PEOPLE) result = result.split(caselet.englishCaselet.labels.people[person]).join(profile.people[person]);
  return result;
}

type PartialTable = Partial<Record<DayTimePerson, readonly DayTimeSlot[]>>;
function candidateTable(solutions: readonly DayTimeAssignment[]): PartialTable {
  const table: PartialTable = {};
  for (const person of PEOPLE) table[person] = [...new Set(solutions.map((solution) => solution[person]))].sort((a, b) => a - b);
  return table;
}
function table(language: Lp010LocalizedLanguage, profile: Lp010LocalizedProfile, values: PartialTable): string {
  const header = language === "hi" ? "संभावित दिन और समय" : "ਸੰਭਵ ਦਿਨ ਅਤੇ ਸਮਾਂ";
  const rows = PEOPLE.map((person) => `| ${profile.people[person]} | ${(values[person] ?? []).map((slot) => profile.slots[slot]).join(" / ") || "—"} |`).join("\n");
  return `| ${profile.personNoun} | ${header} |\n|---|---|\n${rows}`;
}
function detail(language: Lp010LocalizedLanguage, profile: Lp010LocalizedProfile, clue: DayTimeClue): string {
  const p = (person: DayTimePerson) => profile.people[person];
  if (language === "hi") {
    if (clue.kind === "PERSON_SLOT") return `${p(clue.person)} को ${profile.days[dayIndex(clue.slot)]} को ${profile.slotTimes[clue.slot]} पर रखें।`;
    if (clue.kind === "PERSON_DAY") return `${p(clue.person)} के लिए केवल ${profile.days[clue.dayIndex]} के दोनों समय बचते हैं।`;
    if (clue.kind === "PERSON_TIME") return clue.matchingSlots.length === 1 ? `${clue.timeLabel} केवल एक स्थान पर है, इसलिए ${p(clue.person)} वहीं निश्चित है।` : `${p(clue.person)} केवल ${clue.timeLabel} वाले स्थानों में हो सकता है।`;
    if (clue.kind === "BEFORE") return `क्रम में ${p(clue.left)} को ${p(clue.right)} से पहले रखना होगा।`;
    if (clue.kind === "BETWEEN") return `${p(clue.left)} और ${p(clue.right)} के स्थानों का अंतर ${clue.count + 1} होगा।`;
    if (clue.kind === "IMMEDIATE_BEFORE") return `${p(clue.left)} और ${p(clue.right)} लगातार स्थानों पर होंगे और ${p(clue.left)} पहले होगा।`;
    if (clue.kind === "SAME_TIME") return `${p(clue.left)} और ${p(clue.right)} अलग दिनों के समान समय वाले स्थानों पर होंगे।`;
    if (clue.kind === "SAME_DAY") return `${p(clue.left)} और ${p(clue.right)} एक ही दिन के दोनों समयों पर होंगे।`;
    return `${profile.days[clue.dayIndex]} के दोनों समय ${p(clue.person)} के लिए हट जाते हैं।`;
  }
  if (clue.kind === "PERSON_SLOT") return `${p(clue.person)} ਨੂੰ ${profile.days[dayIndex(clue.slot)]} ਨੂੰ ${profile.slotTimes[clue.slot]} ਵਜੇ ਰੱਖੋ।`;
  if (clue.kind === "PERSON_DAY") return `${p(clue.person)} ਲਈ ਸਿਰਫ਼ ${profile.days[clue.dayIndex]} ਦੇ ਦੋਵੇਂ ਸਮੇਂ ਬਚਦੇ ਹਨ।`;
  if (clue.kind === "PERSON_TIME") return clue.matchingSlots.length === 1 ? `${clue.timeLabel} ਸਿਰਫ਼ ਇੱਕ ਸਥਾਨ ਉੱਤੇ ਹੈ, ਇਸ ਲਈ ${p(clue.person)} ਉੱਥੇ ਨਿਸ਼ਚਿਤ ਹੈ।` : `${p(clue.person)} ਸਿਰਫ਼ ${clue.timeLabel} ਵਾਲੇ ਸਥਾਨਾਂ ਵਿੱਚ ਹੋ ਸਕਦਾ ਹੈ।`;
  if (clue.kind === "BEFORE") return `ਕ੍ਰਮ ਵਿੱਚ ${p(clue.left)} ਨੂੰ ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਰੱਖਣਾ ਹੋਵੇਗਾ।`;
  if (clue.kind === "BETWEEN") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ ${clue.count + 1} ਹੋਵੇਗਾ।`;
  if (clue.kind === "IMMEDIATE_BEFORE") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਲਗਾਤਾਰ ਸਥਾਨਾਂ ਉੱਤੇ ਹੋਣਗੇ ਅਤੇ ${p(clue.left)} ਪਹਿਲਾਂ ਹੋਵੇਗਾ।`;
  if (clue.kind === "SAME_TIME") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਵੱਖਰੇ ਦਿਨਾਂ ਦੇ ਇੱਕੋ ਸਮੇਂ ਵਾਲੇ ਸਥਾਨਾਂ ਉੱਤੇ ਹੋਣਗੇ।`;
  if (clue.kind === "SAME_DAY") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਇੱਕੋ ਦਿਨ ਦੇ ਦੋਵੇਂ ਸਮਿਆਂ ਉੱਤੇ ਹੋਣਗੇ।`;
  return `${profile.days[clue.dayIndex]} ਦੇ ਦੋਵੇਂ ਸਮੇਂ ${p(clue.person)} ਲਈ ਹਟ ਜਾਂਦੇ ਹਨ।`;
}
function explanation(language: Lp010LocalizedLanguage, profile: Lp010LocalizedProfile, clues: readonly DayTimeClue[], answer: string): { summary: string; lines: string[] } {
  const ordered = [...clues].sort((a, b) => Number(b.kind === "PERSON_SLOT") - Number(a.kind === "PERSON_SLOT"));
  const used: DayTimeClue[] = [];
  const lines: string[] = [];
  for (let index = 0; index < ordered.length; index += 1) {
    const clue = ordered[index]!;
    used.push(clue);
    const possibilities = candidateTable(solveLp010({ clues: used }));
    const heading = language === "hi" ? `**चरण ${index + 1}: शर्त — ${clue.text}**` : `**ਕਦਮ ${index + 1}: ਸ਼ਰਤ — ${clue.text}**`;
    lines.push(`${heading}\n\n${detail(language, profile, clue)}\n\n${table(language, profile, possibilities)}`);
  }
  const finalTable = table(language, profile, candidateTable(solveLp010({ clues })));
  const finalStep = ordered.length + 1;
  if (language === "hi") lines.push(`**चरण ${finalStep}: पूरा क्रम**\n\nअब पूरा कार्यक्रम निश्चित है। अतः सही उत्तर **${answer}** है।\n\n${finalTable}`);
  else lines.push(`**ਕਦਮ ${finalStep}: ਪੂਰਾ ਕ੍ਰਮ**\n\nਹੁਣ ਪੂਰਾ ਕਾਰਜਕ੍ਰਮ ਨਿਸ਼ਚਿਤ ਹੈ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ **${answer}** ਹੈ।\n\n${finalTable}`);
  return { summary: language === "hi" ? "शर्तों से दिन और समय का एक निश्चित क्रम बनता है।" : "ਸ਼ਰਤਾਂ ਤੋਂ ਦਿਨ ਅਤੇ ਸਮੇਂ ਦਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਕ੍ਰਮ ਬਣਦਾ ਹੈ।", lines };
}

function rerender(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): Lp010LocalizedCaselet {
  const profile = correctedProfile(language, caselet);
  const clues = caselet.clues.map((clue) => renderClue(language, clue, profile));
  const questionSetup = setup(language, caselet, profile);
  const clueHeading = language === "hi" ? "शर्तें:" : "ਸ਼ਰਤਾਂ:";
  const children = caselet.englishCaselet.children.map((englishChild, index) => {
    const sourceChild = caselet.children[index]!;
    const options = englishChild.options.map((value) => optionText(value, caselet, profile));
    const answer = options[englishChild.correctIndex]!;
    const stem = `${questionSetup}\n\n${clueHeading}\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${question(language, caselet, englishChild, profile)}`;
    return { ...sourceChild, stem, options, correctIndex: englishChild.correctIndex, answer, explanation: explanation(language, profile, clues, answer) };
  });
  return { ...caselet, questionSetup, labels: profile, clues, children };
}

export function generateLp010LocalizedBatchV3(language: Lp010LocalizedLanguage, seed = "lp-010-localization-review-v3", count = 8): Lp010LocalizedCaselet[] {
  return generateLp010LocalizedBatchV2(language, seed, count).map((caselet) => rerender(language, caselet));
}
