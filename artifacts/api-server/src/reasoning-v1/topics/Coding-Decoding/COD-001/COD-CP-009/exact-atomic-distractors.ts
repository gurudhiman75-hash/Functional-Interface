import { SeededRandom } from "../foundation/prng";
import type { EnglishSentenceCodeLanguageInstance } from "./language-instantiator.en";
import type { ExactAtomicOption, ExactAtomicPrototypeId } from "./exact-atomic-types";
import { getExactAtomicPrototypeContract } from "./prototype-contracts";

interface DistractorCandidate {
  value: string;
  errorLabel: NonNullable<ExactAtomicOption["errorLabel"]>;
}

function positionalAssumption(
  instance: EnglishSentenceCodeLanguageInstance,
  direction: "WORD_TO_TOKEN" | "TOKEN_TO_WORD",
): string | null {
  if (direction === "WORD_TO_TOKEN") {
    const sourceRow = instance.rows.find((row) => row.words.includes(instance.targetWord));
    if (!sourceRow) return null;
    const wordIndex = sourceRow.words.indexOf(instance.targetWord);
    return sourceRow.displayedCodeTokens[wordIndex] ?? null;
  }

  const sourceRow = instance.rows.find((row) => row.displayedCodeTokens.includes(instance.targetDisplayToken));
  if (!sourceRow) return null;
  const tokenIndex = sourceRow.displayedCodeTokens.indexOf(instance.targetDisplayToken);
  return sourceRow.words[tokenIndex] ?? null;
}

export function buildExactAtomicOptions(
  prototypeId: ExactAtomicPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  seed: number,
): { options: readonly ExactAtomicOption[]; correctIndex: number } {
  const contract = getExactAtomicPrototypeContract(prototypeId);
  const correct = contract.queryDirection === "WORD_TO_TOKEN"
    ? instance.targetDisplayToken
    : instance.targetWord;
  const activeValues = contract.queryDirection === "WORD_TO_TOKEN"
    ? [...new Set(instance.rows.flatMap((row) => row.displayedCodeTokens))]
    : [...new Set(instance.rows.flatMap((row) => row.words))];
  const random = new SeededRandom(`${prototypeId}:${instance.topologyKind}:${seed}:options-v1`);
  const candidates: DistractorCandidate[] = [];

  const positional = positionalAssumption(instance, contract.queryDirection);
  if (positional && positional !== correct) {
    candidates.push({ value: positional, errorLabel: "STATEMENT_ORDER_ASSUMED" });
  }

  for (const value of random.shuffle(activeValues.filter((candidate) => candidate !== correct))) {
    if (candidates.some((candidate) => candidate.value === value)) continue;
    candidates.push({
      value,
      errorLabel: contract.queryDirection === "WORD_TO_TOKEN"
        ? "CODE_OF_RELATED_WORD"
        : "RELATED_STATEMENT_MEMBER",
    });
  }

  const selected = candidates.slice(0, 2);
  if (selected.length < 2) throw new Error(`${prototypeId}/${seed} does not have two active misconception distractors`);
  selected.push({ value: "Cannot be determined", errorLabel: "UNRESOLVED_ASSUMED" });

  const unshuffled: ExactAtomicOption[] = [
    { value: correct, isCorrect: true },
    ...selected.map((candidate) => ({ value: candidate.value, isCorrect: false, errorLabel: candidate.errorLabel })),
  ];
  const options = random.shuffle(unshuffled);
  if (new Set(options.map((option) => option.value)).size !== 4) throw new Error("Exact atomic options must be unique");
  if (options.filter((option) => option.isCorrect).length !== 1) throw new Error("Exact atomic options must contain one correct answer");
  return { options, correctIndex: options.findIndex((option) => option.isCorrect) };
}
