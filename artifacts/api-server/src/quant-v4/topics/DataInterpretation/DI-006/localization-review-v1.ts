import { resolveDi006V2Counts } from "./caselet-set-v2";
import { generateDi006PermanentQuestion } from "./permanent-question-generator";
import type {
  Di006V2ExamProfile,
  Di006V2Question,
  Di006V2Relation,
  Di006V2Stimulus,
  Di006V2TaskKind,
} from "./caselet-v2-types";

export type Di006LocalizationLocale = "hi-IN" | "pa-IN";

export const DI006_LOCALIZATION_REVIEW_ID = "DI-006-HI-PA-REVIEW-V1" as const;\nexport const DI006_LOCALIZATION_RELEASE_ID = "DI-006-HI-PA-FROZEN-V1" as const;

type LocalizedContext = Readonly<{
  hi: Readonly<{
    title: string;
    totalLabel: string;
    unit: string;
  }>;
  pa: Readonly<{
    title: string;
    totalLabel: string;
    unit: string;
  }>;
}>;

const CATEGORY_LOCALIZATION: Readonly<Record<string, Readonly<{ hi: string; pa: string }>>> = Object.freeze({
  "North Branch": { hi: "उत्तर शाखा", pa: "ਉੱਤਰੀ ਸ਼ਾਖਾ" },
  "South Branch": { hi: "दक्षिण शाखा", pa: "ਦੱਖਣੀ ਸ਼ਾਖਾ" },
  "East Branch": { hi: "पूर्व शाखा", pa: "ਪੂਰਬੀ ਸ਼ਾਖਾ" },
  "West Branch": { hi: "पश्चिम शाखा", pa: "ਪੱਛਮੀ ਸ਼ਾਖਾ" },
  "Central Branch": { hi: "केंद्रीय शाखा", pa: "ਕੇਂਦਰੀ ਸ਼ਾਖਾ" },

  "Sales": { hi: "बिक्री", pa: "ਵਿਕਰੀ" },
  "Accounts": { hi: "लेखा", pa: "ਲੇਖਾ" },
  "Operations": { hi: "परिचालन", pa: "ਕਾਰਜ" },
  "Support": { hi: "सहायता", pa: "ਸਹਾਇਤਾ" },
  "Administration": { hi: "प्रशासन", pa: "ਪ੍ਰਸ਼ਾਸਨ" },

  "Course A": { hi: "पाठ्यक्रम 1", pa: "ਕੋਰਸ 1" },
  "Course B": { hi: "पाठ्यक्रम 2", pa: "ਕੋਰਸ 2" },
  "Course C": { hi: "पाठ्यक्रम 3", pa: "ਕੋਰਸ 3" },
  "Course D": { hi: "पाठ्यक्रम 4", pa: "ਕੋਰਸ 4" },
  "Course E": { hi: "पाठ्यक्रम 5", pa: "ਕੋਰਸ 5" },

  "Product P": { hi: "उत्पाद 1", pa: "ਉਤਪਾਦ 1" },
  "Product Q": { hi: "उत्पाद 2", pa: "ਉਤਪਾਦ 2" },
  "Product R": { hi: "उत्पाद 3", pa: "ਉਤਪਾਦ 3" },
  "Product S": { hi: "उत्पाद 4", pa: "ਉਤਪਾਦ 4" },
  "Product T": { hi: "उत्पाद 5", pa: "ਉਤਪਾਦ 5" },

  "Category A": { hi: "श्रेणी 1", pa: "ਸ਼੍ਰੇਣੀ 1" },
  "Category B": { hi: "श्रेणी 2", pa: "ਸ਼੍ਰੇਣੀ 2" },
  "Category C": { hi: "श्रेणी 3", pa: "ਸ਼੍ਰੇਣੀ 3" },
  "Category D": { hi: "श्रेणी 4", pa: "ਸ਼੍ਰੇਣੀ 4" },
  "Category E": { hi: "श्रेणी 5", pa: "ਸ਼੍ਰੇਣੀ 5" },

  "Fiction": { hi: "कथा साहित्य", pa: "ਕਹਾਣੀ ਸਾਹਿਤ" },
  "Science": { hi: "विज्ञान", pa: "ਵਿਗਿਆਨ" },
  "History": { hi: "इतिहास", pa: "ਇਤਿਹਾਸ" },
  "Commerce": { hi: "वाणिज्य", pa: "ਵਪਾਰ" },
  "General": { hi: "सामान्य", pa: "ਸਧਾਰਣ" },
});

export const DI006_LOCALIZATION_CONTEXTS: Readonly<Record<string, LocalizedContext>> = Object.freeze({
  SERVICE_BRANCHES: {
    hi: { title: "पाँच शाखाओं द्वारा संभाले गए सेवा अनुरोध", totalLabel: "कुल सेवा अनुरोध", unit: "सेवा अनुरोध" },
    pa: { title: "ਪੰਜ ਸ਼ਾਖਾਵਾਂ ਵੱਲੋਂ ਸੰਭਾਲੀਆਂ ਸੇਵਾ ਬੇਨਤੀਆਂ", totalLabel: "ਕੁੱਲ ਸੇਵਾ ਬੇਨਤੀਆਂ", unit: "ਸੇਵਾ ਬੇਨਤੀਆਂ" },
  },
  DEPARTMENT_EMPLOYEES: {
    hi: { title: "पाँच विभागों में कार्यरत कर्मचारी", totalLabel: "कुल कर्मचारी", unit: "कर्मचारी" },
    pa: { title: "ਪੰਜ ਵਿਭਾਗਾਂ ਵਿੱਚ ਕੰਮ ਕਰਦੇ ਕਰਮਚਾਰੀ", totalLabel: "ਕੁੱਲ ਕਰਮਚਾਰੀ", unit: "ਕਰਮਚਾਰੀ" },
  },
  COURSE_ENROLMENT: {
    hi: { title: "पाँच पाठ्यक्रमों में नामांकित छात्र", totalLabel: "कुल छात्र", unit: "छात्र" },
    pa: { title: "ਪੰਜ ਕੋਰਸਾਂ ਵਿੱਚ ਦਾਖ਼ਲ ਵਿਦਿਆਰਥੀ", totalLabel: "ਕੁੱਲ ਵਿਦਿਆਰਥੀ", unit: "ਵਿਦਿਆਰਥੀ" },
  },
  PRODUCT_OUTPUT: {
    hi: { title: "पाँच उत्पादों में उत्पादन का वितरण", totalLabel: "कुल उत्पादन", unit: "इकाइयाँ" },
    pa: { title: "ਪੰਜ ਉਤਪਾਦਾਂ ਵਿੱਚ ਉਤਪਾਦਨ ਦੀ ਵੰਡ", totalLabel: "ਕੁੱਲ ਉਤਪਾਦਨ", unit: "ਇਕਾਈਆਂ" },
  },
  ORDER_CATEGORIES: {
    hi: { title: "पाँच श्रेणियों में प्राप्त ऑर्डर", totalLabel: "कुल ऑर्डर", unit: "ऑर्डर" },
    pa: { title: "ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਪ੍ਰਾਪਤ ਆਰਡਰ", totalLabel: "ਕੁੱਲ ਆਰਡਰ", unit: "ਆਰਡਰ" },
  },
  BOOK_CATEGORIES: {
    hi: { title: "पाँच श्रेणियों में जारी पुस्तकें", totalLabel: "कुल जारी पुस्तकें", unit: "पुस्तकें" },
    pa: { title: "ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਜਾਰੀ ਕਿਤਾਬਾਂ", totalLabel: "ਕੁੱਲ ਜਾਰੀ ਕਿਤਾਬਾਂ", unit: "ਕਿਤਾਬਾਂ" },
  },
});

