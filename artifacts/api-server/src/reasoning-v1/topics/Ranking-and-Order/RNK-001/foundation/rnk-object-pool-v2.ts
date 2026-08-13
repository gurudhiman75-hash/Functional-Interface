export type RnkObjectLocale = "en" | "hi" | "pa";
export type RnkPersonGender = "M" | "F";
export type RnkPersonRegionTag = "PAN_INDIA" | "PUNJAB_COMPATIBLE";

export interface RnkPersonObject {
  readonly id: string;
  readonly gender: RnkPersonGender;
  readonly names: Readonly<Record<RnkObjectLocale, string>>;
  readonly regionTags: readonly RnkPersonRegionTag[];
}

export type RnkRankingDomain =
  | "GENERIC_RANK"
  | "SCORES"
  | "HEIGHT"
  | "SPEED"
  | "SENIORITY"
  | "PERFORMANCE";

export interface RnkGroupObject {
  readonly id: string;
  readonly labels: Readonly<Record<RnkObjectLocale, string>>;
}

export interface RnkSettingObject {
  readonly id: string;
  readonly domain: RnkRankingDomain;
  readonly labels: Readonly<Record<RnkObjectLocale, string>>;
  readonly compatibleGroupIds: readonly string[];
}

export interface RnkDomainLexicon {
  readonly domain: RnkRankingDomain;
  readonly higher: Readonly<Record<RnkObjectLocale, string>>;
  readonly lower: Readonly<Record<RnkObjectLocale, string>>;
  readonly equal: Readonly<Record<RnkObjectLocale, string>>;
  readonly highest: Readonly<Record<RnkObjectLocale, string>>;
  readonly lowest: Readonly<Record<RnkObjectLocale, string>>;
  readonly orderHighToLow: Readonly<Record<RnkObjectLocale, string>>;
}

function localized(en: string, hi: string, pa: string): Readonly<Record<RnkObjectLocale, string>> {
  return {
    en: en.normalize("NFC"),
    hi: hi.normalize("NFC"),
    pa: pa.normalize("NFC"),
  };
}

function person(
  id: string,
  gender: RnkPersonGender,
  en: string,
  hi: string,
  pa: string,
  regionTags: readonly RnkPersonRegionTag[] = ["PAN_INDIA", "PUNJAB_COMPATIBLE"],
): RnkPersonObject {
  return { id, gender, names: localized(en, hi, pa), regionTags };
}

/**
 * Future-facing RNK person pool.
 *
 * IMPORTANT: frozen CP001..CP006 runtimes intentionally keep their historical
 * local pools so their pinned projections cannot drift. New discovery/runtime
 * versions may opt in to this registry explicitly.
 */
