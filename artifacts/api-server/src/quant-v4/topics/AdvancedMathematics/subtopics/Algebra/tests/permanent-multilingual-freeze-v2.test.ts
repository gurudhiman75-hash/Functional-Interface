import {
  ALG_MULTILINGUAL_V2_FREEZE_APPROVAL,
  ALG_MULTILINGUAL_V2_FREEZE_ID,
  ALG_PERMANENT_ALLOCATION,
  auditAlgMultilingualV2Freeze,
  generateAlgPermanentMultilingualReviewV2,
  generateAlgPermanentMultilingualV2Frozen,
  getAlgPermanentPrototypeIds,
  type AlgReviewLocale,
} from "../permanent";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function comparableSource(item: ReturnType<typeof generateAlgPermanentMultilingualReviewV2>) {
  const {
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    multilingualImplementationFrozen: _multilingualImplementationFrozen,
    ...rest
  } = item;
  return rest;
}

function comparableFrozen(item: ReturnType<typeof generateAlgPermanentMultilingualV2Frozen>) {
  const {
    localizationFreezeId: _localizationFreezeId,
    approvedLocalizationSourceHead: _approvedLocalizationSourceHead,
    localizedLearnerContentFrozen: _localizedLearnerContentFrozen,
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    multilingualImplementationFrozen: _multilingualImplementationFrozen,
    ...rest
  } = item;
  return rest;
}

function canonicalSerialize(value: unknown): string {
  return JSON.stringify(value, (_key, current) =>
    typeof current === "bigint" ? { __bigint__: current.toString() } : current,
  );
}

assert(ALG_MULTILINGUAL_V2_FREEZE_ID === "ALG-ML-v2-frozen", "Unexpected multilingual V2 freeze ID");
assert(
  ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvalAuthority === "EXPLICIT_PRODUCT_OWNER_ARTIFACT_APPROVAL",
  "Multilingual V2 freeze approval authority drifted",
);
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvalDate === "2026-08-21", "Approval date drifted");
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvalAuditCommentId === 5365961584, "Approval audit comment drifted");
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvedReviewAuthority === "ALG-ML-review-v2", "Review authority drifted");
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.sourceEnglishFreeze === "ALG-EN-v3-frozen", "English source freeze drifted");
assert(
  ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvedSourceHead === "255c3dc156e0cbc9d8fc9b909552f7ef903db019",
  "Approved multilingual source head drifted",
);
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.multilingualReviewWorkflowRunId === 32444334325, "Review workflow drifted");
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.reviewedArtifactId === 9433549545, "Reviewed artifact ID drifted");
assert(
  ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.reviewedArtifactDigest
    === "sha256:e1043d03d6bb674a84c88d9a66033df0307eff9bd4a18b93d90819e3f5fb0fcb",
  "Reviewed artifact digest drifted",
);
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.qlCount === 43, "Approved QL count drifted");
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.mappedVariantCount === 109, "Approved variant count drifted");
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.exhaustiveReviewSampleCount === 2616, "Approved sample count drifted");
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.multilingualImplementationFrozen, "Multilingual freeze flag must be true");
assert(!ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.active, "Freeze must not activate Algebra");
assert(!ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.questionStudioDiscoverable, "Freeze must not expose Algebra in Question Studio");
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.questionBankStatus === "NOT_STORED", "Freeze must not store Question Bank content");
assert(!ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.questionBankWritable, "Freeze must not enable Question Bank writes");
assert(ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.testEligibility === "INELIGIBLE", "Freeze must not enable tests/mocks");
assert(!ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.publiclyPublishable, "Freeze must not publish Algebra");

const audit = auditAlgMultilingualV2Freeze();
assert(audit.qlCount === 43, "Freeze audit QL count drifted");
assert(audit.firstQlId === "ALG-QL-001", "Freeze audit first QL drifted");
assert(audit.lastQlId === "ALG-QL-043", "Freeze audit last QL drifted");
assert(audit.englishFrozen, "English V3 must remain frozen");
assert(audit.multilingualFrozen, "Hindi/Punjabi V2 must be frozen");
assert(audit.downstreamLocked, "Downstream product lifecycle must remain locked");

