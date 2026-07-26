import { SeededRandom } from "../foundation/prng";
import { buildExactAtomicOptions } from "./exact-atomic-distractors";
import { buildExactAtomicExplanation } from "./exact-atomic-explanation";
import type {
  ExactAtomicPrototypeId,
  GeneratedExactAtomicPrototypeQuestion,
} from "./exact-atomic-types";
import { instantiateEnglishSentenceCodeTopology } from "./language-instantiator.en";
import {
  exactAtomicDifficulty,
  getExactAtomicPrototypeContract,
} from "./prototype-contracts";
import type { SentenceCodeTopologyKind } from "./topology-generator";

function buildStem(
  prototypeId: ExactAtomicPrototypeId,
  targetWord: string,
  targetToken: string,
  styleIndex: number,
): string {
  const prefix = "In a certain code language, the following statements are coded as shown. The order of the code words is not necessarily the same as the order of the words.";
  if (prototypeId === "COD-CP009-PROT-EXACT-WORD-TO-TOKEN") {
    const endings = [
      `What is the code for ‘${targetWord}’?`,
      `Which code word represents ‘${targetWord}’?`,
      `‘${targetWord}’ is represented by which code word?`,
    ];
    return `${prefix} ${endings[styleIndex % endings.length]}`;
  }

  const endings = [
    `Which word is represented by ‘${targetToken}’?`,
    `What does the code word ‘${targetToken}’ represent?`,
    `‘${targetToken}’ is the code word for which word?`,
  ];
  return `${prefix} ${endings[styleIndex % endings.length]}`;
}

function mappingFingerprint(mapping: Readonly<Record<string, string>>): string {
  return Object.entries(mapping)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([word, token]) => `${word}:${token}`)
    .join("|");
}

export function generateExactAtomicPrototypeQuestion(
  prototypeId: ExactAtomicPrototypeId,
  seed: number,
  forcedTopologyKind?: SentenceCodeTopologyKind,
): GeneratedExactAtomicPrototypeQuestion {
  const contract = getExactAtomicPrototypeContract(prototypeId);
  const random = new SeededRandom(`${prototypeId}:${seed}:generator-v1`);
  const topologyKind = forcedTopologyKind ?? random.pick(contract.supportedTopologies);
  if (!contract.supportedTopologies.includes(topologyKind)) {
    throw new Error(`${prototypeId} does not support topology '${topologyKind}'`);
  }

  const instance = instantiateEnglishSentenceCodeTopology(topologyKind, seed);
  const { options, correctIndex } = buildExactAtomicOptions(prototypeId, instance, seed);
  const styleIndex = new SeededRandom(`${prototypeId}:${seed}:stem-style-v1`).int(0, 2);
  const explanation = buildExactAtomicExplanation(prototypeId, instance, options);

  return {
    checkpointId: "COD-CP-009",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    seed,
    locale: "en-IN",
    topologyKind,
    difficulty: exactAtomicDifficulty(topologyKind),
    renderer: "STATEMENT_CODE_GRID",
    answerType: contract.answerType,
    stem: buildStem(prototypeId, instance.targetWord, instance.targetDisplayToken, styleIndex),
    structuredPrompt: {
      rows: instance.rows,
      queryDirection: contract.queryDirection,
      targetWord: instance.targetWord,
      targetToken: instance.targetDisplayToken,
    },
    options,
    correctIndex,
    explanation,
    metadata: {
      runtimeVersion: "cod-cp009-exact-atomic-prototype-v1",
      scenarioId: instance.scenarioId,
      topologyFingerprint: instance.reviewer.abstract.topologyFingerprint,
      solutionCount: instance.reviewer.abstract.expectedSolutionCount,
      targetCandidateCount: 1,
      hiddenMappingFingerprint: mappingFingerprint(instance.reviewer.displayHiddenMapping),
    },
  };
}
