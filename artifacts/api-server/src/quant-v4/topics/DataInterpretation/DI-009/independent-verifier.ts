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

function whole(numerator: number, denominator: number) {
  return String(Math.round(numerator / denominator));
}

function percent(part: number, total: number) {
  return `${whole(part * 100, total)}%`;
}

function interval(bin: Di009HistogramBin) {
  return `${bin.lower}–${bin.upper}`;
}

function sumRange(bins: readonly Di009HistogramBin[], start: number, end: number) {
  let total = 0;
  for (let index = start; index <= end; index += 1) total += bins[index]!.frequency;
  return total;
}

function cumulative(bins: readonly Di009HistogramBin[]) {
  let running = 0;
  return bins.map((bin) => (running += bin.frequency));
}

function modalIndexOf(bins: readonly Di009HistogramBin[]) {
  let modalIndex = 0;
  for (let index = 1; index < bins.length; index += 1) {
    if (bins[index]!.frequency > bins[modalIndex]!.frequency) modalIndex = index;
  }
  return modalIndex;
}

function expected(question: Di009Question, bins: readonly Di009HistogramBin[], classWidth: number): string {
  const total = bins.reduce((sum, bin) => sum + bin.frequency, 0);
  switch (question.kind) {
    case "DIRECT_CLASS_FREQUENCY":
      return String(bins[Number(question.evidence.targetIndex)]!.frequency);
    case "TOTAL_FREQUENCY":
      return String(total);
    case "COMBINED_RANGE_TOTAL":
      return String(sumRange(bins, Number(question.evidence.startIndex), Number(question.evidence.endIndex)));
    case "ABOVE_BOUNDARY_TOTAL":
      return String(sumRange(bins, Number(question.evidence.startIndex), bins.length - 1));
    case "BELOW_BOUNDARY_TOTAL":
      return String(sumRange(bins, 0, Number(question.evidence.endExclusive) - 1));
    case "RANGE_RATIO": {
      const left = sumRange(bins, Number(question.evidence.leftStart), Number(question.evidence.leftEnd));
      const right = sumRange(bins, Number(question.evidence.rightStart), Number(question.evidence.rightEnd));
      return ratio(left, right);
    }
    case "CLASS_SHARE_OF_TOTAL": {
      const index = Number(question.evidence.targetIndex);
      return percent(bins[index]!.frequency, total);
    }
    case "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES": {
      const left = bins[Number(question.evidence.leftIndex)]!.frequency;
      const right = bins[Number(question.evidence.rightIndex)]!.frequency;
      return String(Math.abs(left - right));
    }
    case "MODAL_CLASS_IDENTIFICATION":
      return interval(bins[modalIndexOf(bins)]!);
    case "MEDIAN_CLASS_IDENTIFICATION": {
      const cf = cumulative(bins);
      const target = total / 2;
      const index = cf.findIndex((value) => value >= target);
      return interval(bins[index]!);
    }
    case "KTH_OBSERVATION_CLASS": {
      const cf = cumulative(bins);
      const rank = Number(question.evidence.rank);
      const index = cf.findIndex((value) => value >= rank);
      return interval(bins[index]!);
    }
    case "APPROX_GROUPED_MEAN_FROM_HISTOGRAM": {
      const doubledWeighted = bins.reduce((sum, bin) => sum + (bin.lower + bin.upper) * bin.frequency, 0);
      return whole(doubledWeighted, 2 * total);
    }
    case "APPROX_GROUPED_MODE_FROM_HISTOGRAM": {
      const modalIndex = modalIndexOf(bins);
      if (modalIndex <= 0 || modalIndex >= bins.length - 1) throw new Error("Grouped mode selected with an edge modal class.");
      const modal = bins[modalIndex]!;
      const f0 = bins[modalIndex - 1]!.frequency;
      const f1 = modal.frequency;
      const f2 = bins[modalIndex + 1]!.frequency;
      const denominator = 2 * f1 - f0 - f2;
      return whole(modal.lower * denominator + (f1 - f0) * classWidth, denominator);
    }
  }
}

export function independentlyVerifyDi009QuestionSet(set: Di009QuestionSet): boolean {
  if (set.packageId !== "DI-009" || set.stimulus.kind !== "HISTOGRAM") return false;
  if (set.stimulus.bins.length < 5 || set.stimulus.bins.length > 9 || set.questions.length !== 5 || set.optionCount !== 4) return false;
  if (new Set(set.questions.map((question) => question.kind)).size !== set.questions.length) return false;
  for (const question of set.questions) {
    let answer: string;
    try {
      answer = expected(question, set.stimulus.bins, set.stimulus.classWidth);
    } catch {
      return false;
    }
    if (question.answer !== answer) return false;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) return false;
    if (question.options.filter((option) => option === answer).length !== 1) return false;
    if (question.options[question.correctIndex] !== answer) return false;
  }
  return true;
}
