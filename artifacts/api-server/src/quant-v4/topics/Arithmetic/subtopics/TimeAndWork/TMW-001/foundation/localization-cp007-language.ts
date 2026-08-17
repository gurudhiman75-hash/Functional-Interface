import { equals, rational, toMixedLatex } from "./rational";
import type { Rational } from "./types";
import type { TmwCp007GeneratedQuestion, TmwCp007Parameters } from "./cp007-types";
import type { TmwLocalizedLanguage } from "./localization-types";

type Pair = { hi: string; pa: string };

const copy: Record<string, Pair> = {
  "a road-repair contract": { hi: "सड़क-मरम्मत का काम", pa: "ਸੜਕ ਮੁਰੰਮਤ ਦਾ ਕੰਮ" },
  "a component-assembly order": { hi: "पुर्ज़ों की असेंबली का ऑर्डर", pa: "ਪੁਰਜ਼ਿਆਂ ਦੀ ਅਸੈਂਬਲੀ ਦਾ ਆਰਡਰ" },
  "a document-processing assignment": { hi: "दस्तावेज़ प्रसंस्करण का काम", pa: "ਦਸਤਾਵੇਜ਼ ਪ੍ਰਕਿਰਿਆ ਦਾ ਕੰਮ" },
  "a painting contract": { hi: "रंगाई का काम", pa: "ਰੰਗ ਕਰਨ ਦਾ ਕੰਮ" },
  "a production order": { hi: "उत्पादन का ऑर्डर", pa: "ਉਤਪਾਦਨ ਦਾ ਆਰਡਰ" },
  "a printing order": { hi: "छपाई का ऑर्डर", pa: "ਛਪਾਈ ਦਾ ਆਰਡਰ" },
  "a bottling order": { hi: "बोतल भरने का ऑर्डर", pa: "ਬੋਤਲਾਂ ਭਰਨ ਦਾ ਆਰਡਰ" },
  "a repair contract": { hi: "मरम्मत का काम", pa: "ਮੁਰੰਮਤ ਦਾ ਕੰਮ" },
  "a verification assignment": { hi: "सत्यापन का काम", pa: "ਤਸਦੀਕ ਦਾ ਕੰਮ" },

  man: { hi: "पुरुष श्रमिक", pa: "ਮਰਦ ਮਜ਼ਦੂਰ" },
  men: { hi: "पुरुष श्रमिक", pa: "ਮਰਦ ਮਜ਼ਦੂਰ" },
  woman: { hi: "महिला श्रमिक", pa: "ਮਹਿਲਾ ਮਜ਼ਦੂਰ" },
  women: { hi: "महिला श्रमिक", pa: "ਮਹਿਲਾ ਮਜ਼ਦੂਰ" },
  child: { hi: "बाल श्रमिक", pa: "ਬਾਲ ਮਜ਼ਦੂਰ" },
  children: { hi: "बाल श्रमिक", pa: "ਬਾਲ ਮਜ਼ਦੂਰ" },
  "skilled worker": { hi: "कुशल श्रमिक", pa: "ਕੁਸ਼ਲ ਮਜ਼ਦੂਰ" },
  "skilled workers": { hi: "कुशल श्रमिक", pa: "ਕੁਸ਼ਲ ਮਜ਼ਦੂਰ" },
  "unskilled worker": { hi: "अकुशल श्रमिक", pa: "ਅਕੁਸ਼ਲ ਮਜ਼ਦੂਰ" },
  "unskilled workers": { hi: "अकुशल श्रमिक", pa: "ਅਕੁਸ਼ਲ ਮਜ਼ਦੂਰ" },
  trainee: { hi: "प्रशिक्षु", pa: "ਸਿਖਿਆਰਥੀ" },
  trainees: { hi: "प्रशिक्षु", pa: "ਸਿਖਿਆਰਥੀ" },
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
  "heavy machine": { hi: "भारी मशीन", pa: "ਭਾਰੀ ਮਸ਼ੀਨ" },
  "heavy machines": { hi: "भारी मशीनें", pa: "ਭਾਰੀ ਮਸ਼ੀਨਾਂ" },
  "standard machine": { hi: "मानक मशीन", pa: "ਮਿਆਰੀ ਮਸ਼ੀਨ" },
  "standard machines": { hi: "मानक मशीनें", pa: "ਮਿਆਰੀ ਮਸ਼ੀਨਾਂ" },
  "compact machine": { hi: "छोटी मशीन", pa: "ਛੋਟੀ ਮਸ਼ੀਨ" },
  "compact machines": { hi: "छोटी मशीनें", pa: "ਛੋਟੀਆਂ ਮਸ਼ੀਨਾਂ" },
  "fast machine": { hi: "तेज़ मशीन", pa: "ਤੇਜ਼ ਮਸ਼ੀਨ" },
  "fast machines": { hi: "तेज़ मशीनें", pa: "ਤੇਜ਼ ਮਸ਼ੀਨਾਂ" },
  "high-speed printer": { hi: "तेज़ प्रिंटर", pa: "ਤੇਜ਼ ਪ੍ਰਿੰਟਰ" },
  "high-speed printers": { hi: "तेज़ प्रिंटर", pa: "ਤੇਜ਼ ਪ੍ਰਿੰਟਰ" },
  "standard printer": { hi: "मानक प्रिंटर", pa: "ਮਿਆਰੀ ਪ੍ਰਿੰਟਰ" },
  "standard printers": { hi: "मानक प्रिंटर", pa: "ਮਿਆਰੀ ਪ੍ਰਿੰਟਰ" },
  "desktop printer": { hi: "डेस्कटॉप प्रिंटर", pa: "ਡੈਸਕਟਾਪ ਪ੍ਰਿੰਟਰ" },
  "desktop printers": { hi: "डेस्कटॉप प्रिंटर", pa: "ਡੈਸਕਟਾਪ ਪ੍ਰਿੰਟਰ" },
  "automatic line": { hi: "स्वचालित बोतल लाइन", pa: "ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨ" },
  "automatic lines": { hi: "स्वचालित बोतल लाइनें", pa: "ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ" },
  "semi-automatic line": { hi: "अर्ध-स्वचालित बोतल लाइन", pa: "ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨ" },
  "semi-automatic lines": { hi: "अर्ध-स्वचालित बोतल लाइनें", pa: "ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ" },
  "manual station": { hi: "हाथ से चलने वाला स्टेशन", pa: "ਹੱਥ ਨਾਲ ਚੱਲਣ ਵਾਲਾ ਸਟੇਸ਼ਨ" },
  "manual stations": { hi: "हाथ से चलने वाले स्टेशन", pa: "ਹੱਥ ਨਾਲ ਚੱਲਣ ਵਾਲੇ ਸਟੇਸ਼ਨ" },

  "work units": { hi: "कार्य-इकाइयाँ", pa: "ਕੰਮ-ਇਕਾਈਆਂ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ" },
  files: { hi: "फाइलें", pa: "ਫਾਈਲਾਂ" },
  copies: { hi: "प्रतियाँ", pa: "ਕਾਪੀਆਂ" },
  bottles: { hi: "बोतलें", pa: "ਬੋਤਲਾਂ" },
  "whole job": { hi: "पूरा काम", pa: "ਪੂਰਾ ਕੰਮ" },

  "man-days": { hi: "पुरुष-श्रमिक-दिन", pa: "ਮਰਦ-ਮਜ਼ਦੂਰ-ਦਿਨ" },
  "woman-days": { hi: "महिला-श्रमिक-दिन", pa: "ਮਹਿਲਾ-ਮਜ਼ਦੂਰ-ਦਿਨ" },
  "child-days": { hi: "बाल-श्रमिक-दिन", pa: "ਬਾਲ-ਮਜ਼ਦੂਰ-ਦਿਨ" },
  "skilled-worker-days": { hi: "कुशल-श्रमिक-दिन", pa: "ਕੁਸ਼ਲ-ਮਜ਼ਦੂਰ-ਦਿਨ" },
  "unskilled-worker-days": { hi: "अकुशल-श्रमिक-दिन", pa: "ਅਕੁਸ਼ਲ-ਮਜ਼ਦੂਰ-ਦਿਨ" },
  "trainee-days": { hi: "प्रशिक्षु-दिन", pa: "ਸਿਖਿਆਰਥੀ-ਦਿਨ" },
  "senior-clerk-days": { hi: "वरिष्ठ-क्लर्क-दिन", pa: "ਸੀਨੀਅਰ-ਕਲਰਕ-ਦਿਨ" },
  "junior-clerk-days": { hi: "कनिष्ठ-क्लर्क-दिन", pa: "ਜੂਨੀਅਰ-ਕਲਰਕ-ਦਿਨ" },
  "assistant-days": { hi: "सहायक-दिन", pa: "ਸਹਾਇਕ-ਦਿਨ" },
  "master-painter-days": { hi: "मुख्य-पेंटर-दिन", pa: "ਮੁੱਖ-ਪੇਂਟਰ-ਦਿਨ" },
  "painter-days": { hi: "पेंटर-दिन", pa: "ਪੇਂਟਰ-ਦਿਨ" },
  "helper-days": { hi: "सहायक-श्रमिक-दिन", pa: "ਸਹਾਇਕ-ਮਜ਼ਦੂਰ-ਦਿਨ" },
  "heavy-machine-hours": { hi: "भारी-मशीन-घंटे", pa: "ਭਾਰੀ-ਮਸ਼ੀਨ-ਘੰਟੇ" },
  "standard-machine-hours": { hi: "मानक-मशीन-घंटे", pa: "ਮਿਆਰੀ-ਮਸ਼ੀਨ-ਘੰਟੇ" },
  "compact-machine-hours": { hi: "छोटी-मशीन-घंटे", pa: "ਛੋਟੀ-ਮਸ਼ੀਨ-ਘੰਟੇ" },
  "fast-machine-hours": { hi: "तेज़-मशीन-घंटे", pa: "ਤੇਜ਼-ਮਸ਼ੀਨ-ਘੰਟੇ" },
  "high-speed-printer-hours": { hi: "तेज़-प्रिंटर-घंटे", pa: "ਤੇਜ਼-ਪ੍ਰਿੰਟਰ-ਘੰਟੇ" },
  "standard-printer-hours": { hi: "मानक-प्रिंटर-घंटे", pa: "ਮਿਆਰੀ-ਪ੍ਰਿੰਟਰ-ਘੰਟੇ" },
  "desktop-printer-hours": { hi: "डेस्कटॉप-प्रिंटर-घंटे", pa: "ਡੈਸਕਟਾਪ-ਪ੍ਰਿੰਟਰ-ਘੰਟੇ" },
  "automatic-line-hours": { hi: "स्वचालित-लाइन-घंटे", pa: "ਆਟੋਮੈਟਿਕ-ਲਾਈਨ-ਘੰਟੇ" },
  "semi-automatic-line-hours": { hi: "अर्ध-स्वचालित-लाइन-घंटे", pa: "ਅਰਧ-ਆਟੋਮੈਟਿਕ-ਲਾਈਨ-ਘੰਟੇ" },
  "manual-station-hours": { hi: "मैनुअल-स्टेशन-घंटे", pa: "ਮੈਨੂਅਲ-ਸਟੇਸ਼ਨ-ਘੰਟੇ" },
};

