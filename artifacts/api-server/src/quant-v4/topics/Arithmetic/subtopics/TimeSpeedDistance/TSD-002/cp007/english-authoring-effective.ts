import {
  TSD_CP007_ENGLISH_AUTHORING_REGISTRY,
  type TsdCp007EnglishQlAuthoringSpec,
  type TsdCp007EnglishStemFamily,
} from "./english-authoring-registry";

const replacements = new Map<string, TsdCp007EnglishStemFamily>([
  ["91-D", Object.freeze({
    familyId: "91-D",
    difficulty: "MEDIUM",
    representation: "two-bridge contextual difference target",
    scene: "two bridges",
    stem: "A train travelling at {speed} takes {timeA} s to cross one bridge and {timeB} s to cross another. Determine the difference between the two bridge lengths without first finding the train length.",
    explanationGuide: "The target is only the difference between the bridge lengths. The train length appears in both complete-crossing distances and cancels when the two relations are subtracted. Multiply the absolute difference between {timeA} and {timeB} by the train speed to obtain the required length difference.",
  })],
  ["94-E", Object.freeze({
    familyId: "94-E",
    difficulty: "HARD",
    representation: "endpoint semantic contrast in point count",
    scene: "fence posts",
    stem: "Fence posts beside a rail line are {spacing} m apart. A train moves {distance} m, and the counting instruction states whether the post beside the engine at the start is included. How many posts should be reported under that convention?",
    explanationGuide: "First divide {distance} by {spacing} to find the number of complete equal gaps traversed. If the starting post is included, the reported point count is one more than the gap count; if it is excluded, the count equals the completed gaps. The endpoint wording therefore decides whether the final count uses n or n plus one relative to the gaps.",
  })],
]);

export const TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp007EnglishQlAuthoringSpec[] = Object.freeze(
  TSD_CP007_ENGLISH_AUTHORING_REGISTRY.map((ql) => Object.freeze({
    ...ql,
    stemFamilies: Object.freeze(ql.stemFamilies.map((family) => replacements.get(family.familyId) ?? family)),
  })),
);

for (const familyId of replacements.keys()) {
  const matches = TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY.flatMap((ql) => ql.stemFamilies).filter((family) => family.familyId === familyId);
  if (matches.length !== 1) throw new Error(`${familyId}: effective English correction must resolve exactly one stem family`);
}
