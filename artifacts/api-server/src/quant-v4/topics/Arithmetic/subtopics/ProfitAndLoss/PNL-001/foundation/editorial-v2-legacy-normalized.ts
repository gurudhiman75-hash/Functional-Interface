import type {
  FriendlyExplanation,
  QuestionStemBlock,
  StructuredEditorialEntry,
  StructuredQuestionStem,
} from "./editorial-content";
import type { EditorialLibraryFile } from "./editorial-library";
import { compactEditorialEntry } from "./editorial-v2-exam-stems";
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

function naturalStemOverride(qlId: string, family: string): StructuredQuestionStem | undefined {
  switch (qlId) {
    case "PNL-QL-035":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "A community supplier buys a school-desk set for ₹{costPrice} and sells it for ₹{sellingPrice}." }],
        prompt: "Find the profit or loss percentage.",
      };
    case "PNL-QL-047":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "A department store buys a travel suitcase for ₹{costPrice}, marks it {markupPercent}% above cost, and allows a discount of {discountPercent}%." }],
        prompt: "Calculate the resulting profit or loss percentage.",
      };
    case "PNL-QL-050":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "A garment wholesaler buys a carton for ₹{costPrice}. After allowing a discount of {discountPercent}%, the wholesaler wants an overall {targetRatePercent}% {targetDirection}." }],
        prompt: "Find the required markup percentage.",
      };
    case "PNL-QL-072":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "A fruit merchant sells two fruit crates for the same price of ₹{commonSellingPrice} each. The first is sold at {firstRatePercent}% {firstDirection}, while the second is sold at {secondRatePercent}% {secondDirection}." }],
        prompt: "Calculate the overall profit or loss percentage on the two crates together.",
      };
    case "PNL-QL-073":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "An equipment dealer buys two small machines for the same cost of ₹{commonCostPrice} each. The first is sold at {firstRatePercent}% {firstDirection}, while the second is sold at {secondRatePercent}% {secondDirection}." }],
        prompt: "Find the overall profit or loss percentage.",
      };
    case "PNL-QL-075":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "A homeware seller buys {totalQuantity} ceramic sets at ₹{unitCostPrice} each. Of these, {damagedQuantity} sets are damaged and recover ₹{damagedRecoveryPerUnit} each. The seller wants an overall {targetRatePercent}% {targetDirection}." }],
        prompt: "Find the required selling price per undamaged set.",
      };
    case "PNL-QL-076":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "A wholesaler pays for {paidQuantity} packaged units at ₹{unitCostPrice} each and receives {freeQuantity} additional units free. All units are sold at ₹{unitSellingPrice} each." }],
        prompt: "Calculate the overall profit or loss percentage.",
      };
    case "PNL-QL-082":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "A produce merchant buys {totalQuantity} crates at ₹{unitCostPrice} each. Of these, {goodQuantity} good crates are sold at ₹{goodUnitSellingPrice} each and {spoiledQuantity} crates are spoiled. The merchant wants an overall {targetRatePercent}% {targetDirection}." }],
        prompt: "Find the recovery required per spoiled crate.",
      };
    case "PNL-QL-084":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "Two electronic items are sold for the same amount. The first is sold at {knownRatePercent}% {knownDirection}. The second must have a {unknownDirection} result, and the two sales together must produce an overall {targetRatePercent}% {targetDirection}." }],
        prompt: "Find the required percentage on the second item.",
      };
    case "PNL-QL-094":
      return {
        contextFamily: family,
        blocks: [{ type: "paragraph", content: "A food distributor buys {totalQuantity} packs at ₹{unitCostPrice} each. Of these, {goodQuantity} good packs are sold at ₹{goodUnitSellingPrice} each and {spoiledQuantity} packs cannot be sold normally." }],
        prompt: "Find the minimum recovery per spoiled pack required to avoid an overall loss.",
      };
    default:
      return undefined;
  }
}

function normalizeStem(qlId: string, stem: StructuredQuestionStem): StructuredQuestionStem {
  const override = naturalStemOverride(qlId, stem.contextFamily);
  if (override) return override;

  const blocks = stem.blocks.map((block): QuestionStemBlock => {
    if (block.type === "paragraph") return { ...block, content: cleanLead(block.content, stem.contextFamily) };
    if (block.type === "equation") return { ...block, latex: normalizeLatex(block.latex) };
    return block;
  });

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
  return compactEditorialEntry("en", {
    ...entry,
    stem: normalizeStem(qlId, entry.stem),
    explanation: normalizeExplanation(entry.explanation),
  });
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
