import { createHash } from "node:crypto";

import { RNK_PERSON_POOL_V2, type RnkObjectLocale } from "../foundation/rnk-object-pool-v2";
import type { RnkCp006EditorialContext } from "./cp006-equality-ranking-editorial-v2";
import {
  buildRnkCp006PermanentRuntime,
  type RnkCp006PermanentQuestion,
} from "./cp006-permanent-runtime-v1";

export const RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION =
  "RNK_CP006_HI_PA_LOCALIZATION_REVIEW_V1" as const;
export const RNK_CP006_LOCALIZATION_REVIEW_V1_AUTHORITY =
  "RNK_CP006_STRUCTURED_EQUALITY_LOCALIZATION_V1" as const;

export type RnkCp006LocalizedLocale = "hi-IN" | "pa-IN";
type PairOutcome = "FIRST_HIGHER" | "SECOND_HIGHER" | "EQUAL" | "UNKNOWN";

export type RnkCp006LocalizedReviewQuestionV1 = Omit<
  RnkCp006PermanentQuestion,
  "clues" | "stem" | "options" | "answer" | "explanation" | "lifecycle"
> & {
  readonly locale: RnkCp006LocalizedLocale;
  readonly canonicalLocale: "en-IN";
  readonly clues: readonly string[];
  readonly stem: string;
  readonly options: readonly string[];
  readonly answer: string;
  readonly explanation: readonly string[];
  readonly lifecycle: Omit<RnkCp006PermanentQuestion["lifecycle"], "hindiPunjabi"> & {
    readonly hindiPunjabi: "REVIEW_CANDIDATE";
    readonly humanLanguageReviewRequired: true;
    readonly multilingualFreezeGranted: false;
    readonly productDeliveryUnlocked: false;
  };
  readonly localizationProof: Readonly<{
    authority: typeof RNK_CP006_LOCALIZATION_REVIEW_V1_AUTHORITY;
    version: typeof RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION;
    sourceAuthority: "RNK_CP006_ENGLISH_FREEZE_V1";
    canonicalLocale: "en-IN";
    locale: RnkCp006LocalizedLocale;
    canonicalPermanentRuntimeFingerprint: string;
    canonicalMathematicalStateKey: string;
    localizationFingerprint: string;
    structuredStateReconstruction: true;
    semanticParity: "EXECUTABLE_PROVED";
    humanLanguageReviewRequired: true;
    multilingualFreezeGranted: false;
    productDeliveryUnlocked: false;
  }>;
};

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function objectLocale(locale: RnkCp006LocalizedLocale): Exclude<RnkObjectLocale, "en"> {
  return locale === "hi-IN" ? "hi" : "pa";
}

function localizedName(canonicalName: string, locale: RnkCp006LocalizedLocale): string {
  const person = RNK_PERSON_POOL_V2.find((entry) => entry.names.en === canonicalName);
  if (!person) throw new Error(`RNK CP006 localization: unknown canonical name ${canonicalName}`);
  return person.names[objectLocale(locale)];
}

function localizeOrder(order: string, locale: RnkCp006LocalizedLocale): string {
  let localized = order;
  for (const person of RNK_PERSON_POOL_V2) {
    if (localized.includes(person.names.en)) {
      localized = localized.replaceAll(person.names.en, person.names[objectLocale(locale)]);
    }
  }
  return localized;
}

function canonicalStrictText(
  context: RnkCp006EditorialContext,
  higher: string,
  lower: string,
  variant: number,
): string {
  switch (context) {
    case "HEIGHT":
      return variant % 2 === 0
        ? `${higher} is taller than ${lower}.`
        : `${lower} is shorter than ${higher}.`;
    case "SCORES":
      return variant % 2 === 0
        ? `${higher} scored more marks than ${lower}.`
        : `${lower} scored fewer marks than ${higher}.`;
    case "SPEED":
      return variant % 2 === 0
        ? `${higher} completed the race faster than ${lower}.`
        : `${lower} took longer than ${higher} to complete the race.`;
    case "SENIORITY":
      return variant % 2 === 0
        ? `${higher} is senior to ${lower}.`
        : `${lower} is junior to ${higher}.`;
    case "PERFORMANCE":
      return variant % 2 === 0
        ? `${higher} ranked above ${lower} in the performance review.`
        : `${lower} ranked below ${higher} in the performance review.`;
  }
}

function canonicalEqualityText(
  context: RnkCp006EditorialContext,
  first: string,
  second: string,
): string {
  switch (context) {
    case "HEIGHT": return `${first} and ${second} are equally tall.`;
    case "SCORES": return `${first} and ${second} scored equal marks.`;
    case "SPEED": return `${first} and ${second} completed the race in the same time.`;
    case "SENIORITY": return `${first} and ${second} are at the same seniority level.`;
    case "PERFORMANCE": return `${first} and ${second} were placed at the same level in the performance review.`;
  }
}

