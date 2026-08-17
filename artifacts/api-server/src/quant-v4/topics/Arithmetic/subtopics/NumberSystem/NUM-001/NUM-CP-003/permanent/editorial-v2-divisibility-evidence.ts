import { latexifyNumCp003LearnerText } from "./editorial-v2-math";

const COMPOSITE_PARTS: Readonly<Record<number, readonly number[]>> = Object.freeze({
  6: [2, 3],
  12: [3, 4],
  15: [3, 5],
  18: [2, 9],
  24: [3, 8],
  36: [4, 9],
  45: [5, 9],
  72: [8, 9],
  99: [9, 11],
});

function math(value: string): string {
  return `\\(${value}\\)`;
}

function clean(value: string): string {
  return latexifyNumCp003LearnerText(value.replace(/[ \t]+/gu, " ").trim());
}

function formatInteger(value: bigint | number): string {
  return typeof value === "bigint"
    ? value.toLocaleString("en-IN")
    : Math.trunc(value).toLocaleString("en-IN");
}

function digitSum(text: string): number {
  return [...text].reduce((sum, digit) => sum + Number(digit), 0);
}

function alternatingDifference(text: string): number {
  let first = 0;
  let second = 0;
  [...text].forEach((digit, index) => {
    if (index % 2 === 0) first += Number(digit);
    else second += Number(digit);
  });
  return Math.abs(first - second);
}

function primitiveEvidence(number: bigint, divisor: number): string {
  const digits = number.toString();
  const last = Number(digits.at(-1));
  const suffix2 = Number(digits.slice(-2));
  const suffix3 = Number(digits.slice(-3));

  if (divisor === 2) {
    return last % 2 === 0
      ? `last digit ${math(String(last))} is even`
      : `last digit ${math(String(last))} is odd`;
  }

  if (divisor === 3 || divisor === 9) {
    const sum = digitSum(digits);
    return sum % divisor === 0
      ? `digit sum ${math(String(sum))} is a multiple of ${math(String(divisor))}`
      : `digit sum ${math(String(sum))} is not a multiple of ${math(String(divisor))}`;
  }

  if (divisor === 4) {
    return suffix2 % 4 === 0
      ? `last two digits ${math(String(suffix2))} are divisible by ${math("4")}`
      : `last two digits ${math(String(suffix2))} are not divisible by ${math("4")}`;
  }

  if (divisor === 5) {
    return last === 0 || last === 5
      ? `last digit ${math(String(last))} is ${math("0")} or ${math("5")}`
      : `last digit ${math(String(last))} is neither ${math("0")} nor ${math("5")}`;
  }

  if (divisor === 8) {
    return suffix3 % 8 === 0
      ? `last three digits ${math(String(suffix3))} are divisible by ${math("8")}`
      : `last three digits ${math(String(suffix3))} are not divisible by ${math("8")}`;
  }

  if (divisor === 10) {
    return last === 0
      ? `last digit is ${math("0")}`
      : `last digit ${math(String(last))} is not ${math("0")}`;
  }

  if (divisor === 11) {
    const difference = alternatingDifference(digits);
    return difference % 11 === 0
      ? `alternating-sum difference ${math(String(difference))} is a multiple of ${math("11")}`
      : `alternating-sum difference ${math(String(difference))} is not a multiple of ${math("11")}`;
  }

  if (divisor === 25) {
    return suffix2 % 25 === 0
      ? `last two digits ${math(String(suffix2).padStart(2, "0"))} are divisible by ${math("25")}`
      : `last two digits ${math(String(suffix2).padStart(2, "0"))} are not divisible by ${math("25")}`;
  }

  const d = BigInt(divisor);
  const quotient = number / d;
  const remainder = number % d;
  return remainder === 0n
    ? `${math(`${formatInteger(number)} \\div ${divisor} = ${formatInteger(quotient)}`)} exactly`
    : `${math(`${formatInteger(number)} = ${divisor} \\times ${formatInteger(quotient)} + ${formatInteger(remainder)}`)}`;
}

export function conciseDivisibilityEvidence(number: bigint, divisorValue: bigint | number): string {
  const divisor = Number(divisorValue);
  const parts = COMPOSITE_PARTS[divisor];
  if (parts) {
    const evidence = parts.map((part) => primitiveEvidence(number, part));
    return clean(`${evidence[0]}, and ${evidence[1]}.`);
  }
  return clean(`${primitiveEvidence(number, divisor)}.`);
}

export function conciseDivisibilityCheck(number: bigint, divisorValue: bigint | number): string {
  const divisor = Number(divisorValue);
  return clean(`Check ${math(String(divisor))}: ${conciseDivisibilityEvidence(number, divisor)}`);
}
