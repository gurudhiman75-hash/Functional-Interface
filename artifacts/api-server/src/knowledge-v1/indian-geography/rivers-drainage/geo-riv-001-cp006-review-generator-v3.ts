import { generateGeoRiv001Cp006ReviewQuestionsV2 } from "./geo-riv-001-cp006-review-generator-v2";
import type { GeoRiv001Cp006ReviewQuestion } from "./geo-riv-001-cp006-review-types";

function polish(q: GeoRiv001Cp006ReviewQuestion): GeoRiv001Cp006ReviewQuestion {
  const clean = (s: string) => s
    .replace("Multai is associated with the source of which river?", "Which river rises near Multai?")
    .replace("Therefore two statements are correct.", "Hence, two statements are correct.")
    .replace("associated with", "linked to");
  return {
    ...q,
    questionId: q.questionId.replace("CP006-V1", "CP006-V3").replace("CP006-V2", "CP006-V3"),
    stem: clean(q.stem),
    explanation: clean(q.explanation),
  };
}

export function generateGeoRiv001Cp006ReviewQuestionsV3() {
  return generateGeoRiv001Cp006ReviewQuestionsV2().map(polish);
}
