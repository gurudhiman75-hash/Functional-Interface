import { TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-effective";
import type { TsdCp007EnglishQlAuthoringSpec, TsdCp007EnglishStemFamily } from "./english-authoring-registry";

const reviewReplacements = new Map<string, TsdCp007EnglishStemFamily>([
  ["85-E", Object.freeze({
    familyId: "85-E",
    difficulty: "MEDIUM",
    representation: "contiguous bridge-plus-platform crossing",
    scene: "bridge followed by platform",
    stem: "A {trainLength} m long train moving at {speed} enters a bridge {objectPartA} m long that is immediately followed by a platform {objectPartB} m long. Find the time from the front entering the bridge until the rear clears the far end of the platform.",
    explanationGuide: "The bridge and platform are adjoining, so they form one continuous fixed length. Add {objectPartA} and {objectPartB}, then add the train length and divide the complete crossing distance by speed.",
  })],
  ["89-B", Object.freeze({
    familyId: "89-B",
    difficulty: "MEDIUM",
    representation: "signal-post and bridge paired times",
    scene: "signal post and bridge",
    stem: "A train passes a signal post in {pointTime} s and crosses a bridge {objectLength} m long in {crossingTime} s. Find the length of the train.",
    explanationGuide: "The extra time beyond the signal-post passage is used to cover only the bridge length. Divide {objectLength} by that extra time to obtain speed, then multiply by {pointTime} to obtain the train length.",
  })],
  ["89-C", Object.freeze({
    familyId: "89-C",
    difficulty: "MEDIUM",
    representation: "kilometre-post and tunnel paired times",
    scene: "kilometre post and tunnel",
    stem: "A train passes a kilometre post in {pointTime} s and emerges completely from a tunnel {objectLength} m long in {crossingTime} s. Find the length of the train.",
    explanationGuide: "The tunnel adds {objectLength} m to the point-crossing distance. Divide the tunnel length by the extra time to find speed, then multiply the speed by {pointTime} to recover the train length.",
  })],
  ["90-B", Object.freeze({
    familyId: "90-B",
    difficulty: "MEDIUM",
    representation: "signal-post and bridge speed",
    scene: "signal post and bridge",
    stem: "A train passes a signal post in {pointTime} s and crosses a bridge {objectLength} m long in {crossingTime} s. Find the speed of the train.",
    explanationGuide: "The additional time required for the bridge corresponds exactly to the bridge length. Divide {objectLength} by {crossingTime} minus {pointTime} to obtain the train speed.",
  })],
  ["91-E", Object.freeze({
    familyId: "91-E",
    difficulty: "EASY",
    representation: "platform-versus-tunnel length difference",
    scene: "platform and tunnel",
    stem: "A train travelling at {speed} crosses a platform in {timeA} s and a tunnel in {timeB} s. Find the difference between the lengths of the platform and the tunnel.",
    explanationGuide: "The same train length occurs in both complete-crossing distances and therefore cancels when the two are compared. Multiply the absolute difference between {timeA} and {timeB} by speed.",
  })],
  ["92-B", Object.freeze({
    familyId: "92-B",
    difficulty: "MEDIUM",
    representation: "bridge full-occupancy duration",
    scene: "long bridge",
    stem: "A {trainLength} m long train moves at {speed} across a bridge {objectLength} m long. For how long is the entire train completely on the bridge?",
    explanationGuide: "The whole train remains on the bridge while it travels the bridge length minus the train length. Divide that difference by speed to obtain the full-occupancy duration.",
  })],
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
