import type { TsdCp010AuthorityKey } from "./source-saturation";
import type { TsdCp010QlId } from "./ql-allocation";

export type TsdCp010Difficulty = "EASY" | "MEDIUM";

export type TsdCp010EnglishFamily = Readonly<{
  familyId: string;
  difficulty: TsdCp010Difficulty;
  representation: string;
  stem: string;
  explanationGuide: string;
}>;

export type TsdCp010EnglishQl = Readonly<{
  qlId: TsdCp010QlId;
  authorityKey: TsdCp010AuthorityKey;
  learnerContract: string;
  objectPool: readonly Readonly<{ first: string; second: string; third?: string; scene: string }>[];
  families: readonly TsdCp010EnglishFamily[];
}>;

const POOLS = Object.freeze({
  basic: [
    { first: "Arjun", second: "Bharat", scene: "athletics meet" },
    { first: "Kabir", second: "Manav", scene: "sports-day race" },
    { first: "Ravi", second: "Sahil", scene: "practice race" },
    { first: "Aman", second: "Vikram", scene: "club race" },
    { first: "Neeraj", second: "Karan", scene: "track trial" },
    { first: "Rohit", second: "Deepak", scene: "selection trial" },
    { first: "Harsh", second: "Mohit", scene: "inter-school race" },
    { first: "Nitin", second: "Varun", scene: "stadium race" },
  ],
  alternate: [
    { first: "Meera", second: "Nisha", scene: "college race" },
    { first: "Simran", second: "Navjot", scene: "sports trial" },
    { first: "Priya", second: "Kavya", scene: "track event" },
    { first: "Anita", second: "Ritu", scene: "athletics practice" },
    { first: "Pooja", second: "Neha", scene: "school race" },
    { first: "Isha", second: "Tanya", scene: "club event" },
    { first: "Riya", second: "Sonia", scene: "district trial" },
    { first: "Mansi", second: "Komal", scene: "stadium trial" },
  ],
  triple: [
    { first: "A", second: "B", third: "C", scene: "three-runner race comparison" },
    { first: "P", second: "Q", third: "R", scene: "athletics comparison" },
    { first: "Arun", second: "Bimal", third: "Chetan", scene: "club race comparison" },
    { first: "Karan", second: "Manoj", third: "Naveen", scene: "track comparison" },
    { first: "Riya", second: "Simran", third: "Tanya", scene: "sports trial comparison" },
    { first: "Ajay", second: "Bhavesh", third: "Chirag", scene: "selection race comparison" },
    { first: "Dev", second: "Eshan", third: "Farhan", scene: "stadium comparison" },
    { first: "Gauri", second: "Heena", third: "Isha", scene: "college race comparison" },
  ],
});

const f = (familyId: string, difficulty: TsdCp010Difficulty, representation: string, stem: string, explanationGuide: string): TsdCp010EnglishFamily =>
  Object.freeze({ familyId, difficulty, representation, stem, explanationGuide });

