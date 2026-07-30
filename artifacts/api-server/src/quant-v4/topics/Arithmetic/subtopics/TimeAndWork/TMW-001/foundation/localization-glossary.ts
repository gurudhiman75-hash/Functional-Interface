import { equals, formatRational, rational, toMixedLatex } from "./rational";
import type { Rational, TmwTimeUnit } from "./types";
import type { TmwLocalizedLanguage } from "./localization-types";

type LocalePair = { hi: string; pa: string };

const contextCopy: Record<string, LocalePair> = {
  "A packaging machine": { hi: "एक पैकेजिंग मशीन", pa: "ਇੱਕ ਪੈਕਿੰਗ ਮਸ਼ੀਨ" },
  "A second packaging machine": { hi: "दूसरी पैकेजिंग मशीन", pa: "ਦੂਜੀ ਪੈਕਿੰਗ ਮਸ਼ੀਨ" },
  "A printing unit": { hi: "एक प्रिंटिंग इकाई", pa: "ਇੱਕ ਪ੍ਰਿੰਟਿੰਗ ਇਕਾਈ" },
  "A second printing unit": { hi: "दूसरी प्रिंटिंग इकाई", pa: "ਦੂਜੀ ਪ੍ਰਿੰਟਿੰਗ ਇਕਾਈ" },
  "A bottling line": { hi: "एक बोतल भरने वाली लाइन", pa: "ਇੱਕ ਬੋਤਲ ਭਰਨ ਵਾਲੀ ਲਾਈਨ" },
  "A second bottling line": { hi: "दूसरी बोतल भरने वाली लाइन", pa: "ਦੂਜੀ ਬੋਤਲ ਭਰਨ ਵਾਲੀ ਲਾਈਨ" },
  "A sorting machine": { hi: "एक छँटाई मशीन", pa: "ਇੱਕ ਛਾਂਟਣ ਵਾਲੀ ਮਸ਼ੀਨ" },
  "A second sorting machine": { hi: "दूसरी छँटाई मशीन", pa: "ਦੂਜੀ ਛਾਂਟਣ ਵਾਲੀ ਮਸ਼ੀਨ" },
  "A data-entry operator": { hi: "एक डेटा-एंट्री ऑपरेटर", pa: "ਇੱਕ ਡਾਟਾ-ਐਂਟਰੀ ਆਪਰੇਟਰ" },
  "Another data-entry operator": { hi: "दूसरा डेटा-एंट्री ऑपरेटर", pa: "ਦੂਜਾ ਡਾਟਾ-ਐਂਟਰੀ ਆਪਰੇਟਰ" },
  "A typist": { hi: "एक टाइपिस्ट", pa: "ਇੱਕ ਟਾਈਪਿਸਟ" },
  "Another typist": { hi: "दूसरा टाइपिस्ट", pa: "ਦੂਜਾ ਟਾਈਪਿਸਟ" },
  "A records clerk": { hi: "एक रिकॉर्ड क्लर्क", pa: "ਇੱਕ ਰਿਕਾਰਡ ਕਲਰਕ" },
  "Another records clerk": { hi: "दूसरा रिकॉर्ड क्लर्क", pa: "ਦੂਜਾ ਰਿਕਾਰਡ ਕਲਰਕ" },
  "A proofreader": { hi: "एक प्रूफरीडर", pa: "ਇੱਕ ਪ੍ਰੂਫਰੀਡਰ" },
  "Another proofreader": { hi: "दूसरा प्रूफरीडर", pa: "ਦੂਜਾ ਪ੍ਰੂਫਰੀਡਰ" },
  "An inspection team": { hi: "एक निरीक्षण टीम", pa: "ਇੱਕ ਜਾਂਚ ਟੀਮ" },
  "A second inspection team": { hi: "दूसरी निरीक्षण टीम", pa: "ਦੂਜੀ ਜਾਂਚ ਟੀਮ" },
  "A verification clerk": { hi: "एक सत्यापन क्लर्क", pa: "ਇੱਕ ਤਸਦੀਕ ਕਲਰਕ" },
  "Another verification clerk": { hi: "दूसरा सत्यापन क्लर्क", pa: "ਦੂਜਾ ਤਸਦੀਕ ਕਲਰਕ" },
  "A quality-control unit": { hi: "एक गुणवत्ता-जाँच इकाई", pa: "ਇੱਕ ਗੁਣਵੱਤਾ ਜਾਂਚ ਇਕਾਈ" },
  "A second quality-control unit": { hi: "दूसरी गुणवत्ता-जाँच इकाई", pa: "ਦੂਜੀ ਗੁਣਵੱਤਾ ਜਾਂਚ ਇਕਾਈ" },
  "An audit assistant": { hi: "एक लेखा-जाँच सहायक", pa: "ਇੱਕ ਆਡਿਟ ਸਹਾਇਕ" },
  "Another audit assistant": { hi: "दूसरा लेखा-जाँच सहायक", pa: "ਦੂਜਾ ਆਡਿਟ ਸਹਾਇਕ" },
  "A painter": { hi: "एक पेंटर", pa: "ਇੱਕ ਪੇਂਟਰ" },
  "Another painter": { hi: "दूसरा पेंटर", pa: "ਦੂਜਾ ਪੇਂਟਰ" },
  "A maintenance worker": { hi: "एक रखरखाव कर्मी", pa: "ਇੱਕ ਰੱਖ-ਰਖਾਅ ਕਰਮਚਾਰੀ" },
  "Another maintenance worker": { hi: "दूसरा रखरखाव कर्मी", pa: "ਦੂਜਾ ਰੱਖ-ਰਖਾਅ ਕਰਮਚਾਰੀ" },
  "A decorator": { hi: "एक सजावट कर्मी", pa: "ਇੱਕ ਸਜਾਵਟ ਕਰਮਚਾਰੀ" },
  "Another decorator": { hi: "दूसरा सजावट कर्मी", pa: "ਦੂਜਾ ਸਜਾਵਟ ਕਰਮਚਾਰੀ" },
  "A contractor": { hi: "एक ठेकेदार", pa: "ਇੱਕ ਠੇਕੇਦਾਰ" },
  "Another contractor": { hi: "दूसरा ठेकेदार", pa: "ਦੂਜਾ ਠੇਕੇਦਾਰ" },
  "A road crew": { hi: "एक सड़क निर्माण दल", pa: "ਇੱਕ ਸੜਕ ਨਿਰਮਾਣ ਟੀਮ" },
  "A second road crew": { hi: "दूसरा सड़क निर्माण दल", pa: "ਦੂਜੀ ਸੜਕ ਨਿਰਮਾਣ ਟੀਮ" },
  "A fencing team": { hi: "एक बाड़ लगाने वाली टीम", pa: "ਇੱਕ ਵਾੜ ਲਗਾਉਣ ਵਾਲੀ ਟੀਮ" },
  "A second fencing team": { hi: "दूसरी बाड़ लगाने वाली टीम", pa: "ਦੂਜੀ ਵਾੜ ਲਗਾਉਣ ਵਾਲੀ ਟੀਮ" },
  "A masonry team": { hi: "एक राजमिस्त्री दल", pa: "ਇੱਕ ਰਾਜ ਮਿਸਤਰੀ ਟੀਮ" },
  "A second masonry team": { hi: "दूसरा राजमिस्त्री दल", pa: "ਦੂਜੀ ਰਾਜ ਮਿਸਤਰੀ ਟੀਮ" },
  "A cable-laying crew": { hi: "एक केबल बिछाने वाला दल", pa: "ਇੱਕ ਕੇਬਲ ਵਿਛਾਉਣ ਵਾਲੀ ਟੀਮ" },
  "A second cable-laying crew": { hi: "दूसरा केबल बिछाने वाला दल", pa: "ਦੂਜੀ ਕੇਬਲ ਵਿਛਾਉਣ ਵਾਲੀ ਟੀਮ" },

  cartons: { hi: "कार्टन", pa: "ਕਾਰਟਨ" },
  booklets: { hi: "पुस्तिकाएँ", pa: "ਪੁਸਤਿਕਾਵਾਂ" },
  bottles: { hi: "बोतलें", pa: "ਬੋਤਲਾਂ" },
  parcels: { hi: "पार्सल", pa: "ਪਾਰਸਲ" },
  forms: { hi: "फॉर्म", pa: "ਫਾਰਮ" },
  pages: { hi: "पृष्ठ", pa: "ਸਫ਼ੇ" },
  files: { hi: "फाइलें", pa: "ਫਾਈਲਾਂ" },
  applications: { hi: "आवेदन", pa: "ਅਰਜ਼ੀਆਂ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ" },
  records: { hi: "रिकॉर्ड", pa: "ਰਿਕਾਰਡ" },
  "metres of wall": { hi: "मीटर दीवार", pa: "ਮੀਟਰ ਕੰਧ" },
  "repair tasks": { hi: "मरम्मत कार्य", pa: "ਮੁਰੰਮਤ ਦੇ ਕੰਮ" },
  rooms: { hi: "कमरे", pa: "ਕਮਰੇ" },
  "metres of surface": { hi: "मीटर सतह", pa: "ਮੀਟਰ ਸਤਹ" },
  "metres of road": { hi: "मीटर सड़क", pa: "ਮੀਟਰ ਸੜਕ" },
  "metres of fencing": { hi: "मीटर बाड़", pa: "ਮੀਟਰ ਵਾੜ" },
  "metres of cable": { hi: "मीटर केबल", pa: "ਮੀਟਰ ਕੇਬਲ" },

  "a fixed batch of cartons": { hi: "कार्टनों की एक निश्चित खेप", pa: "ਕਾਰਟਨਾਂ ਦੀ ਇੱਕ ਨਿਰਧਾਰਤ ਖੇਪ" },
  "a fixed batch of booklets": { hi: "पुस्तिकाओं की एक निश्चित खेप", pa: "ਪੁਸਤਿਕਾਵਾਂ ਦੀ ਇੱਕ ਨਿਰਧਾਰਤ ਖੇਪ" },
  "a fixed batch of bottles": { hi: "बोतलों की एक निश्चित खेप", pa: "ਬੋਤਲਾਂ ਦੀ ਇੱਕ ਨਿਰਧਾਰਤ ਖੇਪ" },
  "a fixed batch of parcels": { hi: "पार्सलों की एक निश्चित खेप", pa: "ਪਾਰਸਲਾਂ ਦੀ ਇੱਕ ਨਿਰਧਾਰਤ ਖੇਪ" },
  "a fixed batch of forms": { hi: "फॉर्मों की एक निश्चित खेप", pa: "ਫਾਰਮਾਂ ਦੀ ਇੱਕ ਨਿਰਧਾਰਤ ਖੇਪ" },
  "a typing assignment": { hi: "एक टाइपिंग कार्य", pa: "ਇੱਕ ਟਾਈਪਿੰਗ ਕੰਮ" },
  "a fixed set of files": { hi: "फाइलों का एक निश्चित सेट", pa: "ਫਾਈਲਾਂ ਦਾ ਇੱਕ ਨਿਰਧਾਰਤ ਸੈੱਟ" },
  "a proofreading assignment": { hi: "एक प्रूफरीडिंग कार्य", pa: "ਇੱਕ ਪ੍ਰੂਫਰੀਡਿੰਗ ਕੰਮ" },
  "an assigned set of files": { hi: "फाइलों का दिया गया सेट", pa: "ਫਾਈਲਾਂ ਦਾ ਦਿੱਤਾ ਹੋਇਆ ਸੈੱਟ" },
  "a fixed batch of applications": { hi: "आवेदनों की एक निश्चित खेप", pa: "ਅਰਜ਼ੀਆਂ ਦੀ ਇੱਕ ਨਿਰਧਾਰਤ ਖੇਪ" },
  "a fixed batch of components": { hi: "पुर्ज़ों की एक निश्चित खेप", pa: "ਪੁਰਜ਼ਿਆਂ ਦੀ ਇੱਕ ਨਿਰਧਾਰਤ ਖੇਪ" },
  "an assigned set of records": { hi: "रिकॉर्डों का दिया गया सेट", pa: "ਰਿਕਾਰਡਾਂ ਦਾ ਦਿੱਤਾ ਹੋਇਆ ਸੈੱਟ" },
  "a boundary wall": { hi: "एक चारदीवारी", pa: "ਇੱਕ ਚਾਰਦੀਵਾਰੀ" },
  "a repair assignment": { hi: "एक मरम्मत कार्य", pa: "ਇੱਕ ਮੁਰੰਮਤ ਕੰਮ" },
  "an office interior": { hi: "एक कार्यालय का आंतरिक सजावट कार्य", pa: "ਇੱਕ ਦਫ਼ਤਰ ਦੀ ਅੰਦਰੂਨੀ ਸਜਾਵਟ ਦਾ ਕੰਮ" },
  "a resurfacing job": { hi: "एक सतह नवीनीकरण कार्य", pa: "ਇੱਕ ਸਤਹ ਨਵੀਨੀਕਰਨ ਕੰਮ" },
  "a planned road section": { hi: "सड़क का नियोजित भाग", pa: "ਸੜਕ ਦਾ ਯੋਜਿਤ ਹਿੱਸਾ" },
  "a fencing assignment": { hi: "बाड़ लगाने का कार्य", pa: "ਵਾੜ ਲਗਾਉਣ ਦਾ ਕੰਮ" },
  "a planned wall section": { hi: "दीवार का नियोजित भाग", pa: "ਕੰਧ ਦਾ ਯੋਜਿਤ ਹਿੱਸਾ" },
  "a cable-laying assignment": { hi: "केबल बिछाने का कार्य", pa: "ਕੇਬਲ ਵਿਛਾਉਣ ਦਾ ਕੰਮ" },

  minute: { hi: "मिनट", pa: "ਮਿੰਟ" },
  hour: { hi: "घंटा", pa: "ਘੰਟਾ" },
  day: { hi: "दिन", pa: "ਦਿਨ" },
  shift: { hi: "पाली", pa: "ਪਾਲੀ" },
};

