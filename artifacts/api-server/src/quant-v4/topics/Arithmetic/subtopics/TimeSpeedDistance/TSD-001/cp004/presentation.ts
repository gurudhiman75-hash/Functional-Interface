import { absRational, add, compare, divide, multiply, rational, subtract, toCanonicalString, type Rational } from "../foundation/rational";
import { TSD_CP004_AUTHORITIES } from "./authority";
import { formatCp004Value } from "./solver";
import type { TsdCp004CanonicalState, TsdCp004Difficulty, TsdCp004Explanation, TsdCp004MisconceptionId, TsdCp004OptionAudit, TsdCp004SolveCertificate, TsdCp004Visual } from "./types";

const SIXTY = rational(60);

export interface Cp004ActorLexeme {
  readonly singular: string;
  readonly plural: string;
}

export const CP004_ENGLISH_ACTORS = Object.freeze({
  RUNNER: { singular: "runner", plural: "runners" },
  CYCLIST: { singular: "cyclist", plural: "cyclists" },
  CAR: { singular: "car", plural: "cars" },
  BUS: { singular: "bus", plural: "buses" },
  SCOOTER: { singular: "scooter", plural: "scooters" },
  DELIVERY_VAN: { singular: "delivery van", plural: "delivery vans" },
} satisfies Record<string, Cp004ActorLexeme>);

function n(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const scaled10 = value.numerator * 10n;
  if (scaled10 % value.denominator === 0n) return (Number(scaled10 / value.denominator) / 10).toString();
  const scaled100 = value.numerator * 100n;
  if (scaled100 % value.denominator === 0n) return (Number(scaled100 / value.denominator) / 100).toString();
  const sign = value.numerator < 0n ? "-" : "";
  const raw = value.numerator < 0n ? -value.numerator : value.numerator;
  const whole = raw / value.denominator;
  const rem = raw % value.denominator;
  if (whole === 0n) return `${sign}${rem}/${value.denominator}`;
  return `${sign}${whole} ${rem}/${value.denominator}`;
}

function hours(minutes: Rational): Rational {
  return divide(minutes, SIXTY);
}

function km(speed: Rational, minutes: Rational): Rational {
  return multiply(speed, hours(minutes));
}

function actorLabel(state: TsdCp004CanonicalState, letter: "A" | "B" | "C"): string {
  const noun = CP004_ENGLISH_ACTORS[state.actorKind].singular;
  return `${noun[0].toUpperCase()}${noun.slice(1)} ${letter}`;
}

function lowerActor(state: TsdCp004CanonicalState): string {
  return CP004_ENGLISH_ACTORS[state.actorKind].singular;
}

