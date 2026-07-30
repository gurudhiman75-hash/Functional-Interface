import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  EditorialDifficulty,
  QuestionStemBlock,
  StructuredEditorialEntry,
  StructuredQuestionStem,
} from "./editorial-content";
import type { EditorialLibraryFile } from "./editorial-library";
import { buildCp001Explanation } from "./editorial-v2-cp001-explanations";
import { buildCp002Explanation } from "./editorial-v2-cp002-explanations";
import { buildCp003Explanation } from "./editorial-v2-cp003-explanations";
import {
  LEGACY_EDITORIAL_DIFFICULTY_OVERRIDES,
  legacyDifficultyRationale,
  legacyEditorialContext,
} from "./editorial-v2-legacy-policy";

type LegacyCpFolder = "CP-001" | "CP-002" | "CP-003";

type RegistryEntry = Readonly<{
  solveMode: string;
  answerSemantic: string;
  requiredVariables: readonly string[];
  difficulty: EditorialDifficulty;
  representation?:
    | "TABLE"
    | "CASELET"
    | "STATEMENT"
    | "ALGEBRAIC"
    | "DATA_SUFFICIENCY";
  presentation?: string;
}>;

type RegistryFile = Readonly<{
  archetypeId: string;
  cpId: string;
  entries: Readonly<Record<string, RegistryEntry>>;
}>;

type LanguageFile = Readonly<{
  entries: Readonly<Record<string, Readonly<{ template: string }>>>;
}>;

const pnlRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function qlNumber(qlId: string): number {
  const value = Number(qlId.split("-").at(-1));
  if (!Number.isInteger(value)) throw new Error(`Invalid QL id: ${qlId}`);
  return value;
}

function lowerFirst(value: string): string {
  return value.length === 0 ? value : value[0].toLowerCase() + value.slice(1);
}

function contextualise(template: string, qlId: string, cpId: string): string {
  const context = legacyEditorialContext(cpId, qlNumber(qlId));
  let text = template
    .replace(/\bAn article\b/g, `The ${context.item}`)
    .replace(/\ban article\b/g, `the ${context.item}`)
    .replace(/\bthe article\b/g, `the ${context.item}`)
    .replace(/\barticle\b/g, context.item)
    .replace(
      /\bA (trader|retailer|shopkeeper|seller|dealer)\b/g,
      `The ${context.actor}`,
    );

  const lead = [
    `A ${context.family} transaction is described below.`,
    `During a ${context.family} decision, the following information is available.`,
    `Consider this ${context.family} situation.`,
    `The records from a ${context.family} business show the following.`,
    `For a ${context.family} problem, use the information below.`,
  ][qlNumber(qlId) % 5];

  if (text.startsWith("The ")) text = lowerFirst(text);
  return `${lead} ${text}`;
}

function splitPrompt(text: string): Readonly<{ body: string; prompt: string }> {
  const matches = [
    ...text.matchAll(
      /\b(Find|Calculate|What|At what|How many|How much|How|Which|Express|Identify|State|Select|Decide|Determine)\b/g,
    ),
  ];
  const match = matches.at(-1);
  if (!match || match.index === undefined)
    return { body: text, prompt: "Select the correct answer." };
  const body = text.slice(0, match.index).trim();
  const prompt = text.slice(match.index).trim();
  return { body: body || text, prompt };
}

function dataTable(variable: string): QuestionStemBlock {
  const columns = /offer/i.test(variable)
    ? ["Offer", "Condition", "Reduction"]
    : /inventory|lots|groups|sold/i.test(variable)
      ? ["Group", "Quantity or cost", "Selling condition"]
      : ["Item", "Given value", "Condition"];
  return {
    type: "table",
    caption: "Given commercial data",
    columns,
    rowSource: variable,
  };
}

