import { letterAtOneBased, oneBasedPosition } from "./independent-solver";
import type { SerCp008ProvisionalQlId } from "./question-language";

function signedAlphabetStep(from: string, to: string): number {
  let delta = oneBasedPosition(to) - oneBasedPosition(from);
  if (delta > 13) delta -= 26;
  if (delta < -13) delta += 26;
  return delta;
}

function visibleTerms(stem: string): string[] {
  const line = stem.split("\n").at(-1) ?? stem;
  return line
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part !== "?");
}

function parseSimpleToken(value: string): { letter: string; number: number; order: "LETTER_NUMBER" | "NUMBER_LETTER" } {
  const letterFirst = value.match(/^([A-Z])-(\d+)$/);
  if (letterFirst) return { letter: letterFirst[1]!, number: Number(letterFirst[2]), order: "LETTER_NUMBER" };
  const numberFirst = value.match(/^(\d+)([A-Z])$/);
  if (numberFirst) return { letter: numberFirst[2]!, number: Number(numberFirst[1]), order: "NUMBER_LETTER" };
  throw new Error(`Unsupported alphanumeric token: ${value}`);
}

function formatSimpleToken(state: { letter: string; number: number; order: "LETTER_NUMBER" | "NUMBER_LETTER" }): string {
  return state.order === "LETTER_NUMBER" ? `${state.letter}-${state.number}` : `${state.number}${state.letter}`;
}

export function independentlySolveVisibleSerCp008(
  qlId: SerCp008ProvisionalQlId,
  stem: string,
): string {
  const terms = visibleTerms(stem);

  if (qlId === "SER-QL-014") {
    if (terms.length !== 4 || terms.some((term) => !/^[A-Z]$/.test(term))) throw new Error("Invalid QL014 visible series.");
    const jumps = [
      signedAlphabetStep(terms[0]!, terms[1]!),
      signedAlphabetStep(terms[1]!, terms[2]!),
      signedAlphabetStep(terms[2]!, terms[3]!),
    ];
    const incrementA = jumps[1]! - jumps[0]!;
    const incrementB = jumps[2]! - jumps[1]!;
    if (incrementA !== incrementB) throw new Error("QL014 visible jumps are not progressive.");
    return letterAtOneBased(oneBasedPosition(terms[3]!) + jumps[2]! + incrementB);
  }

  if (qlId === "SER-QL-015") {
    if (terms.length !== 9 || terms.some((term) => !/^[A-Z]$/.test(term))) throw new Error("Invalid QL015 visible series.");
    const answers: string[] = [];
    for (let row = 0; row < 3; row += 1) {
      const rowTerms = [terms[row]!, terms[row + 3]!, terms[row + 6]!];
      const first = signedAlphabetStep(rowTerms[0], rowTerms[1]);
      const second = signedAlphabetStep(rowTerms[1], rowTerms[2]);
      if (first !== second) throw new Error(`QL015 row ${row + 1} does not show a fixed step.`);
      answers.push(letterAtOneBased(oneBasedPosition(rowTerms[2]) + second));
    }
    return answers.join(", ");
  }

  if (qlId === "SER-QL-016") {
    if (terms.length !== 4) throw new Error("Invalid QL016 visible series.");
    const states = terms.map(parseSimpleToken);
    if (new Set(states.map((state) => state.order)).size !== 1) throw new Error("QL016 token order changed inside the series.");
    const letterSteps = states.slice(1).map((state, index) => signedAlphabetStep(states[index]!.letter, state.letter));
    const numberSteps = states.slice(1).map((state, index) => state.number - states[index]!.number);
    if (new Set(letterSteps).size !== 1 || new Set(numberSteps).size !== 1) throw new Error("QL016 visible channels are not fixed-step.");
    const last = states.at(-1)!;
    return formatSimpleToken({
      order: last.order,
      letter: letterAtOneBased(oneBasedPosition(last.letter) + letterSteps[0]!),
      number: last.number + numberSteps[0]!,
    });
  }

  if (qlId === "SER-QL-017") {
    if (terms.length !== 6) throw new Error("Invalid QL017 visible series.");
    const targetRow = [terms[0]!, terms[2]!, terms[4]!].map(parseSimpleToken);
    const letterA = signedAlphabetStep(targetRow[0]!.letter, targetRow[1]!.letter);
    const letterB = signedAlphabetStep(targetRow[1]!.letter, targetRow[2]!.letter);
    const numberA = targetRow[1]!.number - targetRow[0]!.number;
    const numberB = targetRow[2]!.number - targetRow[1]!.number;
    if (letterA !== letterB || numberA !== numberB) throw new Error("QL017 target row is not fixed-step.");
    const last = targetRow[2]!;
    return `${last.number + numberB}${letterAtOneBased(oneBasedPosition(last.letter) + letterB)}`;
  }

  if (qlId === "SER-QL-018") {
    if (terms.length !== 4) throw new Error("Invalid QL018 visible series.");
    const parse = (value: string) => {
      const match = value.match(/^([A-Z])([A-Z])(\d+)$/);
      if (!match) throw new Error(`Unsupported cluster-number token: ${value}`);
      return { a: match[1]!, b: match[2]!, number: Number(match[3]) };
    };
    const states = terms.map(parse);
    const aSteps = states.slice(1).map((state, index) => signedAlphabetStep(states[index]!.a, state.a));
    const bSteps = states.slice(1).map((state, index) => signedAlphabetStep(states[index]!.b, state.b));
    const nSteps = states.slice(1).map((state, index) => state.number - states[index]!.number);
    if (new Set(aSteps).size !== 1 || new Set(bSteps).size !== 1 || new Set(nSteps).size !== 1) {
      throw new Error("QL018 visible channels are not fixed-step.");
    }
    const last = states.at(-1)!;
    return `${letterAtOneBased(oneBasedPosition(last.a) + aSteps[0]!)}${letterAtOneBased(oneBasedPosition(last.b) + bSteps[0]!)}${last.number + nSteps[0]!}`;
  }

  throw new Error(`Unsupported SER-CP-008 QL: ${qlId}`);
}
