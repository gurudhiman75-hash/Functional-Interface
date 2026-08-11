# BLR-CP-003 — Family-Set Passages and Shared Graphs

Status: **English discovery frozen at `BLR-QL-009..012`; deterministic permanent English review runtime available; Hindi and Punjabi machine-proved review candidates complete and product-locked pending human language review**.

## Ownership

This checkpoint owns pure-kinship shared passages. One hidden family graph yields one clue block, and clue-only reconstruction supports independently solved family-pair, member-by-relation, marital-status and exact-lineage questions.

## Frozen English authority

```text
freeze version                 BLR_CP003_ENGLISH_DISCOVERY_FREEZE_V1
approved English records                                      298
shared-passage groups                                         102
topologies                                                      9
prototypes                                                     29
permanent QLs                                                   4
range                                             BLR-QL-009..012
next available QL                                      BLR-QL-013
```

Permanent QL ownership:

```text
BLR-QL-009  SELECT_UNORDERED_FAMILY_PAIR
BLR-QL-010  IDENTIFY_ALL_MEMBERS_BY_RELATION
BLR-QL-011  IDENTIFY_MEMBER_BY_MARITAL_STATUS
BLR-QL-012  IDENTIFY_PERSON_BY_EXACT_LINEAGE
```

The permanent English runtime generates all frozen QL items and 102 shared-passage groups deterministically. The unresolved-status authority is merged into `BLR-QL-011`.

## Multilingual review candidate

Hindi (`hi-IN`) and Punjabi (`pa-IN`) are derived from the frozen English bank without changing canonical question ownership or answers.

```text
canonical English records                  298
Hindi review candidates                    298
Punjabi review candidates                  298
total localized review candidates          596
QL distribution
  BLR-QL-009                                108
  BLR-QL-010                                108
  BLR-QL-011                                 66
  BLR-QL-012                                 16
```

Machine gates prove for every localized record:

- the same permanent QL ID and item identity;
- the same `correctIndex`;
- the same `answerSemanticKey`;
- the same canonical semantic fingerprint;
- four-option shape and four-option editorial analysis;
- Hindi/Punjabi script presence after person names are removed;
- zero residual English learner-language forms;
- zero unresolved localization placeholders;
- zero uncovered passage templates.

The localization grammar is fail-closed. If an earlier grammar layer returns partially translated learner text, the final layer rejects residual ASCII words after protecting person names and requires an exact supported sentence template instead of allowing mixed-language output.

## Localization release boundary

The 596 localized records are **review candidates, not production-approved language variants**.

For every Hindi/Punjabi candidate:

```text
reviewOnly                         true
publiclyPublishable                false
questionStudioVisible              false
questionBankEligible               false
mockTestEligible                   false
productDeliveryUnlocked            false
humanLanguageReviewRequired        true
```

The active editorial blocker remains `BLR_CP003_HUMAN_REVIEW_BLOCKER`. Machine parity is necessary but does not substitute for human Hindi/Punjabi language review.

No localized candidate may enter Question Studio, Question Bank, mocks or public delivery until an explicit later approval/freeze step removes that blocker and unlocks the relevant product surfaces.

## Semantic boundaries

```text
named spouse edge or explicit married fact -> MARRIED
explicit unmarried fact                    -> UNMARRIED
missing spouse edge alone                  -> no status conclusion
marriage alone                              -> no co-parent conclusion
joint-parent wording                        -> both parent edges required
unstated gender                             -> no hidden learner inference
```

Family counts and composition remain owned by BLR-CP-004. Possibility and cannot-determine semantics remain owned by BLR-CP-005.

## Acceptance gates

The CP-003 multilingual workflow must keep all of these green together:

1. regress the frozen English discovery bank and permanent runtime;
2. audit Hindi/Punjabi learner-language leakage and template coverage;
3. prove Hindi/Punjabi semantic parity over all 596 localized candidates;
4. typecheck the admin application;
5. build the API server.

## Current checkpoint boundary

- English discovery freeze: complete;
- permanent English QLs: `BLR-QL-009..012`;
- permanent English review runtime: complete;
- Hindi machine candidate: complete;
- Punjabi machine candidate: complete;
- machine semantic parity: proved;
- machine learner-language leak audit: proved;
- human Hindi/Punjabi language review: required;
- localized product delivery: locked;
- localized Question Studio visibility: disabled;
- localized public publication: disabled.
