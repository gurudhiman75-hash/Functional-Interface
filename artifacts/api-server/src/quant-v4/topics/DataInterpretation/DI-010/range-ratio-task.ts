import { pick, seededRandom } from "../DI-001/exact";
import type { Di010Stimulus } from "./types";
import type { Di010Candidate, Di010Draft } from "./task-builders";

function fmt(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function interval(stimulus: Di010Stimulus, index: number) {
  const item = stimulus.classes[index]!;
  return `${fmt(item.lower)}–${fmt(item.upper)}`;
}

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

export function buildDi010RangeRatioDraft(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const random = seededRandom(`${seed}:range-ratio`);
  const pairs: Array<{ leftStart: number; rightStart: number; leftTotal: number; rightTotal: number }> = [];
  for (let leftStart = 0; leftStart <= stimulus.classes.length - 4; leftStart += 1) {
    for (let rightStart = leftStart + 2; rightStart <= stimulus.classes.length - 2; rightStart += 1) {
      const leftTotal = stimulus.classes.slice(leftStart, leftStart + 2).reduce((sum, item) => sum + item.frequency, 0);
      const rightTotal = stimulus.classes.slice(rightStart, rightStart + 2).reduce((sum, item) => sum + item.frequency, 0);
      if (leftTotal !== rightTotal) pairs.push({ leftStart, rightStart, leftTotal, rightTotal });
    }
  }
  if (!pairs.length) throw new Error("DI-010 range-ratio task could not find two non-equal two-class ranges.");
  const chosen = pick(random, pairs);
  const answer = ratio(chosen.leftTotal, chosen.rightTotal);
  const leftFirst = stimulus.classes[chosen.leftStart]!.frequency;
  const rightFirst = stimulus.classes[chosen.rightStart]!.frequency;
  const leftOmit = stimulus.classes[chosen.leftStart + 1]!.frequency;
  const rightOmit = stimulus.classes[chosen.rightStart + 1]!.frequency;
  const surfaces = [
    `What is the ratio of the combined frequency from ${interval(stimulus, chosen.leftStart)} to ${interval(stimulus, chosen.leftStart + 1)} to the combined frequency from ${interval(stimulus, chosen.rightStart)} to ${interval(stimulus, chosen.rightStart + 1)}?`,
    `Find the ratio: total frequency of classes ${interval(stimulus, chosen.leftStart)} and ${interval(stimulus, chosen.leftStart + 1)} : total frequency of classes ${interval(stimulus, chosen.rightStart)} and ${interval(stimulus, chosen.rightStart + 1)}.`,
    `Compare the two class-pairs ${interval(stimulus, chosen.leftStart)}–${interval(stimulus, chosen.leftStart + 1)} and ${interval(stimulus, chosen.rightStart)}–${interval(stimulus, chosen.rightStart + 1)}. What is the ratio of their total frequencies?`,
  ] as const;
  const surfaceId = Math.floor(random() * surfaces.length);
  const candidates: Di010Candidate[] = [
    { text: ratio(chosen.rightTotal, chosen.leftTotal), misconceptionId: "REVERSE_RANGE_RATIO", derivation: "Reverses the order of the two requested class ranges." },
    { text: ratio(leftFirst, rightFirst), misconceptionId: "USE_ONLY_FIRST_CLASS_IN_EACH_RANGE", derivation: "Uses only the first class frequency from each two-class range." },
    { text: ratio(chosen.leftTotal - leftOmit, chosen.rightTotal), misconceptionId: "OMIT_SECOND_LEFT_CLASS", derivation: "Omits the second class from the first requested range before forming the ratio." },
    { text: ratio(chosen.leftTotal, chosen.rightTotal - rightOmit), misconceptionId: "OMIT_SECOND_RIGHT_CLASS", derivation: "Omits the second class from the second requested range before forming the ratio." },
  ];
  return {
    kind: "RANGE_RATIO_FROM_POLYGON",
    difficulty: "Hard",
    stem: surfaces[surfaceId],
    answer,
    candidates,
    explanation: {
      keyIdea: "Add the two frequencies in each requested range first, then simplify their ratio.",
      steps: [
        `First range: ${stimulus.classes[chosen.leftStart]!.frequency} + ${stimulus.classes[chosen.leftStart + 1]!.frequency} = ${chosen.leftTotal}.`,
        `Second range: ${stimulus.classes[chosen.rightStart]!.frequency} + ${stimulus.classes[chosen.rightStart + 1]!.frequency} = ${chosen.rightTotal}.`,
        `Ratio = ${chosen.leftTotal}:${chosen.rightTotal} = ${answer}.`,
      ],
    },
    evidence: {
      leftStart: chosen.leftStart,
      rightStart: chosen.rightStart,
      leftTotal: chosen.leftTotal,
      rightTotal: chosen.rightTotal,
      surfaceId,
    },
  };
}
