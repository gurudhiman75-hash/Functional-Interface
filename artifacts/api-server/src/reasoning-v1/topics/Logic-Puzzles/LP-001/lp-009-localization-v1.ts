import {
  generateLp009Batch,
  solveLp009,
  type Lp009Caselet,
  type Lp009Child,
  type Lp009Profile,
  type ScheduleAssignment,
  type ScheduleClue,
  type SchedulePerson,
  type ScheduleValue,
} from "./lp-009.ts";
import { LP_009_ENGLISH_FREEZE_V1 } from "./lp-009-permanent-freeze.ts";

export type Lp009LocalizedLanguage = "hi" | "pa";

export type Lp009LocalizedProfile = {
  id: string;
  mode: "MONTH" | "YEAR";
  scenario: string;
  personNoun: string;
  personPlural: string;
  recordNoun: string;
  valueHeader: string;
  values: Record<ScheduleValue, string>;
  people: Record<SchedulePerson, string>;
};

export type Lp009LocalizedChild = Omit<Lp009Child, "stem" | "options" | "answer" | "explanation"> & {
  language: Lp009LocalizedLanguage;
  stem: string;
  options: string[];
  answer: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp009LocalizedCaselet = Omit<Lp009Caselet, "scenario" | "questionSetup" | "labels" | "clues" | "children"> & {
  language: Lp009LocalizedLanguage;
  scenario: string;
  questionSetup: string;
  labels: Lp009LocalizedProfile;
  clues: readonly ScheduleClue[];
  children: readonly Lp009LocalizedChild[];
  englishCaselet: Lp009Caselet;
};

export const LP_009_HI_PA_LOCALIZATION_REVIEW_V1 = Object.freeze({
  authorityId: "LP_009_HI_PA_LOCALIZATION_REVIEW_V1" as const,
  sourceEnglishAuthorityId: LP_009_ENGLISH_FREEZE_V1.authorityId,
  packageId: "LP-009" as const,
  checkpointId: "LP-CP-009" as const,
  permanentQlIds: ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"] as const,
  supportedLanguages: ["hi", "pa"] as const,
  locales: ["hi-IN", "pa-IN"] as const,
  localizationMethod: "SEMANTIC_REBUILD_FROM_FROZEN_SOLVED_CASELET" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V1" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

const PEOPLE: readonly SchedulePerson[] = ["A", "B", "C", "D", "E", "F"];
const VALUES: readonly ScheduleValue[] = [0, 1, 2, 3, 4, 5];

const MONTHS = {
  hi: {
    January: "जनवरी", February: "फरवरी", March: "मार्च", April: "अप्रैल", May: "मई", June: "जून",
    July: "जुलाई", August: "अगस्त", September: "सितंबर", October: "अक्टूबर", November: "नवंबर", December: "दिसंबर",
  },
  pa: {
    January: "ਜਨਵਰੀ", February: "ਫ਼ਰਵਰੀ", March: "ਮਾਰਚ", April: "ਅਪ੍ਰੈਲ", May: "ਮਈ", June: "ਜੂਨ",
    July: "ਜੁਲਾਈ", August: "ਅਗਸਤ", September: "ਸਤੰਬਰ", October: "ਅਕਤੂਬਰ", November: "ਨਵੰਬਰ", December: "ਦਸੰਬਰ",
  },
} as const;

const NAMES = {
  hi: {
    Aarav: "आरव", Bhavna: "भावना", Chetan: "चेतन", Diya: "दिया", Eshan: "ईशान", Kavya: "काव्या", Manav: "मानव", Neha: "नेहा", Ritu: "रितु", Varun: "वरुण", Ishita: "इशिता", Mohan: "मोहन", Naina: "नैना", Parth: "पार्थ", Sonal: "सोनल", Tanya: "तान्या",
    Aditi: "अदिति", Bharat: "भारत", Charu: "चारु", Dev: "देव", Farah: "फराह", Gaurav: "गौरव", Meena: "मीना", Pooja: "पूजा", Rakesh: "राकेश", Sneha: "स्नेहा", Tanvi: "तन्वी", Yash: "यश", Ira: "इरा", Jatin: "जतिन", Mira: "मीरा", Nakul: "नकुल",
    Alok: "आलोक", Beena: "बीना", Dinesh: "दिनेश", Gopal: "गोपाल", Harini: "हरिनी", Irfan: "इरफान", Juhi: "जुही", Kartik: "कार्तिक", Leela: "लीला", Nitin: "नितिन", Rupa: "रूपा", Samar: "समर", Tara: "तारा", Vivek: "विवेक", Zubin: "जुबिन",
    Kamal: "कमल", Lata: "लता", Mohit: "मोहित", Nisha: "निशा", Omkar: "ओमकार", Priya: "प्रिया", Rahul: "राहुल", Simran: "सिमरन", Tarun: "तरुण", Zoya: "जोया", Arjun: "अर्जुन", Madhav: "माधव", Poonam: "पूनम", Ravi: "रवि", Seema: "सीमा",
  },
  pa: {
    Aarav: "ਆਰਵ", Bhavna: "ਭਾਵਨਾ", Chetan: "ਚੇਤਨ", Diya: "ਦੀਆ", Eshan: "ਈਸ਼ਾਨ", Kavya: "ਕਾਵਿਆ", Manav: "ਮਾਨਵ", Neha: "ਨੇਹਾ", Ritu: "ਰਿਤੂ", Varun: "ਵਰੁਣ", Ishita: "ਇਸ਼ਿਤਾ", Mohan: "ਮੋਹਨ", Naina: "ਨੈਨਾ", Parth: "ਪਾਰਥ", Sonal: "ਸੋਨਲ", Tanya: "ਤਾਨਿਆ",
    Aditi: "ਅਦਿਤੀ", Bharat: "ਭਰਤ", Charu: "ਚਾਰੂ", Dev: "ਦੇਵ", Farah: "ਫਰਾਹ", Gaurav: "ਗੌਰਵ", Meena: "ਮੀਨਾ", Pooja: "ਪੂਜਾ", Rakesh: "ਰਾਕੇਸ਼", Sneha: "ਸਨੇਹਾ", Tanvi: "ਤਨਵੀ", Yash: "ਯਸ਼", Ira: "ਇਰਾ", Jatin: "ਜਤਿਨ", Mira: "ਮੀਰਾ", Nakul: "ਨਕੁਲ",
    Alok: "ਆਲੋਕ", Beena: "ਬੀਨਾ", Dinesh: "ਦਿਨੇਸ਼", Gopal: "ਗੋਪਾਲ", Harini: "ਹਰੀਨੀ", Irfan: "ਇਰਫਾਨ", Juhi: "ਜੂਹੀ", Kartik: "ਕਾਰਤਿਕ", Leela: "ਲੀਲਾ", Nitin: "ਨਿਤਿਨ", Rupa: "ਰੂਪਾ", Samar: "ਸਮਰ", Tara: "ਤਾਰਾ", Vivek: "ਵਿਵੇਕ", Zubin: "ਜ਼ੁਬਿਨ",
    Kamal: "ਕਮਲ", Lata: "ਲਤਾ", Mohit: "ਮੋਹਿਤ", Nisha: "ਨਿਸ਼ਾ", Omkar: "ਓਮਕਾਰ", Priya: "ਪ੍ਰਿਆ", Rahul: "ਰਾਹੁਲ", Simran: "ਸਿਮਰਨ", Tarun: "ਤਰੁਣ", Zoya: "ਜ਼ੋਇਆ", Arjun: "ਅਰਜੁਨ", Madhav: "ਮਾਧਵ", Poonam: "ਪੂਨਮ", Ravi: "ਰਵੀ", Seema: "ਸੀਮਾ",
  },
} as const;

type ProfileCopy = {
  scenarioHi: string;
  scenarioPa: string;
  personHi: string;
  personPluralHi: string;
  personPa: string;
  personPluralPa: string;
  recordHi: string;
  recordPa: string;
  headerHi: string;
  headerPa: string;
  dateHi?: string;
  datePa?: string;
};

const PROFILE_COPY: Record<string, ProfileCopy> = {
  BIRTH_MONTH_REGISTER: { scenarioHi: "छह विद्यार्थियों के जन्म-महीनों की जानकारी दी गई है।", scenarioPa: "ਛੇ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਜਨਮ ਮਹੀਨਿਆਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।", personHi: "विद्यार्थी", personPluralHi: "विद्यार्थी", personPa: "ਵਿਦਿਆਰਥੀ", personPluralPa: "ਵਿਦਿਆਰਥੀ", recordHi: "जन्म महीना", recordPa: "ਜਨਮ ਮਹੀਨਾ", headerHi: "जन्म महीना", headerPa: "ਜਨਮ ਮਹੀਨਾ" },
  INTERVIEW_MONTH_REGISTER: { scenarioHi: "छह उम्मीदवारों के इंटरव्यू-महीनों की जानकारी दी गई है।", scenarioPa: "ਛੇ ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੰਟਰਵਿਊ ਮਹੀਨਿਆਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।", personHi: "उम्मीदवार", personPluralHi: "उम्मीदवार", personPa: "ਉਮੀਦਵਾਰ", personPluralPa: "ਉਮੀਦਵਾਰ", recordHi: "इंटरव्यू का महीना", recordPa: "ਇੰਟਰਵਿਊ ਦਾ ਮਹੀਨਾ", headerHi: "इंटरव्यू महीना", headerPa: "ਇੰਟਰਵਿਊ ਮਹੀਨਾ" },
  COURSE_START_MONTHS: { scenarioHi: "छह कोर्स के शुरू होने वाले महीनों की जानकारी दी गई है।", scenarioPa: "ਛੇ ਕੋਰਸਾਂ ਦੇ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੇ ਮਹੀਨਿਆਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।", personHi: "कोर्स", personPluralHi: "कोर्स", personPa: "ਕੋਰਸ", personPluralPa: "ਕੋਰਸ", recordHi: "शुरू होने का महीना", recordPa: "ਸ਼ੁਰੂ ਹੋਣ ਦਾ ਮਹੀਨਾ", headerHi: "शुरुआती महीना", headerPa: "ਸ਼ੁਰੂਆਤੀ ਮਹੀਨਾ" },
  REVIEW_MEETING_MONTHS: { scenarioHi: "छह अधिकारियों की समीक्षा-बैठकों के महीनों की जानकारी दी गई है।", scenarioPa: "ਛੇ ਅਧਿਕਾਰੀਆਂ ਦੀਆਂ ਸਮੀਖਿਆ ਮੀਟਿੰਗਾਂ ਦੇ ਮਹੀਨਿਆਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।", personHi: "अधिकारी", personPluralHi: "अधिकारी", personPa: "ਅਧਿਕਾਰੀ", personPluralPa: "ਅਧਿਕਾਰੀ", recordHi: "समीक्षा बैठक का महीना", recordPa: "ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਦਾ ਮਹੀਨਾ", headerHi: "समीक्षा बैठक का महीना", headerPa: "ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਦਾ ਮਹੀਨਾ" },
  BIRTH_YEAR_REGISTER: { scenarioHi: "छह व्यक्तियों के जन्म-वर्षों की जानकारी दी गई है।", scenarioPa: "ਛੇ ਵਿਅਕਤੀਆਂ ਦੇ ਜਨਮ ਸਾਲਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।", personHi: "व्यक्ति", personPluralHi: "व्यक्ति", personPa: "ਵਿਅਕਤੀ", personPluralPa: "ਵਿਅਕਤੀ", recordHi: "जन्म वर्ष", recordPa: "ਜਨਮ ਸਾਲ", headerHi: "जन्म वर्ष", headerPa: "ਜਨਮ ਸਾਲ", dateHi: "15 जून", datePa: "15 ਜੂਨ" },
  SERVICE_BIRTH_YEARS: { scenarioHi: "छह अधिकारियों के जन्म-वर्षों की जानकारी दी गई है।", scenarioPa: "ਛੇ ਅਧਿਕਾਰੀਆਂ ਦੇ ਜਨਮ ਸਾਲਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।", personHi: "अधिकारी", personPluralHi: "अधिकारी", personPa: "ਅਧਿਕਾਰੀ", personPluralPa: "ਅਧਿਕਾਰੀ", recordHi: "जन्म वर्ष", recordPa: "ਜਨਮ ਸਾਲ", headerHi: "जन्म वर्ष", headerPa: "ਜਨਮ ਸਾਲ", dateHi: "12 मार्च", datePa: "12 ਮਾਰਚ" },
  ARCHIVE_BIRTH_YEARS: { scenarioHi: "छह शोधकर्ताओं के जन्म-वर्षों की जानकारी दी गई है।", scenarioPa: "ਛੇ ਖੋਜਕਰਤਿਆਂ ਦੇ ਜਨਮ ਸਾਲਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।", personHi: "शोधकर्ता", personPluralHi: "शोधकर्ता", personPa: "ਖੋਜਕਰਤਾ", personPluralPa: "ਖੋਜਕਰਤਾ", recordHi: "जन्म वर्ष", recordPa: "ਜਨਮ ਸਾਲ", headerHi: "जन्म वर्ष", headerPa: "ਜਨਮ ਸਾਲ", dateHi: "21 सितंबर", datePa: "21 ਸਤੰਬਰ" },
  CLUB_BIRTH_YEARS: { scenarioHi: "छह सदस्यों के जन्म-वर्षों की जानकारी दी गई है।", scenarioPa: "ਛੇ ਮੈਂਬਰਾਂ ਦੇ ਜਨਮ ਸਾਲਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।", personHi: "सदस्य", personPluralHi: "सदस्य", personPa: "ਮੈਂਬਰ", personPluralPa: "ਮੈਂਬਰ", recordHi: "जन्म वर्ष", recordPa: "ਜਨਮ ਸਾਲ", headerHi: "जन्म वर्ष", headerPa: "ਜਨਮ ਸਾਲ", dateHi: "8 दिसंबर", datePa: "8 ਦਸੰਬਰ" },
};

function translateName(language: Lp009LocalizedLanguage, value: string): string {
  return (NAMES[language] as Record<string, string>)[value] ?? value;
}

function translateValue(language: Lp009LocalizedLanguage, profile: Lp009Profile, value: ScheduleValue): string {
  const raw = profile.values[value];
  if (profile.mode === "YEAR") return raw;
  return (MONTHS[language] as Record<string, string>)[raw] ?? raw;
}

function listText(language: Lp009LocalizedLanguage, values: readonly string[]): string {
  if (values.length <= 1) return values.join("");
  const joiner = language === "hi" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${joiner}${values[values.length - 1]}`;
}

function localizeProfile(language: Lp009LocalizedLanguage, profile: Lp009Profile): Lp009LocalizedProfile {
  const copy = PROFILE_COPY[profile.id];
  if (!copy) throw new Error(`Missing LP-009 localization profile copy for ${profile.id}`);
  const people = Object.fromEntries(PEOPLE.map((person) => [person, translateName(language, profile.people[person])])) as Record<SchedulePerson, string>;
  const values = Object.fromEntries(VALUES.map((value) => [value, translateValue(language, profile, value)])) as Record<ScheduleValue, string>;
  return {
    id: profile.id,
    mode: profile.mode,
    scenario: language === "hi" ? copy.scenarioHi : copy.scenarioPa,
    personNoun: language === "hi" ? copy.personHi : copy.personPa,
    personPlural: language === "hi" ? copy.personPluralHi : copy.personPluralPa,
    recordNoun: language === "hi" ? copy.recordHi : copy.recordPa,
    valueHeader: language === "hi" ? copy.headerHi : copy.headerPa,
    values,
    people,
  };
}

function buildSetup(language: Lp009LocalizedLanguage, profile: Lp009Profile, localized: Lp009LocalizedProfile): string {
  const people = listText(language, PEOPLE.map((person) => localized.people[person]));
  const values = listText(language, VALUES.map((value) => localized.values[value]));
  const copy = PROFILE_COPY[profile.id]!;
  if (profile.mode === "YEAR") {
    if (language === "hi") return `${localized.scenario} ${localized.personPlural}—${people}—सभी ${copy.dateHi} को जन्मे थे, लेकिन अलग-अलग वर्षों में: ${values}। वर्ष सबसे पहले से सबसे बाद के क्रम में दिए गए हैं। इस प्रश्न में सबसे पहले वर्ष वाला ${localized.personNoun} सबसे अधिक आयु का और सबसे बाद के वर्ष वाला सबसे कम आयु का माना जाएगा; आयु की गणना नहीं करनी है।`;
    return `${localized.scenario} ${localized.personPlural}—${people}—ਸਾਰੇ ${copy.datePa} ਨੂੰ ਜਨਮੇ ਸਨ, ਪਰ ਵੱਖ-ਵੱਖ ਸਾਲਾਂ ਵਿੱਚ: ${values}। ਸਾਲ ਸਭ ਤੋਂ ਪਹਿਲੇ ਤੋਂ ਸਭ ਤੋਂ ਆਖ਼ਰੀ ਕ੍ਰਮ ਵਿੱਚ ਦਿੱਤੇ ਗਏ ਹਨ। ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਸਭ ਤੋਂ ਪਹਿਲੇ ਸਾਲ ਵਾਲਾ ${localized.personNoun} ਸਭ ਤੋਂ ਵੱਧ ਉਮਰ ਵਾਲਾ ਅਤੇ ਸਭ ਤੋਂ ਆਖ਼ਰੀ ਸਾਲ ਵਾਲਾ ਸਭ ਤੋਂ ਘੱਟ ਉਮਰ ਵਾਲਾ ਮੰਨਿਆ ਜਾਵੇਗਾ; ਉਮਰ ਦੀ ਗਿਣਤੀ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।`;
  }
  if (language === "hi") {
    if (profile.id === "BIRTH_MONTH_REGISTER") return `${localized.scenario} ${localized.personPlural}—${people}—एक ही वर्ष के अलग-अलग छह महीनों में जन्मे थे: ${values}। हर महीना केवल एक ${localized.personNoun} से जुड़ा है और महीने कैलेंडर क्रम में दिए गए हैं।`;
    if (profile.id === "INTERVIEW_MONTH_REGISTER") return `${localized.scenario} ${localized.personPlural}—${people}—के इंटरव्यू अलग-अलग छह महीनों में हुए: ${values}। हर महीना केवल एक ${localized.personNoun} से जुड़ा है और महीने कैलेंडर क्रम में दिए गए हैं।`;
    if (profile.id === "COURSE_START_MONTHS") return `${localized.scenario} ${localized.personPlural}—${people}—अलग-अलग छह महीनों में शुरू हुए: ${values}। हर महीना केवल एक ${localized.personNoun} से जुड़ा है और महीने कैलेंडर क्रम में दिए गए हैं।`;
    return `${localized.scenario} ${localized.personPlural}—${people}—ने अलग-अलग छह महीनों में समीक्षा बैठकों में भाग लिया: ${values}। हर महीना केवल एक ${localized.personNoun} से जुड़ा है और महीने कैलेंडर क्रम में दिए गए हैं।`;
  }
  if (profile.id === "BIRTH_MONTH_REGISTER") return `${localized.scenario} ${localized.personPlural}—${people}—ਇੱਕੋ ਸਾਲ ਦੇ ਵੱਖ-ਵੱਖ ਛੇ ਮਹੀਨਿਆਂ ਵਿੱਚ ਜਨਮੇ ਸਨ: ${values}। ਹਰ ਮਹੀਨਾ ਕੇਵਲ ਇੱਕ ${localized.personNoun} ਨਾਲ ਜੁੜਿਆ ਹੈ ਅਤੇ ਮਹੀਨੇ ਕੈਲੰਡਰ ਕ੍ਰਮ ਵਿੱਚ ਦਿੱਤੇ ਗਏ ਹਨ।`;
  if (profile.id === "INTERVIEW_MONTH_REGISTER") return `${localized.scenario} ${localized.personPlural}—${people}—ਦੇ ਇੰਟਰਵਿਊ ਵੱਖ-ਵੱਖ ਛੇ ਮਹੀਨਿਆਂ ਵਿੱਚ ਹੋਏ: ${values}। ਹਰ ਮਹੀਨਾ ਕੇਵਲ ਇੱਕ ${localized.personNoun} ਨਾਲ ਜੁੜਿਆ ਹੈ ਅਤੇ ਮਹੀਨੇ ਕੈਲੰਡਰ ਕ੍ਰਮ ਵਿੱਚ ਦਿੱਤੇ ਗਏ ਹਨ।`;
  if (profile.id === "COURSE_START_MONTHS") return `${localized.scenario} ${localized.personPlural}—${people}—ਵੱਖ-ਵੱਖ ਛੇ ਮਹੀਨਿਆਂ ਵਿੱਚ ਸ਼ੁਰੂ ਹੋਏ: ${values}। ਹਰ ਮਹੀਨਾ ਕੇਵਲ ਇੱਕ ${localized.personNoun} ਨਾਲ ਜੁੜਿਆ ਹੈ ਅਤੇ ਮਹੀਨੇ ਕੈਲੰਡਰ ਕ੍ਰਮ ਵਿੱਚ ਦਿੱਤੇ ਗਏ ਹਨ।`;
  return `${localized.scenario} ${localized.personPlural}—${people}—ਨੇ ਵੱਖ-ਵੱਖ ਛੇ ਮਹੀਨਿਆਂ ਵਿੱਚ ਸਮੀਖਿਆ ਮੀਟਿੰਗਾਂ ਵਿੱਚ ਹਿੱਸਾ ਲਿਆ: ${values}। ਹਰ ਮਹੀਨਾ ਕੇਵਲ ਇੱਕ ${localized.personNoun} ਨਾਲ ਜੁੜਿਆ ਹੈ ਅਤੇ ਮਹੀਨੇ ਕੈਲੰਡਰ ਕ੍ਰਮ ਵਿੱਚ ਦਿੱਤੇ ਗਏ ਹਨ।`;
}

function countText(language: Lp009LocalizedLanguage, count: number): string {
  if (count !== 1) return String(count);
  return language === "hi" ? "एक" : "ਇੱਕ";
}

function localizeClue(language: Lp009LocalizedLanguage, clue: ScheduleClue, profile: Lp009LocalizedProfile): ScheduleClue {
  const p = (person: SchedulePerson) => profile.people[person];
  const v = (value: ScheduleValue) => profile.values[value];
  let text: string;
  if (profile.mode === "YEAR") {
    if (language === "hi") {
      if (clue.kind === "PERSON_VALUE") text = `${p(clue.person)} का जन्म ${v(clue.value)} में हुआ था।`;
      else if (clue.kind === "BEFORE") text = `${p(clue.left)} का जन्म ${p(clue.right)} से पहले हुआ था।`;
      else if (clue.kind === "BETWEEN") text = `जन्म-वर्षों के क्रम में ${p(clue.left)} और ${p(clue.right)} के बीच ठीक ${countText(language, clue.count)} ${clue.count === 1 ? "व्यक्ति है" : "व्यक्ति हैं"}।`;
      else if (clue.kind === "ADJACENT") text = `दिए गए जन्म-वर्षों के क्रम में ${p(clue.left)} और ${p(clue.right)} लगातार स्थानों पर हैं; दोनों में से कोई भी पहले हो सकता है।`;
      else if (clue.kind === "NOT_VALUE") text = `${p(clue.person)} का जन्म ${v(clue.value)} में नहीं हुआ था।`;
      else text = `दिए गए क्रम में ${p(clue.person)} दूसरा सबसे अधिक आयु वाला ${profile.personNoun} है।`;
    } else {
      if (clue.kind === "PERSON_VALUE") text = `${p(clue.person)} ਦਾ ਜਨਮ ${v(clue.value)} ਵਿੱਚ ਹੋਇਆ ਸੀ।`;
      else if (clue.kind === "BEFORE") text = `${p(clue.left)} ਦਾ ਜਨਮ ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਹੋਇਆ ਸੀ।`;
      else if (clue.kind === "BETWEEN") text = `ਜਨਮ-ਸਾਲਾਂ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${countText(language, clue.count)} ${clue.count === 1 ? "ਵਿਅਕਤੀ ਹੈ" : "ਵਿਅਕਤੀ ਹਨ"}।`;
      else if (clue.kind === "ADJACENT") text = `ਦਿੱਤੇ ਜਨਮ-ਸਾਲਾਂ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ${p(clue.left)} ਅਤੇ ${p(clue.right)} ਲਗਾਤਾਰ ਥਾਵਾਂ 'ਤੇ ਹਨ; ਦੋਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਪਹਿਲਾਂ ਹੋ ਸਕਦਾ ਹੈ।`;
      else if (clue.kind === "NOT_VALUE") text = `${p(clue.person)} ਦਾ ਜਨਮ ${v(clue.value)} ਵਿੱਚ ਨਹੀਂ ਹੋਇਆ ਸੀ।`;
      else text = `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${p(clue.person)} ਦੂਜਾ ਸਭ ਤੋਂ ਵੱਧ ਉਮਰ ਵਾਲਾ ${profile.personNoun} ਹੈ।`;
    }
  } else if (language === "hi") {
    if (clue.kind === "PERSON_VALUE") text = `${p(clue.person)} का ${profile.recordNoun} ${v(clue.value)} है।`;
    else if (clue.kind === "BEFORE") text = `${p(clue.left)} का ${profile.recordNoun}, ${p(clue.right)} के ${profile.recordNoun} से पहले है।`;
    else if (clue.kind === "BETWEEN") text = `दिए गए क्रम में ${p(clue.left)} और ${p(clue.right)} के बीच ठीक ${countText(language, clue.count)} ${clue.count === 1 ? "नाम आता है" : "नाम आते हैं"}।`;
    else if (clue.kind === "ADJACENT") text = `दिए गए क्रम में ${p(clue.left)} और ${p(clue.right)} लगातार स्थानों पर हैं; दोनों में से कोई भी पहले हो सकता है।`;
    else if (clue.kind === "NOT_VALUE") text = `${p(clue.person)} का ${profile.recordNoun} ${v(clue.value)} नहीं है।`;
    else text = `${p(clue.person)} दूसरे स्थान पर है।`;
  } else {
    if (clue.kind === "PERSON_VALUE") text = `${p(clue.person)} ਦਾ ${profile.recordNoun} ${v(clue.value)} ਹੈ।`;
    else if (clue.kind === "BEFORE") text = `${p(clue.left)} ਦਾ ${profile.recordNoun}, ${p(clue.right)} ਦੇ ${profile.recordNoun} ਤੋਂ ਪਹਿਲਾਂ ਹੈ।`;
    else if (clue.kind === "BETWEEN") text = `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${countText(language, clue.count)} ${clue.count === 1 ? "ਨਾਂ ਆਉਂਦਾ ਹੈ" : "ਨਾਂ ਆਉਂਦੇ ਹਨ"}।`;
    else if (clue.kind === "ADJACENT") text = `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${p(clue.left)} ਅਤੇ ${p(clue.right)} ਲਗਾਤਾਰ ਥਾਵਾਂ 'ਤੇ ਹਨ; ਦੋਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਪਹਿਲਾਂ ਹੋ ਸਕਦਾ ਹੈ।`;
    else if (clue.kind === "NOT_VALUE") text = `${p(clue.person)} ਦਾ ${profile.recordNoun} ${v(clue.value)} ਨਹੀਂ ਹੈ।`;
    else text = `${p(clue.person)} ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਹੈ।`;
  }
  return { ...clue, text } as ScheduleClue;
}

type PartialTable = { values: Partial<Record<SchedulePerson, ScheduleValue>>; candidates: Partial<Record<SchedulePerson, readonly ScheduleValue[]>> };

function directTable(clues: readonly ScheduleClue[]): PartialTable {
  const table: PartialTable = { values: {}, candidates: {} };
  for (const clue of clues) if (clue.kind === "PERSON_VALUE") table.values[clue.person] = clue.value;
  return table;
}

function forcedTable(solutions: readonly ScheduleAssignment[], direct: PartialTable): PartialTable {
  const table: PartialTable = { values: { ...direct.values }, candidates: { ...direct.candidates } };
  for (const person of PEOPLE) {
    if (table.values[person] !== undefined) continue;
    const possible = [...new Set(solutions.map((solution) => solution[person]))] as ScheduleValue[];
    if (possible.length === 1) table.values[person] = possible[0]!;
    else table.candidates[person] = possible.sort((left, right) => left - right);
  }
  return table;
}

function tableMarkdown(profile: Lp009LocalizedProfile, table: PartialTable): string {
  const rows = PEOPLE.map((person) => {
    const value = table.values[person];
    const candidates = table.candidates[person];
    const valueText = value !== undefined ? profile.values[value] : candidates ? candidates.map((candidate) => profile.values[candidate]).join(" / ") : "—";
    return `| ${profile.people[person]} | ${valueText} |`;
  }).join("\n");
  return `| ${profile.personNoun} | ${profile.valueHeader} |\n|---|---|\n${rows}`;
}

function effectText(language: Lp009LocalizedLanguage, before: number, after: number): string {
  if (language === "hi") return after < before ? `इससे संभावित व्यवस्थाएँ ${before} से घटकर ${after} रह जाती हैं।` : "यह शर्त पहले से भरी जानकारी के साथ मेल खाती है; तालिका को आगे बढ़ाएँ।";
  return after < before ? `ਇਸ ਨਾਲ ਸੰਭਾਵਿਤ ਵਿਵਸਥਾਵਾਂ ${before} ਤੋਂ ਘਟ ਕੇ ${after} ਰਹਿ ਜਾਂਦੀਆਂ ਹਨ।` : "ਇਹ ਸ਼ਰਤ ਪਹਿਲਾਂ ਭਰੀ ਜਾਣਕਾਰੀ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ; ਸਾਰਣੀ ਨੂੰ ਅੱਗੇ ਵਧਾਓ।";
}

function explanationLine(language: Lp009LocalizedLanguage, profile: Lp009LocalizedProfile, clue: ScheduleClue, before: number, after: number): string {
  const effect = effectText(language, before, after);
  const p = (person: SchedulePerson) => profile.people[person];
  if (language === "hi") {
    if (clue.kind === "BEFORE") return `शर्त के अनुसार ${p(clue.left)}, ${p(clue.right)} से पहले आता है। केवल वही क्रम रखें जिनमें यह बात सही हो। ${effect}`;
    if (clue.kind === "BETWEEN") return `${p(clue.left)} और ${p(clue.right)} के बीच ठीक ${countText(language, clue.count)} स्थान हैं। इसी दूरी वाले क्रम रखें। ${effect}`;
    if (clue.kind === "ADJACENT") return `${p(clue.left)} और ${p(clue.right)} लगातार स्थानों पर होने चाहिए। ${effect}`;
    if (clue.kind === "NOT_VALUE") return `${p(clue.person)} की पंक्ति से ${profile.values[clue.value]} हटा दें। ${effect}`;
    if (clue.kind === "POSITION") return `${p(clue.person)} दूसरे सबसे अधिक आयु वाले स्थान पर तय है, यानी क्रम का दूसरा वर्ष। ${effect}`;
    return `${p(clue.person)} की सीधे दी गई जानकारी दर्ज करें। ${effect}`;
  }
  if (clue.kind === "BEFORE") return `ਸ਼ਰਤ ਅਨੁਸਾਰ ${p(clue.left)}, ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ। ਕੇਵਲ ਉਹੀ ਕ੍ਰਮ ਰੱਖੋ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਇਹ ਗੱਲ ਸਹੀ ਹੈ। ${effect}`;
  if (clue.kind === "BETWEEN") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${countText(language, clue.count)} ਥਾਂ ਹਨ। ਇਸੇ ਦੂਰੀ ਵਾਲੇ ਕ੍ਰਮ ਰੱਖੋ। ${effect}`;
  if (clue.kind === "ADJACENT") return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਲਗਾਤਾਰ ਥਾਵਾਂ 'ਤੇ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ। ${effect}`;
  if (clue.kind === "NOT_VALUE") return `${p(clue.person)} ਦੀ ਕਤਾਰ ਵਿੱਚੋਂ ${profile.values[clue.value]} ਹਟਾ ਦਿਓ। ${effect}`;
  if (clue.kind === "POSITION") return `${p(clue.person)} ਦੂਜੇ ਸਭ ਤੋਂ ਵੱਧ ਉਮਰ ਵਾਲੇ ਸਥਾਨ 'ਤੇ ਨਿਸ਼ਚਿਤ ਹੈ, ਅਰਥਾਤ ਕ੍ਰਮ ਦਾ ਦੂਜਾ ਸਾਲ। ${effect}`;
  return `${p(clue.person)} ਦੀ ਸਿੱਧੀ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦਰਜ ਕਰੋ। ${effect}`;
}

function questionTail(stem: string): string { return stem.split("\n\n").at(-1) ?? stem; }

function targetPeopleFromTail(profile: Lp009Profile, tail: string): SchedulePerson[] {
  return PEOPLE.filter((person) => tail.includes(profile.people[person])).sort((a, b) => tail.indexOf(profile.people[a]) - tail.indexOf(profile.people[b]));
}

function targetValueFromTail(profile: Lp009Profile, tail: string): ScheduleValue | undefined {
  return VALUES.find((value) => tail.includes(profile.values[value]));
}

function questionFor(language: Lp009LocalizedLanguage, base: Lp009Caselet, child: Lp009Child, profile: Lp009LocalizedProfile): string {
  const tail = questionTail(child.stem);
  const people = targetPeopleFromTail(base.labels, tail);
  const targetValue = targetValueFromTail(base.labels, tail);
  const first = people[0];
  const second = people[1];
  const p = (person: SchedulePerson) => profile.people[person];
  if (language === "hi") {
    if (child.qlId === "LP-QL-033") {
      const value = profile.values[targetValue!];
      if (base.scenarioProfileId === "BIRTH_MONTH_REGISTER") return `${value} में किसका जन्म हुआ था?`;
      if (base.scenarioProfileId === "INTERVIEW_MONTH_REGISTER") return `${value} में किस उम्मीदवार का इंटरव्यू हुआ था?`;
      if (base.scenarioProfileId === "COURSE_START_MONTHS") return `${value} में कौन-सा कोर्स शुरू हुआ था?`;
      if (base.scenarioProfileId === "REVIEW_MEETING_MONTHS") return `${value} में किस अधिकारी ने समीक्षा बैठक में भाग लिया था?`;
      return `${value} में किसका जन्म हुआ था?`;
    }
    if (child.qlId === "LP-QL-034") return base.mode === "YEAR" ? `${p(first!)} का जन्म किस वर्ष हुआ था?` : `${p(first!)} का ${profile.recordNoun} कौन-सा महीना है?`;
    if (child.qlId === "LP-QL-035") return `निम्न में से कौन-सा विकल्प क्रमशः ${p(first!)} और ${p(second!)} के ${profile.recordNoun} सही बताता है?`;
    if (base.mode === "YEAR") return `दूसरा सबसे अधिक आयु वाला ${profile.personNoun} कौन है?`;
    return `दिए गए महीनों के क्रम में ${p(first!)} के ${profile.recordNoun} के ठीक बाद वाले महीने से कौन जुड़ा है?`;
  }
  if (child.qlId === "LP-QL-033") {
    const value = profile.values[targetValue!];
    if (base.scenarioProfileId === "BIRTH_MONTH_REGISTER") return `${value} ਵਿੱਚ ਕਿਸ ਦਾ ਜਨਮ ਹੋਇਆ ਸੀ?`;
    if (base.scenarioProfileId === "INTERVIEW_MONTH_REGISTER") return `${value} ਵਿੱਚ ਕਿਸ ਉਮੀਦਵਾਰ ਦਾ ਇੰਟਰਵਿਊ ਹੋਇਆ ਸੀ?`;
    if (base.scenarioProfileId === "COURSE_START_MONTHS") return `${value} ਵਿੱਚ ਕਿਹੜਾ ਕੋਰਸ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ?`;
    if (base.scenarioProfileId === "REVIEW_MEETING_MONTHS") return `${value} ਵਿੱਚ ਕਿਸ ਅਧਿਕਾਰੀ ਨੇ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਵਿੱਚ ਹਿੱਸਾ ਲਿਆ ਸੀ?`;
    return `${value} ਵਿੱਚ ਕਿਸ ਦਾ ਜਨਮ ਹੋਇਆ ਸੀ?`;
  }
  if (child.qlId === "LP-QL-034") return base.mode === "YEAR" ? `${p(first!)} ਦਾ ਜਨਮ ਕਿਸ ਸਾਲ ਹੋਇਆ ਸੀ?` : `${p(first!)} ਦਾ ${profile.recordNoun} ਕਿਹੜਾ ਮਹੀਨਾ ਹੈ?`;
  if (child.qlId === "LP-QL-035") return `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਕ੍ਰਮਵਾਰ ${p(first!)} ਅਤੇ ${p(second!)} ਦੇ ${profile.recordNoun} ਸਹੀ ਦੱਸਦਾ ਹੈ?`;
  if (base.mode === "YEAR") return `ਦੂਜਾ ਸਭ ਤੋਂ ਵੱਧ ਉਮਰ ਵਾਲਾ ${profile.personNoun} ਕੌਣ ਹੈ?`;
  return `ਦਿੱਤੇ ਮਹੀਨਿਆਂ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ${p(first!)} ਦੇ ${profile.recordNoun} ਤੋਂ ਠੀਕ ਅਗਲੇ ਮਹੀਨੇ ਨਾਲ ਕੌਣ ਜੁੜਿਆ ਹੈ?`;
}

function localizePairOption(language: Lp009LocalizedLanguage, option: string, base: Lp009Profile, profile: Lp009LocalizedProfile): string {
  const parts = option.split("; ");
  return parts.map((part) => {
    const [rawName, rawValue] = part.split(" — ");
    const person = PEOPLE.find((candidate) => base.people[candidate] === rawName);
    const value = VALUES.find((candidate) => base.values[candidate] === rawValue);
    if (!person || value === undefined) throw new Error(`Unable to parse LP-009 pair option: ${option}`);
    return `${profile.people[person]} — ${profile.values[value]}`;
  }).join("; ");
}

function localizeOptions(language: Lp009LocalizedLanguage, child: Lp009Child, base: Lp009Profile, profile: Lp009LocalizedProfile): string[] {
  if (child.qlId === "LP-QL-033" || child.qlId === "LP-QL-036") return child.options.map((option) => translateName(language, option));
  if (child.qlId === "LP-QL-034") return child.options.map((option) => {
    const value = VALUES.find((candidate) => base.values[candidate] === option);
    return value === undefined ? option : profile.values[value];
  });
  return child.options.map((option) => localizePairOption(language, option, base, profile));
}

function conclusionFor(language: Lp009LocalizedLanguage, base: Lp009Caselet, child: Lp009Child, profile: Lp009LocalizedProfile, localizedAnswer: string): string {
  const tail = questionTail(child.stem);
  const people = targetPeopleFromTail(base.labels, tail);
  const targetValue = targetValueFromTail(base.labels, tail);
  if (language === "hi") {
    if (child.qlId === "LP-QL-033") return `${profile.values[targetValue!]} के साथ ${localizedAnswer} जुड़ा है। इसलिए सही उत्तर ${localizedAnswer} है।`;
    if (child.qlId === "LP-QL-034") return `${profile.people[people[0]!]} के साथ ${localizedAnswer} जुड़ा है। इसलिए सही उत्तर ${localizedAnswer} है।`;
    if (child.qlId === "LP-QL-035") return `पूर्ण तालिका में दोनों दी गई प्रविष्टियाँ ${localizedAnswer} से मेल खाती हैं। इसलिए यही सही उत्तर है।`;
    if (base.mode === "YEAR") return `${localizedAnswer} दूसरे सबसे अधिक आयु वाले स्थान पर है। इसलिए सही उत्तर ${localizedAnswer} है।`;
    return `पूर्ण क्रम में पूछे गए महीने के ठीक बाद ${localizedAnswer} आता है। इसलिए सही उत्तर ${localizedAnswer} है।`;
  }
  if (child.qlId === "LP-QL-033") return `${profile.values[targetValue!]} ਨਾਲ ${localizedAnswer} ਜੁੜਿਆ ਹੈ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${localizedAnswer} ਹੈ।`;
  if (child.qlId === "LP-QL-034") return `${profile.people[people[0]!]} ਨਾਲ ${localizedAnswer} ਜੁੜਿਆ ਹੈ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${localizedAnswer} ਹੈ।`;
  if (child.qlId === "LP-QL-035") return `ਪੂਰੀ ਸਾਰਣੀ ਵਿੱਚ ਦੋਵੇਂ ਦਿੱਤੀਆਂ ਐਂਟਰੀਆਂ ${localizedAnswer} ਨਾਲ ਮੇਲ ਖਾਂਦੀਆਂ ਹਨ। ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਉੱਤਰ ਹੈ।`;
  if (base.mode === "YEAR") return `${localizedAnswer} ਦੂਜੇ ਸਭ ਤੋਂ ਵੱਧ ਉਮਰ ਵਾਲੇ ਸਥਾਨ 'ਤੇ ਹੈ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${localizedAnswer} ਹੈ।`;
  return `ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਪੁੱਛੇ ਗਏ ਮਹੀਨੇ ਤੋਂ ਠੀਕ ਬਾਅਦ ${localizedAnswer} ਆਉਂਦਾ ਹੈ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${localizedAnswer} ਹੈ।`;
}

function buildExplanation(language: Lp009LocalizedLanguage, base: Lp009Caselet, child: Lp009Child, profile: Lp009LocalizedProfile, localizedAnswer: string): { summary: string; lines: string[] } {
  const direct = directTable(base.clues);
  const lines: string[] = [];
  const add = (title: string, detail: string, table: PartialTable) => lines.push(`**${title}**\n\n${detail}\n\n${tableMarkdown(profile, table)}`);
  const directClues = base.clues.filter((clue) => clue.kind === "PERSON_VALUE");
  if (language === "hi") add("चरण 1: सीधे दी गई जानकारियाँ भरें", directClues.length ? "जो महीना या वर्ष सीधे दिया गया है, उसे तालिका में भरें। बाकी स्थान अभी खुले रखें।" : "कोई महीना या वर्ष सीधे नहीं दिया गया है। क्रम और निषेध वाली शर्तों से शुरू करें।", direct);
  else add("ਪੜਾਅ 1: ਸਿੱਧੀ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਭਰੋ", directClues.length ? "ਜੋ ਮਹੀਨਾ ਜਾਂ ਸਾਲ ਸਿੱਧਾ ਦਿੱਤਾ ਗਿਆ ਹੈ, ਉਸ ਨੂੰ ਸਾਰਣੀ ਵਿੱਚ ਭਰੋ। ਬਾਕੀ ਥਾਵਾਂ ਹਾਲੇ ਖੁੱਲ੍ਹੀਆਂ ਰੱਖੋ।" : "ਕੋਈ ਮਹੀਨਾ ਜਾਂ ਸਾਲ ਸਿੱਧਾ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ। ਕ੍ਰਮ ਅਤੇ ਮਨਾਹੀ ਵਾਲੀਆਂ ਸ਼ਰਤਾਂ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।", direct);

  let active: ScheduleClue[] = [...directClues];
  let solutions = solveLp009({ clues: active });
  let step = 2;
  for (const clue of base.clues.filter((candidate) => candidate.kind !== "PERSON_VALUE")) {
    const before = solutions.length;
    active = [...active, clue];
    solutions = solveLp009({ clues: active });
    add(language === "hi" ? `चरण ${step}: अगली शर्त लागू करें` : `ਪੜਾਅ ${step}: ਅਗਲੀ ਸ਼ਰਤ ਲਾਗੂ ਕਰੋ`, explanationLine(language, profile, clue, before, solutions.length), forcedTable(solutions, direct));
    step += 1;
  }
  const finalTable = forcedTable(solveLp009({ clues: base.clues }), direct);
  const conclusion = conclusionFor(language, base, child, profile, localizedAnswer);
  add(language === "hi" ? `चरण ${step}: पूरी व्यवस्था भरें` : `ਪੜਾਅ ${step}: ਪੂਰੀ ਵਿਵਸਥਾ ਭਰੋ`, language === "hi" ? `सभी शर्तों को लागू करने पर केवल एक व्यवस्था बचती है। एक-से-एक नियम से बाकी स्थान भरें। ${conclusion}` : `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਲਾਗੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਕੇਵਲ ਇੱਕ ਵਿਵਸਥਾ ਬਚਦੀ ਹੈ। ਇੱਕ-ਤੋਂ-ਇੱਕ ਨਿਯਮ ਨਾਲ ਬਾਕੀ ਥਾਵਾਂ ਭਰੋ। ${conclusion}`, finalTable);
  return { summary: language === "hi" ? `शर्तों से ${profile.recordNoun} की केवल एक पूर्ण व्यवस्था बनती है।` : `ਸ਼ਰਤਾਂ ਤੋਂ ${profile.recordNoun} ਦੀ ਕੇਵਲ ਇੱਕ ਪੂਰੀ ਵਿਵਸਥਾ ਬਣਦੀ ਹੈ।`, lines };
}

function localizeCaselet(language: Lp009LocalizedLanguage, base: Lp009Caselet): Lp009LocalizedCaselet {
  const profile = localizeProfile(language, base.labels);
  const setup = buildSetup(language, base.labels, profile);
  const clues = base.clues.map((clue) => localizeClue(language, clue, profile));
  const children = base.children.map((child) => {
    const question = questionFor(language, base, child, profile);
    const options = localizeOptions(language, child, base.labels, profile);
    const answer = options[child.correctIndex]!;
    const stem = `${setup}\n\n${language === "hi" ? "शर्तें:" : "ਸ਼ਰਤਾਂ:"}\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${question}`;
    return { ...child, language, stem, options, answer, explanation: buildExplanation(language, base, child, profile, answer) };
  });
  return { ...base, language, scenario: profile.scenario, questionSetup: setup, labels: profile, clues, children, englishCaselet: base };
}

export function generateLp009LocalizedBatch(language: Lp009LocalizedLanguage, seed = "lp-009-localization-review", count = 8): Lp009LocalizedCaselet[] {
  return generateLp009Batch(seed, count).map((caselet) => localizeCaselet(language, caselet));
}
