import { TSD_CP008_HINDI_LOCALIZATION } from "./hindi-localization";
import { TSD_CP008_PUNJABI_LOCALIZATION } from "./punjabi-localization";
import type { TsdCp008LocalizationRegistry } from "./localization-types";

function finalizeLocalization(
  registry: TsdCp008LocalizationRegistry,
  sameDirectionUniquenessGuard: string,
): TsdCp008LocalizationRegistry {
  return Object.freeze({
    locale: registry.locale,
    qls: Object.freeze(registry.qls.map((ql) => Object.freeze({
      ...ql,
      families: Object.freeze(ql.families.map((family) => Object.freeze({
        ...family,
        stem: ql.qlId === "TSD-QL-099"
          ? `${sameDirectionUniquenessGuard} ${family.stem}`
          : family.stem,
      }))),
    }))),
  });
}

// QL099 solves an individual train speed from a relative-speed magnitude.
// In a same-direction state the target train must be identified as the faster
// train; otherwise the inverse can admit two speed interpretations. English
// already states this dynamically. These native-language guards preserve that
// exact learner invariant without changing any numeric evidence or placeholder.
export const TSD_CP008_FINAL_HINDI_LOCALIZATION = finalizeLocalization(
  TSD_CP008_HINDI_LOCALIZATION,
  "समान दिशा वाली स्थिति में पहली ट्रेन को तेज माना जाए।",
);

export const TSD_CP008_FINAL_PUNJABI_LOCALIZATION = finalizeLocalization(
  TSD_CP008_PUNJABI_LOCALIZATION,
  "ਇੱਕੋ ਦਿਸ਼ਾ ਵਾਲੀ ਸਥਿਤੀ ਵਿੱਚ ਪਹਿਲੀ ਰੇਲਗੱਡੀ ਨੂੰ ਤੇਜ਼ ਮੰਨਿਆ ਜਾਵੇ।",
);