export function renderCp004EnglishStem(state: TsdCp004CanonicalState): string {
  const A = actorLabel(state, "A");
  const B = actorLabel(state, "B");
  const C = actorLabel(state, "C");
  const a = n(state.speedAKmph);
  const b = n(state.speedBKmph);
  const c = n(state.speedCKmph);
  const gap = n(state.initialGapKm);
  const t = n(state.elapsedMinutes);
  const delay = n(state.startDelayMinutes);
  const target = n(state.targetSeparationKm);
  const route = n(state.routeLengthKm);
  const point = n(state.meetingFromAKm);
  const deadline = n(state.deadlineMinutes);
  const extraGap = n(state.extraGapCKm);
  const noun = lowerActor(state);

  switch (state.authorityId) {
    case "RELATIVE_SPEED_OPPOSITE":
      return state.variant === 0
        ? `${A} and ${B} move towards each other on the same straight road at ${a} km/h and ${b} km/h. What is their closing speed?`
        : state.variant === 1
          ? `Two ${CP004_ENGLISH_ACTORS[state.actorKind].plural} approach one another at ${a} km/h and ${b} km/h. At what rate does the distance between them decrease?`
          : `If ${A} travels east at ${a} km/h while ${B} travels west towards it at ${b} km/h, what is their relative speed?`;
    case "RELATIVE_SPEED_SAME_DIRECTION":
      return state.variant === 0
        ? `${A} and ${B} move in the same direction at ${a} km/h and ${b} km/h respectively, with ${A} faster. What is ${A}'s closing speed relative to ${B}?`
        : state.variant === 1
          ? `${B} is ahead on a straight road and moves at ${b} km/h. ${A} follows in the same direction at ${a} km/h. At what rate is the gap closing?`
          : `If two ${CP004_ENGLISH_ACTORS[state.actorKind].plural} travel in the same direction at ${a} km/h and ${b} km/h, what is the relative speed of the faster one with respect to the slower one?`;
    case "FIRST_MEETING_TIME":
      if (state.directionCase === "OPPOSITE_TOWARD") {
        return state.variant === 0
          ? `${A} and ${B} are ${gap} km apart and start at the same time towards each other at ${a} km/h and ${b} km/h. After how many minutes will they meet for the first time?`
          : `Two ${CP004_ENGLISH_ACTORS[state.actorKind].plural} start simultaneously from points ${gap} km apart and move towards each other at ${a} km/h and ${b} km/h. Find the first meeting time.`;
      }
      return `${B} is ${gap} km ahead of ${A}. Both move in the same direction at ${b} km/h and ${a} km/h respectively. If they start at the same time, after how many minutes will ${A} catch ${B}?`;
    case "INITIAL_GAP_FROM_MEETING":
      return state.directionCase === "OPPOSITE_TOWARD"
        ? `${A} and ${B} start at the same time towards each other at ${a} km/h and ${b} km/h and meet after ${t} minutes. How far apart were their starting points?`
        : `${A} moves at ${a} km/h behind ${B}, which moves in the same direction at ${b} km/h. If ${A} catches ${B} after ${t} minutes, what was their initial separation?`;
    case "UNKNOWN_SPEED_FROM_MEETING":
      return state.directionCase === "OPPOSITE_TOWARD"
        ? `${A} and ${B} start ${gap} km apart and move towards each other. ${B} travels at ${b} km/h, and they meet after ${t} minutes. What is ${A}'s speed?`
        : `${B} is ${gap} km ahead and moves at ${b} km/h. ${A} starts at the same time from behind and catches ${B} after ${t} minutes. What is ${A}'s speed?`;
    case "HEAD_START_CATCH_UP_TIME":
      return `${B} has a head start of ${gap} km and moves at ${b} km/h. ${A} follows in the same direction at ${a} km/h. How many minutes will ${A} take to catch ${B}?`;
    case "HEAD_START_DISTANCE":
      return `${A} moves at ${a} km/h and ${B} at ${b} km/h in the same direction. If ${A} catches ${B} after ${t} minutes, how many kilometres ahead was ${B} initially?`;
    case "DELAYED_START_CATCH_UP_TIME":
      return `${B} starts first at ${b} km/h. ${A} starts from the same point ${delay} minutes later and follows at ${a} km/h. After ${A} starts, how many minutes will it take to catch ${B}?`;
    case "START_DELAY_FROM_CATCH_UP":
      return `${B} moves at ${b} km/h and starts before ${A}. ${A} later follows from the same point at ${a} km/h and catches ${B} after chasing for ${t} minutes. How many minutes earlier did ${B} start?`;
    case "SEPARATION_AFTER_TIME":
      if (state.directionCase === "OPPOSITE_AWAY") return `${A} and ${B} are initially ${gap} km apart and move away from each other in opposite directions at ${a} km/h and ${b} km/h. What will their separation be after ${t} minutes?`;
      if (state.directionCase === "SAME_DIRECTION") return `${A} is initially ${gap} km ahead of ${B}; both move in the same direction at ${a} km/h and ${b} km/h, with ${A} faster. What will be the gap after ${t} minutes?`;
      return `${A} and ${B} are ${gap} km apart and move towards each other at ${a} km/h and ${b} km/h. Before they meet, what will their separation be after ${t} minutes?`;
    case "TIME_TO_SPECIFIED_SEPARATION":
      if (state.directionCase === "OPPOSITE_AWAY") return `${A} and ${B} are initially ${gap} km apart and move away from each other at ${a} km/h and ${b} km/h. After how many minutes will they be ${target} km apart?`;
      if (state.directionCase === "SAME_DIRECTION") return `${A} is ${gap} km ahead of ${B}, and both move in the same direction at ${a} km/h and ${b} km/h, with ${A} faster. After how many minutes will the gap become ${target} km?`;
      return `${A} and ${B} are ${gap} km apart and move towards each other at ${a} km/h and ${b} km/h. After how many minutes will the remaining separation be ${target} km?`;
    case "MEETING_POINT_DISTANCE_SPLIT":
      return `${A} and ${B} start simultaneously from opposite ends of a ${route} km route and move towards each other at ${a} km/h and ${b} km/h. How far from ${A}'s starting point do they meet?`;
    case "SPEED_RATIO_FROM_MEETING_POINT":
      return `${A} and ${B} start simultaneously from opposite ends of a ${route} km route and meet at a point ${point} km from ${A}'s end. What is the ratio of their speeds, ${A}:${B}?`;
    case "MEETING_POINT_FROM_SPEED_RATIO":
      return `Two ${CP004_ENGLISH_ACTORS[state.actorKind].plural} start simultaneously from opposite ends of a ${route} km route. If their speeds are in the ratio ${state.ratioA}:${state.ratioB}, how far from the first ${noun}'s starting point will they meet?`;
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE":
      return state.directionCase === "OPPOSITE_TOWARD"
        ? `${A} and ${B} are ${gap} km apart and move towards each other. ${B} travels at ${b} km/h. If they must meet within ${deadline} minutes, what speed must ${A} maintain?`
        : `${B} is ${gap} km ahead and moves at ${b} km/h. If ${A} must catch ${B} within ${deadline} minutes while moving in the same direction, what speed must ${A} maintain?`;
    case "MULTI_PURSUER_MEETING_ORDER":
      return `${B} moves along a straight road at ${b} km/h. ${A}, moving at ${a} km/h, is ${gap} km behind ${B}; ${C}, moving at ${c} km/h, is ${extraGap} km behind ${B}. If all three continue at constant speeds in the same direction, which pursuer catches ${B} first?`;
  }
}

