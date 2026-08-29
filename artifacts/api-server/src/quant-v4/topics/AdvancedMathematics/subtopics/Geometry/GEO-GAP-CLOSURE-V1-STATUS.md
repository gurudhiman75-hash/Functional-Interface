# Geometry Source-Gap Closure V1 Status

**Authority:** Composite Geometry Revision 3  
**State:** `QUESTION_STUDIO_NORMAL_INTEGRATION_PROVEN__GEO_001_ACTIVE__BANK_TEST_PUBLICATION_LOCKED`  
**Permanent QLs:** `75` (`GEO-QL-001..GEO-QL-075`)  
**Canonical solve-mode families:** `75` (`GEO-SM-001..GEO-SM-075`)  
**Mapped executable variants:** `81`  
**English freeze:** `PROVEN`  
**Hindi/Punjabi:** `V2_APPROVED_AND_PROVEN_FROZEN`  
**Question Studio package:** `GEO-001` — `ACTIVE_AND_DISCOVERABLE`

## Proven English freeze

The exact English review artifact approved by the product owner is `9679418692`, digest `sha256:e59f80ea2e1a532a15bd2b9520acf98ceba368e788c9a2a8c044457a688e562b`.

English freeze proof:
- head `2e72d10a14fff53195f3b077e1c5bc2619b8a3a9`
- run `33159181373` — **success**
- job `98809211590` — **success**
- artifact `9680899337` — `geometry-permanent-english-freeze-v1`
- digest `sha256:96b16c81e3ae365e69618711a0752e21fc4c81dc8f27730f31135b4504e274e7`
- deterministic content-equality samples: `81`
- stress content-equality samples: `972`

## Localisation V1 — rejected

V1 was mechanically green but editorially rejected because token-level substitution produced hybrid English/Hindi/Punjabi sentence fragments and unnatural word order.

Rejected V1 evidence:
- run `33160044783`, job `98812024222` — mechanically successful
- artifact `9681238482`
- digest `sha256:7fc99143e4059393b14e7f57fc9dbec34e7c9d46725e6ef8c54c149b170622ef`

V1 does not authorize any multilingual lifecycle transition.

## Localisation V2 — proven and explicitly approved

V2 uses prototype-aware human-editorial Hindi/Punjabi sentence authorities anchored to the frozen English implementation. It is fail-closed when frozen-English wording drifts outside the authored source-pattern authority.

Final V2 review proof:
- head `aa94efa28a51724f1c0f5416a4d4f9bee9703f19`
- run `33182824118` — **success**
- job `98888110972` — **success**
- artifact `9690420669` — `geometry-permanent-multilingual-review-v2`
- digest `sha256:090ef5809e9a9b3f49df6be8e073786347d8427012eecd16b960f742a97292b6`
- permanent QLs: `75`
- mapped prototype variants: `81`
- source seeds per prototype: `96`
- observed stem patterns: `146`
- observed explanation patterns: `207`
- additional human-editorial source-variant templates: `91`
- deterministic bilingual review items: `162`
- stress generations: `972`
- English-prose leaks: `0`
- unresolved numeric placeholders: `0`

The product owner explicitly approved this exact artifact and digest on `2026-08-28`.

## Hindi/Punjabi multilingual freeze — proven

Freeze proof:
- freeze implementation head `37159dda9df002a144de2f2a51290b8cfa892926`
- run `33185991437` — **success**
- job `98899017638` — **success**
- artifact `9691767855` — `geometry-permanent-multilingual-freeze-v1`
- digest `sha256:78c91fa134661080513549a9350d02e2d5a1345d84063688c84da82bb9d8b426`
- deterministic bilingual content-equality samples: `162`
- bilingual stress content-equality samples: `972`
- approved review artifact pinned: `9690420669`
- learner-facing content unchanged by freeze: `true`

## Normal Question Studio integration — proven

Geometry is integrated into the normal admin Question Studio flow through the live `quant-v4/generation-engine.ts` dispatcher used by `/admin/question-studio/capabilities` and `/admin/question-studio/runs`. There is no Geometry-specific admin route.

Package contract:
- package: `GEO-001`
- topic: `Advanced Mathematics`
- subtopic: `Geometry`
- checkpoints: `14` (`GEO-CP-001..GEO-CP-014`)
- permanent question languages: `75` (`GEO-QL-001..GEO-QL-075`)
- learner languages: `en`, `hi`, `pa`
- Question Studio discoverable: `true`
- runtime mode: `QUESTION_STUDIO_ACTIVE`
- Question Bank status: `NOT_STORED`
- Question Bank writable: `false`
- test eligibility: `INELIGIBLE`
- public publication: `false`

The integration was synchronized with the latest `New-main` dispatcher without removing the existing Input/Output integration.

Dedicated proof:
- integration/base-sync head `9439d40aa5fe7b997231b3e823d0f7e941c2db72`
- run `33226748090` — **success**
- job `99031865761` — **success**
- artifact `9707142273` — `geometry-question-studio-standard-integration-v1`
- digest `sha256:e201d4d1a7e66d1e9447a4e8819d712219b0623a1af81f770b861c8c7a5ff654`
- QL × learner-language parity checks: `225`
- checkpoint routing checks: `14`
- mixed-batch all-QL coverage: `75/75`
- diagram-bearing normal preview checks: `156`
- frozen English/Hindi/Punjabi learner-content parity: `PASS`
- standard `stimulusSvgs` diagram path: `PASS`
- invalid QL/CP selector rejection: `PASS`

## Source boundary

Still source-deferred:
1. `GEO-CP-002/CONVERSE_PARALLELISM`
2. `GEO-CP-002/MULTI_TRANSVERSAL_OR_TRIANGLE_PARALLEL_CHAIN`
3. `GEO-CP-005/BPT_CONVERSE`
4. `GEO-CP-008/KITE_TRAPEZIUM_PROPERTY_RECOGNITION`
5. `GEO-CP-011/CYCLIC_CONVERSE`

`GEO-CP-014/MULTI_THEOREM_STATEMENT_COMPARISON_OR_DATA_SUFFICIENCY` remains owned by Data Sufficiency / statement-evaluation format authority.

## Lifecycle

```text
permanentQlAllocationProven = true
solveModeFreezeProven = true
englishRuntimeProven = true
exactEnglishReviewArtifactApproved = true
englishFreezeProven = true
localizationV1EditoriallyRejected = true
localizationV2Proven = true
exactMultilingualV2ReviewArtifactApproved = true
multilingualImplementationFrozen = true
multilingualFreezeProven = true
questionStudioIntegrationAllowed = true
normalQuestionStudioIntegrationImplemented = true
questionStudioIntegrationProven = true
questionStudioActivationApplied = true
questionStudioDiscoverable = true
questionBankWriteAllowed = false
questionBankWritable = false
testEligibilityAllowed = false
testEligible = false
publicPublicationAllowed = false
publiclyPublishable = false
prMergeAuthorized = false
```

## Next gate

`GEO-001` is operational in the normal Question Studio generation/review workflow. Question Bank conversion, test eligibility and public publication remain fail-closed. A separate later lifecycle decision is required before those downstream surfaces can be enabled.
