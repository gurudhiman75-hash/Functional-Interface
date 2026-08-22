import {
  TSD_CP007_ENGLISH_AUTHORING_REGISTRY,
  type TsdCp007EnglishDifficulty,
  type TsdCp007EnglishQlAuthoringSpec,
  type TsdCp007EnglishStemFamily,
} from "./english-authoring-registry";

const f = (
  familyId: string,
  representation: string,
  scene: string,
  stem: string,
  explanationGuide: string,
): TsdCp007EnglishStemFamily => Object.freeze({ familyId, difficulty: "MEDIUM", representation, scene, stem, explanationGuide });

const replacements = new Map<string, TsdCp007EnglishStemFamily>([
  ["85-D", f(
    "85-D",
    "bridge crossing with unit conversion",
    "railway bridge",
    "A {trainLength} m long train moving at {speed} crosses a bridge {objectLength} m long. How many seconds will it take to clear the bridge completely?",
    "For complete clearance, the train covers its own length plus the bridge length. Convert the speed to m/s when required, add {trainLength} and {objectLength}, and divide the total distance by the speed.",
  )],
  ["85-E", f(
    "85-E",
    "two-part platform crossing",
    "railway platform",
    "A railway platform consists of two adjoining portions {objectPartA} m and {objectPartB} m long. A {trainLength} m train moves at {speed}. Find the time taken by the train to cross the entire platform.",
    "The adjoining portions form one continuous platform, so their lengths are added first. Complete crossing distance is the train length plus the total platform length; dividing that distance by speed gives the required time.",
  )],
  ["85-F", f(
    "85-F",
    "tunnel crossing with unit conversion",
    "railway tunnel",
    "A train {trainLength} m long enters a tunnel {objectLength} m long at {speed}. Find the time taken for the train to come completely out of the tunnel.",
    "From the front entering to the rear leaving, the train travels the tunnel length plus one train length. Convert the speed to m/s when required and divide the combined distance by it.",
  )],
  ["86-C", f(
    "86-C",
    "stationary person timing",
    "stationary person",
    "A train travelling at {speed} takes {pointTime} s to pass a person standing beside the track. Find the length of the train.",
    "A stationary person represents one fixed point. During the passage time the train moves a distance equal to its own length, so multiply the speed by {pointTime}.",
  )],
  ["86-F", f(
    "86-F",
    "telegraph-pole timing with conversion",
    "telegraph pole",
    "A train moving at {speed} takes {pointTime} s to pass a telegraph pole completely. What is the length of the train in metres?",
    "Convert the speed to m/s when necessary. The pole has no length for this crossing, so speed multiplied by {pointTime} gives the train length.",
  )],
  ["87-C", f(
    "87-C",
    "stationary person speed",
    "stationary person",
    "A train {trainLength} m long takes {pointTime} s to pass a person standing beside the track. Find its speed in m/s.",
    "The train covers exactly its own length while passing the stationary person. Divide {trainLength} by {pointTime} to obtain the speed in m/s.",
  )],
  ["87-D", f(
    "87-D",
    "pole crossing speed in kmh",
    "signal post",
    "A train {trainLength} m long takes {pointTime} s to pass a signal post. Find its speed in km/h.",
    "First divide {trainLength} by {pointTime} to obtain the speed in m/s. Multiply the exact result by 18/5 to express the final answer in km/h.",
  )],
  ["87-F", f(
    "87-F",
    "telegraph-pole speed in kmh",
    "telegraph pole",
    "A {trainLength} m long train passes a telegraph pole in {pointTime} s. What is its speed in km/h?",
    "Passing a pole uses only the train length as distance. Divide {trainLength} by {pointTime} for m/s and then multiply by 18/5 for km/h.",
  )],
  ["88-E", f(
    "88-E",
    "platform length with unit conversion",
    "railway platform",
    "A {trainLength} m long train moving at {speed} crosses a platform completely in {crossingTime} s. Find the length of the platform.",
    "Convert the speed to m/s when required. The distance covered in {crossingTime} seconds equals train length plus platform length, so subtract {trainLength} from speed multiplied by time.",
  )],
  ["88-F", f(
    "88-F",
    "paired pole and bridge times",
    "pole and bridge",
    "A train {trainLength} m long passes a pole in {pointTime} s and crosses a bridge completely in {crossingTime} s. Find the length of the bridge.",
    "The pole time gives the train's speed from its known length. The extra time taken for the bridge is used to cover only the bridge length, so multiply that extra time by the inferred speed.",
  )],
  ["89-E", f(
    "89-E",
    "pole and bridge paired times",
    "pole and bridge",
    "A train passes a pole in {pointTime} s and a bridge {objectLength} m long in {crossingTime} s. Find the length of the train.",
    "The difference between the two times is the time required to cover the bridge length. Divide {objectLength} by that difference to get speed, then multiply by {pointTime} to obtain the train length.",
  )],
  ["89-F", f(
    "89-F",
    "pole and platform paired times",
    "pole and platform",
    "A train takes {pointTime} s to pass a pole and {crossingTime} s to cross a platform {objectLength} m long. Determine the length of the train.",
    "The platform contributes {objectLength} m beyond the pole-crossing distance. Divide that length by the extra crossing time to find speed, then multiply the speed by the pole time.",
  )],
  ["90-E", f(
    "90-E",
    "pole and bridge speed in kmh",
    "pole and bridge",
    "A train passes a pole in {pointTime} s and crosses a bridge {objectLength} m long in {crossingTime} s. Find its speed in km/h.",
    "The bridge adds {objectLength} m and {crossingTime} minus {pointTime} seconds beyond the pole crossing. Divide the added distance by the added time for m/s, then multiply by 18/5 for km/h.",
  )],
  ["90-F", f(
    "90-F",
    "pole and tunnel paired times",
    "pole and tunnel",
    "A train takes {pointTime} s to pass a pole and {crossingTime} s to pass completely through a tunnel {objectLength} m long. Find the speed of the train.",
    "The difference between the tunnel and pole times corresponds exactly to the tunnel length. Divide {objectLength} by that extra time to obtain the train speed.",
  )],
  ["91-C", f(
    "91-C",
    "two-tunnel length difference",
    "two tunnels",
    "A train travelling at {speed} crosses two tunnels in {timeA} s and {timeB} s respectively. Find the difference between the lengths of the tunnels.",
    "The same train length is included in both complete-crossing distances and cancels on subtraction. Multiply the absolute difference between {timeA} and {timeB} by the speed.",
  )],
  ["91-D", f(
    "91-D",
    "two-bridge length difference",
    "two bridges",
    "A train travelling at {speed} takes {timeA} s to cross one bridge and {timeB} s to cross another. Find the difference between the lengths of the two bridges.",
    "Subtracting the two complete-crossing relations removes the train length. The required bridge-length difference is speed multiplied by the absolute difference between the two crossing times.",
  )],
  ["91-F", f(
    "91-F",
    "bridge and tunnel length difference",
    "bridge and tunnel",
    "At a constant speed of {speed}, a train crosses a bridge in {timeA} s and a tunnel in {timeB} s. By how many metres do the bridge and tunnel lengths differ?",
    "Because the same train crosses both objects at the same speed, its own length cancels when the two distances are compared. Multiply the time difference by speed to obtain the fixed-length difference.",
  )],
  ["92-D", f(
    "92-D",
    "tunnel length from full-inside duration",
    "railway tunnel",
    "A {trainLength} m long train moving at {speed} remains completely inside a tunnel for {occupancyTime} s. Find the length of the tunnel.",
    "During the interval when the whole train is inside, it travels the excess of tunnel length over train length. Add speed multiplied by {occupancyTime} to {trainLength} to obtain the tunnel length.",
  )],
  ["92-E", f(
    "92-E",
    "bridge length from full-on duration",
    "railway bridge",
    "A {trainLength} m long train travelling at {speed} remains completely on a bridge for {occupancyTime} s. Determine the length of the bridge.",
    "While the whole train is on the bridge, the train moves through the bridge length minus train length. The extra length is speed multiplied by {occupancyTime}; add it to {trainLength}.",
  )],
  ["92-F", f(
    "92-F",
    "full-inside tunnel duration",
    "railway tunnel",
    "A tunnel is {objectLength} m long and a train of length {trainLength} m passes through it at {speed}. For how long is the train completely inside the tunnel?",
    "The whole train is inside from the instant its rear enters until its front reaches the far end. During that interval it covers {objectLength} minus {trainLength} metres; divide by speed.",
  )],
  ["93-C", f(
    "93-C",
    "signal-post event clock",
    "signal post",
    "The engine of a {trainLength} m long train passes a signal post at {clockTime}. If the train moves at {speed}, at what time will its rear pass the same post?",
    "The rear reaches the same fixed point after one point-crossing interval. Divide the train length by speed and add that duration to {clockTime}.",
  )],
  ["93-D", f(
    "93-D",
    "platform full-occupancy clock",
    "railway platform",
    "The rear of a {trainLength} m long train enters a platform {objectLength} m long at {clockTime}. The train is moving at {speed}. At what time will its front leave the far end of the platform?",
    "Rear entry to front exit is the interval for which the whole train fits on the platform. The distance is platform length minus train length; divide it by speed and add the result to the given time.",
  )],
  ["93-E", f(
    "93-E",
    "backward tunnel occupancy clock",
    "railway tunnel",
    "The front of a train leaves a tunnel at {clockTime}. The tunnel is {objectLength} m long, the train is {trainLength} m long and its speed is {speed}. At what time did the rear of the train enter the tunnel?",
    "The interval from rear entry to front exit corresponds to tunnel length minus train length. Divide that distance by speed and subtract the resulting duration from {clockTime}.",
  )],
  ["93-F", f(
    "93-F",
    "crossing-event clock reconstruction",
    "railway crossing event",
    "At {clockTime}, {knownEvent}. For the same train, find the time when {targetEvent}. The train is {trainLength} m long, the fixed section is {objectLength} m long and its speed is {speed}.",
    "Identify the distance between the two stated events, divide that distance by speed, and then move forward or backward from {clockTime} according to the order of the events.",
  )],
  ["94-D", f(
    "94-D",
    "speed from equally spaced markers",
    "signal posts",
    "Signal posts are {spacing} m apart. In {timeWindow} s a train passes {pointCount} posts, with {endpointConvention}. Find the speed of the train.",
    "Use the stated starting-point convention to convert the number of posts into the number of equal gaps travelled. Multiply the gaps by {spacing} and divide the distance by {timeWindow}.",
  )],
  ["94-E", f(
    "94-E",
    "count including or excluding start",
    "electric poles",
    "Electric poles beside a railway line are {spacing} m apart. A train travels {distance} m, with the counting rule {endpointConvention}. How many poles are counted?",
    "Divide the travelled distance by the spacing to obtain the number of equal gaps. The stated starting-point convention determines whether the starting pole contributes one additional counted point.",
  )],
  ["94-F", f(
    "94-F",
    "speed from pole count and time",
    "trackside pillars",
    "Trackside pillars are {spacing} m apart. A train passes {pointCount} pillars in {timeWindow} s, with {endpointConvention}. Find the speed of the train.",
    "First translate the pillar count into the number of gaps using the given starting-point convention. The distance is gaps multiplied by {spacing}; divide by {timeWindow} to obtain speed.",
  )],
]);

