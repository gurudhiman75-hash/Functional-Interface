# INT-CP-001 Close-Distractor Review Candidate

## Scope

This record freezes the pending distractor-review candidates for:

`INT-CP-001 — Simple-Interest Fundamentals and Direct Inverses`

```text
English:  INT-CP-001-EN-v5
Hindi:    INT-CP-001-HI-v4
Punjabi:  INT-CP-001-PA-v4
Standard: FOUR_TIER_GOLD_CLOSE_DISTRACTORS_V1
QL range: INT-QL-001..INT-QL-021
```

These releases supersede the readable-stem candidates only after explicit human approval. The English V4, Hindi V3 and Punjabi V3 readable-stem releases remain unchanged.

## Editorial defect addressed

The earlier option builder accepted the first three valid misconception values. Some of those values were mathematically traceable but so distant from the answer that a learner could reject them without solving the question.

The new candidate layer selects option values by both misconception ownership and numerical proximity.

## Frozen boundary

The distractor wave does not change:

- QL identity or solve contract;
- generated source state or mathematical fingerprint;
- stem or structured stem presentation;
- canonical solution and verification result;
- correct answer value, text or option position;
- explanation tiers outside trap analysis;
- provenance, publication or Question Studio routing.

It changes only:

- the three wrong option values and texts;
- distractor misconception ownership;
- wrong-option trap explanations;
- distractor proximity trace fields;
- candidate lifecycle identifiers.

## Selection policy

1. Every set contains at least one wrong value below and one above the exact answer.
2. An existing concept-linked trap is retained only when it is within 15% of the answer.
3. At most one existing concept trap is retained per question.
4. Remaining options are deterministic numerical near misses scaled to the answer family.
5. English, Hindi and Punjabi preserve exact option-value and option-position parity.
6. Every displayed wrong option has a matching trap-analysis item.

### Generated proximity rules

- money answers: within 15% of the exact answer;
- annual-rate answers: within two percentage points;
- month answers: half-month or one-month scaled steps, never more than two months away;
- short year-valued answers displayed in months: half-month or one-month offsets;
- year answers through four years: three-month steps;
- larger year answers: six-month or one-year scaled steps within the absolute/relative guard;
- ratios and amount multiples: denominator-aware or 0.05-scale near misses within the ratio guard.

## Representative improvements

### Direct simple interest

Correct answer: `₹4,320`

```text
Previous:  ₹4,32,000 | ₹16,320 | ₹1,440 | ₹4,320
Candidate: ₹4,220    | ₹4,420  | ₹4,120 | ₹4,320
```

### Principal from interest

Correct answer: `₹4,800`

```text
Previous:  ₹960 | ₹4,800 | ₹5,760 | ₹24,000
Candidate: ₹4,700 | ₹4,800 | ₹4,900 | ₹4,600
```

### Time in months

Correct answer: `15 months`

```text
Previous:  3 months | 15 months | 180 months | 27 months
Candidate: 14 months | 15 months | 16 months | 13 months
```

### Amount multiple

Correct answer: `1 7/10 times the principal`

```text
Previous:  1 7/20 | 1 7/10 | 1 4/5 | 7/10
Candidate: 1 3/4  | 1 7/10 | 1 4/5 | 1 13/20
```

## Exhaustive content proof

The tightened candidate runtime passed the pre-record exhaustive workflow on commit:

```text
Commit:   93273122261f5531ad6f630a47035315e08dd25b
Workflow: Validate INT-CP-001 close distractors
Run:      30463648167
Artifact: 8728671466
Digest:   sha256:8484672f8d2b45d5a7c78347779fc566bacc95b04ce41624213d057bc7dbf16e
```

```text
21 QLs × 80 seeds × 3 languages = 5,040 candidates
Invariant checks:                        5,040
Deterministic checks:                    5,040
Proximity checks:                        5,040
Lifecycle checks:                        5,040
Cross-language value/position checks:    3,360
Wrong options audited:                  15,120
Retained concept-linked distractors:     1,146
Generated numerical near misses:        13,974
```

All 1,146 retained concept traps are within the 15% retention boundary. The maximum relative distance across generated options is 40%; this occurs only for low-valued rate or short-duration answers governed by stricter absolute caps. No generated rate option is more than two percentage points away.

## Review evidence

The workflow exports 63 before/after rows per language:

```text
English: 63
Hindi:   63
Punjabi: 63
Total:  189
```

Each row includes the readable stem, previous options, candidate options, correct position, exact proximity, misconception ownership and trap explanations.

## Lifecycle lock

```text
maturity:                    CLOSE_DISTRACTOR_EDITORIAL_CANDIDATE
reviewStatus:                PENDING_MULTILINGUAL_DISTRACTOR_REVIEW
localeReviewStatus:          PENDING_HUMAN_REVIEW
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
```

This record is not an approval. No Question Bank storage, test eligibility, publication, Question Studio discovery, PR readiness or merge is authorised by it.