function isHindi(locale: Di006LocalizationLocale) {
  return locale === "hi-IN";
}

function localizedContext(stimulus: Di006V2Stimulus, locale: Di006LocalizationLocale) {
  const context = DI006_LOCALIZATION_CONTEXTS[stimulus.contextId];
  if (!context) throw new Error(`DI-006 localization is missing context '${stimulus.contextId}'.`);
  return isHindi(locale) ? context.hi : context.pa;
}

function categoryName(sourceName: string, locale: Di006LocalizationLocale) {
  const localized = CATEGORY_LOCALIZATION[sourceName];
  if (!localized) throw new Error(`DI-006 localization is missing category '${sourceName}'.`);
  return isHindi(locale) ? localized.hi : localized.pa;
}

function surfaceIndex(question: Di006V2Question) {
  const value = Number(question.stemSurfaceId.replace(/^S/u, ""));
  return Number.isInteger(value) && value >= 1 && value <= 3 ? value - 1 : 0;
}

function relationForTarget(stimulus: Di006V2Stimulus, targetIndex: number) {
  return stimulus.relations.find((relation) => relation.targetIndex === targetIndex);
}

function localizedRelationFact(
  stimulus: Di006V2Stimulus,
  relation: Di006V2Relation,
  counts: readonly number[],
  locale: Di006LocalizationLocale,
) {
  const target = counts[relation.targetIndex]!;
  const source = counts[relation.sourceIndex]!;
  const targetName = categoryName(stimulus.categories[relation.targetIndex]!, locale);
  const sourceName = categoryName(stimulus.categories[relation.sourceIndex]!, locale);
  const differencePercent = ((target - source) * 100) / source;
  const magnitude = Math.abs(differencePercent);
  const hi = isHindi(locale);

  if (Number.isInteger(differencePercent) && differencePercent !== 0 && magnitude <= 100) {
    const more = differencePercent > 0;
    switch (stimulus.contextId) {
      case "SERVICE_BRANCHES":
        return hi
          ? `${targetName} ने ${sourceName} की तुलना में ${magnitude}% ${more ? "अधिक" : "कम"} सेवा अनुरोध संभाले।`
          : `${targetName} ਨੇ ${sourceName} ਨਾਲੋਂ ${magnitude}% ${more ? "ਵੱਧ" : "ਘੱਟ"} ਸੇਵਾ ਬੇਨਤੀਆਂ ਸੰਭਾਲੀਆਂ।`;
      case "DEPARTMENT_EMPLOYEES":
        return hi
          ? `${targetName} में ${sourceName} की तुलना में ${magnitude}% ${more ? "अधिक" : "कम"} कर्मचारी हैं।`
          : `${targetName} ਵਿੱਚ ${sourceName} ਨਾਲੋਂ ${magnitude}% ${more ? "ਵੱਧ" : "ਘੱਟ"} ਕਰਮਚਾਰੀ ਹਨ।`;
      case "COURSE_ENROLMENT":
        return hi
          ? `${targetName} में छात्रों की संख्या ${sourceName} से ${magnitude}% ${more ? "अधिक" : "कम"} है।`
          : `${targetName} ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਨਾਲੋਂ ${magnitude}% ${more ? "ਵੱਧ" : "ਘੱਟ"} ਹੈ।`;
      case "PRODUCT_OUTPUT":
        return hi
          ? `${targetName} का उत्पादन ${sourceName} से ${magnitude}% ${more ? "अधिक" : "कम"} है।`
          : `${targetName} ਦਾ ਉਤਪਾਦਨ ${sourceName} ਨਾਲੋਂ ${magnitude}% ${more ? "ਵੱਧ" : "ਘੱਟ"} ਹੈ।`;
      case "ORDER_CATEGORIES":
        return hi
          ? `${targetName} में ${sourceName} की तुलना में ${magnitude}% ${more ? "अधिक" : "कम"} ऑर्डर प्राप्त हुए।`
          : `${targetName} ਵਿੱਚ ${sourceName} ਨਾਲੋਂ ${magnitude}% ${more ? "ਵੱਧ" : "ਘੱਟ"} ਆਰਡਰ ਪ੍ਰਾਪਤ ਹੋਏ।`;
      case "BOOK_CATEGORIES":
        return hi
          ? `${targetName} में जारी पुस्तकों की संख्या ${sourceName} से ${magnitude}% ${more ? "अधिक" : "कम"} है।`
          : `${targetName} ਵਿੱਚ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਨਾਲੋਂ ${magnitude}% ${more ? "ਵੱਧ" : "ਘੱਟ"} ਹੈ।`;
    }
  }

  const fraction = relation.denominator === 1 ? String(relation.numerator) : `${relation.numerator}/${relation.denominator}`;
  const fractionPhrase = relation.denominator === 1
    ? (hi ? `${fraction} गुना` : `${fraction} ਗੁਣਾ`)
    : fraction;
  switch (stimulus.contextId) {
    case "SERVICE_BRANCHES":
      return hi
        ? `${targetName} ने ${sourceName} की तुलना में ${fractionPhrase} सेवा अनुरोध संभाले।`
        : relation.denominator === 1 ? `${targetName} ਨੇ ${sourceName} ਨਾਲੋਂ ${fractionPhrase} ਸੇਵਾ ਬੇਨਤੀਆਂ ਸੰਭਾਲੀਆਂ।` : `${targetName} ਨੇ ${sourceName} ਦੀਆਂ ਸੇਵਾ ਬੇਨਤੀਆਂ ਦੇ ${fraction} ਦੇ ਬਰਾਬਰ ਬੇਨਤੀਆਂ ਸੰਭਾਲੀਆਂ।`;
    case "DEPARTMENT_EMPLOYEES":
      return hi
        ? relation.denominator === 1 ? `${targetName} में कर्मचारियों की संख्या ${sourceName} की संख्या से ${fractionPhrase} है।` : `${targetName} में कर्मचारियों की संख्या ${sourceName} की संख्या का ${fraction} है।`
        : relation.denominator === 1 ? `${targetName} ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਨਾਲੋਂ ${fractionPhrase} ਹੈ।` : `${targetName} ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਦੀ ਗਿਣਤੀ ਦਾ ${fraction} ਹੈ।`;
    case "COURSE_ENROLMENT":
      return hi
        ? relation.denominator === 1 ? `${targetName} में छात्रों की संख्या ${sourceName} की संख्या से ${fractionPhrase} है।` : `${targetName} में छात्रों की संख्या ${sourceName} की संख्या का ${fraction} है।`
        : relation.denominator === 1 ? `${targetName} ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਨਾਲੋਂ ${fractionPhrase} ਹੈ।` : `${targetName} ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਦੀ ਗਿਣਤੀ ਦਾ ${fraction} ਹੈ।`;
    case "PRODUCT_OUTPUT":
      return hi
        ? relation.denominator === 1 ? `${targetName} का उत्पादन ${sourceName} के उत्पादन का ${fractionPhrase} है।` : `${targetName} का उत्पादन ${sourceName} के उत्पादन का ${fraction} है।`
        : relation.denominator === 1 ? `${targetName} ਦਾ ਉਤਪਾਦਨ ${sourceName} ਦੇ ਉਤਪਾਦਨ ਨਾਲੋਂ ${fractionPhrase} ਹੈ।` : `${targetName} ਦਾ ਉਤਪਾਦਨ ${sourceName} ਦੇ ਉਤਪਾਦਨ ਦਾ ${fraction} ਹੈ।`;
    case "ORDER_CATEGORIES":
      return hi
        ? relation.denominator === 1 ? `${targetName} में प्राप्त ऑर्डरों की संख्या ${sourceName} की संख्या से ${fractionPhrase} है।` : `${targetName} में प्राप्त ऑर्डरों की संख्या ${sourceName} की संख्या का ${fraction} है।`
        : relation.denominator === 1 ? `${targetName} ਵਿੱਚ ਪ੍ਰਾਪਤ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਨਾਲੋਂ ${fractionPhrase} ਹੈ।` : `${targetName} ਵਿੱਚ ਪ੍ਰਾਪਤ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਦੀ ਗਿਣਤੀ ਦਾ ${fraction} ਹੈ।`;
    case "BOOK_CATEGORIES":
      return hi
        ? relation.denominator === 1 ? `${targetName} में जारी पुस्तकों की संख्या ${sourceName} की संख्या से ${fractionPhrase} है।` : `${targetName} में जारी पुस्तकों की संख्या ${sourceName} की संख्या का ${fraction} है।`
        : relation.denominator === 1 ? `${targetName} ਵਿੱਚ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਨਾਲੋਂ ${fractionPhrase} ਹੈ।` : `${targetName} ਵਿੱਚ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ ${sourceName} ਦੀ ਗਿਣਤੀ ਦਾ ${fraction} ਹੈ।`;
  }
  throw new Error("DI-006 localization unknown context.");
}

