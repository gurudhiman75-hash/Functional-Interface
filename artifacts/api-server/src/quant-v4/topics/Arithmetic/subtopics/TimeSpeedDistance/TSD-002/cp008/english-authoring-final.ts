import { TSD_CP008_ENGLISH_AUTHORING_REGISTRY, type TsdCp008EnglishQlSpec } from "./english-authoring-registry";

const stemOverrides: Readonly<Record<string, string>> = Object.freeze({
  "100-A": "A {trainLength} m train moves at {trainSpeed}, while a track inspector walks at {observerSpeed}. The train and inspector move {directionPhrase}. How many seconds will the train take to pass the inspector completely?",
  "100-C": "A {trainLength} m train travels at {trainSpeed}, while a cyclist beside the track moves at {observerSpeed}. They move {directionPhrase}. Find the time taken for the whole train to pass the cyclist.",
  "100-D": "A maintenance worker moves at {observerSpeed} beside the track, while a {trainLength} m train runs at {trainSpeed}. They move {directionPhrase}. From the instant the engine reaches the worker, how long until the rear of the train passes the worker?",
  "100-E": "A runner travels at {observerSpeed} along a service path beside the track. A {trainLength} m train moves at {trainSpeed}. The runner and train move {directionPhrase}. Find the time from the engine passing the runner until the last coach passes.",
  "100-F": "A patrol worker moves at {observerSpeed} beside the railway line, while a {trainLength} m train travels at {trainSpeed}. They move {directionPhrase}. How many seconds are needed for the whole train to pass the worker?",
});

export const TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY: readonly TsdCp008EnglishQlSpec[] = Object.freeze(
  TSD_CP008_ENGLISH_AUTHORING_REGISTRY.map((ql) => Object.freeze({
    ...ql,
    stemFamilies: Object.freeze(ql.stemFamilies.map((family) => Object.freeze({
      ...family,
      stem: stemOverrides[family.familyId] ?? family.stem,
    }))),
  })),
);