function nativeStrictText(
  context: RnkCp006EditorialContext,
  higher: string,
  lower: string,
  variant: number,
  locale: RnkCp006LocalizedLocale,
): string {
  const inverse = variant % 2 === 1;
  if (locale === "hi-IN") {
    switch (context) {
      case "HEIGHT":
        return inverse
          ? `${lower} का कद ${higher} से कम है।`
          : `${higher} का कद ${lower} से अधिक है।`;
      case "SCORES":
        return inverse
          ? `${lower} के अंक ${higher} से कम हैं।`
          : `${higher} के अंक ${lower} से अधिक हैं।`;
      case "SPEED":
        return inverse
          ? `${lower} ने दौड़ ${higher} से अधिक समय में पूरी की।`
          : `${higher} ने दौड़ ${lower} से कम समय में पूरी की।`;
      case "SENIORITY":
        return inverse
          ? `${lower}, ${higher} से कनिष्ठ है।`
          : `${higher}, ${lower} से वरिष्ठ है।`;
      case "PERFORMANCE":
        return inverse
          ? `प्रदर्शन क्रम में ${lower} का स्थान ${higher} से नीचे है।`
          : `प्रदर्शन क्रम में ${higher} का स्थान ${lower} से ऊपर है।`;
    }
  }
  switch (context) {
    case "HEIGHT":
      return inverse
        ? `${lower} ਦਾ ਕੱਦ ${higher} ਨਾਲੋਂ ਘੱਟ ਹੈ।`
        : `${higher} ਦਾ ਕੱਦ ${lower} ਨਾਲੋਂ ਵੱਧ ਹੈ।`;
    case "SCORES":
      return inverse
        ? `${lower} ਦੇ ਅੰਕ ${higher} ਨਾਲੋਂ ਘੱਟ ਹਨ।`
        : `${higher} ਦੇ ਅੰਕ ${lower} ਨਾਲੋਂ ਵੱਧ ਹਨ।`;
    case "SPEED":
      return inverse
        ? `${lower} ਨੇ ਦੌੜ ${higher} ਨਾਲੋਂ ਵੱਧ ਸਮੇਂ ਵਿੱਚ ਪੂਰੀ ਕੀਤੀ।`
        : `${higher} ਨੇ ਦੌੜ ${lower} ਨਾਲੋਂ ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਪੂਰੀ ਕੀਤੀ।`;
    case "SENIORITY":
      return inverse
        ? `${lower}, ${higher} ਨਾਲੋਂ ਜੂਨੀਅਰ ਹੈ।`
        : `${higher}, ${lower} ਨਾਲੋਂ ਸੀਨੀਅਰ ਹੈ।`;
    case "PERFORMANCE":
      return inverse
        ? `ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${lower} ਦਾ ਸਥਾਨ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`
        : `ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`;
  }
}

function nativeEqualityText(
  context: RnkCp006EditorialContext,
  first: string,
  second: string,
  locale: RnkCp006LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    switch (context) {
      case "HEIGHT": return `${first} और ${second} का कद समान है।`;
      case "SCORES": return `${first} और ${second} के अंक समान हैं।`;
      case "SPEED": return `${first} और ${second} ने दौड़ समान समय में पूरी की।`;
      case "SENIORITY": return `${first} और ${second} की वरिष्ठता समान है।`;
      case "PERFORMANCE": return `प्रदर्शन क्रम में ${first} और ${second} एक ही स्तर पर हैं।`;
    }
  }
  switch (context) {
    case "HEIGHT": return `${first} ਅਤੇ ${second} ਦਾ ਕੱਦ ਇੱਕੋ ਜਿਹਾ ਹੈ।`;
    case "SCORES": return `${first} ਅਤੇ ${second} ਦੇ ਅੰਕ ਬਰਾਬਰ ਹਨ।`;
    case "SPEED": return `${first} ਅਤੇ ${second} ਨੇ ਦੌੜ ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਪੂਰੀ ਕੀਤੀ।`;
    case "SENIORITY": return `${first} ਅਤੇ ${second} ਦੀ ਸੀਨੀਅਰਟੀ ਇੱਕੋ ਜਿਹੀ ਹੈ।`;
    case "PERFORMANCE": return `ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${first} ਅਤੇ ${second} ਇੱਕੋ ਪੱਧਰ 'ਤੇ ਹਨ।`;
  }
}