const objectPoolOverrides: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "TSD-QL-084": Object.freeze(["signal post", "telegraph pole", "stationary person", "kilometre stone", "mile post", "tree beside the track", "platform-end marker", "level-crossing post"]),
  "TSD-QL-085": Object.freeze(["railway platform", "railway bridge", "railway tunnel", "two-part platform", "station platform", "river bridge", "road underpass", "covered railway tunnel"]),
  "TSD-QL-086": Object.freeze(["signal pole", "telegraph pole", "stationary person", "kilometre stone", "mile post", "gate post", "platform-end marker", "signal post"]),
  "TSD-QL-087": Object.freeze(["signal post", "telegraph pole", "stationary person", "kilometre stone", "mile post", "gate post", "platform-end marker", "level-crossing post"]),
  "TSD-QL-088": Object.freeze(["railway platform", "bridge", "tunnel", "station platform", "river bridge", "pole and bridge", "pole and tunnel", "stationary person and platform"]),
  "TSD-QL-089": Object.freeze(["pole and platform", "signal and bridge", "marker and tunnel", "stationary person and platform", "pole and bridge", "telegraph pole and tunnel", "signal post and platform", "tree and bridge"]),
  "TSD-QL-090": Object.freeze(["pole and platform", "signal and bridge", "tree and tunnel", "stationary person and platform", "pole and bridge", "pole and tunnel", "telegraph pole and bridge", "marker and platform"]),
  "TSD-QL-091": Object.freeze(["two platforms", "bridge and platform", "two tunnels", "two bridges", "platform and tunnel", "bridge and tunnel", "two station platforms", "two railway bridges"]),
  "TSD-QL-092": Object.freeze(["railway tunnel", "long bridge", "long platform", "station platform", "river bridge", "railway tunnel", "platform longer than train", "bridge longer than train"]),
  "TSD-QL-093": Object.freeze(["tunnel entry time", "bridge exit time", "signal post", "railway platform", "railway tunnel", "railway crossing event", "station platform", "bridge crossing time"]),
  "TSD-QL-094": Object.freeze(["telegraph poles", "kilometre posts", "electric poles", "signal posts", "fence posts", "trackside pillars", "mile posts", "lamp posts"]),
});