function localizedRelationStep(
  stimulus: Di006V2Stimulus,
  relation: Di006V2Relation,
  counts: readonly number[],
  locale: Di006LocalizationLocale,
) {
  const targetName = categoryName(stimulus.categories[relation.targetIndex]!, locale);
  const sourceName = categoryName(stimulus.categories[relation.sourceIndex]!, locale);
  const unit = localizedContext(stimulus, locale).unit;
  const target = counts[relation.targetIndex]!;
  const source = counts[relation.sourceIndex]!;
  const differencePercent = ((target - source) * 100) / source;
  if (Number.isInteger(differencePercent) && differencePercent !== 0 && Math.abs(differencePercent) <= 100) {
    return `${targetName} = ${sourceName} × ${100 + differencePercent}/100 = ${target} ${unit}।`;
  }
  return relation.denominator === 1 ? `${targetName} = ${relation.numerator} × ${sourceName} = ${target} ${unit}।` : `${targetName} = ${relation.numerator}/${relation.denominator} × ${sourceName} = ${target} ${unit}।`;
}

function localizedDerivationSteps(
  stimulus: Di006V2Stimulus,
  categoryIndex: number,
  counts: readonly number[],
  locale: Di006LocalizationLocale,
): string[] {
  const name = categoryName(stimulus.categories[categoryIndex]!, locale);
  const unit = localizedContext(stimulus, locale).unit;
  if (categoryIndex === stimulus.directIndex) {
    return isHindi(locale)
      ? [`${name} = ${stimulus.directValue} ${unit} (दिया गया)।`]
      : [`${name} = ${stimulus.directValue} ${unit} (ਦਿੱਤਾ ਗਿਆ)।`];
  }
  if (categoryIndex === stimulus.remainderIndex) return [];
  const relation = relationForTarget(stimulus, categoryIndex);
  if (!relation) throw new Error("DI-006 localization missing relation for derived category.");
  return [
    ...localizedDerivationSteps(stimulus, relation.sourceIndex, counts, locale),
    localizedRelationStep(stimulus, relation, counts, locale),
  ];
}

function uniqueSteps(...groups: readonly string[][]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const group of groups) {
    for (const step of group) {
      if (seen.has(step)) continue;
      seen.add(step);
      result.push(step);
    }
  }
  return result;
}