const unitCopy: Record<TmwTimeUnit, { hi: [string, string]; pa: [string, string] }> = {
  minute: { hi: ["मिनट", "मिनट"], pa: ["ਮਿੰਟ", "ਮਿੰਟ"] },
  hour: { hi: ["घंटा", "घंटे"], pa: ["ਘੰਟਾ", "ਘੰਟੇ"] },
  day: { hi: ["दिन", "दिन"], pa: ["ਦਿਨ", "ਦਿਨ"] },
  shift: { hi: ["पाली", "पालियाँ"], pa: ["ਪਾਲੀ", "ਪਾਲੀਆਂ"] },
};

export function localizedContext(value: string, language: TmwLocalizedLanguage): string {
  return contextCopy[value]?.[language] ?? value;
}

export function localizedUnit(unit: TmwTimeUnit, value: Rational, language: TmwLocalizedLanguage): string {
  const [singular, plural] = unitCopy[unit][language];
  return equals(value, rational(1)) ? singular : plural;
}

export function localizedPerUnit(unit: TmwTimeUnit, language: TmwLocalizedLanguage): string {
  const value = unitCopy[unit][language][0];
  return language === "hi" ? `प्रति ${value}` : `ਪ੍ਰਤੀ ${value}`;
}

export function formatLocalizedTime(value: Rational, unit: TmwTimeUnit, language: TmwLocalizedLanguage): string {
  const label = localizedUnit(unit, value, language);
  if (value.denominator === 1) return `${value.numerator} ${label}`;
  return `\\(${toMixedLatex(value)}\\;\\text{${unitCopy[unit][language][1]}}\\)`;
}

