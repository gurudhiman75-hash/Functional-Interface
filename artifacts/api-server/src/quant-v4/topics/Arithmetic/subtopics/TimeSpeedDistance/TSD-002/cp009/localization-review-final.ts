import { TSD_CP009_HINDI_LOCALIZATION } from "./hindi-localization";
import { TSD_CP009_PUNJABI_LOCALIZATION } from "./punjabi-localization";
import type { TsdCp009LocalizationRegistry } from "./localization-types";

/**
 * Final editorial overlay for the CP009 localization review candidate.
 *
 * This does not change QL ownership, family IDs, difficulty, placeholders,
 * numeric cases or solve semantics. It only removes one awkward phrase in
 * QL111-F before product-owner review.
 */
const HINDI_STEM_POLISH: Readonly<Record<string, string>> = Object.freeze({
  "111-F": "दो नावें {routeDistance} लंबी नहर के विपरीत सिरों से एक साथ चलती हैं। उनकी स्थिर जल में गतियाँ {upstreamBodySpeed} और {downstreamBodySpeed} हैं तथा प्रवाह {mediumSpeed} की गति से दूसरे सिरे की ओर है। वे ऊपरी सिरे से कितनी दूरी पर मिलेंगी?",
});

const PUNJABI_STEM_POLISH: Readonly<Record<string, string>> = Object.freeze({
  "111-F": "ਦੋ ਕਿਸ਼ਤੀਆਂ {routeDistance} ਲੰਬੀ ਨਹਿਰ ਦੇ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਇੱਕੋ ਸਮੇਂ ਚੱਲਦੀਆਂ ਹਨ। ਠਹਿਰੇ ਪਾਣੀ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦੀਆਂ ਗਤੀਆਂ {upstreamBodySpeed} ਅਤੇ {downstreamBodySpeed} ਹਨ ਅਤੇ ਵਹਾਅ {mediumSpeed} ਦੀ ਗਤੀ ਨਾਲ ਦੂਜੇ ਸਿਰੇ ਵੱਲ ਹੈ। ਉਹ ਉਪਰਲੇ ਸਿਰੇ ਤੋਂ ਕਿੰਨੀ ਦੂਰੀ 'ਤੇ ਮਿਲਣਗੀਆਂ?",
});

function applyStemPolish(registry: TsdCp009LocalizationRegistry, polish: Readonly<Record<string, string>>): TsdCp009LocalizationRegistry {
  return Object.freeze({
    ...registry,
    qls: Object.freeze(registry.qls.map((ql) => Object.freeze({
      ...ql,
      families: Object.freeze(ql.families.map((family) => {
        const stem = polish[family.familyId];
        return stem === undefined ? family : Object.freeze({ ...family, stem });
      })),
    }))),
  });
}

export const TSD_CP009_FINAL_HINDI_LOCALIZATION = applyStemPolish(TSD_CP009_HINDI_LOCALIZATION, HINDI_STEM_POLISH);
export const TSD_CP009_FINAL_PUNJABI_LOCALIZATION = applyStemPolish(TSD_CP009_PUNJABI_LOCALIZATION, PUNJABI_STEM_POLISH);
export const TSD_CP009_LOCALIZED_EDITORIAL_POLISH_COUNT = 1 as const;
