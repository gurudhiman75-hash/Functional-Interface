const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

export function letterAtOneBased(position: number): string {
  return ALPHABET[mod(position - 1, 26)]!;
}

export function oneBasedPosition(letter: string): number {
  const index = ALPHABET.indexOf(letter.toUpperCase());
  if (index < 0) throw new Error(`Invalid English alphabet letter: ${letter}`);
  return index + 1;
}

export function independentlyContinueSingleLetterProgression(input: {
  readonly start: string;
  readonly firstJump: number;
  readonly jumpIncrement: number;
  readonly transitionCount: number;
}): string {
  let position = oneBasedPosition(input.start);
  for (let transition = 0; transition < input.transitionCount; transition += 1) {
    position += input.firstJump + input.jumpIncrement * transition;
  }
  return letterAtOneBased(position);
}

export function independentlyContinueInterleavedLetterRows(input: {
  readonly rowStarts: readonly string[];
  readonly rowJumps: readonly number[];
  readonly completedCycles: number;
}): readonly string[] {
  if (input.rowStarts.length !== input.rowJumps.length) {
    throw new Error("Interleaved Series row shape mismatch.");
  }
  return input.rowStarts.map((start, row) =>
    letterAtOneBased(
      oneBasedPosition(start) + input.rowJumps[row]! * input.completedCycles,
    ),
  );
}

export function independentlyContinueAlphanumericParallel(input: {
  readonly letter: string;
  readonly number: number;
  readonly letterJump: number;
  readonly numberJump: number;
  readonly transitions: number;
}): { readonly letter: string; readonly number: number } {
  return {
    letter: letterAtOneBased(
      oneBasedPosition(input.letter) + input.letterJump * input.transitions,
    ),
    number: input.number + input.numberJump * input.transitions,
  };
}

export function independentlyContinueAlphanumericInterleaved(input: {
  readonly targetRowStartLetter: string;
  readonly targetRowStartNumber: number;
  readonly targetRowLetterJump: number;
  readonly targetRowNumberJump: number;
  readonly completedTargetRowTransitions: number;
}): { readonly letter: string; readonly number: number } {
  return independentlyContinueAlphanumericParallel({
    letter: input.targetRowStartLetter,
    number: input.targetRowStartNumber,
    letterJump: input.targetRowLetterJump,
    numberJump: input.targetRowNumberJump,
    transitions: input.completedTargetRowTransitions,
  });
}

export function independentlyContinueClusterNumber(input: {
  readonly letters: readonly [string, string];
  readonly number: number;
  readonly letterJumps: readonly [number, number];
  readonly numberJump: number;
  readonly transitions: number;
}): { readonly letters: readonly [string, string]; readonly number: number } {
  return {
    letters: [
      letterAtOneBased(
        oneBasedPosition(input.letters[0]) + input.letterJumps[0] * input.transitions,
      ),
      letterAtOneBased(
        oneBasedPosition(input.letters[1]) + input.letterJumps[1] * input.transitions,
      ),
    ],
    number: input.number + input.numberJump * input.transitions,
  };
}
