import { SeededRandom } from "../foundation/prng";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { toStudentSentenceCodeRows } from "./exact-atomic-generator";
import { instantiateEnglishSentenceCodeTopology } from "./language-instantiator.en";
import { getPossibleSetContract } from "./possible-set-contracts";
import { buildPossibleSetExplanation } from "./possible-set-explanation";
import { buildPossibleSetOptions } from "./possible-set-options";
import type {
  GeneratedPossibleSetPrototypeQuestion,
  PossibleSetPrototypeId,
} from "./possible-set-types";
import type { SentenceCodeTopologyKind } from "./topology-generator";
import type { AbstractSentenceCodePuzzle } from "./types";

const PREFIX = "In a certain code language, the following statements are coded as shown. The order of the code words is not necessarily the same as the order of the words.";

type PartialTopology = Extract<
  SentenceCodeTopologyKind,
  "CONTROLLED_PARTIAL_INFORMATION" | "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION"
>;

function mappingFingerprint(mapping: Readonly<Record<string, string>>): string {
  return Object.entries(mapping)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([word, token]) => `${word}:${token}`)
    .join("|");
}

function displayPuzzle(instance: ReturnType<typeof instantiateEnglishSentenceCodeTopology>): AbstractSentenceCodePuzzle {
  return {
    rows: instance.rows.map((row) => ({
      rowId: row.rowId,
      wordIds: row.words,
      codeTokens: row.displayedCodeTokens,
    })),
  };
}

function resolvedPair(instance: ReturnType<typeof instantiateEnglishSentenceCodeTopology>): {
  word: string;
  token: string;
} {
  const abstract = instance.reviewer.abstract;
  const wordId = abstract.roleWordIds.MISSING_ROW_1;
  const internalToken = abstract.roleTokens.MISSING_ROW_1;
  if (!wordId || !internalToken) throw new Error(`${instance.topologyKind} has no MISSING_ROW_1 resolved member`);
  const word = instance.reviewer.wordDisplayById[wordId];
  const token = instance.reviewer.internalToDisplayToken[internalToken];
  if (!word || !token) throw new Error(`Cannot render resolved member for ${instance.topologyKind}/${instance.seed}`);
  return { word, token };
}

function buildStem(
  prototypeId: PossibleSetPrototypeId,
  targetWords: readonly [string, string],
  targetTokens: readonly [string, string],
  styleIndex: number,
): string {
  if (prototypeId === "COD-CP009-PROT-POSSIBLE-WORD-SET-TO-TOKENS") {
    const words = targetWords.map((word) => `‘${word}’`).join(" and ");
    const endings = [
      `Which of the following sets of code words can represent ${words}?`,
      `Which code-word pair may represent the words ${words}?`,
      `The words ${words} can be represented by which code-word set?`,
    ];
    return `${PREFIX} ${endings[styleIndex % endings.length]}`;
  }
  const tokens = [...targetTokens].sort().map((token) => `‘${token}’`).join(" and ");
  const endings = [
    `Which of the following pairs of words can be represented by the code words ${tokens}?`,
    `The code words ${tokens} may represent which word pair?`,
    `Which word set can correspond to the code words ${tokens}?`,
  ];
  return `${PREFIX} ${endings[styleIndex % endings.length]}`;
}

export function generatePossibleSetPrototypeQuestion(
  prototypeId: PossibleSetPrototypeId,
  seed: number,
  forcedTopologyKind?: PartialTopology,
): GeneratedPossibleSetPrototypeQuestion {
  const contract = getPossibleSetContract(prototypeId);
  const random = new SeededRandom(`${prototypeId}:${seed}:generator-v1`);
  const topologyKind = forcedTopologyKind ?? random.pick(contract.supportedTopologies);
  if (!contract.supportedTopologies.includes(topologyKind)) {
    throw new Error(`${prototypeId} does not support topology '${topologyKind}'`);
  }

  const instance = instantiateEnglishSentenceCodeTopology(topologyKind, seed);
  const resolved = resolvedPair(instance);
  const targetWords: [string, string] = [instance.targetWord, resolved.word];
  const targetTokens: [string, string] = [instance.targetDisplayToken, resolved.token];
  const space = solveSentenceCodeConstraints(displayPuzzle(instance));
  if (space.solutionCount !== 2 && space.solutionCount !== 6) {
    throw new Error(`${prototypeId}/${seed} has unsupported solution count ${space.solutionCount}`);
  }

  const { options, correctIndex, possibleSetCount } = buildPossibleSetOptions(
    prototypeId,
    space,
    targetWords,
    targetTokens,
    seed,
  );
  const explanation = buildPossibleSetExplanation(
    prototypeId,
    instance,
    space,
    targetWords,
    targetTokens,
    resolved.word,
    resolved.token,
    options,
  );
  const styleIndex = new SeededRandom(`${prototypeId}:${seed}:stem-style-v1`).int(0, 2);

  return {
    checkpointId: "COD-CP-009",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    seed,
    locale: "en-IN",
    topologyKind,
    difficulty: topologyKind === "CONTROLLED_PARTIAL_INFORMATION" ? "MEDIUM" : "HARD",
    renderer: "STATEMENT_CODE_GRID",
    answerType: contract.answerType,
    stem: buildStem(prototypeId, targetWords, targetTokens, styleIndex),
    structuredPrompt: {
      rows: toStudentSentenceCodeRows(instance.rows),
      queryDirection: contract.queryDirection,
      targetWords,
      targetTokens,
      ambiguousMember: contract.queryDirection === "WORDS_TO_TOKENS" ? instance.targetWord : instance.targetDisplayToken,
      resolvedMember: contract.queryDirection === "WORDS_TO_TOKENS" ? resolved.word : resolved.token,
    },
    options,
    correctIndex,
    explanation,
    metadata: {
      runtimeVersion: "cod-cp009-possible-set-prototype-v1",
      scenarioId: instance.scenarioId,
      topologyFingerprint: instance.reviewer.abstract.topologyFingerprint,
      solutionCount: space.solutionCount,
      possibleSetCount,
      correctWitnessCount: options[correctIndex]!.witnessCount,
      optionWitnessCounts: Object.fromEntries(options.map((option) => [option.canonicalValue, option.witnessCount])),
      hiddenMappingFingerprint: mappingFingerprint(instance.reviewer.displayHiddenMapping),
    },
  };
}
