import type { Sea001TranslatedLocale } from "./readiness.ts";

const NAME_PACK = Object.freeze({
  Aarav: ["आरव", "ਆਰਵ"],
  Aditi: ["अदिति", "ਅਦਿਤੀ"],
  Akash: ["आकाश", "ਆਕਾਸ਼"],
  Aman: ["अमन", "ਅਮਨ"],
  Amrit: ["अमृत", "ਅੰਮ੍ਰਿਤ"],
  Ananya: ["अनन्या", "ਅਨਨਿਆ"],
  Anmol: ["अनमोल", "ਅਨਮੋਲ"],
  Arjun: ["अर्जुन", "ਅਰਜੁਨ"],
  Balraj: ["बलराज", "ਬਲਰਾਜ"],
  Bharat: ["भरत", "ਭਰਤ"],
  Bhavna: ["भावना", "ਭਾਵਨਾ"],
  Charan: ["चरण", "ਚਰਨ"],
  Deepak: ["दीपक", "ਦੀਪਕ"],
  Dev: ["देव", "ਦੇਵ"],
  Diya: ["दिया", "ਦਿਆ"],
  Ekta: ["एकता", "ਏਕਤਾ"],
  Farah: ["फ़राह", "ਫਰਾਹ"],
  Gagandeep: ["गगनदीप", "ਗਗਨਦੀਪ"],
  Gauri: ["गौरी", "ਗੌਰੀ"],
  Gurleen: ["गुरलीन", "ਗੁਰਲੀਨ"],
  Harjit: ["हरजीत", "ਹਰਜੀਤ"],
  Harleen: ["हरलीन", "ਹਰਲੀਨ"],
  Harman: ["हरमन", "ਹਰਮਨ"],
  Hema: ["हेमा", "ਹੇਮਾ"],
  Isha: ["ईशा", "ਈਸ਼ਾ"],
  Ishaan: ["ईशान", "ਈਸ਼ਾਨ"],
  Jasleen: ["जसलीन", "ਜਸਲੀਨ"],
  Jaspreet: ["जसप्रीत", "ਜਸਪ੍ਰੀਤ"],
  Jatin: ["जतिन", "ਜਤਿਨ"],
  Jaya: ["जया", "ਜਯਾ"],
  Kabir: ["कबीर", "ਕਬੀਰ"],
  Karan: ["करण", "ਕਰਨ"],
  Kavita: ["कविता", "ਕਵਿਤਾ"],
  Kavya: ["काव्या", "ਕਾਵਿਆ"],
  Kiran: ["किरण", "ਕਿਰਨ"],
  Komal: ["कोमल", "ਕੋਮਲ"],
  Kriti: ["कृति", "ਕ੍ਰਿਤੀ"],
  Lakshya: ["लक्ष्य", "ਲਕਸ਼"],
  Manav: ["मानव", "ਮਾਨਵ"],
  Mandeep: ["मनदीप", "ਮਨਦੀਪ"],
  Manvi: ["मानवी", "ਮਾਨਵੀ"],
  Meena: ["मीना", "ਮੀਨਾ"],
  Mehak: ["महक", "ਮਹਿਕ"],
  Mohit: ["मोहित", "ਮੋਹਿਤ"],
  Muskan: ["मुस्कान", "ਮੁਸਕਾਨ"],
  Naina: ["नैना", "ਨੈਨਾ"],
  Navdeep: ["नवदीप", "ਨਵਦੀਪ"],
  Naveen: ["नवीन", "ਨਵੀਨ"],
  Neha: ["नेहा", "ਨੇਹਾ"],
  Nikhil: ["निखिल", "ਨਿਖਿਲ"],
  Palak: ["पलक", "ਪਲਕ"],
  Param: ["परम", "ਪਰਮ"],
  Pooja: ["पूजा", "ਪੂਜਾ"],
  Pranav: ["प्रणव", "ਪ੍ਰਣਵ"],
  Preet: ["प्रीत", "ਪ੍ਰੀਤ"],
  Rahul: ["राहुल", "ਰਾਹੁਲ"],
  Raj: ["राज", "ਰਾਜ"],
  Raman: ["रमन", "ਰਮਨ"],
  Ravinder: ["रविंदर", "ਰਵਿੰਦਰ"],
  Ritu: ["रितु", "ਰਿਤੂ"],
  Riya: ["रिया", "ਰਿਆ"],
  Rohan: ["रोहन", "ਰੋਹਨ"],
  Rohit: ["रोहित", "ਰੋਹਿਤ"],
  Rupinder: ["रुपिंदर", "ਰੁਪਿੰਦਰ"],
  Sahil: ["साहिल", "ਸਾਹਿਲ"],
  Sakshi: ["साक्षी", "ਸਾਕਸ਼ੀ"],
  Sana: ["सना", "ਸਨਾ"],
  Sandeep: ["संदीप", "ਸੰਦੀਪ"],
  Shruti: ["श्रुति", "ਸ਼੍ਰੁਤੀ"],
  Simran: ["सिमरन", "ਸਿਮਰਨ"],
  Sonam: ["सोनम", "ਸੋਨਮ"],
  Tanvi: ["तन्वी", "ਤਨਵੀ"],
  Tanya: ["तान्या", "ਤਾਨਿਆ"],
  Taran: ["तरन", "ਤਰਨ"],
  Uday: ["उदय", "ਉਦੈ"],
  Vandana: ["वंदना", "ਵੰਦਨਾ"],
  Varun: ["वरुण", "ਵਰੁਣ"],
  Vikas: ["विकास", "ਵਿਕਾਸ"],
  Yash: ["यश", "ਯਸ਼"],
  Zoya: ["ज़ोया", "ਜ਼ੋਇਆ"],
} as const satisfies Readonly<Record<string, readonly [string, string]>>);

export const SEA001_REVIEW_NAME_PACK = NAME_PACK;
export const SEA001_REVIEW_CANONICAL_NAMES = Object.freeze(Object.keys(NAME_PACK));

export function localizedSea001Name(name: string, locale: Sea001TranslatedLocale): string {
  const entry = NAME_PACK[name as keyof typeof NAME_PACK];
  if (!entry) return name;
  return locale === "hi-IN" ? entry[0] : entry[1];
}

export function localizeSea001Names(text: string, locale: Sea001TranslatedLocale): string {
  let output = text;
  for (const name of [...SEA001_REVIEW_CANONICAL_NAMES].sort((a, b) => b.length - a.length)) {
    output = output.replace(new RegExp(`\\b${name}\\b`, "g"), localizedSea001Name(name, locale));
  }
  return output;
}