function localizeClue(
  question: RnkCp006PermanentQuestion,
  clue: string,
  locale: RnkCp006LocalizedLocale,
): string {
  const tie = question.state.orderedGroups[question.state.tieGroupIndex]!;
  if (clue === canonicalEqualityText(question.context, tie[0]!, tie[1]!)) {
    return nativeEqualityText(
      question.context,
      localizedName(tie[0]!, locale),
      localizedName(tie[1]!, locale),
      locale,
    );
  }
  for (const edge of question.state.strictEdges) {
    for (const variant of [0, 1] as const) {
      if (clue === canonicalStrictText(question.context, edge.higher, edge.lower, variant)) {
        return nativeStrictText(
          question.context,
          localizedName(edge.higher, locale),
          localizedName(edge.lower, locale),
          variant,
          locale,
        );
      }
    }
  }
  throw new Error(`RNK CP006 localization: unmatched canonical clue: ${clue}`);
}

function pairQueryEntities(question: RnkCp006PermanentQuestion): readonly [string, string] {
  const found = question.state.entities
    .map((name) => ({ name, index: question.stem.indexOf(name) }))
    .filter((entry) => entry.index >= 0)
    .sort((left, right) => left.index - right.index);
  if (found.length !== 2) {
    throw new Error(`RNK CP006 localization: expected 2 query names, found ${found.length}`);
  }
  return [found[0]!.name, found[1]!.name];
}

function canonicalPairLabel(
  context: RnkCp006EditorialContext,
  first: string,
  second: string,
  outcome: PairOutcome,
): string {
  switch (context) {
    case "HEIGHT":
      if (outcome === "FIRST_HIGHER") return `${first} is taller than ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is taller than ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are equally tall`;
      return `Their relative heights cannot be determined`;
    case "SCORES":
      if (outcome === "FIRST_HIGHER") return `${first} scored more marks than ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} scored more marks than ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} scored equal marks`;
      return `Their score relation cannot be determined`;
    case "SPEED":
      if (outcome === "FIRST_HIGHER") return `${first} is faster than ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is faster than ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are equally fast`;
      return `Their relative speeds cannot be determined`;
    case "SENIORITY":
      if (outcome === "FIRST_HIGHER") return `${first} is senior to ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is senior to ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are at the same seniority level`;
      return `Their seniority relation cannot be determined`;
    case "PERFORMANCE":
      if (outcome === "FIRST_HIGHER") return `${first} is ranked above ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is ranked above ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are placed at the same level`;
      return `Their relative positions in the performance review cannot be determined`;
  }
}

