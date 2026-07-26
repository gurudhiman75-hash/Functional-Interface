import { SeededRandom } from "../foundation/prng";
import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import { APPROVED_SENTENCE_CODE_DISPLAY_TOKENS } from "./datasets/code-tokens";
import { getEnglishSentenceCodeLexeme } from "./datasets/lexemes.en";
import {
  getEnglishSentenceCodeFrame,
  renderEnglishSentenceTemplate,
} from "./datasets/sentence-frames.en";
import {
  EnglishScenariosForTopology,
  getEnglishSentenceCodeScenario,
} from "./datasets/scenarios.en";
import {
  generateAbstractSentenceCodeTopology,
  type GeneratedSentenceCodeTopology,
  type SentenceCodeTopologyKind,
} from "./topology-generator";

export interface RenderedEnglishSentenceCodeRow {
  rowId: string;
  sentence: string;
  words: readonly string[];
  displayedCodeTokens: readonly string[];
  displayedCode: string;
  reviewerWordIds: readonly string[];
}

export interface RenderedEnglishMissingPresentation {
  rowId: string;
  sentence: string;
  displayedKnownTokens: readonly string[];
  displayedCodeWithBlank: string;
  missingWord: string;
  correctDisplayToken: string;
}

export interface EnglishSentenceCodeLanguageInstance {
  checkpointId: "COD-CP-009";
  prototypeOnly: true;
  permanentQlId: null;
  locale: "en-IN";
  topologyKind: SentenceCodeTopologyKind;
  seed: number;
  scenarioId: string;
  theme: string;
  frameId: string;
  rows: readonly RenderedEnglishSentenceCodeRow[];
  targetWord: string;
  targetDisplayToken: string;
  phraseWords?: readonly string[];
  phraseDisplayTokens?: readonly string[];
  missingPresentation?: RenderedEnglishMissingPresentation;
  reviewer: {
    abstract: GeneratedSentenceCodeTopology;
    wordDisplayById: Readonly<Record<string, string>>;
    internalToDisplayToken: Readonly<Record<string, string>>;
    displayHiddenMapping: Readonly<Record<string, string>>;
  };
}

function templateRoles(template: string): string[] {
  return [...template.matchAll(/\{([A-Z0-9_]+)\}/g)].map((match) => match[1]!);
}

function roleForWordId(generated: GeneratedSentenceCodeTopology, wordId: string): string {
  const found = Object.entries(generated.roleWordIds).find(([, candidateWordId]) => candidateWordId === wordId);
  if (!found) throw new Error(`No topology role owns abstract word '${wordId}'`);
  return found[0];
}

