import type { Sea001TranslatedLocale } from "./readiness.ts";

export const SEA001_MULTILINGUAL_FREEZE_LEARNER_FINGERPRINTS = Object.freeze({
  "hi-IN": "78ce46895d77871330681d36b5c7929c52dfc9247285abd16fa5c8754de19a28",
  "pa-IN": "b8634795ec0e19981aaacc8c9f2a356cfc0a67347c6685fe22c511c85294d81e",
} as const satisfies Readonly<Record<Sea001TranslatedLocale, string>>);

export const SEA001_MULTILINGUAL_FREEZE_SEMANTIC_FINGERPRINT =
  "d8b60a8d1c61128a71d7abbf7b902f0a7a8fae38473312fa83843c8d29591fe4" as const;