const difficultyOverrides: Readonly<Record<string, TsdCp007EnglishDifficulty>> = Object.freeze({
  "84-A": "EASY", "84-B": "EASY", "84-C": "EASY", "84-D": "MEDIUM", "84-E": "EASY", "84-F": "MEDIUM",
  "85-A": "EASY", "85-B": "EASY", "85-C": "EASY", "85-D": "MEDIUM", "85-E": "MEDIUM", "85-F": "MEDIUM",
  "86-A": "EASY", "86-B": "EASY", "86-C": "EASY", "86-D": "MEDIUM", "86-E": "EASY", "86-F": "MEDIUM",
  "87-A": "EASY", "87-B": "EASY", "87-C": "EASY", "87-D": "MEDIUM", "87-E": "EASY", "87-F": "MEDIUM",
  "88-A": "EASY", "88-B": "EASY", "88-C": "MEDIUM", "88-D": "MEDIUM", "88-E": "MEDIUM", "88-F": "MEDIUM",
  "89-A": "MEDIUM", "89-B": "MEDIUM", "89-C": "MEDIUM", "89-D": "MEDIUM", "89-E": "MEDIUM", "89-F": "MEDIUM",
  "90-A": "MEDIUM", "90-B": "MEDIUM", "90-C": "MEDIUM", "90-D": "MEDIUM", "90-E": "MEDIUM", "90-F": "MEDIUM",
  "91-A": "EASY", "91-B": "EASY", "91-C": "EASY", "91-D": "EASY", "91-E": "EASY", "91-F": "EASY",
  "92-A": "MEDIUM", "92-B": "MEDIUM", "92-C": "MEDIUM", "92-D": "MEDIUM", "92-E": "MEDIUM", "92-F": "MEDIUM",
  "93-A": "MEDIUM", "93-B": "MEDIUM", "93-C": "MEDIUM", "93-D": "MEDIUM", "93-E": "MEDIUM", "93-F": "MEDIUM",
  "94-A": "EASY", "94-B": "EASY", "94-C": "MEDIUM", "94-D": "MEDIUM", "94-E": "MEDIUM", "94-F": "MEDIUM",
});

export const TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp007EnglishQlAuthoringSpec[] = Object.freeze(
  TSD_CP007_ENGLISH_AUTHORING_REGISTRY.map((ql) => Object.freeze({
    ...ql,
    objectPool: objectPoolOverrides[ql.qlId] ?? ql.objectPool,
    stemFamilies: Object.freeze(ql.stemFamilies.map((family) => {
      const replacement = replacements.get(family.familyId) ?? family;
      return Object.freeze({ ...replacement, difficulty: difficultyOverrides[family.familyId] ?? replacement.difficulty });
    })),
  })),
);

for (const familyId of replacements.keys()) {
  const matches = TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY.flatMap((ql) => ql.stemFamilies).filter((family) => family.familyId === familyId);
  if (matches.length !== 1) throw new Error(`${familyId}: effective English correction must resolve exactly one stem family`);
}

if (Object.keys(difficultyOverrides).length !== 66) throw new Error("CP007 difficulty calibration must cover all 66 English families");
