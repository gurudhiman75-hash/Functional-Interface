import { canonicalDigest } from "../canonical.ts";
import { LinearTopology } from "../topology/linear.ts";
import type {
  LinearSeatingState,
  SeatingChildQuestion,
  SeatingMisconceptionId,
  SeatingOption,
  SeatingSemanticValue,
} from "../types.ts";

function stableNumber(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  return hash >>> 0;
}

function seatOrder(state: LinearSeatingState): readonly string[] {
  const topology = new LinearTopology(state.seats.length);
  const order = Array<string>(state.seats.length);
  for (const assignment of state.assignments) order[topology.indexOf(assignment.seatId)] = assignment.personId;
  if (order.some((personId) => !personId)) throw new Error("Incomplete CP-001 state while expanding queries");
  return order;
}

function nameOf(state: LinearSeatingState, personId: string): string {
  const person = state.persons.find((candidate) => candidate.id === personId);
  if (!person) throw new Error(`Unknown CP-001 person ${personId}`);
  return person.displayName;
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function displaySemantic(state: LinearSeatingState, value: SeatingSemanticValue): string {
  if (Array.isArray(value)) return value.map((item) => nameOf(state, String(item))).join(" and ");
  if (typeof value === "string" && state.persons.some((person) => person.id === value)) return nameOf(state, value);
  return String(value);
}

function buildOptions(input: {
  readonly state: LinearSeatingState;
  readonly seed: string;
  readonly answer: SeatingSemanticValue;
  readonly answerDisplay?: string;
  readonly traps: readonly {
    readonly value: SeatingSemanticValue;
    readonly display?: string;
    readonly misconceptionId: SeatingMisconceptionId;
    readonly recomputation: Readonly<Record<string, unknown>>;
    readonly explanation: string;
  }[];
}): Pick<SeatingChildQuestion, "options" | "answerIndex"> {
  const correctFingerprint = canonicalDigest(input.answer);
  const seen = new Set([correctFingerprint]);
  const wrong: SeatingOption[] = [];
  for (const trap of input.traps) {
    const fingerprint = canonicalDigest(trap.value);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    wrong.push({
      semanticValue: trap.value,
      semanticFingerprint: fingerprint,
      display: trap.display ?? displaySemantic(input.state, trap.value),
      isCorrect: false,
      misconceptionId: trap.misconceptionId,
      recomputation: trap.recomputation,
      explanation: trap.explanation,
    });
  }
  if (wrong.length !== 3) throw new Error("Expanded CP-001 query requires three distinct distractors");
  const answerIndex = (stableNumber(`${input.seed}:expanded-answer-position`) % 4) as 0 | 1 | 2 | 3;
  const options: SeatingOption[] = [...wrong];
  options.splice(answerIndex, 0, {
    semanticValue: input.answer,
    semanticFingerprint: correctFingerprint,
    display: input.answerDisplay ?? displaySemantic(input.state, input.answer),
    isCorrect: true,
    recomputation: { method: "VERIFIED_LINEAR_STATE_PROJECTION" },
    explanation: "This matches the uniquely solved row after applying the stated query operation.",
  });
  return { options: options as unknown as SeatingChildQuestion["options"], answerIndex };
}

function positionFromEndQuestion(state: LinearSeatingState, seed: string): SeatingChildQuestion {
  const order = seatOrder(state);
  const index = Math.min(2, order.length - 2);
  const personId = order[index] as string;
  const answer = index + 1;
  const mirror = order.length - index;
  const traps = [mirror, Math.max(1, answer - 1), Math.min(order.length, answer + 1)]
    .filter((value, trapIndex, values) => value !== answer && values.indexOf(value) === trapIndex);
  for (let candidate = 1; traps.length < 3 && candidate <= order.length; candidate += 1) {
    if (candidate !== answer && !traps.includes(candidate)) traps.push(candidate);
  }
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-002",
    answerType: "SEAT_POSITION",
    answerDeterminingFactFingerprint: `QC002:${personId}:FROM_LEFT`,
    text: `What is the position of ${nameOf(state, personId)} from the left end?`,
    ...buildOptions({
      state,
      seed,
      answer,
      answerDisplay: ordinal(answer),
      traps: traps.slice(0, 3).map((value, trapIndex) => ({
        value,
        display: ordinal(value),
        misconceptionId: trapIndex === 0 ? "SEA-MC-LIN-MIRROR_POSITION" : "SEA-MC-LIN-OFF_BY_ONE_SEAT",
        recomputation: trapIndex === 0 ? { countedFromRightEnd: true } : { shiftedPositionBy: value - answer },
        explanation: trapIndex === 0 ? "This counts the person's position from the opposite end." : "This shifts the solved seat position by one or more places.",
      })),
    }),
    answer,
    explanation: `${nameOf(state, personId)} occupies seat ${answer} when the solved row is counted from the left end, so the position is ${ordinal(answer)}.`,
  };
}