function representationStem(
  qlId: string,
  cpId: string,
  entry: RegistryEntry,
): StructuredQuestionStem | undefined {
  const context = legacyEditorialContext(cpId, qlNumber(qlId));
  const family = context.family;
  switch (qlId) {
    case "PNL-QL-036":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "paragraph",
            content: `In an ${family} comparison, two possible selling conditions differ by ₹{sellingPriceDifference}.`,
          },
          {
            type: "equation",
            latex:
              "S_1=C\\left(1+\\frac{{firstRatePercent}}{100}\\right),\\qquad S_2=C\\left(1-\\frac{{secondRatePercent}}{100}\\right)",
          },
        ],
        prompt: "Find the original cost price.",
      };
    case "PNL-QL-065":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "paragraph",
            content: `A ${context.item} has a marked price of ₹{markedPrice}. The available offers are listed below.`,
          },
          {
            type: "table",
            caption: "Offer matrix",
            columns: ["Offer", "First reduction", "Second reduction"],
            rowSource: "offerTable",
          },
        ],
        prompt: "Find the selling price under offer {selectedOffer}.",
      };
    case "PNL-QL-066":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "caselet",
            title: "Retail pricing caselet",
            paragraphSource: "caseletData",
          },
          {
            type: "paragraph",
            content: `The retailer's cost is ₹{costPrice}, the markup is {markupPercent}%, and the allowed discount is {discountPercent}%.`,
          },
        ],
        prompt: "Calculate the resulting profit or loss percentage.",
      };
    case "PNL-QL-067":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "paragraph",
            content: `A store announces successive discounts of {firstDiscountPercent}% and {secondDiscountPercent}%.`,
          },
          {
            type: "statements",
            lead: "Consider the following claims:",
            statements: [
              "The equivalent discount is found by adding the two discount rates.",
              "The second discount applies to the price remaining after the first discount.",
            ],
          },
        ],
        prompt: "Select the correct statement about the equivalent discount.",
      };
    case "PNL-QL-068":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "paragraph",
            content: `In an ${family} model, marked price and selling price are represented algebraically.`,
          },
          {
            type: "equation",
            latex:
              "M={markedPriceExpression},\\qquad S={sellingPriceExpression}",
          },
        ],
        prompt: "Find the discount percentage.",
      };
    case "PNL-QL-070":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "paragraph",
            content:
              "The discount needed to achieve a stated target result is to be determined.",
          },
          {
            type: "data_sufficiency",
            question: "Can the required discount be determined uniquely?",
            statements: ["{statementOne}", "{statementTwo}"],
            answerScheme: "STANDARD_TWO_STATEMENT",
          },
        ],
        prompt:
          "Decide whether either statement alone or both together are sufficient.",
      };
    case "PNL-QL-088":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "paragraph",
            content: `The ${context.actor} records several inventory groups in the table below.`,
          },
          {
            type: "table",
            caption: "Inventory groups",
            columns: ["Group", "Quantity and unit cost", "Selling condition"],
            rowSource: "inventoryTable",
          },
        ],
        prompt: "Calculate the overall percentage gain or loss.",
      };
    case "PNL-QL-089":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "caselet",
            title: "Warehouse inventory caselet",
            paragraphSource: "caseletData",
          },
        ],
        prompt:
          "Calculate the dealer's overall percentage gain or loss after accounting for sold and remaining stock.",
      };
    case "PNL-QL-090":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "paragraph",
            content: `Two items are sold at the same price, one at {ratePercent}% profit and the other at {ratePercent}% loss.`,
          },
          {
            type: "statements",
            lead: "Consider the following claims:",
            statements: [
              "The equal profit and loss rates cancel completely.",
              "The pair produces an overall loss because the two cost-price bases are different.",
            ],
          },
        ],
        prompt: "Select the correct statement about the overall result.",
      };
    case "PNL-QL-091":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "paragraph",
            content:
              "The costs and selling conditions of inventory groups are expressed algebraically.",
          },
          {
            type: "equation",
            latex:
              "\\text{Group data}={groupCostExpressions},\\qquad \\text{target rate}={targetRatePercent}\\%",
          },
        ],
        prompt:
          "Determine the unknown group rate required for the stated overall result.",
      };
    case "PNL-QL-092":
      return {
        contextFamily: family,
        blocks: [
          {
            type: "data_sufficiency",
            question:
              "Can the required unit selling price of the remaining stock be determined?",
            statements: ["{statementOne}", "{statementTwo}"],
            answerScheme: "STANDARD_TWO_STATEMENT",
          },
        ],
        prompt:
          "Decide whether either statement alone or both together are sufficient.",
      };
    default:
      return undefined;
  }
}

