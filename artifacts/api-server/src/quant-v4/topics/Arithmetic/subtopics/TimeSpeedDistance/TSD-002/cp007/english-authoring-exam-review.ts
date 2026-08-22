import {
  TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY,
  type TsdCp007EnglishQlAuthoringSpec,
} from "./english-authoring-effective";

export const TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp007EnglishQlAuthoringSpec[] = Object.freeze(
  TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY.map((ql) => Object.freeze({
    ...ql,
    objectPool: Object.freeze(ql.qlId === "TSD-QL-092"
      ? ql.objectPool.map((entry, index) => index === 5 ? "mountain tunnel" : entry)
      : [...ql.objectPool]),
    stemFamilies: Object.freeze(ql.stemFamilies.map((family) => family.familyId === "93-F"
      ? Object.freeze({
          ...family,
          explanationGuide: `${family.explanationGuide} Use the resulting interval only once, then apply it in the correct clock direction to obtain the missing event time.`,
        })
      : family)),
  })),
);