export const RNK_PERSON_POOL_V2: readonly RnkPersonObject[] = [
  person("aarav", "M", "Aarav", "आरव", "ਆਰਵ"),
  person("aditya", "M", "Aditya", "आदित्य", "ਆਦਿਤਿਆ"),
  person("akash", "M", "Akash", "आकाश", "ਆਕਾਸ਼"),
  person("aman", "M", "Aman", "अमन", "ਅਮਨ"),
  person("amit", "M", "Amit", "अमित", "ਅਮਿਤ"),
  person("ankit", "M", "Ankit", "अंकित", "ਅੰਕਿਤ"),
  person("arjun", "M", "Arjun", "अर्जुन", "ਅਰਜੁਨ"),
  person("arnav", "M", "Arnav", "अर्णव", "ਅਰਨਵ"),
  person("ayush", "M", "Ayush", "आयुष", "ਆਯੁਸ਼"),
  person("bharat", "M", "Bharat", "भरत", "ਭਰਤ"),
  person("charan", "M", "Charan", "चरण", "ਚਰਨ"),
  person("deepak", "M", "Deepak", "दीपक", "ਦੀਪਕ"),
  person("dev", "M", "Dev", "देव", "ਦੇਵ"),
  person("gagan", "M", "Gagan", "गगन", "ਗਗਨ"),
  person("gautam", "M", "Gautam", "गौतम", "ਗੌਤਮ"),
  person("gurpreet", "M", "Gurpreet", "गुरप्रीत", "ਗੁਰਪ੍ਰੀਤ"),
  person("harjit", "M", "Harjit", "हरजीत", "ਹਰਜੀਤ"),
  person("harsh", "M", "Harsh", "हर्ष", "ਹਰਸ਼"),
  person("ishaan", "M", "Ishaan", "ईशान", "ਈਸ਼ਾਨ"),
  person("jai", "M", "Jai", "जय", "ਜੈ"),
  person("karan", "M", "Karan", "करण", "ਕਰਨ"),
  person("kunal", "M", "Kunal", "कुणाल", "ਕੁਣਾਲ"),
  person("lakshya", "M", "Lakshya", "लक्ष्य", "ਲਕਸ਼"),
  person("manav", "M", "Manav", "मानव", "ਮਾਨਵ"),
  person("mohit", "M", "Mohit", "मोहित", "ਮੋਹਿਤ"),
  person("nakul", "M", "Nakul", "नकुल", "ਨਕੁਲ"),
  person("naman", "M", "Naman", "नमन", "ਨਮਨ"),
  person("navdeep", "M", "Navdeep", "नवदीप", "ਨਵਦੀਪ"),
  person("nikhil", "M", "Nikhil", "निखिल", "ਨਿਖਿਲ"),
  person("nitin", "M", "Nitin", "नितिन", "ਨਿਤਿਨ"),
  person("pranav", "M", "Pranav", "प्रणव", "ਪ੍ਰਣਵ"),
  person("rahul", "M", "Rahul", "राहुल", "ਰਾਹੁਲ"),
  person("rajat", "M", "Rajat", "रजत", "ਰਜਤ"),
  person("rakesh", "M", "Rakesh", "राकेश", "ਰਾਕੇਸ਼"),
  person("rohan", "M", "Rohan", "रोहन", "ਰੋਹਨ"),
  person("rohit", "M", "Rohit", "रोहित", "ਰੋਹਿਤ"),
  person("sahil", "M", "Sahil", "साहिल", "ਸਾਹਿਲ"),
  person("sameer", "M", "Sameer", "समीर", "ਸਮੀਰ"),
  person("sandeep", "M", "Sandeep", "संदीप", "ਸੰਦੀਪ"),
  person("shivam", "M", "Shivam", "शिवम", "ਸ਼ਿਵਮ"),
  person("siddharth", "M", "Siddharth", "सिद्धार्थ", "ਸਿੱਧਾਰਥ"),
  person("taran", "M", "Taran", "तरन", "ਤਰਨ"),
  person("uday", "M", "Uday", "उदय", "ਉਦੈ"),
  person("varun", "M", "Varun", "वरुण", "ਵਰੁਣ"),
  person("vikram", "M", "Vikram", "विक्रम", "ਵਿਕਰਮ"),
  person("vikas", "M", "Vikas", "विकास", "ਵਿਕਾਸ"),
  person("yash", "M", "Yash", "यश", "ਯਸ਼"),
  person("zorawar", "M", "Zorawar", "जोरावर", "ਜ਼ੋਰਾਵਰ"),

  person("aanya", "F", "Aanya", "आन्या", "ਆਨਿਆ"),
  person("aarti", "F", "Aarti", "आरती", "ਆਰਤੀ"),
  person("aisha", "F", "Aisha", "आयशा", "ਆਇਸ਼ਾ"),
  person("akanksha", "F", "Akanksha", "आकांक्षा", "ਆਕਾਂਕਸ਼ਾ"),
  person("ananya", "F", "Ananya", "अनन्या", "ਅਨਨਿਆ"),
  person("anjali", "F", "Anjali", "अंजलि", "ਅੰਜਲੀ"),
  person("asha", "F", "Asha", "आशा", "ਆਸ਼ਾ"),
  person("bhavna", "F", "Bhavna", "भावना", "ਭਾਵਨਾ"),
  person("deepika", "F", "Deepika", "दीपिका", "ਦੀਪਿਕਾ"),
  person("divya", "F", "Divya", "दिव्या", "ਦਿਵਿਆ"),
  person("esha", "F", "Esha", "एशा", "ਏਸ਼ਾ"),
  person("gauri", "F", "Gauri", "गौरी", "ਗੌਰੀ"),
  person("gurleen", "F", "Gurleen", "गुरलीन", "ਗੁਰਲੀਨ"),
  person("harleen", "F", "Harleen", "हरलीन", "ਹਰਲੀਨ"),
  person("isha", "F", "Isha", "ईशा", "ਈਸ਼ਾ"),
  person("jasleen", "F", "Jasleen", "जसलीन", "ਜਸਲੀਨ"),
  person("jaspreet", "F", "Jaspreet", "जसप्रीत", "ਜਸਪ੍ਰੀਤ"),
  person("kavita", "F", "Kavita", "कविता", "ਕਵਿਤਾ"),
  person("kavya", "F", "Kavya", "काव्या", "ਕਾਵਿਆ"),
  person("khushi", "F", "Khushi", "खुशी", "ਖੁਸ਼ੀ"),
  person("kriti", "F", "Kriti", "कृति", "ਕ੍ਰਿਤੀ"),
  person("mahi", "F", "Mahi", "माही", "ਮਾਹੀ"),
  person("mehak", "F", "Mehak", "महक", "ਮਹਿਕ"),
  person("meera", "F", "Meera", "मीरा", "ਮੀਰਾ"),
  person("muskan", "F", "Muskan", "मुस्कान", "ਮੁਸਕਾਨ"),
  person("navjot", "F", "Navjot", "नवजोत", "ਨਵਜੋਤ"),
  person("neha", "F", "Neha", "नेहा", "ਨੇਹਾ"),
  person("nisha", "F", "Nisha", "निशा", "ਨਿਸ਼ਾ"),
  person("palak", "F", "Palak", "पलक", "ਪਲਕ"),
  person("pooja", "F", "Pooja", "पूजा", "ਪੂਜਾ"),
  person("prerna", "F", "Prerna", "प्रेरणा", "ਪ੍ਰੇਰਣਾ"),
  person("priya", "F", "Priya", "प्रिया", "ਪ੍ਰਿਆ"),
  person("radhika", "F", "Radhika", "राधिका", "ਰਾਧਿਕਾ"),
  person("riya", "F", "Riya", "रिया", "ਰੀਆ"),
  person("ritu", "F", "Ritu", "रितु", "ਰਿਤੂ"),
  person("sakshi", "F", "Sakshi", "साक्षी", "ਸਾਕਸ਼ੀ"),
  person("seema", "F", "Seema", "सीमा", "ਸੀਮਾ"),
  person("shreya", "F", "Shreya", "श्रेया", "ਸ਼੍ਰੇਆ"),
  person("simran", "F", "Simran", "सिमरन", "ਸਿਮਰਨ"),
  person("sneha", "F", "Sneha", "स्नेहा", "ਸਨੇਹਾ"),
  person("sonia", "F", "Sonia", "सोनिया", "ਸੋਨੀਆ"),
  person("tanya", "F", "Tanya", "तान्या", "ਤਾਨਿਆ"),
  person("tanvi", "F", "Tanvi", "तन्वी", "ਤਨਵੀ"),
  person("tisha", "F", "Tisha", "तिशा", "ਤਿਸ਼ਾ"),
  person("trisha", "F", "Trisha", "त्रिशा", "ਤ੍ਰਿਸ਼ਾ"),
  person("vaishnavi", "F", "Vaishnavi", "वैष्णवी", "ਵੈਸ਼ਨਵੀ"),
  person("vidhi", "F", "Vidhi", "विधि", "ਵਿਧੀ"),
  person("zara", "F", "Zara", "ज़ारा", "ਜ਼ਾਰਾ"),
] as const;

