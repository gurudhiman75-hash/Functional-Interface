export function applyNumCp005FinalPublicationDifficulty(source, result) {
  if (source.qlId !== "NUM-QL-065") return result;
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
