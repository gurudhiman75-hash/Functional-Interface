import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { solveCp001 } from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-001/cp001/canonical-solver.ts";
import {
  durationForUniformMotion,
  groundSpeedInMedium,
  trainClearTimeAgainstFixedObject,
  twoTrainCompleteCrossingTime,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-001/foundation/motion.ts";
import {
  rational,
  toCanonicalString,
  toMixedString,
  type Rational,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-001/foundation/rational.ts";

export const DSF_CP011_TSD_RUNTIME_VERSION = "DSF_CP011_TSD_RUNTIME_V2" as const;
export const DSF_CP011_TSD_SOLVE_MODES = [
  "DSF-SM-TSD-DISTANCE",
  "DSF-SM-TSD-SPEED",
  "DSF-SM-TSD-TIME",
  "DSF-SM-TRAIN-FIXED-CLEAR-TIME",
  "DSF-SM-TRAIN-TWO-CROSS-TIME",
  "DSF-SM-BOAT-UPSTREAM-TIME",
  "DSF-SM-BOAT-DOWNSTREAM-TIME",
] as const;

export type DsfCp011TsdSolveMode = (typeof DSF_CP011_TSD_SOLVE_MODES)[number];
export type DsfCp011TsdDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp011TsdTargetKind = "DISTANCE" | "SPEED" | "TIME" | "TRAIN_CLEAR_TIME" | "TRAIN_CROSS_TIME" | "BOAT_TRAVEL_TIME";

type ContextId =
  | "ROAD_TRIP" | "DELIVERY_VAN" | "CYCLIST" | "RUNNER"
  | "PASSENGER_TRAIN" | "FREIGHT_TRAIN" | "RAILWAY_PLATFORM" | "EXPRESS_TRAINS"
  | "RIVER_BOAT" | "FERRY" | "PATROL_BOAT" | "CARGO_BOAT";

type StatementFamily =
  | "DISTANCE_EXACT" | "SPEED_EXACT" | "TIME_EXACT"
  | "SPEED_TIME_PAIR" | "DISTANCE_TIME_PAIR" | "DISTANCE_SPEED_PAIR"
  | "CORE_BOUND" | "CORE_PARITY"
  | "TRAIN_LENGTH_EXACT" | "OBJECT_LENGTH_EXACT" | "TRAIN_SPEED_EXACT"
  | "TOTAL_LENGTH_EXACT" | "CLEAR_TIME_EXACT" | "TOTAL_SPEED_PAIR"
  | "TRAIN_FULL_DATA" | "TRAIN_BOUND"
  | "SECOND_TRAIN_LENGTH_EXACT" | "SECOND_TRAIN_SPEED_EXACT"
  | "RELATIVE_SPEED_EXACT" | "CROSS_TIME_EXACT" | "LENGTH_PAIR" | "SPEED_PAIR"
  | "CROSSING_DATA_PAIR" | "TWO_TRAIN_FULL_DATA"
  | "BOAT_DISTANCE_EXACT" | "STILL_SPEED_EXACT" | "STREAM_SPEED_EXACT"
  | "GROUND_SPEED_EXACT" | "BOAT_TIME_EXACT" | "BOAT_DISTANCE_GROUND_PAIR"
  | "BOAT_SPEED_PAIR" | "BOAT_FULL_TRIP_DATA" | "BOAT_BOUND";

interface CoreWorld {
  readonly kind: "CORE";
  readonly distanceMetres: Rational;
  readonly speedMps: Rational;
  readonly timeSeconds: Rational;
}
interface FixedTrainWorld {
  readonly kind: "TRAIN_FIXED";
  readonly trainLengthMetres: Rational;
  readonly objectLengthMetres: Rational;
  readonly speedMps: Rational;
  readonly totalLengthMetres: Rational;
  readonly clearTimeSeconds: Rational;
}
interface TwoTrainWorld {
  readonly kind: "TRAIN_TWO";
  readonly firstLengthMetres: Rational;
  readonly secondLengthMetres: Rational;
  readonly firstSpeedMps: Rational;
  readonly secondSpeedMps: Rational;
  readonly totalLengthMetres: Rational;
  readonly relativeSpeedMps: Rational;
  readonly crossingTimeSeconds: Rational;
}
interface BoatWorld {
  readonly kind: "BOAT_UPSTREAM" | "BOAT_DOWNSTREAM";
  readonly distanceMetres: Rational;
  readonly stillWaterSpeedMps: Rational;
  readonly streamSpeedMps: Rational;
  readonly groundSpeedMps: Rational;
  readonly travelTimeSeconds: Rational;
}
type TsdWorld = CoreWorld | FixedTrainWorld | TwoTrainWorld | BoatWorld;

interface TsdProblem {
  readonly solveMode: DsfCp011TsdSolveMode;
  readonly targetKind: DsfCp011TsdTargetKind;
  readonly anchor: TsdWorld;
  readonly contextId: ContextId;
  readonly intro: string;
}
interface TsdStatement {
  readonly id: string;
  readonly family: StatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: TsdWorld) => boolean;
}
interface SynthesizedPair {
  readonly statementI: TsdStatement;
  readonly statementII: TsdStatement;
  readonly evaluation: TwoStatementSufficiencyEvaluation<string>;
}

const CORE_CONTEXTS = [
  { id: "ROAD_TRIP" as const, intros: ["A vehicle travels at a uniform speed on a road.", "Consider a road journey completed at constant speed.", "A traveller covers a fixed route at uniform speed.", "The details of a constant-speed road journey are being examined."] },
  { id: "DELIVERY_VAN" as const, intros: ["A delivery van travels at a constant speed.", "Consider one uniform-speed trip made by a delivery van.", "A delivery van covers a route without changing speed.", "The travel record of a delivery van is under review."] },
  { id: "CYCLIST" as const, intros: ["A cyclist moves at a uniform speed.", "Consider a constant-speed journey made by a cyclist.", "A cyclist covers a route without changing speed.", "The motion details of a cyclist are being checked."] },
  { id: "RUNNER" as const, intros: ["A runner moves at a constant speed.", "Consider a uniform-speed run over a fixed route.", "A runner covers a route without changing speed.", "The timing details of a constant-speed run are being reviewed."] },
] as const;
const FIXED_TRAIN_CONTEXTS = [
  { id: "PASSENGER_TRAIN" as const, intros: ["A passenger train completely crosses a fixed object.", "Consider a passenger train clearing a stationary object.", "A passenger train is timed while completely passing a fixed object.", "The clearance time of a passenger train is being examined."] },
  { id: "FREIGHT_TRAIN" as const, intros: ["A freight train completely crosses a fixed object.", "Consider a freight train clearing a stationary object.", "A freight train is timed while completely passing a fixed object.", "The clearance time of a freight train is being reviewed."] },
  { id: "RAILWAY_PLATFORM" as const, intros: ["A train completely crosses a railway platform.", "Consider a train clearing a stationary railway platform.", "A train is timed while completely passing a platform.", "The platform-clearance details of a train are being examined."] },
] as const;
const TWO_TRAIN_CONTEXTS = [
  { id: "EXPRESS_TRAINS" as const, intros: ["Two trains moving in opposite directions completely cross each other.", "Consider two oppositely moving trains that pass each other completely.", "Two trains approach each other and are timed until both have completely crossed.", "The complete crossing of two opposite-moving trains is being examined."] },
  { id: "PASSENGER_TRAIN" as const, intros: ["Two passenger trains moving oppositely completely cross each other.", "Consider two passenger trains approaching each other on parallel tracks.", "Two opposite-moving passenger trains pass one another completely.", "The crossing time of two passenger trains is being reviewed."] },
  { id: "FREIGHT_TRAIN" as const, intros: ["Two freight trains moving oppositely completely cross each other.", "Consider two freight trains approaching each other on parallel tracks.", "Two opposite-moving freight trains pass one another completely.", "The crossing time of two freight trains is being checked."] },
] as const;
const BOAT_CONTEXTS = [
  { id: "RIVER_BOAT" as const, intros: ["A boat travels on a river with a steady current.", "Consider a river journey made by a boat in a uniform current.", "A boat moves through a river whose current speed is constant.", "The travel time of a boat in a steady river current is being examined."] },
  { id: "FERRY" as const, intros: ["A ferry travels along a river with a steady current.", "Consider a ferry journey in a uniform river current.", "A ferry moves along a river whose current is constant.", "The timing of a ferry in a steady current is being reviewed."] },
  { id: "PATROL_BOAT" as const, intros: ["A patrol boat travels on a river with a steady current.", "Consider a patrol-boat journey in a uniform current.", "A patrol boat moves through water with a constant current.", "The travel details of a patrol boat are being checked."] },
  { id: "CARGO_BOAT" as const, intros: ["A cargo boat travels on a river with a steady current.", "Consider a cargo-boat journey in a uniform river current.", "A cargo boat moves along a river whose current is constant.", "The timing of a cargo boat in steady current is being examined."] },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const character of `${DSF_CP011_TSD_RUNTIME_VERSION}:${seed}:${salt}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function createRng(seed: number, salt: string): () => number {
  let state = hashSeed(seed, salt) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}
function pick<T>(random: () => number, values: readonly T[]): T {
  if (values.length === 0) throw new Error("TSD CP011 cannot pick from an empty source-world set.");
  return values[Math.floor(random() * values.length)]!;
}
function desiredClass(seed: number): SufficiencyClass {
  return SUFFICIENCY_CLASSES[Math.abs(seed) % SUFFICIENCY_CLASSES.length]!;
}
function scalarValue(solution: ReturnType<typeof solveCp001>): Rational {
  if ("value" in solution) return solution.value;
  throw new Error(`Expected scalar TSD source solution for ${solution.solveMode}`);
}
function eq(a: Rational, b: Rational): boolean {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}
function n(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}
function signedStreamForTrip(kind: BoatWorld["kind"], streamSpeedMps: Rational): Rational {
  return kind === "BOAT_UPSTREAM"
    ? rational(-streamSpeedMps.numerator, streamSpeedMps.denominator)
    : streamSpeedMps;
}
function boatGroundSpeed(kind: BoatWorld["kind"], stillWaterSpeedMps: Rational, streamSpeedMps: Rational): Rational {
  return groundSpeedInMedium(stillWaterSpeedMps, 1, signedStreamForTrip(kind, streamSpeedMps));
}

function enumerateCoreWorlds(): readonly CoreWorld[] {
  const worlds: CoreWorld[] = [];
  for (const speed of [5, 6, 8, 10, 12, 15, 18, 20] as const) {
    for (const time of [20, 24, 30, 36, 40, 45, 50, 60] as const) {
      const speedMps = rational(speed);
      const timeSeconds = rational(time);
      const distanceMetres = scalarValue(solveCp001({ solveMode: "distanceFromSpeedAndTime", speedMps, durationSeconds: timeSeconds }));
      worlds.push({ kind: "CORE", distanceMetres, speedMps, timeSeconds });
    }
  }
  return worlds;
}
function enumerateFixedTrainWorlds(): readonly FixedTrainWorld[] {
  const worlds: FixedTrainWorld[] = [];
  for (const trainLength of [90, 120, 150, 180, 210, 240] as const) {
    for (const objectLength of [0, 60, 90, 120, 150] as const) {
      for (const speed of [10, 12, 15, 18, 20, 24] as const) {
        const trainLengthMetres = rational(trainLength);
        const objectLengthMetres = rational(objectLength);
        const speedMps = rational(speed);
        const clearTimeSeconds = trainClearTimeAgainstFixedObject(trainLengthMetres, objectLengthMetres, speedMps);
        worlds.push({ kind: "TRAIN_FIXED", trainLengthMetres, objectLengthMetres, speedMps, totalLengthMetres: rational(trainLength + objectLength), clearTimeSeconds });
      }
    }
  }
  return worlds;
}
function enumerateTwoTrainWorlds(): readonly TwoTrainWorld[] {
  const worlds: TwoTrainWorld[] = [];
  for (const firstLength of [100, 120, 150, 180] as const) {
    for (const secondLength of [90, 120, 160, 200] as const) {
      for (const firstSpeed of [10, 12, 15, 18] as const) {
        for (const secondSpeed of [8, 10, 12, 15] as const) {
          const firstLengthMetres = rational(firstLength);
          const secondLengthMetres = rational(secondLength);
          const firstSpeedMps = rational(firstSpeed);
          const secondSpeedMps = rational(secondSpeed);
          const crossingTimeSeconds = twoTrainCompleteCrossingTime(firstLengthMetres, secondLengthMetres, firstSpeedMps, rational(-secondSpeed));
          if (!crossingTimeSeconds) throw new Error("Opposite-moving train source world unexpectedly has no crossing time.");
          worlds.push({
            kind: "TRAIN_TWO", firstLengthMetres, secondLengthMetres, firstSpeedMps, secondSpeedMps,
            totalLengthMetres: rational(firstLength + secondLength), relativeSpeedMps: rational(firstSpeed + secondSpeed), crossingTimeSeconds,
          });
        }
      }
    }
  }
  return worlds;
}
function enumerateBoatWorlds(kind: BoatWorld["kind"]): readonly BoatWorld[] {
  const worlds: BoatWorld[] = [];
  for (const still of [6, 8, 10, 12, 15, 18] as const) {
    for (const stream of [1, 2, 3, 4] as const) {
      const stillWaterSpeedMps = rational(still);
      const streamSpeedMps = rational(stream);
      const groundSpeedMps = boatGroundSpeed(kind, stillWaterSpeedMps, streamSpeedMps);
      for (const distance of [600, 720, 900, 1080, 1200, 1440] as const) {
        const distanceMetres = rational(distance);
        worlds.push({
          kind, distanceMetres, stillWaterSpeedMps, streamSpeedMps, groundSpeedMps,
          travelTimeSeconds: durationForUniformMotion(distanceMetres, groundSpeedMps),
        });
      }
    }
  }
  return worlds;
}

const CORE_WORLDS = enumerateCoreWorlds();
const FIXED_TRAIN_WORLDS = enumerateFixedTrainWorlds();
const TWO_TRAIN_WORLDS = enumerateTwoTrainWorlds();
const UPSTREAM_WORLDS = enumerateBoatWorlds("BOAT_UPSTREAM");
const DOWNSTREAM_WORLDS = enumerateBoatWorlds("BOAT_DOWNSTREAM");
const SOURCE_ANSWER_CACHE = new Map<string, string>();

function worldKey(world: TsdWorld): string {
  switch (world.kind) {
    case "CORE": return `C|${toCanonicalString(world.distanceMetres)}|${toCanonicalString(world.speedMps)}|${toCanonicalString(world.timeSeconds)}`;
    case "TRAIN_FIXED": return `TF|${toCanonicalString(world.trainLengthMetres)}|${toCanonicalString(world.objectLengthMetres)}|${toCanonicalString(world.speedMps)}`;
    case "TRAIN_TWO": return `TT|${toCanonicalString(world.firstLengthMetres)}|${toCanonicalString(world.secondLengthMetres)}|${toCanonicalString(world.firstSpeedMps)}|${toCanonicalString(world.secondSpeedMps)}`;
    case "BOAT_UPSTREAM":
    case "BOAT_DOWNSTREAM": return `B|${world.kind}|${toCanonicalString(world.distanceMetres)}|${toCanonicalString(world.stillWaterSpeedMps)}|${toCanonicalString(world.streamSpeedMps)}`;
  }
}
function sourceAnswer(problem: TsdProblem, world: TsdWorld): string {
  const key = `${problem.solveMode}|${worldKey(world)}`;
  const cached = SOURCE_ANSWER_CACHE.get(key);
  if (cached) return cached;
  let value: Rational;
  let unit: string;
  switch (problem.solveMode) {
    case "DSF-SM-TSD-DISTANCE":
      if (world.kind !== "CORE") throw new Error("Core distance mode received incompatible world.");
      value = scalarValue(solveCp001({ solveMode: "distanceFromSpeedAndTime", speedMps: world.speedMps, durationSeconds: world.timeSeconds })); unit = "metres"; break;
    case "DSF-SM-TSD-SPEED":
      if (world.kind !== "CORE") throw new Error("Core speed mode received incompatible world.");
      value = scalarValue(solveCp001({ solveMode: "speedFromDistanceAndTime", distanceMetres: world.distanceMetres, durationSeconds: world.timeSeconds })); unit = "m/s"; break;
    case "DSF-SM-TSD-TIME":
      if (world.kind !== "CORE") throw new Error("Core time mode received incompatible world.");
      value = scalarValue(solveCp001({ solveMode: "timeFromDistanceAndSpeed", distanceMetres: world.distanceMetres, speedMps: world.speedMps })); unit = "seconds"; break;
    case "DSF-SM-TRAIN-FIXED-CLEAR-TIME":
      if (world.kind !== "TRAIN_FIXED") throw new Error("Fixed-train mode received incompatible world.");
      value = trainClearTimeAgainstFixedObject(world.trainLengthMetres, world.objectLengthMetres, world.speedMps); unit = "seconds"; break;
    case "DSF-SM-TRAIN-TWO-CROSS-TIME": {
      if (world.kind !== "TRAIN_TWO") throw new Error("Two-train mode received incompatible world.");
      const solved = twoTrainCompleteCrossingTime(world.firstLengthMetres, world.secondLengthMetres, world.firstSpeedMps, rational(-world.secondSpeedMps.numerator, world.secondSpeedMps.denominator));
      if (!solved) throw new Error("Canonical two-train source returned no crossing time.");
      value = solved; unit = "seconds"; break;
    }
    case "DSF-SM-BOAT-UPSTREAM-TIME":
    case "DSF-SM-BOAT-DOWNSTREAM-TIME": {
      const expectedKind = problem.solveMode === "DSF-SM-BOAT-UPSTREAM-TIME" ? "BOAT_UPSTREAM" : "BOAT_DOWNSTREAM";
      if (world.kind !== expectedKind) throw new Error("Boat mode received incompatible world.");
      value = durationForUniformMotion(world.distanceMetres, boatGroundSpeed(expectedKind, world.stillWaterSpeedMps, world.streamSpeedMps));
      unit = "seconds"; break;
    }
  }
  const answer = `${toCanonicalString(value)} ${unit}`;
  SOURCE_ANSWER_CACHE.set(key, answer);
  return answer;
}
function baseWorlds(problem: TsdProblem): readonly TsdWorld[] {
  switch (problem.solveMode) {
    case "DSF-SM-TSD-DISTANCE":
    case "DSF-SM-TSD-SPEED":
    case "DSF-SM-TSD-TIME": return CORE_WORLDS;
    case "DSF-SM-TRAIN-FIXED-CLEAR-TIME": return FIXED_TRAIN_WORLDS;
    case "DSF-SM-TRAIN-TWO-CROSS-TIME": return TWO_TRAIN_WORLDS;
    case "DSF-SM-BOAT-UPSTREAM-TIME": return UPSTREAM_WORLDS;
    case "DSF-SM-BOAT-DOWNSTREAM-TIME": return DOWNSTREAM_WORLDS;
  }
}
const adapter = {
  adapterId: "DSF-CP011-TSD-001-SOURCE-BOUND-V2",
  domainFamily: "QUANT" as const,
  sourceChapterId: "TSD-001",
  enumerateBaseWorlds: baseWorlds,
  statementHolds: (_problem: TsdProblem, world: TsdWorld, statement: TsdStatement) => statement.test(world),
  evaluateTarget: (problem: TsdProblem, world: TsdWorld) => sourceAnswer(problem, world),
  normalizeAnswer: (answer: string) => answer,
};
function statement(id: string, family: StatementFamily, complexity: 1 | 2 | 3, text: string, test: (world: TsdWorld) => boolean): TsdStatement {
  return { id, family, complexity, text, test };
}

function buildCoreStatements(anchor: CoreWorld): readonly TsdStatement[] {
  const d = n(anchor.distanceMetres), s = n(anchor.speedMps), t = n(anchor.timeSeconds);
  return [
    statement(`D_${d}`, "DISTANCE_EXACT", 1, `The distance travelled is ${d} metres.`, w => w.kind === "CORE" && eq(w.distanceMetres, anchor.distanceMetres)),
    statement(`S_${s}`, "SPEED_EXACT", 1, `The speed is ${s} metres per second.`, w => w.kind === "CORE" && eq(w.speedMps, anchor.speedMps)),
    statement(`T_${t}`, "TIME_EXACT", 1, `The travel time is ${t} seconds.`, w => w.kind === "CORE" && eq(w.timeSeconds, anchor.timeSeconds)),
    statement(`ST_${s}_${t}`, "SPEED_TIME_PAIR", 2, `The speed is ${s} m/s and the travel time is ${t} seconds.`, w => w.kind === "CORE" && eq(w.speedMps, anchor.speedMps) && eq(w.timeSeconds, anchor.timeSeconds)),
    statement(`DT_${d}_${t}`, "DISTANCE_TIME_PAIR", 2, `The distance is ${d} metres and the journey takes ${t} seconds.`, w => w.kind === "CORE" && eq(w.distanceMetres, anchor.distanceMetres) && eq(w.timeSeconds, anchor.timeSeconds)),
    statement(`DS_${d}_${s}`, "DISTANCE_SPEED_PAIR", 2, `The distance is ${d} metres and the speed is ${s} m/s.`, w => w.kind === "CORE" && eq(w.distanceMetres, anchor.distanceMetres) && eq(w.speedMps, anchor.speedMps)),
    statement(`SLE_${s}`, "CORE_BOUND", 2, `The speed does not exceed ${s} m/s.`, w => w.kind === "CORE" && n(w.speedMps) <= s),
    statement(`TGE_${t}`, "CORE_BOUND", 2, `The journey takes at least ${t} seconds.`, w => w.kind === "CORE" && n(w.timeSeconds) >= t),
    statement(`SP_${s % 2}`, "CORE_PARITY", 2, `The speed in m/s is ${s % 2 === 0 ? "even" : "odd"}.`, w => w.kind === "CORE" && Math.trunc(n(w.speedMps)) % 2 === s % 2),
  ];
}
function buildFixedTrainStatements(anchor: FixedTrainWorld): readonly TsdStatement[] {
  const l = n(anchor.trainLengthMetres), o = n(anchor.objectLengthMetres), s = n(anchor.speedMps), total = n(anchor.totalLengthMetres);
  return [
    statement(`TL_${l}`, "TRAIN_LENGTH_EXACT", 1, `The train is ${l} metres long.`, w => w.kind === "TRAIN_FIXED" && eq(w.trainLengthMetres, anchor.trainLengthMetres)),
    statement(`OL_${o}`, "OBJECT_LENGTH_EXACT", 1, `The fixed object is ${o} metres long.`, w => w.kind === "TRAIN_FIXED" && eq(w.objectLengthMetres, anchor.objectLengthMetres)),
    statement(`TS_${s}`, "TRAIN_SPEED_EXACT", 1, `The train moves at ${s} m/s.`, w => w.kind === "TRAIN_FIXED" && eq(w.speedMps, anchor.speedMps)),
    statement(`TOT_${total}`, "TOTAL_LENGTH_EXACT", 1, `The complete-clearance distance is ${total} metres.`, w => w.kind === "TRAIN_FIXED" && eq(w.totalLengthMetres, anchor.totalLengthMetres)),
    statement(`CT_${toCanonicalString(anchor.clearTimeSeconds)}`, "CLEAR_TIME_EXACT", 1, `The train clears the object in ${toMixedString(anchor.clearTimeSeconds)} seconds.`, w => w.kind === "TRAIN_FIXED" && eq(w.clearTimeSeconds, anchor.clearTimeSeconds)),
    statement(`TSP_${total}_${s}`, "TOTAL_SPEED_PAIR", 2, `The complete-clearance distance is ${total} metres and the train speed is ${s} m/s.`, w => w.kind === "TRAIN_FIXED" && eq(w.totalLengthMetres, anchor.totalLengthMetres) && eq(w.speedMps, anchor.speedMps)),
    statement(`FULL_${l}_${o}_${s}`, "TRAIN_FULL_DATA", 3, `The train is ${l} m long, the object is ${o} m long, and the train speed is ${s} m/s.`, w => w.kind === "TRAIN_FIXED" && eq(w.trainLengthMetres, anchor.trainLengthMetres) && eq(w.objectLengthMetres, anchor.objectLengthMetres) && eq(w.speedMps, anchor.speedMps)),
    statement(`TLLE_${l}`, "TRAIN_BOUND", 2, `The train length is at most ${l} metres.`, w => w.kind === "TRAIN_FIXED" && n(w.trainLengthMetres) <= l),
  ];
}
function buildTwoTrainStatements(anchor: TwoTrainWorld): readonly TsdStatement[] {
  const l1 = n(anchor.firstLengthMetres), l2 = n(anchor.secondLengthMetres), s1 = n(anchor.firstSpeedMps), s2 = n(anchor.secondSpeedMps), total = n(anchor.totalLengthMetres), rel = n(anchor.relativeSpeedMps);
  return [
    statement(`L1_${l1}`, "TRAIN_LENGTH_EXACT", 1, `The first train is ${l1} metres long.`, w => w.kind === "TRAIN_TWO" && eq(w.firstLengthMetres, anchor.firstLengthMetres)),
    statement(`L2_${l2}`, "SECOND_TRAIN_LENGTH_EXACT", 1, `The second train is ${l2} metres long.`, w => w.kind === "TRAIN_TWO" && eq(w.secondLengthMetres, anchor.secondLengthMetres)),
    statement(`S1_${s1}`, "TRAIN_SPEED_EXACT", 1, `The first train moves at ${s1} m/s.`, w => w.kind === "TRAIN_TWO" && eq(w.firstSpeedMps, anchor.firstSpeedMps)),
    statement(`S2_${s2}`, "SECOND_TRAIN_SPEED_EXACT", 1, `The second train moves at ${s2} m/s in the opposite direction.`, w => w.kind === "TRAIN_TWO" && eq(w.secondSpeedMps, anchor.secondSpeedMps)),
    statement(`TOT_${total}`, "TOTAL_LENGTH_EXACT", 1, `The sum of the two train lengths is ${total} metres.`, w => w.kind === "TRAIN_TWO" && eq(w.totalLengthMetres, anchor.totalLengthMetres)),
    statement(`REL_${rel}`, "RELATIVE_SPEED_EXACT", 1, `Their relative speed is ${rel} m/s.`, w => w.kind === "TRAIN_TWO" && eq(w.relativeSpeedMps, anchor.relativeSpeedMps)),
    statement(`CT_${toCanonicalString(anchor.crossingTimeSeconds)}`, "CROSS_TIME_EXACT", 1, `They cross completely in ${toMixedString(anchor.crossingTimeSeconds)} seconds.`, w => w.kind === "TRAIN_TWO" && eq(w.crossingTimeSeconds, anchor.crossingTimeSeconds)),
    statement(`LP_${l1}_${l2}`, "LENGTH_PAIR", 2, `The train lengths are ${l1} metres and ${l2} metres.`, w => w.kind === "TRAIN_TWO" && eq(w.firstLengthMetres, anchor.firstLengthMetres) && eq(w.secondLengthMetres, anchor.secondLengthMetres)),
    statement(`SP_${s1}_${s2}`, "SPEED_PAIR", 2, `Their speeds are ${s1} m/s and ${s2} m/s in opposite directions.`, w => w.kind === "TRAIN_TWO" && eq(w.firstSpeedMps, anchor.firstSpeedMps) && eq(w.secondSpeedMps, anchor.secondSpeedMps)),
    statement(`TR_${total}_${rel}`, "CROSSING_DATA_PAIR", 2, `Their total length is ${total} metres and relative speed is ${rel} m/s.`, w => w.kind === "TRAIN_TWO" && eq(w.totalLengthMetres, anchor.totalLengthMetres) && eq(w.relativeSpeedMps, anchor.relativeSpeedMps)),
    statement(`FULL_${l1}_${l2}_${s1}_${s2}`, "TWO_TRAIN_FULL_DATA", 3, `The train lengths are ${l1} m and ${l2} m and their speeds are ${s1} m/s and ${s2} m/s oppositely.`, w => w.kind === "TRAIN_TWO" && eq(w.firstLengthMetres, anchor.firstLengthMetres) && eq(w.secondLengthMetres, anchor.secondLengthMetres) && eq(w.firstSpeedMps, anchor.firstSpeedMps) && eq(w.secondSpeedMps, anchor.secondSpeedMps)),
    statement(`TLE_${total}`, "TRAIN_BOUND", 2, `Their combined length does not exceed ${total} metres.`, w => w.kind === "TRAIN_TWO" && n(w.totalLengthMetres) <= total),
  ];
}
function buildBoatStatements(anchor: BoatWorld): readonly TsdStatement[] {
  const d = n(anchor.distanceMetres), still = n(anchor.stillWaterSpeedMps), stream = n(anchor.streamSpeedMps), ground = n(anchor.groundSpeedMps);
  const directionText = anchor.kind === "BOAT_UPSTREAM" ? "upstream" : "downstream";
  return [
    statement(`D_${d}`, "BOAT_DISTANCE_EXACT", 1, `The ${directionText} distance is ${d} metres.`, w => w.kind === anchor.kind && eq(w.distanceMetres, anchor.distanceMetres)),
    statement(`S_${still}`, "STILL_SPEED_EXACT", 1, `The boat's speed in still water is ${still} m/s.`, w => w.kind === anchor.kind && eq(w.stillWaterSpeedMps, anchor.stillWaterSpeedMps)),
    statement(`R_${stream}`, "STREAM_SPEED_EXACT", 1, `The stream speed is ${stream} m/s.`, w => w.kind === anchor.kind && eq(w.streamSpeedMps, anchor.streamSpeedMps)),
    statement(`G_${ground}`, "GROUND_SPEED_EXACT", 1, `The effective ${directionText} speed is ${ground} m/s.`, w => w.kind === anchor.kind && eq(w.groundSpeedMps, anchor.groundSpeedMps)),
    statement(`T_${toCanonicalString(anchor.travelTimeSeconds)}`, "BOAT_TIME_EXACT", 1, `The ${directionText} trip takes ${toMixedString(anchor.travelTimeSeconds)} seconds.`, w => w.kind === anchor.kind && eq(w.travelTimeSeconds, anchor.travelTimeSeconds)),
    statement(`DG_${d}_${ground}`, "BOAT_DISTANCE_GROUND_PAIR", 2, `The ${directionText} distance is ${d} metres and effective speed is ${ground} m/s.`, w => w.kind === anchor.kind && eq(w.distanceMetres, anchor.distanceMetres) && eq(w.groundSpeedMps, anchor.groundSpeedMps)),
    statement(`SR_${still}_${stream}`, "BOAT_SPEED_PAIR", 2, `The still-water speed is ${still} m/s and stream speed is ${stream} m/s.`, w => w.kind === anchor.kind && eq(w.stillWaterSpeedMps, anchor.stillWaterSpeedMps) && eq(w.streamSpeedMps, anchor.streamSpeedMps)),
    statement(`FULL_${d}_${still}_${stream}`, "BOAT_FULL_TRIP_DATA", 3, `The ${directionText} distance is ${d} m, still-water speed is ${still} m/s, and stream speed is ${stream} m/s.`, w => w.kind === anchor.kind && eq(w.distanceMetres, anchor.distanceMetres) && eq(w.stillWaterSpeedMps, anchor.stillWaterSpeedMps) && eq(w.streamSpeedMps, anchor.streamSpeedMps)),
    statement(`DLE_${d}`, "BOAT_BOUND", 2, `The ${directionText} distance is at most ${d} metres.`, w => w.kind === anchor.kind && n(w.distanceMetres) <= d),
    statement(`SGE_${still}`, "BOAT_BOUND", 2, `The still-water speed is at least ${still} m/s.`, w => w.kind === anchor.kind && n(w.stillWaterSpeedMps) >= still),
  ];
}
function buildStatementPool(problem: TsdProblem): readonly TsdStatement[] {
  switch (problem.anchor.kind) {
    case "CORE": return buildCoreStatements(problem.anchor);
    case "TRAIN_FIXED": return buildFixedTrainStatements(problem.anchor);
    case "TRAIN_TWO": return buildTwoTrainStatements(problem.anchor);
    case "BOAT_UPSTREAM":
    case "BOAT_DOWNSTREAM": return buildBoatStatements(problem.anchor);
  }
}
function synthesizePair(problem: TsdProblem, seed: number, targetClass: SufficiencyClass): SynthesizedPair {
  const candidates: SynthesizedPair[] = [];
  for (const statementI of buildStatementPool(problem)) {
    for (const statementII of buildStatementPool(problem)) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification === targetClass) candidates.push({ statementI, statementII, evaluation });
      } catch {
        // Reject inconsistent candidate conjunctions.
      }
    }
  }
  if (candidates.length === 0) throw new Error(`No TSD-001 V2 pair for ${problem.solveMode}/${targetClass}`);
  return pick(createRng(seed, `pair:${problem.solveMode}:${targetClass}`), candidates);
}
function contextFor<T extends readonly { id: ContextId; intros: readonly string[] }[]>(seed: number, contexts: T) {
  const index = Math.floor(Math.abs(seed) / DSF_CP011_TSD_SOLVE_MODES.length);
  const context = contexts[index % contexts.length]!;
  return { context, intro: context.intros[Math.floor(index / contexts.length) % context.intros.length]! };
}
function buildProblem(seed: number, attempt: number): TsdProblem {
  const modeIndex = Math.abs(seed) % DSF_CP011_TSD_SOLVE_MODES.length;
  const solveMode = DSF_CP011_TSD_SOLVE_MODES[modeIndex]!;
  const random = createRng(seed + attempt * 65537, `problem:${solveMode}`);
  if (solveMode === "DSF-SM-TSD-DISTANCE" || solveMode === "DSF-SM-TSD-SPEED" || solveMode === "DSF-SM-TSD-TIME") {
    const { context, intro } = contextFor(seed, CORE_CONTEXTS);
    return { solveMode, targetKind: solveMode === "DSF-SM-TSD-DISTANCE" ? "DISTANCE" : solveMode === "DSF-SM-TSD-SPEED" ? "SPEED" : "TIME", anchor: pick(random, CORE_WORLDS), contextId: context.id, intro };
  }
  if (solveMode === "DSF-SM-TRAIN-FIXED-CLEAR-TIME") {
    const { context, intro } = contextFor(seed, FIXED_TRAIN_CONTEXTS);
    return { solveMode, targetKind: "TRAIN_CLEAR_TIME", anchor: pick(random, FIXED_TRAIN_WORLDS), contextId: context.id, intro };
  }
  if (solveMode === "DSF-SM-TRAIN-TWO-CROSS-TIME") {
    const { context, intro } = contextFor(seed, TWO_TRAIN_CONTEXTS);
    return { solveMode, targetKind: "TRAIN_CROSS_TIME", anchor: pick(random, TWO_TRAIN_WORLDS), contextId: context.id, intro };
  }
  const { context, intro } = contextFor(seed, BOAT_CONTEXTS);
  const worlds = solveMode === "DSF-SM-BOAT-UPSTREAM-TIME" ? UPSTREAM_WORLDS : DOWNSTREAM_WORLDS;
  return { solveMode, targetKind: "BOAT_TRAVEL_TIME", anchor: pick(random, worlds), contextId: context.id, intro };
}
function targetPrompt(problem: TsdProblem): string {
  switch (problem.solveMode) {
    case "DSF-SM-TSD-DISTANCE": return "What distance is travelled?";
    case "DSF-SM-TSD-SPEED": return "What is the speed?";
    case "DSF-SM-TSD-TIME": return "How long does the journey take?";
    case "DSF-SM-TRAIN-FIXED-CLEAR-TIME": return "How long does the train take to clear the fixed object completely?";
    case "DSF-SM-TRAIN-TWO-CROSS-TIME": return "How long do the two trains take to cross each other completely?";
    case "DSF-SM-BOAT-UPSTREAM-TIME": return "How long does the upstream journey take?";
    case "DSF-SM-BOAT-DOWNSTREAM-TIME": return "How long does the downstream journey take?";
  }
}
function explanationForStatement(label: string, answers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the asked value at ${answers[0]}. Therefore, ${label} alone is sufficient.`;
  const examples = answers.slice(0, 2);
  return examples.length >= 2
    ? `${label} permits at least two different answers, ${examples[0]} and ${examples[1]}. Therefore, ${label} alone is not sufficient.`
    : `${label} does not fix a unique answer. Therefore, ${label} alone is not sufficient.`;
}
function difficultyFor(pair: SynthesizedPair): DsfCp011TsdDifficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.statementI.complexity === 1 && pair.statementII.complexity === 1) return "Easy";
  return "Medium";
}
function generationIdentity(seed: number, problem: TsdProblem, pair: SynthesizedPair): string {
  return createHash("sha256").update(`${DSF_CP011_TSD_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.contextId}|${pair.statementI.id}|${pair.statementII.id}`).digest("hex").slice(0, 24);
}
export function normalizeDsfCp011TsdSurface(text: string): string {
  return text.toLowerCase().replace(/\d+(?:\.\d+)?(?:\/\d+)?/g, "#").replace(/[^a-z#]+/g, " ").trim().replace(/\s+/g, " ");
}

export function generateDsfCp011TsdQuestion(seed: number) {
  const targetClass = desiredClass(seed);
  let problem: TsdProblem | undefined;
  let pair: SynthesizedPair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const candidate = buildProblem(seed, attempt);
    try {
      const candidatePair = synthesizePair(candidate, seed + attempt * 104729, targetClass);
      problem = candidate;
      pair = candidatePair;
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize TSD-001 V2 DS question for seed ${seed}`);

  const prompt = targetPrompt(problem);
  const stem = `${problem.intro} ${prompt}`;
  const evaluation = pair.evaluation;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const togetherExplanation = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? (evaluation.together.sufficient
      ? `Using both statements together fixes the asked value at ${evaluation.together.normalizedTargetAnswers[0]}. So the two statements together are sufficient.`
      : `Even together, the statements allow different answers such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. So they are still insufficient.`)
    : undefined;
  const sourceCapabilities = problem.solveMode.startsWith("DSF-SM-TSD-")
    ? ["TSD-001/cp001/canonical-solver::solveCp001"]
    : problem.solveMode === "DSF-SM-TRAIN-FIXED-CLEAR-TIME"
      ? ["TSD-001/foundation/motion::trainClearTimeAgainstFixedObject"]
      : problem.solveMode === "DSF-SM-TRAIN-TWO-CROSS-TIME"
        ? ["TSD-001/foundation/motion::twoTrainCompleteCrossingTime"]
        : ["TSD-001/foundation/motion::groundSpeedInMedium", "TSD-001/foundation/motion::durationForUniformMotion"];

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_TSD_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "QUANT" as const,
    sourceChapterId: "TSD-001" as const,
    sourceCapabilities,
    solveModeId: problem.solveMode,
    targetKind: problem.targetKind,
    contextId: problem.contextId,
    answerContractId: "DS_STANDARD_5" as const,
    taskDirection: "DATA_SUFFICIENCY" as const,
    answerSemantic: "SUFFICIENCY_CLASS" as const,
    stem,
    questionPrompt: prompt,
    statements: [
      { id: "I" as const, statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
      { id: "II" as const, statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
    ] as const,
    options: DS_STANDARD_5_EN.options.map(option => ({ key: option.key, value: option.text, semanticClass: option.semanticClass, isCorrect: option.semanticClass === evaluation.classification })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex(option => option.semanticClass === evaluation.classification),
    canonicalAnswer: evaluation.classification,
    explanation: {
      askedTarget: `We need to determine ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}`,
      statementI: explanationForStatement("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explanationForStatement("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      ...(togetherExplanation ? { together: togetherExplanation } : {}),
      conclusion: correct.text,
    },
    proof: {
      baseWorldCount: baseWorlds(problem).length,
      statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount,
      togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: evaluation.minimalSufficientSets,
    },
    sourceAncestry: ["TSD-001", ...sourceCapabilities] as const,
    generationIdentity: generationIdentity(seed, problem, pair),
    studentSurfaceFingerprint: `${normalizeDsfCp011TsdSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP011_EXPANSION_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}
export function generateDsfCp011TsdBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp011TsdQuestion);
}
