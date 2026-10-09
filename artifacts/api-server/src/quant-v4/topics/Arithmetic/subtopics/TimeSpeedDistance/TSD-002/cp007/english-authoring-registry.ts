import { TSD_CP007_PERMANENT_QL_ALLOCATIONS } from "./ql-allocation";
import type { TsdCp007AuthorityKey } from "./executable-types";

export type TsdCp007EnglishDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface TsdCp007EnglishStemFamily {
  readonly familyId: string;
  readonly difficulty: TsdCp007EnglishDifficulty;
  readonly representation: string;
  readonly scene: string;
  readonly stem: string;
  readonly explanationGuide: string;
}

export interface TsdCp007EnglishQlAuthoringSpec {
  readonly qlId: `TSD-QL-${string}`;
  readonly authorityKey: TsdCp007AuthorityKey;
  readonly learnerContract: string;
  readonly objectPool: readonly string[];
  readonly stemFamilies: readonly TsdCp007EnglishStemFamily[];
  readonly editorialStatus: "REVIEW_CANDIDATE";
}

const spec = (
  qlId: `TSD-QL-${string}`,
  authorityKey: TsdCp007AuthorityKey,
  learnerContract: string,
  objectPool: readonly string[],
  stemFamilies: readonly TsdCp007EnglishStemFamily[],
): TsdCp007EnglishQlAuthoringSpec => Object.freeze({
  qlId,
  authorityKey,
  learnerContract,
  objectPool: Object.freeze([...objectPool]),
  stemFamilies: Object.freeze(stemFamilies.map((entry) => Object.freeze(entry))),
  editorialStatus: "REVIEW_CANDIDATE" as const,
});

