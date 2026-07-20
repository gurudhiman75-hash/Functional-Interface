import ranges from "../variable-ranges.library.json";
import { getAvg001QuestionEntry } from "./library";
import { formatRational, multiply, rational, subtract } from "./math";
import {
  AVG_001_PACKAGE_ID,
  type Avg001Language,
  type Avg001Parameters,
} from "./types";

type ScenarioProfile = {
  counts?: number[];
  averages?: number[];
  scale?: number;
};

function hash(value: string) {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function prng(seed: string) {
  let state = hash(seed) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pick<T>(items: readonly T[], next: () => number) {
  if (!items.length) throw new Error("Cannot pick from an empty AVG-001 range");
  return items[Math.floor(next() * items.length)]!;
}

function scenarioProfile(
  entry: ReturnType<typeof getAvg001QuestionEntry>,
): ScenarioProfile | undefined {
  return (ranges as any).scenarioProfiles?.[
    entry.scenarioVariant
  ] as ScenarioProfile | undefined;
}

function exactAverage(
  entry: ReturnType<typeof getAvg001QuestionEntry>,
  next: () => number,
) {
  const profile = scenarioProfile(entry);
  const defaults = (ranges as any)[entry.difficulty] as {
    averages: number[];
  };
  const base = pick(profile?.averages ?? defaults.averages, next);
  const scale = profile?.scale ?? 1;

  if (entry.displayPolicy === "EXACT_DECIMAL_1") {
    const tenth = pick((ranges as any).decimalTenths as number[], next);
    return rational((base * 10 + tenth) * scale, 10);
  }
  return rational(base * scale);
}

export function generateAvg001Parameters(input: {
  questionLanguageId: string;
  seed: string;
  language?: Avg001Language;
}): Avg001Parameters {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `AVG-001 runtime proof supports English only; received ${language}`,
    );
  }

  const next = prng(`${input.seed}:${entry.qlId}`);
  const profile = scenarioProfile(entry);
  const defaults = (ranges as any)[entry.difficulty] as {
    counts: number[];
  };
  const count = pick(profile?.counts ?? defaults.counts, next);
  const average = exactAverage(entry, next);
  const total = multiply(average, rational(count));

  let knownCount: number | undefined;
  let knownTotal;
  let missingValue;

  if (entry.solveMode === "findMissingValueFromAverage") {
    knownCount = count - 1;
    const averageNumber = average.numerator / average.denominator;
    const minimum = Math.max(1, Math.floor(averageNumber * 0.55));
    const maximum = Math.max(
      minimum + 1,
      Math.floor(averageNumber * 1.45),
    );
    const candidate =
      minimum + Math.floor(next() * (maximum - minimum + 1));

    missingValue =
      entry.displayPolicy === "EXACT_DECIMAL_1"
        ? rational(
            candidate * 10 +
              pick((ranges as any).decimalTenths as number[], next),
            10,
          )
        : rational(candidate);
    knownTotal = subtract(total, missingValue);

    if (knownTotal.numerator <= 0) {
      throw new Error(
        `Constructed non-positive known total for ${entry.qlId}`,
      );
    }
  }

  const renderVariables: Record<string, string | number> = {
    count,
    average: formatRational(average, entry.displayPolicy),
    total: formatRational(total, entry.displayPolicy),
  };
  if (knownCount !== undefined && knownTotal && missingValue) {
    renderVariables.knownCount = knownCount;
    renderVariables.knownTotal = formatRational(
      knownTotal,
      entry.displayPolicy,
    );
    renderVariables.missingValue = formatRational(
      missingValue,
      entry.displayPolicy,
    );
  }

  return {
    packageId: AVG_001_PACKAGE_ID,
    canonicalProblemId: entry.cpId,
    questionLanguageId: entry.qlId,
    seed: input.seed,
    language,
    difficulty: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    displayPolicy: entry.displayPolicy,
    contextDomain: entry.contextDomain,
    scenarioVariant: entry.scenarioVariant,
    values: {
      count,
      average,
      total,
      knownCount,
      knownTotal,
      missingValue,
    },
    renderVariables,
  };
}
