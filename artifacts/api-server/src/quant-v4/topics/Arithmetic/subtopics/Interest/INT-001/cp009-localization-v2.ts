import { generateIntCp009Localized as generateV1, type IntCp009Language } from "./cp009-localization-v1";
import type { IntCp009PermanentQlId } from "./cp009-production-runtime-v1";

export const INT_CP009_LOCALIZATION_V2_VERSION = "INT-CP-009-HI-PA-v2-terminology-clean" as const;
export { INT_CP009_LANGUAGES, type IntCp009Language } from "./cp009-localization-v1";

const DEPRECATED_PUNJABI_COMPOUND_TERM = "ਚੱਕਰਵੱਧੀ";
const DEPRECATED_PUNJABI_COMPOUND_PHRASE = "ਚੱਕਰਵੱਧੀ ਵਿਆਜ";
const APPROVED_PUNJABI_COMPOUND_TERM = "ਮਿਸ਼ਰਤ ਵਿਆਜ";

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function cleanPunjabi(text: string) {
  return text
    .replaceAll(DEPRECATED_PUNJABI_COMPOUND_PHRASE, APPROVED_PUNJABI_COMPOUND_TERM)
    .replaceAll(DEPRECATED_PUNJABI_COMPOUND_TERM, APPROVED_PUNJABI_COMPOUND_TERM);
}

export function generateIntCp009Localized(
  qlId: IntCp009PermanentQlId,
  seed: string | number,
  language: IntCp009Language,
) {
  const source = generateV1(qlId, seed, language) as any;
  if (language !== "pa") return source;

  const cleaned = deepFreeze({
    ...source,
    localizationVersion: INT_CP009_LOCALIZATION_V2_VERSION,
    stem: cleanPunjabi(String(source.stem)),
    explanation: deepFreeze({
      ...source.explanation,
      keyIdea: cleanPunjabi(String(source.explanation.keyIdea)),
      steps: Object.freeze(source.explanation.steps.map((step: string) => cleanPunjabi(step))),
      finalAnswer: cleanPunjabi(String(source.explanation.finalAnswer)),
    }),
  });

  const learnerText = `${cleaned.stem}\n${cleaned.explanation.keyIdea}\n${cleaned.explanation.steps.join("\n")}\n${cleaned.explanation.finalAnswer}`;
  if (learnerText.includes(DEPRECATED_PUNJABI_COMPOUND_TERM)) {
    throw new Error(`${qlId}/${seed}: deprecated Punjabi compound-interest term survived localization V2.`);
  }
  if (!learnerText.includes(APPROVED_PUNJABI_COMPOUND_TERM)) {
    throw new Error(`${qlId}/${seed}: approved Punjabi compound-interest terminology missing from localized learner surface.`);
  }
  return cleaned;
}
