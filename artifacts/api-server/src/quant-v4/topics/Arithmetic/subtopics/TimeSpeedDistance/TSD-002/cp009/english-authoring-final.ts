import { TSD_CP009_ENGLISH_AUTHORING_REGISTRY, type TsdCp009EnglishQl } from "./english-authoring-registry";

/**
 * Final editorial overlay for the CP009 English review candidate.
 *
 * The underlying QL ownership, variables, solve modes, difficulty and explanation
 * guides stay unchanged. Only stems that read more like internal construction
 * language than exam-paper language are polished here.
 */
export const TSD_CP009_ENGLISH_STEM_POLISH: Readonly<Record<string, string>> = Object.freeze({
  "104-D": "A patrol craft can travel at {bodySpeed} in still water. The river current is {mediumSpeed}. If it moves {directionPhrase}, find its speed relative to the bank.",
  "106-F": "A patrol craft moves at {bodySpeed} in still water, while the current speed is {mediumSpeed}. If it travels {directionPhrase} for {time}, find the distance covered.",
  "107-A": "A boat covers {equalDistance} downstream in {assistedTime} and the same distance upstream in {opposedTime}. Find its speed in still water.",
  "108-E": "A mail boat moves at {bodySpeed} in still water through a stream flowing at {mediumSpeed}. It travels {distance} downstream and returns the same distance upstream. Find the total travel time.",
  "109-D": "A survey boat has a still-water speed of {bodySpeed} and the current speed is {mediumSpeed}. Its two-leg journey lasts {totalTime}, including {opposedDistance} upstream. Find the distance covered downstream.",
  "110-B": "A river current flows at {mediumSpeed}. A boat travels for {time} with the current and for the same time against it. By how much does the downstream distance exceed the upstream distance?",
  "110-C": "A swimmer moves with the current for {time} and against it for the same time. If the current speed is {mediumSpeed}, find the difference between the two distances covered.",
  "110-F": "A boat travels along a canal for {time} downstream and for the same time upstream. The flow speed is {mediumSpeed}. How much farther does it travel downstream?",
  "111-C": "Two launches start simultaneously from opposite ends of a {routeDistance} river stretch. Their still-water speeds are {upstreamBodySpeed} and {downstreamBodySpeed}, and the current flows downstream at {mediumSpeed}. How far from the upstream end do they meet?",
  "111-E": "Two rescue boats start simultaneously from opposite ends of a {routeDistance} channel. Their still-water speeds are {upstreamBodySpeed} and {downstreamBodySpeed}. The current flows from the upstream end toward the downstream end at {mediumSpeed}. Find their meeting point measured from the upstream end.",
  "113-E": "A marker buoy is dropped from a boat moving upstream at {bodySpeed} in still water. The current speed is {mediumSpeed}. The boat continues upstream for {separationTime} before turning back. How long after the turn will it meet the buoy?",
  "114-A": "A boat moves at {bodySpeed} in still water. It covers {distance} {directionPhrase} in {firstTime}. After the current changes, it covers the same route in {secondTime}. Find the new current speed.",
});

export const TSD_CP009_FINAL_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp009EnglishQl[] = Object.freeze(
  TSD_CP009_ENGLISH_AUTHORING_REGISTRY.map((ql) =>
    Object.freeze({
      ...ql,
      stemFamilies: Object.freeze(
        ql.stemFamilies.map((family) => {
          const polishedStem = TSD_CP009_ENGLISH_STEM_POLISH[family.familyId];
          return polishedStem === undefined ? family : Object.freeze({ ...family, stem: polishedStem });
        }),
      ),
    }),
  ),
);