function nativePairLabel(
  context: RnkCp006EditorialContext,
  first: string,
  second: string,
  outcome: PairOutcome,
  locale: RnkCp006LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    switch (context) {
      case "HEIGHT":
        if (outcome === "FIRST_HIGHER") return `${first} का कद ${second} से अधिक है`;
        if (outcome === "SECOND_HIGHER") return `${second} का कद ${first} से अधिक है`;
        if (outcome === "EQUAL") return `${first} और ${second} का कद समान है`;
        return `दोनों के कद का संबंध निश्चित नहीं किया जा सकता`;
      case "SCORES":
        if (outcome === "FIRST_HIGHER") return `${first} के अंक ${second} से अधिक हैं`;
        if (outcome === "SECOND_HIGHER") return `${second} के अंक ${first} से अधिक हैं`;
        if (outcome === "EQUAL") return `${first} और ${second} के अंक समान हैं`;
        return `दोनों के अंकों का संबंध निश्चित नहीं किया जा सकता`;
      case "SPEED":
        if (outcome === "FIRST_HIGHER") return `${first} ने दौड़ ${second} से कम समय में पूरी की`;
        if (outcome === "SECOND_HIGHER") return `${second} ने दौड़ ${first} से कम समय में पूरी की`;
        if (outcome === "EQUAL") return `${first} और ${second} ने दौड़ समान समय में पूरी की`;
        return `दोनों की आपसी गति निश्चित नहीं की जा सकती`;
      case "SENIORITY":
        if (outcome === "FIRST_HIGHER") return `${first}, ${second} से वरिष्ठ है`;
        if (outcome === "SECOND_HIGHER") return `${second}, ${first} से वरिष्ठ है`;
        if (outcome === "EQUAL") return `${first} और ${second} की वरिष्ठता समान है`;
        return `दोनों की वरिष्ठता का संबंध निश्चित नहीं किया जा सकता`;
      case "PERFORMANCE":
        if (outcome === "FIRST_HIGHER") return `प्रदर्शन क्रम में ${first} का स्थान ${second} से ऊपर है`;
        if (outcome === "SECOND_HIGHER") return `प्रदर्शन क्रम में ${second} का स्थान ${first} से ऊपर है`;
        if (outcome === "EQUAL") return `प्रदर्शन क्रम में ${first} और ${second} एक ही स्तर पर हैं`;
        return `दोनों का आपसी प्रदर्शन स्थान निश्चित नहीं किया जा सकता`;
    }
  }
  switch (context) {
    case "HEIGHT":
      if (outcome === "FIRST_HIGHER") return `${first} ਦਾ ਕੱਦ ${second} ਨਾਲੋਂ ਵੱਧ ਹੈ`;
      if (outcome === "SECOND_HIGHER") return `${second} ਦਾ ਕੱਦ ${first} ਨਾਲੋਂ ਵੱਧ ਹੈ`;
      if (outcome === "EQUAL") return `${first} ਅਤੇ ${second} ਦਾ ਕੱਦ ਇੱਕੋ ਜਿਹਾ ਹੈ`;
      return `ਦੋਵਾਂ ਦੇ ਕੱਦ ਦਾ ਸੰਬੰਧ ਪੱਕਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ`;
    case "SCORES":
      if (outcome === "FIRST_HIGHER") return `${first} ਦੇ ਅੰਕ ${second} ਨਾਲੋਂ ਵੱਧ ਹਨ`;
      if (outcome === "SECOND_HIGHER") return `${second} ਦੇ ਅੰਕ ${first} ਨਾਲੋਂ ਵੱਧ ਹਨ`;
      if (outcome === "EQUAL") return `${first} ਅਤੇ ${second} ਦੇ ਅੰਕ ਬਰਾਬਰ ਹਨ`;
      return `ਦੋਵਾਂ ਦੇ ਅੰਕਾਂ ਦਾ ਸੰਬੰਧ ਪੱਕਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ`;
    case "SPEED":
      if (outcome === "FIRST_HIGHER") return `${first} ਨੇ ਦੌੜ ${second} ਨਾਲੋਂ ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਪੂਰੀ ਕੀਤੀ`;
      if (outcome === "SECOND_HIGHER") return `${second} ਨੇ ਦੌੜ ${first} ਨਾਲੋਂ ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਪੂਰੀ ਕੀਤੀ`;
      if (outcome === "EQUAL") return `${first} ਅਤੇ ${second} ਨੇ ਦੌੜ ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਪੂਰੀ ਕੀਤੀ`;
      return `ਦੋਵਾਂ ਦੀ ਆਪਸੀ ਰਫ਼ਤਾਰ ਪੱਕੀ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ`;
    case "SENIORITY":
      if (outcome === "FIRST_HIGHER") return `${first}, ${second} ਨਾਲੋਂ ਸੀਨੀਅਰ ਹੈ`;
      if (outcome === "SECOND_HIGHER") return `${second}, ${first} ਨਾਲੋਂ ਸੀਨੀਅਰ ਹੈ`;
      if (outcome === "EQUAL") return `${first} ਅਤੇ ${second} ਦੀ ਸੀਨੀਅਰਟੀ ਇੱਕੋ ਜਿਹੀ ਹੈ`;
      return `ਦੋਵਾਂ ਦੀ ਸੀਨੀਅਰਟੀ ਦਾ ਸੰਬੰਧ ਪੱਕਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ`;
    case "PERFORMANCE":
      if (outcome === "FIRST_HIGHER") return `ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${first} ਦਾ ਸਥਾਨ ${second} ਤੋਂ ਉੱਪਰ ਹੈ`;
      if (outcome === "SECOND_HIGHER") return `ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${second} ਦਾ ਸਥਾਨ ${first} ਤੋਂ ਉੱਪਰ ਹੈ`;
      if (outcome === "EQUAL") return `ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${first} ਅਤੇ ${second} ਇੱਕੋ ਪੱਧਰ 'ਤੇ ਹਨ`;
      return `ਦੋਵਾਂ ਦਾ ਆਪਸੀ ਪ੍ਰਦਰਸ਼ਨ ਸਥਾਨ ਪੱਕਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ`;
  }
}

