import type { BlrRelationId } from "../../foundation/types";
import type { BlrCp003FinalApprovedRecord } from "../cp003-final-approved-bank";

export const BLR_CP003_LOCALIZATION_VERSION = "blr-cp003-hi-pa-localization-v1" as const;
export const BLR_CP003_MULTILINGUAL_RUNTIME_VERSION = "blr-cp003-shared-family-multilingual-v1" as const;

export type BlrCp003TranslatedLocale = "hi-IN" | "pa-IN";

type LocalePair = { readonly hi: string; readonly pa: string };

const RELATION_LABELS: Readonly<Record<BlrRelationId, LocalePair>> = {
  FATHER: { hi: "पिता", pa: "ਪਿਤਾ" },
  MOTHER: { hi: "माता", pa: "ਮਾਤਾ" },
  SON: { hi: "पुत्र", pa: "ਪੁੱਤਰ" },
  DAUGHTER: { hi: "पुत्री", pa: "ਧੀ" },
  BROTHER: { hi: "भाई", pa: "ਭਰਾ" },
  SISTER: { hi: "बहन", pa: "ਭੈਣ" },
  HUSBAND: { hi: "पति", pa: "ਪਤੀ" },
  WIFE: { hi: "पत्नी", pa: "ਪਤਨੀ" },
  GRANDFATHER: { hi: "दादा/नाना", pa: "ਦਾਦਾ/ਨਾਨਾ" },
  GRANDMOTHER: { hi: "दादी/नानी", pa: "ਦਾਦੀ/ਨਾਨੀ" },
  GRANDSON: { hi: "पोता/नाती", pa: "ਪੋਤਾ/ਦੋਹਤਾ" },
  GRANDDAUGHTER: { hi: "पोती/नातिन", pa: "ਪੋਤੀ/ਦੋਹਤੀ" },
  GREAT_GRANDFATHER: { hi: "परदादा/परनाना", pa: "ਪਰਦਾਦਾ/ਪਰਨਾਨਾ" },
  GREAT_GRANDMOTHER: { hi: "परदादी/परनानी", pa: "ਪਰਦਾਦੀ/ਪਰਨਾਨੀ" },
  GREAT_GRANDSON: { hi: "परपोता/परनाती", pa: "ਪਰਪੋਤਾ/ਪਰਦੋਹਤਾ" },
  GREAT_GRANDDAUGHTER: { hi: "परपोती/परनातिन", pa: "ਪਰਪੋਤੀ/ਪਰਦੋਹਤੀ" },
  UNCLE: { hi: "चाचा/मामा", pa: "ਚਾਚਾ/ਮਾਮਾ" },
  AUNT: { hi: "बुआ/मौसी", pa: "ਭੂਆ/ਮਾਸੀ" },
  NEPHEW: { hi: "भतीजा/भांजा", pa: "ਭਤੀਜਾ/ਭਾਣਜਾ" },
  NIECE: { hi: "भतीजी/भांजी", pa: "ਭਤੀਜੀ/ਭਾਣਜੀ" },
  COUSIN: { hi: "कज़िन", pa: "ਕਜ਼ਨ" },
  FATHER_IN_LAW: { hi: "ससुर", pa: "ਸਹੁਰਾ" },
  MOTHER_IN_LAW: { hi: "सास", pa: "ਸੱਸ" },
  SON_IN_LAW: { hi: "दामाद", pa: "ਜਵਾਈ" },
  DAUGHTER_IN_LAW: { hi: "बहू", pa: "ਨੂੰਹ" },
  BROTHER_IN_LAW: { hi: "बहनोई/साला", pa: "ਭੈਣੋਈ/ਸਾਲਾ" },
  SISTER_IN_LAW: { hi: "भाभी/साली", pa: "ਭਾਬੀ/ਸਾਲੀ" },
};

export function localizedBlrCp003RelationLabel(
  relationId: BlrRelationId,
  locale: BlrCp003TranslatedLocale,
): string {
  const pair = RELATION_LABELS[relationId];
  return locale === "hi-IN" ? pair.hi : pair.pa;
}

