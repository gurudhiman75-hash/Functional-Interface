const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function rotateLeft(token: string, amount: number): string {
  const safe = mod(amount, token.length);
  return token.slice(safe) + token.slice(0, safe);
}

function allSameWidth(terms: readonly string[]): boolean {
  return terms.length >= 2 && new Set(terms.map((term) => term.length)).size === 1;
}

function modalFrame(terms: readonly string[]): string | null {
  if (!allSameWidth(terms)) return null;
  const width = terms[0]!.length;
  const output: string[] = [];
  for (let column = 0; column < width; column += 1) {
    const counts = new Map<string, number>();
    for (const term of terms) {
      const character = term[column]!;
      counts.set(character, (counts.get(character) ?? 0) + 1);
    }
    const ordered = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    if (ordered.length > 1 && ordered[0]![1] === ordered[1]![1]) return null;
    output.push(ordered[0]![0]);
  }
  return output.join("");
}

export interface MarkerInference {
  readonly backgroundFrame: string;
  readonly marker: string;
  readonly positions: readonly number[];
  readonly step: number;
  readonly direction: 1 | -1;
  readonly wrap: boolean;
}

export function inferMarkerMotion(
  terms: readonly string[],
): MarkerInference | null {
  if (terms.length < 4 || !allSameWidth(terms)) return null;
  const backgroundFrame = modalFrame(terms);
  if (!backgroundFrame) return null;

  const positions: number[] = [];
  const markers: string[] = [];
  let markerWidth: number | null = null;

  for (const term of terms) {
    const differences = Array.from({ length: term.length }, (_, index) => index).filter(
      (index) => term[index] !== backgroundFrame[index],
    );
    if (differences.length === 0) return null;
    const first = differences[0]!;
    const last = differences.at(-1)!;
    if (last - first + 1 !== differences.length) return null;
    markerWidth ??= differences.length;
    if (markerWidth !== differences.length) return null;
    positions.push(first);
    markers.push(term.slice(first, last + 1));
  }

  if (new Set(markers).size !== 1 || markerWidth === null) return null;
  const marker = markers[0]!;
  const linearDeltas = positions.slice(0, -1).map(
    (position, index) => positions[index + 1]! - position,
  );
  if (
    new Set(linearDeltas).size === 1 &&
    linearDeltas[0] !== 0 &&
    Math.abs(linearDeltas[0]!) <= 3
  ) {
    const delta = linearDeltas[0]!;
    return {
      backgroundFrame,
      marker,
      positions,
      step: Math.abs(delta),
      direction: delta > 0 ? 1 : -1,
      wrap: false,
    };
  }

  const domainLength = terms[0]!.length - markerWidth + 1;
  for (const direction of [1, -1] as const) {
    for (let step = 1; step <= 3; step += 1) {
      if (
        positions.slice(0, -1).every(
          (position, index) =>
            mod(position + direction * step, domainLength) === positions[index + 1],
        )
      ) {
        return {
          backgroundFrame,
          marker,
          positions,
          step,
          direction,
          wrap: true,
        };
      }
    }
  }
  return null;
}

export interface SubstitutionInference {
  readonly side: "PREFIX" | "SUFFIX";
  readonly positionsPerStep: number;
  readonly transitionRanges: readonly (readonly number[])[];
}

