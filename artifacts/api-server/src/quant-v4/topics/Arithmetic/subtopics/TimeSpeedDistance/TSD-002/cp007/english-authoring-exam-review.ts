import { TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-effective";
import type { TsdCp007EnglishQlAuthoringSpec, TsdCp007EnglishStemFamily } from "./english-authoring-registry";

const reviewReplacements = new Map<string, TsdCp007EnglishStemFamily>([
  ["92-C", Object.freeze({
    familyId: "92-C",
    difficulty: "MEDIUM",
    representation: "platform full-occupancy interval",
    scene: "long platform",
    stem: "A {trainLength} m long train moves at {speed} along a platform {objectLength} m long. Find the time from the moment its rear enters the platform until its front reaches the far end.",
    explanationGuide: "During the stated interval the whole train is on the platform. The distance travelled is the platform length minus the train length, so divide {objectLength} minus {trainLength} by the speed.",
  })],
  ["93-F", Object.freeze({
    familyId: "93-F",
    difficulty: "MEDIUM",
    representation: "crossing-event clock reconstruction",
    scene: "railway bridge or tunnel",
    stem: "At {clockTime}, {knownEvent}. For the same train, find the time when {targetEvent}. The train is {trainLength} m long, the {objectName} is {objectLength} m long and its speed is {speed}.",
    explanationGuide: "Identify the distance between the two stated events and divide that distance by speed. Then move forward or backward from {clockTime}, according to the order of the two events, to obtain the missing event time.",
  })],
  ["94-D", Object.freeze({
    familyId: "94-D",
    difficulty: "MEDIUM",
    representation: "speed from equally spaced markers",
    scene: "signal posts",
    stem: "Signal posts are {spacing} m apart. During {timeWindow} s, {pointCount} posts are counted, with {endpointConvention}. Find the speed of the train.",
    explanationGuide: "Use the stated starting-point convention to convert the number of posts into the number of equal gaps travelled. Multiply the number of gaps by {spacing}, then divide that distance by {timeWindow} to obtain the speed.",
  })],
  ["94-E", Object.freeze({
    familyId: "94-E",
    difficulty: "MEDIUM",
    representation: "count including or excluding start",
    scene: "electric poles",
    stem: "Electric poles beside a railway line are {spacing} m apart. A train travels {distance} m. If {endpointConvention}, how many poles are counted?",
    explanationGuide: "Divide the travelled distance by the spacing to obtain the number of equal gaps. The stated starting-point convention determines whether the starting pole contributes one additional counted point.",
  })],
  ["94-F", Object.freeze({
    familyId: "94-F",
    difficulty: "MEDIUM",
    representation: "speed from pole count and time",
    scene: "trackside pillars",
    stem: "Trackside pillars are {spacing} m apart. During {timeWindow} s, {pointCount} pillars are counted, with {endpointConvention}. Find the speed of the train.",
    explanationGuide: "First translate the pillar count into the number of equal gaps using the stated starting-point convention. Multiply the number of gaps by {spacing} and divide by {timeWindow} to obtain speed.",
  })],
]);

export const TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp007EnglishQlAuthoringSpec[] = Object.freeze(
  TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY.map((ql) => Object.freeze({
    ...ql,
    objectPool: Object.freeze(ql.qlId === "TSD-QL-092"
      ? ql.objectPool.map((entry, index) => index === 5 ? "mountain tunnel" : entry)
      : [...ql.objectPool]),
    stemFamilies: Object.freeze(ql.stemFamilies.map((family) => reviewReplacements.get(family.familyId) ?? family)),
  })),
);

for (const familyId of reviewReplacements.keys()) {
  const matches = TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY.flatMap((ql) => ql.stemFamilies).filter((family) => family.familyId === familyId);
  if (matches.length !== 1) throw new Error(`${familyId}: final exam-review replacement must resolve exactly one stem family`);
}
