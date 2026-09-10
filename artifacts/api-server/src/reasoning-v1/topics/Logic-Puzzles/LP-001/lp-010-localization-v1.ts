import {
  generateLp010Batch,
  solveLp010,
  type DayTimeAssignment,
  type DayTimeClue,
  type DayTimePerson,
  type DayTimeSlot,
  type Lp010Caselet,
  type Lp010Child,
  type Lp010Profile,
} from "./lp-010.ts";
import { LP_010_ENGLISH_FREEZE_V1 } from "./lp-010-permanent-freeze.ts";

export type Lp010LocalizedLanguage = "hi" | "pa";

export type Lp010LocalizedProfile = Omit<Lp010Profile, "scenario" | "personNoun" | "eventNoun" | "people" | "days" | "slots" | "personQuestionTemplate" | "slotQuestionTemplate" | "pairQuestionTemplate" | "nextQuestionTemplate"> & {
  scenario: string;
  personNoun: string;
  eventNoun: string;
  people: Record<DayTimePerson, string>;
  days: readonly [string, string, string];
  slots: Record<DayTimeSlot, string>;
};

export type Lp010LocalizedChild = Omit<Lp010Child, "stem" | "options" | "answer" | "explanation"> & {
  language: Lp010LocalizedLanguage;
  stem: string;
  options: string[];
  answer: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp010LocalizedCaselet = Omit<Lp010Caselet, "scenario" | "questionSetup" | "labels" | "clues" | "children"> & {
  language: Lp010LocalizedLanguage;
  scenario: string;
  questionSetup: string;
  labels: Lp010LocalizedProfile;
  clues: readonly DayTimeClue[];
  children: readonly Lp010LocalizedChild[];
  englishCaselet: Lp010Caselet;
};

export const LP_010_HI_PA_LOCALIZATION_REVIEW_V1 = Object.freeze({
  authorityId: "LP_010_HI_PA_LOCALIZATION_REVIEW_V1" as const,
  sourceEnglishAuthorityId: LP_010_ENGLISH_FREEZE_V1.authorityId,
  packageId: "LP-010" as const,
  checkpointId: "LP-CP-010" as const,
  permanentQlIds: LP_010_ENGLISH_FREEZE_V1.permanentQlIds,
  supportedLanguages: ["hi", "pa"] as const,
  locales: ["hi-IN", "pa-IN"] as const,
  localizationMethod: "SEMANTIC_REBUILD_FROM_FROZEN_SOLVED_CASELET" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V1" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  questionStudioStatus: "PENDING_LOCALIZATION_APPROVAL" as const,
});

const PEOPLE: readonly DayTimePerson[] = ["A", "B", "C", "D", "E", "F"];
const SLOTS: readonly DayTimeSlot[] = [0, 1, 2, 3, 4, 5];

const DAYS = {
  hi: { Monday: "सोमवार", Tuesday: "मंगलवार", Wednesday: "बुधवार", Thursday: "गुरुवार", Friday: "शुक्रवार", Saturday: "शनिवार", Sunday: "रविवार" },
  pa: { Monday: "ਸੋਮਵਾਰ", Tuesday: "ਮੰਗਲਵਾਰ", Wednesday: "ਬੁੱਧਵਾਰ", Thursday: "ਵੀਰਵਾਰ", Friday: "ਸ਼ੁੱਕਰਵਾਰ", Saturday: "ਸ਼ਨੀਵਾਰ", Sunday: "ਐਤਵਾਰ" },
} as const;

const NAMES: Record<Lp010LocalizedLanguage, Record<string, string>> = {
  hi: {
    Aarav: "आरव", Bhavna: "भावना", Chetan: "चेतन", Diya: "दिया", Eshan: "ईशान", Farah: "फराह", Gaurav: "गौरव", Hina: "हिना", Ishan: "ईशान", Jyoti: "ज्योति", Karan: "करण", Meera: "मीरा",
    Aditi: "अदिति", Bharat: "भारत", Charu: "चारु", Dev: "देव", Ira: "इरा", Kabir: "कबीर", Leena: "लीना", Mohit: "मोहित", Neha: "नेहा", Parth: "पार्थ", Ritu: "रितु", Sahil: "साहिल",
    Anaya: "अनाया", Bimal: "बिमल", Deepa: "दीपा", Harsh: "हर्ष", Kriti: "कृति", Manav: "मानव", Naman: "नमन", Ojas: "ओजस", Pooja: "पूजा", Ravi: "रवि", Simran: "सिमरन", Tanvi: "तन्वी",
    Asha: "आशा", Bikram: "बिक्रम", Deepak: "दीपक", Esha: "ईशा", Harish: "हरीश", Kiran: "किरण", Mona: "मोना", Naveen: "नवीन", Reema: "रीमा", Tina: "टीना",
    Kamal: "कमल", Lata: "लता", Nisha: "निशा", Omkar: "ओमकार", Priya: "प्रिया", Rahul: "राहुल", Tarun: "तरुण", Zoya: "जोया", Arjun: "अर्जुन", Leela: "लीला",
    Alok: "आलोक", Beena: "बीना", Dinesh: "दिनेश", Gopal: "गोपाल", Harini: "हरिनी", Irfan: "इरफान", Juhi: "जुही", Kartik: "कार्तिक", Nitin: "नितिन", Rupa: "रूपा",
  },
  pa: {
    Aarav: "ਆਰਵ", Bhavna: "ਭਾਵਨਾ", Chetan: "ਚੇਤਨ", Diya: "ਦੀਆ", Eshan: "ਈਸ਼ਾਨ", Farah: "ਫਰਾਹ", Gaurav: "ਗੌਰਵ", Hina: "ਹਿਨਾ", Ishan: "ਇਸ਼ਾਨ", Jyoti: "ਜੋਤੀ", Karan: "ਕਰਨ", Meera: "ਮੀਰਾ",
    Aditi: "ਅਦਿਤੀ", Bharat: "ਭਰਤ", Charu: "ਚਾਰੂ", Dev: "ਦੇਵ", Ira: "ਇਰਾ", Kabir: "ਕਬੀਰ", Leena: "ਲੀਨਾ", Mohit: "ਮੋਹਿਤ", Neha: "ਨੇਹਾ", Parth: "ਪਾਰਥ", Ritu: "ਰਿਤੂ", Sahil: "ਸਾਹਿਲ",
    Anaya: "ਅਨਾਇਆ", Bimal: "ਬਿਮਲ", Deepa: "ਦੀਪਾ", Harsh: "ਹਰਸ਼", Kriti: "ਕ੍ਰਿਤੀ", Manav: "ਮਾਨਵ", Naman: "ਨਮਨ", Ojas: "ਓਜਸ", Pooja: "ਪੂਜਾ", Ravi: "ਰਵੀ", Simran: "ਸਿਮਰਨ", Tanvi: "ਤਨਵੀ",
    Asha: "ਆਸ਼ਾ", Bikram: "ਬਿਕਰਮ", Deepak: "ਦੀਪਕ", Esha: "ਈਸ਼ਾ", Harish: "ਹਰੀਸ਼", Kiran: "ਕਿਰਨ", Mona: "ਮੋਨਾ", Naveen: "ਨਵੀਨ", Reema: "ਰੀਮਾ", Tina: "ਟੀਨਾ",
    Kamal: "ਕਮਲ", Lata: "ਲਤਾ", Nisha: "ਨਿਸ਼ਾ", Omkar: "ਓਮਕਾਰ", Priya: "ਪ੍ਰਿਆ", Rahul: "ਰਾਹੁਲ", Tarun: "ਤਰੁਣ", Zoya: "ਜ਼ੋਇਆ", Arjun: "ਅਰਜੁਨ", Leela: "ਲੀਲਾ",
    Alok: "ਆਲੋਕ", Beena: "ਬੀਨਾ", Dinesh: "ਦਿਨੇਸ਼", Gopal: "ਗੋਪਾਲ", Harini: "ਹਰੀਨੀ", Irfan: "ਇਰਫਾਨ", Juhi: "ਜੂਹੀ", Kartik: "ਕਾਰਤਿਕ", Nitin: "ਨਿਤਿਨ", Rupa: "ਰੂਪਾ",
  },
};

type ProfileCopy = { scenario: string; personNoun: string; eventNoun: string };
const PROFILE_COPY: Record<Lp010LocalizedLanguage, Record<string, ProfileCopy>> = {
  hi: {
    STUDENT_PRESENTATIONS: { scenario: "छह विद्यार्थी कॉलेज में प्रस्तुतियाँ देंगे।", personNoun: "विद्यार्थी", eventNoun: "प्रस्तुति" },
    INTERVIEW_SCHEDULE: { scenario: "छह उम्मीदवारों के इंटरव्यू निर्धारित किए गए हैं।", personNoun: "उम्मीदवार", eventNoun: "इंटरव्यू" },
    TRAINING_DEMOS: { scenario: "छह प्रशिक्षुओं के व्यावहारिक प्रदर्शन निर्धारित किए गए हैं।", personNoun: "प्रशिक्षु", eventNoun: "प्रदर्शन" },
    COUNSELLING_APPOINTMENTS: { scenario: "छह उम्मीदवारों की काउंसलिंग निर्धारित की गई है।", personNoun: "उम्मीदवार", eventNoun: "काउंसलिंग" },
    REVIEW_MEETINGS: { scenario: "एक बैंक में छह अधिकारियों की समीक्षा बैठकें निर्धारित की गई हैं।", personNoun: "अधिकारी", eventNoun: "समीक्षा बैठक" },
    RESEARCH_PRESENTATIONS: { scenario: "छह शोधकर्ताओं की प्रस्तुतियाँ विश्वविद्यालय में निर्धारित की गई हैं।", personNoun: "शोधकर्ता", eventNoun: "प्रस्तुति" },
  },
  pa: {
    STUDENT_PRESENTATIONS: { scenario: "ਛੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀਆਂ ਪੇਸ਼ਕਾਰੀਆਂ ਕਾਲਜ ਵਿੱਚ ਨਿਰਧਾਰਤ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ।", personNoun: "ਵਿਦਿਆਰਥੀ", eventNoun: "ਪੇਸ਼ਕਾਰੀ" },
    INTERVIEW_SCHEDULE: { scenario: "ਛੇ ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੰਟਰਵਿਊ ਨਿਰਧਾਰਤ ਕੀਤੇ ਗਏ ਹਨ।", personNoun: "ਉਮੀਦਵਾਰ", eventNoun: "ਇੰਟਰਵਿਊ" },
    TRAINING_DEMOS: { scenario: "ਛੇ ਸਿਖਿਆਰਥੀਆਂ ਦੇ ਪ੍ਰੈਕਟੀਕਲ ਪ੍ਰਦਰਸ਼ਨ ਨਿਰਧਾਰਤ ਕੀਤੇ ਗਏ ਹਨ।", personNoun: "ਸਿਖਿਆਰਥੀ", eventNoun: "ਪ੍ਰਦਰਸ਼ਨ" },
    COUNSELLING_APPOINTMENTS: { scenario: "ਛੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਕਾਊਂਸਲਿੰਗ ਨਿਰਧਾਰਤ ਕੀਤੀ ਗਈ ਹੈ।", personNoun: "ਉਮੀਦਵਾਰ", eventNoun: "ਕਾਊਂਸਲਿੰਗ" },
    REVIEW_MEETINGS: { scenario: "ਇੱਕ ਬੈਂਕ ਵਿੱਚ ਛੇ ਅਧਿਕਾਰੀਆਂ ਦੀਆਂ ਸਮੀਖਿਆ ਮੀਟਿੰਗਾਂ ਨਿਰਧਾਰਤ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ।", personNoun: "ਅਧਿਕਾਰੀ", eventNoun: "ਸਮੀਖਿਆ ਮੀਟਿੰਗ" },
    RESEARCH_PRESENTATIONS: { scenario: "ਛੇ ਖੋਜਕਰਤਿਆਂ ਦੀਆਂ ਪੇਸ਼ਕਾਰੀਆਂ ਯੂਨੀਵਰਸਿਟੀ ਵਿੱਚ ਨਿਰਧਾਰਤ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ।", personNoun: "ਖੋਜਕਰਤਾ", eventNoun: "ਪੇਸ਼ਕਾਰੀ" },
  },
};

function translatedName(language: Lp010LocalizedLanguage, name: string): string {
  const translated = NAMES[language][name];
  if (!translated) throw new Error(`Missing LP-010 ${language} name localization: ${name}`);
  return translated;
}
function translatedDay(language: Lp010LocalizedLanguage, day: string): string {
  const translated = (DAYS[language] as Record<string, string>)[day];
  if (!translated) throw new Error(`Missing LP-010 ${language} day localization: ${day}`);
  return translated;
}
function localizedList(language: Lp010LocalizedLanguage, values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  const conjunction = language === "hi" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${conjunction}${values[values.length - 1]}`;
}
function withText(clue: DayTimeClue, text: string): DayTimeClue { return { ...clue, text } as DayTimeClue; }

function localizeProfile(language: Lp010LocalizedLanguage, english: Lp010Profile): Lp010LocalizedProfile {
  const copy = PROFILE_COPY[language][english.id];
  if (!copy) throw new Error(`Missing LP-010 ${language} profile copy: ${english.id}`);
  const people = Object.fromEntries(PEOPLE.map((person) => [person, translatedName(language, english.people[person])])) as Record<DayTimePerson, string>;
  const days = english.days.map((day) => translatedDay(language, day)) as unknown as readonly [string, string, string];
  const slots = Object.fromEntries(SLOTS.map((slot) => [slot, `${days[Math.floor(slot / 2)]}, ${english.slotTimes[slot]}`])) as Record<DayTimeSlot, string>;
  return { ...english, ...copy, people, days, slots };
}

function localizeClue(language: Lp010LocalizedLanguage, clue: DayTimeClue, profile: Lp010LocalizedProfile): DayTimeClue {
  const p = (person: DayTimePerson) => profile.people[person];
  if (language === "hi") {
    if (clue.kind === "PERSON_SLOT") return withText(clue, `${p(clue.person)} का समय ${profile.slots[clue.slot]} है।`);
    if (clue.kind === "PERSON_DAY") return withText(clue, `${p(clue.person)} का कार्यक्रम ${profile.days[clue.dayIndex]} को है।`);
    if (clue.kind === "PERSON_TIME") return withText(clue, `${p(clue.person)} का समय ${clue.timeLabel} है।`);
    if (clue.kind === "BEFORE") return withText(clue, `${p(clue.left)} का कार्यक्रम ${p(clue.right)} से पहले है।`);
    if (clue.kind === "BETWEEN") return withText(clue, `${p(clue.left)} और ${p(clue.right)} के बीच ठीक ${clue.count === 1 ? "एक स्थान" : `${clue.count} स्थान`} है${clue.count === 1 ? "" : "ं"}।`);
    if (clue.kind === "IMMEDIATE_BEFORE") return withText(clue, `${p(clue.right)} का कार्यक्रम ${p(clue.left)} के ठीक बाद है।`);
    if (clue.kind === "SAME_TIME") return withText(clue, `${p(clue.left)} और ${p(clue.right)} का समय समान है, लेकिन दिन अलग हैं।`);
    if (clue.kind === "SAME_DAY") return withText(clue, `${p(clue.left)} और ${p(clue.right)} का कार्यक्रम एक ही दिन है।`);
    return withText(clue, `${p(clue.person)} का कार्यक्रम ${profile.days[clue.dayIndex]} को नहीं है।`);
  }
  if (clue.kind === "PERSON_SLOT") return withText(clue, `${p(clue.person)} ਦਾ ਸਮਾਂ ${profile.slots[clue.slot]} ਹੈ।`);
  if (clue.kind === "PERSON_DAY") return withText(clue, `${p(clue.person)} ਦਾ ਕਾਰਜਕ੍ਰਮ ${profile.days[clue.dayIndex]} ਨੂੰ ਹੈ।`);
  if (clue.kind === "PERSON_TIME") return withText(clue, `${p(clue.person)} ਦਾ ਸਮਾਂ ${clue.timeLabel} ਹੈ।`);
  if (clue.kind === "BEFORE") return withText(clue, `${p(clue.left)} ਦਾ ਕਾਰਜਕ੍ਰਮ ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਹੈ।`);
  if (clue.kind === "BETWEEN") return withText(clue, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${clue.count === 1 ? "ਇੱਕ ਸਥਾਨ" : `${clue.count} ਸਥਾਨ`} ਹੈ${clue.count === 1 ? "" : "ਨ"}।`);
  if (clue.kind === "IMMEDIATE_BEFORE") return withText(clue, `${p(clue.right)} ਦਾ ਕਾਰਜਕ੍ਰਮ ${p(clue.left)} ਤੋਂ ਠੀਕ ਬਾਅਦ ਹੈ।`);
  if (clue.kind === "SAME_TIME") return withText(clue, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦਾ ਸਮਾਂ ਇੱਕੋ ਹੈ, ਪਰ ਦਿਨ ਵੱਖਰੇ ਹਨ।`);
  if (clue.kind === "SAME_DAY") return withText(clue, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦਾ ਕਾਰਜਕ੍ਰਮ ਇੱਕੋ ਦਿਨ ਹੈ।`);
  return withText(clue, `${p(clue.person)} ਦਾ ਕਾਰਜਕ੍ਰਮ ${profile.days[clue.dayIndex]} ਨੂੰ ਨਹੀਂ ਹੈ।`);
}

