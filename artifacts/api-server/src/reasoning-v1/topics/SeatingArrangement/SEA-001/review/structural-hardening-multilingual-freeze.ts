import { canonicalDigest } from "../canonical.ts";
import { sea001LocalizedLearnerSurface } from "../localization/candidate-localizer.ts";
import { buildSea001ExplanationParityCandidate } from "../localization/explanation-parity-candidate.ts";
import type { Sea001TranslatedLocale } from "../localization/readiness.ts";
import { SEA001_MULTILINGUAL_FREEZE_AUTHORITY } from "../localization/multilingual-freeze.ts";
import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "../saturation/corpus.ts";
import { SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN } from "./structural-hardening-english-review-pins.ts";

export const SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE = Object.freeze({
  authority: "SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE_V1" as const,
  status: "APPROVED_FROZEN" as const,
  approvedAt: "2026-08-20" as const,
  approvedBy: "gurudhiman75-hash" as const,
  approvalEvidence: "PR#926_COMMENT_5353895993" as const,
  sourceWorkflowRun: 32347854851 as const,
  sourceArtifactId: 9398731705 as const,
  sourceArtifactZipSha256: "93b3ba757e4557ed1245bbfec2a8d706de1ef52c89a0854d698cbb4b87841991" as const,
  sourceBranchHead: "ff3daae753d31db93c4ea7b868d2d6e8847caaa7" as const,
  canonicalReviewCaselets: 100 as const,
  localizedReviewCaselets: 200 as const,
  localizedChildQuestions: 800 as const,
  queryContractCount: 16 as const,
  sourceEnglishAuthority: SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN.candidateFingerprint,
  previousMultilingualAuthority: SEA001_MULTILINGUAL_FREEZE_AUTHORITY,
  learnerFingerprints: Object.freeze({
    "hi-IN": "8385bbdb98962ace330b0ba26db5c7b82554e100979086930c9ca55db8371a7d",
    "pa-IN": "ac72e31667b532510db65a10433efeca39dbe1f0c97c58015017611f9e19444f",
  }),
  reviewFileSha256: Object.freeze({
    hindiHtml: "07d6bae301f3b12fe41c382f7ea1a3dbb8f7feb4217754b8563c16a7cbcf051e",
    hindiJson: "7903478fd1cff86ca1f95798e99d4eed331708bcb5ac08474f4127df0640d3d7",
    punjabiHtml: "f58a10b3f7028024628df6b4ac634705e04c6a5b5942fe0fca9131971fdeedfd",
    punjabiJson: "f660636cb4320b5a0d22536398fd51fcd968f195addeb2b1d02d60946a1c99cf",
    ledger: "238f0c6f72fe84b1990f24265babb933d87dba6d4651967c63e65f3fb6fd3a16",
    summary: "8075e973a97efc0042180341dc51943f1d90f9706322d8ada2e8a35753a1e4c6",
  }),
  parity: Object.freeze({
    semantic: "200/200" as const,
    approvedEnglishExplanation: "200/200" as const,
    sharedBlock: "200/200" as const,
    caseDecision: "200/200" as const,
    optionRationale: "200/200" as const,
    latinLearnerResidue: 0 as const,
    mechanicalTranslationese: 0 as const,
    ordinalGrammarViolations: 0 as const,
    genderedSingularSeatingMarkers: 0 as const,
    genericWrongOptionFallbacks: 0 as const,
  }),
  machineRealness: Object.freeze({
    status: "GREEN" as const,
    blockers: Object.freeze([] as const),
    hindiLargestQuestionTemplateShare: 0.1375 as const,
    punjabiLargestQuestionTemplateShare: 0.20 as const,
    pinnedLimit: 0.20 as const,
  }),
  questionStudioReviewOnlyAuthorized: true as const,
  questionBankWritable: false as const,
  mockTestEligible: false as const,
  productionStagingApproved: false as const,
  publiclyPublishable: false as const,
});

export function sea001StructuralHardeningLocalizedFingerprint(locale: Sea001TranslatedLocale): string {
  const canonicalReview = selectManualReviewCorpus(buildSea001SaturationCorpus(40).caselets, 5);
  if (canonicalReview.length !== SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE.canonicalReviewCaselets) {
    throw new Error(`SEA-001 replacement freeze expected 100 canonical review caselets, observed ${canonicalReview.length}.`);
  }
  const localized = canonicalReview.map((caselet) => buildSea001ExplanationParityCandidate(caselet, locale));
  return canonicalDigest(localized.map((caselet) => ({
    caseletId: caselet.caseletId,
    learnerSurface: sea001LocalizedLearnerSurface(caselet),
  })));
}
