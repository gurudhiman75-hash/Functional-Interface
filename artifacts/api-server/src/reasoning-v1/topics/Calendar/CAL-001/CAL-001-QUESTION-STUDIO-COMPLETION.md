# CAL-001 Question Studio and Production Completion

Status: **CHAPTER AUTHORING COMPLETE — APPROVAL-GATED PRODUCTION LIFECYCLE ACTIVE**

Question Studio version: `CAL_001_QUESTION_STUDIO_V1`

Production release authority: `CAL_001_PRODUCT_RELEASE_APPROVED_2026_08_09`

Package ID: `CAL-001`

Permanent identity range: `CAL-QL-001..036`

## Completed scope

Calendar is registered in the canonical server-backed Question Studio as:

```text
Section:                       Reasoning
Topic:                         Reasoning
Subtopic:                      Calendar
Permanent QLs:                 36
Languages:                     English, Hindi, Punjabi
Source generation mode:        FROZEN_MULTILINGUAL_REVIEW
Runtime mode:                  CANONICAL_REVIEW
Editorial release status:      APPROVED_EDITORIAL_CANONICAL
Question Studio status:        ACTIVE
Question Bank status:          READY_FOR_STORAGE
Test eligibility:              ELIGIBLE
Mock-test eligibility:         true
Publication-workflow eligible: true
Manual approval required:      true
Automatic student publication: false
```

The package supports:

- discovery through the Question Studio capabilities endpoint;
- selection of any permanent `CAL-QL-*` identity;
- mixed batches across all 36 permanent identities;
- deterministic generation by seed;
- English, Hindi and Punjabi generation;
- difficulty selection with deterministic fallback where an authority has a fixed natural level;
- preview through the standard Question Studio payload;
- immutable generation-run and generated-item persistence;
- item-level quality review;
- manual revision through immutable generated-item versions;
- regeneration using the same package, permanent QL, language and difficulty metadata;
- conversion of an administratively approved generated item into an approved Question Bank question and version;
- eligibility of approved Question Bank items for mock-test assembly and publication QA;
- permanent-Ql-to-source-authority traceability;
- mathematical fingerprint and semantic-fact retention.

## Runtime authority

`question-studio-runtime.ts` projects the frozen multilingual Calendar runtime into permanent Question Studio identities.

Every generated question records:

- permanent QL ID;
- owning source prototype authority;
- all source prototypes owned by the permanent QL;
- checkpoint ownership;
- solve authority and answer type;
- language and difficulty;
- seed;
- mathematical fingerprint;
- semantic facts;
- release authority;
- Question Studio, Question Bank, test and publication-workflow status;
- the mandatory manual-approval boundary;
- the explicit prohibition on automatic student publication.

The projection does not create a second mathematics implementation. It delegates to the already-proved Calendar discovery and source-gap runtimes, then packages the result for Question Studio and the existing approval converter.

## Approval-gated production flow

1. An administrator generates Calendar questions in Question Studio.
2. Generated items enter the existing generation-run and immutable-version workflow.
3. Items remain subject to manual review, revision or regeneration.
4. Only an item explicitly marked approved by an administrator can invoke the existing Question Bank converter.
5. The converter creates the approved question, approved version and option records.
6. Approved Question Bank records can enter existing mock-test assembly and publication-QA workflows.
7. No generated or approved Calendar item is automatically published to students.

## Proof boundary

`question-studio-runtime.test.ts` enforces:

- all 36 permanent QLs are selectable;
- all three approved languages generate successfully;
- localized packages preserve the English source authority, facts, mathematical fingerprint and answer index;
- stems, options and explanations contain no cross-language leakage;
- every item has four unique options and one correct answer;
- generated previews pass the Question Studio quality blocker gate;
- every checked English, Hindi and Punjabi preview passes the existing Question Bank eligibility gate;
- normalization for Question Bank conversion preserves package ID, language, option count and correct index;
- a 36-question mixed batch covers all 36 permanent QLs;
- explicit permanent-QL regeneration works;
- the package appears under Reasoning / Calendar in capabilities;
- manual approval remains mandatory;
- automatic student publication remains disabled;
- historical freeze records remain unchanged as immutable audit evidence.

The existing Calendar foundation, English editorial, multilingual parity, grammar and final identity proofs continue to run beside the production proof.

## Delivery boundary

This release makes Calendar production-ready after manual approval. It does not automatically approve generated items and does not automatically publish anything to students.

```text
Question Studio generation:      enabled
Generation persistence:          enabled
Review and revision:             enabled
Regeneration:                    enabled
Question Bank conversion:        enabled after manual approval
Mock-test eligibility:           enabled after manual approval
Publication QA eligibility:      enabled after manual approval
Automatic student publication:   disabled
```

## Completion verdict

The CAL-001 chapter is complete through the controlled production stage:

1. chapter architecture and mathematics are frozen;
2. English, Hindi and Punjabi content is frozen;
3. permanent identities are frozen;
4. Question Studio generation is integrated;
5. review, revision and regeneration are integrated;
6. approved-item Question Bank conversion is enabled;
7. approved-item mock-test and publication-QA eligibility is enabled;
8. manual approval is mandatory;
9. automatic student publication remains disabled.
