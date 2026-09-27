import { createHash } from "node:crypto";

import { RNK_PERSON_POOL_V2, type RnkObjectLocale } from "../foundation/rnk-object-pool-v2";
import {
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
  shortestRnkCp005EditorialV3Path,
  type RnkCp005EditorialV3State,
} from "./cp005-partial-order-editorial-v3-release";
import type { RnkCp005Context, RnkCp005Edge } from "./cp005-partial-order-runtime";
import {
  buildRnkCp005PermanentRuntime,
  type RnkCp005PermanentQuestion,
  type RnkCp005PermanentQlId,
} from "./cp005-permanent-runtime-v1";

export const RNK_CP005_LOCALIZATION_REVIEW_V1_VERSION =
  "RNK_CP005_HI_PA_LOCALIZATION_REVIEW_V1" as const;
export const RNK_CP005_LOCALIZATION_REVIEW_V1_AUTHORITY =
  "RNK_CP005_HI_PA_STRUCTURED_PARTIAL_ORDER_REVIEW_V1" as const;

export type RnkCp005LocalizedLocale = "hi-IN" | "pa-IN";

type AnyQuestion = Record<string, any>;
type AnyOption = Record<string, any> & {
  readonly label: string;
  readonly truth: boolean;
  readonly explanation: string;
};

type DiversityMetadata = Readonly<{
  introVariant: 0 | 1;
  queryVariant: 0 | 1;
  clueVariantIds: readonly (0 | 1 | 2)[];
  canonicalClueOrderKeys: readonly string[];
  renderedClueOrderKeys: readonly string[];
  clueOrderShuffled: boolean;
  maxConsecutiveSameClueTemplate: number;
}>;

export type RnkCp005LocalizedReviewQuestionV1 = Omit<
  RnkCp005PermanentQuestion,
  "instruction" | "clues" | "stem" | "options" | "answer" | "explanation"
> & {
  readonly locale: RnkCp005LocalizedLocale;
  readonly canonicalLocale: "en-IN";
  readonly canonicalNames: readonly string[];
  readonly localizedNames: readonly string[];
  readonly instruction: string;
  readonly clues: readonly string[];
  readonly stem: string;
  readonly options: readonly AnyOption[];
  readonly answer: string;
  readonly explanation: readonly string[];
  readonly localizationMetadata: Readonly<{
    version: typeof RNK_CP005_LOCALIZATION_REVIEW_V1_VERSION;
    locale: RnkCp005LocalizedLocale;
    learnerTextLocalized: true;
    structuredPartialOrderRendered: true;
    canonicalOutcomePreserved: true;
    validOrderSetPreserved: true;
    moderateEditorialDiversity: "SEEDED_2_INTRO_3_CLUE_2_QUERY_V1";
    diversity: DiversityMetadata;
    humanLanguageReviewRequired: true;
  }>;
  readonly localizationLifecycle: Readonly<{
    permanentQlAllocated: true;
    englishFrozen: true;
    hindiPunjabi: "REVIEW_CANDIDATE";
    humanLanguageReviewRequired: true;
    multilingualFreezeGranted: false;
    questionStudio: "DISABLED";
    persistence: "DISABLED";
    questionBank: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
    productDeliveryUnlocked: false;
  }>;
  readonly localizationProof: Readonly<{
    authority: typeof RNK_CP005_LOCALIZATION_REVIEW_V1_AUTHORITY;
    permanentQlId: RnkCp005PermanentQlId;
    canonicalPermanentRuntimeFingerprint: string;
    canonicalMathematicalFingerprint: string;
    sourceMode: string;
    semanticParity: "EXECUTABLE_PROVED";
    validOrderSetSource: "FROZEN_PARTIAL_ORDER_STATE";
    localizationFingerprint: string;
  }>;
};

