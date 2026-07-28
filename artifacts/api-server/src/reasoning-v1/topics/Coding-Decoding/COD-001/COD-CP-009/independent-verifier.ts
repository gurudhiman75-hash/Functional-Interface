import { assertUnique, sameSet, uniqueSorted } from "./canonical-set";
import type {
  AbstractSentenceCodePuzzle,
  SentenceCodeSolution,
  SentenceCodeSolutionSpace,
  SentenceCodeVerifierOptions,
} from "./types";

function factorial(value: number): number {
  let result = 1;
  for (let current = 2; current <= value; current += 1) {
    result *= current;
    if (!Number.isSafeInteger(result)) throw new Error("Sentence-code assignment count exceeds safe integer range");
  }
  return result;
}

function validatePuzzleIndependently(puzzle: AbstractSentenceCodePuzzle): { words: string[]; tokens: string[] } {
  if (!puzzle || !Array.isArray(puzzle.rows) || puzzle.rows.length === 0) {
    throw new Error("Sentence-code puzzle must contain at least one row");
  }

  assertUnique(puzzle.rows.map((row) => row.rowId), "Sentence-code row IDs");
  for (const row of puzzle.rows) {
    if (row.wordIds.length === 0 || row.wordIds.length !== row.codeTokens.length) {
      throw new Error(`Invalid row cardinality in '${row.rowId}'`);
    }
    assertUnique(row.wordIds, `Words in row '${row.rowId}'`);
    assertUnique(row.codeTokens, `Code tokens in row '${row.rowId}'`);
  }

  const words = uniqueSorted(puzzle.rows.flatMap((row) => row.wordIds));
  const tokens = uniqueSorted(puzzle.rows.flatMap((row) => row.codeTokens));
  if (words.length !== tokens.length) throw new Error("Active word/token universes must have equal cardinality");
  return { words, tokens };
}

function mappingSatisfiesPuzzle(puzzle: AbstractSentenceCodePuzzle, mapping: Readonly<Record<string, string>>): boolean {
  return puzzle.rows.every((row) => sameSet(row.wordIds.map((wordId) => mapping[wordId]!), row.codeTokens));
}

export function verifySentenceCodeConstraintsBruteForce(
  puzzle: AbstractSentenceCodePuzzle,
  options: SentenceCodeVerifierOptions = {},
): SentenceCodeSolutionSpace {
  const { words, tokens } = validatePuzzleIndependently(puzzle);
  const maxAssignments = options.maxAssignments ?? 500_000;
  if (!Number.isInteger(maxAssignments) || maxAssignments < 1) throw new Error("maxAssignments must be a positive integer");

  const assignmentCount = factorial(words.length);
  if (assignmentCount > maxAssignments) {
    throw new Error(`Brute-force assignment space ${assignmentCount} exceeds configured limit ${maxAssignments}`);
  }

  const solutions: SentenceCodeSolution[] = [];
  const working = [...tokens];
  let enumerationNodes = 0;

  const recurse = (index: number): void => {
    if (index === working.length) {
      enumerationNodes += 1;
      const mapping: Record<string, string> = {};
      for (let itemIndex = 0; itemIndex < words.length; itemIndex += 1) mapping[words[itemIndex]!] = working[itemIndex]!;
      if (mappingSatisfiesPuzzle(puzzle, mapping)) solutions.push({ wordToToken: mapping });
      return;
    }
    for (let swapIndex = index; swapIndex < working.length; swapIndex += 1) {
      [working[index], working[swapIndex]] = [working[swapIndex]!, working[index]!];
      recurse(index + 1);
      [working[index], working[swapIndex]] = [working[swapIndex]!, working[index]!];
    }
  };

  recurse(0);
  if (solutions.length === 0) throw new Error("No consistent sentence-code bijection exists");

  const candidateTokensByWord: Record<string, readonly string[]> = {};
  const candidateWordsByToken: Record<string, readonly string[]> = {};
  for (const wordId of words) {
    candidateTokensByWord[wordId] = uniqueSorted(solutions.map((solution) => solution.wordToToken[wordId]!));
  }
  for (const token of tokens) {
    candidateWordsByToken[token] = uniqueSorted(
      solutions.flatMap((solution) => words.filter((wordId) => solution.wordToToken[wordId] === token)),
    );
  }

  const invariantPairs = words
    .filter((wordId) => candidateTokensByWord[wordId]!.length === 1)
    .map((wordId) => ({ wordId, token: candidateTokensByWord[wordId]![0]! }));

  const signatureByWord: Record<string, string> = {};
  const signatureByToken: Record<string, string> = {};
  for (const wordId of words) signatureByWord[wordId] = puzzle.rows.map((row) => row.wordIds.includes(wordId) ? "1" : "0").join("");
  for (const token of tokens) signatureByToken[token] = puzzle.rows.map((row) => row.codeTokens.includes(token) ? "1" : "0").join("");

  return {
    activeWords: words,
    activeTokens: tokens,
    solutions,
    solutionCount: solutions.length,
    candidateTokensByWord,
    candidateWordsByToken,
    invariantPairs,
    membershipSignatureByWord: signatureByWord,
    membershipSignatureByToken: signatureByToken,
    enumerationNodes,
  };
}
