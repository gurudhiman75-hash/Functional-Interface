import { selectIntCp004ExamFriendlyFrozenSourceV9 } from "./cp004-exam-friendly-source-v9";
import { buildCp004LocalizedFormulaExplanationV9Safe } from "./cp004-localized-formula-explanations-v9-safe";
import { adaptIntCp004ExamFriendlyOptionsV9 } from "./cp004-localized-exam-friendly-options-v9";
import { localizeIntCp004EnglishFrozenQuestion } from "./cp004-localized-runtime";
import type {
  IntCp004LocalizedQuestion,
  IntCp004LocalizedRuntimeInput,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_EXAM_FRIENDLY_RUNTIME_V9_VERSION =
  "INT-CP-004-HI-PA-EXAM-FRIENDLY-RUNTIME-v9" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

export function generateIntCp004ExamFriendlyLocalizedQuestionV9(
  input: IntCp004LocalizedRuntimeInput,
): IntCp004LocalizedQuestion {
  const source = selectIntCp004ExamFriendlyFrozenSourceV9(input.qlId, input.seed);
  const localized = localizeIntCp004EnglishFrozenQuestion(source, input.locale);
  const options = adaptIntCp004ExamFriendlyOptionsV9(localized, input.locale);
  const correctAnswer = options[localized.correctIndex]?.text;
  if (!correctAnswer) {
    throw new Error(`${input.qlId}/${input.seed}/${input.locale}: v9 correct option is missing.`);
  }
  const explanation = buildCp004LocalizedFormulaExplanationV9Safe(
    source,
    input.locale,
    correctAnswer,
  );

  return deepFreeze({
    ...localized,
    options,
    correctAnswer,
    explanation,
  });
}
