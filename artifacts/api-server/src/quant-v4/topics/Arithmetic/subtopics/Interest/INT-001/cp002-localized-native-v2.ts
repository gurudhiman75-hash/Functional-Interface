import { generateIntCp002LocalizedNativeV1, type IntCp002NativeLocale } from "./cp002-localized-native-v1";
import type { IntCp002FinalQlId } from "./cp002-final-registry";

export const INT_CP002_LOCALIZED_NATIVE_V2 = Object.freeze({
  version: "INT-CP-002-HI-PA-NATIVE-CANDIDATE-v2" as const,
  baseVersion: "INT-CP-002-HI-PA-NATIVE-CANDIDATE-v1" as const,
  status: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
  formulaFirst: true as const,
  dayCountNativeSymbols: true as const,
  approved: false as const,
  frozen: false as const,
  permanentIdentityChanges: false as const,
  questionStudioActivationAuthorized: false as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function nativeDayCountRule(locale: IntCp002NativeLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: I = P × R × d / (100 × D), जहाँ d = दिनों की संख्या और D = प्रश्न में दिया वर्ष-आधार है।"
    : "ਸੂਤਰ: I = P × R × d / (100 × D), ਜਿੱਥੇ d = ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ D = ਸਵਾਲ ਵਿੱਚ ਦਿੱਤਾ ਸਾਲ-ਆਧਾਰ ਹੈ।";
}

function formulaFirst(rule: string, locale: IntCp002NativeLocale): string {
  const prefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  return rule.startsWith(prefix) ? rule : `${prefix} ${rule}`;
}

function nativeDayCountStep(step: string): string {
  return step
    .replace(/\bdays\b/gu, "d")
    .replace(/\byear-basis\b/gu, "D");
}

export function generateIntCp002LocalizedNativeV2(
  qlId: IntCp002FinalQlId,
  seed: string,
  locale: IntCp002NativeLocale,
) {
  const source = generateIntCp002LocalizedNativeV1(qlId, seed, locale);
  const isDayCount = qlId === "INT-QL-050" || qlId === "INT-QL-051" || qlId === "INT-QL-052";
  return deepFreeze({
    ...source,
    localizationVersion: INT_CP002_LOCALIZED_NATIVE_V2.version,
    explanation: {
      ...source.explanation,
      mainRule: isDayCount ? nativeDayCountRule(locale) : formulaFirst(source.explanation.mainRule, locale),
      workedSteps: Object.freeze(source.explanation.workedSteps.map((step) => isDayCount ? nativeDayCountStep(step) : step)),
    },
    v2Remediation: {
      formulaFirst: true as const,
      dayCountNativeSymbols: isDayCount,
      mathematicalStateChanged: false as const,
      optionValuesChanged: false as const,
      permanentIdentityChanged: false as const,
      approvalGranted: false as const,
    },
  });
}
