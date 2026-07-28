import { SeededRandom } from "../foundation/prng";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { getCompleteCandidateSetContract } from "./complete-candidate-set-contracts";
import { buildCompleteCandidateSetExplanation } from "./complete-candidate-set-explanation";
import { buildCompleteCandidateSetOptions } from "./complete-candidate-set-options";
import type {
  CompleteCandidateSetPrototypeId,
  GeneratedCompleteCandidateSetPrototypeQuestion,
} from "./complete-candidate-set-types";
import { toStudentSentenceCodeRows } from "./exact-atomic-generator";
import { instantiateEnglishSentenceCodeTopology } from "./language-instantiator.en";
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

function candidateWitnessCounts(
  direction: "WORD_TO_ALL_TOKENS" | "TOKEN_TO_ALL_WORDS",
  instance: ReturnType<typeof instantiateEnglishSentenceCodeTopology>,
  space: ReturnType<typeof solveSentenceCodeConstraints>,
  candidates: readonly string[],
): Record<string, number> {
  return Object.fromEntries(candidates.map((candidate) => [
    candidate,
    direction === "WORD_TO_ALL_TOKENS"
      ? space.solutions.filter((solution) => solution.wordToToken[instance.targetWord] === candidate).length
      : space.solutions.filter((solution) => solution.wordToToken[candidate] === instance.targetDisplayToken).length,
  ]));
}

function buildStem(
  prototypeId: CompleteCandidateSetPrototypeId,
  targetWord: string,
  targetToken: string,
  styleIndex: number,
): string {
  if (prototypeId === "COD-CP009-PROT-COMPLETE-CODE-CANDIDATE-SET") {
    const endings = [
      `Which option lists all possible code words for ‘${targetWord}’?`,
      `What is the complete set of code words that may represent ‘${targetWord}’?`,
      `‘${targetWord}’ may be represented by which complete set of code words?`,
    ];
    return `${PREFIX} ${endings[styleIndex % endings.length]}`;
  }
  const endings = [
    `Which option lists all possible words represented by ‘${targetToken}’?`,
    `What is the complete set of words that the code word ‘${targetToken}’ may represent?`,
    `‘${targetToken}’ may represent which complete set of words?`,
  ];
  return `${PREFIX} ${endings[styleIndex % endings.length]}`;
}

export function generateCompleteCandidateSetPrototypeQuestion(
  prototypeId: CompleteCandidateSetPrototypeId,
  seed: number,
  forcedTopologyKind?: PartialTopology,
): GeneratedCompleteCandidateSetPrototypeQuestion {
  const contract = getCompleteCandidateSetContract(prototypeId);
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
  const { options, correctIndex, completeCandidates } = buildCompleteCandidateSetOptions(
    prototypeId,
    space,
    instance.targetWord,
    instance.targetDisplayToken,
    seed,
  );
  const explanation = buildCompleteCandidateSetExplanation(
    prototypeId,
    instance,
    space,
    completeCandidates,
    options,
  );
  const styleIndex = new SeededRandom(`${prototypeId}:${seed}:stem-style-v1`).int(0, 2);
  const witnessCounts = candidateWitnessCounts(
    contract.queryDirection,
    instance,
    space,
    completeCandidates,
  );

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
    stem: buildStem(prototypeId, instance.targetWord, instance.targetDisplayToken, styleIndex),
    structuredPrompt: {
      rows: toStudentSentenceCodeRows(instance.rows),
      queryDirection: contract.queryDirection,
      targetWord: instance.targetWord,
      targetToken: instance.targetDisplayToken,
      completeCandidateSet: completeCandidates,
    },
    options,
    correctIndex,
    explanation,
    metadata: {
      runtimeVersion: "cod-cp009-complete-candidate-set-prototype-v1",
      scenarioId: instance.scenarioId,
      topologyFingerprint: instance.reviewer.abstract.topologyFingerprint,
      solutionCount: space.solutionCount,
      candidateCount: completeCandidates.length,
      candidateWitnessCounts: witnessCounts,
      hiddenMappingFingerprint: mappingFingerprint(instance.reviewer.displayHiddenMapping),
    },
  };
}
