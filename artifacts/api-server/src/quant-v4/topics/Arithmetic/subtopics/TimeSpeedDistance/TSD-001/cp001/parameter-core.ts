import { add, multiply, rational, toMixedString, type Rational } from "../foundation/rational";
import type { DistanceUnit, SpeedUnit, TimeUnit } from "../foundation/units";
import type { GeneratedState } from "./runtime-types";
import { DISTANCE_LABEL, SPEED_LABEL, TIME_LABEL, SeededRng, capitalizeSentence, contextFor, formatClock, r } from "./runtime-support";

export function directState(mode: "distanceFromSpeedAndTime" | "speedFromDistanceAndTime" | "timeFromDistanceAndSpeed", rng: SeededRng): GeneratedState {
  const context = contextFor(rng);

  if (mode === "distanceFromSpeedAndTime") {
    // Learner-facing distance questions must require at least one genuine unit decision.
    // Plain matching-unit multiplication such as 12 m/s × 75 s is intentionally excluded.
    const cases = [
      { speed: r(20), duration: r(45), speedText: "72 km/h", timeText: "45 seconds", formula: "72 km/h × 5/18 = 20 m/s" },
      { speed: r(10), duration: r(90), speedText: "36 km/h", timeText: "1.5 minutes", formula: "36 km/h = 10 m/s and 1.5 minutes = 90 seconds" },
      { speed: r(15), duration: r(140), speedText: "54 km/h", timeText: "2 minutes 20 seconds", formula: "54 km/h = 15 m/s and 2 minutes 20 seconds = 140 seconds" },
      { speed: r(25), duration: r(72), speedText: "90 km/h", timeText: "1 minute 12 seconds", formula: "90 km/h = 25 m/s and 1 minute 12 seconds = 72 seconds" },
      { speed: r(25, 2), duration: r(90), speedText: "45 km/h", timeText: "1.5 minutes", formula: "45 km/h = 12.5 m/s and 1.5 minutes = 90 seconds" },
    ] as const;
    const selected = rng.pick(cases);
    return {
      input: { solveMode: mode, speedMps: selected.speed, durationSeconds: selected.duration },
      stem: `${capitalizeSentence(context.actor)} travels at ${selected.speedText} for ${selected.timeText}. Find the distance covered in metres.`,
      display: {
        unit: "m",
        formula: selected.formula,
        givens: [`Speed = ${selected.speedText}`, `Time = ${selected.timeText}`],
        shortcut: "First make speed and time compatible, then use distance = speed × time.",
      },
    };
  }

  if (mode === "speedFromDistanceAndTime") {
    const cases = [
      { distance: r(600), duration: r(75), distanceText: "600 metres", timeText: "75 seconds", formula: "Speed = Distance ÷ Time" },
      { distance: r(750), duration: r(150), distanceText: "750 metres", timeText: "2 minutes 30 seconds", formula: "2 minutes 30 seconds = 150 seconds" },
      { distance: r(900), duration: r(180), distanceText: "900 metres", timeText: "3 minutes", formula: "3 minutes = 180 seconds" },
      { distance: r(1200), duration: r(100), distanceText: "1.2 km", timeText: "100 seconds", formula: "1.2 km = 1200 metres" },
    ] as const;
    const selected = rng.pick(cases);
    return {
      input: { solveMode: mode, distanceMetres: selected.distance, durationSeconds: selected.duration },
      stem: `${capitalizeSentence(context.actor)} covers ${selected.distanceText} in ${selected.timeText}. Find the speed in m/s.`,
      display: {
        unit: "m/s",
        formula: selected.formula,
        givens: [`Distance = ${selected.distanceText}`, `Time = ${selected.timeText}`],
        shortcut: "Convert the units if required, then divide distance by time.",
      },
    };
  }

  const cases = [
    { distance: r(900), speed: r(12), distanceText: "900 metres", speedText: "12 m/s", formula: "Time = Distance ÷ Speed" },
    { distance: r(400), speed: r(5), distanceText: "400 metres", speedText: "18 km/h", formula: "18 km/h × 5/18 = 5 m/s" },
    { distance: r(750), speed: r(15, 2), distanceText: "0.75 km", speedText: "7.5 m/s", formula: "0.75 km = 750 metres" },
    { distance: r(1200), speed: r(10), distanceText: "1.2 km", speedText: "36 km/h", formula: "1.2 km = 1200 metres and 36 km/h = 10 m/s" },
  ] as const;
  const selected = rng.pick(cases);
  return {
    input: { solveMode: mode, distanceMetres: selected.distance, speedMps: selected.speed },
    stem: `${capitalizeSentence(context.actor)} covers ${selected.distanceText} at ${selected.speedText}. Find the time taken in seconds.`,
    display: {
      unit: "seconds",
      formula: selected.formula,
      givens: [`Distance = ${selected.distanceText}`, `Speed = ${selected.speedText}`],
      shortcut: "Convert the units if required, then divide distance by speed.",
    },
  };
}