export function localizedOptionLabel(index: number, language: TmwLocalizedLanguage): string {
  const letter = "ABCD"[index] ?? String(index + 1);
  return language === "hi" ? `विकल्प ${letter}` : `ਚੋਣ ${letter}`;
}

function replaceMathText(value: string, language: TmwLocalizedLanguage): string {
  const replacements: Array<[RegExp, string, string]> = [
    [/days/g, "दिन", "ਦਿਨ"],
    [/day/g, "दिन", "ਦਿਨ"],
    [/hours/g, "घंटे", "ਘੰਟੇ"],
    [/hour/g, "घंटा", "ਘੰਟਾ"],
    [/minutes/g, "मिनट", "ਮਿੰਟ"],
    [/minute/g, "मिनट", "ਮਿੰਟ"],
    [/shifts/g, "पालियाँ", "ਪਾਲੀਆਂ"],
    [/shift/g, "पाली", "ਪਾਲੀ"],
  ];
  return replacements.reduce((text, [pattern, hi, pa]) => text.replace(pattern, language === "hi" ? hi : pa), value);
}

function localizePlainUnit(value: string, language: TmwLocalizedLanguage): string {
  const units: Array<[RegExp, string, string]> = [
    [/metres of road/g, "मीटर सड़क", "ਮੀਟਰ ਸੜਕ"],
    [/metres of fencing/g, "मीटर बाड़", "ਮੀਟਰ ਵਾੜ"],
    [/metres of wall/g, "मीटर दीवार", "ਮੀਟਰ ਕੰਧ"],
    [/metres of surface/g, "मीटर सतह", "ਮੀਟਰ ਸਤਹ"],
    [/metres of cable/g, "मीटर केबल", "ਮੀਟਰ ਕੇਬਲ"],
    [/repair tasks/g, "मरम्मत कार्य", "ਮੁਰੰਮਤ ਦੇ ਕੰਮ"],
    [/applications/g, "आवेदन", "ਅਰਜ਼ੀਆਂ"],
    [/components/g, "पुर्ज़े", "ਪੁਰਜ਼ੇ"],
    [/booklets/g, "पुस्तिकाएँ", "ਪੁਸਤਿਕਾਵਾਂ"],
    [/parcels/g, "पार्सल", "ਪਾਰਸਲ"],
    [/cartons/g, "कार्टन", "ਕਾਰਟਨ"],
    [/bottles/g, "बोतलें", "ਬੋਤਲਾਂ"],
    [/records/g, "रिकॉर्ड", "ਰਿਕਾਰਡ"],
    [/forms/g, "फॉर्म", "ਫਾਰਮ"],
    [/pages/g, "पृष्ठ", "ਸਫ਼ੇ"],
    [/files/g, "फाइलें", "ਫਾਈਲਾਂ"],
    [/rooms/g, "कमरे", "ਕਮਰੇ"],
  ];
  return units.reduce((text, [pattern, hi, pa]) => text.replace(pattern, language === "hi" ? hi : pa), value);
}

