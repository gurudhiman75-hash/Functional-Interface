import { equals, formatRational, rational } from "./rational";
import type { Rational } from "./types";
import type { TmwCp008GeneratedQuestion, TmwCp008Parameters } from "./cp008-types";
import type { TmwLocalizedLanguage } from "./localization-types";

type Pair = { hi: string; pa: string };

const copy: Record<string, Pair> = {
  "a warehouse distribution centre": { hi: "गोदाम वितरण केंद्र", pa: "ਗੋਦਾਮ ਵੰਡ ਕੇਂਦਰ" },
  "a bank document-verification centre": { hi: "बैंक दस्तावेज़ सत्यापन केंद्र", pa: "ਬੈਂਕ ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਕੇਂਦਰ" },
  "a commercial-complex painting site": { hi: "वाणिज्यिक परिसर की रंगाई साइट", pa: "ਵਪਾਰਕ ਕੰਪਲੈਕਸ ਦੀ ਰੰਗਾਈ ਸਾਈਟ" },
  "an auto-component factory": { hi: "ऑटो-पुर्जा कारखाना", pa: "ਆਟੋ-ਪੁਰਜ਼ਾ ਫੈਕਟਰੀ" },
  "a large dispatch order": { hi: "बड़ा प्रेषण ऑर्डर", pa: "ਵੱਡਾ ਡਿਸਪੈਚ ਆਰਡਰ" },
  "a loan-file verification batch": { hi: "ऋण-फाइल सत्यापन बैच", pa: "ਕਰਜ਼ਾ-ਫਾਈਲ ਤਸਦੀਕ ਬੈਚ" },
  "a painting contract": { hi: "रंगाई का ठेका", pa: "ਰੰਗਾਈ ਦਾ ਠੇਕਾ" },
  "a component-assembly order": { hi: "पुर्जा-असेंबली ऑर्डर", pa: "ਪੁਰਜ਼ਾ-ਅਸੈਂਬਲੀ ਆਰਡਰ" },
  packages: { hi: "पैकेट", pa: "ਪੈਕੇਟ" },
  files: { hi: "फाइलें", pa: "ਫਾਈਲਾਂ" },
  "square metres": { hi: "वर्ग मीटर", pa: "ਵਰਗ ਮੀਟਰ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ" },
  packer: { hi: "पैकिंग कर्मचारी", pa: "ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ" },
  packers: { hi: "पैकिंग कर्मचारी", pa: "ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ" },
  "quality checker": { hi: "गुणवत्ता जाँचकर्ता", pa: "ਗੁਣਵੱਤਾ ਜਾਂਚਕਰਤਾ" },
  "quality checkers": { hi: "गुणवत्ता जाँचकर्ता", pa: "ਗੁਣਵੱਤਾ ਜਾਂਚਕਰਤਾ" },
  loader: { hi: "लोडिंग कर्मचारी", pa: "ਲੋਡਿੰਗ ਕਰਮਚਾਰੀ" },
  loaders: { hi: "लोडिंग कर्मचारी", pa: "ਲੋਡਿੰਗ ਕਰਮਚਾਰੀ" },
  "senior clerk": { hi: "वरिष्ठ क्लर्क", pa: "ਸੀਨੀਅਰ ਕਲਰਕ" },
  "senior clerks": { hi: "वरिष्ठ क्लर्क", pa: "ਸੀਨੀਅਰ ਕਲਰਕ" },
  "junior clerk": { hi: "कनिष्ठ क्लर्क", pa: "ਜੂਨੀਅਰ ਕਲਰਕ" },
  "junior clerks": { hi: "कनिष्ठ क्लर्क", pa: "ਜੂਨੀਅਰ ਕਲਰਕ" },
  assistant: { hi: "सहायक", pa: "ਸਹਾਇਕ" },
  assistants: { hi: "सहायक", pa: "ਸਹਾਇਕ" },
  "master painter": { hi: "मुख्य पेंटर", pa: "ਮੁੱਖ ਪੇਂਟਰ" },
  "master painters": { hi: "मुख्य पेंटर", pa: "ਮੁੱਖ ਪੇਂਟਰ" },
  painter: { hi: "पेंटर", pa: "ਪੇਂਟਰ" },
  painters: { hi: "पेंटर", pa: "ਪੇਂਟਰ" },
  helper: { hi: "सहायक श्रमिक", pa: "ਸਹਾਇਕ ਮਜ਼ਦੂਰ" },
  helpers: { hi: "सहायक श्रमिक", pa: "ਸਹਾਇਕ ਮਜ਼ਦੂਰ" },
  technician: { hi: "तकनीशियन", pa: "ਟੈਕਨੀਸ਼ੀਅਨ" },
  technicians: { hi: "तकनीशियन", pa: "ਟੈਕਨੀਸ਼ੀਅਨ" },
  assembler: { hi: "असेंबली कर्मचारी", pa: "ਅਸੈਂਬਲੀ ਕਰਮਚਾਰੀ" },
  assemblers: { hi: "असेंबली कर्मचारी", pa: "ਅਸੈਂਬਲੀ ਕਰਮਚਾਰੀ" },
  trainee: { hi: "प्रशिक्षु", pa: "ਸਿਖਿਆਰਥੀ" },
  trainees: { hi: "प्रशिक्षु", pa: "ਸਿਖਿਆਰਥੀ" },
};