export function conversionState(mode: "convertSpeedUnit" | "convertDistanceUnit" | "convertTimeUnit", rng: SeededRng): GeneratedState {
  if (mode === "convertSpeedUnit") {
    const cases: readonly [Rational, SpeedUnit, SpeedUnit][] = [
      [r(18), "KMPH", "MPS"],
      [r(54), "KMPH", "MPS"],
      [r(10), "MPS", "KMPH"],
      [r(300), "M_PER_MINUTE", "MPS"],
      [r(1), "KM_PER_MINUTE", "KMPH"],
      [r(72), "KMPH", "M_PER_MINUTE"],
    ];
    const [value, from, to] = rng.pick(cases);
    const formula = from === "KMPH" && to === "MPS"
      ? "Multiply by 5/18"
      : from === "MPS" && to === "KMPH"
        ? "Multiply by 18/5"
        : `Convert ${SPEED_LABEL[from]} into ${SPEED_LABEL[to]}`;
    return {
      input: { solveMode: mode, value, from, to },
      stem: `Convert ${toMixedString(value)} ${SPEED_LABEL[from]} into ${SPEED_LABEL[to]}.`,
      display: {
        unit: SPEED_LABEL[to],
        formula,
        givens: [`${toMixedString(value)} ${SPEED_LABEL[from]}`],
        shortcut: formula,
      },
    };
  }
  if (mode === "convertDistanceUnit") {
    const cases: readonly [Rational, DistanceUnit, DistanceUnit][] = [
      [r(5), "KM", "M"],
      [r(2400), "M", "KM"],
      [r(350), "CM", "M"],
      [r(7), "M", "CM"],
      [r(1250), "MM", "CM"],
      [r(4), "KM", "CM"],
    ];
    const [value, from, to] = rng.pick(cases);
    return {
      input: { solveMode: mode, value, from, to },
      stem: `Convert ${toMixedString(value)} ${DISTANCE_LABEL[from]} into ${DISTANCE_LABEL[to]}.`,
      display: {
        unit: DISTANCE_LABEL[to],
        formula: `Use the standard ${DISTANCE_LABEL[from]}–${DISTANCE_LABEL[to]} conversion`,
        givens: [`${toMixedString(value)} ${DISTANCE_LABEL[from]}`],
        shortcut: "Use 1 km = 1000 m, 1 m = 100 cm and 1 cm = 10 mm.",
      },
    };
  }
  const cases: readonly [Rational, TimeUnit, TimeUnit][] = [
    [r(3), "HOUR", "MINUTE"],
    [r(150), "MINUTE", "HOUR"],
    [r(2), "DAY", "HOUR"],
    [r(5400), "SECOND", "HOUR"],
    [r(7), "MINUTE", "SECOND"],
    [r(360), "MINUTE", "DAY"],
  ];
  const [value, from, to] = rng.pick(cases);
  return {
    input: { solveMode: mode, value, from, to },
    stem: `Convert ${toMixedString(value)} ${TIME_LABEL[from]} into ${TIME_LABEL[to]}.`,
    display: {
      unit: TIME_LABEL[to],
      formula: `Use the standard ${TIME_LABEL[from]}–${TIME_LABEL[to]} conversion`,
      givens: [`${toMixedString(value)} ${TIME_LABEL[from]}`],
      shortcut: "Use 60 seconds = 1 minute, 60 minutes = 1 hour and 24 hours = 1 day.",
    },
  };
}