function numericCandidate(value: Rational, misconceptionId: TsdCp004MisconceptionId): { value: Rational; misconceptionId: TsdCp004MisconceptionId } {
  return { value, misconceptionId };
}

function numericWrongCandidates(state: TsdCp004CanonicalState, solution: TsdCp004SolveCertificate): { value: Rational; misconceptionId: TsdCp004MisconceptionId }[] {
  const sum = add(state.speedAKmph, state.speedBKmph);
  const diff = absRational(subtract(state.speedAKmph, state.speedBKmph));
  const answer = solution.answerValue ?? rational(1);
  const result: { value: Rational; misconceptionId: TsdCp004MisconceptionId }[] = [];
  const push = (value: Rational, misconceptionId: TsdCp004MisconceptionId) => result.push(numericCandidate(value, misconceptionId));

  switch (state.authorityId) {
    case "RELATIVE_SPEED_OPPOSITE":
      push(diff, "SUBTRACT_INSTEAD_OF_ADD_RELATIVE_SPEED");
      push(state.speedAKmph, "USE_ONE_BODY_SPEED");
      push(state.speedBKmph, "USE_ONE_BODY_SPEED");
      break;
    case "RELATIVE_SPEED_SAME_DIRECTION":
      push(sum, "ADD_INSTEAD_OF_SUBTRACT_RELATIVE_SPEED");
      push(state.speedAKmph, "USE_ONE_BODY_SPEED");
      push(state.speedBKmph, "USE_ONE_BODY_SPEED");
      break;
    case "FIRST_MEETING_TIME":
      push(multiply(divide(state.initialGapKm, state.speedAKmph), SIXTY), "USE_ONE_BODY_SPEED");
      push(multiply(divide(state.initialGapKm, state.speedBKmph), SIXTY), "USE_ONE_BODY_SPEED");
      push(multiply(answer, rational(2)), "DOUBLE_CLOSING_TIME");
      break;
    case "INITIAL_GAP_FROM_MEETING":
      push(km(state.speedAKmph, state.elapsedMinutes), "USE_ONE_BODY_SPEED");
      push(km(state.speedBKmph, state.elapsedMinutes), "USE_ONE_BODY_SPEED");
      push(km(state.directionCase === "OPPOSITE_TOWARD" ? diff : sum, state.elapsedMinutes), state.directionCase === "OPPOSITE_TOWARD" ? "SUBTRACT_INSTEAD_OF_ADD_RELATIVE_SPEED" : "ADD_INSTEAD_OF_SUBTRACT_RELATIVE_SPEED");
      break;
    case "UNKNOWN_SPEED_FROM_MEETING": {
      const recoveredClosing = divide(state.initialGapKm, hours(state.elapsedMinutes));
      push(recoveredClosing, "USE_TARGET_SPEED_AS_REQUIRED_SPEED");
      push(state.speedBKmph, "USE_ONE_BODY_SPEED");
      push(divide(add(state.speedAKmph, state.speedBKmph), rational(2)), "USE_ARITHMETIC_MEAN_SPEED");
      break;
    }
    case "HEAD_START_CATCH_UP_TIME":
      push(multiply(divide(state.initialGapKm, sum), SIXTY), "USE_SUM_FOR_PURSUIT");
      push(multiply(divide(state.initialGapKm, state.speedAKmph), SIXTY), "USE_ONE_BODY_SPEED");
      push(multiply(divide(state.initialGapKm, state.speedBKmph), SIXTY), "USE_ONE_BODY_SPEED");
      break;
    case "HEAD_START_DISTANCE":
      push(km(state.speedAKmph, state.elapsedMinutes), "USE_ONE_BODY_SPEED");
      push(km(state.speedBKmph, state.elapsedMinutes), "USE_ONE_BODY_SPEED");
      push(km(sum, state.elapsedMinutes), "USE_SUM_FOR_PURSUIT");
      break;
    case "DELAYED_START_CATCH_UP_TIME": {
      const lead = km(state.speedBKmph, state.startDelayMinutes);
      push(state.startDelayMinutes, "TREAT_DELAY_AS_CHASE_TIME");
      push(add(answer, state.startDelayMinutes), "IGNORE_START_DELAY");
      push(multiply(divide(lead, sum), SIXTY), "USE_SUM_FOR_PURSUIT");
      break;
    }
    case "START_DELAY_FROM_CATCH_UP":
      push(state.elapsedMinutes, "TREAT_DELAY_AS_CHASE_TIME");
      push(add(state.elapsedMinutes, answer), "IGNORE_START_DELAY");
      push(divide(answer, rational(2)), "HALVE_CLOSING_TIME");
      break;
    case "SEPARATION_AFTER_TIME": {
      const relative = state.directionCase === "SAME_DIRECTION" ? diff : sum;
      push(km(relative, state.elapsedMinutes), "IGNORE_INITIAL_GAP");
      push(km(state.speedAKmph, state.elapsedMinutes), "USE_ONE_BODY_SPEED");
      push(km(state.speedBKmph, state.elapsedMinutes), "USE_ONE_BODY_SPEED");
      break;
    }
    case "TIME_TO_SPECIFIED_SEPARATION": {
      const relative = state.directionCase === "SAME_DIRECTION" ? diff : sum;
      push(multiply(divide(state.targetSeparationKm, relative), SIXTY), "IGNORE_INITIAL_GAP");
      push(multiply(divide(state.initialGapKm, relative), SIXTY), "IGNORE_TARGET_SEPARATION");
      push(multiply(answer, rational(2)), "DOUBLE_CLOSING_TIME");
      break;
    }
    case "MEETING_POINT_DISTANCE_SPLIT":
      push(subtract(state.routeLengthKm, answer), "REVERSE_MEETING_DISTANCE_SHARE");
      push(divide(state.routeLengthKm, rational(2)), "USE_ARITHMETIC_MEAN_SPEED");
      push(multiply(state.routeLengthKm, divide(state.speedAKmph, state.speedBKmph)), "USE_TOTAL_SPEED_AS_DISTANCE_SHARE");
      break;
    case "MEETING_POINT_FROM_SPEED_RATIO":
      push(subtract(state.routeLengthKm, answer), "REVERSE_MEETING_DISTANCE_SHARE");
      push(divide(state.routeLengthKm, rational(2)), "USE_ARITHMETIC_MEAN_SPEED");
      push(multiply(state.routeLengthKm, divide(rational(state.ratioA), rational(state.ratioB))), "USE_TOTAL_SPEED_AS_DISTANCE_SHARE");
      break;
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE": {
      const closing = divide(state.initialGapKm, hours(state.deadlineMinutes));
      push(closing, "USE_TARGET_SPEED_AS_REQUIRED_SPEED");
      push(state.speedBKmph, "USE_ONE_BODY_SPEED");
      push(state.directionCase === "OPPOSITE_TOWARD" ? add(closing, state.speedBKmph) : subtract(closing, state.speedBKmph), state.directionCase === "OPPOSITE_TOWARD" ? "ADD_INSTEAD_OF_SUBTRACT_RELATIVE_SPEED" : "SUBTRACT_INSTEAD_OF_ADD_RELATIVE_SPEED");
      break;
    }
    default:
      break;
  }

  return result;
}

