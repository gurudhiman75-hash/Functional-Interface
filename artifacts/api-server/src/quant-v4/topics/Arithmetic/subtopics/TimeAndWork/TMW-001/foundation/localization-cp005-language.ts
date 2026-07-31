import { equals, formatRational, rational, toMixedLatex } from "./rational";
import type { Rational } from "./types";
import type { TmwCp005GeneratedQuestion, TmwCp005Parameters } from "./cp005-types";
import type { TmwLocalizedLanguage } from "./localization-types";

export function cp005Copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
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
  "a scheduled production run": { hi: "निर्धारित उत्पादन चक्र", pa: "ਨਿਰਧਾਰਤ ਉਤਪਾਦਨ ਚੱਕਰ" },
};

const outputCopy: Record<string, { hi: string; pa: string }> = {
  records: { hi: "रिकॉर्ड", pa: "ਰਿਕਾਰਡ" },
  components: { hi: "पुर्जे", pa: "ਪੁਰਜ਼ੇ" },
  applications: { hi: "आवेदन", pa: "ਅਰਜ਼ੀਆਂ" },
  copies: { hi: "प्रतियाँ", pa: "ਕਾਪੀਆਂ" },
  metres: { hi: "मीटर", pa: "ਮੀਟਰ" },
  packages: { hi: "पैकेट", pa: "ਪੈਕੇਟ" },
  units: { hi: "इकाइयाँ", pa: "ਇਕਾਈਆਂ" },
  pages: { hi: "पृष्ठ", pa: "ਸਫ਼ੇ" },
  "square metres": { hi: "वर्ग मीटर", pa: "ਵਰਗ ਮੀਟਰ" },
  items: { hi: "वस्तुएँ", pa: "ਵਸਤੂਆਂ" },
  plots: { hi: "भूखंड", pa: "ਪਲਾਟ" },
};

export function cp005Actor(
  parameters: TmwCp005Parameters,
  language: TmwLocalizedLanguage,
  key: "actorA" | "actorB" | "actorC",
): string {
  const source = parameters.context[key];
  const match = /^(.*) ([ABC])$/.exec(source);
  if (!match) return source;
  const noun = actorCopy[match[1]]?.[language] ?? match[1];
  return `${noun} ${match[2]}`;
}

export function cp005Job(parameters: TmwCp005Parameters, language: TmwLocalizedLanguage): string {
  return jobCopy[parameters.context.jobPhrase]?.[language] ?? parameters.context.jobPhrase;
}

export function cp005OutputNoun(parameters: TmwCp005Parameters, language: TmwLocalizedLanguage): string {
  const source = parameters.outputUnit ?? parameters.context.outputNoun;
  return outputCopy[source]?.[language] ?? source;
}

export function cp005MathValue(value: Rational): string {
  if (value.denominator === 1) return String(value.numerator);
  return `\\(${toMixedLatex(value)}\\)`;
}

function unitName(unit: string, language: TmwLocalizedLanguage): string {
  if (unit === "hour") return cp005Copy(language, "घंटा", "ਘੰਟਾ");
  if (unit === "minute") return cp005Copy(language, "मिनट", "ਮਿੰਟ");
  if (unit === "shift") return cp005Copy(language, "पाली", "ਸ਼ਿਫ਼ਟ");
  return cp005Copy(language, "दिन", "ਦਿਨ");
}

function obliqueUnit(unit: string, language: TmwLocalizedLanguage): string {
  if (unit === "hour") return cp005Copy(language, "घंटों", "ਘੰਟਿਆਂ");
  if (unit === "minute") return cp005Copy(language, "मिनटों", "ਮਿੰਟਾਂ");
  if (unit === "shift") return cp005Copy(language, "पालियों", "ਸ਼ਿਫ਼ਟਾਂ");
  return cp005Copy(language, "दिनों", "ਦਿਨਾਂ");
}

export function cp005Time(parameters: TmwCp005Parameters, value: Rational, language: TmwLocalizedLanguage): string {
  return `${cp005MathValue(value)} ${unitName(parameters.timeUnit, language)}`;
}

