import { uniqueSorted } from "./canonical-set";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { queryDomain } from "./solution-space";
import type {
  AbstractSentenceCodePuzzle,
  AbstractSentenceCodeQuery,
  SentenceCodeRowMinimalityReport,
  SentenceCodeSolverOptions,
} from "./types";

const INVALID_WITHOUT_ROW = "<TARGET_UNAVAILABLE_OR_UNBOUNDED>";

function canonicalDomain(values: readonly string[]): string[] {
  return uniqueSorted(values);
}

export function analyzeSentenceCodeRowMinimality(
  puzzle: AbstractSentenceCodePuzzle,
  query: AbstractSentenceCodeQuery,
  options: SentenceCodeSolverOptions = {},
): SentenceCodeRowMinimalityReport {
  const baselineSpace = solveSentenceCodeConstraints(puzzle, options);
  const baselineDomain = canonicalDomain(queryDomain(baselineSpace, query));

  const rows = puzzle.rows.map((row, rowIndex) => {
    const reducedPuzzle: AbstractSentenceCodePuzzle = {
      rows: puzzle.rows.filter((_, index) => index !== rowIndex),
    };

    let domainWithoutRow: string[];
    try {
      if (reducedPuzzle.rows.length === 0) throw new Error("No rows remain");
      const reducedSpace = solveSentenceCodeConstraints(reducedPuzzle, options);
      domainWithoutRow = canonicalDomain(queryDomain(reducedSpace, query));
    } catch {
      domainWithoutRow = [INVALID_WITHOUT_ROW];
    }

    return {
      rowId: row.rowId,
      contributes: baselineDomain.join("\u001e") !== domainWithoutRow.join("\u001e"),
      baselineDomain,
      domainWithoutRow,
    };
  });

  return {
    allRowsContribute: rows.every((row) => row.contributes),
    rows,
  };
}