function positive(value: Rational): boolean {
  return compare(value, rational(0)) > 0;
}

function buildNumericOptions(state: TsdCp004CanonicalState, solution: TsdCp004SolveCertificate, seed: string): readonly TsdCp004OptionAudit[] {
  if (!solution.answerValue || !["SPEED", "TIME", "DISTANCE"].includes(solution.answerKind)) throw new Error("Numeric option builder requires numeric answer");
  const candidates = numericWrongCandidates(state, solution);
  const seen = new Set<string>([toCanonicalString(solution.answerValue)]);
  const wrong: { value: Rational; misconceptionId: TsdCp004MisconceptionId }[] = [];
  for (const candidate of candidates) {
    const key = toCanonicalString(candidate.value);
    if (!positive(candidate.value) || seen.has(key)) continue;
    seen.add(key);
    wrong.push(candidate);
    if (wrong.length === 3) break;
  }
  const fallbacks = [
    { value: multiply(solution.answerValue, rational(2)), misconceptionId: "DOUBLE_CLOSING_TIME" as const },
    { value: divide(solution.answerValue, rational(2)), misconceptionId: "HALVE_CLOSING_TIME" as const },
    { value: multiply(solution.answerValue, rational(3, 2)), misconceptionId: "ADD_TARGET_SEPARATION_WRONG_WAY" as const },
    { value: multiply(solution.answerValue, rational(2, 3)), misconceptionId: "IGNORE_TARGET_SEPARATION" as const },
  ];
  for (const candidate of fallbacks) {
    if (wrong.length === 3) break;
    const key = toCanonicalString(candidate.value);
    if (!positive(candidate.value) || seen.has(key)) continue;
    seen.add(key);
    wrong.push(candidate);
  }
  if (wrong.length !== 3) throw new Error(`Unable to build three unique CP004 distractors for ${state.authorityId}`);
  const kind = solution.answerKind as "SPEED" | "TIME" | "DISTANCE";
  const correct: TsdCp004OptionAudit = Object.freeze({ text: solution.answerText, misconceptionId: "CORRECT", isCorrect: true });
  const wrongAudits = wrong.map((item) => Object.freeze({ text: formatCp004Value(kind, item.value), misconceptionId: item.misconceptionId, isCorrect: false }));
  const slot = hashForSlot(`${state.authorityId}|${seed}`) % 4;
  const options: TsdCp004OptionAudit[] = [];
  let wi = 0;
  for (let i = 0; i < 4; i += 1) {
    if (i === slot) options.push(correct);
    else options.push(wrongAudits[wi++]);
  }
  return Object.freeze(options);
}

