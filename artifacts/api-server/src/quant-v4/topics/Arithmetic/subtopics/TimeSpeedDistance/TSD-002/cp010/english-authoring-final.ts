import { TSD_CP010_ENGLISH_AUTHORING_REGISTRY, type TsdCp010EnglishFamily, type TsdCp010EnglishQl } from "./english-authoring-registry";

type Patch = Readonly<Pick<TsdCp010EnglishFamily, "stem" | "explanationGuide" | "representation">>;

const p = (representation: string, stem: string, explanationGuide: string): Patch => Object.freeze({ representation, stem, explanationGuide });

const PATCHES: Readonly<Record<string, Patch>> = Object.freeze({
  "115-A": p("direct winning margin", "In a {raceDistance} race, {first} runs at {winnerSpeed} and {second} at {loserSpeed}. By how many metres does {first} beat {second}?", "Find the time taken by the winner and hence the distance covered by the loser in that time."),
  "115-B": p("loser short of finish", "{first} and {second} run a {raceDistance} race at {winnerSpeed} and {loserSpeed}, respectively. When {first} finishes, how far is {second} from the finishing point?", "Use the winner's finishing time to locate the loser."),
  "115-C": p("simultaneous-start margin", "Two runners start together in a {raceDistance} race. Their speeds are {winnerSpeed} and {loserSpeed}. Find the winning margin.", "Calculate the slower runner's distance when the faster runner completes the race."),
  "115-D": p("distance by which winner wins", "In a race of {raceDistance}, {first} and {second} run with speeds {winnerSpeed} and {loserSpeed}. Find the distance by which {first} wins.", "Compare their positions at the instant the faster runner finishes."),
  "115-E": p("finish-state gap", "{first} runs {raceDistance} at {winnerSpeed}, while {second} runs at {loserSpeed}. If both start together, how many metres behind is {second} when {first} reaches the finish?", "Find common elapsed time up to the winner's finish, then the remaining distance."),
  "115-F": p("winning margin as percent of race", "In a {raceDistance} race, {first} runs at {winnerSpeed} and {second} at {loserSpeed}. {first}'s winning margin is what percent of the race distance?", "Find the ordinary distance margin and express it as a percentage of the race length."),

  "116-A": p("finish-time lead", "In a {raceDistance} race, {first} runs at {winnerSpeed} and {second} at {loserSpeed}. By how many seconds does {first} beat {second}?", "Find both completion times and subtract."),
  "116-B": p("time difference", "{first} and {second} cover {raceDistance} at {winnerSpeed} and {loserSpeed}, respectively. Find the difference in their finishing times.", "Use time = distance/speed for each runner."),
  "116-C": p("winner earlier by", "Two runners start together for a {raceDistance} race. Their speeds are {winnerSpeed} and {loserSpeed}. How much earlier does the faster runner finish?", "Compare the two race times."),
  "116-D": p("seconds after winner", "{first} completes {raceDistance} at {winnerSpeed}; {second} covers the same distance at {loserSpeed}. How many seconds after {first} does {second} finish?", "Subtract faster time from slower time."),
  "116-E": p("same-distance time gap", "A and B run the same {raceDistance} distance at speeds {winnerSpeed} and {loserSpeed}. What is the difference between their times?", "Compute the two times for equal distance."),
  "116-F": p("time by which first wins", "If {first} and {second} run {raceDistance} with speeds {winnerSpeed} and {loserSpeed}, by what time does {first} win the race?", "Find the difference of their completion times."),

  "117-A": p("speed ratio from distance lead", "In a {raceDistance} race, {first} beats {second} by {distanceLead}. Find the ratio of their speeds.", "At the winner's finish, compare the distances covered in equal time."),
  "117-B": p("speed ratio from time lead", "{first} completes a race in {winnerTime} and beats {second} by {timeLead}. Find the ratio of their speeds.", "For equal distance, speeds are inversely proportional to times."),
  "117-C": p("ratio from loser shortfall", "When {first} completes a {raceDistance} race, {second} is {distanceLead} short of the finish. Find {first}:{second} in speed.", "Use winner distance : loser distance at the same instant."),
  "117-D": p("ratio from finish-time gap", "In the same race, {first} takes {winnerTime} and {second} takes {timeLead} more. What is their speed ratio?", "Form the loser's total time and invert the time ratio."),
  "117-E": p("race result to speed ratio", "{first} beats {second} by {distanceLead} in a {raceDistance} race. What is the speed ratio {first}:{second}?", "Convert the winning distance into the loser's covered distance."),
  "117-F": p("time-margin speed ratio", "{first} finishes a race in {winnerTime}; {second} finishes {timeLead} later. Find {first}:{second}.", "For the same distance, speed ratio is the inverse of time ratio."),

  "118-A": p("race length from distance lead", "{first} and {second} run at {winnerSpeed} and {loserSpeed}. If {first} beats {second} by {distanceLead}, find the length of the race.", "Let race length be D and use the distance lead at the winner's finish."),
  "118-B": p("race length from time lead", "{first} runs at {winnerSpeed} and {second} at {loserSpeed}. If {first} beats {second} by {timeLead}, find the race distance.", "Set the difference of their completion times equal to the given time lead."),
  "118-C": p("unknown distance from margin", "In a race, the speeds of {first} and {second} are {winnerSpeed} and {loserSpeed}. {first} wins by {distanceLead}. What is the race length?", "Use proportional distances covered in the winner's finishing time."),
  "118-D": p("distance from time difference", "Two runners move at {winnerSpeed} and {loserSpeed}. The faster runner finishes {timeLead} earlier. Find the length of the race.", "Let the common race distance be D and solve the time-difference equation."),
  "118-E": p("track length from winning distance", "{first} runs at {winnerSpeed} and {second} at {loserSpeed}. Their winning-distance difference is {distanceLead}. Find the track length.", "Relate the lead to the fractional speed difference."),
  "118-F": p("track length from timing margin", "On a track of unknown length, {first} runs at {winnerSpeed} and {second} at {loserSpeed}. {first} wins by {timeLead}. Find the track length.", "Use slower time minus faster time equal to the stated margin."),

  "119-A": p("distance start for dead heat", "In a {raceDistance} race, {first} and {second} run at {fasterSpeed} and {slowerSpeed}. What start should be given to {second} so that the race ends in a tie?", "The slower runner's start equals the ordinary distance by which the faster runner would win."),
  "119-B": p("time start for dead heat", "In a {raceDistance} race, {first} runs at {fasterSpeed} and {second} at {slowerSpeed}. How many seconds after {second} should {first} start so that both finish together?", "Delay the faster runner by the difference of their normal race times."),
  "119-C": p("fair distance handicap", "{first} can run {raceDistance} at {fasterSpeed} and {second} at {slowerSpeed}. How many metres ahead should {second} start for a dead heat?", "Use the slower runner's shortfall at the faster runner's ordinary finish."),
  "119-D": p("fair time handicap", "{first} and {second} run a {raceDistance} race at {fasterSpeed} and {slowerSpeed}. What time start should be given to {second} so that they reach the finish together?", "The required time start is the difference in full-race times."),
  "119-E": p("start in metres", "In a {raceDistance} race, speeds of {first} and {second} are {fasterSpeed} and {slowerSpeed}. Find the start in metres to be given to {second} for an equal finish.", "Find the distance advantage needed to offset the speed difference."),
  "119-F": p("delay faster runner", "{first} runs at {fasterSpeed} and {second} at {slowerSpeed} over {raceDistance}. By how much should {first}'s start be delayed so that neither wins?", "Use the difference between their ordinary completion times."),

  "120-A": p("distance lead to time lead", "{first} beats {second} by {distanceLead}. If {second}'s speed is {loserSpeed}, by how much time does {first} win?", "Time lead equals the loser's remaining distance divided by the loser's speed."),
  "120-B": p("time lead to distance lead", "{first} beats {second} by {timeLead}. If {second} runs at {loserSpeed}, by how many metres does {first} win?", "Distance lead equals loser speed multiplied by the remaining time."),
  "120-C": p("equivalent time margin", "{first} wins over {second} by {distanceLead}. {second}'s speed is {loserSpeed}. Express the win in seconds.", "Convert remaining distance to time at the loser's speed."),
  "120-D": p("equivalent distance margin", "{first} reaches the finish {timeLead} before {second}. If {second}'s speed is {loserSpeed}, find the winning distance.", "Convert the time gap to the distance the loser still has to cover."),
  "120-E": p("remaining distance to remaining time", "When {first} finishes, {second} is {distanceLead} short of the finish and runs at {loserSpeed}. How much later does {second} finish?", "Use time = remaining distance/speed."),
  "120-F": p("remaining time to remaining distance", "{second} finishes {timeLead} after {first} and runs at {loserSpeed}. How far from the finish was {second} when {first} won?", "Use remaining distance = speed × remaining time."),

  "121-A": p("transitive race lead", "In a {raceDistance} race, {first} beats {second} by {aBeatsBBy} and {second} beats {third} by {bBeatsCBy}. By how much will {first} beat {third}?", "Convert both results to speed ratios and combine them."),
  "121-B": p("A-B-C race comparison", "{first} beats {second} by {aBeatsBBy} in {raceDistance}, while {second} beats {third} by {bBeatsCBy} in the same distance. Find {first}'s winning margin over {third}.", "Multiply the two loser/winner distance fractions."),
  "121-C": p("linked race results", "In separate {raceDistance} races, {first} beats {second} by {aBeatsBBy} and {second} beats {third} by {bBeatsCBy}. If {first} races {third}, what is the winning distance?", "Compose the two pairwise speed ratios."),
  "121-D": p("third runner shortfall", "{first} beats {second} by {aBeatsBBy} and {second} beats {third} by {bBeatsCBy}, each in a {raceDistance} race. When {first} finishes against {third}, how far is {third} from the finish?", "Use successive distance ratios, not addition of leads."),
  "121-E": p("combined race margin", "In races of {raceDistance}, {first} beats {second} by {aBeatsBBy}; {second} beats {third} by {bBeatsCBy}. Find the distance by which {first} beats {third}.", "Combine the two speed ratios multiplicatively."),
  "121-F": p("pairwise results to final lead", "{first} defeats {second} by {aBeatsBBy} in {raceDistance}. Over the same distance, {second} defeats {third} by {bBeatsCBy}. What will be {first}'s lead over {third}?", "Infer third runner's distance when the first runner finishes."),

  "122-A": p("second race with start", "{first} beats {second} by {firstRaceLead} in a {firstRaceDistance} race. In a {secondRaceDistance} race, {second} is given a start of {secondRaceHeadStart}. By how much does {first} win?", "Use race one for the speed ratio, then apply the start in race two."),
  "122-B": p("changed distance with start", "In {firstRaceDistance}, {first} beats {second} by {firstRaceLead}. If they race {secondRaceDistance} and {second} starts {secondRaceHeadStart} ahead, find the result.", "Carry the same speed ratio into the second race and include the starting advantage."),
  "122-C": p("handicapped rematch", "{first} wins a {firstRaceDistance} race over {second} by {firstRaceLead}. In a rematch of {secondRaceDistance}, {second} gets a start of {secondRaceHeadStart}. Find {first}'s winning margin.", "Scale the ordinary lead to the new distance and reduce it by the start."),
  "122-D": p("race result after start", "{first} beats {second} by {firstRaceLead} over {firstRaceDistance}. What will be the winning margin in {secondRaceDistance} if {second} is given a {secondRaceHeadStart} start?", "Use the unchanged speed ratio from the first result."),
  "122-E": p("rematch with distance start", "After losing by {firstRaceLead} in a {firstRaceDistance} race, {second} is given a start of {secondRaceHeadStart} in a {secondRaceDistance} race. How much does {first} win by?", "Find the natural second-race lead and adjust for the start."),
  "122-F": p("two-race handicap", "{first} beats {second} by {firstRaceLead} in {firstRaceDistance}. If {second} receives a {secondRaceHeadStart} start in a {secondRaceDistance} race, find the final distance between them when {first} finishes.", "Use the first race to establish the constant speed ratio."),

  "123-A": p("faster speed increased", "In a {raceDistance} race, {first} runs at {fasterSpeed} and {second} at {slowerSpeed}. If {first}'s speed is increased by {speedIncrease}, by how many metres will {first} win?", "Use the increased speed for the faster runner and recompute the finish state."),
  "123-B": p("slower runner rests", "{first} and {second} run a {raceDistance} race at {fasterSpeed} and {slowerSpeed}. If {second} stops for {restTime} during the race, by how many metres does {first} win?", "The slower runner moves only for the winner's time minus the rest."),
  "123-C": p("faster runner starts late", "In a {raceDistance} race, {second} starts first at {slowerSpeed}. {first}, running at {fasterSpeed}, starts {startDelay} later and still wins. Find the winning margin.", "Include the faster runner's delayed start in the slower runner's elapsed time."),
  "123-D": p("new speed winning margin", "{first}'s speed in a {raceDistance} race is raised from {fasterSpeed} by {speedIncrease}; {second} runs at {slowerSpeed}. Find {first}'s winning distance.", "Compute with the changed faster speed throughout the race."),
  "123-E": p("rest-adjusted margin", "In a {raceDistance} race, {first} runs at {fasterSpeed}. {second} runs at {slowerSpeed} but rests for {restTime}. How far behind is {second} when {first} finishes?", "Subtract the rest from the slower runner's effective running time."),
  "123-F": p("late start and win", "{second} starts a {raceDistance} race at {slowerSpeed}. {first} runs at {fasterSpeed} but starts {startDelay} late. If {first} wins, find the distance margin.", "The slower runner has been moving for the delay plus the winner's running time."),

  "124-A": p("faster speed from two race results", "{first} beats {second} by {firstRaceLead} in a {firstRaceDistance} race and by {secondRaceTimeLead} in a {secondRaceDistance} race. Find {first}'s speed.", "The distance lead gives the speed ratio; the time lead gives the absolute scale."),
  "124-B": p("slower speed from two race results", "{first} beats {second} by {firstRaceLead} in {firstRaceDistance} and by {secondRaceTimeLead} in {secondRaceDistance}. Find {second}'s speed.", "Use the first result for the ratio and the second for the actual speeds."),
  "124-C": p("requested speed from distance and time leads", "In a {firstRaceDistance} race, {first} beats {second} by {firstRaceLead}. In a {secondRaceDistance} race, {first} beats {second} by {secondRaceTimeLead}. Their speeds are unchanged. Find {targetRunner}'s speed.", "Combine the distance-lead ratio with the time-lead equation."),
  "124-D": p("two-result speed determination", "{first} and {second} run at constant speeds. {first} wins {firstRaceDistance} by {firstRaceLead} and {secondRaceDistance} by {secondRaceTimeLead}. Find the speed of {targetRunner}.", "Use both independent race results to determine the absolute speed."),
  "124-E": p("speed from paired race evidence", "{first} beats {second} by {firstRaceLead} over {firstRaceDistance}. Over {secondRaceDistance}, the winning time is {secondRaceTimeLead}. If their speeds remain the same, find {targetRunner}'s speed.", "First obtain the speed ratio, then solve the second race time difference."),
  "124-F": p("constant-speed two-race inference", "The same two runners race twice. {first} wins by {firstRaceLead} in {firstRaceDistance} and by {secondRaceTimeLead} in {secondRaceDistance}. Find {targetRunner}'s speed.", "A distance margin supplies the ratio and a time margin supplies the scale."),
});

export const TSD_CP010_ENGLISH_EXHAUSTIVENESS_PATCH_COUNT = Object.keys(PATCHES).length;

export const TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp010EnglishQl[] = Object.freeze(
  TSD_CP010_ENGLISH_AUTHORING_REGISTRY.map((ql) => Object.freeze({
    ...ql,
    learnerContract: ql.learnerContract,
    families: Object.freeze(ql.families.map((family) => {
      const patch = PATCHES[family.familyId];
      if (!patch) throw new Error(`${family.familyId}: exam-style authoring patch missing`);
      return Object.freeze({ ...family, ...patch });
    })),
  })),
);
