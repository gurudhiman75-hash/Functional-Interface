import type { PncStudentLocale } from "./localization-types";

const numberFormatter = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

const UNIT_LABELS: Record<string, Record<PncStudentLocale, { singular: string; plural: string }>> = {
  ways: {
    "hi-IN": { singular: "तरीका", plural: "तरीके" },
    "pa-IN": { singular: "ਤਰੀਕਾ", plural: "ਤਰੀਕੇ" },
  },
  arrangements: {
    "hi-IN": { singular: "तरीका", plural: "तरीके" },
    "pa-IN": { singular: "ਤਰੀਕਾ", plural: "ਤਰੀਕੇ" },
  },
  seatings: {
    "hi-IN": { singular: "बैठने का तरीका", plural: "बैठने के तरीके" },
    "pa-IN": { singular: "ਬੈਠਣ ਦਾ ਤਰੀਕਾ", plural: "ਬੈਠਣ ਦੇ ਤਰੀਕੇ" },
  },
  selections: {
    "hi-IN": { singular: "चयन", plural: "चयन" },
    "pa-IN": { singular: "ਚੋਣ", plural: "ਚੋਣਾਂ" },
  },
  distributions: {
    "hi-IN": { singular: "वितरण", plural: "वितरण" },
    "pa-IN": { singular: "ਵੰਡ", plural: "ਵੰਡਾਂ" },
  },
  paths: {
    "hi-IN": { singular: "मार्ग", plural: "मार्ग" },
    "pa-IN": { singular: "ਰਸਤਾ", plural: "ਰਸਤੇ" },
  },
  permutations: {
    "hi-IN": { singular: "क्रम-विन्यास", plural: "क्रम-विन्यास" },
    "pa-IN": { singular: "ਕ੍ਰਮ-ਵਿਨਿਆਸ", plural: "ਕ੍ਰਮ-ਵਿਨਿਆਸ" },
  },
  groupings: {
    "hi-IN": { singular: "समूह बनाने का तरीका", plural: "समूह बनाने के तरीके" },
    "pa-IN": { singular: "ਗਰੁੱਪ ਬਣਾਉਣ ਦਾ ਤਰੀਕਾ", plural: "ਗਰੁੱਪ ਬਣਾਉਣ ਦੇ ਤਰੀਕੇ" },
  },
  people: {
    "hi-IN": { singular: "व्यक्ति", plural: "व्यक्ति" },
    "pa-IN": { singular: "ਵਿਅਕਤੀ", plural: "ਵਿਅਕਤੀ" },
  },
  objects: {
    "hi-IN": { singular: "वस्तु", plural: "वस्तुएँ" },
    "pa-IN": { singular: "ਵਸਤੂ", plural: "ਵਸਤੂਆਂ" },
  },
  positions: {
    "hi-IN": { singular: "स्थान", plural: "स्थान" },
    "pa-IN": { singular: "ਥਾਂ", plural: "ਥਾਵਾਂ" },
  },
  members: {
    "hi-IN": { singular: "सदस्य", plural: "सदस्य" },
    "pa-IN": { singular: "ਮੈਂਬਰ", plural: "ਮੈਂਬਰ" },
  },
  receivers: {
    "hi-IN": { singular: "प्राप्तकर्ता", plural: "प्राप्तकर्ता" },
    "pa-IN": { singular: "ਪ੍ਰਾਪਤਕਰਤਾ", plural: "ਪ੍ਰਾਪਤਕਰਤਾ" },
  },
  values: {
    "hi-IN": { singular: "मान", plural: "मान" },
    "pa-IN": { singular: "ਮੁੱਲ", plural: "ਮੁੱਲ" },
  },
  "people per group": {
    "hi-IN": { singular: "प्रति समूह व्यक्ति", plural: "प्रति समूह व्यक्ति" },
    "pa-IN": { singular: "ਹਰ ਗਰੁੱਪ ਵਿੱਚ ਵਿਅਕਤੀ", plural: "ਹਰ ਗਰੁੱਪ ਵਿੱਚ ਵਿਅਕਤੀ" },
  },
};

export function localeLanguage(locale: PncStudentLocale): "hi" | "pa" {
  return locale === "hi-IN" ? "hi" : "pa";
}

export function parsePositiveInteger(value: string): number {
  const numeric = Number(value.replace(/,/g, "").trim());
  if (!Number.isSafeInteger(numeric) || numeric <= 0) {
    throw new Error(`PNC localized option is not a positive integer: ${value}`);
  }
  return numeric;
}

export function localizedUnitLabel(unit: string, numeric: number, locale: PncStudentLocale): string {
  const labels = UNIT_LABELS[unit];
  if (!labels) throw new Error(`PNC localization is missing unit mapping for ${unit}`);
  return numeric === 1 ? labels[locale].singular : labels[locale].plural;
}

export function formatLocalizedOption(value: string, unit: string, locale: PncStudentLocale): string {
  const numeric = parsePositiveInteger(value);
  return `${numberFormatter.format(numeric)} ${localizedUnitLabel(unit, numeric, locale)}`;
}

export function localizedSectionHeading(
  kind: "stepByStep" | "examSpeedShortcut" | "commonTrapWarning",
  locale: PncStudentLocale,
): string {
  if (locale === "hi-IN") {
    if (kind === "stepByStep") return "📝 चरण-दर-चरण हल";
    if (kind === "examSpeedShortcut") return "⚡ परीक्षा में तेज़ तरीका";
    return "⚠️ सामान्य गलतियाँ";
  }
  if (kind === "stepByStep") return "📝 ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ";
  if (kind === "examSpeedShortcut") return "⚡ ਪੇਪਰ ਵਿੱਚ ਤੇਜ਼ ਤਰੀਕਾ";
  return "⚠️ ਆਮ ਗਲਤੀਆਂ";
}