function ratioKey(a: bigint, b: bigint): string {
  return `${a}:${b}`;
}

function buildRatioOptions(solution: TsdCp004SolveCertificate, seed: string): readonly TsdCp004OptionAudit[] {
  if (!solution.answerRatio) throw new Error("Ratio answer missing");
  const [a, b] = solution.answerRatio;
  const raw = [
    { text: ratioKey(a, b), misconceptionId: "CORRECT" as const, isCorrect: true },
    { text: ratioKey(b, a), misconceptionId: "REVERSE_SPEED_RATIO" as const, isCorrect: false },
    { text: ratioKey(a + b, b), misconceptionId: "USE_TOTAL_SPEED_AS_DISTANCE_SHARE" as const, isCorrect: false },
    { text: ratioKey(a, a + b), misconceptionId: "USE_TOTAL_SPEED_AS_DISTANCE_SHARE" as const, isCorrect: false },
  ];
  const correct = raw[0];
  const wrong = raw.slice(1);
  const slot = hashForSlot(`ratio|${seed}`) % 4;
  const result: TsdCp004OptionAudit[] = [];
  let wi = 0;
  for (let i = 0; i < 4; i += 1) result.push(Object.freeze(i === slot ? correct : wrong[wi++]));
  return Object.freeze(result);
}

function buildOrderOptions(solution: TsdCp004SolveCertificate, seed: string): readonly TsdCp004OptionAudit[] {
  const all = ["Pursuer A catches first", "Pursuer C catches first", "Both catch at the same time", "Neither can catch"];
  const correct = solution.answerOrder;
  if (!correct || !all.includes(correct)) throw new Error("Order answer missing");
  const wrong = all.filter((x) => x !== correct);
  const slot = hashForSlot(`order|${seed}`) % 4;
  const result: TsdCp004OptionAudit[] = [];
  let wi = 0;
  for (let i = 0; i < 4; i += 1) {
    const text = i === slot ? correct : wrong[wi++];
    result.push(Object.freeze({
      text,
      misconceptionId: i === slot ? "CORRECT" : text === "Neither can catch" ? "USE_ONE_BODY_SPEED" : "COMPARE_SPEEDS_INSTEAD_OF_CATCH_TIMES",
      isCorrect: i === slot,
    }));
  }
  return Object.freeze(result);
}

function hashForSlot(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (Math.imul(h, 31) + seed.charCodeAt(i)) >>> 0;
  return h;
}