function localizedTotalSentence(stimulus: Di006V2Stimulus, locale: Di006LocalizationLocale) {
  const total = stimulus.totalValue;
  const hi = isHindi(locale);
  switch (stimulus.contextId) {
    case "SERVICE_BRANCHES": return hi ? `पाँचों शाखाओं ने कुल ${total} सेवा अनुरोध संभाले।` : `ਪੰਜਾਂ ਸ਼ਾਖਾਵਾਂ ਨੇ ਕੁੱਲ ${total} ਸੇਵਾ ਬੇਨਤੀਆਂ ਸੰਭਾਲੀਆਂ।`;
    case "DEPARTMENT_EMPLOYEES": return hi ? `कंपनी के पाँचों विभागों में कुल ${total} कर्मचारी हैं।` : `ਕੰਪਨੀ ਦੇ ਪੰਜਾਂ ਵਿਭਾਗਾਂ ਵਿੱਚ ਕੁੱਲ ${total} ਕਰਮਚਾਰੀ ਹਨ।`;
    case "COURSE_ENROLMENT": return hi ? `पाँचों पाठ्यक्रमों में कुल ${total} छात्र नामांकित हैं।` : `ਪੰਜਾਂ ਕੋਰਸਾਂ ਵਿੱਚ ਕੁੱਲ ${total} ਵਿਦਿਆਰਥੀ ਦਾਖ਼ਲ ਹਨ।`;
    case "PRODUCT_OUTPUT": return hi ? `पाँचों उत्पादों का कुल उत्पादन ${total} इकाइयाँ है।` : `ਪੰਜਾਂ ਉਤਪਾਦਾਂ ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ ${total} ਇਕਾਈਆਂ ਹੈ।`;
    case "ORDER_CATEGORIES": return hi ? `पाँचों श्रेणियों में कुल ${total} ऑर्डर प्राप्त हुए।` : `ਪੰਜਾਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਕੁੱਲ ${total} ਆਰਡਰ ਪ੍ਰਾਪਤ ਹੋਏ।`;
    case "BOOK_CATEGORIES": return hi ? `पुस्तकालय ने पाँचों श्रेणियों में कुल ${total} पुस्तकें जारी कीं।` : `ਲਾਇਬ੍ਰੇਰੀ ਨੇ ਪੰਜਾਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਕੁੱਲ ${total} ਕਿਤਾਬਾਂ ਜਾਰੀ ਕੀਤੀਆਂ।`;
  }
  throw new Error("DI-006 localization unknown context.");
}

function localizedDirectSentence(stimulus: Di006V2Stimulus, locale: Di006LocalizationLocale) {
  const name = categoryName(stimulus.categories[stimulus.directIndex]!, locale);
  const value = stimulus.directValue;
  const hi = isHindi(locale);
  switch (stimulus.contextId) {
    case "SERVICE_BRANCHES": return hi ? `${name} ने ${value} सेवा अनुरोध संभाले।` : `${name} ਨੇ ${value} ਸੇਵਾ ਬੇਨਤੀਆਂ ਸੰਭਾਲੀਆਂ।`;
    case "DEPARTMENT_EMPLOYEES": return hi ? `${name} में ${value} कर्मचारी हैं।` : `${name} ਵਿੱਚ ${value} ਕਰਮਚਾਰੀ ਹਨ।`;
    case "COURSE_ENROLMENT": return hi ? `${name} में ${value} छात्र नामांकित हैं।` : `${name} ਵਿੱਚ ${value} ਵਿਦਿਆਰਥੀ ਦਾਖ਼ਲ ਹਨ।`;
    case "PRODUCT_OUTPUT": return hi ? `${name} का उत्पादन ${value} इकाइयाँ है।` : `${name} ਦਾ ਉਤਪਾਦਨ ${value} ਇਕਾਈਆਂ ਹੈ।`;
    case "ORDER_CATEGORIES": return hi ? `${name} में ${value} ऑर्डर प्राप्त हुए।` : `${name} ਵਿੱਚ ${value} ਆਰਡਰ ਪ੍ਰਾਪਤ ਹੋਏ।`;
    case "BOOK_CATEGORIES": return hi ? `${name} में ${value} पुस्तकें जारी की गईं।` : `${name} ਵਿੱਚ ${value} ਕਿਤਾਬਾਂ ਜਾਰੀ ਕੀਤੀਆਂ ਗਈਆਂ।`;
  }
  throw new Error("DI-006 localization unknown context.");
}

function localizedRemainderSentence(stimulus: Di006V2Stimulus, locale: Di006LocalizationLocale) {
  const name = categoryName(stimulus.categories[stimulus.remainderIndex]!, locale);
  const hi = isHindi(locale);
  switch (stimulus.contextId) {
    case "SERVICE_BRANCHES": return hi ? `शेष सेवा अनुरोध ${name} ने संभाले।` : `ਬਾਕੀ ਸੇਵਾ ਬੇਨਤੀਆਂ ${name} ਨੇ ਸੰਭਾਲੀਆਂ।`;
    case "DEPARTMENT_EMPLOYEES": return hi ? `शेष कर्मचारी ${name} में कार्यरत हैं।` : `ਬਾਕੀ ਕਰਮਚਾਰੀ ${name} ਵਿੱਚ ਕੰਮ ਕਰਦੇ ਹਨ।`;
    case "COURSE_ENROLMENT": return hi ? `शेष छात्र ${name} में नामांकित हैं।` : `ਬਾਕੀ ਵਿਦਿਆਰਥੀ ${name} ਵਿੱਚ ਦਾਖ਼ਲ ਹਨ।`;
    case "PRODUCT_OUTPUT": return hi ? `शेष उत्पादन ${name} का है।` : `ਬਾਕੀ ਉਤਪਾਦਨ ${name} ਦਾ ਹੈ।`;
    case "ORDER_CATEGORIES": return hi ? `शेष ऑर्डर ${name} में प्राप्त हुए।` : `ਬਾਕੀ ਆਰਡਰ ${name} ਵਿੱਚ ਪ੍ਰਾਪਤ ਹੋਏ।`;
    case "BOOK_CATEGORIES": return hi ? `शेष जारी पुस्तकें ${name} श्रेणी की हैं।` : `ਬਾਕੀ ਜਾਰੀ ਕਿਤਾਬਾਂ ${name} ਸ਼੍ਰੇਣੀ ਦੀਆਂ ਹਨ।`;
  }
  throw new Error("DI-006 localization unknown context.");
}

export function localizeDi006Stimulus(stimulus: Di006V2Stimulus, locale: Di006LocalizationLocale) {
  const context = localizedContext(stimulus, locale);
  const counts = resolveDi006V2Counts(stimulus);
  const relationOrder = [...stimulus.relations].sort((a, b) => {
    const aIndex = stimulus.learnerText.indexOf(a.learnerText);
    const bIndex = stimulus.learnerText.indexOf(b.learnerText);
    return aIndex - bIndex;
  });
  const relationFacts = relationOrder.map((relation) => localizedRelationFact(stimulus, relation, counts, locale));

  return {
    ...stimulus,
    title: context.title,
    instruction: isHindi(locale)
      ? "केसलेट को ध्यान से पढ़िए और उसके आधार पर दिए गए पाँच प्रश्नों के उत्तर दीजिए।"
      : "ਕੇਸਲੈਟ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ ਅਤੇ ਇਸ ਦੇ ਆਧਾਰ 'ਤੇ ਦਿੱਤੇ ਪੰਜ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",
    learnerText: [
      localizedTotalSentence(stimulus, locale),
      localizedDirectSentence(stimulus, locale),
      ...relationFacts,
      localizedRemainderSentence(stimulus, locale),
    ].join(" "),
    categories: stimulus.categories.map((name) => categoryName(name, locale)),
    totalLabel: context.totalLabel,
    unit: context.unit,
    relations: stimulus.relations.map((relation) => ({
      ...relation,
      learnerText: localizedRelationFact(stimulus, relation, counts, locale),
      explanationStep: localizedRelationStep(stimulus, relation, counts, locale),
    })),
  };
}

