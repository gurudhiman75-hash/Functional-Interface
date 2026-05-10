import type { RealizerLanguage } from "../types";

export type EntityGender = "M" | "F" | "N";

export type PersonEntity = {
  id: string;
  display: Record<RealizerLanguage, string>;
  gender: EntityGender;
  localeBias: string[];
  aliases?: string[];
};

const nfc = <T extends string>(value: T) =>
  value.normalize("NFC") as T;

export const PEOPLE: PersonEntity[] = [
  {
    id: "aman",
    display: { en: "Aman", hi: "अमन", pa: "ਅਮਨ" },
    gender: "M",
    localeBias: ["north-india", "punjab"],
  },
  {
    id: "bhavna",
    display: { en: "Bhavna", hi: "भावना", pa: "ਭਾਵਨਾ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "charu",
    display: { en: "Charu", hi: "चारु", pa: "ਚਾਰੂ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "deepak",
    display: { en: "Deepak", hi: "दीपक", pa: "ਦੀਪਕ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "esha",
    display: { en: "Esha", hi: "ईशा", pa: "ਈਸ਼ਾ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "farhan",
    display: { en: "Farhan", hi: "फ़रहान", pa: "ਫਰਹਾਨ" },
    gender: "M",
    localeBias: ["pan-india"],
  },
  {
    id: "gauri",
    display: { en: "Gauri", hi: "गौरी", pa: "ਗੌਰੀ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "harish",
    display: { en: "Harish", hi: "हरीश", pa: "ਹਰੀਸ਼" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "isha",
    display: { en: "Isha", hi: "ईशा", pa: "ਈਸ਼ਾ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "jatin",
    display: { en: "Jatin", hi: "जतिन", pa: "ਜਤਿਨ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "kavya",
    display: { en: "Kavya", hi: "काव्या", pa: "ਕਾਵਿਆ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "lokesh",
    display: { en: "Lokesh", hi: "लोकेश", pa: "ਲੋਕੇਸ਼" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "megha",
    display: { en: "Megha", hi: "मेघा", pa: "ਮੇਘਾ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "nitin",
    display: { en: "Nitin", hi: "नितिन", pa: "ਨਿਤਿਨ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "pallavi",
    display: { en: "Pallavi", hi: "पल्लवी", pa: "ਪੱਲਵੀ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "rohit",
    display: { en: "Rohit", hi: "रोहित", pa: "ਰੋਹਿਤ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "rohan",
    display: { en: "Rohan", hi: "रोहन", pa: "ਰੋਹਨ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "rohini",
    display: { en: "Rohini", hi: "रोहिणी", pa: "ਰੋਹਿਣੀ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "sneha",
    display: { en: "Sneha", hi: "स्नेहा", pa: "ਸਨੇਹਾ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "tanvi",
    display: { en: "Tanvi", hi: "तन्वी", pa: "ਤਨਵੀ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "ujjwal",
    display: { en: "Ujjwal", hi: "उज्ज्वल", pa: "ਉੱਜਵਲ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "varsha",
    display: { en: "Varsha", hi: "वर्षा", pa: "ਵਰਸ਼ਾ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "yamini",
    display: { en: "Yamini", hi: "यामिनी", pa: "ਯਾਮਿਨੀ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "zubin",
    display: { en: "Zubin", hi: "ज़ुबिन", pa: "ਜ਼ੁਬਿਨ" },
    gender: "M",
    localeBias: ["pan-india"],
  },
  {
    id: "simran",
    display: { en: "Simran", hi: "सिमरन", pa: "ਸਿਮਰਨ" },
    gender: "F",
    localeBias: ["punjab", "north-india"],
  },
  {
    id: "gurpreet",
    display: { en: "Gurpreet", hi: "गुरप्रीत", pa: "ਗੁਰਪ੍ਰੀਤ" },
    gender: "N",
    localeBias: ["punjab"],
  },
  {
    id: "jasleen",
    display: { en: "Jasleen", hi: "जसलीन", pa: "ਜਸਲੀਨ" },
    gender: "F",
    localeBias: ["punjab"],
  },
  {
    id: "mandeep",
    display: { en: "Mandeep", hi: "मनदीप", pa: "ਮਨਦੀਪ" },
    gender: "N",
    localeBias: ["punjab"],
  },
  {
    id: "navjot",
    display: { en: "Navjot", hi: "नवजोत", pa: "ਨਵਜੋਤ" },
    gender: "N",
    localeBias: ["punjab"],
  },
  {
    id: "priya",
    display: { en: "Priya", hi: "प्रिया", pa: "ਪ੍ਰਿਆ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "rahul",
    display: { en: "Rahul", hi: "राहुल", pa: "ਰਾਹੁਲ" },
    gender: "M",
    localeBias: ["pan-india"],
  },
  {
    id: "neha",
    display: { en: "Neha", hi: "नेहा", pa: "ਨੇਹਾ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "arjun",
    display: { en: "Arjun", hi: "अर्जुन", pa: "ਅਰਜੁਨ" },
    gender: "M",
    localeBias: ["pan-india"],
  },
  {
    id: "ananya",
    display: { en: "Ananya", hi: "अनन्या", pa: "ਅਨਨਿਆ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "abhishek",
    display: { en: "Abhishek", hi: "अभिषेक", pa: "ਅਭਿਸ਼ੇਕ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "aditi",
    display: { en: "Aditi", hi: "अदिति", pa: "ਅਦਿਤੀ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "akshay",
    display: { en: "Akshay", hi: "अक्षय", pa: "ਅਕਸ਼ੈ" },
    gender: "M",
    localeBias: ["pan-india"],
  },
  {
    id: "amrita",
    display: { en: "Amrita", hi: "अमृता", pa: "ਅਮ੍ਰਿਤਾ" },
    gender: "F",
    localeBias: ["punjab", "pan-india"],
  },
  {
    id: "ankit",
    display: { en: "Ankit", hi: "अंकित", pa: "ਅੰਕਿਤ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "anjali",
    display: { en: "Anjali", hi: "अंजलि", pa: "ਅੰਜਲੀ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "ayush",
    display: { en: "Ayush", hi: "आयुष", pa: "ਆਯੁਸ਼" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "bharti",
    display: { en: "Bharti", hi: "भारती", pa: "ਭਾਰਤੀ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "chirag",
    display: { en: "Chirag", hi: "चिराग", pa: "ਚਿਰਾਗ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "divya",
    display: { en: "Divya", hi: "दिव्या", pa: "ਦਿਵਿਆ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "gagan",
    display: { en: "Gagan", hi: "गगन", pa: "ਗਗਨ" },
    gender: "M",
    localeBias: ["punjab", "north-india"],
  },
  {
    id: "harleen",
    display: { en: "Harleen", hi: "हरलीन", pa: "ਹਰਲੀਨ" },
    gender: "F",
    localeBias: ["punjab"],
  },
  {
    id: "inderjit",
    display: { en: "Inderjit", hi: "इंदरजीत", pa: "ਇੰਦਰਜੀਤ" },
    gender: "M",
    localeBias: ["punjab"],
  },
  {
    id: "jasmine",
    display: { en: "Jasmine", hi: "जैस्मिन", pa: "ਜੈਸਮੀਨ" },
    gender: "F",
    localeBias: ["punjab", "pan-india"],
  },
  {
    id: "karan",
    display: { en: "Karan", hi: "करण", pa: "ਕਰਨ" },
    gender: "M",
    localeBias: ["north-india", "punjab"],
  },
  {
    id: "kirandeep",
    display: { en: "Kirandeep", hi: "किरनदीप", pa: "ਕਿਰਨਦੀਪ" },
    gender: "N",
    localeBias: ["punjab"],
  },
  {
    id: "lakshay",
    display: { en: "Lakshay", hi: "लक्ष्य", pa: "ਲਕਸ਼ੈ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "lovepreet",
    display: { en: "Lovepreet", hi: "लवप्रीत", pa: "ਲਵਪ੍ਰੀਤ" },
    gender: "N",
    localeBias: ["punjab"],
  },
  {
    id: "manav",
    display: { en: "Manav", hi: "मानव", pa: "ਮਾਨਵ" },
    gender: "M",
    localeBias: ["pan-india"],
  },
  {
    id: "manisha",
    display: { en: "Manisha", hi: "मनीषा", pa: "ਮਨੀਸ਼ਾ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "mehak",
    display: { en: "Mehak", hi: "महक", pa: "ਮਹਿਕ" },
    gender: "F",
    localeBias: ["punjab", "north-india"],
  },
  {
    id: "mohit",
    display: { en: "Mohit", hi: "मोहित", pa: "ਮੋਹਿਤ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "muskan",
    display: { en: "Muskan", hi: "मुस्कान", pa: "ਮੁਸਕਾਨ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "naman",
    display: { en: "Naman", hi: "नमन", pa: "ਨਮਨ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "navdeep",
    display: { en: "Navdeep", hi: "नवदीप", pa: "ਨਵਦੀਪ" },
    gender: "N",
    localeBias: ["punjab"],
  },
  {
    id: "nisha",
    display: { en: "Nisha", hi: "निशा", pa: "ਨਿਸ਼ਾ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "parth",
    display: { en: "Parth", hi: "पार्थ", pa: "ਪਾਰਥ" },
    gender: "M",
    localeBias: ["pan-india"],
  },
  {
    id: "pooja",
    display: { en: "Pooja", hi: "पूजा", pa: "ਪੂਜਾ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "prabhjot",
    display: { en: "Prabhjot", hi: "प्रभजोत", pa: "ਪ੍ਰਭਜੋਤ" },
    gender: "N",
    localeBias: ["punjab"],
  },
  {
    id: "randeep",
    display: { en: "Randeep", hi: "रणदीप", pa: "ਰਣਦੀਪ" },
    gender: "M",
    localeBias: ["punjab", "north-india"],
  },
  {
    id: "ravi",
    display: { en: "Ravi", hi: "रवि", pa: "ਰਵੀ" },
    gender: "M",
    localeBias: ["pan-india"],
  },
  {
    id: "reena",
    display: { en: "Reena", hi: "रीना", pa: "ਰੀਨਾ" },
    gender: "F",
    localeBias: ["north-india"],
  },
  {
    id: "ritika",
    display: { en: "Ritika", hi: "ऋतिका", pa: "ਰਿਤਿਕਾ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "sahil",
    display: { en: "Sahil", hi: "साहिल", pa: "ਸਾਹਿਲ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "sandeep",
    display: { en: "Sandeep", hi: "संदीप", pa: "ਸੰਦੀਪ" },
    gender: "N",
    localeBias: ["punjab", "north-india"],
  },
  {
    id: "sanjana",
    display: { en: "Sanjana", hi: "संजना", pa: "ਸੰਜਨਾ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "sarthak",
    display: { en: "Sarthak", hi: "सार्थक", pa: "ਸਾਰਥਕ" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "shreya",
    display: { en: "Shreya", hi: "श्रेया", pa: "ਸ਼੍ਰੇਆ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "sukhman",
    display: { en: "Sukhman", hi: "सुखमन", pa: "ਸੁਖਮਨ" },
    gender: "N",
    localeBias: ["punjab"],
  },
  {
    id: "taran",
    display: { en: "Taran", hi: "तरण", pa: "ਤਰਨ" },
    gender: "N",
    localeBias: ["punjab"],
  },
  {
    id: "vansh",
    display: { en: "Vansh", hi: "वंश", pa: "ਵੰਸ਼" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "vidhi",
    display: { en: "Vidhi", hi: "विधि", pa: "ਵਿਧੀ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
  {
    id: "vikram",
    display: { en: "Vikram", hi: "विक्रम", pa: "ਵਿਕਰਮ" },
    gender: "M",
    localeBias: ["pan-india"],
  },
  {
    id: "yash",
    display: { en: "Yash", hi: "यश", pa: "ਯਸ਼" },
    gender: "M",
    localeBias: ["north-india"],
  },
  {
    id: "zoya",
    display: { en: "Zoya", hi: "ज़ोया", pa: "ਜ਼ੋਇਆ" },
    gender: "F",
    localeBias: ["pan-india"],
  },
].map((entity) => ({
  ...entity,
  display: {
    en: nfc(entity.display.en),
    hi: nfc(entity.display.hi),
    pa: nfc(entity.display.pa),
  },
}));

function normalizeLookup(value: unknown) {
  return String(value ?? "")
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/^node_/, "")
    .replace(/[^a-z0-9_\-\s\u0900-\u097F\u0A00-\u0A7F]/gu, "")
    .replace(/\s+/g, " ");
}

const PEOPLE_BY_KEY = new Map<string, PersonEntity>();

for (const entity of PEOPLE) {
  const keys = [
    entity.id,
    entity.display.en,
    entity.display.hi,
    entity.display.pa,
    ...(entity.aliases ?? []),
  ];

  for (const key of keys) {
    PEOPLE_BY_KEY.set(normalizeLookup(key), entity);
  }
}

export function getPersonEntity(
  value: unknown,
): PersonEntity | undefined {
  return PEOPLE_BY_KEY.get(normalizeLookup(value));
}

export function getPersonGender(
  value: unknown,
): EntityGender | undefined {
  return getPersonEntity(value)?.gender;
}

export function localizePersonName(
  value: unknown,
  language: RealizerLanguage,
) {
  return (
    getPersonEntity(value)?.display[language] ??
    String(value ?? "").trim()
  ).normalize("NFC");
}

export function localizeOptionText(
  value: string,
  language: RealizerLanguage,
) {
  return localizePersonName(value, language);
}