export function buildCp004OptionAudit(state: TsdCp004CanonicalState, solution: TsdCp004SolveCertificate, seed: string): readonly TsdCp004OptionAudit[] {
  if (solution.answerKind === "RATIO") return buildRatioOptions(solution, seed);
  if (solution.answerKind === "ORDER") return buildOrderOptions(solution, seed);
  return buildNumericOptions(state, solution, seed);
}

export function cp004Difficulty(state: TsdCp004CanonicalState): TsdCp004Difficulty {
  const declared = TSD_CP004_AUTHORITIES.find((a) => a.authorityId === state.authorityId)?.minimumDifficulty ?? "Medium";
  let score = declared === "Easy" ? 0 : declared === "Medium" ? 1 : 2;
  if (state.representation !== "PROSE") score += 1;
  if (state.directionCase === "SAME_DIRECTION" && ["UNKNOWN_SPEED_FROM_MEETING", "START_DELAY_FROM_CATCH_UP", "REQUIRED_SPEED_FOR_MEETING_DEADLINE"].includes(state.authorityId)) score += 1;
  if (state.authorityId === "MULTI_PURSUER_MEETING_ORDER") score += 1;
  return score <= 0 ? "Easy" : score <= 2 ? "Medium" : "Hard";
}

export function buildCp004EnglishExplanation(state: TsdCp004CanonicalState, solution: TsdCp004SolveCertificate): TsdCp004Explanation {
  const A = actorLabel(state, "A");
  const B = actorLabel(state, "B");
  const C = actorLabel(state, "C");
  const a = n(state.speedAKmph);
  const b = n(state.speedBKmph);
  const c = n(state.speedCKmph);
  const gap = n(state.initialGapKm);
  const t = n(state.elapsedMinutes);
  const delay = n(state.startDelayMinutes);
  const target = n(state.targetSeparationKm);
  const route = n(state.routeLengthKm);
  const point = n(state.meetingFromAKm);
  const deadline = n(state.deadlineMinutes);
  const sum = n(add(state.speedAKmph, state.speedBKmph));
  const diff = n(absRational(subtract(state.speedAKmph, state.speedBKmph)));
  let method = "Use relative speed on a straight line.";
  let steps: string[] = [];
  let shortcut = "Work with the gap: relative speed tells how quickly that gap changes.";

  switch (state.authorityId) {
    case "RELATIVE_SPEED_OPPOSITE":
      method = "For bodies moving towards each other, add their speeds.";
      steps = [`${A} covers ${a} km in one hour while ${B} covers ${b} km towards it.`, `So the gap closes by ${a} + ${b} = ${sum} km in one hour.`, `Relative speed = ${sum} km/h.`];
      shortcut = "Opposite directions towards each other → add speeds.";
      break;
    case "RELATIVE_SPEED_SAME_DIRECTION":
      method = "For same-direction pursuit, subtract the slower speed from the faster speed.";
      steps = [`${A} moves at ${a} km/h and ${B} at ${b} km/h.`, `In one hour ${A} gains ${a} - ${b} = ${diff} km on ${B}.`, `Closing speed = ${diff} km/h.`];
      shortcut = "Same direction → faster minus slower.";
      break;
    case "FIRST_MEETING_TIME": {
      const closing = state.directionCase === "OPPOSITE_TOWARD" ? sum : diff;
      steps = [`Initial gap = ${gap} km.`, `Closing speed = ${closing} km/h.`, `Meeting time = gap ÷ closing speed = ${gap} ÷ ${closing} hour.`, `Converting to minutes gives ${solution.answerText}.`];
      shortcut = "First meeting time = initial gap ÷ positive closing speed.";
      break;
    }
    case "INITIAL_GAP_FROM_MEETING": {
      const closing = state.directionCase === "OPPOSITE_TOWARD" ? sum : diff;
      steps = [`Meeting time = ${t} minutes = ${n(hours(state.elapsedMinutes))} hour.`, `Closing speed = ${closing} km/h.`, `Initial gap = closing speed × time = ${closing} × ${n(hours(state.elapsedMinutes))} = ${solution.answerText}.`];
      shortcut = "If meeting time is known, reverse the usual formula: gap = relative speed × time.";
      break;
    }
    case "UNKNOWN_SPEED_FROM_MEETING": {
      const closing = n(divide(state.initialGapKm, hours(state.elapsedMinutes)));
      steps = [`The ${gap} km gap is closed in ${t} minutes, so required closing speed = ${gap} ÷ ${n(hours(state.elapsedMinutes))} = ${closing} km/h.`, state.directionCase === "OPPOSITE_TOWARD" ? `For opposite motion, ${A}'s speed + ${b} = ${closing}.` : `For pursuit, ${A}'s speed - ${b} = ${closing}.`, `Therefore ${A}'s speed = ${solution.answerText}.`];
      shortcut = "Recover the closing speed first; then add or subtract the known speed according to direction.";
      break;
    }
    case "HEAD_START_CATCH_UP_TIME":
      steps = [`Head start = ${gap} km.`, `Same-direction closing speed = ${a} - ${b} = ${diff} km/h.`, `Catch-up time = ${gap} ÷ ${diff} hour.`, `In minutes, this is ${solution.answerText}.`];
      shortcut = "Catch-up time = distance lead ÷ speed difference.";
      break;
    case "HEAD_START_DISTANCE":
      steps = [`Same-direction closing speed = ${a} - ${b} = ${diff} km/h.`, `Catch-up time = ${t} minutes = ${n(hours(state.elapsedMinutes))} hour.`, `Head start = ${diff} × ${n(hours(state.elapsedMinutes))} = ${solution.answerText}.`];
      shortcut = "Head start = speed difference × catch-up time.";
      break;
    case "DELAYED_START_CATCH_UP_TIME": {
      const lead = n(km(state.speedBKmph, state.startDelayMinutes));
      steps = [`During the ${delay}-minute delay, ${B} gets a lead of ${b} × ${n(hours(state.startDelayMinutes))} = ${lead} km.`, `After ${A} starts, closing speed = ${a} - ${b} = ${diff} km/h.`, `Chase time = ${lead} ÷ ${diff} hour.`, `That equals ${solution.answerText}.`];
      shortcut = "Convert the start delay into a distance lead first; then divide by the speed difference.";
      break;
    }
    case "START_DELAY_FROM_CATCH_UP": {
      const gained = n(km(absRational(subtract(state.speedAKmph, state.speedBKmph)), state.elapsedMinutes));
      steps = [`During ${t} minutes of chasing, ${A} gains ${diff} × ${n(hours(state.elapsedMinutes))} = ${gained} km.`, `That gain must equal the lead ${B} built before ${A} started.`, `At ${b} km/h, time needed to build a ${gained} km lead is ${gained} ÷ ${b} hour.`, `So the earlier start was ${solution.answerText}.`];
      shortcut = "Lead erased during chase = lead created during the earlier start.";
      break;
    }
    case "SEPARATION_AFTER_TIME":
      steps = state.directionCase === "OPPOSITE_AWAY"
        ? [`Initial separation = ${gap} km.`, `Moving apart, separation grows at ${a} + ${b} = ${sum} km/h.`, `In ${t} minutes the added separation is ${sum} × ${n(hours(state.elapsedMinutes))} km.`, `Final separation = ${solution.answerText}.`]
        : state.directionCase === "SAME_DIRECTION"
          ? [`Initial gap = ${gap} km.`, `Because ${A} is faster, the gap grows at ${a} - ${b} = ${diff} km/h.`, `Add the relative distance gained in ${t} minutes to the initial gap.`, `Final gap = ${solution.answerText}.`]
          : [`Initial separation = ${gap} km.`, `Moving towards each other, the gap shrinks at ${a} + ${b} = ${sum} km/h.`, `Subtract the distance closed in ${t} minutes from ${gap} km.`, `Remaining separation = ${solution.answerText}.`];
      shortcut = "Treat separation as a quantity that changes at the relative speed; use + when the gap grows and − when it shrinks.";
      break;
    case "TIME_TO_SPECIFIED_SEPARATION": {
      const relative = state.directionCase === "SAME_DIRECTION" ? diff : sum;
      const change = state.directionCase === "OPPOSITE_TOWARD" ? n(subtract(state.initialGapKm, state.targetSeparationKm)) : n(subtract(state.targetSeparationKm, state.initialGapKm));
      steps = [`The separation must change by ${change} km.`, `The relevant relative speed is ${relative} km/h.`, `Time = ${change} ÷ ${relative} hour.`, `Converting to minutes gives ${solution.answerText}.`];
      shortcut = "Use only the required change in gap, not the full final separation.";
      break;
    }
    case "MEETING_POINT_DISTANCE_SPLIT":
      steps = [`Both ${CP004_ENGLISH_ACTORS[state.actorKind].plural} travel for the same time before meeting.`, `So their distances are in the speed ratio ${a}:${b}.`, `The ${route} km route is divided in that ratio.`, `Distance from ${A}'s end = ${route} × ${a}/(${a}+${b}) = ${solution.answerText}.`];
      shortcut = "For simultaneous opposite starts, meeting distances are proportional to speeds.";
      break;
    case "SPEED_RATIO_FROM_MEETING_POINT": {
      const other = n(subtract(state.routeLengthKm, state.meetingFromAKm));
      steps = [`${A} travels ${point} km before the meeting.`, `${B} travels the remaining ${route} - ${point} = ${other} km.`, `Their travel times are equal, so speed ratio = distance ratio.`, `${A}:${B} = ${point}:${other} = ${solution.answerText}.`];
      shortcut = "Same meeting time → speed ratio equals distance-travelled ratio.";
      break;
    }
    case "MEETING_POINT_FROM_SPEED_RATIO":
      steps = [`Speed ratio = ${state.ratioA}:${state.ratioB}, so the route is divided into ${state.ratioA + state.ratioB} equal ratio parts.`, `${A}'s share is ${state.ratioA} of those parts.`, `Meeting distance from the first end = ${route} × ${state.ratioA}/${state.ratioA + state.ratioB} = ${solution.answerText}.`];
      shortcut = "Divide the route in the given speed ratio.";
      break;
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE": {
      const closing = n(divide(state.initialGapKm, hours(state.deadlineMinutes)));
      steps = [`Available time = ${deadline} minutes = ${n(hours(state.deadlineMinutes))} hour.`, `Required closing speed = ${gap} ÷ ${n(hours(state.deadlineMinutes))} = ${closing} km/h.`, state.directionCase === "OPPOSITE_TOWARD" ? `Since the bodies move towards each other, ${A}'s required speed + ${b} = ${closing}.` : `For same-direction catch-up, ${A}'s required speed - ${b} = ${closing}.`, `Required speed = ${solution.answerText}.`];
      shortcut = "First find the closing speed needed to erase the gap by the deadline; then isolate the required body speed.";
      break;
    }
    case "MULTI_PURSUER_MEETING_ORDER": {
      const tA = n(multiply(divide(state.initialGapKm, subtract(state.speedAKmph, state.speedBKmph)), SIXTY));
      const tC = n(multiply(divide(state.extraGapCKm, subtract(state.speedCKmph, state.speedBKmph)), SIXTY));
      steps = [`For ${A}, closing speed = ${a} - ${b} = ${diff} km/h, giving catch time ${tA} minutes.`, `For ${C}, closing speed = ${c} - ${b} = ${n(subtract(state.speedCKmph, state.speedBKmph))} km/h, giving catch time ${tC} minutes.`, `Compare the two catch times rather than just the two speeds.`, `${solution.answerText}.`];
      shortcut = "With multiple pursuers, compute each catch time independently; the smallest positive time wins.";
      break;
    }
  }

  return Object.freeze({ method, steps: Object.freeze(steps), shortcut, answer: `Answer: ${solution.answerText}` });
}

