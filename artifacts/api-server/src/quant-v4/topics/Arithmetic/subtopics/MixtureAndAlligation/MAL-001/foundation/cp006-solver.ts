import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  subtractRational,
  sumRationals,
} from "./rational";
import type { Rational } from "./types";
import type {
  MalCp006LedgerResult,
  MalCp006LedgerSnapshot,
  MalCp006Operation,
  MalCp006VesselState,
} from "./cp006-types";

const ZERO = rational(0);
const ONE = rational(1);

function cloneRational(value: Rational): Rational {
  return rational(value.numerator, value.denominator);
}

function cloneVessel(vessel: MalCp006VesselState): MalCp006VesselState {
  return {
    id: vessel.id,
    volume: cloneRational(vessel.volume),
    componentA: cloneRational(vessel.componentA),
  };
}

function assertPhysicalVessel(vessel: MalCp006VesselState): void {
  if (compareRational(vessel.volume, ZERO) < 0) {
    throw new Error(`${vessel.id}: vessel volume cannot be negative.`);
  }
  if (
    equalsRational(vessel.volume, ZERO) &&
    !equalsRational(vessel.componentA, ZERO)
  ) {
    throw new Error(`${vessel.id}: an empty vessel cannot contain component A.`);
  }
  if (compareRational(vessel.componentA, ZERO) < 0) {
    throw new Error(`${vessel.id}: component-A amount cannot be negative.`);
  }
  if (compareRational(vessel.componentA, vessel.volume) > 0) {
    throw new Error(`${vessel.id}: component-A amount exceeds vessel volume.`);
  }
}

function vesselMap(
  vessels: readonly MalCp006VesselState[],
): Map<string, MalCp006VesselState> {
  const map = new Map<string, MalCp006VesselState>();
  for (const vessel of vessels) {
    assertPhysicalVessel(vessel);
    if (map.has(vessel.id)) throw new Error(`Duplicate vessel id ${vessel.id}.`);
    map.set(vessel.id, cloneVessel(vessel));
  }
  if (map.size < 2) throw new Error("CP-006 requires at least two distinct vessels.");
  return map;
}

function componentFraction(vessel: MalCp006VesselState): Rational {
  if (equalsRational(vessel.volume, ZERO)) {
    throw new Error(`${vessel.id}: cannot sample an empty vessel.`);
  }
  return divideRational(vessel.componentA, vessel.volume);
}

function snapshot(
  stage: number,
  operation: MalCp006LedgerSnapshot["operation"],
  states: Map<string, MalCp006VesselState>,
): MalCp006LedgerSnapshot {
  const vessels = [...states.values()]
    .map(cloneVessel)
    .sort((a, b) => a.id.localeCompare(b.id));
  return {
    stage,
    operation,
    vessels,
    globalVolume: sumRationals(vessels.map((vessel) => vessel.volume)),
    globalComponentA: sumRationals(vessels.map((vessel) => vessel.componentA)),
  };
}

function requireVessel(
  states: Map<string, MalCp006VesselState>,
  id: string,
): MalCp006VesselState {
  const vessel = states.get(id);
  if (!vessel) throw new Error(`Unknown vessel ${id}.`);
  return vessel;
}

function assertTransferAmount(amount: Rational, source: MalCp006VesselState): void {
  if (compareRational(amount, ZERO) <= 0) throw new Error("Transfer amount must be positive.");
  if (compareRational(amount, source.volume) >= 0) {
    throw new Error("Transfer amount must be smaller than the source volume.");
  }
}

function applyTransfer(
  states: Map<string, MalCp006VesselState>,
  operation: Extract<MalCp006Operation, { kind: "TRANSFER" }>,
): void {
  if (operation.from === operation.to) {
    throw new Error("A CP-006 transfer must move material between distinct vessels.");
  }
  const source = requireVessel(states, operation.from);
  const destination = requireVessel(states, operation.to);
  assertTransferAmount(operation.amount, source);
  const movedComponentA = multiplyRational(
    operation.amount,
    componentFraction(source),
  );
  source.volume = subtractRational(source.volume, operation.amount);
  source.componentA = subtractRational(source.componentA, movedComponentA);
  destination.volume = addRational(destination.volume, operation.amount);
  destination.componentA = addRational(
    destination.componentA,
    movedComponentA,
  );
  assertPhysicalVessel(source);
  assertPhysicalVessel(destination);
}

function applyRefill(
  states: Map<string, MalCp006VesselState>,
  operation: Extract<MalCp006Operation, { kind: "REFILL" }>,
): void {
  const vessel = requireVessel(states, operation.vessel);
  if (compareRational(operation.amount, ZERO) <= 0) {
    throw new Error("Refill amount must be positive.");
  }
  if (
    compareRational(operation.componentAFraction, ZERO) < 0 ||
    compareRational(operation.componentAFraction, ONE) > 0
  ) {
    throw new Error("Refill component fraction must lie from 0 to 1.");
  }
  vessel.volume = addRational(vessel.volume, operation.amount);
  vessel.componentA = addRational(
    vessel.componentA,
    multiplyRational(operation.amount, operation.componentAFraction),
  );
  assertPhysicalVessel(vessel);
}