function nativePairStem(
  context: RnkCp006EditorialContext,
  first: string,
  second: string,
  locale: RnkCp006LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    switch (context) {
      case "HEIGHT": return `${first} और ${second} के कद के बारे में क्या निश्चित किया जा सकता है?`;
      case "SCORES": return `${first} और ${second} के अंकों के बारे में क्या निश्चित किया जा सकता है?`;
      case "SPEED": return `${first} और ${second} की आपसी गति के बारे में क्या निश्चित किया जा सकता है?`;
      case "SENIORITY": return `${first} और ${second} की वरिष्ठता के बारे में क्या निश्चित किया जा सकता है?`;
      case "PERFORMANCE": return `प्रदर्शन क्रम में ${first} और ${second} के आपसी स्थान के बारे में क्या निश्चित किया जा सकता है?`;
    }
  }
  switch (context) {
    case "HEIGHT": return `${first} ਅਤੇ ${second} ਦੇ ਕੱਦ ਬਾਰੇ ਕੀ ਪੱਕਾ ਕਿਹਾ ਜਾ ਸਕਦਾ ਹੈ?`;
    case "SCORES": return `${first} ਅਤੇ ${second} ਦੇ ਅੰਕਾਂ ਬਾਰੇ ਕੀ ਪੱਕਾ ਕਿਹਾ ਜਾ ਸਕਦਾ ਹੈ?`;
    case "SPEED": return `${first} ਅਤੇ ${second} ਦੀ ਆਪਸੀ ਰਫ਼ਤਾਰ ਬਾਰੇ ਕੀ ਪੱਕਾ ਕਿਹਾ ਜਾ ਸਕਦਾ ਹੈ?`;
    case "SENIORITY": return `${first} ਅਤੇ ${second} ਦੀ ਸੀਨੀਅਰਟੀ ਬਾਰੇ ਕੀ ਪੱਕਾ ਕਿਹਾ ਜਾ ਸਕਦਾ ਹੈ?`;
    case "PERFORMANCE": return `ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${first} ਅਤੇ ${second} ਦੇ ਆਪਸੀ ਸਥਾਨ ਬਾਰੇ ਕੀ ਪੱਕਾ ਕਿਹਾ ਜਾ ਸਕਦਾ ਹੈ?`;
  }
}

function endpointStem(
  context: RnkCp006EditorialContext,
  highest: boolean,
  locale: RnkCp006LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    switch (context) {
      case "HEIGHT": return highest ? "सबसे अधिक कद किसका है?" : "सबसे कम कद किसका है?";
      case "SCORES": return highest ? "सबसे अधिक अंक किसके हैं?" : "सबसे कम अंक किसके हैं?";
      case "SPEED": return highest ? "दौड़ सबसे कम समय में किसने पूरी की?" : "दौड़ सबसे अधिक समय में किसने पूरी की?";
      case "SENIORITY": return highest ? "सबसे वरिष्ठ कौन है?" : "सबसे कनिष्ठ कौन है?";
      case "PERFORMANCE": return highest ? "प्रदर्शन क्रम में सबसे ऊपर कौन है?" : "प्रदर्शन क्रम में सबसे नीचे कौन है?";
    }
  }
  switch (context) {
    case "HEIGHT": return highest ? "ਸਭ ਤੋਂ ਵੱਧ ਕੱਦ ਕਿਸਦਾ ਹੈ?" : "ਸਭ ਤੋਂ ਘੱਟ ਕੱਦ ਕਿਸਦਾ ਹੈ?";
    case "SCORES": return highest ? "ਸਭ ਤੋਂ ਵੱਧ ਅੰਕ ਕਿਸਦੇ ਹਨ?" : "ਸਭ ਤੋਂ ਘੱਟ ਅੰਕ ਕਿਸਦੇ ਹਨ?";
    case "SPEED": return highest ? "ਦੌੜ ਸਭ ਤੋਂ ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਕਿਸਨੇ ਪੂਰੀ ਕੀਤੀ?" : "ਦੌੜ ਸਭ ਤੋਂ ਵੱਧ ਸਮੇਂ ਵਿੱਚ ਕਿਸਨੇ ਪੂਰੀ ਕੀਤੀ?";
    case "SENIORITY": return highest ? "ਸਭ ਤੋਂ ਸੀਨੀਅਰ ਕੌਣ ਹੈ?" : "ਸਭ ਤੋਂ ਜੂਨੀਅਰ ਕੌਣ ਹੈ?";
    case "PERFORMANCE": return highest ? "ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ਸਭ ਤੋਂ ਉੱਪਰ ਕੌਣ ਹੈ?" : "ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ਸਭ ਤੋਂ ਹੇਠਾਂ ਕੌਣ ਹੈ?";
  }
}

