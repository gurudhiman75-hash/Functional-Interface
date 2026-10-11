import { TSD_CP008_HINDI_LOCALIZATION } from "./hindi-localization";
import { TSD_CP008_PUNJABI_LOCALIZATION } from "./punjabi-localization";

// The approved localized templates stay byte-for-byte semantically intact.
// QL099 needs one runtime-only clarification when the generated numeric case
// is SAME direction: the first/target train is the faster train. Applying that
// sentence to opposite-direction cases would add irrelevant learner text, so
// the policy is exported here and applied only after a SAME case is selected.
export const TSD_CP008_QL099_SAME_DIRECTION_GUARDS = Object.freeze({
  hi: "समान दिशा वाली स्थिति में पहली ट्रेन तेज है।" as const,
  pa: "ਇੱਕੋ ਦਿਸ਼ਾ ਵਾਲੀ ਸਥਿਤੀ ਵਿੱਚ ਪਹਿਲੀ ਰੇਲਗੱਡੀ ਤੇਜ਼ ਹੈ।" as const,
});

export const TSD_CP008_FINAL_HINDI_LOCALIZATION = TSD_CP008_HINDI_LOCALIZATION;
export const TSD_CP008_FINAL_PUNJABI_LOCALIZATION = TSD_CP008_PUNJABI_LOCALIZATION;