function localizedValueStem(
  question: Di006V2Question,
  sourceStimulus: Di006V2Stimulus,
  locale: Di006LocalizationLocale,
  categoryIndex: number,
  relationHint: boolean,
) {
  const name = categoryName(sourceStimulus.categories[categoryIndex]!, locale);
  const hi = isHindi(locale);
  const s = surfaceIndex(question);
  let h: string[];
  let p: string[];

  switch (sourceStimulus.contextId) {
    case "SERVICE_BRANCHES":
      h = [`${name} ने कितने सेवा अनुरोध संभाले?`, `${name} द्वारा संभाले गए सेवा अनुरोधों की संख्या कितनी है?`, relationHint ? `दिए गए संबंधों का उपयोग करके ${name} द्वारा संभाले गए सेवा अनुरोधों की संख्या ज्ञात कीजिए।` : `केसलेट के अनुसार ${name} ने कितने सेवा अनुरोध संभाले?`];
      p = [`${name} ਨੇ ਕਿੰਨੀਆਂ ਸੇਵਾ ਬੇਨਤੀਆਂ ਸੰਭਾਲੀਆਂ?`, `${name} ਵੱਲੋਂ ਸੰਭਾਲੀਆਂ ਸੇਵਾ ਬੇਨਤੀਆਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`, relationHint ? `ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${name} ਵੱਲੋਂ ਸੰਭਾਲੀਆਂ ਸੇਵਾ ਬੇਨਤੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।` : `ਕੇਸਲੈਟ ਅਨੁਸਾਰ ${name} ਨੇ ਕਿੰਨੀਆਂ ਸੇਵਾ ਬੇਨਤੀਆਂ ਸੰਭਾਲੀਆਂ?`];
      break;
    case "DEPARTMENT_EMPLOYEES":
      h = [`${name} में कितने कर्मचारी हैं?`, `${name} में कर्मचारियों की संख्या कितनी है?`, relationHint ? `दिए गए संबंधों का उपयोग करके ${name} में कर्मचारियों की संख्या ज्ञात कीजिए।` : `केसलेट के अनुसार ${name} में कर्मचारियों की संख्या ज्ञात कीजिए।`];
      p = [`${name} ਵਿੱਚ ਕਿੰਨੇ ਕਰਮਚਾਰੀ ਹਨ?`, `${name} ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`, relationHint ? `ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${name} ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।` : `ਕੇਸਲੈਟ ਅਨੁਸਾਰ ${name} ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`];
      break;
    case "COURSE_ENROLMENT":
      h = [`${name} में कितने छात्र नामांकित हैं?`, `${name} में नामांकित छात्रों की संख्या कितनी है?`, relationHint ? `दिए गए संबंधों का उपयोग करके ${name} में नामांकित छात्रों की संख्या ज्ञात कीजिए।` : `केसलेट के अनुसार ${name} में नामांकित छात्रों की संख्या ज्ञात कीजिए।`];
      p = [`${name} ਵਿੱਚ ਕਿੰਨੇ ਵਿਦਿਆਰਥੀ ਦਾਖ਼ਲ ਹਨ?`, `${name} ਵਿੱਚ ਦਾਖ਼ਲ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`, relationHint ? `ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${name} ਵਿੱਚ ਦਾਖ਼ਲ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।` : `ਕੇਸਲੈਟ ਅਨੁਸਾਰ ${name} ਵਿੱਚ ਦਾਖ਼ਲ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`];
      break;
    case "PRODUCT_OUTPUT":
      h = [`${name} का उत्पादन कितनी इकाइयाँ है?`, `${name} की कितनी इकाइयों का उत्पादन हुआ?`, relationHint ? `दिए गए संबंधों का उपयोग करके ${name} का उत्पादन ज्ञात कीजिए।` : `केसलेट के अनुसार ${name} का उत्पादन ज्ञात कीजिए।`];
      p = [`${name} ਦਾ ਉਤਪਾਦਨ ਕਿੰਨੀਆਂ ਇਕਾਈਆਂ ਹੈ?`, `${name} ਦੀਆਂ ਕਿੰਨੀਆਂ ਇਕਾਈਆਂ ਦਾ ਉਤਪਾਦਨ ਹੋਇਆ?`, relationHint ? `ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${name} ਦਾ ਉਤਪਾਦਨ ਕੱਢੋ।` : `ਕੇਸਲੈਟ ਅਨੁਸਾਰ ${name} ਦਾ ਉਤਪਾਦਨ ਕੱਢੋ।`];
      break;
    case "ORDER_CATEGORIES":
      h = [`${name} में कितने ऑर्डर प्राप्त हुए?`, `${name} में प्राप्त ऑर्डरों की संख्या कितनी है?`, relationHint ? `दिए गए संबंधों का उपयोग करके ${name} में प्राप्त ऑर्डरों की संख्या ज्ञात कीजिए।` : `केसलेट के अनुसार ${name} में प्राप्त ऑर्डरों की संख्या ज्ञात कीजिए।`];
      p = [`${name} ਵਿੱਚ ਕਿੰਨੇ ਆਰਡਰ ਪ੍ਰਾਪਤ ਹੋਏ?`, `${name} ਵਿੱਚ ਪ੍ਰਾਪਤ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`, relationHint ? `ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${name} ਵਿੱਚ ਪ੍ਰਾਪਤ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।` : `ਕੇਸਲੈਟ ਅਨੁਸਾਰ ${name} ਵਿੱਚ ਪ੍ਰਾਪਤ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`];
      break;
    case "BOOK_CATEGORIES":
      h = [`${name} में कितनी पुस्तकें जारी की गईं?`, `${name} में जारी पुस्तकों की संख्या कितनी है?`, relationHint ? `दिए गए संबंधों का उपयोग करके ${name} में जारी पुस्तकों की संख्या ज्ञात कीजिए।` : `केसलेट के अनुसार ${name} में जारी पुस्तकों की संख्या ज्ञात कीजिए।`];
      p = [`${name} ਵਿੱਚ ਕਿੰਨੀਆਂ ਕਿਤਾਬਾਂ ਜਾਰੀ ਕੀਤੀਆਂ ਗਈਆਂ?`, `${name} ਵਿੱਚ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`, relationHint ? `ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${name} ਵਿੱਚ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।` : `ਕੇਸਲੈਟ ਅਨੁਸਾਰ ${name} ਵਿੱਚ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`];
      break;
    default: throw new Error("DI-006 localization unknown context.");
  }
  return (hi ? h : p)[s]!;
}

