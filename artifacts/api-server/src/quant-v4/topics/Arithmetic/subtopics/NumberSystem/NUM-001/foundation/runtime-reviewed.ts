import { fillSingleDigit, fillTwoDigits, powerOfTen } from "./divisibility";
import { generateNumCp003Prototype as generateBase } from "./runtime";
import type {
  NumCp003GeneratedPrototype,
  NumCp003MisconceptionId,
  NumCp003OptionAudit,
  NumCp003PrototypeId,
} from "./types";

function mathJax(text: string): string {
  return text
    .replace(/\\\((.*?)\\\)/g, "($1)")
    .replace(/\((\d+)\)/g, "\\($1\\)")
    .replace(/\(([^()]*(?: div |lceil |rceil| times | = )[^()]*)\)/g, (_match, inner: string) => {
      const latex = inner
        .replace(/ div /g, " \\div ")
        .replace(/lceil/g, "\\lceil")
        .replace(/rceil/g, "\\rceil")
        .replace(/ times /g, " \\times ");
      return `\\(${latex}\\)`;
    });
}

function row(
  value: string,
  misconceptionId: NumCp003MisconceptionId,
  diagnostic: string,
): NumCp003OptionAudit {
  return { text: value, value, misconceptionId, diagnostic };
}

function parsePair(value: string): [number, number] {
  const match = /^\((\d),\s*(\d)\)$/.exec(value);
  if (!match) throw new Error(`Invalid ordered digit pair: ${value}`);
  return [Number(match[1]), Number(match[2])];
}

function correctDiagnostics(question: NumCp003GeneratedPrototype): NumCp003OptionAudit[] {
  const state = question.hiddenState;
  switch (state.kind) {
    case "DIRECT_COMPOSITE_DIVISIBILITY":
      return question.options.map((value) => {
        const divisor = BigInt(value);
        const remainder = state.number % divisor;
        return remainder === 0n
          ? row(value, "CORRECT", `${state.number} ÷ ${divisor} = ${state.number / divisor} exactly.`)
          : row(value, "NON_ZERO_REMAINDER", `${state.number} ÷ ${divisor} leaves remainder ${remainder}.`);
      });

    case "SINGLE_MISSING_DIGIT":
      if (question.answerSemantic === "DIGIT_COUNT") {
        const correctCount = state.validDigits.length;
        return question.options.map((value) => {
          const count = Number(value);
          if (count === correctCount) {
            return row(value, "CORRECT", `The complete valid set is {${state.validDigits.join(", ")}}, containing ${correctCount} digits.`);
          }
          const id: NumCp003MisconceptionId = count === correctCount - 1
            ? "COUNTED_ONE_FEWER_DIGIT"
            : count === correctCount + 1
              ? "COUNTED_ONE_EXTRA_DIGIT"
              : "COUNTED_INVALID_DIGITS";
          return row(value, id, `The displayed count ${count} does not equal the exhaustive valid-set size ${correctCount}.`);
        });
      }
      return question.options.map((value) => {
        const digit = Number(value);
        const completed = BigInt(fillSingleDigit(state.template, digit));
        const remainder = completed % state.divisor;
        return remainder === 0n
          ? row(value, "CORRECT", `${completed} is divisible by ${state.divisor}.`)
          : row(value, "NON_ZERO_REMAINDER", `Replacing X by ${digit} gives ${completed}, which leaves remainder ${remainder} on division by ${state.divisor}.`);
      });

    case "TWO_MISSING_DIGITS": {
      const answerPair = parsePair(question.answer);
      return question.options.map((value) => {
        const pair = parsePair(value);
        const numeral = BigInt(fillTwoDigits(state.template, pair[0], pair[1]));
        const sumOk = pair[0] + pair[1] === state.requiredDigitSum;
        const firstOk = numeral % state.divisors[0] === 0n;
        const secondOk = numeral % state.divisors[1] === 0n;
        const detail = `${value} gives ${numeral}: digit sum ${pair[0] + pair[1]}, remainders ${numeral % state.divisors[0]} and ${numeral % state.divisors[1]} for divisors ${state.divisors[0]} and ${state.divisors[1]}.`;
        if (value === question.answer) return row(value, "CORRECT", detail);
        if (pair[0] === answerPair[1] && pair[1] === answerPair[0] && answerPair[0] !== answerPair[1]) {
          return row(value, "SWAPPED_DIGIT_ORDER", `${detail} The same digits were placed in the opposite positions.`);
        }
        if (!sumOk) return row(value, "IGNORED_DIGIT_SUM_CONSTRAINT", detail);
        if (firstOk && !secondOk) return row(value, "IGNORED_SECOND_DIVISIBILITY_RULE", detail);
        return row(value, "FAILED_COMBINED_CONSTRAINT_CHECK", detail);
      });
    }

    case "REPEATED_BLOCK":
      return question.options.map((value) => {
        const divisor = BigInt(value);
        const remainder = state.number % divisor;
        return remainder === 0n
          ? row(value, "CORRECT", `${state.number} ÷ ${divisor} = ${state.number / divisor} exactly.`)
          : row(value, "NON_ZERO_REMAINDER", `${state.number} ÷ ${divisor} leaves remainder ${remainder}.`);
      });

    case "LEAST_N_DIGIT_MULTIPLE": {
      const previous = state.answer - state.divisor;
      const wrongComplement = state.lowerBound + (state.lowerBound % state.divisor);
      const upperBoundary = powerOfTen(state.digits);
      return question.options.map((value) => {
        const candidate = BigInt(value);
        if (candidate === state.answer) {
          return row(value, "CORRECT", `${candidate} is divisible by ${state.divisor}, while the previous multiple ${previous} is below ${state.lowerBound}.`);
        }
        if (candidate === previous) {
          return row(value, "USED_PREVIOUS_MULTIPLE", `${candidate} is divisible by ${state.divisor} but lies below the ${state.digits}-digit boundary ${state.lowerBound}.`);
        }
        if (candidate === wrongComplement) {
          return row(value, "ADDED_REMAINDER_INSTEAD_OF_COMPLEMENT", `${candidate} adds the remainder instead of the complement needed to reach the next multiple.`);
        }
        if (candidate >= upperBoundary) {
          return row(value, "USED_N_PLUS_ONE_DIGIT_BOUNDARY", `${candidate} is at or above the first ${state.digits + 1}-digit boundary ${upperBoundary}.`);
        }
        if (candidate > state.answer && candidate % state.divisor === 0n) {
          return row(value, "USED_NEXT_MULTIPLE_AFTER_ANSWER", `${candidate} is a later multiple; ${state.answer} is the first valid number in the range.`);
        }
        return row(value, "ADDED_REMAINDER_INSTEAD_OF_COMPLEMENT", `${candidate} is not the first multiple at or above ${state.lowerBound}.`);
      });
    }
  }
}

export function generateNumCp003Prototype(
  prototypeId: NumCp003PrototypeId,
  seed: string,
): NumCp003GeneratedPrototype {
  const base = generateBase(prototypeId, seed);
  return {
    ...base,
    optionAudit: correctDiagnostics(base),
    explanation: {
      ...base.explanation,
      steps: base.explanation.steps.map(mathJax),
      shortcut: mathJax(base.explanation.shortcut),
      verification: mathJax(base.explanation.verification),
    },
  };
}
