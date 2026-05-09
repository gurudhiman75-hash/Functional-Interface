import type {
  DifficultyLabel,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type { OptionResult } from "../shared";
import {
  createReasoningStep,
  ReasoningStep,
  shuffle,
} from "../shared";

type TemporalScenario = {
  stem: string;
  correctAnswer: string;
  explanation: string;
  options: OptionResult;
  reasoningSteps: ReasoningStep[];
  structuralSignature: string;
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const TEMPORAL_MONTH_ODD_DAY_CODES = [
  0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5,
] as const;

export class TemporalCycle {
  static isLeapYear(year: number) {
    return (
      year % 4 === 0 &&
      (year % 100 !== 0 ||
        year % 400 === 0)
    );
  }

  static dayOfWeek(
    day: number,
    month: number,
    year: number,
  ) {
    const monthOffsets = [
      0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4,
    ];
    let adjustedYear = year;
    if (month < 3) {
      adjustedYear -= 1;
    }

    const index =
      (adjustedYear +
        Math.floor(adjustedYear / 4) -
        Math.floor(adjustedYear / 100) +
        Math.floor(adjustedYear / 400) +
        monthOffsets[month - 1]! +
        day) %
      7;

    return DAY_NAMES[index]!;
  }

  static addDays(
    startDay: string,
    dayCount: number,
  ) {
    const index = DAY_NAMES.indexOf(
      startDay as (typeof DAY_NAMES)[number],
    );
    return DAY_NAMES[
      (index + (dayCount % 7) + 7) % 7
    ]!;
  }

  static nextIdenticalCalendarYear(
    year: number,
  ) {
    const leap =
      TemporalCycle.isLeapYear(year);
    let oddDays = 0;
    let candidate = year + 1;

    while (candidate < year + 20) {
      oddDays =
        (oddDays +
          (TemporalCycle.isLeapYear(
            candidate - 1,
          )
            ? 2
            : 1)) %
        7;

      if (
        oddDays === 0 &&
        TemporalCycle.isLeapYear(
          candidate,
        ) === leap
      ) {
        return candidate;
      }

      candidate += 1;
    }

    return candidate;
  }

  static clockAngle(
    hour: number,
    minute: number,
  ) {
    const raw = Math.abs(
      30 * (hour % 12) - 5.5 * minute,
    );
    return raw > 180 ? 360 - raw : raw;
  }

  static overlapMinuteAfterHour(
    hour: number,
  ) {
    return {
      numerator: 60 * (hour % 12),
      denominator: 11,
    };
  }
}

function formatFractionalMinutes(
  numerator: number,
  denominator: number,
) {
  const whole = Math.floor(
    numerator / denominator,
  );
  const remainder =
    numerator % denominator;

  if (!remainder) {
    return `$${whole} \\text{ min}$`;
  }

  if (!whole) {
    return `$\\frac{${remainder}}{${denominator}} \\text{ min}$`;
  }

  return `$${whole}\\frac{${remainder}}{${denominator}} \\text{ min}$`;
}

function buildOptions(
  correct: string,
  distractors: string[],
): OptionResult {
  const metadata: OptionMetadata[] = [
    {
      value: correct,
      isCorrect: true,
    },
  ];

  for (const value of distractors) {
    if (
      value !== correct &&
      !metadata.some(
        (option) =>
          option.value === value,
      )
    ) {
      metadata.push({
        value,
        isCorrect: false,
        distractorType:
          "wrongIntermediateValue",
        likelyMistake:
          "Applied a common time-cycle shortcut incorrectly.",
        reasoningTrap:
          "Temporal reasoning trap.",
      });
    }
  }

  const shuffled = shuffle(
    metadata.slice(0, 4),
  );

  return {
    options: shuffled.map(
      (option) => option.value,
    ),
    correct: shuffled.findIndex(
      (option) => option.isCorrect,
    ),
    optionMetadata: shuffled,
  };
}

function createCalendarDayScenario() {
  const answer =
    TemporalCycle.dayOfWeek(
      15,
      8,
      1947,
    );
  const options = buildOptions(
    answer,
    [
      "Thursday",
      "Saturday",
      "Sunday",
    ],
  );

  return {
    stem:
      "What day of the week was $15\\text{ August }1947$?",
    correctAnswer: answer,
    options,
    explanation:
      "Use the Gregorian odd-day cycle with leap-year correction. Century years are leap only if divisible by $400$. Applying the calendar wheel to $15\\text{ August }1947$ gives Friday.",
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        "Accumulate odd days from year, month, and date components.",
      ),
      createReasoningStep(
        "infer",
        "Reduce total odd days modulo $7$ to identify the weekday.",
      ),
    ],
    structuralSignature:
      "tem-cal-day-find:1947-08-15",
  } satisfies TemporalScenario;
}

function createCalendarShiftScenario() {
  const answer =
    TemporalCycle.addDays(
      "Monday",
      100,
    );
  const options = buildOptions(
    answer,
    [
      "Tuesday",
      "Wednesday",
      "Friday",
    ],
  );

  return {
    stem:
      "If today is Monday, what day will it be after $100$ days?",
    correctAnswer: answer,
    options,
    explanation:
      "The day wheel has period $7$. Since $100 \\equiv 2 \\pmod 7$, move two days after Monday to get Wednesday.",
    reasoningSteps: [
      createReasoningStep(
        "transform",
        "Reduce the day count modulo $7$.",
      ),
    ],
    structuralSignature:
      "tem-cal-ref-shift:100",
  } satisfies TemporalScenario;
}