export function cp005Hours(value: Rational, language: TmwLocalizedLanguage): string {
  return `${cp005MathValue(value)} ${unitName("hour", language)}`;
}

export function cp005TimeIn(parameters: TmwCp005Parameters, value: Rational, language: TmwLocalizedLanguage): string {
  if (equals(value, rational(1))) {
    return `${cp005MathValue(value)} ${unitName(parameters.timeUnit, language)} ${cp005Copy(language, "में", "ਵਿੱਚ")}`;
  }
  return `${cp005MathValue(value)} ${obliqueUnit(parameters.timeUnit, language)} ${cp005Copy(language, "में", "ਵਿੱਚ")}`;
}

export function cp005HoursIn(value: Rational, language: TmwLocalizedLanguage): string {
  if (equals(value, rational(1))) return `${cp005MathValue(value)} ${unitName("hour", language)} ${cp005Copy(language, "में", "ਵਿੱਚ")}`;
  return `${cp005MathValue(value)} ${obliqueUnit("hour", language)} ${cp005Copy(language, "में", "ਵਿੱਚ")}`;
}

export function cp005TimeFor(parameters: TmwCp005Parameters, value: Rational, language: TmwLocalizedLanguage): string {
  return `${cp005Time(parameters, value, language)} ${cp005Copy(language, "तक", "ਲਈ")}`;
}

export function cp005Ordinal(value: number, language: TmwLocalizedLanguage): string {
  return language === "hi" ? `${value}वें` : `${value}ਵੇਂ`;
}

export function cp005Label(
  label: string,
  parameters: TmwCp005Parameters,
  language: TmwLocalizedLanguage,
): string {
  const actors = ["actorA", "actorB", "actorC"] as const;
  for (const key of actors) {
    if (label === parameters.context[key]) return cp005Actor(parameters, language, key);
  }
  const pair = `${parameters.context.actorA} + ${parameters.context.actorB}`;
  if (label === pair) return `${cp005Actor(parameters, language, "actorA")} + ${cp005Actor(parameters, language, "actorB")}`;
  if (label === "Rest day") return cp005Copy(language, "विश्राम दिवस", "ਆਰਾਮ ਦਾ ਦਿਨ");
  if (label === "Saturday") return cp005Copy(language, "शनिवार", "ਸ਼ਨੀਵਾਰ");
  if (label === "Sunday") return cp005Copy(language, "रविवार", "ਐਤਵਾਰ");
  if (label === "Cannot be determined") return cp005Copy(language, "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ");
  return label;
}

export function cp005WorkRate(value: Rational, parameters: TmwCp005Parameters, language: TmwLocalizedLanguage): string {
  const unit = parameters.timeUnit === "hour"
    ? cp005Copy(language, "प्रति घंटा", "ਪ੍ਰਤੀ ਘੰਟਾ")
    : cp005Copy(language, "प्रति दिन", "ਪ੍ਰਤੀ ਦਿਨ");
  return cp005Copy(
    language,
    `पूरे काम का ${cp005MathValue(value)} भाग ${unit}`,
    `ਪੂਰੇ ਕੰਮ ਦਾ ${cp005MathValue(value)} ਹਿੱਸਾ ${unit}`,
  );
}

export function cp005LocalizedAnswerText(
  source: TmwCp005GeneratedQuestion,
  value: Rational | string,
  language: TmwLocalizedLanguage,
): string {
  if (typeof value === "string") return cp005Label(value, source.parameters, language);
  switch (source.solution.answerType) {
    case "TIME":
      return cp005Time(source.parameters, value, language);
    case "FRACTION":
      return cp005Copy(language, `काम का ${cp005MathValue(value)} भाग`, `ਕੰਮ ਦਾ ${cp005MathValue(value)} ਹਿੱਸਾ`);
    case "COUNT":
      return cp005Copy(language, `${formatRational(value)} चक्र`, `${formatRational(value)} ਚੱਕਰ`);
    case "RATE":
      return cp005WorkRate(value, source.parameters, language);
    case "OUTPUT":
      return `${formatRational(value)} ${cp005OutputNoun(source.parameters, language)}`;
    case "AGENT":
      return cp005Label(String(value), source.parameters, language);
  }
}