export function buildCp004Visual(state: TsdCp004CanonicalState): TsdCp004Visual | null {
  if (state.representation === "PROSE") return null;
  const A = actorLabel(state, "A");
  const B = actorLabel(state, "B");
  const gap = n(state.initialGapKm);
  const a = n(state.speedAKmph);
  const b = n(state.speedBKmph);
  if (state.representation === "NUMBER_LINE") {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="120" viewBox="0 0 520 120" role="img"><line x1="55" y1="65" x2="465" y2="65" stroke="currentColor" stroke-width="2"/><circle cx="95" cy="65" r="5"/><circle cx="425" cy="65" r="5"/><text x="70" y="40" font-size="14">A: ${a} km/h</text><text x="360" y="40" font-size="14">B: ${b} km/h</text><text x="225" y="92" font-size="13">gap ${gap} km</text></svg>`;
    return Object.freeze({ kind: "NUMBER_LINE", svg, alt: `${A} and ${B} on a straight line; displayed speeds ${a} km/h and ${b} km/h; initial gap ${gap} km.` });
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="120" viewBox="0 0 520 120" role="img"><line x1="70" y1="50" x2="450" y2="50" stroke="currentColor" stroke-width="2"/><line x1="70" y1="45" x2="70" y2="75" stroke="currentColor"/><line x1="450" y1="45" x2="450" y2="75" stroke="currentColor"/><text x="58" y="96" font-size="13">start</text><text x="405" y="96" font-size="13">event</text><text x="180" y="35" font-size="13">relative-motion timeline</text></svg>`;
  return Object.freeze({ kind: "TIMELINE", svg, alt: `Timeline for ${A} and ${B} from start to the requested first relative-motion event.` });
}
