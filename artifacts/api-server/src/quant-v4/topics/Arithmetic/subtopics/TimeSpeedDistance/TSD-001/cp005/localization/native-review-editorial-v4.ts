import { TSD_CP005_NATIVE_EDITORIAL_REVIEW_V3, type TsdCp005NativeReviewRowV1 } from "./native-review-editorial-v3";

export const TSD_CP005_NATIVE_EDITORIAL_V4_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V4" as const;

function polishTimeLimit(row: TsdCp005NativeReviewRowV1): TsdCp005NativeReviewRowV1 {
  let stem = row.presentation.stem;
  if (row.presentation.language === "hi") {
    stem = stem.replace(/समय सीमा (\d+(?:\.\d+)? घंटे(?: \d+ मिनट)?) है/u, "समय सीमा $1 की है");
  } else {
    stem = stem.replace(/ਸਮਾਂ ਸੀਮਾ (\d+(?:\.\d+)? ਘੰਟੇ(?: \d+ ਮਿੰਟ)?) ਹੈ/u, "ਸਮਾਂ ਸੀਮਾ $1 ਦੀ ਹੈ");
  }
  return stem === row.presentation.stem ? row : Object.freeze({
    ...row,
    presentation: Object.freeze({ ...row.presentation, stem }),
  });
}

export function generateCp005NativeEditorialReviewV4(): readonly TsdCp005NativeReviewRowV1[] {
  return Object.freeze(TSD_CP005_NATIVE_EDITORIAL_REVIEW_V3.map(polishTimeLimit));
}

export const TSD_CP005_NATIVE_EDITORIAL_REVIEW_V4 = generateCp005NativeEditorialReviewV4();
