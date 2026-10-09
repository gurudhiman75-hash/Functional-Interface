import { TSD_CP005_NATIVE_EDITORIAL_REVIEW_V4 } from "./native-review-editorial-v4";
import type { TsdCp005NativeReviewRowV1 } from "./native-review-candidate-v1";

export const TSD_CP005_NATIVE_EDITORIAL_V5_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V5" as const;

const FEMININE_VEHICLE_FAMILIES = new Set([
  "INTERCITY_BUS", "TAXI", "CAR", "DELIVERY_VAN", "COURIER_VAN", "PASSENGER_TRAIN", "EXPRESS_TRAIN",
  "MINIBUS", "JEEP", "POSTAL_VAN", "COMPANY_CAR", "TRANSPORT_VAN", "SHUTTLE_BUS", "PATROL_CAR",
  "SERVICE_VAN", "INSPECTION_JEEP", "TEST_CAR", "MAINTENANCE_VAN", "SHUTTLE_VAN", "MOTORCYCLE", "SERVICE_CAR",
]);

function polishVehicleAgreement(row: TsdCp005NativeReviewRowV1): TsdCp005NativeReviewRowV1 {
  if (!FEMININE_VEHICLE_FAMILIES.has(row.source.objectFamily)) return row;

  let stem = row.presentation.stem;
  if (row.presentation.language === "hi") {
    stem = stem
      .replace(/लौटते रहते हैं/gu, "लौटती रहती हैं")
      .replace(/लौटते रहती हैं/gu, "लौटती रहती हैं")
      .replace(/लौटते हैं/gu, "लौटती हैं")
      .replace(/दिशा बदलता है/gu, "दिशा बदलती है")
      .replace(/मिलेंगे/gu, "मिलेंगी")
      .replace(/तय करेगा/gu, "तय करेगी")
      .replace(/समय-अंतर (\d+(?:\.\d+)? घंटे(?: \d+ मिनट)?) है/gu, "समय-अंतर $1 का है")
      .replace(/P और Q से साथ शुरू करते हुए उनकी गतियाँ/gu, "P और Q से एक साथ चलने पर उनकी गतियाँ");
  } else {
    stem = stem
      .replace(/ਮੁੜਦੇ ਰਹਿੰਦੇ ਹਨ/gu, "ਮੁੜਦੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ")
      .replace(/ਮੁੜਦੇ ਰਹਿੰਦੀਆਂ ਹਨ/gu, "ਮੁੜਦੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ")
      .replace(/ਮੁੜਦੇ ਹਨ/gu, "ਮੁੜਦੀਆਂ ਹਨ")
      .replace(/ਦਿਸ਼ਾ ਬਦਲਦੇ ਹਨ/gu, "ਦਿਸ਼ਾ ਬਦਲਦੀਆਂ ਹਨ")
      .replace(/ਦਿਸ਼ਾ ਬਦਲਦਾ ਹੈ/gu, "ਦਿਸ਼ਾ ਬਦਲਦੀ ਹੈ")
      .replace(/ਮਿਲਣਗੇ/gu, "ਮਿਲਣਗੀਆਂ")
      .replace(/ਤੈਅ ਕਰੇਗਾ/gu, "ਤੈਅ ਕਰੇਗੀ")
      .replace(/ਸਮਾਂ-ਅੰਤਰ (\d+(?:\.\d+)? ਘੰਟੇ(?: \d+ ਮਿੰਟ)?) ਹੈ/gu, "ਸਮਾਂ-ਅੰਤਰ $1 ਦਾ ਹੈ")
      .replace(/P ਅਤੇ Q ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹੋਏ ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ/gu, "P ਅਤੇ Q ਤੋਂ ਇਕੱਠੇ ਚੱਲਣ ਵੇਲੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ");
  }

  return stem === row.presentation.stem ? row : Object.freeze({
    ...row,
    presentation: Object.freeze({ ...row.presentation, stem }),
  });
}

export function generateCp005NativeEditorialReviewV5(): readonly TsdCp005NativeReviewRowV1[] {
  return Object.freeze(TSD_CP005_NATIVE_EDITORIAL_REVIEW_V4.map(polishVehicleAgreement));
}

export const TSD_CP005_NATIVE_EDITORIAL_REVIEW_V5 = generateCp005NativeEditorialReviewV5();