export function cp007Copy(value: string, language: TmwLocalizedLanguage): string {
  return copy[value]?.[language] ?? value;
}

export function cp007Number(value: Rational): string {
  if (value.denominator === 1) return String(value.numerator);
  return `\\(${toMixedLatex(value)}\\)`;
}

export function cp007IsHourly(parameters: TmwCp007Parameters): boolean {
  return parameters.context.categories.every((category) => category.resourceTimeUnit.endsWith("hours"));
}

export function cp007Category(
  parameters: TmwCp007Parameters,
  index: number,
  value: Rational,
  language: TmwLocalizedLanguage,
): string {
  const category = parameters.context.categories[index];
  const raw = equals(value, rational(1)) ? category.singular : category.plural;
  return cp007Copy(raw, language);
}

export function cp007Count(
  parameters: TmwCp007Parameters,
  index: number,
  value: Rational,
  language: TmwLocalizedLanguage,
): string {
  return `${cp007Number(value)} ${cp007Category(parameters, index, value, language)}`;
}

export function cp007Group(
  parameters: TmwCp007Parameters,
  values: [Rational, Rational, Rational],
  language: TmwLocalizedLanguage,
): string {
  const parts = values
    .map((value, index) => value.numerator === 0 ? null : cp007Count(parameters, index, value, language))
    .filter((value): value is string => value !== null);
  const joiner = language === "hi" ? " और " : " ਅਤੇ ";
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")}${joiner}${parts[parts.length - 1]}`;
}

