import { SeededRandom } from "../foundation/prng";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { toStudentSentenceCodeRows } from "./exact-atomic-generator";
import { instantiateEnglishSentenceCodeTopology } from "./language-instantiator.en";
import { getPossibleImpossibleContract } from "./possible-impossible-contracts";
import { buildPossibleImpossibleExplanation } from "./possible-impossible-explanation";
import { buildPossibleImpossibleOptions } from "./possible-impossible-options";
import type {
  GeneratedPossibleImpossiblePrototypeQuestion,
  PossibleImpossiblePrototypeId,
} from "./possible-impossible-types";
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

function buildStem(
  prototypeId: PossibleImpossiblePrototypeId,
  targetWord: string,
  targetToken: string,
  styleIndex: number,
): string {
  const contract = getPossibleImpossibleContract(prototypeId);
  if (contract.predicate === "POSSIBLE" && contract.queryDirection === "WORD_TO_TOKEN") {
    const endings = [
      `Which of the following can be the code for ‘${targetWord}’?`,
      `Which code word may represent ‘${targetWord}’?`,
      `‘${targetWord}’ can be represented by which of the following code words?`,
    ];
    return `${PREFIX} ${endings[styleIndex % endings.length]}`;
  }
  if (contract.predicate === "POSSIBLE" && contract.queryDirection === "TOKEN_TO_WORD") {
    const endings = [
      `Which of the following words can be represented by ‘${targetToken}’?`,
      `The code word ‘${targetToken}’ may represent which word?`,
      `Which word can have ‘${targetToken}’ as its code?`,
    ];
    return `${PREFIX} ${endings[styleIndex % endings.length]}`;
  }
  if (contract.predicate === "IMPOSSIBLE" && contract.queryDirection === "WORD_TO_TOKEN") {
    const endings = [
      `Which of the following cannot be the code for ‘${targetWord}’?`,
      `Which code word cannot represent ‘${targetWord}’?`,
      `‘${targetWord}’ cannot be represented by which of the following code words?`,
    ];
    return `${PREFIX} ${endings[styleIndex % endings.length]}`;
  }
  const endings = [
    `Which of the following words cannot be represented by ‘${targetToken}’?`,
    `The code word ‘${targetToken}’ cannot represent which word?`,
    `Which word cannot have ‘${targetToken}’ as its code?`,
  ];
  return `${PREFIX} ${endings[styleIndex % endings.length]}`;
}

export function generatePossibleImpossiblePrototypeQuestion(
  prototypeId: PossibleImpossiblePrototypeId,
  seed: number,
  forcedTopologyKind?: PartialTopology,
): GeneratedPossibleImpossiblePrototypeQuestion {
  const contract = getPossibleImpossibleContract(prototypeId);
  const random = new SeededRandom(`${prototypeId}:${seed}:generator-v1`);
  const topologyKind = forcedTopologyKind ?? random.pick(contract.supportedTopologies);
  if (!contract.supportedTopologies.includes(topologyKind)) {
    throw new Error(`${prototypeId} does not support topology '${topologyKind}'`);
  }

  const instance = instantiateEnglishSentenceCodeTopology(topologyKind, seed);
  const space = solveSentenceCodeConstraints(displayPuzzle(instance));
  if (space.solutionCount !== 2 && space.solutionCount !== 6) {
    throw new Error(`${prototypeId}/${seed} has unsupported solution count ${space.solutionCount}`);
  }
  const { options, correctIndex } = buildPossibleImpossibleOptions(
    prototypeId,
    space,
    instance.targetWord,
    instance.targetDisplayToken,
    seed,
  );
  const explanation = buildPossibleImpossibleExplanation(prototypeId, instance, space, options);
  const styleIndex = new SeededRandom(`${prototypeId}:${seed}:stem-style-v1`).int(0, 2);
  const optionWitnessCounts = Object.fromEntries(options.map((option) => [option.value, option.witnessCount]));
  const targetCandidateCount = contract.queryDirection === "WORD_TO_TOKEN"
    ? space.candidateTokensByWord[instance.targetWord]!.length
    : space.candidateWordsByToken[instance.targetDisplayToken]!.length;
  if (targetCandidateCount !== 2 && targetCandidateCount !== 3) {
    throw new Error(`${prototypeId}/${seed} has unsupported candidate count ${targetCandidateCount}`);
  }

  return {
    checkpointId: "COD-CP-009",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    seed,
    locale: "en-IN",
    topologyKind,
    difficulty: "MEDIUM",
    renderer: "STATEMENT_CODE_GRID",
    answerType: contract.answerType,
    stem: buildStem(prototypeId, instance.targetWord, instance.targetDisplayToken, styleIndex),
    structuredPrompt: {
      rows: toStudentSentenceCodeRows(instance.rows),
      predicate: contract.predicate,
      queryDirection: contract.queryDirection,
      targetWord: instance.targetWord,
      targetToken: instance.targetDisplayToken,
    },
    options,
    correctIndex,
    explanation,
    metadata: {
      runtimeVersion: "cod-cp009-possible-impossible-prototype-v1",
      scenarioId: instance.scenarioId,
      topologyFingerprint: instance.reviewer.abstract.topologyFingerprint,
      solutionCount: space.solutionCount,
      targetCandidateCount,
      correctWitnessCount: options[correctIndex]!.witnessCount,
      optionWitnessCounts,
      hiddenMappingFingerprint: mappingFingerprint(instance.reviewer.displayHiddenMapping),
    },
  };
}
