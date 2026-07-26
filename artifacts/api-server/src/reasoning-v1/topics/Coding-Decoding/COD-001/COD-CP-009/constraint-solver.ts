import { assertUnique, uniqueSorted } from "./canonical-set";
import type {
  AbstractSentenceCodePuzzle,
  SentenceCodeSolution,
  SentenceCodeSolutionSpace,
  SentenceCodeSolverOptions,
} from "./types";

interface SignatureGroup {
  signature: string;
  words: string[];
  tokens: string[];
}

interface PreparedPuzzle {
  activeWords: string[];
  activeTokens: string[];
  signatureByWord: Record<string, string>;
  signatureByToken: Record<string, string>;
  groups: SignatureGroup[];
}

function factorial(value: number): number {
  let result = 1;
  for (let current = 2; current <= value; current += 1) {
    result *= current;
    if (!Number.isSafeInteger(result)) throw new Error("Sentence-code solution count exceeds safe integer range");
  }
  return result;
}

function validateText(value: string, label: string): void {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`);
}

function preparePuzzle(puzzle: AbstractSentenceCodePuzzle): PreparedPuzzle {
  if (!puzzle || !Array.isArray(puzzle.rows) || puzzle.rows.length === 0) {
    throw new Error("Sentence-code puzzle must contain at least one row");
  }

  const rowIds = puzzle.rows.map((row) => row.rowId);
  rowIds.forEach((rowId, index) => validateText(rowId, `rows[${index}].rowId`));
  assertUnique(rowIds, "Sentence-code row IDs");

  for (const [index, row] of puzzle.rows.entries()) {
    if (row.wordIds.length === 0) throw new Error(`Row '${row.rowId}' must contain at least one word`);
    if (row.wordIds.length !== row.codeTokens.length) {
      throw new Error(`Row '${row.rowId}' must contain equal word and code-token cardinality`);
    }
    row.wordIds.forEach((wordId, itemIndex) => validateText(wordId, `rows[${index}].wordIds[${itemIndex}]`));
    row.codeTokens.forEach((token, itemIndex) => validateText(token, `rows[${index}].codeTokens[${itemIndex}]`));
    assertUnique(row.wordIds, `Words in row '${row.rowId}'`);
    assertUnique(row.codeTokens, `Code tokens in row '${row.rowId}'`);
  }

  const activeWords = uniqueSorted(puzzle.rows.flatMap((row) => row.wordIds));
  const activeTokens = uniqueSorted(puzzle.rows.flatMap((row) => row.codeTokens));
  if (activeWords.length !== activeTokens.length) {
    throw new Error(`Active word/token universes must have equal cardinality (${activeWords.length} !== ${activeTokens.length})`);
  }

  const signatureByWord: Record<string, string> = {};
  const signatureByToken: Record<string, string> = {};
  for (const wordId of activeWords) {
    signatureByWord[wordId] = puzzle.rows.map((row) => row.wordIds.includes(wordId) ? "1" : "0").join("");
  }
  for (const token of activeTokens) {
    signatureByToken[token] = puzzle.rows.map((row) => row.codeTokens.includes(token) ? "1" : "0").join("");
  }

  const groupMap = new Map<string, SignatureGroup>();
  for (const wordId of activeWords) {
    const signature = signatureByWord[wordId]!;
    const group = groupMap.get(signature) ?? { signature, words: [], tokens: [] };
    group.words.push(wordId);
    groupMap.set(signature, group);
  }
  for (const token of activeTokens) {
    const signature = signatureByToken[token]!;
    const group = groupMap.get(signature) ?? { signature, words: [], tokens: [] };
    group.tokens.push(token);
    groupMap.set(signature, group);
  }

  const groups = [...groupMap.values()].sort((left, right) => left.signature.localeCompare(right.signature));
  for (const group of groups) {
    group.words.sort((left, right) => left.localeCompare(right));
    group.tokens.sort((left, right) => left.localeCompare(right));
    if (group.words.length !== group.tokens.length) {
      throw new Error(
        `No consistent bijection: membership signature '${group.signature}' has ${group.words.length} words and ${group.tokens.length} tokens`,
      );
    }
  }

  return { activeWords, activeTokens, signatureByWord, signatureByToken, groups };
}

function forEachPermutation<T>(items: readonly T[], visit: (permutation: readonly T[]) => void): void {
  const working = [...items];
  const recurse = (index: number): void => {
    if (index === working.length) {
      visit([...working]);
      return;
    }
    for (let swapIndex = index; swapIndex < working.length; swapIndex += 1) {
      [working[index], working[swapIndex]] = [working[swapIndex]!, working[index]!];
      recurse(index + 1);
      [working[index], working[swapIndex]] = [working[swapIndex]!, working[index]!];
    }
  };
  recurse(0);
}

export function solveSentenceCodeConstraints(
  puzzle: AbstractSentenceCodePuzzle,
  options: SentenceCodeSolverOptions = {},
): SentenceCodeSolutionSpace {
  const prepared = preparePuzzle(puzzle);
  const maxSolutions = options.maxSolutions ?? 10_000;
  if (!Number.isInteger(maxSolutions) || maxSolutions < 1) throw new Error("maxSolutions must be a positive integer");

  const solutionCount = prepared.groups.reduce((total, group) => total * factorial(group.words.length), 1);
  if (!Number.isSafeInteger(solutionCount)) throw new Error("Sentence-code solution count exceeds safe integer range");
  if (solutionCount > maxSolutions) {
    throw new Error(`Sentence-code solution space ${solutionCount} exceeds configured limit ${maxSolutions}`);
  }

  const candidateTokensByWord: Record<string, readonly string[]> = {};
  const candidateWordsByToken: Record<string, readonly string[]> = {};
  for (const group of prepared.groups) {
    for (const wordId of group.words) candidateTokensByWord[wordId] = [...group.tokens];
    for (const token of group.tokens) candidateWordsByToken[token] = [...group.words];
  }

  const invariantPairs = prepared.groups
    .filter((group) => group.words.length === 1)
    .map((group) => ({ wordId: group.words[0]!, token: group.tokens[0]! }))
    .sort((left, right) => left.wordId.localeCompare(right.wordId));

  const solutions: SentenceCodeSolution[] = [];
  let enumerationNodes = 0;
  const current: Record<string, string> = {};

  const enumerateGroups = (groupIndex: number): void => {
    enumerationNodes += 1;
    if (groupIndex === prepared.groups.length) {
      solutions.push({ wordToToken: { ...current } });
      return;
    }

    const group = prepared.groups[groupIndex]!;
    forEachPermutation(group.tokens, (permutation) => {
      for (let index = 0; index < group.words.length; index += 1) {
        current[group.words[index]!] = permutation[index]!;
      }
      enumerateGroups(groupIndex + 1);
      for (const wordId of group.words) delete current[wordId];
    });
  };

  enumerateGroups(0);
  if (solutions.length !== solutionCount) {
    throw new Error(`Internal enumeration mismatch: expected ${solutionCount}, received ${solutions.length}`);
  }

  return {
    activeWords: prepared.activeWords,
    activeTokens: prepared.activeTokens,
    solutions,
    solutionCount,
    candidateTokensByWord,
    candidateWordsByToken,
    invariantPairs,
    membershipSignatureByWord: prepared.signatureByWord,
    membershipSignatureByToken: prepared.signatureByToken,
    enumerationNodes,
  };
}