function createCalendarRepeatScenario() {
  const year = 2021;
  const answer = String(
    TemporalCycle.nextIdenticalCalendarYear(
      year,
    ),
  );
  const options = buildOptions(
    answer,
    ["2026", "2027", "2028"],
  );

  return {
    stem:
      "Which is the next year after $2021$ that has the same calendar as $2021$?",
    correctAnswer: answer,
    options,
    explanation:
      "Add odd days year by year until the accumulated odd days are $0 \\pmod 7$ and the leap/non-leap status also matches. For $2021$, the next matching calendar year is $2027$.",
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        "Step through each year by adding $1$ odd day for ordinary years and $2$ for leap years.",
      ),
      createReasoningStep(
        "compare",
        "Check both weekday alignment and leap-year status.",
      ),
    ],
    structuralSignature:
      "tem-cal-repetition:2021",
  } satisfies TemporalScenario;
}

function createClockAngleScenario() {
  const angle =
    TemporalCycle.clockAngle(10, 15);
  const answer = `$${angle}^{\\circ}$`;
  const options = buildOptions(
    answer,
    [
      `$217.5^{\\circ}$`,
      `$82.5^{\\circ}$`,
      `$127.5^{\\circ}$`,
    ],
  );

  return {
    stem:
      "Find the smaller angle between the hands of a clock at $10:15$.",
    correctAnswer: answer,
    options,
    explanation:
      "$10:15 \\implies \\theta = |30(10)-5.5(15)|=|300-82.5|=217.5^{\\circ}$. The smaller angle is $360^{\\circ}-217.5^{\\circ}=142.5^{\\circ}$.",
    reasoningSteps: [
      createReasoningStep(
        "transform",
        "Use hour hand speed $0.5^{\\circ}/\\text{min}$ and minute hand speed $6^{\\circ}/\\text{min}$.",
      ),
      createReasoningStep(
        "infer",
        "Convert the reflex angle to the smaller angle when needed.",
      ),
    ],
    structuralSignature:
      "tem-clk-angle:10:15",
  } satisfies TemporalScenario;
}

function createClockOverlapScenario() {
  const fraction =
    TemporalCycle.overlapMinuteAfterHour(5);
  const answer =
    formatFractionalMinutes(
      fraction.numerator,
      fraction.denominator,
    );
  const options = buildOptions(
    answer,
    [
      `$27\\frac{5}{11} \\text{ min}$`,
      `$54\\frac{6}{11} \\text{ min}$`,
      `$30 \\text{ min}$`,
    ],
  );

  return {
    stem:
      "At what time between $5$ and $6$ o'clock will the hands of a clock coincide?",
    correctAnswer: answer,
    options,
    explanation:
      "The minute hand gains on the hour hand at $6-0.5=5.5^{\\circ}$ per minute. At $5$ o'clock, the gap is $150^{\\circ}$. Time $=\\frac{150}{5.5}=\\frac{300}{11}=27\\frac{3}{11}$ min.",
    reasoningSteps: [
      createReasoningStep(
        "compare",
        "Compute the angular gap at the hour mark.",
      ),
      createReasoningStep(
        "infer",
        "Divide by relative gain $5.5^{\\circ}/\\text{min}$.",
      ),
    ],
    structuralSignature:
      "tem-clk-overlap:5",
  } satisfies TemporalScenario;
}

function createFaultyClockScenario() {
  const shownMinutes = 22 * 60;
  const trueMinutes =
    (shownMinutes * 60) / 65;
  const hours = Math.floor(
    trueMinutes / 60,
  );
  const minutes = Math.round(
    trueMinutes % 60,
  );
  const answer = `$${hours}\\text{ h }${minutes}\\text{ min}$`;
  const options = buildOptions(
    answer,
    [
      `$22\\text{ h}$`,
      `$20\\text{ h}$`,
      `$21\\text{ h }30\\text{ min}$`,
    ],
  );

  return {
    stem:
      "A clock gains $5$ minutes every hour. It is set right at $8$ AM. What true time has elapsed when it shows $6$ PM the next day?",
    correctAnswer: answer,
    options,
    explanation:
      "Faulty clock rate is $65$ shown minutes per $60$ true minutes. From $8$ AM to shown $6$ PM next day is $22$ shown hours $=1320$ shown minutes. True minutes $=1320\\times\\frac{60}{65}=1218.46$ min, about $20\\text{ h }18\\text{ min}$.",
    reasoningSteps: [
      createReasoningStep(
        "ratio",
        "Convert shown time to true time using the faulty-clock rate.",
      ),
    ],
    structuralSignature:
      "tem-clk-faulty:gain-5",
  } satisfies TemporalScenario;
}

export function createTemporalReasoningScenario(
  motif: QuantMotif,
  _difficulty: DifficultyLabel,
) {
  switch (motif.id) {
    case "tem-cal-day-find":
      return createCalendarDayScenario();
    case "tem-cal-ref-shift":
      return createCalendarShiftScenario();
    case "tem-cal-repetition":
      return createCalendarRepeatScenario();
    case "tem-clk-angle":
      return createClockAngleScenario();
    case "tem-clk-overlap":
      return createClockOverlapScenario();
    case "tem-clk-faulty":
      return createFaultyClockScenario();
    default:
      return createClockAngleScenario();
  }
}