export const RNK_GROUP_OBJECTS_V2: readonly RnkGroupObject[] = [
  { id: "candidates", labels: localized("candidates", "अभ्यर्थी", "ਉਮੀਦਵਾਰ") },
  { id: "students", labels: localized("students", "विद्यार्थी", "ਵਿਦਿਆਰਥੀ") },
  { id: "applicants", labels: localized("applicants", "आवेदक", "ਅਰਜ਼ੀਦਾਰ") },
  { id: "trainees", labels: localized("trainees", "प्रशिक्षु", "ਸਿਖਿਆਰਥੀ") },
  { id: "interviewees", labels: localized("interview candidates", "साक्षात्कार अभ्यर्थी", "ਇੰਟਰਵਿਊ ਉਮੀਦਵਾਰ") },
  { id: "runners", labels: localized("runners", "धावक", "ਦੌੜਾਕ") },
  { id: "participants", labels: localized("participants", "प्रतिभागी", "ਭਾਗੀਦਾਰ") },
  { id: "employees", labels: localized("employees", "कर्मचारी", "ਕਰਮਚਾਰੀ") },
  { id: "sales_executives", labels: localized("sales executives", "बिक्री अधिकारी", "ਵਿਕਰੀ ਅਧਿਕਾਰੀ") },
  { id: "officers", labels: localized("officers", "अधिकारी", "ਅਧਿਕਾਰੀ") },
  { id: "contestants", labels: localized("contestants", "प्रतियोगी", "ਪ੍ਰਤੀਯੋਗੀ") },
  { id: "recruits", labels: localized("recruits", "नव-भर्ती अभ्यर्थी", "ਨਵੇਂ ਭਰਤੀ ਉਮੀਦਵਾਰ") },
  { id: "interns", labels: localized("interns", "प्रशिक्षु कर्मचारी", "ਇੰਟਰਨ") },
  { id: "scholars", labels: localized("scholarship applicants", "छात्रवृत्ति आवेदक", "ਵਜ਼ੀਫ਼ਾ ਅਰਜ਼ੀਦਾਰ") },
  { id: "representatives", labels: localized("representatives", "प्रतिनिधि", "ਨੁਮਾਇੰਦੇ") },
  { id: "analysts", labels: localized("analysts", "विश्लेषक", "ਵਿਸ਼ਲੇਸ਼ਕ") },
  { id: "associates", labels: localized("associates", "सहयोगी", "ਸਹਿਯੋਗੀ") },
  { id: "examinees", labels: localized("examinees", "परीक्षार्थी", "ਪਰੀਖਿਆਰਥੀ") },
  { id: "qualifiers", labels: localized("qualifiers", "योग्य अभ्यर्थी", "ਯੋਗ ਉਮੀਦਵਾਰ") },
  { id: "team_members", labels: localized("team members", "टीम सदस्य", "ਟੀਮ ਮੈਂਬਰ") },
] as const;

