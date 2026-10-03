import { createHash } from "node:crypto";

import { SEA002_CP008_ENGLISH_REVIEW_SET_V2 } from "./production-review-v2.ts";
import {
  localizeSea002Cp008ReviewCandidate,
  type Sea002Cp008Locale,
  type Sea002Cp008LocalizedReviewCandidate,
} from "./localization-v1.ts";

const LOCALIZED_LEADS = Object.freeze({
  hi: Object.freeze([
    "निम्न वर्गाकार बैठक व्यवस्था का ध्यानपूर्वक अध्ययन करें।",
    "नीचे दी गई बैठक संबंधी जानकारी पढ़ें और प्रश्न का उत्तर दें।",
    "वर्गाकार मेज के चारों ओर दी गई व्यवस्था पर विचार करें।",
    "नीचे दिए गए संकेतों से वर्गाकार बैठक व्यवस्था निर्धारित करें।",
    "वर्गाकार मेज की दी गई बैठक जानकारी का विश्लेषण करें।",
    "नीचे दी गई जानकारी के आधार पर आवश्यक स्थान निर्धारित करें।",
  ] as const),
  pa: Object.freeze([
    "ਹੇਠਾਂ ਦਿੱਤੀ ਵਰਗਾਕਾਰ ਬੈਠਕ ਵਿਵਸਥਾ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।",
    "ਹੇਠਾਂ ਦਿੱਤੀ ਬੈਠਕ ਜਾਣਕਾਰੀ ਪੜ੍ਹ ਕੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ।",
    "ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਦਿੱਤੀ ਵਿਵਸਥਾ 'ਤੇ ਵਿਚਾਰ ਕਰੋ।",
    "ਹੇਠਾਂ ਦਿੱਤੇ ਸੰਕੇਤਾਂ ਨਾਲ ਵਰਗਾਕਾਰ ਬੈਠਕ ਵਿਵਸਥਾ ਨਿਰਧਾਰਤ ਕਰੋ।",
    "ਵਰਗਾਕਾਰ ਮੇਜ਼ ਲਈ ਦਿੱਤੀ ਬੈਠਕ ਜਾਣਕਾਰੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ।",
    "ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਲੋੜੀਂਦਾ ਸਥਾਨ ਨਿਰਧਾਰਤ ਕਰੋ।",
  ] as const),
} as const);

function polishLocalizedCandidate(
  candidate: Sea002Cp008LocalizedReviewCandidate,
): Sea002Cp008LocalizedReviewCandidate {
  const lead = LOCALIZED_LEADS[candidate.locale][candidate.variantIndex % 6]!;
  const stem = `${lead} ${candidate.stem}`;
  const localizedFingerprint = createHash("sha256")
    .update(JSON.stringify({
      version: "CP008_LOCALIZATION_EDITORIAL_V2",
      locale: candidate.locale,
      sourceEnglishFingerprint: candidate.sourceEnglishFingerprint,
      stem,
      question: candidate.question,
      options: candidate.options,
      explanation: candidate.explanation,
    }))
    .digest("hex");
  return Object.freeze({
    ...candidate,
    stem,
    localizedFingerprint,
  });
}

export function localizeSea002Cp008ReviewCandidateV2(
  candidate: (typeof SEA002_CP008_ENGLISH_REVIEW_SET_V2)[number],
  locale: Sea002Cp008Locale,
): Sea002Cp008LocalizedReviewCandidate {
  return polishLocalizedCandidate(localizeSea002Cp008ReviewCandidate(candidate, locale));
}

export const SEA002_CP008_LOCALIZED_REVIEW_SET_V2: readonly Sea002Cp008LocalizedReviewCandidate[] = Object.freeze(
  SEA002_CP008_ENGLISH_REVIEW_SET_V2.flatMap((candidate) => [
    localizeSea002Cp008ReviewCandidateV2(candidate, "hi"),
    localizeSea002Cp008ReviewCandidateV2(candidate, "pa"),
  ]),
);

export const SEA002_CP008_LOCALIZATION_EDITORIAL_V2 = Object.freeze({
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  localizedSurfaceCount: SEA002_CP008_LOCALIZED_REVIEW_SET_V2.length,
  leadVariantsPerLocale: 6,
  languageFidelityPolicy: "GENDER_NEUTRAL_STRUCTURED_RENDERING_EDITORIAL_VARIETY_V2" as const,
  humanApprovalStatus: "PENDING" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  publiclyPublishable: false as const,
});
