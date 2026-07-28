export interface ChangingVectorFixture {
  fixtureId: string;
  inputClusters: readonly [string, string, string];
  outputClusters: readonly [string, string, string];
  inputNumbers: readonly [number, number, number];
  outputNumbers: readonly [number, number, number];
  publishedOptions: readonly string[];
  publishedAnswer: string;
  qlIds: readonly [];
}

export interface ModularVectorDescriptor {
  start: number;
  step: number;
  vector: readonly [number, number, number];
}

export interface MetaRecurrenceCandidate {
  multiplier: number;
  initialStartDecrement: number;
  middleStart: number;
  middleStep: number;
  middleVector: readonly [number, number, number];
  targetLetters: string;
  targetCluster: string;
}

export const ANA_CP009_CHANGING_VECTOR_FIXTURE: ChangingVectorFixture = {
  fixtureId: "ANA-CP009-SF-001",
  inputClusters: ["ZKX", "XYR", "LST"],
  outputClusters: ["UHW", "OVU", "QPI"],
  inputNumbers: [102, 126, 305],
  outputNumbers: [204, 252, 610],
  publishedOptions: ["OWU252", "OUU232", "OVU252", "UVO242"],
  publishedAnswer: "OVU252",
  qlIds: [],
};

export function mod26(value: number): number {
  return ((value % 26) + 26) % 26;
}

function letterIndex(letter: string): number {
  if (!/^[A-Z]$/.test(letter)) throw new Error(`Invalid uppercase letter: ${letter}`);
  return letter.charCodeAt(0) - 65;
}

function shiftedLetter(letter: string, forwardShift: number): string {
  return String.fromCharCode(65 + mod26(letterIndex(letter) + forwardShift));
}

export function deriveForwardVector(input: string, output: string): readonly [number, number, number] {
  if (!/^[A-Z]{3}$/.test(input) || !/^[A-Z]{3}$/.test(output)) {
    throw new Error("Changing-vector pilot requires two three-letter uppercase clusters.");
  }
  return [
    mod26(letterIndex(output[0]) - letterIndex(input[0])),
    mod26(letterIndex(output[1]) - letterIndex(input[1])),
    mod26(letterIndex(output[2]) - letterIndex(input[2])),
  ];
}

export function describeModularArithmeticVector(
  vector: readonly [number, number, number],
): ModularVectorDescriptor | null {
  const firstStep = mod26(vector[1] - vector[0]);
  const secondStep = mod26(vector[2] - vector[1]);
  if (firstStep !== secondStep) return null;
  return { start: vector[0], step: firstStep, vector };
}

export function applyForwardVector(
  input: string,
  vector: readonly [number, number, number],
): string {
  if (!/^[A-Z]{3}$/.test(input)) throw new Error(`Invalid input cluster: ${input}`);
  return [...input].map((letter, index) => shiftedLetter(letter, vector[index])).join("");
}

export function enumerateAnchorCompatibleMetaRecurrences(): readonly MetaRecurrenceCandidate[] {
  const fixture = ANA_CP009_CHANGING_VECTOR_FIXTURE;
  const firstVector = deriveForwardVector(fixture.inputClusters[0], fixture.outputClusters[0]);
  const thirdVector = deriveForwardVector(fixture.inputClusters[2], fixture.outputClusters[2]);
  const first = describeModularArithmeticVector(firstVector);
  const third = describeModularArithmeticVector(thirdVector);
  if (!first || !third) throw new Error("Both anchor vectors must be modular arithmetic progressions.");

  const candidates: MetaRecurrenceCandidate[] = [];
  for (let multiplier = 0; multiplier < 26; multiplier += 1) {
    if (mod26(first.step * multiplier * multiplier) !== third.step) continue;
    for (let initialStartDecrement = 0; initialStartDecrement < 26; initialStartDecrement += 1) {
      const middleStart = mod26(first.start - initialStartDecrement);
      const projectedThirdStart = mod26(middleStart - multiplier * initialStartDecrement);
      if (projectedThirdStart !== third.start) continue;
      const middleStep = mod26(first.step * multiplier);
      const middleVector = [
        middleStart,
        mod26(middleStart + middleStep),
        mod26(middleStart + 2 * middleStep),
      ] as const;
      const targetLetters = applyForwardVector(fixture.inputClusters[1], middleVector);
      candidates.push({
        multiplier,
        initialStartDecrement,
        middleStart,
        middleStep,
        middleVector,
        targetLetters,
        targetCluster: `${targetLetters}${fixture.outputNumbers[1]}`,
      });
    }
  }
  return candidates;
}
