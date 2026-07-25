export type RuntimeLibraryEntry = Readonly<{
  qlId: string;
  cpId: string;
  solveMode: string;
  answerSemantic: string;
  template: string;
  difficulty: "Easy" | "Medium" | "Hard";
}>;

export function indexRuntimeLibrary(entries: readonly RuntimeLibraryEntry[]) {
  const index = new Map<string, RuntimeLibraryEntry>();
  for (const entry of entries) {
    if (index.has(entry.qlId)) throw new Error(`Duplicate QL id: ${entry.qlId}`);
    index.set(entry.qlId, entry);
  }
  return index;
}