export function instantiateEnglishSentenceCodeTopology(
  kind: SentenceCodeTopologyKind,
  seed: number,
  explicitScenarioId?: string,
): EnglishSentenceCodeLanguageInstance {
  const generated = generateAbstractSentenceCodeTopology(kind, seed);
  const scenarios = EnglishScenariosForTopology(kind);
  if (scenarios.length === 0) throw new Error(`No English scenarios are registered for '${kind}'`);

  const random = new SeededRandom(`cod-cp009-english:${kind}:${seed}:v1`);
  const scenario = explicitScenarioId
    ? getEnglishSentenceCodeScenario(explicitScenarioId)
    : random.pick(scenarios);
  if (scenario.topologyKind !== kind) {
    throw new Error(`Scenario '${scenario.id}' belongs to ${scenario.topologyKind}, not ${kind}`);
  }

  const frame = getEnglishSentenceCodeFrame(kind);
  const roleDisplays: Record<string, string> = {};
  for (const [role, lexemeId] of Object.entries(scenario.roleLexemeIds)) {
    roleDisplays[role] = getEnglishSentenceCodeLexeme(lexemeId).display;
  }

  for (const role of Object.keys(generated.roleWordIds)) {
    if (!roleDisplays[role]) throw new Error(`Scenario '${scenario.id}' does not supply role '${role}'`);
  }
  for (const role of Object.keys(roleDisplays)) {
    if (!generated.roleWordIds[role]) throw new Error(`Scenario '${scenario.id}' supplies unknown role '${role}'`);
  }

  const wordDisplayById: Record<string, string> = {};
  for (const [role, wordId] of Object.entries(generated.roleWordIds)) {
    wordDisplayById[wordId] = roleDisplays[role]!;
  }
  if (new Set(Object.values(wordDisplayById)).size !== Object.values(wordDisplayById).length) {
    throw new Error(`Scenario '${scenario.id}' repeats a visible lexical form`);
  }

  const internalTokens = uniqueSorted(generated.puzzle.rows.flatMap((row) => row.codeTokens));
  if (internalTokens.length > APPROVED_SENTENCE_CODE_DISPLAY_TOKENS.length) {
    throw new Error("Approved display token pool is too small");
  }
  const displayTokens = random.shuffle(APPROVED_SENTENCE_CODE_DISPLAY_TOKENS).slice(0, internalTokens.length);
  const internalToDisplayToken: Record<string, string> = {};
  internalTokens.forEach((token, index) => { internalToDisplayToken[token] = displayTokens[index]!; });

  const visibleLexemes = new Set(Object.values(wordDisplayById));
  for (const token of Object.values(internalToDisplayToken)) {
    if (visibleLexemes.has(token)) throw new Error(`Display code token '${token}' collides with a visible English word`);
  }

  const rows = generated.puzzle.rows.map((abstractRow) => {
    const template = frame.rowTemplates[abstractRow.rowId];
    if (!template) throw new Error(`Frame '${frame.id}' has no template for row '${abstractRow.rowId}'`);
    const orderedRoles = templateRoles(template);
    const expectedWordIds = orderedRoles.map((role) => generated.roleWordIds[role]!);
    if (canonicalSetKey(expectedWordIds) !== canonicalSetKey(abstractRow.wordIds)) {
      throw new Error(`Frame '${frame.id}' does not match abstract row '${abstractRow.rowId}'`);
    }

    const words = orderedRoles.map((role) => roleDisplays[role]!);
    const displayedCodeTokens = abstractRow.codeTokens.map((token) => internalToDisplayToken[token]!);
    return {
      rowId: abstractRow.rowId,
      sentence: renderEnglishSentenceTemplate(template, roleDisplays),
      words,
      displayedCodeTokens,
      displayedCode: displayedCodeTokens.join(" "),
      reviewerWordIds: expectedWordIds,
    } satisfies RenderedEnglishSentenceCodeRow;
  });

  const targetRole = roleForWordId(generated, generated.targetWordId);
  const targetWord = roleDisplays[targetRole]!;
  const targetDisplayToken = internalToDisplayToken[generated.targetToken]!;
  const phraseWords = generated.phraseWordIds?.map((wordId) => wordDisplayById[wordId]!);
  const phraseDisplayTokens = generated.phraseTokens?.map((token) => internalToDisplayToken[token]!);

  let missingPresentation: RenderedEnglishMissingPresentation | undefined;
  if (generated.missingPresentation) {
    const source = generated.missingPresentation;
    const renderedRow = rows.find((row) => row.rowId === source.rowId)!;
    const displayedKnownTokens = source.knownTokens.map((token) => internalToDisplayToken[token]!);
    const correctDisplayToken = internalToDisplayToken[source.expectedMissingToken]!;
    missingPresentation = {
      rowId: source.rowId,
      sentence: renderedRow.sentence,
      displayedKnownTokens,
      displayedCodeWithBlank: random.shuffle([...displayedKnownTokens, "?"]).join(" "),
      missingWord: wordDisplayById[source.missingWordId]!,
      correctDisplayToken,
    };
  }

  const displayHiddenMapping: Record<string, string> = {};
  for (const [wordId, internalToken] of Object.entries(generated.hiddenMapping)) {
    displayHiddenMapping[wordDisplayById[wordId]!] = internalToDisplayToken[internalToken]!;
  }

  return {
    checkpointId: "COD-CP-009",
    prototypeOnly: true,
    permanentQlId: null,
    locale: "en-IN",
    topologyKind: kind,
    seed,
    scenarioId: scenario.id,
    theme: scenario.theme,
    frameId: frame.id,
    rows,
    targetWord,
    targetDisplayToken,
    phraseWords,
    phraseDisplayTokens,
    missingPresentation,
    reviewer: {
      abstract: generated,
      wordDisplayById,
      internalToDisplayToken,
      displayHiddenMapping,
    },
  };
}