function immediateRightQuestion(state: LinearSeatingState, seed: string): SeatingChildQuestion {
  const topology = new LinearTopology(state.seats.length);
  const order = seatOrder(state);
  const facing = state.assignments[0]?.facing;
  if (!facing) throw new Error("CP-001 expanded query has no facing");
  const referenceIndex = facing === "NORTH" ? 1 : order.length - 2;
  const referenceId = order[referenceIndex] as string;
  const targetSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction: "RIGHT", steps: 1 });
  const reverseSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction: "LEFT", steps: 1 });
  const secondSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction: "RIGHT", steps: 2 });
  if (!targetSeat || !reverseSeat || !secondSeat) throw new Error("CP-001 immediate-right expansion left the row");
  const answer = order[topology.indexOf(targetSeat)] as string;
  const reverse = order[topology.indexOf(reverseSeat)] as string;
  const second = order[topology.indexOf(secondSeat)] as string;
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-005",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC005:${referenceId}:RIGHT:1`,
    text: `Who sits immediately to the right of ${nameOf(state, referenceId)}?`,
    ...buildOptions({
      state,
      seed,
      answer,
      traps: [
        { value: reverse, misconceptionId: "SEA-MC-LIN-LEFT_RIGHT_REVERSAL", recomputation: { direction: "LEFT" }, explanation: "This follows the reference person's left instead of right." },
        { value: second, misconceptionId: "SEA-MC-LIN-IMMEDIATE_VS_KTH", recomputation: { steps: 2 }, explanation: "This moves two seats instead of stopping at the immediate seat." },
        { value: referenceId, misconceptionId: "SEA-MC-LIN-SUBJECT_REFERENCE_SWAPPED", recomputation: { keptReferencePerson: true }, explanation: "The reference person cannot be their own immediate-right neighbour." },
      ],
    }),
    answer,
    explanation: `${nameOf(state, referenceId)} faces ${facing.toLowerCase()}. Applying that person's right direction by one seat reaches ${nameOf(state, answer)}.`,
  };
}

function adjacentPairQuestion(state: LinearSeatingState, seed: string): SeatingChildQuestion {
  const order = seatOrder(state);
  const answer = [order[0] as string, order[1] as string].sort();
  const traps = [
    [order[0] as string, order[2] as string].sort(),
    [order[1] as string, order[3] as string].sort(),
    [order[0] as string, order[order.length - 1] as string].sort(),
  ];
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-007",
    answerType: "PAIR",
    answerDeterminingFactFingerprint: `QC007:${answer.join("~")}:ADJACENT`,
    text: "Which of the following pairs sits adjacent to each other?",
    ...buildOptions({
      state,
      seed,
      answer,
      traps: traps.map((value, index) => ({
        value,
        misconceptionId: index === 2 ? "SEA-MC-LIN-MIRROR_POSITION" : "SEA-MC-LIN-OFF_BY_ONE_SEAT",
        recomputation: index === 2 ? { treatedEndsAsAdjacent: true } : { skippedOneSeat: true },
        explanation: index === 2 ? "The two ends of a straight row are not adjacent." : "This pair has at least one occupied seat separating its members.",
      })),
    }),
    answer,
    explanation: `${nameOf(state, answer[0] as string)} and ${nameOf(state, answer[1] as string)} occupy consecutive seats in the solved row.`,
  };
}

function swapQuestion(state: LinearSeatingState, seed: string): SeatingChildQuestion {
  const order = seatOrder(state);
  const leftEnd = order[0] as string;
  const swapPartner = order[Math.min(2, order.length - 2)] as string;
  const answer = swapPartner;
  const traps = [leftEnd, order[1] as string, order[order.length - 1] as string];
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-021",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC021:SWAP:${leftEnd}:${swapPartner}:LEFT_END`,
    text: `If ${nameOf(state, leftEnd)} and ${nameOf(state, swapPartner)} exchange their seats, who will sit at the left end?`,
    ...buildOptions({
      state,
      seed,
      answer,
      traps: traps.map((value, index) => ({
        value,
        misconceptionId: index === 0 ? "SEA-MC-LIN-SUBJECT_REFERENCE_SWAPPED" : "SEA-MC-LIN-OFF_BY_ONE_SEAT",
        recomputation: index === 0 ? { swapNotApplied: true } : { selectedNearbyOrOppositeSeat: true },
        explanation: index === 0 ? "This leaves the original left-end occupant in place and does not apply the exchange." : "This selects another solved-row occupant rather than the person moved into the left-end seat.",
      })),
    }),
    answer,
    explanation: `${nameOf(state, leftEnd)} leaves the left-end seat and ${nameOf(state, swapPartner)} moves into it during the exchange. Therefore ${nameOf(state, answer)} sits at the left end afterward.`,
  };
}

export function expandCp001QueryMix(
  state: LinearSeatingState,
  seed: string,
  baseChildren: readonly SeatingChildQuestion[],
): readonly SeatingChildQuestion[] {
  if (baseChildren.length !== 4) throw new Error("CP-001 query expansion expects the four-child base passage");
  const selector = stableNumber(`${seed}:cp001-expanded-query`) % 7;
  if (selector < 3) return baseChildren;
  const replacement = selector === 3
    ? positionFromEndQuestion(state, seed)
    : selector === 4
      ? immediateRightQuestion(state, seed)
      : selector === 5
        ? adjacentPairQuestion(state, seed)
        : swapQuestion(state, seed);
  return [...baseChildren.slice(0, 3), replacement];
}
