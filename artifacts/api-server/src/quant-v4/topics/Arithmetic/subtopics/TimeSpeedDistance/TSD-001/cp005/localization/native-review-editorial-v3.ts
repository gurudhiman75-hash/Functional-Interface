import { TSD_CP005_NATIVE_EDITORIAL_REVIEW_V2, type TsdCp005NativeReviewRowV1 } from "./native-review-editorial-v2";
import { cp005NativeActor, cp005Speed } from "./native-primitives-v1";

export const TSD_CP005_NATIVE_EDITORIAL_V3_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V3" as const;

const FEMININE_OBJECTS = new Set([
  "INTERCITY_BUS", "TAXI", "CAR", "DELIVERY_VAN", "COURIER_VAN", "PASSENGER_TRAIN", "EXPRESS_TRAIN",
  "MINIBUS", "JEEP", "POSTAL_VAN", "COMPANY_CAR", "TRANSPORT_VAN", "SHUTTLE_BUS", "PATROL_CAR",
  "SERVICE_VAN", "INSPECTION_JEEP", "TEST_CAR", "MAINTENANCE_VAN", "SHUTTLE_VAN", "MOTORCYCLE", "SERVICE_CAR",
]);

function polishSpeedPhrasing(row: TsdCp005NativeReviewRowV1, stem: string): string {
  const lang = row.presentation.language;
  const a = cp005NativeActor(row.source.objectFamily, "A", lang);
  const b = cp005NativeActor(row.source.objectFamily, "B", lang);
  const sa = row.source.input.speedA ? cp005Speed(row.source.input.speedA) : "";
  const sb = row.source.input.speedB ? cp005Speed(row.source.input.speedB) : "";
  if (!sa || !sb) return stem;

  if (lang === "hi") {
    return stem
      .replace(`${a} P से ${sa} और ${b} Q से ${sb} पर`, `${a} P से ${sa} की गति से और ${b} Q से ${sb} की गति से`)
      .replace(`${a} और ${b} विपरीत सिरों से ${sa} तथा ${sb} पर`, `${a} और ${b} विपरीत सिरों से क्रमशः ${sa} और ${sb} की गति से`)
      .replace(`दोनों विपरीत सिरों से ${sa} और ${sb} पर`, `दोनों विपरीत सिरों से क्रमशः ${sa} और ${sb} की गति से`)
      .replace(`${a} ${sa} और ${b} ${sb} पर`, `${a} की गति ${sa} और ${b} की गति ${sb} है;`)
      .replace(`${a} P से ${sa} और ${b} ${sb} पर`, `${a} की गति ${sa} और ${b} की गति ${sb} है; दोनों P से`)
      .replace(/(\d+(?:\.\d+)? km\/h) पर/g, "$1 की गति से");
  }

  return stem
    .replace(`${a} P ਤੋਂ ${sa} ਅਤੇ ${b} Q ਤੋਂ ${sb} ਨਾਲ`, `${a} P ਤੋਂ ${sa} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਅਤੇ ${b} Q ਤੋਂ ${sb} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ`)
    .replace(`${a} ਅਤੇ ${b} ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ${sa} ਅਤੇ ${sb} ਨਾਲ`, `${a} ਅਤੇ ${b} ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਕ੍ਰਮਵਾਰ ${sa} ਅਤੇ ${sb} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ`)
    .replace(`ਦੋਵੇਂ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ${sa} ਅਤੇ ${sb} ਨਾਲ`, `ਦੋਵੇਂ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਕ੍ਰਮਵਾਰ ${sa} ਅਤੇ ${sb} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ`)
    .replace(`${a} ${sa} ਅਤੇ ${b} ${sb} ਨਾਲ`, `${a} ਦੀ ਰਫ਼ਤਾਰ ${sa} ਅਤੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${sb} ਹੈ;`)
    .replace(/(\d+(?:\.\d+)? km\/h) ਨਾਲ/g, "$1 ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ");
}