export function mixedUnitState(rng: SeededRng): GeneratedState {
  const cases = [
    { distance: r(12), distanceUnit: "KM" as const, duration: r(30), timeUnit: "MINUTE" as const, outputUnit: "KMPH" as const, durationText: "30 minutes", formula: "30 minutes = 0.5 hour" },
    { distance: r(900), distanceUnit: "M" as const, duration: r(3), timeUnit: "MINUTE" as const, outputUnit: "MPS" as const, durationText: "3 minutes", formula: "3 minutes = 180 seconds" },
    { distance: r(750), distanceUnit: "M" as const, duration: r(150), timeUnit: "SECOND" as const, outputUnit: "KMPH" as const, durationText: "2 minutes 30 seconds", formula: "2 minutes 30 seconds = 150 seconds" },
    { distance: r(65), distanceUnit: "KM" as const, duration: r(130), timeUnit: "MINUTE" as const, outputUnit: "M_PER_MINUTE" as const, durationText: "2 hours 10 minutes", formula: "2 hours 10 minutes = 130 minutes" },
    { distance: r(3), distanceUnit: "KM" as const, duration: r(200), timeUnit: "SECOND" as const, outputUnit: "MPS" as const, durationText: "200 seconds", formula: "3 km = 3000 metres" },
    { distance: r(90), distanceUnit: "KM" as const, duration: r(2), timeUnit: "HOUR" as const, outputUnit: "MPS" as const, durationText: "2 hours", formula: "90 km in 2 hours = 45 km/h" },
  ];
  const selected = rng.pick(cases);
  return {
    input: {
      solveMode: "speedFromMixedUnits",
      distance: selected.distance,
      distanceUnit: selected.distanceUnit,
      duration: selected.duration,
      timeUnit: selected.timeUnit,
      outputUnit: selected.outputUnit,
    },
    stem: `A car covers ${toMixedString(selected.distance)} ${DISTANCE_LABEL[selected.distanceUnit]} in ${selected.durationText}. Find its speed in ${SPEED_LABEL[selected.outputUnit]}.`,
    display: {
      unit: SPEED_LABEL[selected.outputUnit],
      formula: selected.formula,
      givens: [`Distance = ${toMixedString(selected.distance)} ${DISTANCE_LABEL[selected.distanceUnit]}`, `Time = ${selected.durationText}`],
      shortcut: "Convert time and distance into the units asked in the answer, then divide.",
    },
  };
}

export function clockState(mode: "arrivalClockTime" | "departureClockTime" | "elapsedClockTime", rng: SeededRng): GeneratedState {
  // Exactly three curated states are intentional. The review exporter requires three distinct
  // mathematical states per authority, so every clock authority must expose all three boundaries:
  // exact noon, exact midnight, and a non-zero next-day arrival.
  const cases = [
    { departure: r(645), duration: r(75), boundary: "NOON" as const },
    { departure: r(1350), duration: r(90), boundary: "MIDNIGHT" as const },
    { departure: r(1400), duration: r(185), boundary: "NEXT_DAY" as const },
  ] as const;
  const selected = rng.pick(cases);
  const departure = selected.departure;
  const duration = selected.duration;
  const absoluteArrival = add(departure, duration);
  const arrivalDayOffset = absoluteArrival.numerator >= 1440n ? 1n : 0n;
  const arrivalMinute = rational(absoluteArrival.numerator % 1440n, absoluteArrival.denominator);
  const boundaryNote = selected.boundary === "NOON"
    ? "The journey ends exactly at 12 noon, so AM changes to PM."
    : selected.boundary === "MIDNIGHT"
      ? "The journey ends exactly at 12 midnight, which is 12:00 AM on the next day."
      : "The journey crosses midnight and continues into the next day.";

  if (mode === "arrivalClockTime") {
    return {
      input: { solveMode: mode, departureMinuteOfDay: departure, durationMinutes: duration },
      stem: `A bus starts at ${formatClock(departure, 0n)} and travels for ${toMixedString(duration)} minutes. At what time will it reach its destination?`,
      display: {
        formula: "Arrival time = Starting time + Journey time",
        givens: [`Starting time = ${formatClock(departure, 0n)}`, `Journey time = ${toMixedString(duration)} minutes`, boundaryNote],
        shortcut: "Split the duration into complete hours and remaining minutes. Carry AM to PM at noon and move to the next day after midnight.",
      },
    };
  }
  if (mode === "departureClockTime") {
    return {
      input: { solveMode: mode, arrivalMinuteOfDay: arrivalMinute, arrivalDayOffset, durationMinutes: duration },
      stem: `A bus reaches its destination at ${formatClock(arrivalMinute, arrivalDayOffset)} after a journey of ${toMixedString(duration)} minutes. At what time did it start?`,
      display: {
        formula: "Starting time = Arrival time − Journey time",
        givens: [`Arrival time = ${formatClock(arrivalMinute, arrivalDayOffset)}`, `Journey time = ${toMixedString(duration)} minutes`, boundaryNote],
        shortcut: "Split the duration into hours and minutes and subtract backward. Crossing midnight backward returns to the previous day.",
      },
    };
  }
  return {
    input: { solveMode: mode, departureMinuteOfDay: departure, arrivalMinuteOfDay: arrivalMinute, arrivalDayOffset },
    stem: `A journey starts at ${formatClock(departure, 0n)} and ends at ${formatClock(arrivalMinute, arrivalDayOffset)}. Find the total journey time.`,
    display: {
      unit: "minutes",
      formula: "Journey time = Arrival time − Starting time",
      givens: [`Starting time = ${formatClock(departure, 0n)}`, `Arrival time = ${formatClock(arrivalMinute, arrivalDayOffset)}`, boundaryNote],
      shortcut: "For a next-day journey, count from the start to midnight and then from midnight to arrival. Add the two parts.",
    },
  };
}