const locales: readonly AlgReviewLocale[] = ["hi-IN", "pa-IN"];
let samples = 0;
let variants = 0;

for (const allocation of ALG_PERMANENT_ALLOCATION) {
  const prototypeIds = getAlgPermanentPrototypeIds(allocation.qlId);
  variants += prototypeIds.length;

  for (let variantIndex = 0; variantIndex < prototypeIds.length; variantIndex += 1) {
    for (let seed = 1; seed <= 12; seed += 1) {
      for (const locale of locales) {
        const source = generateAlgPermanentMultilingualReviewV2(
          allocation.qlId,
          seed,
          locale,
          variantIndex,
        );
        const frozen = generateAlgPermanentMultilingualV2Frozen(
          allocation.qlId,
          seed,
          locale,
          variantIndex,
        );
        const prefix = `${allocation.qlId}/${prototypeIds[variantIndex]}/${locale}/seed-${seed}`;

        assert(source.localizationReviewId === "ALG-ML-review-v2", `${prefix}: source review authority drifted`);
        assert(!source.multilingualImplementationFrozen, `${prefix}: source V2 must remain a review candidate`);
        assert(frozen.localizationFreezeId === ALG_MULTILINGUAL_V2_FREEZE_ID, `${prefix}: freeze ID mismatch`);
        assert(
          frozen.approvedLocalizationSourceHead === ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvedSourceHead,
          `${prefix}: approved source head mismatch`,
        );
        assert(frozen.localizedLearnerContentFrozen, `${prefix}: localized learner content not frozen`);
        assert(frozen.multilingualImplementationFrozen, `${prefix}: multilingual implementation not frozen`);
        assert(frozen.maturity === "MULTILINGUAL_IMPLEMENTATION_FROZEN", `${prefix}: maturity mismatch`);
        assert(frozen.reviewStatus === "APPROVED_HI_PA_V2_FROZEN", `${prefix}: review status mismatch`);

        assert(frozen.question === source.question, `${prefix}: localized question changed under freeze`);
        assert(frozen.explanation === source.explanation, `${prefix}: localized explanation changed under freeze`);
        assert(frozen.englishQuestion === source.englishQuestion, `${prefix}: frozen English question changed`);
        assert(frozen.englishExplanation === source.englishExplanation, `${prefix}: frozen English explanation changed`);
        assert(frozen.locale === source.locale, `${prefix}: locale changed under freeze`);
        assert(frozen.language === source.language, `${prefix}: language changed under freeze`);

        assert(!frozen.active, `${prefix}: freeze activated item`);
        assert(!frozen.questionStudioDiscoverable, `${prefix}: freeze exposed Question Studio item`);
        assert(frozen.questionBankStatus === "NOT_STORED", `${prefix}: freeze stored Question Bank item`);
        assert(!frozen.questionBankWritable, `${prefix}: freeze enabled Question Bank write`);
        assert(frozen.testEligibility === "INELIGIBLE", `${prefix}: freeze enabled test eligibility`);
        assert(!frozen.testEligible, `${prefix}: freeze made item test eligible`);
        assert(!frozen.publiclyPublishable, `${prefix}: freeze made item publicly publishable`);

        assert(
          canonicalSerialize(comparableFrozen(frozen)) === canonicalSerialize(comparableSource(source)),
          `${prefix}: non-lifecycle source payload changed under multilingual freeze`,
        );

        samples += 1;
      }
    }
  }
}

assert(variants === 109, `Expected 109 mapped variants, found ${variants}`);
assert(samples === 2616, `Expected 2,616 multilingual freeze-proof samples, found ${samples}`);

console.log(
  `Algebra approved multilingual V2 freeze proof passed: ${samples} samples, 43 QLs, ${variants} variants, 2 locales; learner/solver provenance unchanged and downstream locked`,
);
