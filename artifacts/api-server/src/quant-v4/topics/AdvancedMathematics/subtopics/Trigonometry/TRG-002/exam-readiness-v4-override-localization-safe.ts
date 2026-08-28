import { createHash } from "node:crypto";
import { exactToNumber, formatExactPlain } from "../foundation/exact";
import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";
import { generateTrg002V4CanonicalQuestion } from "./exam-readiness-v4-canonical";
import { generateLocalizedTrg002V4CanonicalOverride as generateLegacyV4Override } from "./exam-readiness-v4-override-localization";

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}
function sha256(value: unknown) {
  return createHash("sha256").update(stableJson(value), "utf8").digest("hex");
}

function generateQl028(seed: string, locale: Trg002ExamRealnessLocale) {
  const canonical: any = generateTrg002V4CanonicalQuestion("TRG-002-QL-028", seed);
  const exactDifference = canonical.canonicalSpatialState?.metadata?.measurements?.["shadow-minus-height"];
  if (!exactDifference) throw new Error("TRG-002-QL-028 V4: canonical shadow-height difference is missing.");
  const difference = formatExactPlain(exactDifference);
  const k = exactToNumber(exactDifference) / 2;
  if (!Number.isFinite(k) || !Number.isInteger(k)) {
    throw new Error("TRG-002-QL-028 V4: canonical shadow-height difference must resolve to an even integer.");
  }
  const answer = `${k}(√3+1)`;

  const localized = locale === "hi-IN"
    ? {
        stem: `जब सूर्य का उन्नयन कोण 30° है, तब एक ऊर्ध्वाधर खंभे की छाया उसकी ऊँचाई से ${difference} m अधिक लंबी है। खंभे की सटीक ऊँचाई ज्ञात कीजिए।`,
        explanation: {
          keyRule: "30° पर छाया की लंबाई h√3 होती है। प्रश्न में छाया और ऊँचाई का अंतर दिया गया है।",
          steps: [
            { title: "समीकरण", body: `h√3 − h = ${difference}, इसलिए h(√3−1) = ${difference}।` },
            { title: "उत्तर", body: `h = ${difference}/(√3−1) = ${answer} m।` },
          ],
          shortcut: "दिया गया मान छाया − ऊँचाई है; इसे अकेले छाया की लंबाई या खंभे की ऊँचाई न मानें।",
          traps: [`${difference} m केवल दोनों लंबाइयों का अंतर है, किसी एक लंबाई का मान नहीं।`],
        },
      }
    : {
        stem: `ਜਦੋਂ ਸੂਰਜ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ, ਤਦ ਇੱਕ ਖੜ੍ਹੇ ਖੰਭੇ ਦੀ ਛਾਂ ਉਸ ਦੀ ਉਚਾਈ ਨਾਲੋਂ ${difference} m ਵੱਧ ਲੰਬੀ ਹੈ। ਖੰਭੇ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`,
        explanation: {
          keyRule: "30° 'ਤੇ ਛਾਂ ਦੀ ਲੰਬਾਈ h√3 ਹੁੰਦੀ ਹੈ। ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਛਾਂ ਅਤੇ ਉਚਾਈ ਦਾ ਅੰਤਰ ਦਿੱਤਾ ਹੈ।",
          steps: [
            { title: "ਸਮੀਕਰਨ", body: `h√3 − h = ${difference}, ਇਸ ਲਈ h(√3−1) = ${difference}।` },
            { title: "ਉੱਤਰ", body: `h = ${difference}/(√3−1) = ${answer} m।` },
          ],
          shortcut: "ਦਿੱਤਾ ਮਾਪ ਛਾਂ − ਉਚਾਈ ਹੈ; ਇਸ ਨੂੰ ਸਿਰਫ਼ ਛਾਂ ਦੀ ਲੰਬਾਈ ਜਾਂ ਖੰਭੇ ਦੀ ਉਚਾਈ ਨਾ ਮੰਨੋ।",
          traps: [`${difference} m ਸਿਰਫ਼ ਦੋਵੇਂ ਲੰਬਾਈਆਂ ਦਾ ਅੰਤਰ ਹੈ, ਕਿਸੇ ਇੱਕ ਲੰਬਾਈ ਦਾ ਮਾਪ ਨਹੀਂ।`],
        },
      };

  const fingerprint = sha256({
    qlId: canonical.qlId,
    seed,
    locale,
    stem: localized.stem,
    explanation: localized.explanation,
    canonicalState: canonical.canonicalSpatialState,
  });

  return {
    ...canonical,
    stem: localized.stem,
    explanation: localized.explanation,
    localizationMetadata: {
      version: "TRG002_EXAM_READINESS_V4",
      authority: "V4_CANONICAL_OVERRIDE_SAFE",
      locale,
      humanLanguageReviewRequired: true,
    },
    localizationProof: {
      v4CanonicalOverride: true,
      canonicalSemanticsPreserved: true,
      localizationFingerprint: fingerprint,
      multilingualFreezeGranted: false,
    },
    humanReviewStatus: "PENDING" as const,
    frozen: false,
    freezeEligible: false,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false,
  };
}

export function generateLocalizedTrg002V4CanonicalOverrideSafe(
  qlId: string,
  seed: string,
  locale: Trg002ExamRealnessLocale,
) {
  if (qlId === "TRG-002-QL-028") return generateQl028(seed, locale);
  return generateLegacyV4Override(qlId, seed, locale);
}
