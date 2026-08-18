# RNK-CP-002 — Hindi/Punjabi Localization Review Candidate V1

Status: **EXECUTABLE REVIEW CANDIDATE — HUMAN LANGUAGE REVIEW REQUIRED — NOT MULTILINGUAL FROZEN**

Date: 2026-08-14

## Scope

CP002 owns the frozen two-person rank-relation authorities `RNK-QL-010..017`:

```text
RNK-QL-010  people between normalized positions
RNK-QL-011  position gap between normalized positions
RNK-QL-012  target rank from reference rank and separation
RNK-QL-013  compare normalized positions / nearer requested end
RNK-QL-014  total from mixed-end ranks with known relative order
RNK-QL-015  maximum/minimum total from mixed-end ranks with unknown order
RNK-QL-016  exact total or cannot be determined
RNK-QL-017  proposed total / compatible order status
```

No new QL is allocated. `RNK-QL-043` remains available.

## Structured localization authority

Unlike CP001, every CP002 permanent record already contains:

- `contextId`;
- `firstName` and `secondName`;
- frozen `displayedEvidence`;
- `answerSemantic`;
- canonical answer identity;
- canonical option-value identities;
- correct option position;
- normalized state where applicable;
- mathematical fingerprint;
- source prototype and English-review provenance.

V1 therefore renders Hindi/Punjabi learner surfaces directly from structured permanent evidence. It does **not** parse, translate or pattern-match the English stem.

## Evidence coverage

The 13 CP002 discovery prototypes collapse into 12 structured evidence shapes:

```text
SAME_END_TWO_RANKS
SECOND_RANK_FROM_RELATIVE_OFFSET
BETWEEN_FROM_MIXED_END_RANKS
TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER
EXTREME_TOTAL_FROM_MIXED_END_RANKS_UNKNOWN_ORDER
POSITION_GAP_MIXED_END
OFFSET_FROM_SAME_END
TARGET_RANK_FROM_BETWEEN
COMPARE_SAME_END
COMPARE_MIXED_END
EXACT_TOTAL_OR_INDETERMINATE
PROPOSED_TOTAL_ORDER_STATUS
```

Each shape has a dedicated native stem and calculation renderer.

## Canonical outcome localization

CP002 includes learner answers/options that are not always numeric.

V1 localizes those from the permanent canonical outcome identities, not from English display text:

```text
QL-013
  canonical person identity -> localized Object Pool V2 name

QL-016
  Cannot be determined
  -> निर्धारित नहीं किया जा सकता
  -> ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ

QL-017
  first person nearer start end
  second person nearer start end
  both orders possible
  proposed total impossible
  -> contextual native outcomes using the localized names and context
```

Numeric answer types are preserved: permanent numeric values remain numeric; source-wave numeric-string outcomes remain numeric strings.

## Machine-parity inventory

The V1 executable gate uses the frozen CP002 audit density:

```text
permanent QLs:                   8
seeds per QL:                  192
canonical questions:          1536
Hindi candidates:             1536
Punjabi candidates:           1536
total localized candidates:  3072
source prototypes:              13
structured evidence kinds:      12
contexts:                         3
new QLs:                          0
```

For every record the gate preserves:

- package/checkpoint/QL/authority identity;
- context and canonical person identities;
- displayed evidence;
- answer semantic;
- canonical answer and option identities;
- correct option position;
- misconception identities;
- difficulty;
- normalized state;
- mathematical fingerprint;
- source prototype and English-review provenance.

It additionally requires the localized correct option value to equal the localized answer exactly.

## Native ordinal contract

```text
exact 1..4:
  Hindi   पहले / दूसरे / तीसरे / चौथे
  Punjabi ਪਹਿਲੇ / ਦੂਜੇ / ਤੀਜੇ / ਚੌਥੇ

all larger ranks:
  full numeric ordinal is preserved
```

The full-bank test derives every rank actually displayed by each evidence shape and verifies its corresponding native surface.

## Human review pack

`cp002-localization-review-export-v1.ts` produces 128 review questions:

```text
review seeds per QL: 0, 1, 2, 5, 16, 47, 92, 151
Hindi:               8 QLs × 8 = 64
Punjabi:             8 QLs × 8 = 64
total:                         128
```

Seeds 0/1/2 intentionally exercise the major QL-016 and QL-017 branch outcomes and all multi-variant authorities.

## Lifecycle boundary

```text
English frozen:                  true
Hindi/Punjabi:                   REVIEW_CANDIDATE
human language review:           REQUIRED
multilingual freeze:             false
RNK-QL-043 allocated:            false
Question Studio:                 DISABLED
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
product delivery unlocked:       false
```

A green machine-parity gate is necessary but does not authorize multilingual freeze. The retained 128-question learner artifact must be inspected directly before CP002 can be considered review-ready.
