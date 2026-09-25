import { generatePolCp001Cp002LocalizedReviewV1 } from "./pol-cp001-cp002-localization-v1";
import { generatePolCp003LocalizedReviewV1 } from "./pol-cp003-localization-v1";
import { generatePolCp004LocalizedReviewV1 } from "./pol-cp004-localization-v1";
import { generatePolCp005LocalizedReviewV1 } from "./pol-cp005-localization-v1";
import { generatePolCp006LocalizedReviewV1 } from "./pol-cp006-localization-v1";
import { generatePolCp007LocalizedReviewV1 } from "./pol-cp007-localization-v1";
import { generatePolCp008LocalizedReviewV1 } from "./pol-cp008-localization-v1";
import { generatePolCp009LocalizedReviewV1 } from "./pol-cp009-localization-v1";
import { generatePolCp010LocalizedReviewV1 } from "./pol-cp010-localization-v1";
import { generatePolCp011LocalizedReviewV1 } from "./pol-cp011-localization-v1";
import { generatePolCp012LocalizedReviewV1 } from "./pol-cp012-localization-v1";
import { generatePolCp013LocalizedReviewV1 } from "./pol-cp013-localization-v1";
import { generatePolCp014LocalizedReviewV1 } from "./pol-cp014-localization-v1";
import { generatePolCp015LocalizedReviewV1 } from "./pol-cp015-localization-v1";
import { generatePolCp016LocalizedReviewV1 } from "./pol-cp016-localization-v1";
import { generatePolCp017LocalizedReviewV1 } from "./pol-cp017-localization-v1";
import { generatePolCp018LocalizedReviewV1 } from "./pol-cp018-localization-v1";
import { generatePolCp019LocalizedReviewV1 } from "./pol-cp019-localization-v1";
import { generatePolCp020LocalizedReviewV1 } from "./pol-cp020-localization-v1";
import { generatePolCp021LocalizedReviewV1 } from "./pol-cp021-localization-v1";
import { generatePolCp022LocalizedReviewV1 } from "./pol-cp022-localization-v1";
import { generatePolCp023LocalizedReviewV1 } from "./pol-cp023-localization-v1";
import { generatePolCp024LocalizedReviewV1 } from "./pol-cp024-localization-v1";
import { generatePolCp025LocalizedReviewV1 } from "./pol-cp025-localization-v1";
import { generatePolCp026LocalizedReviewV1 } from "./pol-cp026-localization-v1";
import { generatePolCp027LocalizedReviewV1 } from "./pol-cp027-localization-v1";
import type { PolLocaleV1, PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

export function generatePolCp001Cp027LocalizedReviewV1(
  locale: PolLocaleV1,
): PolLocalizedQuestionV1[] {
  const questions = [
    ...generatePolCp001Cp002LocalizedReviewV1(locale),
    ...generatePolCp003LocalizedReviewV1(locale),
    ...generatePolCp004LocalizedReviewV1(locale),
    ...generatePolCp005LocalizedReviewV1(locale),
    ...generatePolCp006LocalizedReviewV1(locale),
    ...generatePolCp007LocalizedReviewV1(locale),
    ...generatePolCp008LocalizedReviewV1(locale),
    ...generatePolCp009LocalizedReviewV1(locale),
    ...generatePolCp010LocalizedReviewV1(locale),
    ...generatePolCp011LocalizedReviewV1(locale),
    ...generatePolCp012LocalizedReviewV1(locale),
    ...generatePolCp013LocalizedReviewV1(locale),
    ...generatePolCp014LocalizedReviewV1(locale),
    ...generatePolCp015LocalizedReviewV1(locale),
    ...generatePolCp016LocalizedReviewV1(locale),
    ...generatePolCp017LocalizedReviewV1(locale),
    ...generatePolCp018LocalizedReviewV1(locale),
    ...generatePolCp019LocalizedReviewV1(locale),
    ...generatePolCp020LocalizedReviewV1(locale),
    ...generatePolCp021LocalizedReviewV1(locale),
    ...generatePolCp022LocalizedReviewV1(locale),
    ...generatePolCp023LocalizedReviewV1(locale),
    ...generatePolCp024LocalizedReviewV1(locale),
    ...generatePolCp025LocalizedReviewV1(locale),
    ...generatePolCp026LocalizedReviewV1(locale),
    ...generatePolCp027LocalizedReviewV1(locale),
  ];

  return questions.map((question) => ({
    ...question,
    sourceFactIds: [...(question.sourceFactIds ?? [])],
  }));
}

export const POL_001_LOCALIZED_QUESTION_COUNT_V1 = 2087 as const;