const names: Record<string, Pair> = {
  Asha: { hi: "आशा", pa: "ਆਸ਼ਾ" },
  Bharat: { hi: "भरत", pa: "ਭਰਤ" },
  Charan: { hi: "चरण", pa: "ਚਰਨ" },
  Meera: { hi: "मीरा", pa: "ਮੀਰਾ" },
  Rohan: { hi: "रोहन", pa: "ਰੋਹਨ" },
  Simran: { hi: "सिमरन", pa: "ਸਿਮਰਨ" },
  Kavita: { hi: "कविता", pa: "ਕਵਿਤਾ" },
  Mohan: { hi: "मोहन", pa: "ਮੋਹਨ" },
  Neeraj: { hi: "नीरज", pa: "ਨੀਰਜ" },
  Priya: { hi: "प्रिया", pa: "ਪ੍ਰਿਆ" },
  Raj: { hi: "राज", pa: "ਰਾਜ" },
  Sonia: { hi: "सोनिया", pa: "ਸੋਨੀਆ" },
};

export function cp008Copy(value: string, language: TmwLocalizedLanguage): string {
  return copy[value]?.[language] ?? value;
}

export function cp008Name(value: string, language: TmwLocalizedLanguage): string {
  return names[value]?.[language] ?? value;
}

export function cp008Number(value: Rational): string {
  return formatRational(value);
}

function indianInteger(value: number): string {
  const sign = value < 0 ? "-" : "";
  const digits = String(Math.abs(value));
  if (digits.length <= 3) return `${sign}${digits}`;
  const tail = digits.slice(-3);
  const head = digits.slice(0, -3);
  const groups: string[] = [];
  for (let end = head.length; end > 0; end -= 2) {
    groups.unshift(head.slice(Math.max(0, end - 2), end));
  }
  return `${sign}${groups.join(",")},${tail}`;
}

export function cp008Money(value: Rational): string {
  return value.denominator === 1 ? `₹${indianInteger(value.numerator)}` : `₹${cp008Number(value)}`;
}

export function parseTmwCp008AnswerKey(key: string): Rational[] {
  return key.split("|").map((part) => {
    const [numerator, denominator] = part.split("/").map(Number);
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
      throw new Error(`Invalid CP-008 answer key: ${key}`);
    }
    return rational(numerator, denominator);
  });
}

export function cp008Output(
  parameters: TmwCp008Parameters,
  value: Rational,
  language: TmwLocalizedLanguage,
): string {
  const unit = cp008Copy(parameters.context.outputUnit, language);
  if (parameters.context.outputUnit === "files" && equals(value, rational(1))) {
    return language === "hi" ? "फाइल" : "ਫਾਈਲ";
  }
  if (parameters.context.outputUnit === "components" && equals(value, rational(1))) {
    return language === "hi" ? "पुर्ज़ा" : "ਪੁਰਜ਼ਾ";
  }
  return unit;
}

export function cp008Role(
  parameters: TmwCp008Parameters,
  index: number,
  language: TmwLocalizedLanguage,
  plural = false,
): string {
  const role = parameters.context.roles[index];
  return cp008Copy(plural ? role.pluralRole : role.role, language);
}

export function cp008LocalizedAnswerText(
  source: TmwCp008GeneratedQuestion,
  values: Rational[],
  language: TmwLocalizedLanguage,
): string {
  const first = values[0];
  switch (source.solution.answerType) {
    case "RATIO":
      return values.map((value) => String(Math.abs(value.numerator))).join(":");
    case "MONEY":
      return cp008Money(first);
    case "MONEY_TRIPLE":
      return values.map(cp008Money).join(", ");
    case "TIME":
      return `${cp008Number(first)} ${language === "hi" ? "दिन" : "ਦਿਨ"}`;
    case "EFFICIENCY":
      return `${cp008Number(first)} ${cp008Output(source.parameters, first, language)} ${language === "hi" ? "प्रति घंटा" : "ਪ੍ਰਤੀ ਘੰਟਾ"}`;
  }
}
