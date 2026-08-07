export function applyNumCp005FinalPublicationDifficulty(source, result) {
  if (source.qlId === "NUM-QL-065") {
    const pairs = Array.isArray(result.hiddenState?.exponentPairs)
      ? result.hiddenState.exponentPairs
      : [];
    const difficulty = pairs.length === 0
      ? "EASY"
      : pairs.length === 1
        ? "MEDIUM"
        : "HARD";
    return {
      ...result,
      difficulty,
    };
  }

  if (source.qlId === "NUM-QL-067") {
    const total = Number(result.hiddenState?.totalDivisors);
    const square = Number(result.hiddenState?.squareDivisors);
    const difficulty = total <= 18 && square <= 6
      ? "EASY"
      : total <= 36 && square <= 12
        ? "MEDIUM"
        : "HARD";
    return {
      ...result,
      difficulty,
    };
  }

  return result;
}
