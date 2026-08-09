# CAL-001 Question Studio Completion

Status: **CHAPTER AUTHORING COMPLETE — QUESTION STUDIO ACTIVE**

Integration version: `CAL_001_QUESTION_STUDIO_V1`

Package ID: `CAL-001`

Permanent identity range: `CAL-QL-001..036`

## Completed scope

Calendar is registered in the canonical server-backed Question Studio as:

```text
Section:                  Reasoning
Topic:                    Reasoning
Subtopic:                 Calendar
Permanent QLs:            36
Languages:                English, Hindi, Punjabi
Generation mode:          FROZEN_MULTILINGUAL_REVIEW
Question Studio status:   ACTIVE
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
- Question Studio and downstream-release status.

The projection does not create a second mathematics implementation. It delegates to the already-proved Calendar discovery and source-gap runtimes, then packages the result for Question Studio.

## Proof boundary

`question-studio-runtime.test.ts` enforces:

- all 36 permanent QLs are selectable;
- all three approved languages generate successfully;
- localized packages preserve the English source authority, facts, mathematical fingerprint and answer index;
- stems, options and explanations contain no cross-language leakage;
- every item has four unique options and one correct answer;
- generated previews pass the Question Studio quality blocker gate;
- a 36-question mixed batch covers all 36 permanent QLs;
- explicit permanent-QL regeneration works;
- the package appears under Reasoning / Calendar in capabilities;
- all downstream release boundaries remain closed.

The existing Calendar foundation, English editorial, multilingual parity, grammar and final identity proofs continue to run beside the integration proof.

## Delivery boundary

This checkpoint completes the Calendar chapter inside Question Studio. It does not release the generated questions to students.

```text
Question Studio generation:  enabled
Review and revision:         enabled
Regeneration:                enabled
Question Bank storage:       disabled (`NOT_STORED`)
Mock-test eligibility:       disabled (`INELIGIBLE`)
Public publication:          disabled
```

Approval of a Calendar generated item must not convert it into Question Bank content while these statuses remain in force. Question Bank activation, test eligibility and publication require separate release checkpoints.

## Completion verdict

The CAL-001 chapter is complete for the authoring stage:

1. chapter architecture and mathematics are frozen;
2. English, Hindi and Punjabi content is frozen;
3. permanent identities are frozen;
4. Question Studio generation is integrated;
5. review, revision and regeneration are integrated;
6. downstream student-delivery gates remain safely closed.
