const MOTOR_OBJECTS = Object.freeze([
  "car",
  "bus",
  "delivery van",
  "taxi",
  "school van",
  "shuttle bus",
  "courier van",
  "service vehicle",
  "tourist coach",
  "jeep",
  "minibus",
  "office cab",
  "parcel van",
  "utility vehicle",
  "staff bus",
  "rural bus",
  "airport shuttle",
  "company van",
]);

const RUNNING_OBJECTS = Object.freeze([
  "runner",
  "jogger",
  "athlete",
  "trainee runner",
  "distance runner",
  "club runner",
  "fitness runner",
  "student runner",
]);

const CYCLING_OBJECTS = Object.freeze([
  "cyclist",
  "commuter cyclist",
  "delivery cyclist",
  "road cyclist",
  "student cyclist",
  "club cyclist",
]);

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function poolForMode(solveMode: string, stem: string): readonly string[] {
  if (solveMode === "averagePaceFromSegments" || solveMode === "speedFromPace" || solveMode === "paceFromSpeed") {
    return RUNNING_OBJECTS;
  }
  if (/\bcyclist\b/i.test(stem) && !/\b(?:car|bus|van|vehicle|truck)\b/i.test(stem)) {
    return CYCLING_OBJECTS;
  }
  return MOTOR_OBJECTS;
}

const ACTOR_PATTERN = /\b(?:a|an)\s+(?:car|bus|van|truck|vehicle|rider|motorcyclist|cyclist|commuter|courier|traveller|runner|jogger|athlete)\b/i;

function replaceActor(text: string, replacement: string): string {
  return text.replace(ACTOR_PATTERN, `a ${replacement}`);
}

export function contextualizeLearnerStem(
  stem: string,
  stemMathJax: string,
  solveMode: string,
  seed: string,
): { readonly stem: string; readonly stemMathJax: string; readonly object: string } {
  if (!ACTOR_PATTERN.test(stem)) {
    return Object.freeze({ stem, stemMathJax, object: "unchanged" });
  }
  const pool = poolForMode(solveMode, stem);
  const object = pool[hashText(`${solveMode}|${seed}|${stem}`) % pool.length];
  return Object.freeze({
    stem: replaceActor(stem, object),
    stemMathJax: replaceActor(stemMathJax, object),
    object,
  });
}

export const TSD_CONTEXT_OBJECT_POOL = Object.freeze({
  motor: MOTOR_OBJECTS,
  running: RUNNING_OBJECTS,
  cycling: CYCLING_OBJECTS,
});