function completeStem(
  context: RnkCp006EditorialContext,
  locale: RnkCp006LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    switch (context) {
      case "HEIGHT": return `कौन-सा विकल्प अधिक से कम कद का सही क्रम दिखाता है? विकल्पों में "=" समान कद दर्शाता है।`;
      case "SCORES": return `कौन-सा विकल्प अधिक से कम अंकों का सही क्रम दिखाता है? विकल्पों में "=" समान अंक दर्शाता है।`;
      case "SPEED": return `कौन-सा विकल्प सबसे तेज से सबसे धीमे का सही क्रम दिखाता है? विकल्पों में "=" समान गति दर्शाता है।`;
      case "SENIORITY": return `कौन-सा विकल्प सबसे वरिष्ठ से सबसे कनिष्ठ का सही क्रम दिखाता है? विकल्पों में "=" समान वरिष्ठता दर्शाता है।`;
      case "PERFORMANCE": return `कौन-सा विकल्प प्रदर्शन का ऊपर से नीचे सही क्रम दिखाता है? विकल्पों में "=" समान स्तर दर्शाता है।`;
    }
  }
  switch (context) {
    case "HEIGHT": return `ਕਿਹੜਾ ਵਿਕਲਪ ਵੱਧ ਤੋਂ ਘੱਟ ਕੱਦ ਦਾ ਸਹੀ ਕ੍ਰਮ ਦਿਖਾਉਂਦਾ ਹੈ? ਵਿਕਲਪਾਂ ਵਿੱਚ "=" ਇੱਕੋ ਕੱਦ ਦਿਖਾਉਂਦਾ ਹੈ।`;
    case "SCORES": return `ਕਿਹੜਾ ਵਿਕਲਪ ਵੱਧ ਤੋਂ ਘੱਟ ਅੰਕਾਂ ਦਾ ਸਹੀ ਕ੍ਰਮ ਦਿਖਾਉਂਦਾ ਹੈ? ਵਿਕਲਪਾਂ ਵਿੱਚ "=" ਬਰਾਬਰ ਅੰਕ ਦਿਖਾਉਂਦਾ ਹੈ।`;
    case "SPEED": return `ਕਿਹੜਾ ਵਿਕਲਪ ਸਭ ਤੋਂ ਤੇਜ਼ ਤੋਂ ਸਭ ਤੋਂ ਹੌਲੇ ਦਾ ਸਹੀ ਕ੍ਰਮ ਦਿਖਾਉਂਦਾ ਹੈ? ਵਿਕਲਪਾਂ ਵਿੱਚ "=" ਇੱਕੋ ਰਫ਼ਤਾਰ ਦਿਖਾਉਂਦਾ ਹੈ।`;
    case "SENIORITY": return `ਕਿਹੜਾ ਵਿਕਲਪ ਸਭ ਤੋਂ ਸੀਨੀਅਰ ਤੋਂ ਸਭ ਤੋਂ ਜੂਨੀਅਰ ਦਾ ਸਹੀ ਕ੍ਰਮ ਦਿਖਾਉਂਦਾ ਹੈ? ਵਿਕਲਪਾਂ ਵਿੱਚ "=" ਇੱਕੋ ਸੀਨੀਅਰਟੀ ਦਿਖਾਉਂਦਾ ਹੈ।`;
    case "PERFORMANCE": return `ਕਿਹੜਾ ਵਿਕਲਪ ਪ੍ਰਦਰਸ਼ਨ ਦਾ ਉੱਪਰੋਂ ਹੇਠਾਂ ਸਹੀ ਕ੍ਰਮ ਦਿਖਾਉਂਦਾ ਹੈ? ਵਿਕਲਪਾਂ ਵਿੱਚ "=" ਇੱਕੋ ਪੱਧਰ ਦਿਖਾਉਂਦਾ ਹੈ।`;
  }
}

function localizedPairOptions(
  question: RnkCp006PermanentQuestion,
  locale: RnkCp006LocalizedLocale,
): readonly string[] {
  const [firstCanonical, secondCanonical] = pairQueryEntities(question);
  const first = localizedName(firstCanonical, locale);
  const second = localizedName(secondCanonical, locale);
  const outcomes: readonly PairOutcome[] = ["FIRST_HIGHER", "SECOND_HIGHER", "EQUAL", "UNKNOWN"];
  return question.options.map((canonicalOption) => {
    const outcome = outcomes.find(
      (candidate) => canonicalOption === canonicalPairLabel(question.context, firstCanonical, secondCanonical, candidate),
    );
    if (!outcome) throw new Error(`RNK CP006 localization: unmatched pair option ${canonicalOption}`);
    return nativePairLabel(question.context, first, second, outcome, locale);
  });
}

function localizedStem(
  question: RnkCp006PermanentQuestion,
  locale: RnkCp006LocalizedLocale,
): string {
  if (question.mode === "PAIR_LOCAL_BRIDGE" || question.mode === "PAIR_FULL_CHAIN") {
    const [first, second] = pairQueryEntities(question);
    return nativePairStem(
      question.context,
      localizedName(first, locale),
      localizedName(second, locale),
      locale,
    );
  }
  if (question.mode === "ENDPOINT_HIGHEST" || question.mode === "ENDPOINT_LOWEST") {
    return endpointStem(question.context, question.mode === "ENDPOINT_HIGHEST", locale);
  }
  return completeStem(question.context, locale);
}