function agreementHindi(sentence: string, row: TsdCp005NativeReviewRowV1): string {
  const a = cp005NativeActor(row.source.objectFamily, "A", "hi");
  const b = cp005NativeActor(row.source.objectFamily, "B", "hi");
  const feminine = FEMININE_OBJECTS.has(row.source.objectFamily);
  const pairSubject = (sentence.includes(a) && sentence.includes(b)) || sentence.includes("दोनों");
  const actorSubject = sentence.includes(a) || sentence.includes(b) || pairSubject;
  if (!actorSubject) return sentence;

  if (pairSubject) {
    const pairs: readonly [string, string][] = feminine ? [
      ["आते-जाते हैं", "आती-जाती हैं"], ["चलते हैं", "चलती हैं"], ["मिलते हैं", "मिलती हैं"],
      ["निकलते हैं", "निकलती हैं"], ["लौटते हैं", "लौटती हैं"], ["मुड़ते हैं", "मुड़ती हैं"],
      ["बदलते हैं", "बदलती हैं"], ["करते हैं", "करती हैं"], ["रहते हैं", "रहती हैं"],
      ["पहुँचते हैं", "पहुँचती हैं"], ["चलने वाले", "चलने वाली"],
      ["चलता है", "चलती हैं"], ["पहुँचता है", "पहुँचती हैं"], ["करता है", "करती हैं"],
      ["लौटता है", "लौटती हैं"], ["मुड़ता है", "मुड़ती हैं"], ["रुकता है", "रुकती हैं"], ["मिलेगा", "मिलेंगी"],
    ] : [
      ["चलता है", "चलते हैं"], ["पहुँचता है", "पहुँचते हैं"], ["करता है", "करते हैं"],
      ["लौटता है", "लौटते हैं"], ["मुड़ता है", "मुड़ते हैं"], ["रुकता है", "रुकते हैं"], ["मिलेगा", "मिलेंगे"],
    ];
    return pairs.reduce((out, [from, to]) => out.replaceAll(from, to), sentence);
  }

  if (!feminine) return sentence;
  const singular: readonly [string, string][] = [
    ["चलता है", "चलती है"], ["पहुँचता है", "पहुँचती है"], ["करता है", "करती है"],
    ["लौटता है", "लौटती है"], ["मुड़ता है", "मुड़ती है"], ["रुकता है", "रुकती है"],
    ["आता है", "आती है"], ["मिलेगा", "मिलेगी"], ["चलेगा", "चलेगी"], ["रुका?", "रुकी?"],
  ];
  return singular.reduce((out, [from, to]) => out.replaceAll(from, to), sentence);
}

