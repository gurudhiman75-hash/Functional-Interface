import { toNumber } from "./math";
import { runAvg001Cp004Pipeline } from "./cp004-runtime";
import type {
  Avg001Language,
  Avg001QuestionPackage,
} from "./types";

function restoreExternalIdentity(
  pkg: Avg001QuestionPackage,
  questionLanguageId: string,
  seed: string,
): Avg001QuestionPackage {
  return {
    ...pkg,
    questionId: `AVG-001:${questionLanguageId}:${seed}`,
    seed,
    parameters: {
      ...pkg.parameters,
      seed,
    },
  };
}

function isCurrencyScenario(pkg: Avg001QuestionPackage) {
  return /Salary|Sales|Revenue|Expense/i.test(
    pkg.parameters.scenarioVariant,
  );
}

function hasWholeCurrencyInputs(pkg: Avg001QuestionPackage) {
  if (!isCurrencyScenario(pkg)) return true;
  const values = pkg.parameters.values;
  return [
    ...(values.groupAverages ?? []),
    values.combinedAverage,
    values.knownGroupAverage,
    values.unknownGroupAverage,
  ]
    .filter((value): value is NonNullable<typeof value> => value != null)
    .every((value) => value.denominator === 1);
}

function hasRealisticCountInputs(pkg: Avg001QuestionPackage) {
  if (pkg.solveMode !== "findGroupCountFromCombinedAverage") return true;

  const averages = pkg.parameters.values.groupAverages?.map(toNumber) ?? [];
  const variant = pkg.parameters.scenarioVariant;
  const range: [number, number] = /Salary|Sales|Revenue|Expense/i.test(variant)
    ? [10000, 100000]
    : /Weight/i.test(variant)
      ? [10, 80]
      : /Age/i.test(variant)
        ? [15, 65]
        : /Marks|Scores/i.test(variant)
          ? [0, 100]
          : /Output/i.test(variant)
            ? [5, 150]
            : /Passengers/i.test(variant)
              ? [5, 100]
              : [1, 200];

  return averages.every((average) => average >= range[0] && average <= range[1]);
}

export function runAvg001Cp004ExactPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001QuestionPackage {
  for (let attempt = 0; attempt < 96; attempt += 1) {
    const internalSeed =
      attempt === 0 ? input.seed : `${input.seed}:cp004-exact-retry:${attempt}`;
    try {
      const pkg = runAvg001Cp004Pipeline({
        ...input,
        seed: internalSeed,
      });
      if (!hasRealisticCountInputs(pkg) || !hasWholeCurrencyInputs(pkg)) {
        continue;
      }
      return restoreExternalIdentity(
        pkg,
        input.questionLanguageId,
        input.seed,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/not exact at (?:1|2) decimal places/.test(message)) throw error;
    }
  }

  throw new Error(
    `Unable to construct an exact and context-realistic CP-004 state for ${input.questionLanguageId}`,
  );
}