function localizedOptions(
  question: RnkCp006PermanentQuestion,
  locale: RnkCp006LocalizedLocale,
): readonly string[] {
  if (question.mode === "PAIR_LOCAL_BRIDGE" || question.mode === "PAIR_FULL_CHAIN") {
    return localizedPairOptions(question, locale);
  }
  if (question.mode === "ENDPOINT_HIGHEST" || question.mode === "ENDPOINT_LOWEST") {
    return question.options.map((option) => localizedName(option, locale));
  }
  return question.options.map((option) => localizeOrder(option, locale));
}

function localizedBridgeLine(
  question: RnkCp006PermanentQuestion,
  locale: RnkCp006LocalizedLocale,
): string {
  const bridge = question.state.equalityBridge;
  const order = [
    localizedName(bridge.aboveEntity, locale),
    ">",
    localizedName(bridge.entryTieMember, locale),
    "=",
    localizedName(bridge.exitTieMember, locale),
    ">",
    localizedName(bridge.belowEntity, locale),
  ].join(" ");
  return locale === "hi-IN"
    ? `बराबरी वाली जोड़ी को एक ही स्तर मानकर कड़ी जोड़ें: ${order}।`
    : `ਬਰਾਬਰੀ ਵਾਲੀ ਜੋੜੀ ਨੂੰ ਇੱਕੋ ਪੱਧਰ ਮੰਨ ਕੇ ਕੜੀ ਜੋੜੋ: ${order}।`;
}

function endpointConclusion(
  question: RnkCp006PermanentQuestion,
  answer: string,
  locale: RnkCp006LocalizedLocale,
): string {
  const highest = question.mode === "ENDPOINT_HIGHEST";
  if (locale === "hi-IN") {
    switch (question.context) {
      case "HEIGHT": return `इसलिए ${answer} का कद ${highest ? "सबसे अधिक" : "सबसे कम"} है।`;
      case "SCORES": return `इसलिए ${answer} के अंक ${highest ? "सबसे अधिक" : "सबसे कम"} हैं।`;
      case "SPEED": return `इसलिए ${answer} ने दौड़ ${highest ? "सबसे कम" : "सबसे अधिक"} समय में पूरी की।`;
      case "SENIORITY": return `इसलिए ${answer} सबसे ${highest ? "वरिष्ठ" : "कनिष्ठ"} है।`;
      case "PERFORMANCE": return `इसलिए प्रदर्शन क्रम में ${answer} सबसे ${highest ? "ऊपर" : "नीचे"} है।`;
    }
  }
  switch (question.context) {
    case "HEIGHT": return `ਇਸ ਲਈ ${answer} ਦਾ ਕੱਦ ${highest ? "ਸਭ ਤੋਂ ਵੱਧ" : "ਸਭ ਤੋਂ ਘੱਟ"} ਹੈ।`;
    case "SCORES": return `ਇਸ ਲਈ ${answer} ਦੇ ਅੰਕ ${highest ? "ਸਭ ਤੋਂ ਵੱਧ" : "ਸਭ ਤੋਂ ਘੱਟ"} ਹਨ।`;
    case "SPEED": return `ਇਸ ਲਈ ${answer} ਨੇ ਦੌੜ ${highest ? "ਸਭ ਤੋਂ ਘੱਟ" : "ਸਭ ਤੋਂ ਵੱਧ"} ਸਮੇਂ ਵਿੱਚ ਪੂਰੀ ਕੀਤੀ।`;
    case "SENIORITY": return `ਇਸ ਲਈ ${answer} ਸਭ ਤੋਂ ${highest ? "ਸੀਨੀਅਰ" : "ਜੂਨੀਅਰ"} ਹੈ।`;
    case "PERFORMANCE": return `ਇਸ ਲਈ ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${answer} ਸਭ ਤੋਂ ${highest ? "ਉੱਪਰ" : "ਹੇਠਾਂ"} ਹੈ।`;
  }
}