export const RNK_SETTING_OBJECTS_V2: readonly RnkSettingObject[] = [
  { id: "merit_list", domain: "GENERIC_RANK", labels: localized("merit list", "मेरिट सूची", "ਮੈਰਿਟ ਸੂਚੀ"), compatibleGroupIds: ["candidates", "students", "applicants", "examinees"] },
  { id: "class_ranking", domain: "GENERIC_RANK", labels: localized("class ranking", "कक्षा रैंकिंग", "ਕਲਾਸ ਰੈਂਕਿੰਗ"), compatibleGroupIds: ["students", "examinees"] },
  { id: "selection_list", domain: "GENERIC_RANK", labels: localized("selection list", "चयन सूची", "ਚੋਣ ਸੂਚੀ"), compatibleGroupIds: ["candidates", "applicants", "qualifiers"] },
  { id: "recruitment_list", domain: "GENERIC_RANK", labels: localized("recruitment list", "भर्ती सूची", "ਭਰਤੀ ਸੂਚੀ"), compatibleGroupIds: ["applicants", "recruits", "candidates"] },
  { id: "interview_shortlist", domain: "GENERIC_RANK", labels: localized("interview shortlist", "साक्षात्कार शॉर्टलिस्ट", "ਇੰਟਰਵਿਊ ਸ਼ਾਰਟਲਿਸਟ"), compatibleGroupIds: ["interviewees", "applicants", "candidates"] },
  { id: "qualifying_list", domain: "GENERIC_RANK", labels: localized("qualifying list", "योग्यता सूची", "ਯੋਗਤਾ ਸੂਚੀ"), compatibleGroupIds: ["qualifiers", "candidates", "examinees"] },
  { id: "scholarship_merit", domain: "GENERIC_RANK", labels: localized("scholarship merit list", "छात्रवृत्ति मेरिट सूची", "ਵਜ਼ੀਫ਼ਾ ਮੈਰਿਟ ਸੂਚੀ"), compatibleGroupIds: ["scholars", "students"] },
  { id: "exam_scores", domain: "SCORES", labels: localized("exam score ranking", "परीक्षा अंक रैंकिंग", "ਪਰੀਖਿਆ ਅੰਕ ਰੈਂਕਿੰਗ"), compatibleGroupIds: ["students", "candidates", "examinees"] },
  { id: "mock_scores", domain: "SCORES", labels: localized("mock-test score ranking", "मॉक-टेस्ट अंक रैंकिंग", "ਮੌਕ-ਟੈਸਟ ਅੰਕ ਰੈਂਕਿੰਗ"), compatibleGroupIds: ["students", "candidates", "examinees"] },
  { id: "training_assessment", domain: "SCORES", labels: localized("training assessment", "प्रशिक्षण मूल्यांकन", "ਟ੍ਰੇਨਿੰਗ ਮੁਲਾਂਕਣ"), compatibleGroupIds: ["trainees", "recruits", "employees"] },
  { id: "height_comparison", domain: "HEIGHT", labels: localized("height comparison", "ऊँचाई तुलना", "ਕੱਦ ਦੀ ਤੁਲਨਾ"), compatibleGroupIds: ["students", "candidates", "participants"] },
  { id: "race_finish", domain: "SPEED", labels: localized("race finishing order", "दौड़ समाप्ति क्रम", "ਦੌੜ ਸਮਾਪਤੀ ਕ੍ਰਮ"), compatibleGroupIds: ["runners", "participants", "contestants"] },
  { id: "time_trial", domain: "SPEED", labels: localized("time-trial ranking", "समय-परीक्षण रैंकिंग", "ਟਾਈਮ-ਟ੍ਰਾਇਲ ਰੈਂਕਿੰਗ"), compatibleGroupIds: ["runners", "participants", "contestants"] },
  { id: "seniority_list", domain: "SENIORITY", labels: localized("seniority list", "वरिष्ठता सूची", "ਸੀਨੀਅਰਟੀ ਸੂਚੀ"), compatibleGroupIds: ["employees", "officers", "associates"] },
  { id: "promotion_seniority", domain: "SENIORITY", labels: localized("promotion seniority list", "पदोन्नति वरिष्ठता सूची", "ਤਰੱਕੀ ਸੀਨੀਅਰਟੀ ਸੂਚੀ"), compatibleGroupIds: ["employees", "officers"] },
  { id: "performance_review", domain: "PERFORMANCE", labels: localized("performance review", "प्रदर्शन समीक्षा", "ਕਾਰਗੁਜ਼ਾਰੀ ਸਮੀਖਿਆ"), compatibleGroupIds: ["employees", "associates", "analysts", "team_members"] },
  { id: "sales_performance", domain: "PERFORMANCE", labels: localized("sales performance ranking", "बिक्री प्रदर्शन रैंकिंग", "ਵਿਕਰੀ ਕਾਰਗੁਜ਼ਾਰੀ ਰੈਂਕਿੰਗ"), compatibleGroupIds: ["sales_executives", "employees"] },
  { id: "project_assessment", domain: "PERFORMANCE", labels: localized("project assessment ranking", "परियोजना मूल्यांकन रैंकिंग", "ਪ੍ਰੋਜੈਕਟ ਮੁਲਾਂਕਣ ਰੈਂਕਿੰਗ"), compatibleGroupIds: ["team_members", "analysts", "associates"] },
] as const;

