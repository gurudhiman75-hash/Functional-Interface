const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface CoupledInvariantCluster {
  letters: string;
  number: number;
}

export interface CoupledInvariantCandidate {
  backwardStep: number;
  output: CoupledInvariantCluster;
  rendered: string;
}

function position(letter: string): number {
  const value = ALPHABET.indexOf(letter) + 1;
  if (value < 1) throw new Error(`Invalid uppercase letter: ${letter}`);
  return value;
}

function letterAt(value: number): string {
  const normalized = ((value - 1) % 26 + 26) % 26;
  return ALPHABET[normalized];
}

export function clusterTotal(cluster: CoupledInvariantCluster): number {
  if (cluster.letters.length !== 2 || !Number.isSafeInteger(cluster.number)) {
    throw new Error("A coupled-invariant cluster requires two letters and one safe integer.");
  }
  return position(cluster.letters[0]) + position(cluster.letters[1]) + cluster.number;
}

export function enumerateCoupledInvariantCandidates(
  input: CoupledInvariantCluster,
  movementGap = 12,
): readonly CoupledInvariantCandidate[] {
  const total = clusterTotal(input);
  const firstPosition = position(input.letters[0]);
  const secondPosition = position(input.letters[1]);
  const candidates: CoupledInvariantCandidate[] = [];

  for (let backwardStep = 1; backwardStep <= 25; backwardStep += 1) {
    const firstOutput = letterAt(firstPosition - backwardStep);
    const secondOutput = letterAt(secondPosition + backwardStep + movementGap);
    const outputNumber = total - position(firstOutput) - position(secondOutput);
    if (!Number.isSafeInteger(outputNumber) || outputNumber < 0) continue;
    const output = { letters: `${firstOutput}${secondOutput}`, number: outputNumber };
    candidates.push({
      backwardStep,
      output,
      rendered: `${output.letters}${output.number}`,
    });
  }

  return candidates;
}

export function candidateStepsForOutput(
  input: CoupledInvariantCluster,
  expectedOutput: string,
  movementGap = 12,
): readonly number[] {
  return enumerateCoupledInvariantCandidates(input, movementGap)
    .filter((candidate) => candidate.rendered === expectedOutput)
    .map((candidate) => candidate.backwardStep);
}