function localizedStem(question: Di006V2Question, stimulus: Di006V2Stimulus, locale: Di006LocalizationLocale) {
  const e = question.evidence;
  const hi = isHindi(locale);
  const s = surfaceIndex(question);
  const name = (index: number) => categoryName(stimulus.categories[index]!, locale);
  const unit = localizedContext(stimulus, locale).unit;

  switch (question.kind) {
    case "DIRECT_STATED_VALUE":
      return localizedValueStem(question, stimulus, locale, Number(e.categoryIndex), false);
    case "SINGLE_RELATION_VALUE":
    case "CHAINED_RELATION_VALUE":
    case "REMAINDER_FROM_TOTAL":
      return localizedValueStem(question, stimulus, locale, Number(e.categoryIndex), true);
    case "DIFFERENCE_BETWEEN_VALUES": {
      const a = name(Number(e.firstIndex)), b = name(Number(e.secondIndex));
      const h = [`${a} और ${b} के मानों में कितना अंतर है?`, `${a} और ${b} में ${unit} की संख्या का अंतर कितना है?`, `${a} और ${b} के मानों का निरपेक्ष अंतर ज्ञात कीजिए।`];
      const p = [`${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`, `${a} ਅਤੇ ${b} ਵਿੱਚ ${unit} ਦੀ ਗਿਣਤੀ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`, `${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`];
      return (hi ? h : p)[s]!;
    }
    case "COMBINED_TWO_VALUES": {
      const a = name(Number(e.firstIndex)), b = name(Number(e.secondIndex));
      const h = [`${a} और ${b} का संयुक्त मान कितना है?`, `${a} और ${b} का कुल मान ज्ञात कीजिए।`, `${a} और ${b} मिलकर कितने ${unit} दर्शाते हैं?`];
      const p = [`${a} ਅਤੇ ${b} ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${a} ਅਤੇ ${b} ਦਾ ਕੁੱਲ ਮੁੱਲ ਕੱਢੋ।`, `${a} ਅਤੇ ${b} ਮਿਲ ਕੇ ਕਿੰਨੇ ${unit} ਦਰਸਾਉਂਦੇ ਹਨ?`];
      return (hi ? h : p)[s]!;
    }
    case "RATIO_OF_TWO_VALUES": {
      const a = name(Number(e.firstIndex)), b = name(Number(e.secondIndex));
      const h = [`${a} और ${b} के मानों का अनुपात क्या है?`, `${a} और ${b} के मान किस अनुपात में हैं?`, `${a} की संख्या का ${b} की संख्या से अनुपात ज्ञात कीजिए।`];
      const p = [`${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ?`, `${a} ਦੀ ਗਿਣਤੀ ਦਾ ${b} ਦੀ ਗਿਣਤੀ ਨਾਲ ਅਨੁਪਾਤ ਕੱਢੋ।`];
      return (hi ? h : p)[s]!;
    }
    case "SHARE_OF_TOTAL": {
      const a = name(Number(e.categoryIndex));
      const h = [`${a} कुल का कितने प्रतिशत है?`, `कुल ${unit} में ${a} की हिस्सेदारी कितने प्रतिशत है?`, `${a} की कुल में प्रतिशत हिस्सेदारी ज्ञात कीजिए।`];
      const p = [`${a} ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `ਕੁੱਲ ${unit} ਵਿੱਚ ${a} ਦਾ ਹਿੱਸਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `${a} ਦਾ ਕੁੱਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਕੱਢੋ।`];
      return (hi ? h : p)[s]!;
    }
    case "AVERAGE_OF_TWO_VALUES": {
      const a = name(Number(e.firstIndex)), b = name(Number(e.secondIndex));
      const h = [`${a} और ${b} के ${unit} की औसत संख्या कितनी है?`, `${a} और ${b} के मानों का औसत ज्ञात कीजिए।`, `${a} और ${b} के मानों का माध्य कितना है?`];
      const p = [`${a} ਅਤੇ ${b} ਦੇ ${unit} ਦੀ ਔਸਤ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`, `${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ਕੱਢੋ।`, `${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲਾਂ ਦਾ ਔਸਤ ਕਿੰਨਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "COMBINED_DERIVED_SHARE": {
      const a = name(Number(e.firstIndex)), b = name(Number(e.secondIndex));
      const h = [`${a} और ${b} मिलकर कुल का कितने प्रतिशत हैं?`, `कुल ${unit} में ${a} और ${b} की संयुक्त हिस्सेदारी कितने प्रतिशत है?`, `${a} और ${b} की संयुक्त प्रतिशत हिस्सेदारी ज्ञात कीजिए।`];
      const p = [`${a} ਅਤੇ ${b} ਮਿਲ ਕੇ ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹਨ?`, `ਕੁੱਲ ${unit} ਵਿੱਚ ${a} ਅਤੇ ${b} ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਹਿੱਸਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `${a} ਅਤੇ ${b} ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਕੱਢੋ।`];
      return (hi ? h : p)[s]!;
    }
    case "REMAINDER_TO_DERIVED_RATIO": {
      const a = name(Number(e.firstIndex)), b = name(Number(e.secondIndex));
      const h = [`${a} और ${b} का अनुपात क्या है?`, `शेष श्रेणी ${a} का ${b} से अनुपात ज्ञात कीजिए।`, `${a} और ${b} के मान किस अनुपात में हैं?`];
      const p = [`${a} ਅਤੇ ${b} ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `ਬਾਕੀ ਸ਼੍ਰੇਣੀ ${a} ਦਾ ${b} ਨਾਲ ਅਨੁਪਾਤ ਕੱਢੋ।`, `${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ?`];
      return (hi ? h : p)[s]!;
    }
    case "RELATIVE_PERCENT_EXCESS": {
      const a = name(Number(e.largerIndex)), b = name(Number(e.smallerIndex));
      const h = [`${a}, ${b} से कितने प्रतिशत अधिक है?`, `${a} का मान ${b} के मान से कितने प्रतिशत अधिक है?`, `${a} का मान ${b} से जितना अधिक है, वह ${b} का कितने प्रतिशत है?`];
      const p = [`${a}, ${b} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${a} ਦਾ ਮੁੱਲ ${b} ਦੇ ਮੁੱਲ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${a} ਦਾ ਮੁੱਲ ${b} ਨਾਲੋਂ ਜਿੰਨਾ ਵੱਧ ਹੈ, ਉਹ ${b} ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
  }
}

function explanationFor(
  question: Di006V2Question,
  stimulus: Di006V2Stimulus,
  locale: Di006LocalizationLocale,
) {
  const hi = isHindi(locale);
  const e = question.evidence;
  const counts = resolveDi006V2Counts(stimulus);
  const name = (index: number) => categoryName(stimulus.categories[index]!, locale);
  const unit = localizedContext(stimulus, locale).unit;
  const steps = (index: number) => localizedDerivationSteps(stimulus, index, counts, locale);

  switch (question.kind) {
    case "DIRECT_STATED_VALUE": {
      const index = Number(e.categoryIndex);
      return {
        keyIdea: hi ? "यह मान केसलेट में सीधे दिया गया है।" : "ਇਹ ਮੁੱਲ ਕੇਸਲੈਟ ਵਿੱਚ ਸਿੱਧਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
        steps: hi
          ? [`${name(index)} = ${counts[index]} ${unit}।`]
          : [`${name(index)} = ${counts[index]} ${unit}।`],
      };
    }
    case "SINGLE_RELATION_VALUE": {
      const index = Number(e.categoryIndex);
      return {
        keyIdea: hi ? "सीधे दिए गए मान से शुरू करके उस संबंध का उपयोग करें जो पूछी गई श्रेणी तक पहुँचाता है।" : "ਸਿੱਧੇ ਦਿੱਤੇ ਮੁੱਲ ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ਉਸ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰੋ ਜੋ ਪੁੱਛੀ ਗਈ ਸ਼੍ਰੇਣੀ ਤੱਕ ਲੈ ਜਾਂਦਾ ਹੈ।",
        steps: steps(index),
      };
    }
    case "DIFFERENCE_BETWEEN_VALUES": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex);
      return {
        keyIdea: hi ? "पहले दोनों श्रेणियों के मान ज्ञात करें, फिर बड़े मान में से छोटा मान घटाएँ।" : "ਪਹਿਲਾਂ ਦੋਵੇਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਮੁੱਲ ਕੱਢੋ, ਫਿਰ ਵੱਡੇ ਮੁੱਲ ਵਿਚੋਂ ਛੋਟਾ ਮੁੱਲ ਘਟਾਓ।",
        steps: [...uniqueSteps(steps(a), steps(b)), hi ? `अंतर = |${counts[a]} - ${counts[b]}| = ${question.answer}।` : `ਅੰਤਰ = |${counts[a]} - ${counts[b]}| = ${question.answer}।`],
      };
    }
    case "COMBINED_TWO_VALUES": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex);
      return {
        keyIdea: hi ? "दोनों पूछे गए मान ज्ञात करके उन्हें जोड़ें।" : "ਦੋਵੇਂ ਪੁੱਛੇ ਗਏ ਮੁੱਲ ਕੱਢ ਕੇ ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜੋ।",
        steps: [...uniqueSteps(steps(a), steps(b)), hi ? `संयुक्त मान = ${counts[a]} + ${counts[b]} = ${question.answer}।` : `ਮਿਲਿਆ ਹੋਇਆ ਮੁੱਲ = ${counts[a]} + ${counts[b]} = ${question.answer}।`],
      };
    }
    case "RATIO_OF_TWO_VALUES": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex);
      return {
        keyIdea: hi ? "दोनों मान ज्ञात करें और पूछे गए क्रम में उनका अनुपात सरल करें।" : "ਦੋਵੇਂ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਪੁੱਛੇ ਗਏ ਕ੍ਰਮ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",
        steps: [...uniqueSteps(steps(a), steps(b)), `${name(a)} : ${name(b)} = ${counts[a]} : ${counts[b]} = ${question.answer}।`],
      };
    }
    case "SHARE_OF_TOTAL": {
      const a = Number(e.categoryIndex);
      return {
        keyIdea: hi ? "पूछी गई श्रेणी का मान ज्ञात करके उसे कुल से भाग दें और 100 से गुणा करें।" : "ਪੁੱਛੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦਾ ਮੁੱਲ ਕੱਢ ਕੇ ਉਸ ਨੂੰ ਕੁੱਲ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।",
        steps: [...steps(a), hi ? `प्रतिशत हिस्सेदारी = ${counts[a]}/${stimulus.totalValue} × 100 = ${question.answer}।` : `ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ = ${counts[a]}/${stimulus.totalValue} × 100 = ${question.answer}।`],
      };
    }
    case "AVERAGE_OF_TWO_VALUES": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex);
      return {
        keyIdea: hi ? "दोनों मान ज्ञात करें, उन्हें जोड़ें और योग को 2 से भाग दें।" : "ਦੋਵੇਂ ਮੁੱਲ ਕੱਢੋ, ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜੋ ਅਤੇ ਜੋੜ ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦਿਓ।",
        steps: [...uniqueSteps(steps(a), steps(b)), hi ? `औसत = (${counts[a]} + ${counts[b]})/2 = ${question.answer}।` : `ਔਸਤ = (${counts[a]} + ${counts[b]})/2 = ${question.answer}।`],
      };
    }
    case "CHAINED_RELATION_VALUE": {
      const a = Number(e.categoryIndex);
      return {
        keyIdea: hi ? "यह श्रेणी सीधे दिए गए मान से नहीं जुड़ी है। संबंधों की श्रृंखला को क्रम से पूरा करें।" : "ਇਹ ਸ਼੍ਰੇਣੀ ਸਿੱਧੇ ਦਿੱਤੇ ਮੁੱਲ ਨਾਲ ਨਹੀਂ ਜੁੜੀ। ਸੰਬੰਧਾਂ ਦੀ ਲੜੀ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਪੂਰਾ ਕਰੋ।",
        steps: steps(a),
      };
    }
    case "REMAINDER_FROM_TOTAL": {
      const remainderIndex = Number(e.categoryIndex);
      const relationTargets = stimulus.relations.map((relation) => relation.targetIndex);
      const knownSteps = uniqueSteps(...relationTargets.map((index) => steps(index)));
      const knownSubtotal = counts.reduce((sum, value, index) => index === remainderIndex ? sum : sum + value, 0);
      return {
        keyIdea: hi ? "पहले अन्य चार श्रेणियों के मान ज्ञात करें, उनका योग निकालें और उसे कुल से घटाएँ।" : "ਪਹਿਲਾਂ ਹੋਰ ਚਾਰ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਮੁੱਲ ਕੱਢੋ, ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ਕੱਢੋ ਅਤੇ ਉਸ ਨੂੰ ਕੁੱਲ ਵਿਚੋਂ ਘਟਾਓ।",
        steps: [
          ...knownSteps,
          hi ? `चार ज्ञात श्रेणियों का योग = ${knownSubtotal}।` : `ਚਾਰ ਜਾਣੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਜੋੜ = ${knownSubtotal}।`,
          hi ? `${name(remainderIndex)} = ${stimulus.totalValue} - ${knownSubtotal} = ${counts[remainderIndex]} ${unit}।` : `${name(remainderIndex)} = ${stimulus.totalValue} - ${knownSubtotal} = ${counts[remainderIndex]} ${unit}।`,
        ],
      };
    }
    case "COMBINED_DERIVED_SHARE": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex);
      const combined = counts[a]! + counts[b]!;
      return {
        keyIdea: hi ? "दोनों व्युत्पन्न श्रेणियों के मान ज्ञात करें, उन्हें जोड़ें और संयुक्त मान को कुल के प्रतिशत के रूप में लिखें।" : "ਦੋਵੇਂ ਕੱਢੀਆਂ ਗਈਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਮੁੱਲ ਕੱਢੋ, ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜੋ ਅਤੇ ਮਿਲੇ ਹੋਏ ਮੁੱਲ ਨੂੰ ਕੁੱਲ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਜੋਂ ਲਿਖੋ।",
        steps: [
          ...uniqueSteps(steps(a), steps(b)),
          hi ? `संयुक्त मान = ${counts[a]} + ${counts[b]} = ${combined}।` : `ਮਿਲਿਆ ਹੋਇਆ ਮੁੱਲ = ${counts[a]} + ${counts[b]} = ${combined}।`,
          hi ? `प्रतिशत हिस्सेदारी = ${combined}/${stimulus.totalValue} × 100 = ${question.answer}।` : `ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ = ${combined}/${stimulus.totalValue} × 100 = ${question.answer}।`,
        ],
      };
    }
    case "REMAINDER_TO_DERIVED_RATIO": {
      const remainderIndex = Number(e.firstIndex), derivedIndex = Number(e.secondIndex);
      const relationTargets = stimulus.relations.map((relation) => relation.targetIndex);
      const knownSteps = uniqueSteps(...relationTargets.map((index) => steps(index)));
      const knownSubtotal = counts.reduce((sum, value, index) => index === remainderIndex ? sum : sum + value, 0);
      return {
        keyIdea: hi ? "पहले व्युत्पन्न श्रेणी और शेष श्रेणी का मान ज्ञात करें, फिर पूछे गए क्रम में अनुपात सरल करें।" : "ਪਹਿਲਾਂ ਕੱਢੀ ਗਈ ਸ਼੍ਰੇਣੀ ਅਤੇ ਬਾਕੀ ਸ਼੍ਰੇਣੀ ਦਾ ਮੁੱਲ ਕੱਢੋ, ਫਿਰ ਪੁੱਛੇ ਗਏ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",
        steps: [
          ...uniqueSteps(steps(derivedIndex), knownSteps),
          hi ? `चार ज्ञात श्रेणियों का योग = ${knownSubtotal}, इसलिए ${name(remainderIndex)} = ${counts[remainderIndex]}।` : `ਚਾਰ ਜਾਣੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਜੋੜ = ${knownSubtotal}, ਇਸ ਲਈ ${name(remainderIndex)} = ${counts[remainderIndex]}।`,
          `${name(remainderIndex)} : ${name(derivedIndex)} = ${counts[remainderIndex]} : ${counts[derivedIndex]} = ${question.answer}।`,
        ],
      };
    }
    case "RELATIVE_PERCENT_EXCESS": {
      const largerIndex = Number(e.largerIndex), smallerIndex = Number(e.smallerIndex);
      const difference = counts[largerIndex]! - counts[smallerIndex]!;
      return {
        keyIdea: hi ? "दोनों मान ज्ञात करें, उनका अंतर निकालें और अंतर को छोटे मान से भाग देकर 100 से गुणा करें।" : "ਦੋਵੇਂ ਮੁੱਲ ਕੱਢੋ, ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ ਅਤੇ ਅੰਤਰ ਨੂੰ ਛੋਟੇ ਮੁੱਲ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।",
        steps: [
          ...uniqueSteps(steps(largerIndex), steps(smallerIndex)),
          hi ? `अंतर = ${counts[largerIndex]} - ${counts[smallerIndex]} = ${difference}।` : `ਅੰਤਰ = ${counts[largerIndex]} - ${counts[smallerIndex]} = ${difference}।`,
          hi ? `प्रतिशत अधिक = ${difference}/${counts[smallerIndex]} × 100 = ${question.answer}।` : `ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ = ${difference}/${counts[smallerIndex]} × 100 = ${question.answer}।`,
        ],
      };
    }
  }
}

