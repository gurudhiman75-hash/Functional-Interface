import { SeededRandom } from "../foundation/prng";
import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import { APPROVED_SENTENCE_CODE_DISPLAY_TOKENS } from "./datasets/code-tokens";
import { getEnglishSentenceCodeLexeme } from "./datasets/lexemes.en";
import {
  getResolvedCompositionScenario,
  RESOLVED_COMPOSITION_SCENARIOS,
} from "./datasets/resolved-composition-scenarios.en";
import type { RenderedEnglishSentenceCodeRow } from "./language-instantiator.en";
import {
  generateResolvedCompositionTopology,
  type GeneratedResolvedCompositionTopology,
} from "./resolved-composition-topology";

export interface ResolvedCompositionLanguageInstance {
  checkpointId: "COD-CP-009";
  prototypeOnly: true;
  permanentQlId: null;
  locale: "en-IN";
  topologyKind: "RESOLVED_COMPONENT_COMPOSITION";
  seed: number;
  scenarioId: string;
  theme: string;
  rows: readonly RenderedEnglishSentenceCodeRow[];
  targetWords: readonly [string, string];
  targetDisplayTokens: readonly [string, string];
  reviewer: {
    abstract: GeneratedResolvedCompositionTopology;
    wordDisplayById: Readonly<Record<string, string>>;
    internalToDisplayToken: Readonly<Record<string, string>>;
    displayHiddenMapping: Readonly<Record<string, string>>;
  };
}

const ROW_ROLES: Readonly<Record<string, readonly string[]>> = {
  r1: ["COMPONENT_A", "A_ROW_1_ONLY"],
  r2: ["COMPONENT_A", "A_ROW_2_ONLY"],
  r3: ["B_ROW_3_ONLY", "COMPONENT_B"],
  r4: ["B_ROW_4_ONLY", "COMPONENT_B"],
};

export function instantiateResolvedCompositionEnglish(
  seed: number,
  explicitScenarioId?: string,
): ResolvedCompositionLanguageInstance {
  const abstract = generateResolvedCompositionTopology(seed);
  const random = new SeededRandom(`cod-cp009-resolved-composition-en:${seed}:v1`);
  const scenario = explicitScenarioId
    ? getResolvedCompositionScenario(explicitScenarioId)
    : random.pick(RESOLVED_COMPOSITION_SCENARIOS);
  const roleDisplays: Record<string, string> = {};
  for (const [role, lexemeId] of Object.entries(scenario.roleLexemeIds)) {
    roleDisplays[role] = getEnglishSentenceCodeLexeme(lexemeId).display;
  }
  if (new Set(Object.values(roleDisplays)).size !== Object.values(roleDisplays).length) {
    throw new Error(`Resolved-composition scenario '${scenario.id}' repeats a visible word`);
  }

  const wordDisplayById: Record<string, string> = {};
  for (const [role, wordId] of Object.entries(abstract.roleWordIds)) {
    const display = roleDisplays[role];
    if (!display) throw new Error(`Scenario '${scenario.id}' does not supply '${role}'`);
    wordDisplayById[wordId] = display;
  }

  const internalTokens = uniqueSorted(abstract.puzzle.rows.flatMap((row) => row.codeTokens));
  const displayTokens = random.shuffle(APPROVED_SENTENCE_CODE_DISPLAY_TOKENS).slice(0, internalTokens.length);
  const internalToDisplayToken: Record<string, string> = {};
  internalTokens.forEach((token, index) => { internalToDisplayToken[token] = displayTokens[index]!; });

  const rows = abstract.puzzle.rows.map((row) => {
    const roles = ROW_ROLES[row.rowId];
    if (!roles) throw new Error(`No resolved-composition frame for '${row.rowId}'`);
    const expectedWordIds = roles.map((role) => abstract.roleWordIds[role]!);
    if (canonicalSetKey(expectedWordIds) !== canonicalSetKey(row.wordIds)) {
      throw new Error(`Resolved-composition frame mismatch for '${row.rowId}'`);
    }
    const words = roles.map((role) => roleDisplays[role]!);
    const displayedCodeTokens = row.codeTokens.map((token) => internalToDisplayToken[token]!);
    return {
      rowId: row.rowId,
      sentence: words.join(" "),
      words,
      displayedCodeTokens,
      displayedCode: displayedCodeTokens.join(" "),
      reviewerWordIds: expectedWordIds,
    } satisfies RenderedEnglishSentenceCodeRow;
  });

  const targetWords: [string, string] = abstract.targetWordIds.map((wordId) => wordDisplayById[wordId]!) as [string, string];
  const targetDisplayTokens: [string, string] = abstract.targetTokens.map((token) => internalToDisplayToken[token]!) as [string, string];
  const displayHiddenMapping: Record<string, string> = {};
  for (const [wordId, token] of Object.entries(abstract.hiddenMapping)) {
    displayHiddenMapping[wordDisplayById[wordId]!] = internalToDisplayToken[token]!;
  }

  return {
    checkpointId: "COD-CP-009",
    prototypeOnly: true,
    permanentQlId: null,
    locale: "en-IN",
    topologyKind: "RESOLVED_COMPONENT_COMPOSITION",
    seed,
    scenarioId: scenario.id,
    theme: scenario.theme,
    rows,
    targetWords,
    targetDisplayTokens,
    reviewer: {
      abstract,
      wordDisplayById,
      internalToDisplayToken,
      displayHiddenMapping,
    },
  };
}