export const RNK_DOMAIN_LEXICON_V2: readonly RnkDomainLexicon[] = [
  {
    domain: "GENERIC_RANK",
    higher: localized("ranks above", "से ऊपर रैंक करता/करती है", "ਤੋਂ ਉੱਪਰ ਰੈਂਕ ਕਰਦਾ/ਕਰਦੀ ਹੈ"),
    lower: localized("ranks below", "से नीचे रैंक करता/करती है", "ਤੋਂ ਹੇਠਾਂ ਰੈਂਕ ਕਰਦਾ/ਕਰਦੀ ਹੈ"),
    equal: localized("has the same rank as", "के समान रैंक पर है", "ਦੇ ਸਮਾਨ ਰੈਂਕ 'ਤੇ ਹੈ"),
    highest: localized("highest ranked", "सबसे ऊँची रैंक वाला", "ਸਭ ਤੋਂ ਉੱਚੇ ਰੈਂਕ ਵਾਲਾ"),
    lowest: localized("lowest ranked", "सबसे नीची रैंक वाला", "ਸਭ ਤੋਂ ਹੇਠਲੇ ਰੈਂਕ ਵਾਲਾ"),
    orderHighToLow: localized("from highest to lowest rank", "सबसे ऊँची से सबसे नीची रैंक तक", "ਸਭ ਤੋਂ ਉੱਚੇ ਤੋਂ ਸਭ ਤੋਂ ਹੇਠਲੇ ਰੈਂਕ ਤੱਕ"),
  },
  {
    domain: "SCORES",
    higher: localized("scored more marks than", "से अधिक अंक प्राप्त किए", "ਤੋਂ ਵੱਧ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ"),
    lower: localized("scored fewer marks than", "से कम अंक प्राप्त किए", "ਤੋਂ ਘੱਟ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ"),
    equal: localized("scored equal marks to", "के समान अंक प्राप्त किए", "ਦੇ ਬਰਾਬਰ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ"),
    highest: localized("highest scorer", "सबसे अधिक अंक पाने वाला", "ਸਭ ਤੋਂ ਵੱਧ ਅੰਕ ਲੈਣ ਵਾਲਾ"),
    lowest: localized("lowest scorer", "सबसे कम अंक पाने वाला", "ਸਭ ਤੋਂ ਘੱਟ ਅੰਕ ਲੈਣ ਵਾਲਾ"),
    orderHighToLow: localized("from highest to lowest score", "सबसे अधिक से सबसे कम अंक तक", "ਸਭ ਤੋਂ ਵੱਧ ਤੋਂ ਸਭ ਤੋਂ ਘੱਟ ਅੰਕ ਤੱਕ"),
  },
  {
    domain: "HEIGHT",
    higher: localized("is taller than", "से लंबा/लंबी है", "ਤੋਂ ਲੰਮਾ/ਲੰਮੀ ਹੈ"),
    lower: localized("is shorter than", "से छोटा/छोटी है", "ਤੋਂ ਛੋਟਾ/ਛੋਟੀ ਹੈ"),
    equal: localized("is as tall as", "के बराबर लंबा/लंबी है", "ਦੇ ਬਰਾਬਰ ਲੰਮਾ/ਲੰਮੀ ਹੈ"),
    highest: localized("tallest", "सबसे लंबा/लंबी", "ਸਭ ਤੋਂ ਲੰਮਾ/ਲੰਮੀ"),
    lowest: localized("shortest", "सबसे छोटा/छोटी", "ਸਭ ਤੋਂ ਛੋਟਾ/ਛੋਟੀ"),
    orderHighToLow: localized("from tallest to shortest", "सबसे लंबे से सबसे छोटे तक", "ਸਭ ਤੋਂ ਲੰਮੇ ਤੋਂ ਸਭ ਤੋਂ ਛੋਟੇ ਤੱਕ"),
  },
  {
    domain: "SPEED",
    higher: localized("finished before", "से पहले समाप्त किया", "ਤੋਂ ਪਹਿਲਾਂ ਸਮਾਪਤ ਕੀਤਾ"),
    lower: localized("finished after", "के बाद समाप्त किया", "ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਕੀਤਾ"),
    equal: localized("finished in the same time as", "के समान समय में समाप्त किया", "ਦੇ ਬਰਾਬਰ ਸਮੇਂ ਵਿੱਚ ਸਮਾਪਤ ਕੀਤਾ"),
    highest: localized("fastest", "सबसे तेज", "ਸਭ ਤੋਂ ਤੇਜ਼"),
    lowest: localized("slowest", "सबसे धीमा", "ਸਭ ਤੋਂ ਹੌਲਾ"),
    orderHighToLow: localized("from fastest to slowest", "सबसे तेज से सबसे धीमे तक", "ਸਭ ਤੋਂ ਤੇਜ਼ ਤੋਂ ਸਭ ਤੋਂ ਹੌਲੇ ਤੱਕ"),
  },
  {
    domain: "SENIORITY",
    higher: localized("is senior to", "से वरिष्ठ है", "ਤੋਂ ਸੀਨੀਅਰ ਹੈ"),
    lower: localized("is junior to", "से कनिष्ठ है", "ਤੋਂ ਜੂਨੀਅਰ ਹੈ"),
    equal: localized("is at the same seniority level as", "के समान वरिष्ठता स्तर पर है", "ਦੇ ਸਮਾਨ ਸੀਨੀਅਰਟੀ ਪੱਧਰ 'ਤੇ ਹੈ"),
    highest: localized("most senior", "सबसे वरिष्ठ", "ਸਭ ਤੋਂ ਸੀਨੀਅਰ"),
    lowest: localized("most junior", "सबसे कनिष्ठ", "ਸਭ ਤੋਂ ਜੂਨੀਅਰ"),
    orderHighToLow: localized("from most senior to most junior", "सबसे वरिष्ठ से सबसे कनिष्ठ तक", "ਸਭ ਤੋਂ ਸੀਨੀਅਰ ਤੋਂ ਸਭ ਤੋਂ ਜੂਨੀਅਰ ਤੱਕ"),
  },
  {
    domain: "PERFORMANCE",
    higher: localized("performed better than", "से बेहतर प्रदर्शन किया", "ਤੋਂ ਵਧੀਆ ਪ੍ਰਦਰਸ਼ਨ ਕੀਤਾ"),
    lower: localized("performed worse than", "से कमजोर प्रदर्शन किया", "ਤੋਂ ਕਮਜ਼ੋਰ ਪ੍ਰਦਰਸ਼ਨ ਕੀਤਾ"),
    equal: localized("was placed at the same performance level as", "के समान प्रदर्शन स्तर पर रखा गया", "ਦੇ ਸਮਾਨ ਕਾਰਗੁਜ਼ਾਰੀ ਪੱਧਰ 'ਤੇ ਰੱਖਿਆ ਗਿਆ"),
    highest: localized("best performer", "सर्वश्रेष्ठ प्रदर्शनकर्ता", "ਸਭ ਤੋਂ ਵਧੀਆ ਪ੍ਰਦਰਸ਼ਨਕਰਤਾ"),
    lowest: localized("lowest performer", "सबसे कम प्रदर्शन वाला", "ਸਭ ਤੋਂ ਘੱਟ ਪ੍ਰਦਰਸ਼ਨ ਵਾਲਾ"),
    orderHighToLow: localized("from best to lowest performance", "सर्वश्रेष्ठ से सबसे कम प्रदर्शन तक", "ਸਭ ਤੋਂ ਵਧੀਆ ਤੋਂ ਸਭ ਤੋਂ ਘੱਟ ਕਾਰਗੁਜ਼ਾਰੀ ਤੱਕ"),
  },
] as const;

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function seededRandom(seed: number, salt: number): () => number {
  let state = mix32((seed >>> 0) ^ salt);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(values: readonly T[], seed: number, salt: number): T[] {
  const output = [...values];
  const random = seededRandom(seed, salt);
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [output[i], output[j]] = [output[j]!, output[i]!];
  }
  return output;
}

