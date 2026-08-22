import {
  TSD_CP007_ENGLISH_AUTHORING_REGISTRY,
  type TsdCp007EnglishQlAuthoringSpec,
  type TsdCp007EnglishStemFamily,
} from "./english-authoring-registry";

const replacements = new Map<string, TsdCp007EnglishStemFamily>([
  ["87-D", Object.freeze({
    familyId: "87-D",
    difficulty: "MEDIUM",
    representation: "kmh answer projection",
    scene: "station sign",
    stem: "A train {trainLength} m long takes {pointTime} s to pass a station sign. Find its speed in km/h.",
    explanationGuide: "The station sign is one fixed point, so the train covers exactly {trainLength} m in {pointTime} s. First divide the length by the time to obtain the exact speed in m/s. Then multiply that result by 18/5 to express the final speed in km/h.",
  })],
  ["90-E", Object.freeze({
    familyId: "90-E",
    difficulty: "HARD",
    representation: "paired-time speed with kmh projection",
    scene: "camera line and bridge",
    stem: "A train crosses a camera line in {pointTime} s and a bridge {objectLength} m long in {crossingTime} s. Calculate its speed in km/h, keeping the intermediate m/s value exact.",
    explanationGuide: "The bridge adds {objectLength} m beyond the point-crossing distance, and the matching extra time is {crossingTime} − {pointTime}. Divide the added distance by that extra time to get the exact speed in m/s. Convert only at the end by multiplying by 18/5 to obtain km/h.",
  })],
  ["91-D", Object.freeze({
    familyId: "91-D",
    difficulty: "MEDIUM",
    representation: "two-bridge contextual difference target",
    scene: "two bridges",
    stem: "A train travelling at {speed} takes {timeA} s to cross one bridge and {timeB} s to cross another. Determine the difference between the two bridge lengths without first finding the train length.",
    explanationGuide: "The target is only the difference between the bridge lengths. The train length appears in both complete-crossing distances and cancels when the two relations are subtracted. Multiply the absolute difference between {timeA} and {timeB} by the train speed to obtain the required length difference.",
  })],
  ["93-F", Object.freeze({
    familyId: "93-F",
    difficulty: "HARD",
    representation: "event-semantic discrimination",
    scene: "station logbook",
    stem: "A station logbook records {knownEvent} at {clockTime}. For the same train, find the time when {targetEvent}. The train is {trainLength} m long, the fixed section is {objectLength} m, and its speed is {speed}.",
    explanationGuide: "First identify the distance between {knownEvent} and {targetEvent}; depending on the event pair it is train length, train plus object length, or object minus train length. Divide that event-specific distance by speed. Then move forward or backward from {clockTime} according to the order of the two stated events.",
  })],
  ["94-E", Object.freeze({
    familyId: "94-E",
    difficulty: "HARD",
    representation: "endpoint semantic contrast in point count",
    scene: "fence posts",
    stem: "Fence posts beside a rail line are {spacing} m apart. A train moves {distance} m, and the counting rule is {endpointConvention}. How many posts should be reported?",
    explanationGuide: "First divide {distance} by {spacing} to find the number of complete equal gaps traversed. Under the rule {endpointConvention}, the final point count must respect whether the starting post belongs to the count. This is the endpoint distinction between the number of gaps and the number of reported posts.",
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