function localeText(locale: BlrCp003TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function joinNames(names: readonly string[], locale: BlrCp003TranslatedLocale): string {
  if (names.length <= 1) return names[0] ?? "";
  const and = locale === "hi-IN" ? " और " : " ਅਤੇ ";
  if (names.length === 2) return `${names[0]}${and}${names[1]}`;
  return `${names.slice(0, -1).join(", ")}${and}${names[names.length - 1]}`;
}

export function localizedBlrCp003OptionText(
  canonical: string,
  locale: BlrCp003TranslatedLocale,
): string {
  if (/^[A-Za-z]+ only$/.test(canonical)) {
    const name = canonical.replace(/ only$/, "");
    return localeText(locale, `केवल ${name}`, `ਕੇਵਲ ${name}`);
  }
  const names = canonical.split(/, | and /).map((value) => value.trim()).filter(Boolean);
  return names.length > 1 ? joinNames(names, locale) : canonical;
}

function namesInText(record: BlrCp003FinalApprovedRecord, text: string): string[] {
  return record.proceduralLogic.nodes
    .map((node) => node.label)
    .filter((label) => text.includes(label))
    .sort((left, right) => text.indexOf(left) - text.indexOf(right));
}

function requireName(names: readonly string[], index: number, prototypeId: string): string {
  const value = names[index];
  if (!value) throw new Error(`${prototypeId}: expected person name ${index + 1} in canonical stem.`);
  return value;
}

export function localizedBlrCp003Stem(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
): string {
  const p = namesInText(record, record.stem);
  const id = record.sourcePrototypeId;
  const hi = (value: string) => localeText(locale, value, "");
  const pa = (value: string) => localeText(locale, "", value);
  switch (id) {
    case "BLR-CP003-PROT-V8-BROTHER-PAIR":
      return localeText(locale, "निम्न में से कौन-सा युग्म दो भाइयों का है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਜੋੜਾ ਦੋ ਭਰਾਵਾਂ ਦਾ ਹੈ?");
    case "BLR-CP003-PROT-V8-COUSIN-PAIR":
      return localeText(locale, "निम्न में से कौन-सा युग्म कज़िन का है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਜੋੜਾ ਕਜ਼ਨ ਦਾ ਹੈ?");
    case "BLR-CP003-PROT-V8-IDENTIFY-UNMARRIED-RELATIVE": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} का अविवाहित चाचा/ताऊ कौन है?`, `${a} ਦਾ ਅਵਿਵਾਹਿਤ ਚਾਚਾ/ਤਾਇਆ ਕੌਣ ਹੈ?`);
    }
    case "BLR-CP003-PROT-V8-IN-LAW-SET": {
      if (p.length >= 2) return localeText(locale, `${p[0]} और ${p[1]} के सभी दामाद/बहू वाला विकल्प चुनिए।`, `${p[0]} ਅਤੇ ${p[1]} ਦੇ ਸਾਰੇ ਜਵਾਈ/ਨੂੰਹ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`);
      return localeText(locale, "सबसे ऊपर वाली पीढ़ी के दंपती के सभी दामाद/बहू वाला विकल्प चुनिए।", "ਸਭ ਤੋਂ ਉੱਪਰਲੀ ਪੀੜ੍ਹੀ ਦੇ ਜੋੜੇ ਦੇ ਸਾਰੇ ਜਵਾਈ/ਨੂੰਹ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।");
    }
    case "BLR-CP003-PROT-V8-PATERNAL-RELATIVE-SET": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के पिता के सभी भाई-बहन वाला विकल्प चुनिए।`, `${a} ਦੇ ਪਿਤਾ ਦੇ ਸਾਰੇ ਭਰਾ-ਭੈਣ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9-BROTHER-IN-LAW-PAIR":
      return localeText(locale, "वह युग्म चुनिए जिसमें एक पुरुष और उसकी पत्नी का भाई हो।", "ਉਹ ਜੋੜਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਇੱਕ ਪੁਰਸ਼ ਅਤੇ ਉਸ ਦੀ ਪਤਨੀ ਦਾ ਭਰਾ ਹੋਵੇ।");
    case "BLR-CP003-PROT-V9-COMPOSITE-REFERENCE-PAIR": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के पुरुष कज़िन और अविवाहित बुआ वाला युग्म चुनिए।`, `${a} ਦੇ ਪੁਰਸ਼ ਕਜ਼ਨ ਅਤੇ ਅਵਿਵਾਹਿਤ ਭੂਆ ਵਾਲਾ ਜੋੜਾ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9-DUAL-SIDE-COUSIN-PAIR": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} का एक पैतृक कज़िन और एक मातृ कज़िन वाला युग्म चुनिए।`, `${a} ਦਾ ਇੱਕ ਪਿਤਰੀ ਕਜ਼ਨ ਅਤੇ ਇੱਕ ਮਾਤਰੀ ਕਜ਼ਨ ਵਾਲਾ ਜੋੜਾ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9-FOUR-GRANDPARENT-SET": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के चारों दादा-दादी/नाना-नानी वाला विकल्प चुनिए।`, `${a} ਦੇ ਚਾਰੇ ਦਾਦਾ-ਦਾਦੀ/ਨਾਨਾ-ਨਾਨੀ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9-GREAT-GRANDMOTHER-EXACT-LINEAGE": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} → माता → पिता → पिता → पत्नी क्रम से मिलने वाला व्यक्ति कौन है?`, `${a} → ਮਾਤਾ → ਪਿਤਾ → ਪਿਤਾ → ਪਤਨੀ ਕ੍ਰਮ ਨਾਲ ਮਿਲਣ ਵਾਲਾ ਵਿਅਕਤੀ ਕੌਣ ਹੈ?`);
    }
    case "BLR-CP003-PROT-V9-GREAT-GRANDPARENT-PAIR": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के परदादा-परदादी/परनाना-परनानी का युग्म कौन-सा है?`, `${a} ਦੇ ਪਰਦਾਦਾ-ਪਰਦਾਦੀ/ਪਰਨਾਨਾ-ਪਰਨਾਨੀ ਦਾ ਜੋੜਾ ਕਿਹੜਾ ਹੈ?`);
    }
    case "BLR-CP003-PROT-V9-MATERNAL-UNCLE-DAUGHTER-LINEAGE": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} → माता → भाई → पुत्री क्रम से मिलने वाला व्यक्ति कौन है?`, `${a} → ਮਾਤਾ → ਭਰਾ → ਧੀ ਕ੍ਰਮ ਨਾਲ ਮਿਲਣ ਵਾਲਾ ਵਿਅਕਤੀ ਕੌਣ ਹੈ?`);
    }
    case "BLR-CP003-PROT-V9-THREE-CHILDREN-IN-LAW-SET": {
      if (p.length >= 2) return localeText(locale, `${p[0]} और ${p[1]} के बच्चों से विवाहित सभी व्यक्तियों वाला विकल्प चुनिए।`, `${p[0]} ਅਤੇ ${p[1]} ਦੇ ਬੱਚਿਆਂ ਨਾਲ ਵਿਆਹੇ ਸਾਰੇ ਵਿਅਕਤੀਆਂ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`);
      return localeText(locale, "सबसे ऊपर वाली पीढ़ी के दंपती के बच्चों से विवाहित सभी व्यक्तियों वाला विकल्प चुनिए।", "ਸਭ ਤੋਂ ਉੱਪਰਲੀ ਪੀੜ੍ਹੀ ਦੇ ਜੋੜੇ ਦੇ ਬੱਚਿਆਂ ਨਾਲ ਵਿਆਹੇ ਸਾਰੇ ਵਿਅਕਤੀਆਂ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।");
    }
    case "BLR-CP003-PROT-V9-TWO-BRANCH-GREAT-GRANDCHILD-SET": {
      if (p.length >= 2) return localeText(locale, `${p[0]} और ${p[1]} के सभी परपोते/परपोतियाँ वाला विकल्प चुनिए।`, `${p[0]} ਅਤੇ ${p[1]} ਦੇ ਸਾਰੇ ਪਰਪੋਤੇ/ਪਰਪੋਤੀਆਂ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`);
      return localeText(locale, "सबसे ऊपर वाली पीढ़ी के दंपती के सभी सबसे निचली पीढ़ी के वंशज चुनिए।", "ਸਭ ਤੋਂ ਉੱਪਰਲੀ ਪੀੜ੍ਹੀ ਦੇ ਜੋੜੇ ਦੇ ਸਭ ਤੋਂ ਹੇਠਲੀ ਪੀੜ੍ਹੀ ਵਾਲੇ ਸਾਰੇ ਵੰਸ਼ਜ ਚੁਣੋ।");
    }
    case "BLR-CP003-PROT-V9-UNEQUAL-BRANCH-COUSIN-SET": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के सभी कज़िन वाला विकल्प चुनिए।`, `${a} ਦੇ ਸਾਰੇ ਕਜ਼ਨ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9-UNMARRIED-BROTHER-IN-LAW": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} का अविवाहित साला/बहनोई कौन है?`, `${a} ਦਾ ਅਵਿਵਾਹਿਤ ਸਾਲਾ/ਭੈਣੋਈ ਕੌਣ ਹੈ?`);
    }
    case "BLR-CP003-PROT-V9-UNMARRIED-PATERNAL-AUNT": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} की अविवाहित बुआ कौन है?`, `${a} ਦੀ ਅਵਿਵਾਹਿਤ ਭੂਆ ਕੌਣ ਹੈ?`);
    }
    case "BLR-CP003-PROT-V9W2-AUNT-COUSIN-MIXED-PAIR": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} की बुआ/मौसी और उसके कज़िन वाला युग्म चुनिए।`, `${a} ਦੀ ਭੂਆ/ਮਾਸੀ ਅਤੇ ਉਸ ਦੇ ਕਜ਼ਨ ਵਾਲਾ ਜੋੜਾ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9W2-BROTHER-IN-LAW-NEPHEW-PAIR": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के साला/बहनोई और भतीजा/भांजा वाला युग्म चुनिए।`, `${a} ਦੇ ਸਾਲਾ/ਭੈਣੋਈ ਅਤੇ ਭਤੀਜਾ/ਭਾਣਜਾ ਵਾਲਾ ਜੋੜਾ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9W2-COMPLETE-PARENTS-AFTER-EXCLUSION": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के दोनों स्थापित माता-पिता वाला विकल्प चुनिए।`, `${a} ਦੇ ਦੋਵੇਂ ਸਥਾਪਿਤ ਮਾਤਾ-ਪਿਤਾ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9W2-ESTABLISHED-CHILDREN-IN-LAW-PAIR": {
      if (p.length >= 2) return localeText(locale, `${p[0]} और ${p[1]} के दो स्थापित दामाद/बहू वाला युग्म चुनिए।`, `${p[0]} ਅਤੇ ${p[1]} ਦੇ ਦੋ ਸਥਾਪਿਤ ਜਵਾਈ/ਨੂੰਹ ਵਾਲਾ ਜੋੜਾ ਚੁਣੋ।`);
      return localeText(locale, "स्थापित दामाद/बहू का पूरा युग्म चुनिए।", "ਸਥਾਪਿਤ ਜਵਾਈ/ਨੂੰਹ ਦਾ ਪੂਰਾ ਜੋੜਾ ਚੁਣੋ।");
    }
    case "BLR-CP003-PROT-V9W2-EXPLICIT-UNMARRIED-NOT-UNKNOWN":
      return localeText(locale, "किस व्यक्ति को स्पष्ट रूप से अविवाहित बताया गया है?", "ਕਿਸ ਵਿਅਕਤੀ ਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ’ਤੇ ਅਵਿਵਾਹਿਤ ਦੱਸਿਆ ਗਿਆ ਹੈ?");
    case "BLR-CP003-PROT-V9W2-FOUR-GRID-EXPLICIT-UNMARRIED":
      return localeText(locale, "चार भाई-बहनों वाली पीढ़ी में किस व्यक्ति को स्पष्ट रूप से अविवाहित बताया गया है?", "ਚਾਰ ਭਰਾ-ਭੈਣਾਂ ਵਾਲੀ ਪੀੜ੍ਹੀ ਵਿੱਚ ਕਿਸ ਵਿਅਕਤੀ ਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ’ਤੇ ਅਵਿਵਾਹਿਤ ਦੱਸਿਆ ਗਿਆ ਹੈ?");
    case "BLR-CP003-PROT-V9W2-FOUR-GRID-UNKNOWN-STATUS":
      return localeText(locale, "चार शाखाओं वाले परिवार में किस व्यक्ति की वैवाहिक स्थिति अज्ञात रहती है?", "ਚਾਰ ਸ਼ਾਖਾਵਾਂ ਵਾਲੇ ਪਰਿਵਾਰ ਵਿੱਚ ਕਿਸ ਵਿਅਕਤੀ ਦੀ ਵਿਆਹੀ ਸਥਿਤੀ ਅਣਜਾਣ ਰਹਿੰਦੀ ਹੈ?");
    case "BLR-CP003-PROT-V9W2-MOTHER-IN-LAW-DAUGHTER-PAIR": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} की सास और पुत्री वाला युग्म चुनिए।`, `${a} ਦੀ ਸੱਸ ਅਤੇ ਧੀ ਵਾਲਾ ਜੋੜਾ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9W2-PARENTS-IN-LAW-SET": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के सास-ससुर वाला पूरा विकल्प चुनिए।`, `${a} ਦੇ ਸੱਸ-ਸਹੁਰੇ ਵਾਲਾ ਪੂਰਾ ਵਿਕਲਪ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9W2-THREE-BRANCH-COUSIN-SET": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के परिवार में दिए गए सभी कज़िन वाला विकल्प चुनिए।`, `${a} ਦੇ ਪਰਿਵਾਰ ਵਿੱਚ ਦਿੱਤੇ ਸਾਰੇ ਕਜ਼ਨ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9W2-TWO-NEPHEW-BRANCH-SET": {
      const a = requireName(p, 0, id);
      return localeText(locale, `${a} के दोनों भतीजे/भांजे वाला विकल्प चुनिए।`, `${a} ਦੇ ਦੋਵੇਂ ਭਤੀਜੇ/ਭਾਣਜੇ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`);
    }
    case "BLR-CP003-PROT-V9W2-UNRESOLVED-SINGLE-PARENT-STATUS":
      return localeText(locale, "किस व्यक्ति की वैवाहिक स्थिति जानकारी से निर्धारित नहीं होती?", "ਕਿਸ ਵਿਅਕਤੀ ਦੀ ਵਿਆਹੀ ਸਥਿਤੀ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੁੰਦੀ?");
    default:
      throw new Error(`Missing CP-003 localized stem for ${id}.`);
  }
}

function protectNames(record: BlrCp003FinalApprovedRecord, text: string): { protectedText: string; restore: (value: string) => string } {
  const entries = [...record.proceduralLogic.nodes]
    .filter((node) => node.label)
    .sort((a, b) => b.label.length - a.label.length)
    .map((node) => ({ token: `⟦${node.id}⟧`, label: node.label }));
  let protectedText = text;
  for (const { token, label } of entries) protectedText = protectedText.split(label).join(token);
  return {
    protectedText,
    restore(value: string): string {
      let restored = value;
      for (const { token, label } of entries) restored = restored.split(token).join(label);
      return restored;
    },
  };
}

function genericHindi(text: string): string {
  return text
    .replace(/^Study the following family information and use both blood and marriage links\.$/, "निम्न पारिवारिक जानकारी का अध्ययन कीजिए और रक्त तथा विवाह—दोनों संबंधों का उपयोग कीजिए।")
    .replace(/^Study the following four-branch family information\.$/, "निम्न चार-शाखाओं वाले परिवार की जानकारी का अध्ययन कीजिए।")
    .replace(/^Study the following four-generation family information\.$/, "निम्न चार-पीढ़ियों वाले परिवार की जानकारी का अध्ययन कीजिए।")
    .replace(/^Study the following information about a three-generation family\.$/, "निम्न तीन-पीढ़ियों वाले परिवार की जानकारी का अध्ययन कीजिए।")
    .replace(/^Study the following information about an unequal cousin structure\.$/, "निम्न असमान कज़िन-शाखाओं वाले परिवार की जानकारी का अध्ययन कीजिए।")
    .replace(/^Study the following information about both sides of a family\.$/, "परिवार के पैतृक और मातृ—दोनों पक्षों की निम्न जानकारी का अध्ययन कीजिए।")
    .replace(/^Study the following information and answer the questions based on it\.$/, "निम्न जानकारी का अध्ययन करके उसके आधार पर प्रश्नों के उत्तर दीजिए।")
    .replace(/^Study the following information\.$/, "निम्न जानकारी का अध्ययन कीजिए।")
    .replace(/^Distinguish explicit unmarried status from an unstated spouse\.$/, "स्पष्ट रूप से अविवाहित होने और जीवनसाथी का उल्लेख न होने में अंतर रखें।")
    .replace(/^Treat an unnamed spouse as unknown, not as proof of being unmarried\.$/, "यदि जीवनसाथी का नाम नहीं दिया गया है, तो वैवाहिक स्थिति को अज्ञात मानें; इसे अविवाहित होने का प्रमाण न मानें।")
    .replace(/^The family has three generations\.$/, "परिवार में तीन पीढ़ियाँ हैं।")
    .replace(/^The family spans four generations\.$/, "परिवार चार पीढ़ियों में फैला है।")
    .replace(/^Two cousin branches meet at (.+)\.$/, "दो कज़िन शाखाएँ $1 पर मिलती हैं।")
    .replace(/^The two youngest members are (.+) and (.+)\.$/, "सबसे छोटी पीढ़ी के दो सदस्य $1 और $2 हैं।")
    .replace(/^(.+) and (.+) are the youngest members of two branches\.$/, "$1 और $2 दो शाखाओं के सबसे छोटी पीढ़ी के सदस्य हैं।")
    .replace(/^(.+) is unmarried\.$/, "$1 अविवाहित है।")
    .replace(/^(.+), (?:the )?other (?:son|sister|child) of (.+), is unmarried\.$/, "$1, $2 का एक अन्य संतान/भाई-बहन, अविवाहित है।")
    .replace(/^(.+), sister of (.+) and (.+), is unmarried\.$/, "$1, $2 और $3 की बहन, अविवाहित है।")
    .replace(/^(.+), the only brother of (.+)'s mother, is unmarried\.$/, "$1, $2 की माता का इकलौता भाई, अविवाहित है।")
    .replace(/^(.+) is their unmarried sister\.$/, "$1 उनकी अविवाहित बहन है।")
    .replace(/^(.+) is unmarried and is not the parent of any youngest-generation member\.$/, "$1 अविवाहित है और सबसे छोटी पीढ़ी के किसी सदस्य का माता-पिता नहीं है।")
    .replace(/^(.+) is neither a parent nor a spouse in the family; he is explicitly unmarried\.$/, "$1 परिवार में न माता-पिता है और न जीवनसाथी; उसे स्पष्ट रूप से अविवाहित बताया गया है।")
    .replace(/^(.+) is neither the parent of (.+) nor of (.+); he is explicitly unmarried\.$/, "$1 न $2 का और न $3 का माता-पिता है; उसे स्पष्ट रूप से अविवाहित बताया गया है।")
    .replace(/^Among the three children of (.+) and (.+), (.+) is explicitly unmarried and has no child\.$/, "$1 और $2 की तीन संतानों में $3 को स्पष्ट रूप से अविवाहित बताया गया है और उसकी कोई संतान नहीं है।")
    .replace(/^Of (.+), (.+), (.+) and (.+), only (.+) is explicitly unmarried\.$/, "$1, $2, $3 और $4 में केवल $5 को स्पष्ट रूप से अविवाहित बताया गया है।")
    .replace(/^(.+) and (.+) are married\.$/, "$1 और $2 विवाहित हैं।")
    .replace(/^(.+) is married to (.+)\.$/, "$1 का विवाह $2 से हुआ है।")
    .replace(/^(.+) and (.+) are married and have exactly two children, (.+) and (.+)\.$/, "$1 और $2 विवाहित हैं और उनकी ठीक दो संतानें $3 और $4 हैं।")
    .replace(/^(.+) and (.+) are married and have four children, (.+), (.+), (.+) and (.+)\.$/, "$1 और $2 विवाहित हैं और उनकी चार संतानें $3, $4, $5 और $6 हैं।")
    .replace(/^(.+) and (.+) are married and have three children, (.+), (.+) and (.+)\.$/, "$1 और $2 विवाहित हैं और उनकी तीन संतानें $3, $4 और $5 हैं।")
    .replace(/^(.+) and (.+) are married and have three children: (.+), (.+) and (.+)\.$/, "$1 और $2 विवाहित हैं और उनकी तीन संतानें $3, $4 और $5 हैं।")
    .replace(/^(.+) and (.+) are married and have two sons, (.+) and (.+)\.$/, "$1 और $2 विवाहित हैं और उनके दो पुत्र $3 और $4 हैं।")
    .replace(/^(.+) and (.+) are married and have (.+) and (.+)\.$/, "$1 और $2 विवाहित हैं और उनकी संतानें $3 और $4 हैं।")
    .replace(/^(.+) and (.+) are married and have (.+)\.$/, "$1 और $2 विवाहित हैं और उनकी संतान $3 है।")
    .replace(/^(.+) and (.+) are married and their sons are (.+) and (.+)\.$/, "$1 और $2 विवाहित हैं और उनके पुत्र $3 और $4 हैं।")
    .replace(/^(.+) and (.+) are married and are parents of (.+), (.+) and (.+)\.$/, "$1 और $2 विवाहित हैं और $3, $4 तथा $5 के माता-पिता हैं।")
    .replace(/^(.+) and (.+) are married and are parents of (.+) and (.+)\.$/, "$1 और $2 विवाहित हैं और $3 तथा $4 के माता-पिता हैं।")
    .replace(/^(.+) and (.+) are married and are parents of the four adults\.$/, "$1 और $2 विवाहित हैं और चारों वयस्क संतानों के माता-पिता हैं।")
    .replace(/^(.+) and (.+) are parents of the siblings (.+) and (.+)\.$/, "$1 और $2, भाई-बहन $3 और $4 के माता-पिता हैं।")
    .replace(/^(.+) and (.+) are siblings and are children of (.+) and (.+)\.$/, "$1 और $2 भाई-बहन हैं तथा $3 और $4 की संतानें हैं।")
    .replace(/^(.+) and (.+) are siblings born to (.+) and (.+)\.$/, "$1 और $2 भाई-बहन हैं और $3 तथा $4 की संतानें हैं।")
    .replace(/^(.+) and (.+) are the two sons of (.+) and (.+)\.$/, "$1 और $2, $3 और $4 के दो पुत्र हैं।")
    .replace(/^(.+) is the daughter of (.+) and (.+)\.$/, "$1, $2 और $3 की पुत्री है।")
    .replace(/^(.+) is the son of (.+) and (.+)\.$/, "$1, $2 और $3 का पुत्र है।")
    .replace(/^(.+) is the son of (.+) and (.+), not of (.+)\.$/, "$1, $2 और $3 का पुत्र है, $4 का नहीं।")
    .replace(/^(.+) is the only child of (.+) and (.+)\.$/, "$1, $2 और $3 की इकलौती संतान है।")
    .replace(/^(.+) is the only daughter of (.+) and (.+)\.$/, "$1, $2 और $3 की इकलौती पुत्री है।")
    .replace(/^(.+) is the only son of (.+)\.$/, "$1, $2 का इकलौता पुत्र है।")
    .replace(/^(.+) is the son and (.+) the daughter of (.+) and (.+)\.$/, "$1 पुत्र और $2 पुत्री हैं; दोनों $3 और $4 की संतानें हैं।")
    .replace(/^(.+) is the son of the sister of (.+)'s father\.$/, "$1, $2 के पिता की बहन का पुत्र है।")
    .replace(/^(.+) is the daughter of the brother of (.+)'s mother\.$/, "$1, $2 की माता के भाई की पुत्री है।")
    .replace(/^(.+)'s mother (.+) is the daughter of (.+) and (.+)\.$/, "$1 की माता $2, $3 और $4 की पुत्री है।")
    .replace(/^(.+)'s mother (.+) is the only daughter of (.+) and (.+)\.$/, "$1 की माता $2, $3 और $4 की इकलौती पुत्री है।")
    .replace(/^(.+)'s father (.+) and (.+)'s mother (.+) are children of (.+) and (.+)\.$/, "$1 के पिता $2 और $3 की माता $4, $5 और $6 की संतानें हैं।")
    .replace(/^(.+)'s father (.+) and (.+)'s mother (.+) are two children of (.+) and (.+)\.$/, "$1 के पिता $2 और $3 की माता $4, $5 और $6 की दो संतानें हैं।")
    .replace(/^(.+)'s father (.+) and (.+)'s father (.+) are brothers\.$/, "$1 के पिता $2 और $3 के पिता $4 भाई हैं।")
    .replace(/^(.+)'s maternal grandfather (.+) and (.+)'s maternal grandfather (.+) are brothers\.$/, "$1 के नाना $2 और $3 के नाना $4 भाई हैं।")
    .replace(/^(.+)'s mother (.+) is (.+)'s sister\.$/, "$1 की माता $2, $3 की बहन है।")
    .replace(/^(.+)'s mother (.+) is the sister of (.+)'s father (.+)\.$/, "$1 की माता $2, $3 के पिता $4 की बहन है।")
    .replace(/^(.+)'s mother (.+) has an unmarried brother, (.+)\.$/, "$1 की माता $2 का एक अविवाहित भाई $3 है।")
    .replace(/^(.+) is the mother of (.+), but no spouse is named for (.+)\.$/, "$1, $2 की माता है, लेकिन $3 के किसी जीवनसाथी का नाम नहीं दिया गया है।")
    .replace(/^(.+) has daughter (.+), but her spouse is not identified\.$/, "$1 की पुत्री $2 है, लेकिन $1 के जीवनसाथी की पहचान नहीं दी गई है।")
    .replace(/^(.+) is not the mother of (.+); she is the mother of (.+), and her spouse is not identified\.$/, "$1, $2 की माता नहीं है; वह $3 की माता है और उसके जीवनसाथी की पहचान नहीं दी गई है।")
    .replace(/^(.+)'s mother is (.+), not (.+); the passage does not state whether (.+) is married\.$/, "$1 की माता $2 है, $3 नहीं; जानकारी यह नहीं बताती कि $4 विवाहित है या नहीं।")
    .replace(/^(.+)'s mother is (.+), not (.+); (.+)'s marital status is not stated\.$/, "$1 की माता $2 है, $3 नहीं; $4 की वैवाहिक स्थिति नहीं बताई गई है।")
    .replace(/^(.+) is not the child of (.+)\.$/, "$1, $2 की संतान नहीं है।")
    .replace(/^(.+) is neither the child of (.+) nor of (.+)\.$/, "$1 न $2 की और न $3 की संतान है।")
    .replace(/^(.+) is not the child of (.+), and (.+) is not the child of (.+)\.$/, "$1, $2 की संतान नहीं है और $3, $4 की संतान नहीं है।")
    .replace(/^(.+) is not the parent of (.+)\.$/, "$1, $2 का माता-पिता नहीं है।")
    .replace(/^(.+) is neither (.+)'s sibling nor (.+)'s child\.$/, "$1 न $2 का भाई-बहन है और न $3 की संतान।")
    .replace(/^(.+) is neither (.+)'s sibling nor (.+)'s child; he is the son of (.+) and (.+)\.$/, "$1 न $2 का भाई है और न $3 की संतान; वह $4 और $5 का पुत्र है।")
    .replace(/^(.+) is not the child of (.+) or (.+); he is the son of (.+) and (.+)\.$/, "$1, $2 या $3 की संतान नहीं है; वह $4 और $5 का पुत्र है।")
    .replace(/^(.+) is not (.+)'s son; he is the son of (.+) and (.+)\.$/, "$1, $2 का पुत्र नहीं है; वह $3 और $4 का पुत्र है।")
    .replace(/^(.+) is not the sister of (.+); she is the sister of (.+)'s husband (.+)\.$/, "$1, $2 की बहन नहीं है; वह $3 के पति $4 की बहन है।")
    .replace(/^(.+) and (.+) are their only children\.$/, "$1 और $2 उनकी इकलौती संतानें हैं।")
    .replace(/^Their sons are (.+) and (.+)\.$/, "उनके पुत्र $1 और $2 हैं।")
    .replace(/^Their daughter is (.+) and their son is (.+)\.$/, "उनकी पुत्री $1 और पुत्र $2 है।")
    .replace(/^Their parents (.+) and (.+) are married\.$/, "उनके माता-पिता $1 और $2 विवाहित हैं।")
    .replace(/^Their spouses are (.+), (.+) and (.+), respectively\.$/, "उनके जीवनसाथी क्रमशः $1, $2 और $3 हैं।")
    .replace(/^The children in the three branches are (.+), (.+) and (.+)\.$/, "तीनों शाखाओं की संतानें $1, $2 और $3 हैं।")
    .replace(/^Their children are (.+), (.+) and (.+), respectively\.$/, "उनकी संतानें क्रमशः $1, $2 और $3 हैं।")
    .replace(/^The parents of these two branches, (.+) and (.+), are siblings\.$/, "इन दोनों शाखाओं के माता-पिता $1 और $2 भाई-बहन हैं।")
    .replace(/^One branch has only (.+); the other branch has a son (.+) and a daughter (.+)\.$/, "एक शाखा में केवल $1 है; दूसरी शाखा में पुत्र $2 और पुत्री $3 हैं।")
    .replace(/^On the paternal side, (.+)'s son is (.+); on the maternal side, (.+)'s daughter is (.+)\.$/, "पैतृक पक्ष में $1 का पुत्र $2 है; मातृ पक्ष में $3 की पुत्री $4 है।");
}

function genericPunjabi(text: string): string {
  const hi = genericHindi(text);
  if (hi !== text) {
    const pairs: readonly [string, string][] = [
      ["निम्न पारिवारिक जानकारी का अध्ययन कीजिए और रक्त तथा विवाह—दोनों संबंधों का उपयोग कीजिए।", "ਹੇਠਾਂ ਦਿੱਤੀ ਪਰਿਵਾਰਕ ਜਾਣਕਾਰੀ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਖੂਨ ਤੇ ਵਿਆਹ—ਦੋਵੇਂ ਸੰਬੰਧ ਵਰਤੋ।"],
      ["निम्न चार-शाखाओं वाले परिवार की जानकारी का अध्ययन कीजिए।", "ਹੇਠਾਂ ਦਿੱਤੇ ਚਾਰ-ਸ਼ਾਖਾਵਾਂ ਵਾਲੇ ਪਰਿਵਾਰ ਦੀ ਜਾਣਕਾਰੀ ਦਾ ਅਧਿਐਨ ਕਰੋ।"],
      ["निम्न चार-पीढ़ियों वाले परिवार की जानकारी का अध्ययन कीजिए।", "ਹੇਠਾਂ ਦਿੱਤੇ ਚਾਰ-ਪੀੜ੍ਹੀਆਂ ਵਾਲੇ ਪਰਿਵਾਰ ਦੀ ਜਾਣਕਾਰੀ ਦਾ ਅਧਿਐਨ ਕਰੋ।"],
      ["निम्न तीन-पीढ़ियों वाले परिवार की जानकारी का अध्ययन कीजिए।", "ਹੇਠਾਂ ਦਿੱਤੇ ਤਿੰਨ-ਪੀੜ੍ਹੀਆਂ ਵਾਲੇ ਪਰਿਵਾਰ ਦੀ ਜਾਣਕਾਰੀ ਦਾ ਅਧਿਐਨ ਕਰੋ।"],
      ["निम्न असमान कज़िन-शाखाओं वाले परिवार की जानकारी का अध्ययन कीजिए।", "ਹੇਠਾਂ ਦਿੱਤੇ ਅਸਮਾਨ ਕਜ਼ਨ-ਸ਼ਾਖਾਵਾਂ ਵਾਲੇ ਪਰਿਵਾਰ ਦੀ ਜਾਣਕਾਰੀ ਦਾ ਅਧਿਐਨ ਕਰੋ।"],
      ["परिवार के पैतृक और मातृ—दोनों पक्षों की निम्न जानकारी का अध्ययन कीजिए।", "ਪਰਿਵਾਰ ਦੇ ਪਿਤਰੀ ਅਤੇ ਮਾਤਰੀ—ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦਾ ਅਧਿਐਨ ਕਰੋ।"],
      ["निम्न जानकारी का अध्ययन करके उसके आधार पर प्रश्नों के उत्तर दीजिए।", "ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦਾ ਅਧਿਐਨ ਕਰਕੇ ਉਸ ਦੇ ਆਧਾਰ ’ਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।"],
      ["निम्न जानकारी का अध्ययन कीजिए।", "ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦਾ ਅਧਿਐਨ ਕਰੋ।"],
      ["स्पष्ट रूप से अविवाहित होने और जीवनसाथी का उल्लेख न होने में अंतर रखें।", "ਸਪਸ਼ਟ ਤੌਰ ’ਤੇ ਅਵਿਵਾਹਿਤ ਹੋਣ ਅਤੇ ਜੀਵਨਸਾਥੀ ਦਾ ਜ਼ਿਕਰ ਨਾ ਹੋਣ ਵਿੱਚ ਫਰਕ ਰੱਖੋ।"],
      ["यदि जीवनसाथी का नाम नहीं दिया गया है, तो वैवाहिक स्थिति को अज्ञात मानें; इसे अविवाहित होने का प्रमाण न मानें।", "ਜੇ ਜੀਵਨਸਾਥੀ ਦਾ ਨਾਮ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ, ਤਾਂ ਵਿਆਹੀ ਸਥਿਤੀ ਨੂੰ ਅਣਜਾਣ ਮੰਨੋ; ਇਸਨੂੰ ਅਵਿਵਾਹਿਤ ਹੋਣ ਦਾ ਸਬੂਤ ਨਾ ਮੰਨੋ।"],
    ];
    const exact = pairs.find(([h]) => h === hi);
    if (exact) return exact[1];
  }

  return text
    .replace(/^The family has three generations\.$/, "ਪਰਿਵਾਰ ਵਿੱਚ ਤਿੰਨ ਪੀੜ੍ਹੀਆਂ ਹਨ।")
    .replace(/^The family spans four generations\.$/, "ਪਰਿਵਾਰ ਚਾਰ ਪੀੜ੍ਹੀਆਂ ਵਿੱਚ ਫੈਲਿਆ ਹੈ।")
    .replace(/^Two cousin branches meet at (.+)\.$/, "ਦੋ ਕਜ਼ਨ ਸ਼ਾਖਾਵਾਂ $1 ’ਤੇ ਮਿਲਦੀਆਂ ਹਨ।")
    .replace(/^The two youngest members are (.+) and (.+)\.$/, "ਸਭ ਤੋਂ ਛੋਟੀ ਪੀੜ੍ਹੀ ਦੇ ਦੋ ਮੈਂਬਰ $1 ਅਤੇ $2 ਹਨ।")
    .replace(/^(.+) and (.+) are the youngest members of two branches\.$/, "$1 ਅਤੇ $2 ਦੋ ਸ਼ਾਖਾਵਾਂ ਦੀ ਸਭ ਤੋਂ ਛੋਟੀ ਪੀੜ੍ਹੀ ਦੇ ਮੈਂਬਰ ਹਨ।")
    .replace(/^(.+) is unmarried\.$/, "$1 ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+), (?:the )?other (?:son|sister|child) of (.+), is unmarried\.$/, "$1, $2 ਦੀ ਇੱਕ ਹੋਰ ਸੰਤਾਨ/ਭਰਾ-ਭੈਣ, ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+), sister of (.+) and (.+), is unmarried\.$/, "$1, $2 ਅਤੇ $3 ਦੀ ਭੈਣ, ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+), the only brother of (.+)'s mother, is unmarried\.$/, "$1, $2 ਦੀ ਮਾਤਾ ਦਾ ਇਕੱਲਾ ਭਰਾ, ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+) is their unmarried sister\.$/, "$1 ਉਨ੍ਹਾਂ ਦੀ ਅਵਿਵਾਹਿਤ ਭੈਣ ਹੈ।")
    .replace(/^(.+) is unmarried and is not the parent of any youngest-generation member\.$/, "$1 ਅਵਿਵਾਹਿਤ ਹੈ ਅਤੇ ਸਭ ਤੋਂ ਛੋਟੀ ਪੀੜ੍ਹੀ ਦੇ ਕਿਸੇ ਮੈਂਬਰ ਦਾ ਮਾਤਾ-ਪਿਤਾ ਨਹੀਂ ਹੈ।")
    .replace(/^(.+) is neither a parent nor a spouse in the family; he is explicitly unmarried\.$/, "$1 ਪਰਿਵਾਰ ਵਿੱਚ ਨਾ ਮਾਤਾ-ਪਿਤਾ ਹੈ ਨਾ ਜੀਵਨਸਾਥੀ; ਉਸਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ’ਤੇ ਅਵਿਵਾਹਿਤ ਦੱਸਿਆ ਗਿਆ ਹੈ।")
    .replace(/^(.+) is neither the parent of (.+) nor of (.+); he is explicitly unmarried\.$/, "$1 ਨਾ $2 ਦਾ ਅਤੇ ਨਾ $3 ਦਾ ਮਾਤਾ-ਪਿਤਾ ਹੈ; ਉਸਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ’ਤੇ ਅਵਿਵਾਹਿਤ ਦੱਸਿਆ ਗਿਆ ਹੈ।")
    .replace(/^Among the three children of (.+) and (.+), (.+) is explicitly unmarried and has no child\.$/, "$1 ਅਤੇ $2 ਦੀਆਂ ਤਿੰਨ ਸੰਤਾਨਾਂ ਵਿੱਚ $3 ਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ’ਤੇ ਅਵਿਵਾਹਿਤ ਦੱਸਿਆ ਗਿਆ ਹੈ ਅਤੇ ਉਸਦੀ ਕੋਈ ਸੰਤਾਨ ਨਹੀਂ ਹੈ।")
    .replace(/^Of (.+), (.+), (.+) and (.+), only (.+) is explicitly unmarried\.$/, "$1, $2, $3 ਅਤੇ $4 ਵਿੱਚ ਕੇਵਲ $5 ਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ’ਤੇ ਅਵਿਵਾਹਿਤ ਦੱਸਿਆ ਗਿਆ ਹੈ।")
    .replace(/^(.+) and (.+) are married\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ।")
    .replace(/^(.+) is married to (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ।")
    .replace(/^(.+) and (.+) are married and have exactly two children, (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਠੀਕ ਦੋ ਸੰਤਾਨਾਂ $3 ਅਤੇ $4 ਹਨ।")
    .replace(/^(.+) and (.+) are married and have four children, (.+), (.+), (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਚਾਰ ਸੰਤਾਨਾਂ $3, $4, $5 ਅਤੇ $6 ਹਨ।")
    .replace(/^(.+) and (.+) are married and have three children, (.+), (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਤਿੰਨ ਸੰਤਾਨਾਂ $3, $4 ਅਤੇ $5 ਹਨ।")
    .replace(/^(.+) and (.+) are married and have three children: (.+), (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਤਿੰਨ ਸੰਤਾਨਾਂ $3, $4 ਅਤੇ $5 ਹਨ।")
    .replace(/^(.+) and (.+) are married and have two sons, (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਦੋ ਪੁੱਤਰ $3 ਅਤੇ $4 ਹਨ।")
    .replace(/^(.+) and (.+) are married and have (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਤਾਨਾਂ $3 ਅਤੇ $4 ਹਨ।")
    .replace(/^(.+) and (.+) are married and have (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਸੰਤਾਨ $3 ਹੈ।")
    .replace(/^(.+) and (.+) are married and their sons are (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਪੁੱਤਰ $3 ਅਤੇ $4 ਹਨ।")
    .replace(/^(.+) and (.+) are married and are parents of (.+), (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ $3, $4 ਅਤੇ $5 ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ।")
    .replace(/^(.+) and (.+) are married and are parents of (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ $3 ਅਤੇ $4 ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ।")
    .replace(/^(.+) and (.+) are married and are parents of the four adults\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਚਾਰਾਂ ਬਾਲਗ ਸੰਤਾਨਾਂ ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ।")
    .replace(/^(.+) and (.+) are parents of the siblings (.+) and (.+)\.$/, "$1 ਅਤੇ $2, ਭਰਾ-ਭੈਣ $3 ਅਤੇ $4 ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ।")
    .replace(/^(.+) and (.+) are siblings and are children of (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਭਰਾ-ਭੈਣ ਹਨ ਅਤੇ $3 ਅਤੇ $4 ਦੀਆਂ ਸੰਤਾਨਾਂ ਹਨ।")
    .replace(/^(.+) and (.+) are siblings born to (.+) and (.+)\.$/, "$1 ਅਤੇ $2 ਭਰਾ-ਭੈਣ ਹਨ ਅਤੇ $3 ਅਤੇ $4 ਦੀਆਂ ਸੰਤਾਨਾਂ ਹਨ।")
    .replace(/^(.+) and (.+) are the two sons of (.+) and (.+)\.$/, "$1 ਅਤੇ $2, $3 ਅਤੇ $4 ਦੇ ਦੋ ਪੁੱਤਰ ਹਨ।")
    .replace(/^(.+) is the daughter of (.+) and (.+)\.$/, "$1, $2 ਅਤੇ $3 ਦੀ ਧੀ ਹੈ।")
    .replace(/^(.+) is the son of (.+) and (.+)\.$/, "$1, $2 ਅਤੇ $3 ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is the son of (.+) and (.+), not of (.+)\.$/, "$1, $2 ਅਤੇ $3 ਦਾ ਪੁੱਤਰ ਹੈ, $4 ਦਾ ਨਹੀਂ।")
    .replace(/^(.+) is the only child of (.+) and (.+)\.$/, "$1, $2 ਅਤੇ $3 ਦੀ ਇਕੱਲੀ ਸੰਤਾਨ ਹੈ।")
    .replace(/^(.+) is the only daughter of (.+) and (.+)\.$/, "$1, $2 ਅਤੇ $3 ਦੀ ਇਕੱਲੀ ਧੀ ਹੈ।")
    .replace(/^(.+) is the only son of (.+)\.$/, "$1, $2 ਦਾ ਇਕੱਲਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is the son and (.+) the daughter of (.+) and (.+)\.$/, "$1 ਪੁੱਤਰ ਅਤੇ $2 ਧੀ ਹਨ; ਦੋਵੇਂ $3 ਅਤੇ $4 ਦੀਆਂ ਸੰਤਾਨਾਂ ਹਨ।")
    .replace(/^(.+) is the son of the sister of (.+)'s father\.$/, "$1, $2 ਦੇ ਪਿਤਾ ਦੀ ਭੈਣ ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is the daughter of the brother of (.+)'s mother\.$/, "$1, $2 ਦੀ ਮਾਤਾ ਦੇ ਭਰਾ ਦੀ ਧੀ ਹੈ।")
    .replace(/^(.+)'s mother (.+) is the daughter of (.+) and (.+)\.$/, "$1 ਦੀ ਮਾਤਾ $2, $3 ਅਤੇ $4 ਦੀ ਧੀ ਹੈ।")
    .replace(/^(.+)'s mother (.+) is the only daughter of (.+) and (.+)\.$/, "$1 ਦੀ ਮਾਤਾ $2, $3 ਅਤੇ $4 ਦੀ ਇਕੱਲੀ ਧੀ ਹੈ।")
    .replace(/^(.+)'s father (.+) and (.+)'s mother (.+) are children of (.+) and (.+)\.$/, "$1 ਦੇ ਪਿਤਾ $2 ਅਤੇ $3 ਦੀ ਮਾਤਾ $4, $5 ਅਤੇ $6 ਦੀਆਂ ਸੰਤਾਨਾਂ ਹਨ।")
    .replace(/^(.+)'s father (.+) and (.+)'s mother (.+) are two children of (.+) and (.+)\.$/, "$1 ਦੇ ਪਿਤਾ $2 ਅਤੇ $3 ਦੀ ਮਾਤਾ $4, $5 ਅਤੇ $6 ਦੀਆਂ ਦੋ ਸੰਤਾਨਾਂ ਹਨ।")
    .replace(/^(.+)'s father (.+) and (.+)'s father (.+) are brothers\.$/, "$1 ਦੇ ਪਿਤਾ $2 ਅਤੇ $3 ਦੇ ਪਿਤਾ $4 ਭਰਾ ਹਨ।")
    .replace(/^(.+)'s maternal grandfather (.+) and (.+)'s maternal grandfather (.+) are brothers\.$/, "$1 ਦੇ ਨਾਨਾ $2 ਅਤੇ $3 ਦੇ ਨਾਨਾ $4 ਭਰਾ ਹਨ।")
    .replace(/^(.+)'s mother (.+) is (.+)'s sister\.$/, "$1 ਦੀ ਮਾਤਾ $2, $3 ਦੀ ਭੈਣ ਹੈ।")
    .replace(/^(.+)'s mother (.+) is the sister of (.+)'s father (.+)\.$/, "$1 ਦੀ ਮਾਤਾ $2, $3 ਦੇ ਪਿਤਾ $4 ਦੀ ਭੈਣ ਹੈ।")
    .replace(/^(.+)'s mother (.+) has an unmarried brother, (.+)\.$/, "$1 ਦੀ ਮਾਤਾ $2 ਦਾ ਇੱਕ ਅਵਿਵਾਹਿਤ ਭਰਾ $3 ਹੈ।")
    .replace(/^(.+) is the mother of (.+), but no spouse is named for (.+)\.$/, "$1, $2 ਦੀ ਮਾਤਾ ਹੈ, ਪਰ $3 ਦੇ ਕਿਸੇ ਜੀਵਨਸਾਥੀ ਦਾ ਨਾਮ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।")
    .replace(/^(.+) has daughter (.+), but her spouse is not identified\.$/, "$1 ਦੀ ਧੀ $2 ਹੈ, ਪਰ $1 ਦੇ ਜੀਵਨਸਾਥੀ ਦੀ ਪਛਾਣ ਨਹੀਂ ਦਿੱਤੀ ਗਈ।")
    .replace(/^(.+) is not the mother of (.+); she is the mother of (.+), and her spouse is not identified\.$/, "$1, $2 ਦੀ ਮਾਤਾ ਨਹੀਂ ਹੈ; ਉਹ $3 ਦੀ ਮਾਤਾ ਹੈ ਅਤੇ ਉਸ ਦੇ ਜੀਵਨਸਾਥੀ ਦੀ ਪਛਾਣ ਨਹੀਂ ਦਿੱਤੀ ਗਈ।")
    .replace(/^(.+)'s mother is (.+), not (.+); the passage does not state whether (.+) is married\.$/, "$1 ਦੀ ਮਾਤਾ $2 ਹੈ, $3 ਨਹੀਂ; ਜਾਣਕਾਰੀ ਇਹ ਨਹੀਂ ਦੱਸਦੀ ਕਿ $4 ਵਿਆਹਿਆ ਹੋਇਆ ਹੈ ਜਾਂ ਨਹੀਂ।")
    .replace(/^(.+)'s mother is (.+), not (.+); (.+)'s marital status is not stated\.$/, "$1 ਦੀ ਮਾਤਾ $2 ਹੈ, $3 ਨਹੀਂ; $4 ਦੀ ਵਿਆਹੀ ਸਥਿਤੀ ਨਹੀਂ ਦੱਸੀ ਗਈ।")
    .replace(/^(.+) is not the child of (.+)\.$/, "$1, $2 ਦੀ ਸੰਤਾਨ ਨਹੀਂ ਹੈ।")
    .replace(/^(.+) is neither the child of (.+) nor of (.+)\.$/, "$1 ਨਾ $2 ਦੀ ਅਤੇ ਨਾ $3 ਦੀ ਸੰਤਾਨ ਹੈ।")
    .replace(/^(.+) is not the child of (.+), and (.+) is not the child of (.+)\.$/, "$1, $2 ਦੀ ਸੰਤਾਨ ਨਹੀਂ ਹੈ ਅਤੇ $3, $4 ਦੀ ਸੰਤਾਨ ਨਹੀਂ ਹੈ।")
    .replace(/^(.+) is not the parent of (.+)\.$/, "$1, $2 ਦਾ ਮਾਤਾ-ਪਿਤਾ ਨਹੀਂ ਹੈ।")
    .replace(/^(.+) is neither (.+)'s sibling nor (.+)'s child\.$/, "$1 ਨਾ $2 ਦਾ ਭਰਾ-ਭੈਣ ਹੈ ਅਤੇ ਨਾ $3 ਦੀ ਸੰਤਾਨ।")
    .replace(/^(.+) is neither (.+)'s sibling nor (.+)'s child; he is the son of (.+) and (.+)\.$/, "$1 ਨਾ $2 ਦਾ ਭਰਾ ਹੈ ਅਤੇ ਨਾ $3 ਦੀ ਸੰਤਾਨ; ਉਹ $4 ਅਤੇ $5 ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is not the child of (.+) or (.+); he is the son of (.+) and (.+)\.$/, "$1, $2 ਜਾਂ $3 ਦੀ ਸੰਤਾਨ ਨਹੀਂ ਹੈ; ਉਹ $4 ਅਤੇ $5 ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is not (.+)'s son; he is the son of (.+) and (.+)\.$/, "$1, $2 ਦਾ ਪੁੱਤਰ ਨਹੀਂ ਹੈ; ਉਹ $3 ਅਤੇ $4 ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is not the sister of (.+); she is the sister of (.+)'s husband (.+)\.$/, "$1, $2 ਦੀ ਭੈਣ ਨਹੀਂ ਹੈ; ਉਹ $3 ਦੇ ਪਤੀ $4 ਦੀ ਭੈਣ ਹੈ।")
    .replace(/^(.+) and (.+) are their only children\.$/, "$1 ਅਤੇ $2 ਉਨ੍ਹਾਂ ਦੀਆਂ ਇਕੱਲੀਆਂ ਸੰਤਾਨਾਂ ਹਨ।")
    .replace(/^Their sons are (.+) and (.+)\.$/, "ਉਨ੍ਹਾਂ ਦੇ ਪੁੱਤਰ $1 ਅਤੇ $2 ਹਨ।")
    .replace(/^Their daughter is (.+) and their son is (.+)\.$/, "ਉਨ੍ਹਾਂ ਦੀ ਧੀ $1 ਅਤੇ ਪੁੱਤਰ $2 ਹੈ।")
    .replace(/^Their parents (.+) and (.+) are married\.$/, "ਉਨ੍ਹਾਂ ਦੇ ਮਾਤਾ-ਪਿਤਾ $1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ।")
    .replace(/^Their spouses are (.+), (.+) and (.+), respectively\.$/, "ਉਨ੍ਹਾਂ ਦੇ ਜੀਵਨਸਾਥੀ ਕ੍ਰਮਵਾਰ $1, $2 ਅਤੇ $3 ਹਨ।")
    .replace(/^The children in the three branches are (.+), (.+) and (.+)\.$/, "ਤਿੰਨਾਂ ਸ਼ਾਖਾਵਾਂ ਦੀਆਂ ਸੰਤਾਨਾਂ $1, $2 ਅਤੇ $3 ਹਨ।")
    .replace(/^Their children are (.+), (.+) and (.+), respectively\.$/, "ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਤਾਨਾਂ ਕ੍ਰਮਵਾਰ $1, $2 ਅਤੇ $3 ਹਨ।")
    .replace(/^The parents of these two branches, (.+) and (.+), are siblings\.$/, "ਇਨ੍ਹਾਂ ਦੋਵਾਂ ਸ਼ਾਖਾਵਾਂ ਦੇ ਮਾਤਾ-ਪਿਤਾ $1 ਅਤੇ $2 ਭਰਾ-ਭੈਣ ਹਨ।")
    .replace(/^One branch has only (.+); the other branch has a son (.+) and a daughter (.+)\.$/, "ਇੱਕ ਸ਼ਾਖਾ ਵਿੱਚ ਕੇਵਲ $1 ਹੈ; ਦੂਜੀ ਸ਼ਾਖਾ ਵਿੱਚ ਪੁੱਤਰ $2 ਅਤੇ ਧੀ $3 ਹਨ।")
    .replace(/^On the paternal side, (.+)'s son is (.+); on the maternal side, (.+)'s daughter is (.+)\.$/, "ਪਿਤਰੀ ਪਾਸੇ $1 ਦਾ ਪੁੱਤਰ $2 ਹੈ; ਮਾਤਰੀ ਪਾਸੇ $3 ਦੀ ਧੀ $4 ਹੈ।");
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=\.)\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

export function localizedBlrCp003SharedPrompt(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
): string {
  const { protectedText, restore } = protectNames(record, record.sharedPrompt);
  const localized = splitSentences(protectedText).map((sentence) => {
    const value = locale === "hi-IN" ? genericHindi(sentence) : genericPunjabi(sentence);
    if (value === sentence) {
      throw new Error(`Untranslated CP-003 ${locale} passage sentence: ${restore(sentence)}`);
    }
    return restore(value);
  });
  return localized.join(" ");
}

export function localizedBlrCp003AuthorityConcept(
  authority: BlrCp003FinalApprovedRecord["finalAuthority"],
  locale: BlrCp003TranslatedLocale,
): string {
  switch (authority) {
    case "SELECT_UNORDERED_FAMILY_PAIR":
      return localeText(locale, "परिवार का पूरा मानचित्र बनाकर दोनों नामों के बीच आवश्यक संबंध की जाँच करें।", "ਪੂਰਾ ਪਰਿਵਾਰਕ ਨਕਸ਼ਾ ਬਣਾ ਕੇ ਦੋਵੇਂ ਨਾਂਵਾਂ ਵਿਚਕਾਰ ਲੋੜੀਂਦਾ ਸੰਬੰਧ ਜਾਂਚੋ।");
    case "IDENTIFY_ALL_MEMBERS_BY_RELATION":
      return localeText(locale, "पूर्ण-समूह प्रश्न में हर योग्य सदस्य शामिल होना चाहिए और कोई अतिरिक्त नाम नहीं होना चाहिए।", "ਪੂਰੇ-ਸਮੂਹ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਹਰ ਯੋਗ ਮੈਂਬਰ ਸ਼ਾਮਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਅਤੇ ਕੋਈ ਵਾਧੂ ਨਾਮ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ।");
    case "IDENTIFY_MEMBER_BY_MARITAL_STATUS":
      return localeText(locale, "पहले पारिवारिक संबंध तय करें, फिर केवल स्पष्ट वैवाहिक-स्थिति प्रमाण लागू करें।", "ਪਹਿਲਾਂ ਪਰਿਵਾਰਕ ਸੰਬੰਧ ਤੈਅ ਕਰੋ, ਫਿਰ ਕੇਵਲ ਸਪਸ਼ਟ ਵਿਆਹੀ-ਸਥਿਤੀ ਦਾ ਸਬੂਤ ਲਾਗੂ ਕਰੋ।");
    case "IDENTIFY_PERSON_BY_EXACT_LINEAGE":
      return localeText(locale, "दिए गए संबंध-क्रम को एक-एक चरण में उसी क्रम से चलें।", "ਦਿੱਤੇ ਸੰਬੰਧ-ਕ੍ਰਮ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਦਮ ਕਰਕੇ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਚਲੋ।");
  }
}

export function localizedBlrCp003EvidenceStatement(
  subject: string,
  relationId: BlrRelationId,
  reference: string,
  locale: BlrCp003TranslatedLocale,
): string {
  const relation = localizedBlrCp003RelationLabel(relationId, locale);
  return localeText(locale, `${subject}, ${reference} का/की ${relation} है।`, `${subject}, ${reference} ਦਾ/ਦੀ ${relation} ਹੈ।`);
}
