# MIS-CP-001 Implementation Status

Status: **EXECUTABLE PROTOTYPE / ENGLISH REVIEW CANDIDATE**

## Implemented scope

MIS-CP-001 now covers the eight fundamental two-input authorities from the Missing Number blueprint:

| Candidate | Semantic authority | Difficulty |
|---|---|---|
| MIS-CAND-001 | addition | Easy |
| MIS-CAND-002 | absolute difference | Easy |
| MIS-CAND-003 | product | Easy |
| MIS-CAND-004 | exact division | Easy |
| MIS-CAND-005 | sum plus stable constant | Medium |
| MIS-CAND-006 | product plus stable constant | Medium |
| MIS-CAND-007 | product minus stable constant | Medium |
| MIS-CAND-008 | difference plus stable constant | Medium |

These are **provisional candidate authorities, not permanent QLs**.

Permanent QL allocation remains blocked until source saturation and merge/split auditing are complete.

## Runtime contract

The implementation follows a rule-first pipeline:

1. select the semantic rule and, where needed, its stable constant;
2. construct complete numerical groups from the rule;
3. independently recompute every group through a separate solver path;
4. enumerate every eligible MIS-CP-001 rule/context against the displayed evidence;
5. add another evidence group when competing rules survive;
6. accept only when exactly one semantic rule remains;
7. choose the target group;
8. construct three misconception-grounded distractors;
9. place the blank in the result position;
10. produce a question-specific explanation and review metadata.

The generator never starts from arbitrary random numbers and searches afterward for a convenient relation.

## Question Studio

The package is registered in the standard Reasoning V1 adapter as:

- package: MIS-001
- checkpoint: MIS-CP-001
- subtopic: Missing Number
- runtime: review-only
- Question Studio discoverable: yes
- generation enabled: yes
- Question Bank writes: blocked by the standard review lifecycle
- mock/test/public release: blocked
- language: English only at this checkpoint
- permanent QL count: 0

Hindi and Punjabi are intentionally deferred until English editorial review and source-family consolidation.

## Validation implemented

The CP001 test suite covers:

- deterministic replay;
- all eight candidate authorities;
- independent solver agreement;
- ambiguity enumeration;
- exactly one surviving semantic rule;
- two- or three-evidence-group construction;
- four unique options;
- exactly one correct option;
- misconception-labelled wrong options;
- integer result bounds;
- explanation/answer coherence;
- answer-position coverage;
- numeric diversity;
- structural fingerprints.

The current stress target is 80 seeds per candidate, or 640 generated questions.

## Review export

Run:

~~~bash
pnpm --dir artifacts/api-server exec tsx src/reasoning-v1/topics/Missing-Number/MIS-001/MIS-CP-001/export-review.ts
~~~

Output:

~~~text
artifacts/api-server/dist/reasoning-v1/mis-001/MIS-CP-001-REVIEW.md
~~~

The export produces four deterministic samples for every candidate authority.

## Explicitly not completed

- source saturation;
- permanent QL freeze;
- merge/split audit;
- Hindi localization;
- Punjabi localization;
- inverse missing-input questions (owned by MIS-CP-008);
- triangle/circle/box renderers (later checkpoints);
- full MIS-001 chapter closure.

## Next checkpoint after review

After human review of CP001 samples:

1. correct any stem, arithmetic, ambiguity or distractor defects;
2. freeze the English CP001 editorial surface provisionally;
3. continue with MIS-CP-002 three-input arithmetic relations;
4. keep permanent QL allocation deferred until the chapter-level source-saturation gate.