export function cp007Time(
  parameters: TmwCp007Parameters,
  value: Rational,
  language: TmwLocalizedLanguage,
): string {
  const number = cp007Number(value);
  if (cp007IsHourly(parameters)) return `${number} ${language === "hi" ? "घंटे" : "ਘੰਟੇ"}`;
  return `${number} ${language === "hi" ? "दिन" : "ਦਿਨ"}`;
}

export function cp007Rate(
  parameters: TmwCp007Parameters,
  value: Rational,
  language: TmwLocalizedLanguage,
): string {
  const output = cp007Copy(parameters.context.outputUnit, language);
  const unit = cp007IsHourly(parameters)
    ? language === "hi" ? "प्रति घंटा" : "ਪ੍ਰਤੀ ਘੰਟਾ"
    : language === "hi" ? "प्रतिदिन" : "ਪ੍ਰਤੀ ਦਿਨ";
  return `${cp007Number(value)} ${output} ${unit}`;
}

export function parseTmwCp007AnswerKey(key: string): Rational[] {
  return key.split("|").map((part) => {
    const [numerator, denominator] = part.split("/").map(Number);
    return rational(numerator, denominator);
  });
}

function ratioText(values: Rational[]): string {
  return values.map((value) => String(Math.abs(value.numerator))).join(":");
}

