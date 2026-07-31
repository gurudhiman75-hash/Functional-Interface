import { formatRational, toMixedLatex } from "./rational";
import type { Rational } from "./types";
import type { TmwCp004GeneratedQuestion, TmwCp004Parameters } from "./cp004-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import { formatLocalizedTime, localizedPerUnit } from "./localization-glossary";

export function cp004Copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

const actorCopy: Record<string, { hi: string; pa: string }> = {
  Operator: { hi: "ऑपरेटर", pa: "ਆਪਰੇਟਰ" },
  Technician: { hi: "तकनीशियन", pa: "ਟੈਕਨੀਸ਼ੀਅਨ" },
  Clerk: { hi: "क्लर्क", pa: "ਕਲਰਕ" },
  Machine: { hi: "मशीन", pa: "ਮਸ਼ੀਨ" },
  Crew: { hi: "दल", pa: "ਟੀਮ" },
  Team: { hi: "टीम", pa: "ਟੀਮ" },
  Inspector: { hi: "निरीक्षक", pa: "ਜਾਂਚਕਰਤਾ" },
  Typist: { hi: "टाइपिस्ट", pa: "ਟਾਈਪਿਸਟ" },
  Painter: { hi: "पेंटर", pa: "ਪੇਂਟਰ" },
  Recorder: { hi: "रिकॉर्ड कर्मी", pa: "ਰਿਕਾਰਡ ਕਰਮਚਾਰੀ" },
  Surveyor: { hi: "सर्वेक्षक", pa: "ਸਰਵੇਖਕ" },
  Assembler: { hi: "असेंबली कर्मी", pa: "ਅਸੈਂਬਲੀ ਕਰਮਚਾਰੀ" },
};

const jobCopy: Record<string, { hi: string; pa: string }> = {
  "a customer-record batch": { hi: "ग्राहक रिकॉर्डों का एक बैच", pa: "ਗਾਹਕ ਰਿਕਾਰਡਾਂ ਦਾ ਇੱਕ ਬੈਚ" },
  "an equipment overhaul": { hi: "उपकरण की पूरी मरम्मत", pa: "ਉਪਕਰਣ ਦੀ ਪੂਰੀ ਮੁਰੰਮਤ" },
  "a loan-application set": { hi: "ऋण आवेदनों का एक सेट", pa: "ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ ਦਾ ਇੱਕ ਸੈੱਟ" },
  "a printing order": { hi: "छपाई का एक ऑर्डर", pa: "ਛਪਾਈ ਦਾ ਇੱਕ ਆਰਡਰ" },
  "a road-marking project": { hi: "सड़क पर निशान लगाने का काम", pa: "ਸੜਕ ਉੱਤੇ ਨਿਸ਼ਾਨ ਲਗਾਉਣ ਦਾ ਕੰਮ" },
  "a packaging order": { hi: "पैकिंग का एक ऑर्डर", pa: "ਪੈਕਿੰਗ ਦਾ ਇੱਕ ਆਰਡਰ" },
  "a quality-inspection batch": { hi: "गुणवत्ता-जाँच का एक बैच", pa: "ਗੁਣਵੱਤਾ ਜਾਂਚ ਦਾ ਇੱਕ ਬੈਚ" },
  "a manuscript-typing job": { hi: "पांडुलिपि टाइप करने का काम", pa: "ਪਾਂਡੁਲਿਪੀ ਟਾਈਪ ਕਰਨ ਦਾ ਕੰਮ" },
  "a school-building paint job": { hi: "स्कूल भवन को रंगने का काम", pa: "ਸਕੂਲ ਦੀ ਇਮਾਰਤ ਨੂੰ ਰੰਗ ਕਰਨ ਦਾ ਕੰਮ" },
  "a warehouse inventory count": { hi: "गोदाम का स्टॉक गिनने का काम", pa: "ਗੋਦਾਮ ਦਾ ਸਟਾਕ ਗਿਣਨ ਦਾ ਕੰਮ" },
  "a field survey": { hi: "मैदानी सर्वेक्षण", pa: "ਮੈਦਾਨੀ ਸਰਵੇਖਣ" },
  "an electronics-assembly order": { hi: "इलेक्ट्रॉनिक उपकरण जोड़ने का ऑर्डर", pa: "ਇਲੈਕਟ੍ਰਾਨਿਕ ਉਪਕਰਣ ਜੋੜਨ ਦਾ ਆਰਡਰ" },
};

export function cp004Actor(
  parameters: TmwCp004Parameters,
  language: TmwLocalizedLanguage,
  key: "actorA" | "actorB" | "actorC",
): string {
  const source = parameters.context[key];
  const match = /^(.*) ([ABC])$/.exec(source);
  if (!match) return source;
  const noun = actorCopy[match[1]]?.[language] ?? match[1];
  return `${noun} ${match[2]}`;
}

export function cp004Job(parameters: TmwCp004Parameters, language: TmwLocalizedLanguage): string {
  return jobCopy[parameters.context.jobPhrase]?.[language] ?? parameters.context.jobPhrase;
}

export function cp004Time(parameters: TmwCp004Parameters, value: Rational, language: TmwLocalizedLanguage): string {
  return formatLocalizedTime(value, parameters.timeUnit, language);
}

export function cp004Hours(value: Rational, language: TmwLocalizedLanguage): string {
  return formatLocalizedTime(value, "hour", language);
}

export function cp004MathValue(value: Rational): string {
  if (value.denominator === 1) return String(value.numerator);
  return `\\(${toMixedLatex(value)}\\)`;
}

export function cp004WorkRate(value: Rational, parameters: TmwCp004Parameters, language: TmwLocalizedLanguage): string {
  return cp004Copy(
    language,
    `पूरे काम का ${cp004MathValue(value)} भाग ${localizedPerUnit(parameters.timeUnit, language)}`,
    `ਪੂਰੇ ਕੰਮ ਦਾ ${cp004MathValue(value)} ਹਿੱਸਾ ${localizedPerUnit(parameters.timeUnit, language)}`,
  );
}

export function cp004LocalizedAnswerText(
  source: TmwCp004GeneratedQuestion,
  value: Rational,
  language: TmwLocalizedLanguage,
): string {
  switch (source.solution.answerType) {
    case "TIME":
      return cp004Time(source.parameters, value, language);
    case "FRACTION":
      return cp004Copy(language, `काम का ${cp004MathValue(value)}`, `ਕੰਮ ਦਾ ${cp004MathValue(value)}`);
    case "RATE":
      return cp004WorkRate(value, source.parameters, language);
    case "COUNT": {
      const count = formatRational(value);
      return cp004Copy(language, `${count} कर्मचारी`, `${count} ਕਰਮਚਾਰੀ`);
    }
  }
}