export function localizeDi006Question(
  source: ReturnType<typeof generateDi006PermanentQuestion>,
  locale: Di006LocalizationLocale,
) {
  const stimulus = localizeDi006Stimulus(source.stimulus, locale);
  const question = source.question;
  return {
    packageId: "DI-006" as const,
    requestedSeed: source.requestedSeed,
    sourceSeed: source.sourceSeed,
    examProfile: source.examProfile,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId: DI006_LOCALIZATION_REVIEW_ID,
    localizationReleaseId: DI006_LOCALIZATION_RELEASE_ID,
    localizationStatus: "HI_PA_FROZEN" as const,
    sourceEnglishStatus: "ENGLISH_REVIEW_APPROVED" as const,
    stimulus,
    question: {
      ...question,
      stem: localizedStem(question, source.stimulus, locale),
      explanation: explanationFor(question, source.stimulus, locale),
    },
    validation: source.validation,
    traceability: {
      ...source.traceability,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
      localizationStatus: "HI_PA_FROZEN" as const,
      questionStudioDiscoverable: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
  };
}

export function generateDi006LocalizedReviewQuestion(input: {
  seed: string;
  examProfile: Di006V2ExamProfile;
  taskKind: Di006V2TaskKind;
  locale: Di006LocalizationLocale;
}) {
  return localizeDi006Question(
    generateDi006PermanentQuestion({
      seed: input.seed,
      examProfile: input.examProfile,
      taskKind: input.taskKind,
    }),
    input.locale,
  );
}
