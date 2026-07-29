import { rational } from "./foundation/rational";
import {
  asRecord,
  readRational,
} from "./cp001-localization-foundation";
import {
  buildIntCp001ReadableStem,
  type IntCp001ReadableStemResult,
} from "./cp001-readable-stem-builder";
import type { IntCp001ReadableLanguage } from "./cp001-readable-stem-release";

function normaliseReadableSourceParameters(sourceParameters: unknown): unknown {
  const parameters = asRecord(sourceParameters) ?? {};
  const hidden = asRecord(parameters.hiddenState) ?? {};

  const simpleInterest = readRational(hidden, "simpleInterest")
    ?? readRational(hidden, "laterInterest")
    ?? readRational(hidden, "annualInterest")
    ?? rational(0);
  const amount = readRational(hidden, "amount")
    ?? readRational(hidden, "laterAmount")
    ?? readRational(hidden, "earlierAmount")
    ?? rational(0);
  const timeYears = readRational(hidden, "timeYears")
    ?? readRational(hidden, "laterTimeYears")
    ?? readRational(hidden, "earlierTimeYears")
    ?? rational(0);

  return {
    ...parameters,
    hiddenState: {
      ...hidden,
      simpleInterest,
      amount,
      timeYears,
    },
  };
}

export function buildIntCp001ReadableStemSafe(
  solveContract: string,
  sourceParameters: unknown,
  language: IntCp001ReadableLanguage,
): IntCp001ReadableStemResult {
  return buildIntCp001ReadableStem(
    solveContract,
    normaliseReadableSourceParameters(sourceParameters),
    language,
  );
}
