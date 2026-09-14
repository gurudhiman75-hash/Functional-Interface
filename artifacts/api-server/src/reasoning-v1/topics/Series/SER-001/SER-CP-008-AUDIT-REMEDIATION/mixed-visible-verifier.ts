import { letterAtOneBased, oneBasedPosition } from "./independent-solver";
import type { SerCp008MixedQlId } from "./question-language";

function lastLine(stem: string): string {
  return stem.split("\n").at(-1)?.trim() ?? stem.trim();
}

function signedAlphabetStep(from: string, to: string): number {
  let delta = oneBasedPosition(to) - oneBasedPosition(from);
  if (delta > 13) delta -= 26;
  if (delta < -13) delta += 26;
  return delta;
}

function commaTerms(stem: string): string[] {
  return lastLine(stem).split(",").map((value) => value.trim()).filter(Boolean);
}

function parseLetterNumber(value: string): { letter: string; number: number } {
  const match = value.match(/^([A-Z])(\d+)$/);
  if (!match) throw new Error(`Invalid letter-number term: ${value}`);
  return { letter: match[1]!, number: Number(match[2]) };
}

function parseNumberLetter(value: string): { number: number; letter: string } {
  const match = value.match(/^(\d+)([A-Z])$/);
  if (!match) throw new Error(`Invalid number-letter term: ${value}`);
  return { number: Number(match[1]), letter: match[2]! };
}

function parseTwoLetterNumber(value: string): { first: string; second: string; number: number } {
  const match = value.match(/^([A-Z])([A-Z])(\d+)$/);
  if (!match) throw new Error(`Invalid two-letter-number term: ${value}`);
  return { first: match[1]!, second: match[2]!, number: Number(match[3]) };
}

function parseLetterNumberLetter(value: string): { first: string; number: number; second: string } {
  const match = value.match(/^([A-Z])(\d+)([A-Z])$/);
  if (!match) throw new Error(`Invalid letter-number-letter term: ${value}`);
  return { first: match[1]!, number: Number(match[2]), second: match[3]! };
}

