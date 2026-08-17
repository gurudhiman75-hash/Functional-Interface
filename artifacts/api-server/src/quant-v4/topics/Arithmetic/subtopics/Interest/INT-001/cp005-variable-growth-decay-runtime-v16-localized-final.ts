import {
  INT_CP005_V16_LOCALIZED_LOCALES,
  INT_CP005_V16_LOCALIZED_RUNTIME_VERSION,
  generateIntCp005QuestionV16Localized,
  type IntCp005LocalizedLocale,
  type IntCp005QuestionV16Localized,
} from "./cp005-variable-growth-decay-runtime-v16-localized";
import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";

export { INT_CP005_V16_LOCALIZED_LOCALES, INT_CP005_V16_LOCALIZED_RUNTIME_VERSION };
export type { IntCp005LocalizedLocale, IntCp005QuestionV16Localized };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateIntCp005QuestionV16LocalizedFinal(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005LocalizedLocale,
): IntCp005QuestionV16Localized {
  const source = generateIntCp005QuestionV16Localized(qlId, seed, locale);
  if (locale !== "pa-IN") return source;

  const explanation = deepFreeze({
    ...source.explanation,
    steps: Object.freeze(source.explanation.steps.map((step) =>
      step.replace("जहाँ कमी के लिए", "ਜਿੱਥੇ ਘਟਾਓ ਲਈ")
    )),
  });
  return deepFreeze({ ...source, explanation });
}
