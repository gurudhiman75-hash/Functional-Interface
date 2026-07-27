import type {
  ExactSetMissingExplanation,
  ExactSetMissingOption,
  ExactSetMissingPrototypeId,
} from "./exact-set-missing-types";
import type { EnglishSentenceCodeLanguageInstance } from "./language-instantiator.en";

function quoted(values: readonly string[]): string {
  return values.map((value) => `‘${value}’`).join(", ");
}

function activeTrap(options: readonly ExactSetMissingOption[]): ExactSetMissingOption {
  return options.find((option) => !option.isCorrect && option.errorLabel === "INDIVIDUAL_AMBIGUITY_CONFUSED_WITH_SET_AMBIGUITY")
    ?? options.find((option) => !option.isCorrect && option.errorLabel !== "UNRESOLVED_ASSUMED")
    ?? options.find((option) => !option.isCorrect)!;
}

function phraseExplanation(
  prototypeId: ExactSetMissingPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  options: readonly ExactSetMissingOption[],
): ExactSetMissingExplanation {
  const forward = prototypeId === "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS";
  const phraseWords = instance.phraseWords!;
  const phraseTokens = instance.phraseDisplayTokens!;
  const correctDisplay = forward
    ? [...phraseTokens].sort().join(" ")
    : [...phraseWords].sort().join(", ");
  const trap = activeTrap(options);

  let trapText: string;
  if (trap.errorLabel === "INDIVIDUAL_AMBIGUITY_CONFUSED_WITH_SET_AMBIGUITY") {
    trapText = `‘${trap.value}’ is incorrect. The individual code of each phrase word may interchange, but the complete pair ${quoted(phraseTokens)} is fixed.`;
  } else {
    trapText = `‘${trap.value}’ replaces or adds a member that is not common to all three statements; the exact shared set is ‘${correctDisplay}’.`;
  }

  return {
    referenceAid: [
      "When two words always occur together, their individual code words may remain interchangeable even though their combined code set is exact.",
      "Code-word order is irrelevant; compare complete sets rather than displayed positions.",
    ],
    quickMethod: "Find the words common to all statements and then find the code words common to all corresponding code sets. Treat each result as an unordered set.",
    evidenceComparison: [
      `All three statements contain the two words ${quoted(phraseWords)}.`,
      `The only two code words present in all three code sets are ${quoted(phraseTokens)}. Their internal order cannot be fixed, but no other token belongs to this common pair.`,
    ],
    targetResult: forward
      ? `Therefore, the words ${quoted(phraseWords)} are coded by the set ${quoted(phraseTokens)}.`
      : `Therefore, the code-word set ${quoted(phraseTokens)} represents the word set ${quoted(phraseWords)}.`,
    conclusion: `The correct answer is ‘${correctDisplay}’.`,
    commonTrapAlert: trapText,
  };
}

function missingExplanation(
  prototypeId: ExactSetMissingPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  options: readonly ExactSetMissingOption[],
): ExactSetMissingExplanation {
  const tokenQuestion = prototypeId === "COD-CP009-PROT-MISSING-TOKEN";
  const presentation = instance.missingPresentation!;
  const correct = tokenQuestion ? presentation.correctDisplayToken : presentation.missingWord;
  const second = instance.rows.find((row) => row.rowId === "r2")!;
  const third = instance.rows.find((row) => row.rowId === "r3")!;
  const trap = activeTrap(options);
  const trapText = trap.errorLabel === "UNRESOLVED_ASSUMED"
    ? `‘${trap.value}’ is incorrect because the second and third statements uniquely identify the missing word-code pair.`
    : `‘${trap.value}’ belongs to another member of the displayed statements; it is not the pair common to the second and third statements.`;

  return {
    referenceAid: [
      "A word common to two complete statements must have a code word common to their two code sets.",
      "After identifying that pair, place the missing member in the incomplete first statement.",
    ],
    quickMethod: "Ignore the incomplete statement at first. Compare the two complete statements, identify their single common word and code, and then fill the blank.",
    evidenceComparison: [
      `The second statement ‘${second.sentence}’ and the third statement ‘${third.sentence}’ have only ‘${presentation.missingWord}’ in common.`,
      `Their only common code word is ‘${presentation.correctDisplayToken}’. Hence ‘${presentation.missingWord}’ and ‘${presentation.correctDisplayToken}’ form the required pair.`,
    ],
    targetResult: tokenQuestion
      ? `Therefore, ‘${presentation.correctDisplayToken}’ must replace the missing code word in the first statement.`
      : `Therefore, ‘${presentation.missingWord}’ must replace the missing word in the first statement.`,
    conclusion: `The correct answer is ‘${correct}’.`,
    commonTrapAlert: trapText,
  };
}

export function buildExactSetMissingExplanation(
  prototypeId: ExactSetMissingPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  options: readonly ExactSetMissingOption[],
): ExactSetMissingExplanation {
  return prototypeId.includes("PHRASE")
    ? phraseExplanation(prototypeId, instance, options)
    : missingExplanation(prototypeId, instance, options);
}
