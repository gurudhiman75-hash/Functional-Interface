import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { computeCom002EnglishV6ReviewFingerprints } from "./com002-english-v6-review-fingerprint-candidate";
import {
  COM002_LOCALIZATION_VERSION_V5,
  localizeCom002QuestionV5,
  type Com002LocalizedQuestionV5,
} from "./com002-localization-v5";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V6,
} from "./com002-review-synthesis-v6";

const QL_IDS = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const LANGUAGES = ["hi", "pa"] as const;

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, stableValue(entry)]),
    );
  }
  return value;
}

function fingerprint(value: unknown) {
  return createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
}

function localizedProjection(question: Com002LocalizedQuestionV5, seed: string, language: "hi" | "pa") {
  return {
    language,
    qlId: question.qlId,
    cpId: question.cpId,
    seed,
    questionId: question.questionId,
    surfaceMode: question.surfaceMode,
    targetFactId: question.targetFactId,
    stem: question.stem,
    options: [...question.options],
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
    sourceIds: [...question.sourceIds].sort(),
    sourceFactIds: [...question.sourceFactIds].sort(),
    solverAuthority: question.solverAuthority,
    reviewOnly: question.reviewOnly,
    runtimeRegistered: question.runtimeRegistered,
    englishQuestionId: question.localizationV5.englishQuestionId,
    localizationVersion: question.localizationV5.version,
    localizationAuthority: question.localizationV5.authority,
  };
}

function localizedCorpus(language: "hi" | "pa") {
  return QL_IDS.flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `localization-v5-approved-fingerprint:${qlId}:${index}`;
      return localizedProjection(
        localizeCom002QuestionV5({ qlId, seed, language }),
        seed,
        language,
      );
    }),
  );
}

function exactApprovedBilingualReviewProjection() {
  return QL_IDS.map((qlId) => {
    const seed = `localization-human-review-v4:${qlId}`;
    return {
      qlId,
      seed,
      hindi: localizedProjection(
        localizeCom002QuestionV5({ qlId, seed, language: "hi" }),
        seed,
        "hi",
      ),
      punjabi: localizedProjection(
        localizeCom002QuestionV5({ qlId, seed, language: "pa" }),
        seed,
        "pa",
      ),
    };
  });
}

const englishV6 = computeCom002EnglishV6ReviewFingerprints();
const hindiCorpus = localizedCorpus("hi");
const punjabiCorpus = localizedCorpus("pa");
const bilingualReview = exactApprovedBilingualReviewProjection();
const hindiCorpusFingerprint = fingerprint(hindiCorpus);
const punjabiCorpusFingerprint = fingerprint(punjabiCorpus);
const bilingualReviewFingerprint = fingerprint(bilingualReview);
const localizationCombinedFingerprint = fingerprint({
  chapterId: "COM-002",
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
  englishV6CombinedFingerprint: englishV6.combinedFingerprint,
  localizationVersion: COM002_LOCALIZATION_VERSION_V5,
  humanReviewAccepted: true,
  approvalSource: "PRODUCT_OWNER_CHAT_EXPLICIT_APPROVAL",
  approvedOn: "2026-08-30",
  hindiCorpusFingerprint,
  punjabiCorpusFingerprint,
  bilingualReviewFingerprint,
  qlRange: "COM-002-QL-001..COM-002-QL-013",
  questionsPerQlPerLanguage: 40,
  approvedBilingualReviewItemsPerQl: 1,
});

const manifest = {
  authorityCandidateId: "COM-002-V6-V5-APPROVED-FINGERPRINT-MANIFEST",
  chapterId: "COM-002",
  approvedSurface: "ENGLISH_V6_HI_PA_LOCALIZATION_V5",
  approval: {
    accepted: true,
    source: "PRODUCT_OWNER_CHAT_EXPLICIT_APPROVAL",
    approvedOn: "2026-08-30",
  },
  english: {
    generatorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
    fingerprints: englishV6,
  },
  localization: {
    version: COM002_LOCALIZATION_VERSION_V5,
    hindiCorpusFingerprint,
    punjabiCorpusFingerprint,
    bilingualReviewFingerprint,
    combinedFingerprint: localizationCombinedFingerprint,
    hindiCorpusQuestions: hindiCorpus.length,
    punjabiCorpusQuestions: punjabiCorpus.length,
    approvedBilingualReviewItems: bilingualReview.length,
    approvedLocalizedReviewSurfaces: bilingualReview.length * LANGUAGES.length,
  },
  lifecycle: {
    contentApproved: true,
    fingerprintManifestGenerated: true,
    operationalFreezeCreated: false,
    questionStudioActivated: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    publicDeliveryAllowed: false,
  },
} as const;

const outputDir = join(process.cwd(), "dist", "review-artifacts");
await mkdir(outputDir, { recursive: true });
const outputPath = join(outputDir, "COM002-V6-V5-Approved-Fingerprint-Manifest.json");
await writeFile(outputPath, JSON.stringify(manifest, null, 2), "utf8");
console.log(
  `[COM002-V6-V5-FINGERPRINT-EXPORT] wrote ${outputPath} ` +
  `en=${englishV6.combinedFingerprint} hi=${hindiCorpusFingerprint} ` +
  `pa=${punjabiCorpusFingerprint} review=${bilingualReviewFingerprint} ` +
  `loc=${localizationCombinedFingerprint}`,
);
