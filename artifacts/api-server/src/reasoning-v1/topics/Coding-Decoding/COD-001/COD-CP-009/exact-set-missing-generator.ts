import { SeededRandom } from "../foundation/prng";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { toStudentSentenceCodeRows } from "./exact-atomic-generator";
import type { StudentSentenceCodeRow } from "./exact-atomic-types";
import { getExactSetMissingContract } from "./exact-set-missing-contracts";
import { buildExactSetMissingOptions } from "./exact-set-missing-distractors";
import { buildExactSetMissingExplanation } from "./exact-set-missing-explanation";
import type {
  ExactSetMissingPrototypeId,
  ExactSetMissingStructuredPrompt,
  GeneratedExactSetMissingPrototypeQuestion,
} from "./exact-set-missing-types";
import { instantiateEnglishSentenceCodeTopology } from "./language-instantiator.en";
import type { AbstractSentenceCodePuzzle } from "./types";

const PREFIX = "In a certain code language, the following statements are coded as shown. The order of the code words is not necessarily the same as the order of the words.";

function mappingFingerprint(mapping: Readonly<Record<string, string>>): string {
  return Object.entries(mapping)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([word, token]) => `${word}:${token}`)
    .join("|");
}

function displayPuzzleFromInstance(instance: ReturnType<typeof instantiateEnglishSentenceCodeTopology>): AbstractSentenceCodePuzzle {
  return {
    rows: instance.rows.map((row) => ({
      rowId: row.rowId,
      wordIds: row.words,
      codeTokens: row.displayedCodeTokens,
    })),
  };
}

function blankWord(sentence: string, word: string): string {
  const words = sentence.split(/\s+/);
  const index = words.indexOf(word);
  if (index < 0) throw new Error(`Cannot blank word '${word}' in '${sentence}'`);
  words[index] = "_____";
  return words.join(" ");
}

function buildPromptAndRows(
  prototypeId: ExactSetMissingPrototypeId,
  instance: ReturnType<typeof instantiateEnglishSentenceCodeTopology>,
): { prompt: ExactSetMissingStructuredPrompt; rows: readonly StudentSentenceCodeRow[] } {
  const rows = toStudentSentenceCodeRows(instance.rows);

  if (prototypeId === "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS") {
    const prompt: ExactSetMissingStructuredPrompt = {
      kind: "EXACT_PHRASE_TO_TOKENS",
      rows,
      phraseWords: [...instance.phraseWords!],
      phraseTokens: [...instance.phraseDisplayTokens!],
    };
    return { prompt, rows };
  }

  if (prototypeId === "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE") {
    const prompt: ExactSetMissingStructuredPrompt = {
      kind: "EXACT_TOKENS_TO_PHRASE",
      rows,
      phraseWords: [...instance.phraseWords!],
      phraseTokens: [...instance.phraseDisplayTokens!],
    };
    return { prompt, rows };
  }

  const presentation = instance.missingPresentation!;
  const incompleteIndex = [...instance.rows]
    .sort((left, right) => left.rowId.localeCompare(right.rowId))
    .findIndex((row) => row.rowId === presentation.rowId);
  if (incompleteIndex < 0) throw new Error(`Missing rendered statement '${presentation.rowId}'`);
  const incompleteStatementId = `statement-${incompleteIndex + 1}`;

  if (prototypeId === "COD-CP009-PROT-MISSING-TOKEN") {
    const incompleteRows = rows.map((row) => row.statementId === incompleteStatementId
      ? {
        ...row,
        displayedCodeTokens: presentation.displayedCodeWithBlank.split(/\s+/),
        displayedCode: presentation.displayedCodeWithBlank,
      }
      : row);
    const prompt: ExactSetMissingStructuredPrompt = {
      kind: "MISSING_TOKEN",
      rows: incompleteRows,
      incompleteStatementId,
      incompleteSentence: presentation.sentence,
      displayedCodeWithBlank: presentation.displayedCodeWithBlank,
      knownTokens: [...presentation.displayedKnownTokens],
      correctToken: presentation.correctDisplayToken,
    };
    return { prompt, rows: incompleteRows };
  }

  const fullRow = rows.find((row) => row.statementId === incompleteStatementId)!;
  const displayedSentenceWithBlank = blankWord(fullRow.sentence, presentation.missingWord);
  const incompleteRows = rows.map((row) => row.statementId === incompleteStatementId
    ? {
      ...row,
      sentence: displayedSentenceWithBlank,
      words: row.words.map((word) => word === presentation.missingWord ? "_____" : word),
    }
    : row);
  const prompt: ExactSetMissingStructuredPrompt = {
    kind: "MISSING_WORD",
    rows: incompleteRows,
    incompleteStatementId,
    displayedSentenceWithBlank,
    fullCodeTokens: [...fullRow.displayedCodeTokens],
    displayedCode: fullRow.displayedCode,
    correctWord: presentation.missingWord,
  };
  return { prompt, rows: incompleteRows };
}