export function localizeAnswerText(value: string, language: TmwLocalizedLanguage): string {
  let text = value.replace(
    /(\d+(?: \d+\/\d+|\/\d+)?) of the work per (day|hour|minute|shift)/g,
    (_match, amount: string, unit: TmwTimeUnit) => language === "hi"
      ? `${localizedPerUnit(unit, language)} काम का ${amount} भाग`
      : `${localizedPerUnit(unit, language)} ਕੰਮ ਦਾ ${amount} ਹਿੱਸਾ`,
  );
  text = text.replace(
    /(\d+(?: \d+\/\d+|\/\d+)?) of the work/g,
    (_match, amount: string) => language === "hi" ? `काम का ${amount} भाग` : `ਕੰਮ ਦਾ ${amount} ਹਿੱਸਾ`,
  );
  text = localizePlainUnit(text, language);
  text = text.replace(/ per (day|hour|minute|shift)/g, (_match, unit: TmwTimeUnit) => ` ${localizedPerUnit(unit, language)}`);
  return replaceMathText(text, language);
}

export function localizeMathStep(value: string, language: TmwLocalizedLanguage): string {
  const pairs: Array<[string, string, string]> = [
    ["Known:", "दिया गया:", "ਦਿੱਤਾ ਹੈ:"],
    ["Check:", "जाँच:", "ਜਾਂਚ:"],
    ["Completed work starts from", "पूरा किया गया काम", "ਪੂਰਾ ਕੀਤਾ ਕੰਮ"],
    ["Target work", "लक्षित काम", "ਟੀਚੇ ਵਾਲਾ ਕੰਮ"],
    ["Whole-work time", "पूरा काम करने का समय", "ਪੂਰਾ ਕੰਮ ਕਰਨ ਦਾ ਸਮਾਂ"],
    ["One-unit rate", "एक इकाई समय की दर", "ਇੱਕ ਇਕਾਈ ਸਮੇਂ ਦੀ ਦਰ"],
    ["Time saved", "बचा हुआ समय", "ਬਚਿਆ ਸਮਾਂ"],
    ["Delay", "देरी", "ਦੇਰੀ"],
    ["known times", "ज्ञात समय", "ਪਤਾ ਸਮੇਂ"],
  ];
  let result = replaceMathText(value, language);
  for (const [source, hi, pa] of pairs) result = result.replace(source, language === "hi" ? hi : pa);
  return result;
}

export function localizedNumber(value: Rational): string {
  return formatRational(value);
}