export function independentlySolveVisibleSerCp008Mixed(
  qlId: SerCp008MixedQlId,
  stem: string,
): string {
  if (qlId === "SER-QL-019") {
    const terms = commaTerms(stem);
    const target = terms.at(-1)?.match(/^([A-Z])\?$/);
    if (!target) throw new Error("QL019 target is malformed.");
    for (const term of terms.slice(0, -1)) {
      const parsed = parseLetterNumber(term);
      if (parsed.number !== oneBasedPosition(parsed.letter)) throw new Error("QL019 visible binding is inconsistent.");
    }
    return String(oneBasedPosition(target[1]!));
  }

  if (qlId === "SER-QL-020") {
    const terms = commaTerms(stem);
    for (const term of terms.slice(0, -1)) {
      const parsed = parseLetterNumberLetter(term);
      if (parsed.number !== oneBasedPosition(parsed.first) + oneBasedPosition(parsed.second)) {
        throw new Error("QL020 visible sum binding is inconsistent.");
      }
    }
    const target = terms.at(-1)?.match(/^([A-Z])\?([A-Z])$/);
    if (!target) throw new Error("QL020 target is malformed.");
    return String(oneBasedPosition(target[1]!) + oneBasedPosition(target[2]!));
  }

  if (qlId === "SER-QL-021") {
    const terms = commaTerms(stem);
    if (terms.length !== 5 || terms[3] !== "?") throw new Error("QL021 must contain one internal missing term.");
    const first = parseTwoLetterNumber(terms[0]!);
    const second = parseTwoLetterNumber(terms[1]!);
    const third = parseTwoLetterNumber(terms[2]!);
    const fifth = parseTwoLetterNumber(terms[4]!);
    const firstJumpA = signedAlphabetStep(first.first, second.first);
    const secondJumpA = signedAlphabetStep(second.first, third.first);
    const firstJumpB = signedAlphabetStep(first.second, second.second);
    const secondJumpB = signedAlphabetStep(second.second, third.second);
    if (firstJumpA !== secondJumpA || firstJumpB !== secondJumpB) throw new Error("QL021 letter channels are not fixed-step.");
    const gap1 = second.number - first.number;
    const gap2 = third.number - second.number;
    const increment = gap2 - gap1;
    const missingNumber = third.number + gap2 + increment;
    const missing = `${letterAtOneBased(oneBasedPosition(third.first) + firstJumpA)}${letterAtOneBased(oneBasedPosition(third.second) + firstJumpB)}${missingNumber}`;
    const expectedFifth = parseTwoLetterNumber(`${letterAtOneBased(oneBasedPosition(third.first) + firstJumpA * 2)}${letterAtOneBased(oneBasedPosition(third.second) + firstJumpB * 2)}${missingNumber + gap2 + 2 * increment}`);
    if (expectedFifth.first !== fifth.first || expectedFifth.second !== fifth.second || expectedFifth.number !== fifth.number) {
      throw new Error("QL021 trailing evidence does not confirm the inferred progression.");
    }
    return missing;
  }

  if (qlId === "SER-QL-022") {
    const terms = commaTerms(stem);
    if (terms.at(-1) !== "?" || terms.length !== 5) throw new Error("QL022 visible series is malformed.");
    const states = terms.slice(0, -1).map(parseNumberLetter);
    const numberGaps = states.slice(1).map((state, index) => state.number - states[index]!.number);
    const letterGaps = states.slice(1).map((state, index) => signedAlphabetStep(states[index]!.letter, state.letter));
    const numberIncrement = numberGaps[1]! - numberGaps[0]!;
    const letterIncrement = letterGaps[1]! - letterGaps[0]!;
    if (numberGaps[2]! - numberGaps[1]! !== numberIncrement || letterGaps[2]! - letterGaps[1]! !== letterIncrement) {
      throw new Error("QL022 jumps are not progressively consistent.");
    }
    const last = states.at(-1)!;
    return `${last.number + numberGaps.at(-1)! + numberIncrement}${letterAtOneBased(oneBasedPosition(last.letter) + letterGaps.at(-1)! + letterIncrement)}`;
  }

  if (qlId === "SER-QL-023") {
    const terms = commaTerms(stem);
    if (terms.at(-1) !== "?" || terms.length < 5) throw new Error("QL023 visible series is malformed.");
    const states = terms.slice(0, -1).map(parseLetterNumber);
    const roots = states.map((state) => Math.sqrt(state.number));
    if (roots.some((root) => !Number.isInteger(root))) throw new Error("QL023 contains a non-square number.");
    for (let index = 0; index < states.length; index += 1) {
      if (states[index]!.letter !== letterAtOneBased(states[index]!.number)) throw new Error("QL023 letter-square coupling is inconsistent.");
    }
    const direction = roots[1]! - roots[0]!;
    if (Math.abs(direction) !== 1 || roots.slice(1).some((root, index) => root - roots[index]! !== direction)) {
      throw new Error("QL023 roots are not consecutive.");
    }
    const nextRoot = roots.at(-1)! + direction;
    const square = nextRoot * nextRoot;
    return `${letterAtOneBased(square)}${square}`;
  }

  if (qlId === "SER-QL-024") {
    const terms = commaTerms(stem);
    if (terms.at(-1) !== "?" || terms.length < 4) throw new Error("QL024 visible series is malformed.");
    const states = terms.slice(0, -1).map(parseLetterNumber);
    for (const state of states) {
      const position = oneBasedPosition(state.letter);
      if (state.number !== position * position) throw new Error("QL024 number is not the square of the displayed letter position.");
    }
    const jumps = states.slice(1).map((state, index) => oneBasedPosition(state.letter) - oneBasedPosition(states[index]!.letter));
    if (new Set(jumps).size !== 1) throw new Error("QL024 letter step is not fixed.");
    const nextPosition = oneBasedPosition(states.at(-1)!.letter) + jumps[0]!;
    return `${letterAtOneBased(nextPosition)}${nextPosition * nextPosition}`;
  }

  if (qlId === "SER-QL-025") {
    const terms = commaTerms(stem);
    if (terms.length !== 5) throw new Error("QL025 must show five terms.");
    const states = terms.map(parseLetterNumber);
    const letterJumps = states.slice(1).map((state, index) => oneBasedPosition(state.letter) - oneBasedPosition(states[index]!.letter));
    if (new Set(letterJumps).size !== 1) throw new Error("QL025 letter channel is not fixed-step.");
    const startRoot = Math.sqrt(states[0]!.number);
    if (!Number.isInteger(startRoot)) throw new Error("QL025 first numeric term must be a square.");
    const wrong: string[] = [];
    for (let index = 0; index < states.length; index += 1) {
      const expected = (startRoot + index) ** 2;
      if (states[index]!.number !== expected) wrong.push(terms[index]!);
    }
    if (wrong.length !== 1) throw new Error(`QL025 must contain exactly one wrong term, found ${wrong.length}.`);
    return wrong[0]!;
  }

  if (qlId === "SER-QL-026") {
    const terms = commaTerms(stem);
    if (terms.length !== 3 || terms[2] !== "?") throw new Error("QL026 visible series is malformed.");
    const first = terms[0]!;
    const second = terms[1]!;
    if (!/^(?=.*[A-Z].*[A-Z])(?=.*\d)[A-Z0-9]{3}$/.test(first) || !/^[A-Z0-9]{3}$/.test(second)) {
      throw new Error("QL026 tokens are malformed.");
    }
    if (rotateLeft(first) === second) return rotateLeft(second);
    if (rotateRight(first) === second) return rotateRight(second);
    throw new Error("QL026 second token is not a one-place rotation of the first.");
  }

  if (qlId === "SER-QL-027") {
    const terms = commaTerms(stem);
    if (terms.length !== 4 || terms[3] !== "?") throw new Error("QL027 visible series is malformed.");
    const states = terms.slice(0, -1).map(parseLetterNumberLetter);
    const firstSteps = states.slice(1).map((state, index) => signedAlphabetStep(states[index]!.first, state.first));
    const secondSteps = states.slice(1).map((state, index) => signedAlphabetStep(states[index]!.second, state.second));
    if (new Set(firstSteps).size !== 1 || new Set(secondSteps).size !== 1) throw new Error("QL027 letter channels are not fixed-step.");
    const roots = states.map((state) => Math.sqrt(state.number));
    if (roots.some((root) => !Number.isInteger(root)) || roots.slice(1).some((root, index) => root - roots[index]! !== 1)) {
      throw new Error("QL027 numbers are not consecutive squares.");
    }
    const last = states.at(-1)!;
    const root = roots.at(-1)! + 1;
    return `${letterAtOneBased(oneBasedPosition(last.first) + firstSteps[0]!)}${root * root}${letterAtOneBased(oneBasedPosition(last.second) + secondSteps[0]!)}`;
  }

  if (qlId === "SER-QL-028") {
    const tokens = lastLine(stem).split(/\s+/).filter(Boolean);
    if (tokens.length !== 16 || !/^\d+$/.test(tokens[0]!) || !/^\d+$/.test(tokens[1]!)) throw new Error("QL028 row is malformed.");
    const start = Number(tokens[0]);
    if (Number(tokens[1]) !== start + 1) throw new Error("QL028 opening number pair is not consecutive.");
    const full: string[] = [];
    for (let block = 0; block < 4; block += 1) {
      const first = start + block * 2;
      const second = first + 1;
      full.push(String(first), String(second), letterAtOneBased(first), letterAtOneBased(second));
    }
    const missing: string[] = [];
    for (let index = 0; index < tokens.length; index += 1) {
      if (tokens[index] === "_") missing.push(full[index]!);
      else if (tokens[index] !== full[index]) throw new Error(`QL028 visible token ${index + 1} conflicts with the correspondence pattern.`);
    }
    if (missing.length < 4) throw new Error("QL028 needs a genuine multi-blank task.");
    return missing.join(" ");
  }

  throw new Error(`Unsupported mixed Series QL: ${qlId}`);
}

function rotateLeft(value: string): string {
  return value.slice(1) + value[0];
}

function rotateRight(value: string): string {
  return value.at(-1)! + value.slice(0, -1);
}
