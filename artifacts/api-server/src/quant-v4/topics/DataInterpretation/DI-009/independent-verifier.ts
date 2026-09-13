import type { Di009HistogramBin, Di009Question, Di009QuestionSet } from "./types";

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function ratio(left: number, right: number) {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}

function decimal(numerator: number, denominator: number) {
  const hundredths = Math.floor((Math.abs(numerator) * 100 + denominator / 2) / denominator);
  const sign = numerator < 0 ? "-" : "";
  const whole = Math.floor(hundredths / 100);
  const fraction = hundredths % 100;
  if (fraction === 0) return `${sign}${whole}`;
  if (fraction % 10 === 0) return `${sign}${whole}.${fraction / 10}`;
  return `${sign}${whole}.${String(fraction).padStart(2, "0")}`;
}

function percent(part: number, whole: number) {
  return `${decimal(part * 100, whole)}%`;
}

function interval(bin: Di009HistogramBin) {
  return `${bin.lower}–${bin.upper}`;
}

function sumRange(bins: readonly Di009HistogramBin[], start: number, end: number) {
  let total = 0;
  for (let index = start; index <= end; index += 1) total += bins[index]!.frequency;
  return total;
}

function expected(question: Di009Question, bins: readonly Di009HistogramBin[]): string {
  switch (question.kind) {
    case "DIRECT_CLASS_FREQUENCY":
      return String(bins[Number(question.evidence.targetIndex)]!.frequency);
    case "COMBINED_RANGE_TOTAL":
      return String(sumRange(bins, Number(question.evidence.startIndex), Number(question.evidence.endIndex)));
    case "RANGE_RATIO": {
      const left = sumRange(bins, Number(question.evidence.leftStart), Number(question.evidence.leftEnd));
      const right = sumRange(bins, Number(question.evidence.rightStart), Number(question.evidence.rightEnd));
      return ratio(left, right);
    }
    case "CLASS_SHARE_OF_TOTAL": {
      const index = Number(question.evidence.targetIndex);
      const total = bins.reduce((sum, bin) => sum + bin.frequency, 0);
      return percent(bins[index]!.frequency, total);
    }
    case "MODAL_CLASS_IDENTIFICATION": {
      let modalIndex = 0;
      for (let index = 1; index < bins.length; index += 1) if (bins[index]!.frequency > bins[modalIndex]!.frequency) modalIndex = index;
      return interval(bins[modalIndex]!);
    }
    case "APPROX_GROUPED_MEAN_FROM_HISTOGRAM": {
      const doubledWeighted = bins.reduce((sum, bin) => sum + (bin.lower + bin.upper) * bin.frequency, 0);
      const total = bins.reduce((sum, bin) => sum + bin.frequency, 0);
      return decimal(doubledWeighted, 2 * total);
    }
  }
}

export function independentlyVerifyDi009QuestionSet(set: Di009QuestionSet): boolean {
  if (set.packageId !== "DI-009" || set.stimulus.kind !== "HISTOGRAM") return false;
  if (set.stimulus.bins.length !== 6 || set.questions.length !== 6 || set.optionCount !== 4) return false;
  for (const question of set.questions) {
    const answer = expected(question, set.stimulus.bins);
    if (question.answer !== answer) return false;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) return false;
    if (question.options.filter((option) => option === answer).length !== 1) return false;
    if (question.options[question.correctIndex] !== answer) return false;
  }
  return true;
}