function native(locale: RnkCp005LocalizedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function objectLocale(locale: RnkCp005LocalizedLocale): Exclude<RnkObjectLocale, "en"> {
  return locale === "hi-IN" ? "hi" : "pa";
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function localizedName(canonicalName: string, locale: RnkCp005LocalizedLocale): string {
  const entry = RNK_PERSON_POOL_V2.find((person) => person.names.en === canonicalName);
  if (!entry) throw new Error(`CP005 localization missing Object Pool V2 name: ${canonicalName}`);
  return entry.names[objectLocale(locale)];
}

function localNames(names: readonly string[], locale: RnkCp005LocalizedLocale): readonly string[] {
  return names.map((name) => localizedName(name, locale));
}

function localOrder(
  order: readonly string[],
  locale: RnkCp005LocalizedLocale,
): string {
  return order.map((name) => localizedName(name, locale)).join(" > ");
}

function formatNames(
  names: readonly string[],
  locale: RnkCp005LocalizedLocale,
): string {
  const localized = localNames(names, locale);
  if (localized.length === 0) return native(locale, "कोई नहीं", "ਕੋਈ ਨਹੀਂ");
  if (localized.length === 1) return localized[0]!;
  if (localized.length === 2) {
    return `${localized[0]} ${native(locale, "और", "ਅਤੇ")} ${localized[1]}`;
  }
  return `${localized.slice(0, -1).join(", ")} ${native(locale, "और", "ਅਤੇ")} ${localized.at(-1)}`;
}

function relationKey(edge: RnkCp005Edge): string {
  return `${edge.higher}>${edge.lower}`;
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const output = [...items];
  const random = seededRandom(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [output[index], output[swap]] = [output[swap]!, output[index]!];
  }
  if (
    output.length > 1 &&
    output.every((item, index) => item === items[index])
  ) {
    output.push(output.shift()!);
  }
  return output;
}

function clueVariants(count: number, seed: number): readonly (0 | 1 | 2)[] {
  const random = seededRandom(seed ^ 0x51f15e1d);
  const variants: (0 | 1 | 2)[] = [];
  for (let index = 0; index < count; index += 1) {
    let variant = Math.floor(random() * 3) as 0 | 1 | 2;
    if (
      variants.length >= 2 &&
      variants.at(-1) === variant &&
      variants.at(-2) === variant
    ) {
      variant = ((variant + 1 + Math.floor(random() * 2)) % 3) as 0 | 1 | 2;
    }
    variants.push(variant);
  }
  if (count >= 3 && new Set(variants).size === 1) {
    variants[variants.length - 1] = ((variants[0]! + 1) % 3) as 0 | 1 | 2;
  }
  return variants;
}

function maxRun(values: readonly number[]): number {
  let maximum = 0;
  let current = 0;
  let previous: number | undefined;
  for (const value of values) {
    if (value === previous) current += 1;
    else current = 1;
    previous = value;
    maximum = Math.max(maximum, current);
  }
  return maximum;
}

function contextIntro(
  context: RnkCp005Context,
  count: number,
  variant: 0 | 1,
  locale: RnkCp005LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    const variants: Record<RnkCp005Context, readonly [string, string]> = {
      MERIT_LIST: [
        `योग्यता सूची में ${count} अभ्यर्थियों के अलग-अलग स्थान हैं। नीचे दी गई जानकारी के आधार पर प्रश्न का उत्तर दें।`,
        `${count} अभ्यर्थियों की योग्यता सूची के बारे में कुछ जानकारियाँ दी गई हैं। इन्हें पढ़कर प्रश्न का उत्तर दें।`,
      ],
      INTERVIEW_SHORTLIST: [
        `साक्षात्कार सूची में ${count} अभ्यर्थियों के अलग-अलग स्थान हैं। नीचे दी गई जानकारी के आधार पर प्रश्न का उत्तर दें।`,
        `${count} अभ्यर्थियों की साक्षात्कार रैंकिंग के बारे में कुछ जानकारियाँ दी गई हैं। इन्हें पढ़कर प्रश्न का उत्तर दें।`,
      ],
      PERFORMANCE_REVIEW: [
        `प्रदर्शन के आधार पर ${count} कर्मचारियों की रैंक अलग-अलग है। नीचे दी गई जानकारी के आधार पर प्रश्न का उत्तर दें।`,
        `${count} कर्मचारियों के प्रदर्शन क्रम के बारे में कुछ जानकारियाँ दी गई हैं। इन्हें पढ़कर प्रश्न का उत्तर दें।`,
      ],
      RACE_RESULT: [
        `दौड़ में ${count} धावकों के स्थान अलग-अलग हैं। नीचे दी गई जानकारी के आधार पर प्रश्न का उत्तर दें।`,
        `${count} धावकों के दौड़-क्रम के बारे में कुछ जानकारियाँ दी गई हैं। इन्हें पढ़कर प्रश्न का उत्तर दें।`,
      ],
      EXAM_SCORE_ORDER: [
        `परीक्षा में ${count} विद्यार्थियों के अंक-आधारित स्थान अलग-अलग हैं। नीचे दी गई जानकारी के आधार पर प्रश्न का उत्तर दें।`,
        `${count} विद्यार्थियों की अंक-रैंकिंग के बारे में कुछ जानकारियाँ दी गई हैं। इन्हें पढ़कर प्रश्न का उत्तर दें।`,
      ],
    };
    return variants[context][variant];
  }

  const variants: Record<RnkCp005Context, readonly [string, string]> = {
    MERIT_LIST: [
      `ਯੋਗਤਾ ਸੂਚੀ ਵਿੱਚ ${count} ਉਮੀਦਵਾਰਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਸਥਾਨ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
      `${count} ਉਮੀਦਵਾਰਾਂ ਦੀ ਯੋਗਤਾ ਸੂਚੀ ਬਾਰੇ ਕੁਝ ਜਾਣਕਾਰੀਆਂ ਦਿੱਤੀਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
    ],
    INTERVIEW_SHORTLIST: [
      `ਇੰਟਰਵਿਊ ਸੂਚੀ ਵਿੱਚ ${count} ਉਮੀਦਵਾਰਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਸਥਾਨ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
      `${count} ਉਮੀਦਵਾਰਾਂ ਦੀ ਇੰਟਰਵਿਊ ਰੈਂਕਿੰਗ ਬਾਰੇ ਕੁਝ ਜਾਣਕਾਰੀਆਂ ਦਿੱਤੀਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
    ],
    PERFORMANCE_REVIEW: [
      `ਕਾਰਗੁਜ਼ਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ${count} ਕਰਮਚਾਰੀਆਂ ਦੀਆਂ ਰੈਂਕਾਂ ਵੱਖ-ਵੱਖ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
      `${count} ਕਰਮਚਾਰੀਆਂ ਦੇ ਕਾਰਗੁਜ਼ਾਰੀ ਕ੍ਰਮ ਬਾਰੇ ਕੁਝ ਜਾਣਕਾਰੀਆਂ ਦਿੱਤੀਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
    ],
    RACE_RESULT: [
      `ਦੌੜ ਵਿੱਚ ${count} ਦੌੜਾਕਾਂ ਦੇ ਸਥਾਨ ਵੱਖ-ਵੱਖ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
      `${count} ਦੌੜਾਕਾਂ ਦੇ ਦੌੜ-ਕ੍ਰਮ ਬਾਰੇ ਕੁਝ ਜਾਣਕਾਰੀਆਂ ਦਿੱਤੀਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
    ],
    EXAM_SCORE_ORDER: [
      `ਪ੍ਰੀਖਿਆ ਵਿੱਚ ${count} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕਾਂ ਅਨੁਸਾਰ ਸਥਾਨ ਵੱਖ-ਵੱਖ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
      `${count} ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਅੰਕ-ਰੈਂਕਿੰਗ ਬਾਰੇ ਕੁਝ ਜਾਣਕਾਰੀਆਂ ਦਿੱਤੀਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।`,
    ],
  };
  return variants[context][variant];
}

function contextClue(
  context: RnkCp005Context,
  edge: RnkCp005Edge,
  variant: 0 | 1 | 2,
  locale: RnkCp005LocalizedLocale,
): string {
  const higher = localizedName(edge.higher, locale);
  const lower = localizedName(edge.lower, locale);

  if (locale === "hi-IN") {
    const templates: Record<RnkCp005Context, readonly [string, string, string]> = {
      MERIT_LIST: [
        `${higher} की रैंक ${lower} से ऊपर है।`,
        `योग्यता सूची में ${higher} का स्थान ${lower} से ऊपर है।`,
        `${lower} की रैंक ${higher} से नीचे है।`,
      ],
      INTERVIEW_SHORTLIST: [
        `${higher} साक्षात्कार सूची में ${lower} से ऊपर है।`,
        `${higher} की साक्षात्कार रैंक ${lower} से बेहतर है।`,
        `${lower} का साक्षात्कार स्थान ${higher} से नीचे है।`,
      ],
      PERFORMANCE_REVIEW: [
        `${higher} की प्रदर्शन रैंक ${lower} से बेहतर है।`,
        `प्रदर्शन क्रम में ${higher}, ${lower} से ऊपर है।`,
        `${lower} की प्रदर्शन रैंक ${higher} से नीचे है।`,
      ],
      RACE_RESULT: [
        `${higher} ने ${lower} से पहले दौड़ पूरी की।`,
        `दौड़ के परिणाम में ${higher} का स्थान ${lower} से ऊपर है।`,
        `${lower} ने ${higher} के बाद दौड़ पूरी की।`,
      ],
      EXAM_SCORE_ORDER: [
        `${higher} ने ${lower} से अधिक अंक प्राप्त किए।`,
        `अंकों के आधार पर ${higher} की रैंक ${lower} से ऊपर है।`,
        `अंक-क्रम में ${lower} का स्थान ${higher} से नीचे है।`,
      ],
    };
    return templates[context][variant];
  }

  const templates: Record<RnkCp005Context, readonly [string, string, string]> = {
    MERIT_LIST: [
      `${higher} ਦੀ ਰੈਂਕ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `ਯੋਗਤਾ ਸੂਚੀ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦੀ ਰੈਂਕ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    INTERVIEW_SHORTLIST: [
      `${higher} ਇੰਟਰਵਿਊ ਸੂਚੀ ਵਿੱਚ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${higher} ਦੀ ਇੰਟਰਵਿਊ ਰੈਂਕ ${lower} ਨਾਲੋਂ ਬਿਹਤਰ ਹੈ।`,
      `${lower} ਦਾ ਇੰਟਰਵਿਊ ਸਥਾਨ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    PERFORMANCE_REVIEW: [
      `${higher} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਰੈਂਕ ${lower} ਨਾਲੋਂ ਬਿਹਤਰ ਹੈ।`,
      `ਕਾਰਗੁਜ਼ਾਰੀ ਕ੍ਰਮ ਵਿੱਚ ${higher}, ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਰੈਂਕ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    RACE_RESULT: [
      `${higher} ਨੇ ${lower} ਤੋਂ ਪਹਿਲਾਂ ਦੌੜ ਪੂਰੀ ਕੀਤੀ।`,
      `ਦੌੜ ਦੇ ਨਤੀਜੇ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਨੇ ${higher} ਤੋਂ ਬਾਅਦ ਦੌੜ ਪੂਰੀ ਕੀਤੀ।`,
    ],
    EXAM_SCORE_ORDER: [
      `${higher} ਨੇ ${lower} ਨਾਲੋਂ ਵੱਧ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ।`,
      `ਅੰਕਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ${higher} ਦੀ ਰੈਂਕ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `ਅੰਕ-ਕ੍ਰਮ ਵਿੱਚ ${lower} ਦਾ ਸਥਾਨ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
  };
  return templates[context][variant];
}

function ordinal(value: number, locale: RnkCp005LocalizedLocale): string {
  if (locale === "hi-IN") {
    return (["", "पहला", "दूसरा", "तीसरा", "चौथा", "पाँचवाँ", "छठा", "सातवाँ", "आठवाँ"] as const)[value] ?? `${value}वाँ`;
  }
  return (["", "ਪਹਿਲਾ", "ਦੂਜਾ", "ਤੀਜਾ", "ਚੌਥਾ", "ਪੰਜਵਾਂ", "ਛੇਵਾਂ", "ਸੱਤਵਾਂ", "ਅੱਠਵਾਂ"] as const)[value] ?? `${value}ਵਾਂ`;
}

function parseOrdinal(label: string): number | undefined {
  const match = label.match(/^(\d+)(?:st|nd|rd|th)$/i);
  return match ? Number(match[1]) : undefined;
}

function parseRelationLabel(label: string): { first: string; second: string } | undefined {
  const match = label.match(/^(.+?) ranks above (.+?)\.?$/i);
  if (!match) return undefined;
  return { first: match[1]!.trim(), second: match[2]!.trim() };
}

function parseMustRelationLabel(label: string): { first: string; second: string } | undefined {
  const match = label.match(/^(.+?) must rank above (.+?)\.?$/i);
  if (!match) return undefined;
  return { first: match[1]!.trim(), second: match[2]!.trim() };
}

function parsePairStem(stem: string): { first: string; second: string } {
  const match = stem.match(/relative ranks of (.+?) and (.+?)\?$/i);
  if (!match) throw new Error(`CP005 localization pair stem did not parse: ${stem}`);
  return { first: match[1]!.trim(), second: match[2]!.trim() };
}

function parseTarget(stem: string): string {
  const match = stem.match(/(?:possible rank of|rank of) (.+?)\?$/i);
  if (!match) throw new Error(`CP005 localization target stem did not parse: ${stem}`);
  return match[1]!.trim();
}

function relationLabel(
  first: string,
  second: string,
  locale: RnkCp005LocalizedLocale,
): string {
  const a = localizedName(first, locale);
  const b = localizedName(second, locale);
  return native(locale, `${a} की रैंक ${b} से ऊपर है।`, `${a} ਦੀ ਰੈਂਕ ${b} ਤੋਂ ਉੱਪਰ ਹੈ।`);
}

function indeterminateLabel(locale: RnkCp005LocalizedLocale): string {
  return native(
    locale,
    "दोनों की आपसी रैंक निश्चित रूप से तय नहीं की जा सकती।",
    "ਦੋਵਾਂ ਦੀ ਆਪਸੀ ਰੈਂਕ ਪੱਕੀ ਤਰ੍ਹਾਂ ਤੈਅ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।",
  );
}

function exactIndeterminateLabel(locale: RnkCp005LocalizedLocale): string {
  return native(
    locale,
    "रैंक निश्चित रूप से तय नहीं की जा सकती।",
    "ਰੈਂਕ ਪੱਕੀ ਤਰ੍ਹਾਂ ਤੈਅ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।",
  );
}

function witness(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
  firstAbove: boolean,
): readonly string[] | undefined {
  return state.validOrders.find((order) =>
    firstAbove
      ? order.indexOf(first) < order.indexOf(second)
      : order.indexOf(second) < order.indexOf(first),
  );
}

function rankSet(state: RnkCp005EditorialV3State, entity: string): readonly number[] {
  return [...new Set(state.validOrders.map((order) => order.indexOf(entity) + 1))].sort((a, b) => a - b);
}

function mandatoryAbove(state: RnkCp005EditorialV3State, entity: string): readonly string[] {
  return state.entities.filter(
    (other) => other !== entity && classifyRnkCp005EditorialV3Relation(state, other, entity) === "DEFINITE",
  );
}

function mandatoryBelow(state: RnkCp005EditorialV3State, entity: string): readonly string[] {
  return state.entities.filter(
    (other) => other !== entity && classifyRnkCp005EditorialV3Relation(state, entity, other) === "DEFINITE",
  );
}

function directEdge(state: RnkCp005EditorialV3State, first: string, second: string): boolean {
  return state.edges.some((edge) => edge.higher === first && edge.lower === second);
}

function derivedPath(
  state: RnkCp005EditorialV3State,
  target: string,
  direction: "ABOVE" | "BELOW" | "EITHER",
): readonly string[] | undefined {
  if (direction !== "BELOW") {
    for (const name of mandatoryAbove(state, target)) {
      if (directEdge(state, name, target)) continue;
      const path = shortestRnkCp005EditorialV3Path(state, name, target);
      if (path && path.length >= 3) return path;
    }
  }
  if (direction !== "ABOVE") {
    for (const name of mandatoryBelow(state, target)) {
      if (directEdge(state, target, name)) continue;
      const path = shortestRnkCp005EditorialV3Path(state, target, name);
      if (path && path.length >= 3) return path;
    }
  }
  return undefined;
}

function localizedQuery(
  canonical: AnyQuestion,
  targetOrPair: string | readonly [string, string] | undefined,
  variant: 0 | 1,
  locale: RnkCp005LocalizedLocale,
): string {
  const mode = canonical.candidateRuntimeProfile.mode as string;
  if (mode === "MUST") {
    return variant === 0
      ? native(locale, "निम्न में से कौन-सा कथन निश्चित रूप से सही है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ?")
      : native(locale, "कौन-सा संबंध हर संभव क्रम में सही रहेगा?", "ਕਿਹੜਾ ਸੰਬੰਧ ਹਰ ਸੰਭਵ ਕ੍ਰਮ ਵਿੱਚ ਸਹੀ ਰਹੇਗਾ?");
  }
  if (mode === "COULD") {
    return variant === 0
      ? native(locale, "निम्न में से कौन-सा कथन संभव हो सकता है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸੰਭਵ ਹੋ ਸਕਦਾ ਹੈ?")
      : native(locale, "कौन-सा संबंध कम-से-कम एक वैध क्रम में सही हो सकता है?", "ਕਿਹੜਾ ਸੰਬੰਧ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਸਹੀ ਹੋ ਸਕਦਾ ਹੈ?");
  }
  if (mode === "CANNOT") {
    return variant === 0
      ? native(locale, "निम्न में से कौन-सा कथन सही नहीं हो सकता?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦਾ?")
      : native(locale, "कौन-सा संबंध किसी भी वैध क्रम में संभव नहीं है?", "ਕਿਹੜਾ ਸੰਬੰਧ ਕਿਸੇ ਵੀ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਸੰਭਵ ਨਹੀਂ ਹੈ?");
  }
  if (mode.startsWith("PAIR_")) {
    const [first, second] = targetOrPair as readonly [string, string];
    const a = localizedName(first, locale);
    const b = localizedName(second, locale);
    return variant === 0
      ? native(locale, `${a} और ${b} की आपसी रैंक के बारे में क्या निश्चित किया जा सकता है?`, `${a} ਅਤੇ ${b} ਦੀ ਆਪਸੀ ਰੈਂਕ ਬਾਰੇ ਕੀ ਪੱਕਾ ਕਿਹਾ ਜਾ ਸਕਦਾ ਹੈ?`)
      : native(locale, `${a} और ${b} में कौन ऊपर है, या क्या यह निश्चित नहीं है?`, `${a} ਅਤੇ ${b} ਵਿੱਚੋਂ ਕੌਣ ਉੱਪਰ ਹੈ, ਜਾਂ ਕੀ ਇਹ ਪੱਕਾ ਨਹੀਂ ਹੈ?`);
  }
  const target = localizedName(targetOrPair as string, locale);
  if (mode === "HIGHEST_POSSIBLE") {
    return variant === 0
      ? native(locale, `${target} की सबसे ऊँची संभव रैंक क्या है?`, `${target} ਦੀ ਸਭ ਤੋਂ ਉੱਚੀ ਸੰਭਵ ਰੈਂਕ ਕੀ ਹੈ?`)
      : native(locale, `${target} की सबसे अच्छी संभव रैंक कौन-सी है?`, `${target} ਦੀ ਸਭ ਤੋਂ ਵਧੀਆ ਸੰਭਵ ਰੈਂਕ ਕਿਹੜੀ ਹੈ?`);
  }
  if (mode === "LOWEST_POSSIBLE") {
    return variant === 0
      ? native(locale, `${target} की सबसे नीची संभव रैंक क्या है?`, `${target} ਦੀ ਸਭ ਤੋਂ ਹੇਠਲੀ ਸੰਭਵ ਰੈਂਕ ਕੀ ਹੈ?`)
      : native(locale, `${target} का सबसे नीचे का संभव स्थान कौन-सा है?`, `${target} ਦਾ ਸਭ ਤੋਂ ਹੇਠਲਾ ਸੰਭਵ ਸਥਾਨ ਕਿਹੜਾ ਹੈ?`);
  }
  return variant === 0
    ? native(locale, `${target} की रैंक क्या है?`, `${target} ਦੀ ਰੈਂਕ ਕੀ ਹੈ?`)
    : native(locale, `दी गई जानकारी से ${target} की सही रैंक क्या तय होती है?`, `ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ${target} ਦੀ ਸਹੀ ਰੈਂਕ ਕੀ ਤੈਅ ਹੁੰਦੀ ਹੈ?`);
}

function relationOptionExplanation(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
  mode: "MUST" | "COULD" | "CANNOT",
  locale: RnkCp005LocalizedLocale,
): string {
  const classification = classifyRnkCp005EditorialV3Relation(state, first, second);
  if (mode === "MUST") {
    if (classification === "DEFINITE") {
      const path = shortestRnkCp005EditorialV3Path(state, first, second);
      return native(
        locale,
        `${localOrder(path ?? [first, second], locale)} से यह संबंध हर वैध क्रम में तय रहता है`,
        `${localOrder(path ?? [first, second], locale)} ਤੋਂ ਇਹ ਸੰਬੰਧ ਹਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਤੈਅ ਰਹਿੰਦਾ ਹੈ`,
      );
    }
    if (classification === "VARIABLE") {
      const order = witness(state, first, second, false)!;
      return native(
        locale,
        `${localOrder(order, locale)} भी वैध है और इसमें इसका उलटा क्रम है`,
        `${localOrder(order, locale)} ਵੀ ਸਹੀ ਹੈ ਅਤੇ ਇਸ ਵਿੱਚ ਉਲਟ ਕ੍ਰਮ ਹੈ`,
      );
    }
    const path = shortestRnkCp005EditorialV3Path(state, second, first)!;
    return native(
      locale,
      `${localOrder(path, locale)} इसका उलटा संबंध निश्चित करता है`,
      `${localOrder(path, locale)} ਇਸ ਦਾ ਉਲਟ ਸੰਬੰਧ ਪੱਕਾ ਕਰਦਾ ਹੈ`,
    );
  }
  if (mode === "COULD") {
    if (classification === "VARIABLE") {
      const order = witness(state, first, second, true)!;
      return native(
        locale,
        `${localOrder(order, locale)} एक वैध क्रम है जिसमें यह संबंध सही है`,
        `${localOrder(order, locale)} ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਹੈ ਜਿਸ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਸਹੀ ਹੈ`,
      );
    }
    const path = shortestRnkCp005EditorialV3Path(state, second, first)!;
    return native(
      locale,
      `${localOrder(path, locale)} उलटा संबंध निश्चित करता है, इसलिए यह संभव नहीं है`,
      `${localOrder(path, locale)} ਉਲਟ ਸੰਬੰਧ ਪੱਕਾ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਭਵ ਨਹੀਂ ਹੈ`,
    );
  }
  if (classification === "IMPOSSIBLE") {
    const path = shortestRnkCp005EditorialV3Path(state, second, first)!;
    return native(
      locale,
      `${localOrder(path, locale)} के कारण यह संबंध किसी वैध क्रम में नहीं हो सकता`,
      `${localOrder(path, locale)} ਕਰਕੇ ਇਹ ਸੰਬੰਧ ਕਿਸੇ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਨਹੀਂ ਹੋ ਸਕਦਾ`,
    );
  }
  const order = witness(state, first, second, true)!;
  return native(
    locale,
    `${localOrder(order, locale)} एक वैध क्रम है जिसमें यह संबंध होता है`,
    `${localOrder(order, locale)} ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਹੈ ਜਿਸ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਹੁੰਦਾ ਹੈ`,
  );
}

function pairDistances(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): readonly number[] {
  return [...new Set(state.validOrders.map((order) => Math.abs(order.indexOf(first) - order.indexOf(second))))].sort((a, b) => a - b);
}

function pairOption(
  canonicalOption: AnyOption,
  state: RnkCp005EditorialV3State,
  pair: readonly [string, string],
  locale: RnkCp005LocalizedLocale,
): AnyOption {
  const direct = parseMustRelationLabel(canonicalOption.label);
  if (direct) {
    const classification = classifyRnkCp005EditorialV3Relation(state, direct.first, direct.second);
    let explanation: string;
    if (classification === "DEFINITE") {
      const path = shortestRnkCp005EditorialV3Path(state, direct.first, direct.second)!;
      explanation = native(
        locale,
        `${localOrder(path, locale)} इस क्रम को निश्चित करता है`,
        `${localOrder(path, locale)} ਇਸ ਕ੍ਰਮ ਨੂੰ ਪੱਕਾ ਕਰਦਾ ਹੈ`,
      );
    } else {
      const opposite = witness(state, direct.first, direct.second, false)!;
      explanation = native(
        locale,
        `${localOrder(opposite, locale)} भी वैध है और इसमें उलटा क्रम है`,
        `${localOrder(opposite, locale)} ਵੀ ਸਹੀ ਹੈ ਅਤੇ ਇਸ ਵਿੱਚ ਉਲਟ ਕ੍ਰਮ ਹੈ`,
      );
    }
    return { ...canonicalOption, label: relationLabel(direct.first, direct.second, locale), explanation };
  }

  if (/relative ranks cannot be determined uniquely/i.test(canonicalOption.label)) {
    const classification = classifyRnkCp005EditorialV3Relation(state, pair[0], pair[1]);
    const explanation = classification === "VARIABLE"
      ? native(locale, "दोनों आपसी क्रम वैध रैंकिंग में मिलते हैं", "ਦੋਵੇਂ ਆਪਸੀ ਕ੍ਰਮ ਸਹੀ ਰੈਂਕਿੰਗਾਂ ਵਿੱਚ ਮਿਲਦੇ ਹਨ")
      : native(locale, "तुलनाओं की श्रृंखला दोनों की आपसी रैंक तय कर देती है", "ਤੁਲਨਾਵਾਂ ਦੀ ਲੜੀ ਦੋਵਾਂ ਦੀ ਆਪਸੀ ਰੈਂਕ ਤੈਅ ਕਰ ਦਿੰਦੀ ਹੈ");
    return { ...canonicalOption, label: indeterminateLabel(locale), explanation };
  }

  const consecutive = canonicalOption.label.match(/^(.+?) and (.+?) must be consecutive in the ranking\.?$/i);
  if (consecutive) {
    const first = consecutive[1]!.trim();
    const second = consecutive[2]!.trim();
    const distances = pairDistances(state, first, second);
    const label = native(
      locale,
      `${localizedName(first, locale)} और ${localizedName(second, locale)} लगातार स्थानों पर होना जरूरी है।`,
      `${localizedName(first, locale)} ਅਤੇ ${localizedName(second, locale)} ਲਗਾਤਾਰ ਸਥਾਨਾਂ 'ਤੇ ਹੋਣਾ ਜ਼ਰੂਰੀ ਹੈ।`,
    );
    const explanation = distances.length === 1
      ? native(locale, `दोनों के स्थानों का अंतर ${distances[0]} है, इसलिए वे लगातार नहीं हैं`, `ਦੋਵਾਂ ਦੇ ਸਥਾਨਾਂ ਦਾ ਫਰਕ ${distances[0]} ਹੈ, ਇਸ ਲਈ ਉਹ ਲਗਾਤਾਰ ਨਹੀਂ ਹਨ`)
      : native(locale, "अलग वैध क्रमों में दोनों के बीच का अंतर बदलता है, इसलिए लगातार होना जरूरी नहीं है", "ਵੱਖ-ਵੱਖ ਸਹੀ ਕ੍ਰਮਾਂ ਵਿੱਚ ਦੋਵਾਂ ਦਾ ਫਰਕ ਬਦਲਦਾ ਹੈ, ਇਸ ਲਈ ਲਗਾਤਾਰ ਹੋਣਾ ਜ਼ਰੂਰੀ ਨਹੀਂ ਹੈ");
    return { ...canonicalOption, label, explanation };
  }

  const between = canonicalOption.label.match(/^Exactly (\d+) (?:person|people) must be ranked between (.+?) and (.+?)\.?$/i);
  if (between) {
    const count = Number(between[1]);
    const first = between[2]!.trim();
    const second = between[3]!.trim();
    const distances = pairDistances(state, first, second);
    const claimedDistance = count + 1;
    const label = native(
      locale,
      `${localizedName(first, locale)} और ${localizedName(second, locale)} के बीच ठीक ${count} ${count === 1 ? "व्यक्ति" : "व्यक्ति"} होना जरूरी है।`,
      `${localizedName(first, locale)} ਅਤੇ ${localizedName(second, locale)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${count} ${count === 1 ? "ਵਿਅਕਤੀ" : "ਵਿਅਕਤੀ"} ਹੋਣਾ ਜ਼ਰੂਰੀ ਹੈ।`,
    );
    const explanation = distances.length === 1
      ? native(locale, `दोनों का वास्तविक स्थान-अंतर ${distances[0]} है, ${claimedDistance} नहीं`, `ਦੋਵਾਂ ਦਾ ਅਸਲ ਸਥਾਨ-ਫਰਕ ${distances[0]} ਹੈ, ${claimedDistance} ਨਹੀਂ`)
      : native(locale, "अलग वैध क्रमों में दोनों के बीच लोगों की संख्या बदलती है, इसलिए यह संख्या जरूरी नहीं है", "ਵੱਖ-ਵੱਖ ਸਹੀ ਕ੍ਰਮਾਂ ਵਿੱਚ ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਬਦਲਦੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਗਿਣਤੀ ਜ਼ਰੂਰੀ ਨਹੀਂ ਹੈ");
    return { ...canonicalOption, label, explanation };
  }

  throw new Error(`CP005 localization unsupported pair option: ${canonicalOption.label}`);
}

function relationExplanation(
  canonical: AnyQuestion,
  state: RnkCp005EditorialV3State,
  locale: RnkCp005LocalizedLocale,
): readonly string[] {
  const mode = canonical.candidateRuntimeProfile.mode as "MUST" | "COULD" | "CANNOT";
  const correct = parseRelationLabel(canonical.options[canonical.correctIndex].label)!;
  if (mode === "MUST") {
    const path = shortestRnkCp005EditorialV3Path(state, correct.first, correct.second)!;
    return [
      native(locale, `तुलनाओं को जोड़ें: ${localOrder(path, locale)}।`, `ਤੁਲਨਾਵਾਂ ਨੂੰ ਜੋੜੋ: ${localOrder(path, locale)}।`),
      native(locale, `इसलिए ${localizedName(correct.first, locale)} की रैंक ${localizedName(correct.second, locale)} से हर वैध क्रम में ऊपर रहेगी।`, `ਇਸ ਲਈ ${localizedName(correct.first, locale)} ਦੀ ਰੈਂਕ ${localizedName(correct.second, locale)} ਤੋਂ ਹਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਉੱਪਰ ਰਹੇਗੀ।`),
    ];
  }
  if (mode === "COULD") {
    const order = witness(state, correct.first, correct.second, true)!;
    return [
      native(locale, `${localOrder(order, locale)} सभी दी गई तुलनाओं को पूरा करने वाला एक वैध क्रम है।`, `${localOrder(order, locale)} ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲਾ ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਹੈ।`),
      native(locale, `इस क्रम में ${localizedName(correct.first, locale)} की रैंक ${localizedName(correct.second, locale)} से ऊपर है, इसलिए यह संबंध संभव है।`, `ਇਸ ਕ੍ਰਮ ਵਿੱਚ ${localizedName(correct.first, locale)} ਦੀ ਰੈਂਕ ${localizedName(correct.second, locale)} ਤੋਂ ਉੱਪਰ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਬੰਧ ਸੰਭਵ ਹੈ।`),
    ];
  }
  const path = shortestRnkCp005EditorialV3Path(state, correct.second, correct.first)!;
  return [
    native(locale, `तुलनाएँ ${localOrder(path, locale)} को निश्चित करती हैं।`, `ਤੁਲਨਾਵਾਂ ${localOrder(path, locale)} ਨੂੰ ਪੱਕਾ ਕਰਦੀਆਂ ਹਨ।`),
    native(locale, `इसलिए ${localizedName(correct.first, locale)} की रैंक ${localizedName(correct.second, locale)} से ऊपर किसी भी वैध क्रम में नहीं हो सकती।`, `ਇਸ ਲਈ ${localizedName(correct.first, locale)} ਦੀ ਰੈਂਕ ${localizedName(correct.second, locale)} ਤੋਂ ਉੱਪਰ ਕਿਸੇ ਵੀ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਨਹੀਂ ਹੋ ਸਕਦੀ।`),
  ];
}

function pairExplanation(
  canonical: AnyQuestion,
  state: RnkCp005EditorialV3State,
  pair: readonly [string, string],
  locale: RnkCp005LocalizedLocale,
): readonly string[] {
  const classification = classifyRnkCp005EditorialV3Relation(state, pair[0], pair[1]);
  if (classification === "DEFINITE") {
    const path = shortestRnkCp005EditorialV3Path(state, pair[0], pair[1])!;
    return [
      native(locale, `तुलनाओं को जोड़ें: ${localOrder(path, locale)}।`, `ਤੁਲਨਾਵਾਂ ਨੂੰ ਜੋੜੋ: ${localOrder(path, locale)}।`),
      native(locale, `इसलिए ${localizedName(pair[0], locale)} की रैंक ${localizedName(pair[1], locale)} से ऊपर निश्चित है।`, `ਇਸ ਲਈ ${localizedName(pair[0], locale)} ਦੀ ਰੈਂਕ ${localizedName(pair[1], locale)} ਤੋਂ ਉੱਪਰ ਪੱਕੀ ਹੈ।`),
    ];
  }
  if (classification === "IMPOSSIBLE") {
    const path = shortestRnkCp005EditorialV3Path(state, pair[1], pair[0])!;
    return [
      native(locale, `तुलनाओं को जोड़ें: ${localOrder(path, locale)}।`, `ਤੁਲਨਾਵਾਂ ਨੂੰ ਜੋੜੋ: ${localOrder(path, locale)}।`),
      native(locale, `इसलिए ${localizedName(pair[1], locale)} की रैंक ${localizedName(pair[0], locale)} से ऊपर निश्चित है।`, `ਇਸ ਲਈ ${localizedName(pair[1], locale)} ਦੀ ਰੈਂਕ ${localizedName(pair[0], locale)} ਤੋਂ ਉੱਪਰ ਪੱਕੀ ਹੈ।`),
    ];
  }
  const first = witness(state, pair[0], pair[1], true)!;
  const second = witness(state, pair[0], pair[1], false)!;
  return [
    native(locale, `${localOrder(first, locale)} एक वैध क्रम है जिसमें ${localizedName(pair[0], locale)} ऊपर है।`, `${localOrder(first, locale)} ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਹੈ ਜਿਸ ਵਿੱਚ ${localizedName(pair[0], locale)} ਉੱਪਰ ਹੈ।`),
    native(locale, `${localOrder(second, locale)} भी वैध है और इसमें ${localizedName(pair[1], locale)} ऊपर है।`, `${localOrder(second, locale)} ਵੀ ਸਹੀ ਹੈ ਅਤੇ ਇਸ ਵਿੱਚ ${localizedName(pair[1], locale)} ਉੱਪਰ ਹੈ।`),
    native(locale, "दोनों क्रम संभव हैं, इसलिए उनकी आपसी रैंक निश्चित नहीं की जा सकती।", "ਦੋਵੇਂ ਕ੍ਰਮ ਸੰਭਵ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀ ਆਪਸੀ ਰੈਂਕ ਪੱਕੀ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।"),
  ];
}

function rankBoundExplanation(
  canonical: AnyQuestion,
  state: RnkCp005EditorialV3State,
  target: string,
  locale: RnkCp005LocalizedLocale,
): readonly string[] {
  const mode = canonical.candidateRuntimeProfile.mode as "HIGHEST_POSSIBLE" | "LOWEST_POSSIBLE";
  const highest = mode === "HIGHEST_POSSIBLE";
  const ranks = rankSet(state, target);
  const boundary = highest ? ranks[0]! : ranks.at(-1)!;
  const compulsory = highest ? mandatoryAbove(state, target) : mandatoryBelow(state, target);
  const path = derivedPath(state, target, highest ? "ABOVE" : "BELOW");
  const order = state.validOrders.find((candidate) => candidate.indexOf(target) + 1 === boundary)!;
  const targetLocal = localizedName(target, locale);
  const steps: string[] = [];
  if (path) {
    steps.push(native(locale, `एक जरूरी श्रृंखला है: ${localOrder(path, locale)}।`, `ਇੱਕ ਜ਼ਰੂਰੀ ਲੜੀ ਹੈ: ${localOrder(path, locale)}।`));
  }
  steps.push(
    highest
      ? native(locale, `${targetLocal} से ऊपर ${formatNames(compulsory, locale)} का रहना जरूरी है। इसलिए कम-से-कम ${compulsory.length} व्यक्ति ऊपर होंगे और ${targetLocal} ${ordinal(boundary, locale)} से ऊपर नहीं जा सकता।`, `${targetLocal} ਤੋਂ ਉੱਪਰ ${formatNames(compulsory, locale)} ਦਾ ਰਹਿਣਾ ਜ਼ਰੂਰੀ ਹੈ। ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ${compulsory.length} ਵਿਅਕਤੀ ਉੱਪਰ ਹੋਣਗੇ ਅਤੇ ${targetLocal} ${ordinal(boundary, locale)} ਤੋਂ ਉੱਪਰ ਨਹੀਂ ਜਾ ਸਕਦਾ।`)
      : native(locale, `${targetLocal} से नीचे ${formatNames(compulsory, locale)} का रहना जरूरी है। इसलिए कम-से-कम ${compulsory.length} व्यक्ति नीचे होंगे और ${targetLocal} ${ordinal(boundary, locale)} से नीचे नहीं जा सकता।`, `${targetLocal} ਤੋਂ ਹੇਠਾਂ ${formatNames(compulsory, locale)} ਦਾ ਰਹਿਣਾ ਜ਼ਰੂਰੀ ਹੈ। ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ${compulsory.length} ਵਿਅਕਤੀ ਹੇਠਾਂ ਹੋਣਗੇ ਅਤੇ ${targetLocal} ${ordinal(boundary, locale)} ਤੋਂ ਹੇਠਾਂ ਨਹੀਂ ਜਾ ਸਕਦਾ।`),
  );
  steps.push(
    native(locale, `${localOrder(order, locale)} एक वैध क्रम है जिसमें ${targetLocal} ${ordinal(boundary, locale)} स्थान पर है। इसलिए यही सीमा वास्तव में संभव है।`, `${localOrder(order, locale)} ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਹੈ ਜਿਸ ਵਿੱਚ ${targetLocal} ${ordinal(boundary, locale)} ਸਥਾਨ 'ਤੇ ਹੈ। ਇਸ ਲਈ ਇਹੀ ਹੱਦ ਅਸਲ ਵਿੱਚ ਸੰਭਵ ਹੈ।`),
  );
  return steps;
}

function exactRankExplanation(
  state: RnkCp005EditorialV3State,
  target: string,
  locale: RnkCp005LocalizedLocale,
): readonly string[] {
  const ranks = rankSet(state, target);
  const targetLocal = localizedName(target, locale);
  if (ranks.length === 1) {
    const above = mandatoryAbove(state, target);
    const below = mandatoryBelow(state, target);
    const path = derivedPath(state, target, "EITHER");
    const steps: string[] = [];
    if (path) steps.push(native(locale, `एक जरूरी श्रृंखला है: ${localOrder(path, locale)}।`, `ਇੱਕ ਜ਼ਰੂਰੀ ਲੜੀ ਹੈ: ${localOrder(path, locale)}।`));
    steps.push(native(
      locale,
      `${targetLocal} से ऊपर ${formatNames(above, locale)} और नीचे ${formatNames(below, locale)} का रहना तय है।`,
      `${targetLocal} ਤੋਂ ਉੱਪਰ ${formatNames(above, locale)} ਅਤੇ ਹੇਠਾਂ ${formatNames(below, locale)} ਦਾ ਰਹਿਣਾ ਤੈਅ ਹੈ।`,
    ));
    steps.push(native(
      locale,
      `इससे बाकी सभी ${state.entities.length - 1} व्यक्तियों की स्थिति ${targetLocal} के सापेक्ष तय हो जाती है, इसलिए ${targetLocal} की रैंक ${ordinal(ranks[0]!, locale)} है।`,
      `ਇਸ ਨਾਲ ਬਾਕੀ ਸਾਰੇ ${state.entities.length - 1} ਵਿਅਕਤੀਆਂ ਦੀ ਸਥਿਤੀ ${targetLocal} ਦੇ ਮੁਕਾਬਲੇ ਤੈਅ ਹੋ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ${targetLocal} ਦੀ ਰੈਂਕ ${ordinal(ranks[0]!, locale)} ਹੈ।`,
    ));
    return steps;
  }
  const firstRank = ranks[0]!;
  const lastRank = ranks.at(-1)!;
  const firstOrder = state.validOrders.find((order) => order.indexOf(target) + 1 === firstRank)!;
  const lastOrder = state.validOrders.find((order) => order.indexOf(target) + 1 === lastRank)!;
  return [
    native(locale, `${localOrder(firstOrder, locale)} एक वैध क्रम है जिसमें ${targetLocal} की रैंक ${ordinal(firstRank, locale)} है।`, `${localOrder(firstOrder, locale)} ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਹੈ ਜਿਸ ਵਿੱਚ ${targetLocal} ਦੀ ਰੈਂਕ ${ordinal(firstRank, locale)} ਹੈ।`),
    native(locale, `${localOrder(lastOrder, locale)} भी वैध है, लेकिन इसमें ${targetLocal} की रैंक ${ordinal(lastRank, locale)} है।`, `${localOrder(lastOrder, locale)} ਵੀ ਸਹੀ ਹੈ, ਪਰ ਇਸ ਵਿੱਚ ${targetLocal} ਦੀ ਰੈਂਕ ${ordinal(lastRank, locale)} ਹੈ।`),
    native(locale, "दो अलग वैध रैंक मिलने के कारण सही रैंक निश्चित रूप से तय नहीं की जा सकती।", "ਦੋ ਵੱਖਰੀਆਂ ਸਹੀ ਰੈਂਕਾਂ ਮਿਲਣ ਕਰਕੇ ਪੱਕੀ ਰੈਂਕ ਤੈਅ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।"),
  ];
}

function rankOption(
  canonicalOption: AnyOption,
  state: RnkCp005EditorialV3State,
  target: string,
  mode: "HIGHEST_POSSIBLE" | "LOWEST_POSSIBLE" | "EXACT_DEFINITE" | "EXACT_INDETERMINATE",
  locale: RnkCp005LocalizedLocale,
): AnyOption {
  if (/cannot be determined uniquely/i.test(canonicalOption.label)) {
    const fixed = rankSet(state, target).length === 1;
    return {
      ...canonicalOption,
      label: exactIndeterminateLabel(locale),
      explanation: fixed
        ? native(locale, "इस व्यक्ति की रैंक हर वैध क्रम में एक ही है", "ਇਸ ਵਿਅਕਤੀ ਦੀ ਰੈਂਕ ਹਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕੋ ਹੈ")
        : native(locale, "अलग वैध क्रमों में इस व्यक्ति की रैंक बदलती है", "ਵੱਖ-ਵੱਖ ਸਹੀ ਕ੍ਰਮਾਂ ਵਿੱਚ ਇਸ ਵਿਅਕਤੀ ਦੀ ਰੈਂਕ ਬਦਲਦੀ ਹੈ"),
    };
  }
  const value = parseOrdinal(canonicalOption.label);
  if (value === undefined) throw new Error(`CP005 localization cannot parse rank option: ${canonicalOption.label}`);
  const ranks = rankSet(state, target);
  const localizedLabel = ordinal(value, locale);
  let explanation: string;
  if (mode === "HIGHEST_POSSIBLE" || mode === "LOWEST_POSSIBLE") {
    const boundary = mode === "HIGHEST_POSSIBLE" ? ranks[0]! : ranks.at(-1)!;
    explanation = value === boundary
      ? native(locale, "यह सीमा वाली रैंक है और एक वैध क्रम में मिलती है", "ਇਹ ਹੱਦ ਵਾਲੀ ਰੈਂਕ ਹੈ ਅਤੇ ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਮਿਲਦੀ ਹੈ")
      : ranks.includes(value)
        ? native(locale, `यह रैंक संभव है, लेकिन ${mode === "HIGHEST_POSSIBLE" ? "सबसे ऊँची" : "सबसे नीची"} संभव रैंक नहीं है`, `ਇਹ ਰੈਂਕ ਸੰਭਵ ਹੈ, ਪਰ ${mode === "HIGHEST_POSSIBLE" ? "ਸਭ ਤੋਂ ਉੱਚੀ" : "ਸਭ ਤੋਂ ਹੇਠਲੀ"} ਸੰਭਵ ਰੈਂਕ ਨਹੀਂ ਹੈ`)
        : native(locale, "यह रैंक किसी वैध क्रम में नहीं मिलती", "ਇਹ ਰੈਂਕ ਕਿਸੇ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਨਹੀਂ ਮਿਲਦੀ");
  } else {
    const fixed = ranks.length === 1;
    explanation = fixed
      ? value === ranks[0]
        ? native(locale, "हर वैध क्रम में यही रैंक मिलती है", "ਹਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਇਹੀ ਰੈਂਕ ਮਿਲਦੀ ਹੈ")
        : native(locale, "यह रैंक किसी वैध क्रम में नहीं मिलती", "ਇਹ ਰੈਂਕ ਕਿਸੇ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਨਹੀਂ ਮਿਲਦੀ")
      : ranks.includes(value)
        ? native(locale, "यह रैंक मिल सकती है, लेकिन दूसरे वैध क्रम में रैंक बदल जाती है", "ਇਹ ਰੈਂਕ ਮਿਲ ਸਕਦੀ ਹੈ, ਪਰ ਦੂਜੇ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਰੈਂਕ ਬਦਲ ਜਾਂਦੀ ਹੈ")
        : native(locale, "यह रैंक किसी वैध क्रम में नहीं मिलती", "ਇਹ ਰੈਂਕ ਕਿਸੇ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਨਹੀਂ ਮਿਲਦੀ");
  }
  return { ...canonicalOption, label: localizedLabel, explanation };
}

function fingerprint(question: AnyQuestion): string {
  return sha256({
    version: RNK_CP005_LOCALIZATION_REVIEW_V1_VERSION,
    canonicalPermanentRuntimeFingerprint: question.localizationProof.canonicalPermanentRuntimeFingerprint,
    canonicalMathematicalFingerprint: question.localizationProof.canonicalMathematicalFingerprint,
    locale: question.locale,
    instruction: question.instruction,
    clues: question.clues,
    stem: question.stem,
    options: question.options.map((option: AnyOption) => ({ label: option.label, truth: option.truth, explanation: option.explanation })),
    answer: question.answer,
    explanation: question.explanation,
  });
}

export function localizeRnkCp005PermanentQuestionV1(
  canonicalQuestion: RnkCp005PermanentQuestion | AnyQuestion,
  locale: RnkCp005LocalizedLocale,
): RnkCp005LocalizedReviewQuestionV1 {
  const canonical = canonicalQuestion as AnyQuestion;
  const state = buildRnkCp005EditorialV3State(canonical.seed, canonical.v3Topology);
  if (!state) throw new Error(`${canonical.discoveryId}: CP005 localization cannot reconstruct frozen V3 state`);
  if (state.validOrders.length !== canonical.validOrderCount) {
    throw new Error(`${canonical.discoveryId}: CP005 localization valid-order count drift`);
  }

  const permanentOrdinal = canonical.permanentProfile.permanentOrdinalWithinAuthority as number;
  const diversitySeed = canonical.seed ^ (permanentOrdinal * 0x45d9f3b);
  const introVariant = (Math.abs(diversitySeed) % 2) as 0 | 1;
  const queryVariant = (Math.abs(diversitySeed >>> 3) % 2) as 0 | 1;
  const renderedEdges = seededShuffle(state.edges, diversitySeed ^ 0x9e3779b9);
  const variantIds = clueVariants(renderedEdges.length, diversitySeed);
  const clues = renderedEdges.map((edge, index) =>
    contextClue(canonical.context as RnkCp005Context, edge, variantIds[index]!, locale));

  const mode = canonical.candidateRuntimeProfile.mode as string;
  let targetOrPair: string | readonly [string, string] | undefined;
  let options: readonly AnyOption[];
  let explanation: readonly string[];

  if (mode === "MUST" || mode === "COULD" || mode === "CANNOT") {
    options = canonical.options.map((option: AnyOption) => {
      const relation = parseRelationLabel(option.label);
      if (!relation) throw new Error(`CP005 localization relation option did not parse: ${option.label}`);
      return {
        ...option,
        label: relationLabel(relation.first, relation.second, locale),
        explanation: relationOptionExplanation(state, relation.first, relation.second, mode, locale),
      };
    });
    explanation = relationExplanation(canonical, state, locale);
  } else if (mode.startsWith("PAIR_")) {
    const pair = parsePairStem(canonical.stem);
    targetOrPair = [pair.first, pair.second] as const;
    options = canonical.options.map((option: AnyOption) => pairOption(option, state, targetOrPair as readonly [string, string], locale));
    explanation = pairExplanation(canonical, state, targetOrPair, locale);
  } else {
    const target = parseTarget(canonical.stem);
    targetOrPair = target;
    options = canonical.options.map((option: AnyOption) => rankOption(
      option,
      state,
      target,
      mode as "HIGHEST_POSSIBLE" | "LOWEST_POSSIBLE" | "EXACT_DEFINITE" | "EXACT_INDETERMINATE",
      locale,
    ));
    explanation = mode === "HIGHEST_POSSIBLE" || mode === "LOWEST_POSSIBLE"
      ? rankBoundExplanation(canonical, state, target, locale)
      : exactRankExplanation(state, target, locale);
  }

  const instruction = contextIntro(
    canonical.context as RnkCp005Context,
    state.entities.length,
    introVariant,
    locale,
  );
  const stem = localizedQuery(canonical, targetOrPair, queryVariant, locale);
  const answer = options[canonical.correctIndex]!.label.replace(/[।.]$/u, "");

  const localized = {
    ...canonical,
    locale,
    canonicalLocale: "en-IN" as const,
    canonicalNames: state.entities,
    localizedNames: localNames(state.entities, locale),
    instruction,
    clues,
    stem,
    options,
    answer,
    explanation,
    localizationMetadata: {
      version: RNK_CP005_LOCALIZATION_REVIEW_V1_VERSION,
      locale,
      learnerTextLocalized: true,
      structuredPartialOrderRendered: true,
      canonicalOutcomePreserved: true,
      validOrderSetPreserved: true,
      moderateEditorialDiversity: "SEEDED_2_INTRO_3_CLUE_2_QUERY_V1" as const,
      diversity: {
        introVariant,
        queryVariant,
        clueVariantIds: variantIds,
        canonicalClueOrderKeys: state.edges.map(relationKey),
        renderedClueOrderKeys: renderedEdges.map(relationKey),
        clueOrderShuffled: state.edges.map(relationKey).join("|") !== renderedEdges.map(relationKey).join("|"),
        maxConsecutiveSameClueTemplate: maxRun(variantIds),
      },
      humanLanguageReviewRequired: true,
    },
    localizationLifecycle: {
      permanentQlAllocated: true,
      englishFrozen: true,
      hindiPunjabi: "REVIEW_CANDIDATE" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      questionStudio: "DISABLED" as const,
      persistence: "DISABLED" as const,
      questionBank: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      authority: RNK_CP005_LOCALIZATION_REVIEW_V1_AUTHORITY,
      permanentQlId: canonical.permanentProfile.permanentQlId as RnkCp005PermanentQlId,
      canonicalPermanentRuntimeFingerprint: canonical.permanentRuntimeFingerprint,
      canonicalMathematicalFingerprint: canonical.mathematicalFingerprint,
      sourceMode: mode,
      semanticParity: "EXECUTABLE_PROVED" as const,
      validOrderSetSource: "FROZEN_PARTIAL_ORDER_STATE" as const,
      localizationFingerprint: "",
    },
  } as unknown as RnkCp005LocalizedReviewQuestionV1;

  return {
    ...localized,
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint: fingerprint(localized),
    },
  };
}

export function buildRnkCp005LocalizedReviewBankV1(
  locale: RnkCp005LocalizedLocale,
): readonly RnkCp005LocalizedReviewQuestionV1[] {
  return buildRnkCp005PermanentRuntime().map((question) =>
    localizeRnkCp005PermanentQuestionV1(question, locale));
}
