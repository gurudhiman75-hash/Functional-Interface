import type { QuestionStemBlock, StructuredEditorialEntry } from "./editorial-content";
import type { EditorialLibraryFile } from "./editorial-library";
import { localizeEditorialLatex } from "./editorial-v2-native-latex";
import type { NativeEditorialLanguage } from "./editorial-v2-native-stems";
import { buildAllMultilingualEditorialLibraries } from "./editorial-v2-multilingual-builder";

function normalizeBlocks(
  language: NativeEditorialLanguage,
  qlId: string,
  entry: StructuredEditorialEntry,
): readonly QuestionStemBlock[] {
  if (qlId === "PNL-QL-035") {
    return [{
      type: "paragraph",
      content: language === "hi"
        ? "एक सामुदायिक आपूर्तिकर्ता ने स्कूल-डेस्क सेट ₹{costPrice} में खरीदा और ₹{sellingPrice} में बेच दिया।"
        : "ਇੱਕ ਕਮਿਊਨਿਟੀ ਸਪਲਾਇਰ ਨੇ ਸਕੂਲ-ਡੈਸਕ ਸੈੱਟ ₹{costPrice} ਵਿੱਚ ਖਰੀਦਿਆ ਅਤੇ ₹{sellingPrice} ਵਿੱਚ ਵੇਚ ਦਿੱਤਾ।",
    }];
  }

  return entry.stem.blocks.map((block): QuestionStemBlock => {
    if (block.type !== "equation") return block;
    return { ...block, latex: localizeEditorialLatex(language, block.latex) ?? block.latex };
  });
}

function normalizeEntry(
  language: NativeEditorialLanguage,
  qlId: string,
  entry: StructuredEditorialEntry,
): StructuredEditorialEntry {
  return {
    ...entry,
    stem: { ...entry.stem, blocks: normalizeBlocks(language, qlId, entry) },
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
      Object.entries(library.entries).map(([qlId, entry]) => [qlId, normalizeEntry(language, qlId, entry)]),
    ),
  };
}

export function buildAllNormalizedMultilingualEditorialLibraries(): readonly EditorialLibraryFile[] {
  return buildAllMultilingualEditorialLibraries().map(normalizeLibrary);
}