export const TSD_CP010_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp010EnglishQl[] = Object.freeze([
  {
    qlId: "TSD-QL-115", authorityKey: "finishDistanceLeadState",
    learnerContract: "Find how much distance remains for the slower competitor when the faster competitor finishes the declared race.",
    objectPool: POOLS.basic,
    families: [
      f("115-A", "EASY", "direct finish lead", "In a {raceDistance} race, {first} and {second} start together at constant speeds of {winnerSpeed} and {loserSpeed}. When {first} reaches the finish, how many metres behind is {second}?", "Find the winner's race time, then the distance covered by the slower racer in that same time; subtract from the race length."),
      f("115-B", "EASY", "remaining distance", "{first} and {second} run a straight race of {raceDistance}. Their speeds are {winnerSpeed} and {loserSpeed}, respectively. How much distance is still left for {second} when {first} finishes?", "Use the common elapsed time up to the faster racer's finish and calculate the slower racer's unfinished distance."),
      f("115-C", "MEDIUM", "winning margin", "During a {raceDistance} {scene}, {first} runs at {winnerSpeed} and {second} at {loserSpeed}. Both leave the start together. By what distance does {first} win?", "Compute the finish instant for the winner and compare the loser's position with the finish line."),
      f("115-D", "MEDIUM", "finish position", "On a {raceDistance} track, {first} maintains {winnerSpeed} while {second} maintains {loserSpeed}. At the instant {first} crosses the finish line, find {second}'s distance from the finish.", "Convert the winner's completion time into the loser's covered distance and take the remaining part of the track."),
      f("115-E", "MEDIUM", "race report margin", "A race report states that {first} and {second} covered a {raceDistance} course at steady speeds of {winnerSpeed} and {loserSpeed}. What was {first}'s winning margin in metres?", "Use distance = speed × time at the winner's finishing time, then take the difference from the full course."),
      f("115-F", "MEDIUM", "selection trial margin", "In a {raceDistance} {scene}, {first} is faster at {winnerSpeed}; {second} runs at {loserSpeed}. They start simultaneously. Find the gap between them when {first} finishes.", "The required gap is the race length minus the slower racer's distance during the winner's race time."),
    ],
  },
  {
    qlId: "TSD-QL-116", authorityKey: "finishTimeLeadState",
    learnerContract: "Find the difference between the competitors' finish times over the same declared race distance.",
    objectPool: POOLS.alternate,
    families: [
      f("116-A", "EASY", "direct finish-time gap", "{first} and {second} run {raceDistance} at constant speeds of {winnerSpeed} and {loserSpeed}. By how many seconds does {first} finish before {second}?", "Calculate each competitor's time for the same distance and subtract the faster time from the slower time."),
      f("116-B", "EASY", "time lead at finish", "In a {raceDistance} race, {first} runs at {winnerSpeed} and {second} at {loserSpeed}. If they start together, what is {first}'s time lead at the finish?", "Find both finish times from distance/speed; their difference is the time lead."),
      f("116-C", "MEDIUM", "arrival gap", "A {raceDistance} {scene} is contested by {first} and {second}, whose steady speeds are {winnerSpeed} and {loserSpeed}. Find the gap between their finishing times.", "Use the common race length to obtain each completion time and compare them."),
      f("116-D", "MEDIUM", "seconds after winner", "{first} completes a {raceDistance} course at {winnerSpeed}; {second} covers the same course at {loserSpeed}. How many seconds after {first} does {second} finish?", "Subtract the winner's completion time from the loser's completion time."),
      f("116-E", "MEDIUM", "same-course finish gap", "Two competitors, {first} and {second}, start a {raceDistance} race together. Their speeds remain {winnerSpeed} and {loserSpeed}. Determine the finish-time difference.", "Because both cover the full race length, compute two distance/speed times and take the positive difference."),
      f("116-F", "MEDIUM", "trial timing margin", "During a {raceDistance} {scene}, {first} runs at {winnerSpeed} and {second} at {loserSpeed}. What timing margin separates their finishes?", "Calculate the two finish times exactly and report the later time minus the earlier time."),
    ],
  },
  {
    qlId: "TSD-QL-117", authorityKey: "raceSpeedRatioState",
    learnerContract: "Infer the faster-to-slower speed ratio from the declared race distance and the slower competitor's unfinished distance at the winner's finish.",
    objectPool: POOLS.basic,
    families: [
      f("117-A", "EASY", "ratio from distance lead", "In a {raceDistance} race, {first} beats {second} by {distanceLead}. Find the ratio of their speeds, {first}:{second}.", "At the same instant, the distances covered are race distance and race distance minus the lead; their ratio equals the speed ratio."),
      f("117-B", "EASY", "ratio from loser position", "When {first} finishes a {raceDistance} race, {second} is {distanceLead} short of the finish. What is the speed ratio {first}:{second}?", "Use equal elapsed time: speed ratio equals the ratio of distances covered by that instant."),
      f("117-C", "MEDIUM", "race-result inversion", "A {raceDistance} {scene} ends with {first} ahead of {second} by {distanceLead}. Assuming constant speeds and a simultaneous start, determine {first}:{second} in speed.", "Translate the finish margin into the loser's covered distance, then simplify winner distance : loser distance."),
      f("117-D", "MEDIUM", "finish record ratio", "The result of a {raceDistance} race says {first} won over {second} by {distanceLead}. From this result alone, find their speed ratio.", "The race result fixes the distance each covered in the same time; divide those distances to get the ratio."),
      f("117-E", "MEDIUM", "distance-fraction ratio", "In a {raceDistance} race, {second} still has {distanceLead} to run when {first} finishes. If both started together, what is {first}'s speed relative to {second}'s? Give the ratio.", "Use the loser's completed portion rather than the remaining portion when forming the speed ratio."),
      f("117-F", "MEDIUM", "constant-speed comparison", "{first} and {second} race over {raceDistance}. {first} finishes while {second} is {distanceLead} behind. Their speeds are constant. Find {first}:{second}.", "At the winner's finish, both have run for equal time, so compare their distances at that instant."),
    ],
  },
  {
    qlId: "TSD-QL-118", authorityKey: "raceLengthFromLeadEvidence",
    learnerContract: "Recover an unknown race length from two constant speeds and a stated finish-distance lead.",
    objectPool: POOLS.alternate,
    families: [
      f("118-A", "EASY", "unknown race length", "{first} runs at {winnerSpeed} and {second} at {loserSpeed}. If {first} beats {second} by {distanceLead}, what is the race length?", "Let the race length be D; the lead fraction equals the speed-difference fraction relative to the winner's speed."),
      f("118-B", "EASY", "track length from margin", "On an unknown-length track, {first} and {second} start together at {winnerSpeed} and {loserSpeed}. {first} wins by {distanceLead}. Find the track length.", "Use proportional distances at the winner's finish to reconstruct the full distance."),
      f("118-C", "MEDIUM", "course reconstruction", "In a {scene}, {first}'s speed is {winnerSpeed} and {second}'s is {loserSpeed}. The recorded winning margin is {distanceLead}. Determine the length of the course.", "Express the loser's distance as the winner's distance multiplied by the speed ratio, then equate their difference to the given lead."),
      f("118-D", "MEDIUM", "finish-gap reconstruction", "{first} and {second} maintain {winnerSpeed} and {loserSpeed}. They start together, and {first} reaches the finish {distanceLead} ahead. How long is the race?", "The known margin is the fraction (winner speed − loser speed)/winner speed of the whole race."),
      f("118-E", "MEDIUM", "hidden distance", "A race has an unknown length. {first} runs at {winnerSpeed}, {second} at {loserSpeed}, and the final distance gap is {distanceLead}. Find the race distance.", "Set the common winner finishing time and use the difference in distances covered during that time."),
      f("118-F", "MEDIUM", "race record length", "A race record gives speeds {winnerSpeed} for {first} and {loserSpeed} for {second}; {first}'s winning margin was {distanceLead}. Reconstruct the race length.", "Scale the known lead by winner speed divided by the speed difference."),
    ],
  },
  {
    qlId: "TSD-QL-119", authorityKey: "deadHeatHandicapState",
    learnerContract: "Choose a distance head start or start-time delay that exactly offsets the competitors' speed difference and produces a dead heat.",
    objectPool: POOLS.basic,
    families: [
      f("119-A", "EASY", "distance head start", "In a {raceDistance} race, {first} runs at {fasterSpeed} and {second} at {slowerSpeed}. How many metres of head start should {second} receive so that they finish together?", "The required head start equals the distance by which the faster racer would beat the slower racer in an ordinary simultaneous-start race."),
      f("119-B", "EASY", "faster racer delayed", "{first} can run {raceDistance} at {fasterSpeed}; {second} runs at {slowerSpeed}. If {second} starts first, how many seconds later should {first} start for a dead heat?", "The faster racer must be delayed by the difference between their normal completion times."),
      f("119-C", "MEDIUM", "fair distance handicap", "For a {raceDistance} {scene}, {first}'s speed is {fasterSpeed} and {second}'s is {slowerSpeed}. Find the distance handicap in favour of {second} that makes the finish simultaneous.", "Calculate where the slower racer would be when the faster racer covers the whole race; the remaining distance is the fair handicap."),
      f("119-D", "MEDIUM", "fair start-time handicap", "{first} is faster at {fasterSpeed}; {second} runs at {slowerSpeed}. Over {raceDistance}, determine the start delay to give {first} so both reach the finish together.", "Compare their full-distance running times; the faster competitor's delay must equal that time difference."),
      f("119-E", "MEDIUM", "dead-heat head start", "{first} and {second} are to contest {raceDistance} at steady speeds {fasterSpeed} and {slowerSpeed}. What head start, measured in metres, makes the race a dead heat?", "Use the slower racer's shortfall at the faster racer's normal finish as the starting advantage."),
      f("119-F", "MEDIUM", "dead-heat delay", "In a {raceDistance} race, {first} runs at {fasterSpeed} and {second} at {slowerSpeed}. Find the exact number of seconds by which {first}'s start must be delayed for them to tie.", "The required delay is slower full-race time minus faster full-race time."),
    ],
  },
  {
    qlId: "TSD-QL-120", authorityKey: "leadConversionState",
    learnerContract: "Convert a finish-distance lead to its equivalent finish-time lead, or vice versa, using the losing competitor's speed.",
    objectPool: POOLS.alternate,
    families: [
      f("120-A", "EASY", "distance lead to time lead", "{first} beats {second} by {distanceLead}. If {second}'s speed is {loserSpeed}, by how many seconds does {first} win?", "After the winner finishes, divide the loser's remaining distance by the loser's speed."),
      f("120-B", "EASY", "time lead to distance lead", "{first} finishes {timeLead} before {second}. If {second} runs at {loserSpeed}, what distance lead does this time gap represent?", "Multiply the loser's speed by the remaining time after the winner finishes."),
      f("120-C", "MEDIUM", "race-report conversion", "A {scene} records {first}'s winning distance over {second} as {distanceLead}. {second} runs at {loserSpeed}. Express the same winning margin in seconds.", "The equivalent time margin is the time the slower racer needs to cover the recorded remaining distance."),
      f("120-D", "MEDIUM", "timing margin converted to metres", "The official timing shows {first} ahead of {second} by {timeLead} at the finish. With {second} moving at {loserSpeed}, convert that margin to metres.", "Distance still to be covered equals the slower racer's speed times the time gap."),
      f("120-E", "MEDIUM", "remaining-distance timing", "When {first} finishes, {second} has {distanceLead} left and continues at {loserSpeed}. How much later does {second} reach the finish?", "Use time = remaining distance / slower speed."),
      f("120-F", "MEDIUM", "remaining-time distance", "When {first} finishes, {second} needs another {timeLead} at a constant {loserSpeed}. How far from the finish is {second} at that instant?", "Use remaining distance = slower speed × remaining time."),
    ],
  },
  {
    qlId: "TSD-QL-121", authorityKey: "transitiveRaceComparison",
    learnerContract: "Combine A-versus-B and B-versus-C race outcomes over the same distance to obtain the A-versus-C finish margin.",
    objectPool: POOLS.triple,
    families: [
      f("121-A", "MEDIUM", "A-B-C transitive lead", "In separate {raceDistance} races, {first} beats {second} by {aBeatsBBy}, and {second} beats {third} by {bBeatsCBy}. Their speeds are unchanged. By how much would {first} beat {third} in a {raceDistance} race?", "Convert each pairwise result into a loser/winner distance fraction, multiply the fractions, then recover C's distance when A finishes."),
      f("121-B", "MEDIUM", "three-runner comparison", "Over the same {raceDistance} course, {first} defeats {second} by {aBeatsBBy}; in another race {second} defeats {third} by {bBeatsCBy}. Find {first}'s distance lead over {third}.", "Use B/A from the first finish and C/B from the second; their product gives C/A."),
      f("121-C", "MEDIUM", "linked race results", "A race record says {first} beats {second} by {aBeatsBBy} in {raceDistance}, while {second} beats {third} by {bBeatsCBy} over the same distance. What is the implied {first}-over-{third} margin?", "Treat each lead as a completed-distance ratio and compose the two ratios before converting back to a lead."),
      f("121-D", "MEDIUM", "pairwise outcomes", "{first}, {second}, and {third} keep constant speeds. In a {raceDistance} race {first} beats {second} by {aBeatsBBy}; {second} beats {third} by {bBeatsCBy}. Determine how far {third} is from the finish when {first} finishes.", "Find the fraction of the race C covers per unit distance of A by multiplying the two pairwise fractions."),
      f("121-E", "MEDIUM", "transitive finish gap", "For {raceDistance} races, {first}>{second} by {aBeatsBBy} and {second}>{third} by {bBeatsCBy}. Assuming the same steady speeds in every race, calculate {first}'s winning distance over {third}.", "Compose the two speed ratios; do not add the two leads directly."),
      f("121-F", "MEDIUM", "three-athlete race inference", "In two trials of length {raceDistance}, {first} finishes {aBeatsBBy} ahead of {second}, and {second} finishes {bBeatsCBy} ahead of {third}. If {first} races {third}, what is the expected distance margin?", "Use multiplicative distance fractions from the two trials and subtract C's inferred distance from the full race."),
    ],
  },
  {
    qlId: "TSD-QL-122", authorityKey: "multiOutcomeRaceComparison",
    learnerContract: "Carry the speed ratio established by one race into a second race with a new distance and a declared head start.",
    objectPool: POOLS.basic,
    families: [
      f("122-A", "MEDIUM", "second race with head start", "In a {firstRaceDistance} race, {first} beats {second} by {firstRaceLead}. Their speeds stay unchanged. They next race {secondRaceDistance}, but {second} starts {secondRaceHeadStart} ahead. By how many metres does {first} still win?", "The first race gives the speed ratio. Apply that ratio over the second distance, then subtract the slower racer's starting advantage."),
      f("122-B", "MEDIUM", "changed distance and handicap", "{first} defeats {second} by {firstRaceLead} over {firstRaceDistance}. In a second {secondRaceDistance} race, {second} is given a {secondRaceHeadStart} head start. With both speeds unchanged, find the final margin.", "Infer slower/faster speed ratio from race one, calculate the slower racer's travel during the faster racer's second-race time, and include the head start."),
      f("122-C", "MEDIUM", "two-race comparison", "Race 1: {first} beats {second} by {firstRaceLead} in {firstRaceDistance}. Race 2 is {secondRaceDistance}, and {second} begins {secondRaceHeadStart} closer to the finish. If speeds are the same as before, how far ahead does {first} finish?", "Use race one only to fix the speed ratio; in race two compare the head-start-adjusted slower position at the faster finish."),
      f("122-D", "MEDIUM", "handicapped rematch", "After {first} wins a {firstRaceDistance} race over {second} by {firstRaceLead}, they have a {secondRaceDistance} rematch. {second} receives {secondRaceHeadStart} metres. Their running speeds do not change. Find {first}'s winning margin in the rematch.", "Scale the slower racer's race-one distance fraction to the rematch and reduce the natural lead by the handicap."),
      f("122-E", "MEDIUM", "ratio carried to rematch", "A first result over {firstRaceDistance} gives {first} a {firstRaceLead} lead over {second}. For a {secondRaceDistance} rematch, {second} starts {secondRaceHeadStart} ahead. Determine the finish gap, assuming unchanged speeds.", "Convert the first result to a constant speed ratio, then evaluate the second finish state with the initial offset."),
      f("122-F", "MEDIUM", "second-stage race state", "{first} and {second} keep the same speeds in two races. {first} wins the first, {firstRaceDistance}, by {firstRaceLead}. In the second, {secondRaceDistance}, {second} is placed {secondRaceHeadStart} ahead at the start. What is {first}'s final lead?", "Use the first-race result to get the slower/winner fraction; apply it to the second distance and account for the head start once."),
    ],
  },
  {
    qlId: "TSD-QL-123", authorityKey: "changedRaceOutcomeState",
    learnerContract: "Recompute the winning distance after a declared whole-race speed change, a rest by the slower racer, or a delayed start by the faster racer.",
    objectPool: POOLS.alternate,
    families: [
      f("123-A", "MEDIUM", "faster speed increases", "For a {raceDistance} race, {first} normally runs at {fasterSpeed} and {second} at {slowerSpeed}. {first} now increases the whole-race speed by {speedIncrease}. If they start together, by how many metres does {first} win?", "Use the increased speed to find the new winner time, then compare the slower racer's distance at that instant."),
      f("123-B", "MEDIUM", "slower racer rests", "{first} and {second} start a {raceDistance} race together at {fasterSpeed} and {slowerSpeed}. During the race, {second} is stationary for a total of {restTime}; {first} does not stop. Find {first}'s winning distance.", "Find the faster racer's finish time; the slower racer moves only for that time minus the stated rest."),
      f("123-C", "MEDIUM", "faster delayed start", "{second} starts a {raceDistance} race first at {slowerSpeed}. {first}, who runs at {fasterSpeed}, starts {startDelay} later and still wins. How many metres ahead is {first} at the finish?", "The slower racer has the start delay plus the faster racer's running time before the faster finish; convert that total time to distance."),
      f("123-D", "MEDIUM", "changed pace rematch", "In a {raceDistance} rematch, {first}'s usual speed is {fasterSpeed} but rises by {speedIncrease}; {second} continues at {slowerSpeed}. They start together. Determine the new winning margin.", "Use the new faster speed throughout the race; the old speed is needed only to determine the stated increase."),
      f("123-E", "MEDIUM", "rest-adjusted finish", "Over {raceDistance}, {first} maintains {fasterSpeed}. {second} moves at {slowerSpeed} but takes a total rest of {restTime}. Both start at the same instant. How far behind is {second} when {first} finishes?", "Subtract the rest from the elapsed winner time before calculating the slower racer's covered distance."),
      f("123-F", "MEDIUM", "start-delay handicap", "In a {raceDistance} race, {second} runs from time zero at {slowerSpeed}; {first} runs at {fasterSpeed} but waits {startDelay} before starting. Given that {first} still finishes first, find the distance margin.", "Add the delay to the faster racer's own race time to get the slower racer's elapsed running time, then find the remaining distance."),
    ],
  },
  {
    qlId: "TSD-QL-124", authorityKey: "runnerStateFromTwoRaceOutcomes",
    learnerContract: "Use a distance-lead race and a time-lead race between the same unchanged competitors to recover an absolute running speed.",
    objectPool: POOLS.basic,
    families: [
      f("124-A", "MEDIUM", "faster speed from two outcomes", "The same {first} and {second} race twice at unchanged speeds. In a {firstRaceDistance} race, {first} beats {second} by {firstRaceLead}; in a {secondRaceDistance} race, {first} wins by {secondRaceTimeLead}. Find {first}'s speed.", "The first race gives the speed ratio. Substitute that ratio into the second race's difference of finish times to recover the faster speed."),
      f("124-B", "MEDIUM", "slower speed from two outcomes", "{first} and {second} keep constant speeds in two races. {first} wins a {firstRaceDistance} race by {firstRaceLead} and a {secondRaceDistance} race by {secondRaceTimeLead}. Determine {second}'s speed.", "Infer slower/faster ratio from the distance lead, use the time lead to obtain the faster speed scale, then multiply by the ratio."),
      f("124-C", "MEDIUM", "two-result speed reconstruction", "Race one is {firstRaceDistance}: {first} finishes {firstRaceLead} ahead of {second}. Race two is {secondRaceDistance}: {first} finishes {secondRaceTimeLead} earlier. Their speeds are unchanged. Find {targetRunner}'s speed.", "Use the first result for a dimensionless ratio and the second for the absolute time scale; together they uniquely determine the requested speed."),
      f("124-D", "MEDIUM", "distance and time evidence", "For competitors {first} and {second}, a {firstRaceDistance} race gives a distance margin of {firstRaceLead} to {first}. A later {secondRaceDistance} race gives {first} a time margin of {secondRaceTimeLead}. Assuming unchanged speeds, calculate {targetRunner}'s speed.", "Turn the first margin into slower/faster speed ratio, then solve the second race time-difference equation."),
      f("124-E", "MEDIUM", "absolute speed from race reports", "Two race reports concern the same {first} and {second}. Report 1: {first} wins {firstRaceDistance} by {firstRaceLead}. Report 2: {first} wins {secondRaceDistance} by {secondRaceTimeLead}. What is {targetRunner}'s speed?", "A distance lead alone gives only a ratio; combine it with the time lead in the second race to determine an absolute speed."),
      f("124-F", "MEDIUM", "paired race evidence", "{first} beats {second} by {firstRaceLead} over {firstRaceDistance}. Over {secondRaceDistance}, {first} beats {second} by {secondRaceTimeLead}. Speeds do not change between races. Find the speed of {targetRunner}.", "Use both outcomes: first establish the speed ratio, then use the second race to set the numerical speed scale."),
    ],
  },
]);