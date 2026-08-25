import { TSD_CP010_ENGLISH_AUTHORING_REGISTRY, type TsdCp010EnglishFamily, type TsdCp010EnglishQl } from "./english-authoring-registry";

const PATCHES: Readonly<Record<string, Readonly<Pick<TsdCp010EnglishFamily, "stem" | "explanationGuide" | "representation">>>> = Object.freeze({
  "117-B": {
    representation: "ratio from time lead",
    stem: "{first} completes a race in {winnerTime}, while {second} finishes {timeLead} later. They cover the same distance at constant speeds. Find the speed ratio {first}:{second}.",
    explanationGuide: "For equal distance, speed is inversely proportional to time. The slower racer's time is winner time plus the stated time lead; reverse the time ratio for the speed ratio.",
  },
  "117-D": {
    representation: "finish-time ratio inversion",
    stem: "In a race over the same course, {first}'s finishing time is {winnerTime}. {second} reaches the finish {timeLead} after {first}. Determine the ratio of their constant speeds, {first}:{second}.",
    explanationGuide: "Build the two finish times first, then use winner speed : loser speed = loser time : winner time because both competitors cover the same race distance.",
  },
  "117-F": {
    representation: "time-margin speed ratio",
    stem: "{first} and {second} start a race together and run at constant speeds. {first} finishes in {winnerTime}, and {second} finishes {timeLead} later. What is their speed ratio {first}:{second}?",
    explanationGuide: "Add the time lead to the winner's time to obtain the loser's time, then invert the two completion times to form the speed ratio.",
  },
  "118-B": {
    representation: "race length from time lead",
    stem: "{first} runs at {winnerSpeed} and {second} at {loserSpeed}. In the same race, {first} reaches the finish {timeLead} before {second}. Find the race length.",
    explanationGuide: "Let the race length be D. The stated time lead equals D/loser speed minus D/winner speed; solve that equation for D.",
  },
  "118-D": {
    representation: "course length from finish-time gap",
    stem: "Two competitors, {first} and {second}, run at constant speeds of {winnerSpeed} and {loserSpeed}. {first} finishes {timeLead} earlier. How long is the race?",
    explanationGuide: "Use the same unknown distance in both completion-time expressions and equate their difference to the recorded time gap.",
  },
  "118-F": {
    representation: "track length from timing margin",
    stem: "On an unknown-length track, {first} maintains {winnerSpeed} and {second} maintains {loserSpeed}. The difference between their finish times is {timeLead}, with {first} finishing first. Determine the track length.",
    explanationGuide: "Set slower time minus faster time equal to the given margin and factor the common unknown track length before solving.",
  },
});

export const TSD_CP010_ENGLISH_EXHAUSTIVENESS_PATCH_COUNT = Object.keys(PATCHES).length;

export const TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp010EnglishQl[] = Object.freeze(
  TSD_CP010_ENGLISH_AUTHORING_REGISTRY.map((ql) => {
    const learnerContract = ql.qlId === "TSD-QL-117"
      ? "Infer the faster-to-slower speed ratio from either a finish-distance lead or a finish-time lead with the winner's completion time supplied."
      : ql.qlId === "TSD-QL-118"
        ? "Recover an unknown race length from two constant speeds and either a finish-distance lead or a finish-time lead."
        : ql.learnerContract;
    return Object.freeze({
      ...ql,
      learnerContract,
      families: Object.freeze(ql.families.map((family) => {
        const patch = PATCHES[family.familyId];
        return patch ? Object.freeze({ ...family, ...patch }) : family;
      })),
    });
  }),
);