function aggregateVariableBlock(
  variable: string,
): QuestionStemBlock | undefined {
  if (/^(lots|groups|soldGroups|knownGroups|fixedGroups)$/.test(variable))
    return dataTable(variable);
  return undefined;
}

function placeholders(value: string): Set<string> {
  return new Set(
    [...value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(
      (match) => match[1],
    ),
  );
}

function buildDirectStem(
  qlId: string,
  cpId: string,
  registryEntry: RegistryEntry,
  template: string,
): StructuredQuestionStem {
  const context = legacyEditorialContext(cpId, qlNumber(qlId));

  if (qlId === "PNL-QL-071" || qlId === "PNL-QL-093") {
    return {
      contextFamily: context.family,
      blocks: [
        {
          type: "paragraph",
          content: `The ${context.actor} purchases and sells several groups of ${context.item}.`,
        },
        dataTable("lots"),
      ],
      prompt:
        qlId === "PNL-QL-071"
          ? "Calculate the overall percentage gain or loss."
          : "Find the overall profit or loss amount.",
    };
  }
  if (qlId === "PNL-QL-074") {
    return {
      contextFamily: context.family,
      blocks: [
        {
          type: "paragraph",
          content: `A retailer buys {totalQuantity} identical units at ₹{unitCostPrice} each.`,
        },
        dataTable("soldGroups"),
        {
          type: "paragraph",
          content: `{unsoldQuantity} units remain and recover ₹{unsoldRecoveryPerUnit} per unit.`,
        },
      ],
      prompt:
        "Calculate the overall percentage gain or loss on the complete inventory.",
    };
  }
  if (qlId === "PNL-QL-077") {
    return {
      contextFamily: context.family,
      blocks: [
        {
          type: "paragraph",
          content: `The ${context.actor} divides ${context.item} into the groups shown below.`,
        },
        dataTable("groups"),
      ],
      prompt: "Calculate the overall percentage gain or loss.",
    };
  }
  if (qlId === "PNL-QL-078") {
    return {
      contextFamily: context.family,
      blocks: [
        dataTable("knownGroups"),
        {
          type: "paragraph",
          content: `The remaining {unknownQuantity} units cost ₹{unknownUnitCostPrice} each and will be sold at an unknown {unknownDirection} rate.`,
        },
      ],
      prompt:
        "Find the unknown rate needed for an overall {targetRatePercent}% {targetDirection}.",
    };
  }
  if (qlId === "PNL-QL-079") {
    return {
      contextFamily: context.family,
      blocks: [
        dataTable("fixedGroups"),
        {
          type: "paragraph",
          content: `Additional units cost ₹{unknownUnitCostPrice} each and are sold at {unknownRatePercent}% {unknownDirection}.`,
        },
      ],
      prompt:
        "How many additional units are needed for an overall {targetRatePercent}% {targetDirection}?",
    };
  }
  if (qlId === "PNL-QL-080" || qlId === "PNL-QL-081") {
    return {
      contextFamily: context.family,
      blocks: [
        {
          type: "paragraph",
          content: `A dealer buys {totalQuantity} units at ₹{unitCostPrice} each.`,
        },
        dataTable("soldGroups"),
      ],
      prompt:
        qlId === "PNL-QL-080"
          ? "At what unit price should the remaining stock be sold for an overall {targetRatePercent}% {targetDirection}?"
          : "At what profit or loss rate should the remaining stock be sold for an overall {targetRatePercent}% {targetDirection}?",
    };
  }
  if (qlId === "PNL-QL-087") {
    return {
      contextFamily: context.family,
      blocks: [
        {
          type: "paragraph",
          content: `The total cost of the stock is ₹{totalCostPrice}, and the amount recovered is {recoveredFraction} of that cost.`,
        },
      ],
      prompt: "Find the overall profit or loss percentage.",
    };
  }

  const structured = representationStem(qlId, cpId, registryEntry);
  if (structured) return structured;

  const contextual = contextualise(template, qlId, cpId);
  const split = splitPrompt(contextual);
  const blocks: QuestionStemBlock[] = [
    { type: "paragraph", content: split.body },
  ];
  const visible = placeholders(`${split.body} ${split.prompt}`);

  for (const variable of registryEntry.requiredVariables) {
    if (visible.has(variable)) continue;
    const aggregate = aggregateVariableBlock(variable);
    if (aggregate) blocks.push(aggregate);
    else
      blocks.push({
        type: "paragraph",
        content: `Additional given value: {${variable}}.`,
      });
  }

  return { contextFamily: context.family, blocks, prompt: split.prompt };
}

function buildExplanation(cpId: string, solveMode: string, qlId: string) {
  if (qlId === "PNL-QL-070") {
    return {
      opening:
        "Test each statement independently before combining the information.",
      concept:
        "Statement I can determine the target selling price from cost price and the target result, but discount also needs marked price. Statement II supplies marked price but cannot determine the target selling price. Together they determine the discount uniquely.",
      steps: [
        {
          title: "Check Statement I alone",
          body: "Cost price and the target profit or loss fix the target selling price, but marked price is still unknown.",
        },
        {
          title: "Check Statement II alone",
          body: "Marked price is known, but the selling price required for the target result is still unknown.",
        },
        {
          title: "Combine both statements",
          body: "Use Statement I to find target selling price, then compare it with the marked price from Statement II to calculate the discount percentage.",
          equationLatex: "d=\\frac{M-S_{target}}{M}\\times100",
        },
      ],
      conclusion:
        "Neither statement alone is sufficient; both statements together are required.",
      commonTrap:
        "Do not use information from Statement II while testing Statement I, or vice versa.",
    };
  }
  if (cpId === "PNL-CP-001") return buildCp001Explanation(solveMode, qlId);
  if (cpId === "PNL-CP-002") return buildCp002Explanation(solveMode, qlId);
  return buildCp003Explanation(solveMode, qlId);
}

export function buildLegacyEditorialLibrary(
  cpFolder: LegacyCpFolder,
): EditorialLibraryFile {
  const registry = readJson<RegistryFile>(
    join(pnlRoot, cpFolder, "task-registry.library.json"),
  );
  const language = readJson<LanguageFile>(
    join(pnlRoot, cpFolder, "question-language.en.json"),
  );
  const entries: Record<string, StructuredEditorialEntry> = {};

  for (const [qlId, registryEntry] of Object.entries(registry.entries)) {
    const languageEntry = language.entries[qlId];
    if (!languageEntry)
      throw new Error(`${cpFolder} ${qlId}: missing English template.`);
    const difficulty =
      LEGACY_EDITORIAL_DIFFICULTY_OVERRIDES[qlId] ?? registryEntry.difficulty;
    entries[qlId] = {
      stem: buildDirectStem(
        qlId,
        registry.cpId,
        registryEntry,
        languageEntry.template,
      ),
      explanation: buildExplanation(
        registry.cpId,
        registryEntry.solveMode,
        qlId,
      ),
      difficulty,
      difficultyRationale:
        qlId === "PNL-QL-070"
          ? "The two statements must be tested independently before their linked price bases can be combined."
          : legacyDifficultyRationale(difficulty, registryEntry.solveMode),
    };
  }

  return {
    schemaVersion: 2,
    archetypeId: registry.archetypeId,
    cpId: registry.cpId,
    language: "en",
    status: "EDITORIAL_REVIEW_CANDIDATE",
    entries,
    entryCount: Object.keys(entries).length,
  };
}

export function buildAllLegacyEditorialLibraries(): readonly EditorialLibraryFile[] {
  return [
    buildLegacyEditorialLibrary("CP-001"),
    buildLegacyEditorialLibrary("CP-002"),
    buildLegacyEditorialLibrary("CP-003"),
  ];
}