function localizedExplanation(
  question: RnkCp006PermanentQuestion,
  answer: string,
  locale: RnkCp006LocalizedLocale,
): readonly string[] {
  const fullOrder = localizeOrder(
    question.state.orderedGroups.map((group) => group.join(" = ")).join(" > "),
    locale,
  );
  const bridge = localizedBridgeLine(question, locale);
  if (question.mode === "PAIR_LOCAL_BRIDGE") {
    return locale === "hi-IN"
      ? [bridge, `इस कड़ी से पूछा गया संबंध सीधे तय हो जाता है। सही उत्तर: ${answer}।`]
      : [bridge, `ਇਸ ਕੜੀ ਨਾਲ ਪੁੱਛਿਆ ਸੰਬੰਧ ਸਿੱਧਾ ਤੈਅ ਹੋ ਜਾਂਦਾ ਹੈ। ਸਹੀ ਉੱਤਰ: ${answer}।`];
  }
  if (question.mode === "PAIR_FULL_CHAIN") {
    return locale === "hi-IN"
      ? [bridge, `बाकी तुलनाएँ जोड़ने पर पूरा क्रम ${fullOrder} मिलता है।`, `अतः सही उत्तर: ${answer}।`]
      : [bridge, `ਬਾਕੀ ਤੁਲਨਾਵਾਂ ਜੋੜਨ 'ਤੇ ਪੂਰਾ ਕ੍ਰਮ ${fullOrder} ਮਿਲਦਾ ਹੈ।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ: ${answer}।`];
  }
  if (question.mode === "ENDPOINT_HIGHEST" || question.mode === "ENDPOINT_LOWEST") {
    return locale === "hi-IN"
      ? [bridge, `सभी तुलनाएँ जोड़ने पर क्रम ${fullOrder} मिलता है।`, endpointConclusion(question, answer, locale)]
      : [bridge, `ਸਾਰੀਆਂ ਤੁਲਨਾਵਾਂ ਜੋੜਨ 'ਤੇ ਕ੍ਰਮ ${fullOrder} ਮਿਲਦਾ ਹੈ।`, endpointConclusion(question, answer, locale)];
  }
  const tie = question.state.orderedGroups[question.state.tieGroupIndex]!;
  const first = localizedName(tie[0]!, locale);
  const second = localizedName(tie[1]!, locale);
  const optionNumber = question.correctIndex + 1;
  return locale === "hi-IN"
    ? [
        `${first} और ${second} को बराबरी के कारण एक ही स्तर पर रखना जरूरी है।`,
        `सभी तुलनाएँ जोड़ने पर सही क्रम ${fullOrder} है।`,
        `इसलिए सही विकल्प ${optionNumber} है।`,
      ]
    : [
        `${first} ਅਤੇ ${second} ਨੂੰ ਬਰਾਬਰੀ ਕਰਕੇ ਇੱਕੋ ਪੱਧਰ 'ਤੇ ਰੱਖਣਾ ਜ਼ਰੂਰੀ ਹੈ।`,
        `ਸਾਰੀਆਂ ਤੁਲਨਾਵਾਂ ਜੋੜਨ 'ਤੇ ਸਹੀ ਕ੍ਰਮ ${fullOrder} ਹੈ।`,
        `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ${optionNumber} ਹੈ।`,
      ];
}

export function localizeRnkCp006PermanentQuestionV1(
  question: RnkCp006PermanentQuestion,
  locale: RnkCp006LocalizedLocale,
): RnkCp006LocalizedReviewQuestionV1 {
  const clues = question.clues.map((clue) => localizeClue(question, clue, locale));
  const stem = localizedStem(question, locale);
  const options = localizedOptions(question, locale);
  const answer = options[question.correctIndex]!;
  const explanation = localizedExplanation(question, answer, locale);
  const localizationFingerprint = sha256({
    version: RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION,
    permanentRuntimeFingerprint: question.permanentRuntimeFingerprint,
    locale,
    clues,
    stem,
    options,
    correctIndex: question.correctIndex,
    answer,
    explanation,
  });

  return {
    ...question,
    locale,
    canonicalLocale: "en-IN",
    clues,
    stem,
    options,
    answer,
    explanation,
    lifecycle: {
      ...question.lifecycle,
      hindiPunjabi: "REVIEW_CANDIDATE",
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      authority: RNK_CP006_LOCALIZATION_REVIEW_V1_AUTHORITY,
      version: RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION,
      sourceAuthority: "RNK_CP006_ENGLISH_FREEZE_V1",
      canonicalLocale: "en-IN",
      locale,
      canonicalPermanentRuntimeFingerprint: question.permanentRuntimeFingerprint,
      canonicalMathematicalStateKey: question.state.mathematicalStateKey,
      localizationFingerprint,
      structuredStateReconstruction: true,
      semanticParity: "EXECUTABLE_PROVED",
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      productDeliveryUnlocked: false,
    },
  };
}

export function buildRnkCp006LocalizedReviewBankV1(
  locale: RnkCp006LocalizedLocale,
): readonly RnkCp006LocalizedReviewQuestionV1[] {
  return buildRnkCp006PermanentRuntime().map((question) =>
    localizeRnkCp006PermanentQuestionV1(question, locale),
  );
}

export function buildRnkCp006MultilingualReviewCandidateV1(): Readonly<{
  hindi: readonly RnkCp006LocalizedReviewQuestionV1[];
  punjabi: readonly RnkCp006LocalizedReviewQuestionV1[];
}> {
  return {
    hindi: buildRnkCp006LocalizedReviewBankV1("hi-IN"),
    punjabi: buildRnkCp006LocalizedReviewBankV1("pa-IN"),
  };
}