function applyEqualExchange(
  states: Map<string, MalCp006VesselState>,
  operation: Extract<
    MalCp006Operation,
    { kind: "SIMULTANEOUS_EQUAL_EXCHANGE" }
  >,
): void {
  if (operation.vesselA === operation.vesselB) {
    throw new Error("Equal exchange requires two distinct vessels.");
  }
  const vesselA = requireVessel(states, operation.vesselA);
  const vesselB = requireVessel(states, operation.vesselB);
  assertTransferAmount(operation.amount, vesselA);
  assertTransferAmount(operation.amount, vesselB);

  const fractionA = componentFraction(vesselA);
  const fractionB = componentFraction(vesselB);
  const componentFromA = multiplyRational(operation.amount, fractionA);
  const componentFromB = multiplyRational(operation.amount, fractionB);

  vesselA.componentA = addRational(
    subtractRational(vesselA.componentA, componentFromA),
    componentFromB,
  );
  vesselB.componentA = addRational(
    subtractRational(vesselB.componentA, componentFromB),
    componentFromA,
  );
  assertPhysicalVessel(vesselA);
  assertPhysicalVessel(vesselB);
}

export function solveMalCp006Ledger(
  initialVessels: readonly MalCp006VesselState[],
  operations: readonly MalCp006Operation[],
): MalCp006LedgerResult {
  const states = vesselMap(initialVessels);
  const snapshots: MalCp006LedgerSnapshot[] = [
    snapshot(0, "INITIAL", states),
  ];

  operations.forEach((operation, index) => {
    if (operation.kind === "TRANSFER") applyTransfer(states, operation);
    else if (operation.kind === "REFILL") applyRefill(states, operation);
    else applyEqualExchange(states, operation);
    snapshots.push(snapshot(index + 1, operation.kind, states));
  });

  return {
    finalVessels: snapshots.at(-1)!.vessels,
    snapshots,
  };
}

export function getMalCp006Vessel(
  result: MalCp006LedgerResult,
  vesselId: string,
): MalCp006VesselState {
  const vessel = result.finalVessels.find((candidate) => candidate.id === vesselId);
  if (!vessel) throw new Error(`Missing final vessel ${vesselId}.`);
  return vessel;
}

export function malCp006ComponentB(vessel: MalCp006VesselState): Rational {
  return subtractRational(vessel.volume, vessel.componentA);
}

export function malCp006ConcentrationPercent(
  vessel: MalCp006VesselState,
): Rational {
  return multiplyRational(
    divideRational(vessel.componentA, vessel.volume),
    rational(100),
  );
}

export function solveMalCp006EqualExchangeAmount(
  vesselAVolume: Rational,
  vesselBVolume: Rational,
  initialFractionA: Rational,
  initialFractionB: Rational,
): Rational {
  if (
    compareRational(vesselAVolume, ZERO) <= 0 ||
    compareRational(vesselBVolume, ZERO) <= 0
  ) {
    throw new Error("Vessel capacities must be positive.");
  }
  if (equalsRational(initialFractionA, initialFractionB)) {
    throw new Error("Equal-exchange inverse requires different initial concentrations.");
  }
  for (const fraction of [initialFractionA, initialFractionB]) {
    if (
      compareRational(fraction, ZERO) < 0 ||
      compareRational(fraction, ONE) > 0
    ) {
      throw new Error("Initial concentration fraction must lie from 0 to 1.");
    }
  }
  return divideRational(
    multiplyRational(vesselAVolume, vesselBVolume),
    addRational(vesselAVolume, vesselBVolume),
  );
}

export function verifyMalCp006EqualExchange(
  vesselAVolume: Rational,
  vesselBVolume: Rational,
  initialFractionA: Rational,
  initialFractionB: Rational,
  exchangeAmount: Rational,
): boolean {
  const result = solveMalCp006Ledger(
    [
      {
        id: "A",
        volume: vesselAVolume,
        componentA: multiplyRational(vesselAVolume, initialFractionA),
      },
      {
        id: "B",
        volume: vesselBVolume,
        componentA: multiplyRational(vesselBVolume, initialFractionB),
      },
    ],
    [
      {
        kind: "SIMULTANEOUS_EQUAL_EXCHANGE",
        vesselA: "A",
        vesselB: "B",
        amount: exchangeAmount,
      },
    ],
  );
  const a = getMalCp006Vessel(result, "A");
  const b = getMalCp006Vessel(result, "B");
  return equalsRational(
    divideRational(a.componentA, a.volume),
    divideRational(b.componentA, b.volume),
  );
}