function agreementPunjabi(sentence: string, row: TsdCp005NativeReviewRowV1): string {
  const a = cp005NativeActor(row.source.objectFamily, "A", "pa");
  const b = cp005NativeActor(row.source.objectFamily, "B", "pa");
  const feminine = FEMININE_OBJECTS.has(row.source.objectFamily);
  const pairSubject = (sentence.includes(a) && sentence.includes(b)) || sentence.includes("ਦੋਵੇਂ") || sentence.includes("ਦੋਵਾਂ");
  const actorSubject = sentence.includes(a) || sentence.includes(b) || pairSubject;
  if (!actorSubject) return sentence;

  if (pairSubject) {
    const pairs: readonly [string, string][] = feminine ? [
      ["ਆਉਂਦੇ-ਜਾਂਦੇ ਹਨ", "ਆਉਂਦੀਆਂ-ਜਾਂਦੀਆਂ ਹਨ"], ["ਚਲਦੇ ਹਨ", "ਚਲਦੀਆਂ ਹਨ"], ["ਮਿਲਦੇ ਹਨ", "ਮਿਲਦੀਆਂ ਹਨ"],
      ["ਨਿਕਲਦੇ ਹਨ", "ਨਿਕਲਦੀਆਂ ਹਨ"], ["ਮੁੜਦੇ ਹਨ", "ਮੁੜਦੀਆਂ ਹਨ"], ["ਕਰਦੇ ਹਨ", "ਕਰਦੀਆਂ ਹਨ"],
      ["ਰਹਿੰਦੇ ਹਨ", "ਰਹਿੰਦੀਆਂ ਹਨ"], ["ਪਹੁੰਚਦੇ ਹਨ", "ਪਹੁੰਚਦੀਆਂ ਹਨ"], ["ਚੱਲਣ ਵਾਲੇ", "ਚੱਲਣ ਵਾਲੀਆਂ"],
      ["ਚਲਦਾ ਹੈ", "ਚਲਦੀਆਂ ਹਨ"], ["ਪਹੁੰਚਦਾ ਹੈ", "ਪਹੁੰਚਦੀਆਂ ਹਨ"], ["ਕਰਦਾ ਹੈ", "ਕਰਦੀਆਂ ਹਨ"],
      ["ਮੁੜਦਾ ਹੈ", "ਮੁੜਦੀਆਂ ਹਨ"], ["ਰੁਕਦਾ ਹੈ", "ਰੁਕਦੀਆਂ ਹਨ"], ["ਮਿਲੇਗਾ", "ਮਿਲਣਗੀਆਂ"],
    ] : [
      ["ਚਲਦਾ ਹੈ", "ਚਲਦੇ ਹਨ"], ["ਪਹੁੰਚਦਾ ਹੈ", "ਪਹੁੰਚਦੇ ਹਨ"], ["ਕਰਦਾ ਹੈ", "ਕਰਦੇ ਹਨ"],
      ["ਮੁੜਦਾ ਹੈ", "ਮੁੜਦੇ ਹਨ"], ["ਰੁਕਦਾ ਹੈ", "ਰੁਕਦੇ ਹਨ"], ["ਮਿਲੇਗਾ", "ਮਿਲਣਗੇ"],
    ];
    return pairs.reduce((out, [from, to]) => out.replaceAll(from, to), sentence);
  }

  if (!feminine) return sentence;
  const singular: readonly [string, string][] = [
    ["ਚਲਦਾ ਹੈ", "ਚਲਦੀ ਹੈ"], ["ਪਹੁੰਚਦਾ ਹੈ", "ਪਹੁੰਚਦੀ ਹੈ"], ["ਕਰਦਾ ਹੈ", "ਕਰਦੀ ਹੈ"],
    ["ਮੁੜਦਾ ਹੈ", "ਮੁੜਦੀ ਹੈ"], ["ਰੁਕਦਾ ਹੈ", "ਰੁਕਦੀ ਹੈ"], ["ਆਉਂਦਾ ਹੈ", "ਆਉਂਦੀ ਹੈ"],
    ["ਮਿਲੇਗਾ", "ਮਿਲੇਗੀ"], ["ਰੁਕਿਆ?", "ਰੁਕੀ?"],
  ];
  return singular.reduce((out, [from, to]) => out.replaceAll(from, to), sentence);
}

function polishAgreement(row: TsdCp005NativeReviewRowV1, stem: string): string {
  const parts = stem.split("।");
  const polished = parts.map((part) => row.presentation.language === "hi" ? agreementHindi(part, row) : agreementPunjabi(part, row));
  return polished.join("।").replace(/\s{2,}/g, " ").trim();
}

function polishRow(row: TsdCp005NativeReviewRowV1): TsdCp005NativeReviewRowV1 {
  let stem = polishSpeedPhrasing(row, row.presentation.stem);
  stem = polishAgreement(row, stem);
  return stem === row.presentation.stem ? row : Object.freeze({
    ...row,
    presentation: Object.freeze({ ...row.presentation, stem }),
  });
}

export function generateCp005NativeEditorialReviewV3(): readonly TsdCp005NativeReviewRowV1[] {
  return Object.freeze(TSD_CP005_NATIVE_EDITORIAL_REVIEW_V2.map(polishRow));
}

export const TSD_CP005_NATIVE_EDITORIAL_REVIEW_V3 = generateCp005NativeEditorialReviewV3();
