import type {
  FriendlyExplanation,
  QuestionStemBlock,
  StructuredEditorialEntry,
  StructuredQuestionStem,
} from "./editorial-content";
import type { EditorialLibraryFile } from "./editorial-library";
import { buildAllLegacyEditorialLibraries } from "./editorial-v2-legacy-builder";

function normalizeLatex(value: string): string {
  return value
    .replace(/\frac/g, "\\frac")
    .replace(/\right/g, "\\right")
    .replace(/\times/g, "\\times")
    .replace(/(?<!\\)left/g, "\\left")
    .replace(/(?<!\\)right/g, "\\right")
    .replace(/(?<!\\)frac/g, "\\frac")
    .replace(/(?<!\\)times/g, "\\times")
    .replace(/(?<!\\)prod/g, "\\prod")
    .replace(/(?<!\\)Delta/g, "\\Delta")
    .replace(/(?<!\\)pm/g, "\\pm")
    .replace(/(?<!\\)mp/g, "\\mp");
}

function cleanLead(content: string, family: string): string {
  let result = content;
  if (result.startsWith(`A ${family} transaction is described below.`)) {
    result = result.replace(`A ${family} transaction is described below.`, `This ${family} transaction is described below.`);
  } else if (result.startsWith(`During a ${family} decision, the following information is available.`)) {
    result = result.replace(`During a ${family} decision, the following information is available.`, `During this ${family} decision, the following information is available.`);
  } else if (result.startsWith(`The records from a ${family} business show the following.`)) {
    result = result.replace(`The records from a ${family} business show the following.`, `The following commercial records are available for this ${family} setting.`);
  } else if (result.startsWith(`For a ${family} problem, use the information below.`)) {
    result = result.replace(`For a ${family} problem, use the information below.`, `Use the following information from a ${family} setting.`);
  }
  return result.replace(/\. the\b/g, ". The");
}

function splitEmbeddedPrompt(stem: StructuredQuestionStem): StructuredQuestionStem {
  if (stem.prompt !== "Select the correct answer.") return stem;
  const blocks = [...stem.blocks];
  const lastIndex = blocks.map((block) => block.type).lastIndexOf("paragraph");
  if (lastIndex < 0) return stem;
  const block = blocks[lastIndex];
  if (block.type !== "paragraph") return stem;
  const matches = [...block.content.matchAll(/\b(find|calculate|what|at what|how many|how much|how|which|express|identify|state|select|decide|determine)\b/gi)];
  const match = matches.at(-1);
  if (!match || match.index === undefined) return stem;
  const body = block.content.slice(0, match.index).trim();
  const prompt = block.content.slice(match.index).trim();
  if (!body || !prompt) return stem;
  blocks[lastIndex] = { type: "paragraph", content: body };
  return { ...stem, blocks, prompt: prompt[0].toUpperCase() + prompt.slice(1) };
}

function normalizeStem(qlId: string, stem: StructuredQuestionStem): StructuredQuestionStem {
  let blocks = stem.blocks.map((block): QuestionStemBlock => {
    if (block.type === "paragraph") return { ...block, content: cleanLead(block.content, stem.contextFamily) };
    if (block.type === "equation") return { ...block, latex: normalizeLatex(block.latex) };
    return block;
  });

  if (qlId === "PNL-QL-035") {
    blocks = [{
      type: "paragraph",
      content: "A community supplier buys a school-desk set for ₹{costPrice} and sells it for ₹{sellingPrice}.",
    }];
  }

  return splitEmbeddedPrompt({ ...stem, blocks });
}

function normalizeExplanation(explanation: FriendlyExplanation): FriendlyExplanation {
  return {
    ...explanation,
    steps: explanation.steps.map((step) => ({
      ...step,
      equationLatex: step.equationLatex ? normalizeLatex(step.equationLatex) : undefined,
    })),
    finalAnswerLatex: explanation.finalAnswerLatex ? normalizeLatex(explanation.finalAnswerLatex) : undefined,
  };
}

function normalizeEntry(qlId: string, entry: StructuredEditorialEntry): StructuredEditorialEntry {
  return {
    ...entry,
    stem: normalizeStem(qlId, entry.stem),
    explanation: normalizeExplanation(entry.explanation),
  };
}

function normalizeLibrary(library: EditorialLibraryFile): EditorialLibraryFile {
  return {
    ...library,
    entries: Object.fromEntries(
      Object.entries(library.entries).map(([qlId, entry]) => [qlId, normalizeEntry(qlId, entry)]),
    ),
  };
}

export function buildAllNormalizedLegacyEditorialLibraries(): readonly EditorialLibraryFile[] {
  return buildAllLegacyEditorialLibraries().map(normalizeLibrary);
}
