import { multiply, rational, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-final";
import { TSD_CP008_ENGLISH_REVIEW_CASES } from "./english-review-cases";

export interface TsdCp008RenderedEnglishQuestion {
  readonly qlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly familyId: string;
  readonly difficulty: "EASY" | "MEDIUM";
  readonly representation: string;
  readonly scene: string;
  readonly stem: string;
  readonly explanation: string;
  readonly answer: string;
}

const KMH_FAMILIES = new Set([
  "95-A", "95-B", "95-C", "95-D", "95-F",
  "96-A", "96-C",
  "98-A", "98-C", "98-E",
  "99-A", "99-D", "99-F",
  "100-B", "100-E",
  "102-A", "102-B", "102-C", "102-D",
  "103-A", "103-C", "103-F",
]);

function text(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function speed(value: Rational, familyId: string): string {
  if (!KMH_FAMILIES.has(familyId)) return `${text(value)} m/s`;
  const kmh = multiply(value, rational(18, 5));
  if (kmh.denominator !== 1n) throw new Error(`${familyId}: configured km/h speed is not integral`);
  return `${text(kmh)} km/h`;
}

function ratio(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

function answerText(value: Rational, unit: string): string {
  const suffix = unit === "SECOND" ? " seconds" : unit === "METRE" ? " m" : " m/s";
  return `${text(value)}${suffix}`;
}

function trainDirectionPhrase(direction: "OPPOSITE" | "SAME", requireFirstFaster: boolean): string {
  if (direction === "OPPOSITE") return "in opposite directions";
  return requireFirstFaster ? "in the same direction, with the first train faster" : "in the same direction";
}

function observerDirectionPhrase(direction: "OPPOSITE" | "SAME"): string {
  return direction === "OPPOSITE" ? "in opposite directions" : "in the same direction";
}

function observerTarget(familyId: string): string {
  if (familyId === "101-B") return "Find the guard's speed.";
  if (familyId === "101-D") return "Find the worker's speed.";
  if (familyId === "101-F") return "Find the moving person's speed.";
  return "Find the moving observer's speed.";
}

function bindingsFor(familyId: string, input: (typeof TSD_CP008_ENGLISH_REVIEW_CASES)[number]["input"]): Readonly<Record<string, string>> {
  const bindings: Record<string, string> = {};
  switch (input.authorityKey) {
    case "oppositeDirectionTrainCrossingTime":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), speedA: speed(input.speedA, familyId), speedB: speed(input.speedB, familyId) });
      break;
    case "sameDirectionTrainCrossingTime":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), fasterSpeed: speed(input.fasterSpeed, familyId), slowerSpeed: speed(input.slowerSpeed, familyId) });
      break;
    case "relativeSpeedFromTrainCrossing":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), crossingTime: text(input.crossingTime) });
      break;
    case "trainLengthFromTrainCrossingEvidence":
      Object.assign(bindings, { knownLength: text(input.knownLength), speedA: speed(input.speedA, familyId), speedB: speed(input.speedB, familyId), crossingTime: text(input.crossingTime), directionPhrase: trainDirectionPhrase(input.direction, false) });
      break;
    case "trainSpeedFromTrainCrossingEvidence":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), otherSpeed: speed(input.otherSpeed, familyId), crossingTime: text(input.crossingTime), directionPhrase: trainDirectionPhrase(input.direction, true) });
      break;
    case "movingObserverTrainCrossingTime":
      Object.assign(bindings, { trainLength: text(input.trainLength), trainSpeed: speed(input.trainSpeed, familyId), observerSpeed: speed(input.observerSpeed, familyId), directionPhrase: observerDirectionPhrase(input.direction) });
      break;
    case "trainObserverStateFromCrossingTimes":
      Object.assign(bindings, { trainLength: text(input.trainLength), sameTime: text(input.sameDirectionTime), oppositeTime: text(input.oppositeDirectionTime), targetQuestion: input.target === "TRAIN_SPEED" ? "Find the train's speed." : observerTarget(familyId) });
      break;
    case "sharedFixedObjectTwoTrainEvidence": {
      const familyLetter = familyId.split("-")[1] ?? "A";
      const objectName = ["B", "D", "F"].includes(familyLetter) ? "railway bridge" : "station platform";
      Object.assign(bindings, {
        ratio: ratio(input.lengthRatioAtoB),
        speedA: speed(input.speedA, familyId),
        speedB: speed(input.speedB, familyId),
        timeA: text(input.crossingTimeA),
        timeB: text(input.crossingTimeB),
        objectName,
        targetQuestion: input.target === "FIXED_OBJECT_LENGTH" ? `Find the length of the ${objectName}.` : "Find the length of the first train.",
      });
      break;
    }
    case "fullContainmentOverlapDuration":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), speedA: speed(input.speedA, familyId), speedB: speed(input.speedB, familyId), directionPhrase: trainDirectionPhrase(input.direction, false) });
      break;
  }
  return Object.freeze(bindings);
}

function render(template: string, bindings: Readonly<Record<string, string>>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = bindings[key];
    if (value === undefined) throw new Error(`${key}: CP008 English review binding missing`);
    return value;
  });
}

const cases = new Map(TSD_CP008_ENGLISH_REVIEW_CASES.map((entry) => [entry.familyId, entry] as const));
const rendered: TsdCp008RenderedEnglishQuestion[] = [];

for (const ql of TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY) {
  for (const family of ql.stemFamilies) {
    const reviewCase = cases.get(family.familyId);
    if (!reviewCase) throw new Error(`${family.familyId}: natural review case missing`);
    if (reviewCase.qlId !== ql.qlId || reviewCase.input.authorityKey !== ql.authorityKey) throw new Error(`${family.familyId}: review case authority/QL mismatch`);
    const bindings = bindingsFor(family.familyId, reviewCase.input);
    rendered.push(Object.freeze({
      qlId: ql.qlId,
      authorityKey: ql.authorityKey,
      familyId: family.familyId,
      difficulty: family.difficulty,
      representation: family.representation,
      scene: family.scene,
      stem: render(family.stem, bindings),
      explanation: `${render(family.explanationGuide, bindings)} Therefore, the answer is ${answerText(reviewCase.solution.value, reviewCase.solution.unit)}.`,
      answer: answerText(reviewCase.solution.value, reviewCase.solution.unit),
    }));
  }
}

if (rendered.length !== 54) throw new Error(`Expected 54 CP008 rendered English questions, got ${rendered.length}`);
export const TSD_CP008_RENDERED_ENGLISH_QUESTIONS: readonly TsdCp008RenderedEnglishQuestion[] = Object.freeze(rendered);
