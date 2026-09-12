import { generateSerCp008 as generateCandidate, type GeneratedSerCp008Question, type SerCp008Locale } from "./runtime";
import type { SerCp008ProvisionalQlId } from "./question-language";

const MAX_ATTEMPTS = 64;

function numericPartsArePositive(question: GeneratedSerCp008Question): boolean {
  if (question.qlId === "SER-QL-014" || question.qlId === "SER-QL-015") return true;
  return question.options.every((option) => {
    const matches = option.value.match(/-?\d+/g) ?? [];
    return matches.length > 0 && matches.every((value) => Number(value) > 0);
  });
}

function normalizePunjabi(question: GeneratedSerCp008Question): GeneratedSerCp008Question {
  if (question.locale !== "pa-IN" || question.qlId !== "SER-QL-017") return question;
  return {
    ...question,
    explanation: question.explanation.map((line) =>
      line
        .replace("ਟਾਂਕ ਅਤੇ ਜੁੜੇ ਸਥਾਨਾਂ ਵਾਲੇ", "ਵਿਸ਼ਮ ਅਤੇ ਸਮ ਸਥਾਨਾਂ ਵਾਲੇ")
        .replace("ਟਾਂਕ-ਸਥਾਨ ਕਤਾਰ", "ਵਿਸ਼ਮ-ਸਥਾਨ ਕਤਾਰ"),
    ),
  };
}

function placeCorrectAtRequestedIndex(
  question: GeneratedSerCp008Question,
  requestedSeed: number,
): GeneratedSerCp008Question {
  const requestedIndex = ((requestedSeed + Number(question.qlId.slice(-3))) % 4 + 4) % 4;
  if (question.correctIndex === requestedIndex && question.seed === requestedSeed) return question;
  const options = [...question.options];
  const current = options.findIndex((option) => option.errorLabel === null);
  if (current < 0) throw new Error(`${question.qlId} has no canonical correct option.`);
  const [answer] = options.splice(current, 1);
  options.splice(requestedIndex, 0, answer!);
  return {
    ...question,
    seed: requestedSeed,
    options,
    correctIndex: requestedIndex,
  };
}

export function generateSerCp008Final(
  qlId: SerCp008ProvisionalQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008Question {
  if (!Number.isInteger(seed) || seed < 0) {
    throw new Error("SER-CP-008 seed must be a non-negative integer.");
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const candidateSeed = seed + attempt * 1009;
    const generated = normalizePunjabi(generateCandidate(qlId, candidateSeed, locale));
    if (!numericPartsArePositive(generated)) continue;
    if (new Set(generated.options.map((option) => option.value)).size !== 4) continue;
    if (generated.options.filter((option) => option.errorLabel === null).length !== 1) continue;
    return placeCorrectAtRequestedIndex(generated, seed);
  }

  throw new Error(`${qlId} could not produce a valid bounded-domain question for requested seed ${seed}.`);
}