function localizeTextTokens(input: string, english: Lp010Profile, localized: Lp010LocalizedProfile): string {
  let result = input;
  for (const slot of SLOTS) result = result.split(english.slots[slot]).join(localized.slots[slot]);
  for (const person of PEOPLE) result = result.split(english.people[person]).join(localized.people[person]);
  return result;
}
function questionTail(stem: string): string { return stem.split("\n\n").at(-1) ?? stem; }
function targetPerson(english: Lp010Caselet, child: Lp010Child): DayTimePerson | undefined {
  const tail = questionTail(child.stem);
  return PEOPLE.find((person) => tail.includes(english.labels.people[person]));
}
function targetSlot(english: Lp010Caselet, child: Lp010Child): DayTimeSlot | undefined {
  const tail = questionTail(child.stem);
  return SLOTS.find((slot) => tail.includes(english.labels.slots[slot]));
}
function localizedQuestion(language: Lp010LocalizedLanguage, english: Lp010Caselet, child: Lp010Child, profile: Lp010LocalizedProfile): string {
  const person = targetPerson(english, child);
  const slot = targetSlot(english, child);
  if (language === "hi") {
    if (child.qlId === "LP-QL-037") return `${profile.people[person!]} का कार्यक्रम किस दिन और किस समय है?`;
    if (child.qlId === "LP-QL-038") return `${profile.slots[slot!]} पर किसका कार्यक्रम है?`;
    if (child.qlId === "LP-QL-039") return `निम्न में से कौन-सा विकल्प दो ${profile.personNoun}ों के दिन और समय का सही मिलान करता है?`;
    return `दिए गए क्रम में ${profile.people[person!]} के ठीक बाद किसका कार्यक्रम है?`;
  }
  if (child.qlId === "LP-QL-037") return `${profile.people[person!]} ਦਾ ਕਾਰਜਕ੍ਰਮ ਕਿਹੜੇ ਦਿਨ ਅਤੇ ਕਿਸ ਸਮੇਂ ਹੈ?`;
  if (child.qlId === "LP-QL-038") return `${profile.slots[slot!]} ਨੂੰ ਕਿਸ ਦਾ ਕਾਰਜਕ੍ਰਮ ਹੈ?`;
  if (child.qlId === "LP-QL-039") return `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਦੋ ${profile.personNoun}ਆਂ ਦੇ ਦਿਨ ਅਤੇ ਸਮੇਂ ਦਾ ਸਹੀ ਮਿਲਾਨ ਕਰਦਾ ਹੈ?`;
  return `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${profile.people[person!]} ਤੋਂ ਠੀਕ ਬਾਅਦ ਕਿਸ ਦਾ ਕਾਰਜਕ੍ਰਮ ਹੈ?`;
}

