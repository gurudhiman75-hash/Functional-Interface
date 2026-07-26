import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import type { AbstractSentenceCodePuzzle, AbstractSentenceCodeRow } from "./types";

export interface HiddenSentenceCodeMapping {
  readonly [wordId: string]: string;
}

export interface AbstractTopologyRowInput {
  rowId: string;
  wordIds: readonly string[];
  displayedTokenOrder?: readonly string[];
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

export function derivePuzzleFromHiddenMapping(
  rows: readonly AbstractTopologyRowInput[],
  hiddenMapping: HiddenSentenceCodeMapping,
): AbstractSentenceCodePuzzle {
  const derivedRows: AbstractSentenceCodeRow[] = rows.map((row) => {
    const expectedTokens = row.wordIds.map((wordId) => {
      const token = hiddenMapping[wordId];
      if (!token) throw new Error(`Hidden mapping has no token for word '${wordId}'`);
      return token;
    });

    const displayedTokens = row.displayedTokenOrder ?? expectedTokens;
    if (canonicalSetKey(displayedTokens) !== canonicalSetKey(expectedTokens)) {
      throw new Error(`Displayed tokens for row '${row.rowId}' do not match its hidden word mapping`);
    }

    return {
      rowId: row.rowId,
      wordIds: [...row.wordIds],
      codeTokens: [...displayedTokens],
    };
  });

  return { rows: derivedRows };
}

function encodeTopologyForRowOrder(puzzle: AbstractSentenceCodePuzzle, rowOrder: readonly number[]): string {
  const orderedRows = rowOrder.map((index) => puzzle.rows[index]!);
  const words = uniqueSorted(orderedRows.flatMap((row) => row.wordIds));
  const tokens = uniqueSorted(orderedRows.flatMap((row) => row.codeTokens));
  const wordSignatures = words
    .map((wordId) => orderedRows.map((row) => row.wordIds.includes(wordId) ? "1" : "0").join(""))
    .sort();
  const tokenSignatures = tokens
    .map((token) => orderedRows.map((row) => row.codeTokens.includes(token) ? "1" : "0").join(""))
    .sort();
  const rowSizes = orderedRows.map((row) => row.wordIds.length).join(",");
  return `rows:${rowSizes}|words:${wordSignatures.join(",")}|tokens:${tokenSignatures.join(",")}`;
}

export function sentenceCodeTopologyFingerprint(puzzle: AbstractSentenceCodePuzzle): string {
  if (puzzle.rows.length === 0) throw new Error("Cannot fingerprint an empty sentence-code puzzle");
  if (puzzle.rows.length > 8) throw new Error("Topology fingerprint is bounded to at most eight rows");

  const rowIndices = puzzle.rows.map((_, index) => index);
  let best: string | null = null;
  forEachPermutation(rowIndices, (permutation) => {
    const encoded = encodeTopologyForRowOrder(puzzle, permutation);
    if (best === null || encoded < best) best = encoded;
  });
  return best!;
}

export function wordConnectivityComponents(puzzle: AbstractSentenceCodePuzzle): readonly (readonly string[])[] {
  const words = uniqueSorted(puzzle.rows.flatMap((row) => row.wordIds));
  const adjacency = new Map<string, Set<string>>(words.map((wordId) => [wordId, new Set<string>()]));

  for (const row of puzzle.rows) {
    for (const left of row.wordIds) {
      for (const right of row.wordIds) {
        if (left !== right) adjacency.get(left)!.add(right);
      }
    }
  }

  const remaining = new Set(words);
  const components: string[][] = [];
  while (remaining.size > 0) {
    const start = [...remaining].sort()[0]!;
    const queue = [start];
    const component = new Set<string>();
    remaining.delete(start);

    while (queue.length > 0) {
      const current = queue.shift()!;
      component.add(current);
      for (const neighbour of [...adjacency.get(current)!].sort()) {
        if (remaining.delete(neighbour)) queue.push(neighbour);
      }
    }

    components.push([...component].sort());
  }

  return components.sort((left, right) => left[0]!.localeCompare(right[0]!));
}

export function targetConnectedToAllRows(puzzle: AbstractSentenceCodePuzzle, targetWordId: string): boolean {
  const components = wordConnectivityComponents(puzzle);
  const targetComponent = components.find((component) => component.includes(targetWordId));
  if (!targetComponent) return false;
  const targetWords = new Set(targetComponent);
  return puzzle.rows.every((row) => row.wordIds.some((wordId) => targetWords.has(wordId)));
}
