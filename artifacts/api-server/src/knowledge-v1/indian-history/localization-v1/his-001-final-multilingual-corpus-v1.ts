import { generateHisCp001LocalizedReviewV1 } from "./his-cp001-localization-v1";
import { generateHisCp002LocalizedReviewV1 } from "./his-cp002-localization-v1";
import { generateHisCp003LocalizedReviewV1 } from "./his-cp003-localization-v1";
import { generateHisCp004LocalizedReviewV1 } from "./his-cp004-localization-v1";
import { generateHisCp005LocalizedReviewV1 } from "./his-cp005-localization-v1";
import { generateHisCp006LocalizedReviewV1 } from "./his-cp006-localization-v1";
import { generateHisCp007LocalizedReviewV1 } from "./his-cp007-localization-v1";
import { generateHisCp008LocalizedReviewV1 } from "./his-cp008-localization-v1";
import { generateHisCp009LocalizedReviewV1 } from "./his-cp009-localization-v1";
import { generateHisCp010LocalizedReviewV1 } from "./his-cp010-localization-v1";
import { generateHisCp011LocalizedReviewV1 } from "./his-cp011-localization-v1";
import { generateHisCp012LocalizedReviewV1 } from "./his-cp012-localization-v1";
import { generateHisCp013LocalizedReviewV1 } from "./his-cp013-localization-v1";
import { generateHisCp014LocalizedReviewV1 } from "./his-cp014-localization-v1";
import { generateHisCp015LocalizedReviewV1 } from "./his-cp015-localization-v1";
import { generateHisCp016LocalizedReviewV1 } from "./his-cp016-localization-v1";
import { generateHisCp017LocalizedReviewV1 } from "./his-cp017-localization-v1";
import { generateHisCp018LocalizedReviewV1 } from "./his-cp018-localization-v1";
import { generateHisCp019LocalizedReviewV1 } from "./his-cp019-localization-v1";
import { generateHisCp020LocalizedReviewV1 } from "./his-cp020-localization-v1";
import { generateHisCp021LocalizedReviewV1 } from "./his-cp021-localization-v1";
import { generateHisCp022LocalizedReviewV1 } from "./his-cp022-localization-v1";
import { generateHisCp023LocalizedReviewV1 } from "./his-cp023-localization-v1";
import { generateHisCp024LocalizedReviewV1 } from "./his-cp024-localization-v1";
import type { HisLocaleV1, HisLocalizedQuestionV1 } from "./his-localization-types-v1";

export const HIS_001_FINAL_MULTILINGUAL_FREEZE_ID_V1 =
  "HIS-001-MULTILINGUAL-FREEZE-V1" as const;

export const HIS_001_FINAL_CP_GENERATORS_V1 = [
  ["HIS-CP-001", generateHisCp001LocalizedReviewV1],
  ["HIS-CP-002", generateHisCp002LocalizedReviewV1],
  ["HIS-CP-003", generateHisCp003LocalizedReviewV1],
  ["HIS-CP-004", generateHisCp004LocalizedReviewV1],
  ["HIS-CP-005", generateHisCp005LocalizedReviewV1],
  ["HIS-CP-006", generateHisCp006LocalizedReviewV1],
  ["HIS-CP-007", generateHisCp007LocalizedReviewV1],
  ["HIS-CP-008", generateHisCp008LocalizedReviewV1],
  ["HIS-CP-009", generateHisCp009LocalizedReviewV1],
  ["HIS-CP-010", generateHisCp010LocalizedReviewV1],
  ["HIS-CP-011", generateHisCp011LocalizedReviewV1],
  ["HIS-CP-012", generateHisCp012LocalizedReviewV1],
  ["HIS-CP-013", generateHisCp013LocalizedReviewV1],
  ["HIS-CP-014", generateHisCp014LocalizedReviewV1],
  ["HIS-CP-015", generateHisCp015LocalizedReviewV1],
  ["HIS-CP-016", generateHisCp016LocalizedReviewV1],
  ["HIS-CP-017", generateHisCp017LocalizedReviewV1],
  ["HIS-CP-018", generateHisCp018LocalizedReviewV1],
  ["HIS-CP-019", generateHisCp019LocalizedReviewV1],
  ["HIS-CP-020", generateHisCp020LocalizedReviewV1],
  ["HIS-CP-021", generateHisCp021LocalizedReviewV1],
  ["HIS-CP-022", generateHisCp022LocalizedReviewV1],
  ["HIS-CP-023", generateHisCp023LocalizedReviewV1],
  ["HIS-CP-024", generateHisCp024LocalizedReviewV1],
] as const;

export const HIS_001_FINAL_CP_IDS_V1 = Object.freeze(
  HIS_001_FINAL_CP_GENERATORS_V1.map(([cpId]) => cpId),
);

export const HIS_001_FINAL_LANGUAGES_V1 = ["en", "hi", "pa"] as const;

export function generateHis001FinalMultilingualCorpusV1(
  locale: HisLocaleV1,
): HisLocalizedQuestionV1[] {
  return HIS_001_FINAL_CP_GENERATORS_V1.flatMap(([, generate]) => generate(locale));
}

export const HIS_001_FINAL_MULTILINGUAL_CORPUS_V1: Readonly<
  Record<HisLocaleV1, readonly HisLocalizedQuestionV1[]>
> = Object.freeze({
  en: Object.freeze(generateHis001FinalMultilingualCorpusV1("en")),
  hi: Object.freeze(generateHis001FinalMultilingualCorpusV1("hi")),
  pa: Object.freeze(generateHis001FinalMultilingualCorpusV1("pa")),
});

export const HIS_001_FINAL_QL_IDS_V1 = Object.freeze(
  [...new Set(HIS_001_FINAL_MULTILINGUAL_CORPUS_V1.en.map((q) => q.qlId))].sort(),
);
