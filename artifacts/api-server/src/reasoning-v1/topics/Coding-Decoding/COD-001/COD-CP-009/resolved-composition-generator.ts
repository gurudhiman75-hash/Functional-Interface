import { SeededRandom } from "../foundation/prng";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { toStudentSentenceCodeRows } from "./exact-atomic-generator";
import { getResolvedCompositionContract } from "./resolved-composition-contracts";
import { buildResolvedCompositionExplanation } from "./resolved-composition-explanation";
import { instantiateResolvedCompositionEnglish } from "./resolved-composition-language.en";
import { buildResolvedCompositionOptions } from "./resolved-composition-options";
import type {
  GeneratedResolvedCompositionPrototypeQuestion,
  ResolvedCompositionPrototypeId,
} from "./resolved-composition-types";
import type { AbstractSentenceCodePuzzle } from "./types";

const PREFIX = "In a certain code language, the following statements are coded as shown. The order of the code words is not necessarily the same as the order of the words.";

function mappingFingerprint(mapping: Readonly<Record<string, string>>): string {
  return Object.entries(mapping)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([word, token]) => `${word}:${token}`)
    .join("|");
}

function displayedPuzzle(instance: ReturnType<typeof instantiateResolvedCompositionEnglish>): AbstractSentenceCodePuzzle {
  return {
    rows: instance.rows.map((row) => ({
      rowId: row.rowId,
      wordIds: row.words,
      codeTokens: row.displayedCodeTokens,
    })),
  };
}

function buildStem(
  prototypeId: ResolvedCompositionPrototypeId,
  words: readonly [string, string],
  tokens: readonly [string, string],
  styleIndex: number,
): string {
  if (prototypeId === "COD-CP009-PROT-EXACT-RESOLVED-WORDS-TO-TOKENS") {
    const quotedWords = words.map((word) => `‘${word}’`).join(" and ");
    const endings = [
      `Which code-word set represents the words ${quotedWords}?`,
      `How will the words ${quotedWords} be coded?`,
      `What is the code-word pair for ${quotedWords}?`,
    ];
    return `${PREFIX} ${endings[styleIndex % endings.length]}`;
  }
  const quotedTokens = [...tokens].sort().map((token) => `‘${token}’`).join(" and ");
  const endings = [
    `Which word pair is represented by the code words ${quotedTokens}?`,
    `The code words ${quotedTokens} represent which pair of words?`,
    `Which word set corresponds to the code words ${quotedTokens}?`,
  ];
  return `${PREFIX} ${endings[styleIndex % endings.length]}`;
}

export function generateResolvedCompositionPrototypeQuestion(
  prototypeId: ResolvedCompositionPrototypeId,
  seed: number,
): GeneratedResolvedCompositionPrototypeQuestion {
  const contract = getResolvedCompositionContract(prototypeId);
  const instance = instantiateResolvedCompositionEnglish(seed);
  const space = solveSentenceCodeConstraints(displayedPuzzle(instance));
  if (space.solutionCount !== 1) throw new Error(`${prototypeId}/${seed} expected one displayed solution`);
  const { options, correctIndex } = buildResolvedCompositionOptions(prototypeId, instance, space, seed);
  const explanation = buildResolvedCompositionExplanation(prototypeId, instance, options);
  const styleIndex = new SeededRandom(`${prototypeId}:${seed}:stem-style-v1`).int(0, 2);

  return {
    checkpointId: "COD-CP-009",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    seed,
    locale: "en-IN",
    topologyKind: "RESOLVED_COMPONENT_COMPOSITION",
    difficulty: "MEDIUM",
    renderer: "STATEMENT_CODE_GRID",
    answerType: contract.answerType,
    stem: buildStem(prototypeId, instance.targetWords, instance.targetDisplayTokens, styleIndex),
    structuredPrompt: {
      rows: toStudentSentenceCodeRows(instance.rows),
      queryDirection: contract.queryDirection,
      targetWords: instance.targetWords,
      targetTokens: instance.targetDisplayTokens,
    },
    options,
    correctIndex,
    explanation,
    metadata: {
      runtimeVersion: "cod-cp009-resolved-composition-prototype-v1",
      scenarioId: instance.scenarioId,
      topologyFingerprint: instance.reviewer.abstract.topologyFingerprint,
      solutionCount: 1,
      bothBranchesRequired: true,
      hiddenMappingFingerprint: mappingFingerprint(instance.reviewer.displayHiddenMapping),
    },
  };
}