function localizedSetup(language: Lp010LocalizedLanguage, profile: Lp010LocalizedProfile): string {
  const people = localizedList(language, PEOPLE.map((person) => profile.people[person]));
  const days = localizedList(language, profile.days);
  const slots = localizedList(language, SLOTS.map((slot) => profile.slots[slot]));
  if (language === "hi") return `${profile.scenario} ${profile.personNoun} हैं ${people}। कार्यक्रम ${days} को है और हर दिन दो स्थान हैं। क्रम से छह दिन-समय हैं: ${slots}। प्रत्येक ${profile.personNoun} को एक अलग दिन-समय दिया गया है।`;
  return `${profile.scenario} ${profile.personNoun} ਹਨ ${people}। ਕਾਰਜਕ੍ਰਮ ${days} ਨੂੰ ਹੈ ਅਤੇ ਹਰ ਦਿਨ ਦੋ ਸਥਾਨ ਹਨ। ਕ੍ਰਮ ਅਨੁਸਾਰ ਛੇ ਦਿਨ-ਸਮੇਂ ਹਨ: ${slots}। ਹਰੇਕ ${profile.personNoun} ਨੂੰ ਇੱਕ ਵੱਖਰਾ ਦਿਨ-ਸਮਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।`;
}

type PartialTable = Partial<Record<DayTimePerson, readonly DayTimeSlot[]>>;
function candidateTable(solutions: readonly DayTimeAssignment[]): PartialTable {
  const table: PartialTable = {};
  for (const person of PEOPLE) table[person] = [...new Set(solutions.map((solution) => solution[person]))].sort((a, b) => a - b);
  return table;
}
function tableMarkdown(language: Lp010LocalizedLanguage, profile: Lp010LocalizedProfile, table: PartialTable): string {
  const header = language === "hi" ? `| ${profile.personNoun} | संभावित दिन-समय |\n|---|---|` : `| ${profile.personNoun} | ਸੰਭਵ ਦਿਨ-ਸਮਾਂ |\n|---|---|`;
  const rows = PEOPLE.map((person) => `| ${profile.people[person]} | ${(table[person] ?? []).map((slot) => profile.slots[slot]).join(" / ") || "—"} |`).join("\n");
  return `${header}\n${rows}`;
}
function explanationDetail(language: Lp010LocalizedLanguage, profile: Lp010LocalizedProfile, clue: DayTimeClue): string {
  const p = (person: DayTimePerson) => profile.people[person];
  if (language === "hi") {
    if (clue.kind === "PERSON_SLOT") return `${p(clue.person)} को ${profile.slots[clue.slot]} पर रखें।`;
    if (clue.kind === "PERSON_DAY") return `${p(clue.person)} के लिए केवल ${profile.days[clue.dayIndex]} के दोनों स्थान बचते हैं।`;
    if (clue.kind === "PERSON_TIME") return clue.matchingSlots.length === 1 ? `${clue.timeLabel} केवल एक स्थान पर है, इसलिए ${p(clue.person)} वहीं निश्चित है।` : `${p(clue.person)} केवल ${clue.timeLabel} वाले स्थानों में हो सकता है।`;
    if (clue.kind === "BEFORE") return `क्रम में ${p(clue.left)} को ${p(clue.right)} से पहले रखना होगा।`;
    if (clue.kind === "BETWEEN") return `${p(clue.left)} और ${p(clue.right)} के स्थानों का अंतर ${clue.count + 1} होगा।`;
    if (clue.kind === "IMMEDIATE_BEFORE") return `${p(clue.left)} और ${p(clue.right)} लगातार स्थानों पर होंगे और ${p(clue.left)} पहले होगा।`;
    if (clue.kind === "SAME_TIME") return `${p(clue.left)} और ${p(clue.right)} अलग दिनों के उन स्थानों पर होंगे जिनका समय समान है।`;
    if (clue.kind === "SAME_DAY") return `${p(clue.left)} और ${p(clue.right)} एक ही दिन के दोनों स्थानों पर होंगे।`;
    return `${profile.days[clue.dayIndex]} के दोनों स्थान ${p(clue.person)} के लिए हट जाते हैं।`;
  }
  if (clue.kind === "PERSON_SLOT") return `${p(clue.person)} ਨੂੰ ${profile.slots[clue.slot]} ਉੱਤੇ ਰੱਖੋ।`;
  if (clue.kind === "PERSON_DAY") return `${p(clue.person)} ਲਈ ਸਿਰਫ਼ ${profile.days[clue.dayIndex]} ਦੇ ਦੋ ਸਥਾਨ ਬਚਦੇ ਹਨ।`;
  if (clue.kind === "PERSON_TIME") return clue.matchingSlots.length === 1 ? `${clue.timeLabel} ਸਿਰਫ਼ ਇੱਕ ਸਥਾਨ ਉੱਤੇ ਹੈ, ਇਸ ਲਈ ${p(clue.person)} ਉੱਥੇ ਨਿਸ਼ਚਿਤ ਹੈ।` : `${p(clue.person)} ਸਿਰਫ਼ ${clue.timeLabel} ਵਾਲੇ ਸਥਾਨਾਂ ਵਿੱਚ ਹੋ ਸਕਦਾ ਹੈ।`;
  if (clue.kind === "BEFORE") return `ਕ੍ਰਮ ਵਿੱਚ ${p(clue.left)} ਨੂੰ ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਰੱਖਣਾ ਹੋਵੇਗਾ।`;
  if (clue.kind === "BETWEEN") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ ${clue.count + 1} ਹੋਵੇਗਾ।`;
  if (clue.kind === "IMMEDIATE_BEFORE") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਲਗਾਤਾਰ ਸਥਾਨਾਂ ਉੱਤੇ ਹੋਣਗੇ ਅਤੇ ${p(clue.left)} ਪਹਿਲਾਂ ਹੋਵੇਗਾ।`;
  if (clue.kind === "SAME_TIME") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਵੱਖਰੇ ਦਿਨਾਂ ਦੇ ਉਹਨਾਂ ਸਥਾਨਾਂ ਉੱਤੇ ਹੋਣਗੇ ਜਿਨ੍ਹਾਂ ਦਾ ਸਮਾਂ ਇੱਕੋ ਹੈ।`;
  if (clue.kind === "SAME_DAY") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਇੱਕੋ ਦਿਨ ਦੇ ਦੋ ਸਥਾਨਾਂ ਉੱਤੇ ਹੋਣਗੇ।`;
  return `${profile.days[clue.dayIndex]} ਦੇ ਦੋਵੇਂ ਸਥਾਨ ${p(clue.person)} ਲਈ ਹਟ ਜਾਂਦੇ ਹਨ।`;
}
function buildExplanation(language: Lp010LocalizedLanguage, profile: Lp010LocalizedProfile, clues: readonly DayTimeClue[], answer: string): { summary: string; lines: string[] } {
  const ordered = [...clues].sort((a, b) => Number(b.kind === "PERSON_SLOT") - Number(a.kind === "PERSON_SLOT"));
  const used: DayTimeClue[] = [];
  const lines: string[] = [];
  let step = 1;
  for (const clue of ordered) {
    used.push(clue);
    const solutions = solveLp010({ clues: used });
    const heading = language === "hi" ? `**चरण ${step}: शर्त — ${clue.text}**` : `**ਕਦਮ ${step}: ਸ਼ਰਤ — ${clue.text}**`;
    lines.push(`${heading}\n\n${explanationDetail(language, profile, clue)}\n\n${tableMarkdown(language, profile, candidateTable(solutions))}`);
    step += 1;
  }
  const finalTable = tableMarkdown(language, profile, candidateTable(solveLp010({ clues })));
  if (language === "hi") lines.push(`**चरण ${step}: पूरा क्रम**\n\nअब पूरा कार्यक्रम निश्चित है। अतः सही उत्तर **${answer}** है।\n\n${finalTable}`);
  else lines.push(`**ਕਦਮ ${step}: ਪੂਰਾ ਕ੍ਰਮ**\n\nਹੁਣ ਪੂਰਾ ਕਾਰਜਕ੍ਰਮ ਨਿਸ਼ਚਿਤ ਹੈ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ **${answer}** ਹੈ।\n\n${finalTable}`);
  return { summary: language === "hi" ? "शर्तों से एक निश्चित दिन-समय क्रम बनता है।" : "ਸ਼ਰਤਾਂ ਤੋਂ ਇੱਕ ਨਿਸ਼ਚਿਤ ਦਿਨ-ਸਮਾਂ ਕ੍ਰਮ ਬਣਦਾ ਹੈ।", lines };
}

function localizeCaselet(language: Lp010LocalizedLanguage, english: Lp010Caselet): Lp010LocalizedCaselet {
  const profile = localizeProfile(language, english.labels);
  const clues = english.clues.map((clue) => localizeClue(language, clue, profile));
  const questionSetup = localizedSetup(language, profile);
  const children = english.children.map((child): Lp010LocalizedChild => {
    const options = child.options.map((option) => localizeTextTokens(option, english.labels, profile));
    const answer = options[child.correctIndex]!;
    const question = localizedQuestion(language, english, child, profile);
    const clueHeading = language === "hi" ? "शर्तें:" : "ਸ਼ਰਤਾਂ:";
    const stem = `${questionSetup}\n\n${clueHeading}\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${question}`;
    return { ...child, language, stem, options, answer, explanation: buildExplanation(language, profile, clues, answer) };
  });
  return { ...english, language, scenario: profile.scenario, questionSetup, labels: profile, clues, children, englishCaselet: english };
}

export function generateLp010LocalizedBatch(language: Lp010LocalizedLanguage, seed = "lp-010-localization-review-v1", count = 8): Lp010LocalizedCaselet[] {
  return generateLp010Batch(seed, count).map((caselet) => localizeCaselet(language, caselet));
}