export function cp007LocalizedAnswerText(
  source: TmwCp007GeneratedQuestion,
  values: Rational[],
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const first = values[0];
  const target = p.targetCategoryIndex ?? p.replacementCategoryIndex ?? 0;
  switch (source.solution.answerType) {
    case "COUNT":
      return cp007Count(p, target, first, language);
    case "TIME":
      return cp007Time(p, first, language);
    case "RATE":
      return cp007Rate(p, first, language);
    case "RATIO":
    case "TRIPLE_RATIO":
      return ratioText(values);
    case "COUNT_PAIR":
      return language === "hi"
        ? `${cp007Count(p, 0, values[0], language)} और ${cp007Count(p, 1, values[1], language)}`
        : `${cp007Count(p, 0, values[0], language)} ਅਤੇ ${cp007Count(p, 1, values[1], language)}`;
    case "WORK":
      return `${cp007Number(first)} ${cp007Copy(p.context.outputUnit, language)}`;
    case "FRACTION":
      return language === "hi"
        ? `कुल काम का ${cp007Number(first)} भाग`
        : `ਕੁੱਲ ਕੰਮ ਦਾ ${cp007Number(first)} ਹਿੱਸਾ`;
    case "RESOURCE_TIME":
      return language === "hi"
        ? `${cp007Number(first)} समतुल्य ${cp007Copy(p.context.categories[target].resourceTimeUnit, language)}`
        : `${cp007Number(first)} ਬਰਾਬਰ ${cp007Copy(p.context.categories[target].resourceTimeUnit, language)}`;
  }
}
