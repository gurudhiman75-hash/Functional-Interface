import { divide, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-effective";
import { generateCp007ExecutableCase } from "./executable-generator";
import type { TsdCp007ExecutableGeneratedCase } from "./executable-types";

export interface TsdCp007RenderedEnglishSample {
  readonly familyId: string;
  readonly qlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly difficulty: string;
  readonly representation: string;
  readonly scene: string;
  readonly seed: string;
  readonly stem: string;
  readonly explanation: string;
  readonly answer: string;
  readonly unresolvedPlaceholders: readonly string[];
}

const KMH_INPUT_FAMILIES = new Set(["84-D", "84-F", "85-D", "85-F", "86-D", "86-F", "88-E"]);
const KMH_ANSWER_FAMILIES = new Set(["87-D", "87-F", "90-E"]);

function rationalText(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return `${value.numerator}/${value.denominator}`;
}

function clockText(value: Rational): string {
  const seconds = Number(value.numerator) / Number(value.denominator);
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondValue = seconds % 60;
  const secondText = Number.isInteger(secondValue) ? String(secondValue).padStart(2, "0") : secondValue.toFixed(2).padStart(5, "0");
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${secondText}`;
}

function answerText(familyId: string, generated: TsdCp007ExecutableGeneratedCase): string {
  const solution = generated.solution;
  if (solution.answerKind === "COUNT") return `${solution.count ?? 0n}`;
  if (!solution.value) throw new Error(`${generated.seed}: value solution is missing`);
  if (solution.unit === "CLOCK_SECOND") return clockText(solution.value);
  if (solution.unit === "METRE_PER_SECOND" && KMH_ANSWER_FAMILIES.has(familyId)) {
    return `${rationalText(multiply(solution.value, rational(18, 5)))} km/h`;
  }
  const unit = {
    SECOND: "s",
    METRE: "m",
    METRE_PER_SECOND: "m/s",
    CLOCK_SECOND: "clock time",
    COUNT: "",
  }[solution.unit];
  return `${rationalText(solution.value)} ${unit}`.trim();
}

function targetLabel(generated: TsdCp007ExecutableGeneratedCase): string {
  switch (generated.authorityKey) {
    case "fixedPointCrossingTime": return "point-crossing time";
    case "finiteFixedObjectCrossingTime": return "complete crossing time";
    case "trainLengthFromPointCrossing": return "train length";
    case "trainSpeedFromPointCrossing": return "train speed";
    case "fixedObjectLengthFromCrossingEvidence": return "fixed-object length";
    case "trainLengthFromPointAndObjectTimes": return "train length";
    case "trainSpeedFromPointAndObjectTimes": return "train speed";
    case "fixedObjectLengthDifferenceFromCrossingTimes": return "fixed-object length difference";
    case "fullOccupancyDuration": return generated.input.occupancyTarget === "OBJECT_LENGTH" ? "fixed-object length" : "full-occupancy duration";
    case "trainCrossingEventTimeline": return "missing event time";
    case "fixedSpacingPointCount": {
      if (generated.input.spacingTarget === "SPACING") return "spacing";
      if (generated.input.spacingTarget === "SPEED") return "train speed";
      return "point count";
    }
  }
}

function seedNumberForFamily(familyId: string): number {
  const special: Readonly<Record<string, number>> = Object.freeze({
    "84-D": 6,
    "84-F": 8,
    "85-D": 6,
    "85-F": 8,
    "86-D": 6,
    "86-F": 8,
    "87-D": 3,
    "87-F": 8,
    "88-A": 1, "88-B": 3, "88-C": 2, "88-D": 4, "88-E": 5, "88-F": 6,
    "90-E": 3,
    "92-A": 1, "92-B": 3, "92-C": 5, "92-D": 2, "92-E": 4, "92-F": 7,
    "93-A": 5, "93-B": 2, "93-C": 1, "93-D": 3, "93-E": 6, "93-F": 8,
    "94-A": 4, "94-B": 1, "94-C": 2, "94-D": 3, "94-E": 7, "94-F": 6,
  });
  if (special[familyId]) return special[familyId]!;
  const [qlPart, letter] = familyId.split("-");
  const qlNumber = Number(qlPart);
  const familyIndex = letter ? letter.charCodeAt(0) - "A".charCodeAt(0) : 0;
  if (!Number.isInteger(qlNumber) || familyIndex < 0) throw new Error(`${familyId}: invalid family ID for deterministic seed selection`);
  return ((qlNumber + familyIndex * 2) % 12) + 1;
}

function timelineEventBindings(generated: TsdCp007ExecutableGeneratedCase): { knownEvent: string; targetEvent: string } {
  const kind = generated.input.timelineIntervalKind;
  const direction = generated.input.timelineTarget;
  const pair = kind === "POINT_CROSSING"
    ? ["the engine passes the fixed marker", "the rear passes the same marker"] as const
    : kind === "FULL_CROSSING"
      ? ["the front enters the fixed section", "the rear leaves the far end"] as const
      : ["the rear enters the fixed section", "the front leaves the far end"] as const;
  return direction === "FORWARD_CLOCK"
    ? { knownEvent: pair[0], targetEvent: pair[1] }
    : { knownEvent: pair[1], targetEvent: pair[0] };
}

function endpointConvention(familyId: string, includeStart: boolean): string {
  if (familyId === "94-C") return includeStart ? "included in the count" : "excluded from the count";
  if (familyId === "94-D") return includeStart ? "the starting post included" : "the starting post excluded";
  if (familyId === "94-E") return includeStart ? "the starting pole is included" : "the starting pole is excluded";
  if (familyId === "94-F") return includeStart ? "the starting pillar included" : "the starting pillar excluded";
  return includeStart ? "including the starting point" : "excluding the starting point";
}

function bindingsFor(familyId: string, generated: TsdCp007ExecutableGeneratedCase): Readonly<Record<string, string>> {
  const input = generated.input;
  const bindings: Record<string, string> = {};
  if (input.trainLength) bindings.trainLength = rationalText(input.trainLength);
  if (input.speed) {
    bindings.speed = KMH_INPUT_FAMILIES.has(familyId)
      ? `${rationalText(multiply(input.speed, rational(18, 5)))} km/h`
      : `${rationalText(input.speed)} m/s`;
  }
  if (input.fixedObjectLength) bindings.objectLength = rationalText(input.fixedObjectLength);
  if (input.pointCrossingTime) bindings.pointTime = rationalText(input.pointCrossingTime);
  if (input.fixedObjectCrossingTime) {
    bindings.crossingTime = rationalText(input.fixedObjectCrossingTime);
    bindings.timeA = rationalText(input.fixedObjectCrossingTime);
  }
  if (input.secondFixedObjectCrossingTime) bindings.timeB = rationalText(input.secondFixedObjectCrossingTime);
  if (input.occupancyDuration) bindings.occupancyTime = rationalText(input.occupancyDuration);
  if (input.knownClockSecond) bindings.clockTime = clockText(input.knownClockSecond);
  if (input.distanceWindow) bindings.distance = rationalText(input.distanceWindow);
  if (input.spacing) bindings.spacing = rationalText(input.spacing);
  if (input.timeWindow) bindings.timeWindow = rationalText(input.timeWindow);
  if (input.observedPointCount !== undefined) bindings.pointCount = input.observedPointCount.toString();
  if (input.includeStartingPoint !== undefined) bindings.endpointConvention = endpointConvention(familyId, input.includeStartingPoint);

  if (familyId === "85-E") {
    if (!input.fixedObjectLength) throw new Error(`${familyId}: combined-section sample needs fixedObjectLength`);
    const first = divide(input.fixedObjectLength, rational(3));
    const second = subtract(input.fixedObjectLength, first);
    bindings.objectPartA = rationalText(first);
    bindings.objectPartB = rationalText(second);
  }

  if (familyId === "93-F") Object.assign(bindings, timelineEventBindings(generated));
  return Object.freeze(bindings);
}

function render(template: string, bindings: Readonly<Record<string, string>>): { text: string; unresolved: readonly string[] } {
  const unresolved = new Set<string>();
  const text = template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const replacement = bindings[key];
    if (replacement === undefined) {
      unresolved.add(key);
      return `{${key}}`;
    }
    return replacement;
  });
  return { text, unresolved: Object.freeze([...unresolved]) };
}

function givenSummary(stemTemplate: string, bindings: Readonly<Record<string, string>>): string {
  const labels: Readonly<Record<string, string>> = Object.freeze({
    trainLength: "train length",
    speed: "speed",
    objectLength: "fixed-object length",
    pointTime: "point-crossing time",
    crossingTime: "full-crossing time",
    timeA: "first crossing time",
    timeB: "second crossing time",
    occupancyTime: "full-occupancy time",
    clockTime: "known clock time",
    distance: "travelled distance",
    spacing: "spacing",
    timeWindow: "time window",
    pointCount: "observed point count",
    objectPartA: "first fixed portion",
    objectPartB: "second fixed portion",
    endpointConvention: "counting rule",
    knownEvent: "known event",
    targetEvent: "target event",
  });
  const orderedKeys = [...new Set([...stemTemplate.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!))];
  const parts = orderedKeys.filter((key) => bindings[key] !== undefined).map((key) => `${labels[key] ?? key} = ${bindings[key]}`);
  return `Given in this question: ${parts.join("; ")}.`;
}

export function renderCp007EnglishReviewSamples(): readonly TsdCp007RenderedEnglishSample[] {
  const samples: TsdCp007RenderedEnglishSample[] = [];
  for (const ql of TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY) {
    for (const family of ql.stemFamilies) {
      const seedNumber = seedNumberForFamily(family.familyId);
      const seed = `cp007:${ql.authorityKey}:${seedNumber}`;
      const generated = generateCp007ExecutableCase(ql.authorityKey, seed);
      const bindings = bindingsFor(family.familyId, generated);
      const renderedStem = render(family.stem, bindings);
      const renderedGuide = render(family.explanationGuide, bindings);
      const unresolved = Object.freeze([...new Set([...renderedStem.unresolved, ...renderedGuide.unresolved])]);
      const answer = answerText(family.familyId, generated);
      const explanation = `${givenSummary(family.stem, bindings)} ${renderedGuide.text} Therefore, the ${targetLabel(generated)} is ${answer}.`;
      samples.push(Object.freeze({
        familyId: family.familyId,
        qlId: ql.qlId,
        authorityKey: ql.authorityKey,
        difficulty: family.difficulty,
        representation: family.representation,
        scene: family.scene,
        seed,
        stem: renderedStem.text,
        explanation,
        answer,
        unresolvedPlaceholders: unresolved,
      }));
    }
  }
  return Object.freeze(samples);
}