export interface SelectRnkPeopleOptions {
  readonly genderMode?: "ANY" | "BALANCED";
  readonly regionTag?: RnkPersonRegionTag;
}

export function selectRnkPeople(
  seed: number,
  count: number,
  options: SelectRnkPeopleOptions = {},
): readonly RnkPersonObject[] {
  if (!Number.isInteger(seed)) throw new Error(`RNK object-pool seed must be an integer: ${seed}`);
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`RNK person count must be a positive integer: ${count}`);
  }

  const regionTag = options.regionTag;
  const eligible = regionTag
    ? RNK_PERSON_POOL_V2.filter((entry) => entry.regionTags.includes(regionTag))
    : RNK_PERSON_POOL_V2;
  if (count > eligible.length) {
    throw new Error(`Requested ${count} RNK people from a pool of ${eligible.length}.`);
  }

  if ((options.genderMode ?? "ANY") === "ANY") {
    return shuffled(eligible, seed, 0x524e4b32).slice(0, count);
  }

  const male = shuffled(eligible.filter((entry) => entry.gender === "M"), seed, 0x4d414c45);
  const female = shuffled(eligible.filter((entry) => entry.gender === "F"), seed, 0x46454d41);
  const firstGender: RnkPersonGender = mix32(seed) % 2 === 0 ? "M" : "F";
  const result: RnkPersonObject[] = [];
  let maleIndex = 0;
  let femaleIndex = 0;

  for (let index = 0; index < count; index += 1) {
    const desired: RnkPersonGender = index % 2 === 0
      ? firstGender
      : firstGender === "M" ? "F" : "M";
    if (desired === "M" && maleIndex < male.length) result.push(male[maleIndex++]!);
    else if (desired === "F" && femaleIndex < female.length) result.push(female[femaleIndex++]!);
    else if (maleIndex < male.length) result.push(male[maleIndex++]!);
    else if (femaleIndex < female.length) result.push(female[femaleIndex++]!);
    else throw new Error("RNK balanced selector exhausted eligible people unexpectedly.");
  }
  return result;
}

export function selectRnkSetting(seed: number, domain?: RnkRankingDomain): RnkSettingObject {
  const eligible = domain
    ? RNK_SETTING_OBJECTS_V2.filter((entry) => entry.domain === domain)
    : RNK_SETTING_OBJECTS_V2;
  if (eligible.length === 0) throw new Error(`No RNK setting objects exist for domain ${domain}.`);
  return shuffled(eligible, seed, 0x53455454)[0]!;
}

export function selectCompatibleRnkGroup(seed: number, setting: RnkSettingObject): RnkGroupObject {
  const allowed = new Set(setting.compatibleGroupIds);
  const eligible = RNK_GROUP_OBJECTS_V2.filter((entry) => allowed.has(entry.id));
  if (eligible.length === 0) throw new Error(`Setting ${setting.id} has no compatible RNK group objects.`);
  return shuffled(eligible, seed, 0x47524f55)[0]!;
}

export function rnkDomainLexicon(domain: RnkRankingDomain): RnkDomainLexicon {
  const found = RNK_DOMAIN_LEXICON_V2.find((entry) => entry.domain === domain);
  if (!found) throw new Error(`Missing RNK domain lexicon for ${domain}.`);
  return found;
}
