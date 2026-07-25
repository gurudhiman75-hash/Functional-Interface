import type { CodCp001TaskKind } from "./types";
import type { CodTokenKind } from "../foundation/types";
import { SeededRandom } from "../foundation/prng";
import { joinCode, splitCode } from "../foundation/code-values";

function nextToken(token: string, kind: CodTokenKind): string {
  if (kind === "LETTER") return String.fromCharCode(((token.charCodeAt(0) - 65 + 1) % 26) + 65);
  if (kind === "DIGIT") return String((Number(token) + 1) % 10);
  const symbols = ["@", "#", "$", "%", "&", "*", "+", "=", "?", "!"];
  const index = symbols.indexOf(token);
  return symbols[(index + 1 + symbols.length) % symbols.length]!;
}

function mutateCluster(correct: string, separator: string, kind: CodTokenKind): string[] {
  const tokens = splitCode(correct, separator);
  const variants: string[] = [];
  if (tokens.length > 1) {
    const swapped = [...tokens];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    variants.push(joinCode(swapped, separator));
    variants.push(joinCode([...tokens].reverse(), separator));
  }
  const changedFirst = [...tokens];
  changedFirst[0] = nextToken(changedFirst[0]!, kind);
  variants.push(joinCode(changedFirst, separator));
  const changedLast = [...tokens];
  changedLast[changedLast.length - 1] = nextToken(changedLast[changedLast.length - 1]!, kind);
  variants.push(joinCode(changedLast, separator));
  return variants;
}

function mutateDecodedWord(correct: string): string[] {
  const letters = [...correct];
  const variants: string[] = [];
  if (letters.length > 1) {
    const swapped = [...letters];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    variants.push(swapped.join(""));
    variants.push([...letters].reverse().join(""));
  }
  const changed = [...letters];
  changed[0] = String.fromCharCode(((changed[0]!.charCodeAt(0) - 65 + 1) % 26) + 65);
  variants.push(changed.join(""));
  return variants;
}

export function buildDistractors(input: {
  correct: string;
  taskKind: CodCp001TaskKind;
  outputKind: CodTokenKind;
  separator: string;
  seed: string;
  tokenPool: readonly string[];
}): { value: string; errorLabel: string }[] {
  const random = new SeededRandom(input.seed);
  const candidates: { value: string; errorLabel: string }[] = [];
  if (input.taskKind === "RECOVER_MISSING_CODE") {
    for (const token of random.shuffle(input.tokenPool.filter((token) => token !== input.correct))) {
      candidates.push({ value: token, errorLabel: "NEIGHBOUR_MAPPING_TRAP" });
    }
  } else if (input.taskKind === "DECODE_TARGET") {
    for (const value of mutateDecodedWord(input.correct)) {
      candidates.push({ value, errorLabel: "DECODE_POSITION_ERROR" });
    }
  } else {
    const labels = ["POSITION_SWAP", "REVERSE_ORDER", "OFF_BY_ONE_TOKEN", "LAST_TOKEN_SLIP"];
    for (const [index, value] of mutateCluster(input.correct, input.separator, input.outputKind).entries()) {
      candidates.push({ value, errorLabel: labels[index] ?? "DIRECT_MAPPING_SLIP" });
    }
  }
  const unique = [...new Map(candidates.filter((item) => item.value !== input.correct).map((item) => [item.value, item])).values()];
  if (unique.length < 3) throw new Error("Unable to construct three unique direct-mapping distractors");
  return random.shuffle(unique).slice(0, 3);
}
