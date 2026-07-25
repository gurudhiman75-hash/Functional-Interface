import { getPnc001VariableRanges } from "./library";
import { multisetPermutationExact, sumExact } from "./math";
import type {
  Pnc001DictionaryRankContribution,
  Pnc001IndependentVerification,
  Pnc001Parameters,
  Pnc001SolverResult,
} from "./types";

function wordsFor(parameters: Pnc001Parameters): { sourceWord: string; targetWord: string } {
  if (parameters.scenarioFamily === "dictionaryRankRahul") return { sourceWord: "RAHUL", targetWord: "RAHUL" };
  if (parameters.scenarioFamily === "dictionaryRankNaagi") return { sourceWord: "AGAIN", targetWord: "NAAGI" };
  throw new Error(`Unsupported dictionary-rank scenario: ${parameters.scenarioFamily}`);
}

function letterCounts(word: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const letter of word) counts.set(letter, (counts.get(letter) ?? 0) + 1);
  return counts;
}

function sortedCountEntries(counts: Map<string, number>): Array<[string, number]> {
  return [...counts.entries()].filter(([, count]) => count > 0).sort(([left], [right]) => left.localeCompare(right));
}

function multisetCount(counts: Map<string, number>, ceiling: number): number {
  const entries = sortedCountEntries(counts);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  return multisetPermutationExact(total, entries.map(([, count]) => count), ceiling);
}

function calculateRank(sourceWord: string, targetWord: string, ceiling: number): {
  rank: number;
  precedingCount: number;
  contributions: Pnc001DictionaryRankContribution[];
} {
  const sourceCounts = letterCounts(sourceWord);
  const targetCounts = letterCounts(targetWord);
  if (JSON.stringify(sortedCountEntries(sourceCounts)) !== JSON.stringify(sortedCountEntries(targetCounts))) {
    throw new Error(`${targetWord} is not an arrangement of ${sourceWord}`);
  }

  const remaining = new Map(sourceCounts);
  const contributions: Pnc001DictionaryRankContribution[] = [];
  for (let position = 0; position < targetWord.length; position += 1) {
    const currentLetter = targetWord[position]!;
    for (const [smallerLetter, count] of sortedCountEntries(remaining)) {
      if (smallerLetter.localeCompare(currentLetter) >= 0) break;
      remaining.set(smallerLetter, count - 1);
      contributions.push({
        position: position + 1,
        currentLetter,
        smallerLetter,
        remainingArrangementCount: multisetCount(remaining, ceiling),
      });
      remaining.set(smallerLetter, count);
    }
    const currentCount = remaining.get(currentLetter) ?? 0;
    if (currentCount < 1) throw new Error(`Target word ${targetWord} cannot be formed at position ${position + 1}`);
    remaining.set(currentLetter, currentCount - 1);
  }

  const precedingCount = sumExact(contributions.map((item) => item.remainingArrangementCount), ceiling);
  return { rank: precedingCount + 1, precedingCount, contributions };
}

function enumerateDistinctWords(sourceWord: string): string[] {
  const counts = letterCounts(sourceWord);
  const output: string[] = [];
  const current: string[] = [];
  const visit = (): void => {
    if (current.length === sourceWord.length) {
      output.push(current.join(""));
      return;
    }
    for (const [letter, count] of sortedCountEntries(counts)) {
      counts.set(letter, count - 1);
      current.push(letter);
      visit();
      current.pop();
      counts.set(letter, count);
    }
  };
  visit();
  return output;
}

export function solvePnc001DictionaryRank(parameters: Pnc001Parameters): Pnc001SolverResult {
  const { sourceWord, targetWord } = wordsFor(parameters);
  const ceiling = getPnc001VariableRanges().answerCeiling;
  const calculated = calculateRank(sourceWord, targetWord, ceiling);
  const contributionValues = calculated.contributions.map((item) => item.remainingArrangementCount);
  const equation = `1${contributionValues.map((value) => ` + ${value}`).join("")} = ${calculated.rank}`;
  return {
    exactAnswer: String(calculated.rank),
    answer: String(calculated.rank),
    numericAnswer: calculated.rank,
    equation,
    mathJax: equation,
    evidence: {
      operation: "DICTIONARY_RANK",
      dictionarySourceWord: sourceWord,
      dictionaryTargetWord: targetWord,
      dictionarySortedLetters: [...sourceWord].sort().join(""),
      dictionaryRankContributions: calculated.contributions,
      dictionaryPrecedingCount: calculated.precedingCount,
      dictionaryRank: calculated.rank,
      totalCount: calculated.rank,
    },
  };
}

export function verifyPnc001DictionaryRankIndependently(parameters: Pnc001Parameters): Pnc001IndependentVerification {
  const { sourceWord, targetWord } = wordsFor(parameters);
  const words = enumerateDistinctWords(sourceWord);
  const index = words.indexOf(targetWord);
  return {
    supported: index >= 0,
    answer: index + 1,
    method: "Recursive generation of every distinct word in lexicographic order",
  };
}