export function inferProgressiveSubstitution(
  terms: readonly string[],
): SubstitutionInference | null {
  if (terms.length < 4 || !allSameWidth(terms)) return null;
  const transitionRanges = terms.slice(0, -1).map((term, transitionIndex) =>
    Array.from({ length: term.length }, (_, index) => index).filter(
      (index) => term[index] !== terms[transitionIndex + 1]![index],
    ),
  );
  if (transitionRanges.some((range) => range.length === 0)) return null;
  const widths = transitionRanges.map((range) => range.length);
  if (new Set(widths).size !== 1) return null;
  for (const range of transitionRanges) {
    if (range.at(-1)! - range[0]! + 1 !== range.length) return null;
  }

  const starts = transitionRanges.map((range) => range[0]!);
  const step = widths[0]!;
  const startDeltas = starts.slice(0, -1).map(
    (start, index) => starts[index + 1]! - start,
  );
  let side: "PREFIX" | "SUFFIX";
  if (startDeltas.every((delta) => delta === step)) side = "PREFIX";
  else if (startDeltas.every((delta) => delta === -step)) side = "SUFFIX";
  else return null;

  for (let transition = 0; transition < transitionRanges.length; transition += 1) {
    for (const index of transitionRanges[transition]!) {
      const changedValue = terms[transition + 1]![index]!;
      for (let later = transition + 1; later < terms.length; later += 1) {
        if (terms[later]![index] !== changedValue) return null;
      }
    }
  }

  return {
    side,
    positionsPerStep: step,
    transitionRanges,
  };
}

export function hasConstantRotation(terms: readonly string[]): boolean {
  if (!allSameWidth(terms)) return false;
  const width = terms[0]!.length;
  for (let amount = 1; amount < width; amount += 1) {
    if (
      terms.slice(0, -1).every(
        (term, index) => rotateLeft(term, amount) === terms[index + 1],
      )
    ) {
      return true;
    }
  }
  return false;
}

export function hasFixedPositionPermutation(terms: readonly string[]): boolean {
  if (!allSameWidth(terms)) return false;
  const width = terms[0]!.length;
  const candidates = Array.from({ length: width }, (_, outputIndex) =>
    Array.from({ length: width }, (_, inputIndex) => inputIndex).filter(
      (inputIndex) =>
        terms.slice(0, -1).every(
          (term, transitionIndex) =>
            term[inputIndex] === terms[transitionIndex + 1]![outputIndex],
        ),
    ),
  );
  const inputToOutput = Array<number | null>(width).fill(null);
  const visit = (outputIndex: number, seen: Set<number>): boolean => {
    for (const inputIndex of candidates[outputIndex]!) {
      if (seen.has(inputIndex)) continue;
      seen.add(inputIndex);
      const previousOutput = inputToOutput[inputIndex];
      if (previousOutput === null || visit(previousOutput, seen)) {
        inputToOutput[inputIndex] = outputIndex;
        return true;
      }
    }
    return false;
  };
  return Array.from({ length: width }, (_, outputIndex) => outputIndex).every(
    (outputIndex) => visit(outputIndex, new Set()),
  );
}

function uppercaseRank(character: string): number | null {
  return /^[A-Z]$/.test(character) ? ALPHABET.indexOf(character) : null;
}

export function hasColumnwiseFixedMovement(terms: readonly string[]): boolean {
  if (terms.length < 3 || !allSameWidth(terms)) return false;
  const width = terms[0]!.length;
  for (let column = 0; column < width; column += 1) {
    const differences: number[] = [];
    for (let index = 0; index < terms.length - 1; index += 1) {
      const from = uppercaseRank(terms[index]![column]!);
      const to = uppercaseRank(terms[index + 1]![column]!);
      if (from === null || to === null) return false;
      differences.push(mod(to - from, 26));
    }
    if (new Set(differences).size !== 1) return false;
  }
  return true;
}

export interface WaveEClassification {
  readonly fixedWidth: boolean;
  readonly markerMotion: MarkerInference | null;
  readonly progressiveSubstitution: SubstitutionInference | null;
  readonly cyclicRotation: boolean;
  readonly fixedPositionPermutation: boolean;
  readonly columnwiseFixedMovement: boolean;
}

export function classifySerCp007WaveESequence(
  terms: readonly string[],
): WaveEClassification {
  return {
    fixedWidth: allSameWidth(terms),
    markerMotion: inferMarkerMotion(terms),
    progressiveSubstitution: inferProgressiveSubstitution(terms),
    cyclicRotation: hasConstantRotation(terms),
    fixedPositionPermutation: hasFixedPositionPermutation(terms),
    columnwiseFixedMovement: hasColumnwiseFixedMovement(terms),
  };
}