function buildStem(
  prototypeId: ExactSetMissingPrototypeId,
  instance: ReturnType<typeof instantiateEnglishSentenceCodeTopology>,
  styleIndex: number,
): string {
  if (prototypeId === "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS") {
    const phrase = instance.phraseWords!.join(" ");
    const endings = [
      `How will the words ‘${phrase}’ be coded?`,
      `Which set of code words represents ‘${phrase}’?`,
      `What is the code-word set for ‘${phrase}’?`,
    ];
    return `${PREFIX} ${endings[styleIndex % endings.length]}`;
  }

  if (prototypeId === "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE") {
    const tokens = [...instance.phraseDisplayTokens!].sort().join(" ");
    const endings = [
      `Which pair of words is represented by the code words ‘${tokens}’?`,
      `The code-word set ‘${tokens}’ represents which pair of words?`,
      `Which word set corresponds to ‘${tokens}’?`,
    ];
    return `${PREFIX} ${endings[styleIndex % endings.length]}`;
  }

  if (prototypeId === "COD-CP009-PROT-MISSING-TOKEN") {
    return `${PREFIX} In the first statement, one code word has been replaced by ‘?’. Which code word should replace ‘?’?`;
  }

  return `${PREFIX} In the first statement, one word has been replaced by a blank. Which word should replace the blank?`;
}

export function generateExactSetMissingPrototypeQuestion(
  prototypeId: ExactSetMissingPrototypeId,
  seed: number,
): GeneratedExactSetMissingPrototypeQuestion {
  const contract = getExactSetMissingContract(prototypeId);
  const instance = instantiateEnglishSentenceCodeTopology(contract.topologyKind, seed);
  const fullDisplayPuzzle = displayPuzzleFromInstance(instance);
  const space = solveSentenceCodeConstraints(fullDisplayPuzzle);
  const { options, correctIndex } = buildExactSetMissingOptions(prototypeId, instance, space, seed);
  const { prompt } = buildPromptAndRows(prototypeId, instance);
  const styleIndex = new SeededRandom(`${prototypeId}:${seed}:stem-style-v1`).int(0, 2);
  const explanation = buildExactSetMissingExplanation(prototypeId, instance, options);

  return {
    checkpointId: "COD-CP-009",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    seed,
    locale: "en-IN",
    topologyKind: contract.topologyKind,
    difficulty: "MEDIUM",
    renderer: "STATEMENT_CODE_GRID",
    answerType: contract.answerType,
    stem: buildStem(prototypeId, instance, styleIndex),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation,
    metadata: {
      runtimeVersion: "cod-cp009-exact-set-missing-prototype-v1",
      scenarioId: instance.scenarioId,
      topologyFingerprint: instance.reviewer.abstract.topologyFingerprint,
      solutionCount: space.solutionCount,
      exactResultCount: 1,
      individualPairAmbiguity: contract.topologyKind === "PHRASE_SET_COMPOSITION",
      hiddenMappingFingerprint: mappingFingerprint(instance.reviewer.displayHiddenMapping),
    },
  };
}
