import type { QuestionStemBlock, StructuredEditorialEntry } from "./editorial-content";
import type { EditorialLibraryFile } from "./editorial-library";
import { localizeEditorialLatex } from "./editorial-v2-native-latex";
import type { NativeEditorialLanguage } from "./editorial-v2-native-stems";
import { buildAllMultilingualEditorialLibraries } from "./editorial-v2-multilingual-builder";

function normalizeEntry(
  language: NativeEditorialLanguage,
  entry: StructuredEditorialEntry,
): StructuredEditorialEntry {
  const blocks = entry.stem.blocks.map((block): QuestionStemBlock => {
    if (block.type !== "equation") return block;
    return { ...block, latex: localizeEditorialLatex(language, block.latex) ?? block.latex };
  });

  return {
    ...entry,
    stem: { ...entry.stem, blocks },
    explanation: {
      ...entry.explanation,
      steps: entry.explanation.steps.map((step) => ({
        ...step,
        equationLatex: localizeEditorialLatex(language, step.equationLatex),
      })),
      finalAnswerLatex: localizeEditorialLatex(language, entry.explanation.finalAnswerLatex),
    },
  };
}

function normalizeLibrary(library: EditorialLibraryFile): EditorialLibraryFile {
  const language = library.language as NativeEditorialLanguage;
  return {
    ...library,
    entries: Object.fromEntries(
      Object.entries(library.entries).map(([qlId, entry]) => [qlId, normalizeEntry(language, entry)]),
    ),
  };
}

export function buildAllNormalizedMultilingualEditorialLibraries(): readonly EditorialLibraryFile[] {
  return buildAllMultilingualEditorialLibraries().map(normalizeLibrary);
}
