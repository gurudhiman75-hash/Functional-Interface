import type { FriendlyExplanation, StructuredQuestionStem } from "./editorial-content";

export type RuntimeLibraryEntry = Readonly<{
  qlId: string;
  cpId: string;
  solveMode: string;
  answerSemantic: string;
  /** Legacy fallback retained while older QLs migrate. */
  template?: string;
  /** Preferred structured content for web, mobile and review rendering. */
  stem?: StructuredQuestionStem;
  explanation?: FriendlyExplanation;
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyRationale?: string;
}>;

export function indexRuntimeLibrary(entries: readonly RuntimeLibraryEntry[]) {
  const index = new Map<string, RuntimeLibraryEntry>();
  for (const entry of entries) {
    if (index.has(entry.qlId)) throw new Error(`Duplicate QL id: ${entry.qlId}`);
    if (!entry.template && !entry.stem) {
      throw new Error(`QL ${entry.qlId} must provide either a legacy template or a structured stem.`);
    }
    index.set(entry.qlId, entry);
  }
  return index;
}