export const TSD_CP007_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp007EnglishQlAuthoringSpec[] = Object.freeze([
  spec(
    "TSD-QL-084",
    "fixedPointCrossingTime",
    "Find the time taken by a finite train to pass a zero-length fixed reference point.",
    ["signal post", "stationary track inspector", "mile marker", "lone tree beside the track", "platform-end signboard", "stationary guard"],
    [
      { familyId: "84-A", difficulty: "EASY", representation: "direct pole crossing", scene: "signal post", stem: "A train of length {trainLength} m moves at {speed}. How long will it take to pass a signal post completely?", explanationGuide: "The signal post is a point, so the train has to cover only its own length. Convert the given speed to m/s when necessary, then divide {trainLength} by the speed. The resulting time is the time from the engine reaching the post until the last coach clears it." },
      { familyId: "84-B", difficulty: "EASY", representation: "stationary observer event", scene: "stationary track inspector", stem: "A track inspector is standing still beside the line. From the instant the engine of a {trainLength} m train reaches the inspector until the rear coach passes, the train moves at {speed}. Find this interval.", explanationGuide: "The inspector does not move, so this is the same geometry as crossing a pole. During the required interval the train advances exactly one train length, {trainLength} m. Time is therefore train length divided by the train's speed." },
      { familyId: "84-C", difficulty: "MEDIUM", representation: "observer wording", scene: "stationary guard", stem: "A stationary guard sees the front of a train level with him and then sees its last coach go past. The train is {trainLength} m long and travels at {speed}. For how many seconds is some part of the train passing the guard?", explanationGuide: "We need the interval between the front and rear of the same train crossing one fixed point. That distance is exactly {trainLength} m, not a platform length or any extra distance. Divide this distance by the speed after keeping units consistent." },
      { familyId: "84-D", difficulty: "MEDIUM", representation: "point landmark with conversion", scene: "mile marker", stem: "A {trainLength} m express is travelling at {speed}. Calculate the time between its locomotive crossing a mile marker and its rear end crossing the same marker.", explanationGuide: "Both events occur at the same fixed marker. The locomotive must move forward by one complete train length before the rear reaches that marker. Using distance {trainLength} m and the converted speed gives the required interval." },
      { familyId: "84-E", difficulty: "HARD", representation: "semantic discrimination", scene: "platform-end signboard", stem: "The engine of a train reaches a platform-end signboard and its last coach later clears that same signboard. If the train is {trainLength} m long and runs at {speed}, determine the elapsed time.", explanationGuide: "Although the signboard is at a platform, the question names one fixed signboard rather than the whole platform. Hence only the train length matters. Divide {trainLength} by speed; adding platform length would answer a different question." },
      { familyId: "84-F", difficulty: "HARD", representation: "non-pole fixed point", scene: "lone tree beside the track", stem: "A train passes a lone tree beside the track. Its length is {trainLength} m and its speed is {speed}. Find the time from the front becoming level with the tree to the rear becoming level with it.", explanationGuide: "The tree acts as a zero-length fixed reference. The front-to-rear event requires the train to advance exactly its own length. With all units aligned, time equals {trainLength} divided by speed." },
    ],
  ),
  spec(
    "TSD-QL-085",
    "finiteFixedObjectCrossingTime",
    "Find complete crossing time when the train must clear a fixed object of non-zero length.",
    ["railway platform", "bridge", "tunnel", "covered section", "maintenance deck", "platform-and-ramp section"],
    [
      { familyId: "85-A", difficulty: "EASY", representation: "platform crossing", scene: "railway platform", stem: "A train {trainLength} m long travels at {speed}. How much time does it take to cross a {objectLength} m railway platform completely?", explanationGuide: "For the rear of the train to leave the platform, the engine must travel the train length plus the platform length. Add {trainLength} and {objectLength}, then divide that total distance by the train's speed." },
      { familyId: "85-B", difficulty: "EASY", representation: "bridge crossing", scene: "bridge", stem: "A {trainLength} m train enters a bridge of length {objectLength} m at {speed}. Find the time until the last coach leaves the bridge.", explanationGuide: "The required event runs from the front entering the bridge to the rear leaving it. The front must cover {trainLength} + {objectLength} metres. Divide this full crossing distance by the speed." },
      { familyId: "85-C", difficulty: "MEDIUM", representation: "tunnel crossing", scene: "tunnel", stem: "The locomotive of a train enters a {objectLength} m tunnel. The train is {trainLength} m long and moves uniformly at {speed}. After how long will the entire train be outside the tunnel?", explanationGuide: "Entirely outside means the rear has crossed the far end. From front entry to rear exit the locomotive advances one tunnel length plus one train length. Use that sum as distance and divide by speed." },
      { familyId: "85-D", difficulty: "MEDIUM", representation: "front-entry rear-clear semantics", scene: "maintenance deck", stem: "At the instant the front of a {trainLength} m train reaches a maintenance deck {objectLength} m long, start a stopwatch. The train moves at {speed}. When should the stopwatch stop if it stops as the rear clears the deck?", explanationGuide: "The stopwatch spans a complete finite-object crossing. The train must move far enough for its rear to travel from before the deck to beyond the far edge, so the effective distance is train length plus deck length. Divide by speed." },
      { familyId: "85-E", difficulty: "HARD", representation: "combined fixed geometry", scene: "platform-and-ramp section", stem: "A train must clear a continuous fixed trackside section consisting of lengths {objectPartA} m and {objectPartB} m. The train is {trainLength} m long and travels at {speed}. Find the total clearing time.", explanationGuide: "Because the two fixed portions are continuous, first combine them into one effective fixed length, {objectPartA} + {objectPartB}. A complete clearance then needs train length plus that combined fixed length. Divide the total by speed." },
      { familyId: "85-F", difficulty: "HARD", representation: "semantic contrast with point", scene: "covered section", stem: "A {trainLength} m train moving at {speed} begins to enter a covered track section {objectLength} m long. Determine the interval from the front entering the section to the rear leaving it.", explanationGuide: "This is not a point-crossing question because the covered section has its own length. The front must travel {objectLength} m to its far end and another {trainLength} m before the rear reaches that end. Divide their sum by speed." },
    ],
  ),
  spec(
    "TSD-QL-086",
    "trainLengthFromPointCrossing",
    "Recover train length from its speed and the time for the train to pass one fixed point.",
    ["signal pole", "stationary observer", "trackside camera", "kilometre stone", "gate post", "signal cabin window"],
    [
      { familyId: "86-A", difficulty: "EASY", representation: "direct length recovery", scene: "signal pole", stem: "A train moving at {speed} takes {pointTime} s to pass a signal pole completely. Find the length of the train.", explanationGuide: "Passing a pole means the train covers exactly its own length during {pointTime} seconds. Multiply the speed in m/s by {pointTime}. That travelled distance is the train length." },
      { familyId: "86-B", difficulty: "EASY", representation: "stationary observer", scene: "stationary observer", stem: "A stationary observer is alongside the track. A train travelling at {speed} takes {pointTime} s from the engine reaching the observer to the rear passing. How long is the train?", explanationGuide: "The observer is fixed, so the front-to-rear passage distance equals one train length. Multiply the train's speed by the observed passage time. No platform or observer length is added." },
      { familyId: "86-C", difficulty: "MEDIUM", representation: "camera timing", scene: "trackside camera", stem: "A trackside camera records {pointTime} s between the first and last part of a train crossing its reference line. If the train speed is {speed}, determine its length.", explanationGuide: "The camera's reference line is a point. In {pointTime} seconds the train advances exactly the distance separating its front and rear. Distance equals speed multiplied by time, which gives the train length." },
      { familyId: "86-D", difficulty: "MEDIUM", representation: "unit-conversion source", scene: "kilometre stone", stem: "At {speed}, a train needs {pointTime} s to clear a kilometre stone. Calculate the train's length in metres.", explanationGuide: "First express the stated speed in metres per second if it is not already. The kilometre stone contributes no distance. Multiply the converted speed by {pointTime} to obtain the train length." },
      { familyId: "86-E", difficulty: "HARD", representation: "event-language inversion", scene: "gate post", stem: "The rear of a train reaches a gate post {pointTime} s after its engine reached the same post. The train maintains {speed}. What is the distance between its engine and rear?", explanationGuide: "The requested engine-to-rear distance is the train length. Over the {pointTime}-second separation between the two point-crossing events, the train moves exactly that distance. Multiply speed by time." },
      { familyId: "86-F", difficulty: "HARD", representation: "window reference", scene: "signal cabin window", stem: "Seen through a narrow signal-cabin window, the front of a train appears and its rear disappears {pointTime} s later. The train runs at {speed}. Find its length.", explanationGuide: "Treat the narrow viewing line as one fixed reference point. The train advances by one full train length between the front and rear events. Use length = speed × {pointTime}, with consistent units." },
    ],
  ),
  spec(
    "TSD-QL-087",
    "trainSpeedFromPointCrossing",
    "Recover train speed from known train length and point-crossing time.",
    ["signal post", "trackside worker", "camera line", "station sign", "telegraph post", "level-crossing marker"],
    [
      { familyId: "87-A", difficulty: "EASY", representation: "direct speed recovery", scene: "signal post", stem: "A {trainLength} m train clears a signal post in {pointTime} s. Find its speed.", explanationGuide: "A point crossing uses only the train's own length as distance. The train therefore covers {trainLength} m in {pointTime} s. Divide distance by time, then convert the speed only if the requested unit requires it." },
      { familyId: "87-B", difficulty: "EASY", representation: "observer timing", scene: "trackside worker", stem: "A trackside worker sees a {trainLength} m train pass completely in {pointTime} s. At what speed is the train moving?", explanationGuide: "The worker is stationary and effectively marks one point. From front arrival to rear departure, the train travels one train length. Speed is {trainLength} divided by {pointTime}." },
      { familyId: "87-C", difficulty: "MEDIUM", representation: "camera line", scene: "camera line", stem: "A fixed camera line is occupied by a train for {pointTime} s. The train is {trainLength} m long. Determine the train's speed.", explanationGuide: "The duration at a fixed camera line is the point-crossing time. The distance associated with that event is the full train length, {trainLength} m. Divide it by {pointTime} seconds." },
      { familyId: "87-D", difficulty: "MEDIUM", representation: "km/h projection", scene: "station sign", stem: "A train {trainLength} m long takes {pointTime} s to pass a station sign. Find its speed in the requested unit.", explanationGuide: "Compute the base speed from {trainLength}/{pointTime} in metres per second. If the answer is required in kilometres per hour, convert only after the exact m/s value is obtained. This avoids rounding too early." },
      { familyId: "87-E", difficulty: "HARD", representation: "rear-event wording", scene: "telegraph post", stem: "The last coach of a {trainLength} m train reaches a telegraph post {pointTime} s after the locomotive passed it. Calculate the uniform speed of the train.", explanationGuide: "The locomotive-to-last-coach delay at one post is exactly a point-crossing interval. The train covers {trainLength} m in that time. Speed is length divided by the measured interval." },
      { familyId: "87-F", difficulty: "HARD", representation: "semantic point classification", scene: "level-crossing marker", stem: "A {trainLength} m train takes {pointTime} s for its entire length to move past one level-crossing marker. Determine its speed without treating the crossing itself as an object of length.", explanationGuide: "The marker is a single reference point, so no road width is part of the stated event. Use only {trainLength} m as distance. Divide by {pointTime} and convert units if needed." },
    ],
  ),
  spec(
    "TSD-QL-088",
    "fixedObjectLengthFromCrossingEvidence",
    "Recover the length of a fixed platform, bridge or tunnel from complete crossing evidence.",
    ["platform", "bridge", "tunnel", "covered track section", "inspection deck", "station platform"],
    [
      { familyId: "88-A", difficulty: "EASY", representation: "direct speed evidence", scene: "platform", stem: "A {trainLength} m train moving at {speed} crosses a platform completely in {crossingTime} s. Find the platform length.", explanationGuide: "In {crossingTime} seconds the train covers the train-plus-platform distance. Multiply speed by time to get that total distance, then subtract {trainLength}. The remainder is the platform length." },
      { familyId: "88-B", difficulty: "EASY", representation: "direct bridge evidence", scene: "bridge", stem: "A train {trainLength} m long clears a bridge in {crossingTime} s while travelling at {speed}. Determine the length of the bridge.", explanationGuide: "Complete bridge crossing distance equals train length plus bridge length. First find the distance travelled during {crossingTime} seconds. Removing the known train length leaves the bridge length." },
      { familyId: "88-C", difficulty: "MEDIUM", representation: "paired point and tunnel times", scene: "tunnel", stem: "A train takes {pointTime} s to pass a pole and {crossingTime} s to clear a tunnel. Its length is {trainLength} m. Find the tunnel length.", explanationGuide: "The pole time corresponds to one train length. The extra time, {crossingTime} − {pointTime}, is therefore the time used to cover only the tunnel length. Using the same speed, tunnel length is train length × extra time / pole time." },
      { familyId: "88-D", difficulty: "MEDIUM", representation: "paired observer/object times", scene: "station platform", stem: "The same train takes {pointTime} s to pass a stationary observer and {crossingTime} s to clear a station platform. If the train is {trainLength} m long, calculate the platform length.", explanationGuide: "The stationary-observer time gives the speed indirectly because the train travels {trainLength} m in {pointTime} s. The platform adds only the extra interval beyond that point time. Multiply the inferred speed by the extra time to obtain platform length." },
      { familyId: "88-E", difficulty: "HARD", representation: "inverse crossing semantics", scene: "covered track section", stem: "From front entry to rear exit, a {trainLength} m train takes {crossingTime} s to clear a covered section while moving at {speed}. How long is the covered section?", explanationGuide: "The stated interval spans a full finite-object crossing. Distance travelled equals speed × {crossingTime}; that distance contains both train length and covered-section length. Subtract {trainLength} to isolate the required length." },
      { familyId: "88-F", difficulty: "HARD", representation: "paired-time exact inference", scene: "inspection deck", stem: "A train of length {trainLength} m passes a trackside marker in {pointTime} s and an inspection deck in {crossingTime} s. Find the deck length without rounding the intermediate speed.", explanationGuide: "Use the point event to relate train length to speed exactly. The difference between the two times is the time needed for the additional deck distance. Compute deck length as {trainLength} × ({crossingTime} − {pointTime}) / {pointTime}." },
    ],
  ),
  spec(
    "TSD-QL-089",
    "trainLengthFromPointAndObjectTimes",
    "Recover train length when point-crossing time, fixed-object crossing time and fixed-object length are known.",
    ["pole and platform", "signal and bridge", "marker and tunnel", "observer and platform", "camera line and bridge", "post and covered section"],
    [
      { familyId: "89-A", difficulty: "EASY", representation: "pole plus platform", scene: "pole and platform", stem: "A train takes {pointTime} s to pass a pole and {crossingTime} s to cross a platform {objectLength} m long. Find the train length.", explanationGuide: "The extra time beyond the pole passage is used to cover only the {objectLength} m platform. So speed is {objectLength}/({crossingTime} − {pointTime}). Multiply that speed by {pointTime} to get the train length." },
      { familyId: "89-B", difficulty: "EASY", representation: "signal plus bridge", scene: "signal and bridge", stem: "A train clears a signal in {pointTime} s and a bridge of length {objectLength} m in {crossingTime} s. Determine the train's length.", explanationGuide: "Subtract the signal time from the bridge-crossing time. During this extra interval the train covers exactly the bridge length, so it reveals the train speed. Multiplying that speed by the signal time gives the train length." },
      { familyId: "89-C", difficulty: "MEDIUM", representation: "marker plus tunnel", scene: "marker and tunnel", stem: "The front-to-rear passage past a marker lasts {pointTime} s. The same train needs {crossingTime} s to clear a {objectLength} m tunnel. How long is the train?", explanationGuide: "Both observations use the same train and speed. The tunnel contributes an extra {objectLength} m and an extra {crossingTime} − {pointTime} seconds. Find speed from those extra quantities, then use the point time to recover train length." },
      { familyId: "89-D", difficulty: "MEDIUM", representation: "observer plus platform", scene: "observer and platform", stem: "A stationary observer sees a train pass in {pointTime} s, while a {objectLength} m platform takes {crossingTime} s to be cleared by the same train. Find the train length.", explanationGuide: "The difference between the platform time and observer time corresponds only to the platform length. Divide {objectLength} by this difference to obtain speed. The train length is then speed × {pointTime}." },
      { familyId: "89-E", difficulty: "HARD", representation: "equation-pair view", scene: "camera line and bridge", stem: "A train takes {pointTime} s to cross a fixed camera line and {crossingTime} s to clear a bridge of length {objectLength} m. Determine its length by using the two crossing relations together.", explanationGuide: "Let the unknown train length be L and speed be v. The camera gives L = v×{pointTime}, while the bridge gives L + {objectLength} = v×{crossingTime}. Subtract the equations to find v, then substitute back for L." },
      { familyId: "89-F", difficulty: "HARD", representation: "extra-time reasoning", scene: "post and covered section", stem: "A train passes a post in {pointTime} s. To pass a covered section {objectLength} m long it needs {crossingTime} s. Find the train length, explaining what the extra time represents.", explanationGuide: "The extra time is not another train-length interval; it is exactly the time needed for the front to cover the fixed section length. Use {objectLength}/({crossingTime} − {pointTime}) for speed. Then multiply by {pointTime} for the train length." },
    ],
  ),
  spec(
    "TSD-QL-090",
    "trainSpeedFromPointAndObjectTimes",
    "Recover train speed from point-crossing time and crossing time over a known fixed-object length.",
    ["pole and platform", "signal and bridge", "tree and tunnel", "observer and platform", "camera line and bridge", "marker and covered section"],
    [
      { familyId: "90-A", difficulty: "EASY", representation: "pole plus platform", scene: "pole and platform", stem: "A train takes {pointTime} s to pass a pole and {crossingTime} s to clear a platform {objectLength} m long. Find its speed.", explanationGuide: "Compared with the pole, the platform adds {objectLength} m of distance and {crossingTime} − {pointTime} seconds of time. Therefore speed is the extra distance divided by the extra time. Convert the exact result only if another speed unit is requested." },
      { familyId: "90-B", difficulty: "EASY", representation: "signal plus bridge", scene: "signal and bridge", stem: "The same train clears a signal in {pointTime} s and a {objectLength} m bridge in {crossingTime} s. Determine the train speed.", explanationGuide: "Train length appears in both crossing distances and cancels when the two observations are compared. Only the bridge's {objectLength} m remains against the extra time. Divide {objectLength} by {crossingTime} − {pointTime}." },
      { familyId: "90-C", difficulty: "MEDIUM", representation: "tree plus tunnel", scene: "tree and tunnel", stem: "A train takes {pointTime} s to pass a tree and {crossingTime} s to emerge completely from a tunnel {objectLength} m long. Find the speed of the train.", explanationGuide: "Passing the tree uses one train length; clearing the tunnel uses train length plus tunnel length. Subtraction leaves tunnel length alone. Hence speed equals tunnel length divided by the extra crossing time." },
      { familyId: "90-D", difficulty: "MEDIUM", representation: "observer plus platform", scene: "observer and platform", stem: "A stationary observer is passed in {pointTime} s, while a platform of length {objectLength} m is cleared in {crossingTime} s. What is the train's speed?", explanationGuide: "Because the observer is fixed, its passage time is the point-crossing baseline. The platform adds only {objectLength} m to the distance. Use the corresponding additional time to find speed directly." },
      { familyId: "90-E", difficulty: "HARD", representation: "exact unit projection", scene: "camera line and bridge", stem: "A train crosses a camera line in {pointTime} s and a bridge {objectLength} m long in {crossingTime} s. Calculate its speed and retain the exact value before converting units.", explanationGuide: "Use the difference of the two events: extra distance {objectLength} divided by extra time {crossingTime} − {pointTime}. Keep that quotient exact. Apply any m/s-to-km/h conversion only after the exact speed has been obtained." },
      { familyId: "90-F", difficulty: "HARD", representation: "unknown train length cancellation", scene: "marker and covered section", stem: "The length of a train is not given. It passes a marker in {pointTime} s and clears a covered section of length {objectLength} m in {crossingTime} s. Find its speed.", explanationGuide: "The missing train length is not needed because it is common to both crossing equations. Subtracting the point-crossing relation from the covered-section relation removes train length. The remaining ratio is {objectLength}/({crossingTime} − {pointTime})." },
    ],
  ),
  spec(
    "TSD-QL-091",
    "fixedObjectLengthDifferenceFromCrossingTimes",
    "Compare two fixed-object lengths using one train's speed and the difference between their complete crossing times.",
    ["two platforms", "bridge and platform", "two tunnels", "two bridges", "platform and tunnel", "two covered sections"],
    [
      { familyId: "91-A", difficulty: "EASY", representation: "two platforms", scene: "two platforms", stem: "At the same speed {speed}, a train crosses one platform in {timeA} s and another in {timeB} s. Find the difference between the platform lengths.", explanationGuide: "The train length is present in both complete-crossing distances and cancels when the two times are compared. The remaining length difference equals speed multiplied by the absolute difference between {timeA} and {timeB}." },
      { familyId: "91-B", difficulty: "EASY", representation: "bridge versus platform", scene: "bridge and platform", stem: "A train moving at {speed} clears a bridge in {timeA} s and a platform in {timeB} s. By how many metres do their lengths differ?", explanationGuide: "Use the same-train, same-speed condition. Subtracting the crossing distances removes the train's own length. Multiply the time difference by speed and take the positive magnitude because the question asks how much the lengths differ." },
      { familyId: "91-C", difficulty: "MEDIUM", representation: "reversed ordering", scene: "two tunnels", stem: "A train clears tunnel A in {timeA} s and tunnel B in {timeB} s at {speed}. Determine the absolute difference in tunnel lengths even if the shorter time is listed second.", explanationGuide: "Do not assume the first object is longer. Compute the absolute time difference first, because the same train and speed make object-length difference directly proportional to crossing-time difference. Multiply that magnitude by speed." },
      { familyId: "91-D", difficulty: "MEDIUM", representation: "known one absolute length", scene: "two bridges", stem: "A train at {speed} takes {timeA} s to cross a bridge of known length {knownLength} m and {timeB} s to cross a second bridge. Find the second bridge length.", explanationGuide: "First obtain the bridge-length difference as speed × ({timeB} − {timeA}), keeping its sign because the target is an absolute second length. Add that signed difference to {knownLength}. The train length still cancels from the comparison." },
      { familyId: "91-E", difficulty: "HARD", representation: "mixed fixed-object skins", scene: "platform and tunnel", stem: "The same train, travelling at {speed}, clears a platform in {timeA} s and a tunnel in {timeB} s. Find how much longer one fixed object is than the other.", explanationGuide: "Platform and tunnel wording does not change the complete-crossing equation. In the subtraction, train length cancels and only the fixed-object lengths remain. Multiply speed by the absolute crossing-time difference." },
      { familyId: "91-F", difficulty: "HARD", representation: "cancellation reasoning", scene: "two covered sections", stem: "A train's length is unknown, yet at {speed} it clears two covered sections in {timeA} s and {timeB} s. Determine the difference in section lengths without first finding the train length.", explanationGuide: "Finding train length would be unnecessary work. The two equations are L + P1 = v t1 and L + P2 = v t2; subtract them so L disappears. Thus |P2 − P1| = v|t2 − t1|." },
    ],
  ),
  spec(
    "TSD-QL-092",
    "fullOccupancyDuration",
    "Use the object-minus-train distance for the interval during which the entire train is inside or on a longer fixed object.",
    ["tunnel", "long bridge", "long platform", "covered maintenance bay", "inspection shed", "enclosed track section"],
    [
      { familyId: "92-A", difficulty: "EASY", representation: "duration inside tunnel", scene: "tunnel", stem: "A tunnel is {objectLength} m long and a train is {trainLength} m long, with the tunnel longer than the train. At {speed}, for how long is the whole train completely inside the tunnel?", explanationGuide: "The whole train is inside only after the rear has entered and until the front reaches the far end. During that interval the train advances {objectLength} − {trainLength} metres. Divide this difference by speed." },
      { familyId: "92-B", difficulty: "EASY", representation: "duration on bridge", scene: "long bridge", stem: "A {trainLength} m train moves at {speed} across a bridge {objectLength} m long. Assuming the bridge is longer than the train, find the duration for which the entire train is on the bridge.", explanationGuide: "This asks for full occupancy, not complete crossing. The relevant travel distance is bridge length minus train length. Divide {objectLength} − {trainLength} by speed." },
      { familyId: "92-C", difficulty: "MEDIUM", representation: "platform occupancy", scene: "long platform", stem: "From the moment the rear of a train enters a {objectLength} m platform until the moment its front leaves the platform, {trainLength} m of train must fit on it. At {speed}, find that interval.", explanationGuide: "The named events are rear entry and front exit. Their separation is the spare length available after fitting the whole train on the platform, namely {objectLength} − {trainLength}. Divide this distance by speed." },
      { familyId: "92-D", difficulty: "MEDIUM", representation: "inverse object length", scene: "covered maintenance bay", stem: "A {trainLength} m train moving at {speed} remains completely inside a maintenance bay for {occupancyTime} s. Find the length of the bay.", explanationGuide: "During full occupancy, the train travels the excess bay length beyond its own length. That excess is speed × {occupancyTime}. Add the train length {trainLength} to recover the total bay length." },
      { familyId: "92-E", difficulty: "HARD", representation: "semantic contrast", scene: "inspection shed", stem: "A train is fully within an inspection shed for {occupancyTime} s. Its length is {trainLength} m and its speed is {speed}. Determine the shed length, taking care not to use the full crossing distance.", explanationGuide: "Full-within duration uses shed length minus train length, unlike front-entry-to-rear-exit time which uses their sum. So shed length − {trainLength} = speed × {occupancyTime}. Rearranging gives the shed length." },
      { familyId: "92-F", difficulty: "HARD", representation: "feasibility boundary", scene: "enclosed track section", stem: "A {trainLength} m train is said to remain completely inside an enclosed section of length {objectLength} m while moving at {speed}. Find the full-occupancy duration if such an interval is possible.", explanationGuide: "First check that {objectLength} is greater than {trainLength}; otherwise the whole train can never fit inside and the claimed interval is impossible. When it is longer, divide the difference {objectLength} − {trainLength} by speed." },
    ],
  ),
  spec(
    "TSD-QL-093",
    "trainCrossingEventTimeline",
    "Interpret front/rear entry and exit events correctly, then project the required event time on a clock.",
    ["tunnel entry clock", "bridge exit clock", "platform CCTV", "station logbook", "maintenance block", "signal-cabin timestamp"],
    [
      { familyId: "93-A", difficulty: "EASY", representation: "forward full crossing clock", scene: "tunnel entry clock", stem: "The front of a {trainLength} m train enters a {objectLength} m tunnel at {clockTime}. The train moves at {speed}. At what time will the rear leave the tunnel?", explanationGuide: "The clock must advance by the complete crossing interval, because the events are front entry and rear exit. Compute ({trainLength} + {objectLength})/speed, then add that duration to {clockTime}." },
      { familyId: "93-B", difficulty: "EASY", representation: "backward full crossing clock", scene: "bridge exit clock", stem: "The rear of a train clears a {objectLength} m bridge at {clockTime}. The train is {trainLength} m long and travels at {speed}. When did its front first enter the bridge?", explanationGuide: "Work backward from rear exit to front entry. That event interval is a full crossing, so its duration is ({trainLength} + {objectLength})/speed. Subtract it from {clockTime}." },
      { familyId: "93-C", difficulty: "MEDIUM", representation: "point event clock", scene: "signal-cabin timestamp", stem: "A signal cabin records the engine of a {trainLength} m train passing its window at {clockTime}. At {speed}, when will the rear of the train pass the same window?", explanationGuide: "Both timestamps refer to one fixed window, so use point-crossing time rather than platform or tunnel time. The interval is {trainLength}/speed. Add it to the engine timestamp." },
      { familyId: "93-D", difficulty: "MEDIUM", representation: "forward full occupancy clock", scene: "platform CCTV", stem: "CCTV shows the rear of a {trainLength} m train entering a platform {objectLength} m long at {clockTime}. The train moves at {speed}. When will its front reach the far end of the platform?", explanationGuide: "Rear entry to front exit is the full-occupancy interval. Since the platform is longer than the train, the train travels {objectLength} − {trainLength} metres during this period. Add that duration divided by speed to the CCTV time." },
      { familyId: "93-E", difficulty: "HARD", representation: "backward full occupancy clock", scene: "maintenance block", stem: "The front of a train leaves a maintenance block at {clockTime}. The block is {objectLength} m long, the train is {trainLength} m long, and its speed is {speed}. At what time did the rear of the train enter the block?", explanationGuide: "The two events bound the interval when the whole train can be inside the block. Its duration is ({objectLength} − {trainLength})/speed, provided the block is longer than the train. Subtract that duration from {clockTime}." },
      { familyId: "93-F", difficulty: "HARD", representation: "event-semantic discrimination", scene: "station logbook", stem: "A station logbook gives one train-crossing timestamp {clockTime} and asks for another. The stated events are {eventA} and {eventB}; the train is {trainLength} m long, the fixed section is {objectLength} m, and speed is {speed}. Determine the missing timestamp using the distance implied by those two events.", explanationGuide: "First classify the event pair: the interval may correspond to train length, train-plus-object length, or object-minus-train length. Compute only that event-specific distance, divide by speed, and then add or subtract the interval from {clockTime} according to which timestamp is unknown." },
    ],
  ),
  spec(
    "TSD-QL-094",
    "fixedSpacingPointCount",
    "Relate equal spacing, point count, travelled distance and time while handling whether the starting point is counted.",
    ["telegraph poles", "kilometre posts", "lamp posts", "signal markers", "fence posts", "trackside pillars"],
    [
      { familyId: "94-A", difficulty: "EASY", representation: "count excluding start", scene: "telegraph poles", stem: "A train travels {distance} m along a stretch where telegraph poles are {spacing} m apart. If the pole beside the starting position is not counted, how many poles does the train pass?", explanationGuide: "Equal pole spacing divides the travelled distance into equal gaps. With the starting pole excluded, the number passed equals the number of complete {spacing}-metre gaps covered. Divide {distance} by {spacing}, using the stated counting convention." },
      { familyId: "94-B", difficulty: "EASY", representation: "count including start", scene: "kilometre posts", stem: "Along a straight track, posts are {spacing} m apart. A train covers {distance} m, and the post at its starting point is included in the count. How many posts are counted?", explanationGuide: "First find how many equal gaps fit into {distance}. Because the starting post is explicitly included, the number of posts is one more than the number of gaps. This is the n-points versus n−1-gaps distinction." },
      { familyId: "94-C", difficulty: "MEDIUM", representation: "spacing inverse", scene: "lamp posts", stem: "A train covers {distance} m while {pointCount} equally spaced lamp posts are counted, with the starting post {endpointConvention}. Find the spacing between consecutive posts.", explanationGuide: "Translate the counted posts into the correct number of gaps: use {pointCount} − 1 if both the starting post and the later sequence are included, otherwise use the stated excluded-start convention. Divide {distance} by that gap count to get spacing." },
      { familyId: "94-D", difficulty: "MEDIUM", representation: "speed from count", scene: "signal markers", stem: "Signal markers are {spacing} m apart. In {timeWindow} s, a train passes {pointCount} markers under the stated {endpointConvention} counting rule. Determine the train's speed.", explanationGuide: "Convert the marker count to a number of gaps before finding distance. Multiply gap count by {spacing}, then divide that distance by {timeWindow}. The endpoint convention decides whether the gap count is n or n−1." },
      { familyId: "94-E", difficulty: "HARD", representation: "endpoint semantic contrast", scene: "fence posts", stem: "Fence posts beside a rail line are equally spaced by {spacing} m. A count of {pointCount} posts is reported over a train's movement, but the report specifies whether the first post was already beside the engine at the start. Find the corresponding travelled distance.", explanationGuide: "The wording about the first post changes the gap count. If the starting post is included, {pointCount} posts span {pointCount} − 1 gaps; if it is excluded, the reported passed posts correspond to that many completed gaps. Multiply the correct gap count by {spacing}." },
      { familyId: "94-F", difficulty: "HARD", representation: "combined count-time inverse", scene: "trackside pillars", stem: "Equally spaced trackside pillars are {spacing} m apart. During {timeWindow} s a train's reference point moves past {pointCount} pillars, with {endpointConvention}. Find the speed and state which gap count you used.", explanationGuide: "Do not multiply spacing by the raw point count until the endpoint convention is resolved. Convert points to gaps first, then compute travelled distance as spacing × gaps. Divide by {timeWindow} to obtain speed, explicitly recording whether n or n−1 gaps applied." },
    ],
  ),
]);

const allocationByQl = new Map(TSD_CP007_PERMANENT_QL_ALLOCATIONS.map((entry) => [entry.permanentQlId, entry.authorityKey]));
for (const entry of TSD_CP007_ENGLISH_AUTHORING_REGISTRY) {
  const allocatedAuthority = allocationByQl.get(entry.qlId);
  if (allocatedAuthority !== entry.authorityKey) {
    throw new Error(`${entry.qlId}: English authoring authority ${entry.authorityKey} does not match permanent allocation ${allocatedAuthority ?? "MISSING"}`);
  }
}
