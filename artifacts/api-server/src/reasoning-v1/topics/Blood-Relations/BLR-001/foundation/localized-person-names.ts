export type BlrNativeLocale = "hi-IN" | "pa-IN";

const BLR_PERSON_NAME_MAP = Object.freeze({
  Aman: { "hi-IN": "अमन", "pa-IN": "ਅਮਨ" },
  Bharat: { "hi-IN": "भरत", "pa-IN": "ਭਰਤ" },
  Charan: { "hi-IN": "चरण", "pa-IN": "ਚਰਨ" },
  Deepak: { "hi-IN": "दीपक", "pa-IN": "ਦੀਪਕ" },
  Gagan: { "hi-IN": "गगन", "pa-IN": "ਗਗਨ" },
  Harjit: { "hi-IN": "हरजीत", "pa-IN": "ਹਰਜੀਤ" },
  Karan: { "hi-IN": "करण", "pa-IN": "ਕਰਨ" },
  Manav: { "hi-IN": "मानव", "pa-IN": "ਮਾਨਵ" },
  Nitin: { "hi-IN": "नितिन", "pa-IN": "ਨਿਤਿਨ" },
  Rohit: { "hi-IN": "रोहित", "pa-IN": "ਰੋਹਿਤ" },
  Sahil: { "hi-IN": "साहिल", "pa-IN": "ਸਾਹਿਲ" },
  Vikas: { "hi-IN": "विकास", "pa-IN": "ਵਿਕਾਸ" },
  Arjun: { "hi-IN": "अर्जुन", "pa-IN": "ਅਰਜੁਨ" },
  Dev: { "hi-IN": "देव", "pa-IN": "ਦੇਵ" },
  Ishaan: { "hi-IN": "ईशान", "pa-IN": "ਈਸ਼ਾਨ" },
  Kabir: { "hi-IN": "कबीर", "pa-IN": "ਕਬੀਰ" },
  Laksh: { "hi-IN": "लक्ष", "pa-IN": "ਲਕਸ਼" },
  Mohan: { "hi-IN": "मोहन", "pa-IN": "ਮੋਹਨ" },
  Naveen: { "hi-IN": "नवीन", "pa-IN": "ਨਵੀਨ" },
  Rajat: { "hi-IN": "रजत", "pa-IN": "ਰਜਤ" },
  Sameer: { "hi-IN": "समीर", "pa-IN": "ਸਮੀਰ" },
  Tarun: { "hi-IN": "तरुण", "pa-IN": "ਤਰੁਣ" },
  Varun: { "hi-IN": "वरुण", "pa-IN": "ਵਰੁਣ" },
  Yash: { "hi-IN": "यश", "pa-IN": "ਯਸ਼" },
  Asha: { "hi-IN": "आशा", "pa-IN": "ਆਸ਼ਾ" },
  Bhavna: { "hi-IN": "भावना", "pa-IN": "ਭਾਵਨਾ" },
  Divya: { "hi-IN": "दिव्या", "pa-IN": "ਦਿਵਿਆ" },
  Gurleen: { "hi-IN": "गुरलीन", "pa-IN": "ਗੁਰਲੀਨ" },
  Isha: { "hi-IN": "ईशा", "pa-IN": "ਈਸ਼ਾ" },
  Kavita: { "hi-IN": "कविता", "pa-IN": "ਕਵਿਤਾ" },
  Meena: { "hi-IN": "मीना", "pa-IN": "ਮੀਨਾ" },
  Neha: { "hi-IN": "नेहा", "pa-IN": "ਨੇਹਾ" },
  Pooja: { "hi-IN": "पूजा", "pa-IN": "ਪੂਜਾ" },
  Ritu: { "hi-IN": "रितु", "pa-IN": "ਰਿਤੂ" },
  Simran: { "hi-IN": "सिमरन", "pa-IN": "ਸਿਮਰਨ" },
  Tanya: { "hi-IN": "तान्या", "pa-IN": "ਤਾਨਿਆ" },
  Anita: { "hi-IN": "अनीता", "pa-IN": "ਅਨੀਤਾ" },
  Deepa: { "hi-IN": "दीपा", "pa-IN": "ਦੀਪਾ" },
  Geeta: { "hi-IN": "गीता", "pa-IN": "ਗੀਤਾ" },
  Jasleen: { "hi-IN": "जसलीन", "pa-IN": "ਜਸਲੀਨ" },
  Komal: { "hi-IN": "कोमल", "pa-IN": "ਕੋਮਲ" },
  Manya: { "hi-IN": "मान्या", "pa-IN": "ਮਾਨਿਆ" },
  Navya: { "hi-IN": "नव्या", "pa-IN": "ਨਵਿਆ" },
  Reena: { "hi-IN": "रीना", "pa-IN": "ਰੀਨਾ" },
  Sonia: { "hi-IN": "सोनिया", "pa-IN": "ਸੋਨੀਆ" },
  Trisha: { "hi-IN": "त्रिशा", "pa-IN": "ਤ੍ਰਿਸ਼ਾ" },
  Vidhi: { "hi-IN": "विधि", "pa-IN": "ਵਿਧੀ" },
  Yamini: { "hi-IN": "यामिनी", "pa-IN": "ਯਾਮਿਨੀ" },
  Nisha: { "hi-IN": "निशा", "pa-IN": "ਨਿਸ਼ਾ" },
  Meera: { "hi-IN": "मीरा", "pa-IN": "ਮੀਰਾ" },
  Kiran: { "hi-IN": "किरण", "pa-IN": "ਕਿਰਨ" },
  Gurpreet: { "hi-IN": "गुरप्रीत", "pa-IN": "ਗੁਰਪ੍ਰੀਤ" },
  Harpreet: { "hi-IN": "हरप्रीत", "pa-IN": "ਹਰਪ੍ਰੀਤ" },
  Jaspreet: { "hi-IN": "जसप्रीत", "pa-IN": "ਜਸਪ੍ਰੀਤ" },
  Manpreet: { "hi-IN": "मनप्रीत", "pa-IN": "ਮਨਪ੍ਰੀਤ" },
  Navjot: { "hi-IN": "नवजोत", "pa-IN": "ਨਵਜੋਤ" },
  Simar: { "hi-IN": "सिमर", "pa-IN": "ਸਿਮਰ" },
  Mandeep: { "hi-IN": "मनदीप", "pa-IN": "ਮਨਦੀਪ" },
} as const);

export type BlrCanonicalPersonName = keyof typeof BLR_PERSON_NAME_MAP;

export function localizeBlrPersonName(
  name: string,
  locale: BlrNativeLocale,
): string {
  return BLR_PERSON_NAME_MAP[name as BlrCanonicalPersonName]?.[locale] ?? name;
}

export function localizeBlrPersonNamesInText(
  text: string,
  locale: BlrNativeLocale,
): string {
  return text.replace(/\b[A-Za-z]+\b/g, (token) =>
    localizeBlrPersonName(token, locale),
  );
}

export function blrCanonicalPersonNames(): readonly BlrCanonicalPersonName[] {
  return Object.keys(BLR_PERSON_NAME_MAP) as BlrCanonicalPersonName[];
}
