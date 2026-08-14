# WOR-001 Implementation Status — Remediation V2

## Current implementation

- clean WOR-001 subtree on current `New-main` lineage;
- four-checkpoint runtime with 19 provisional prototypes / 15 executable task kinds;
- final recommended freeze architecture: 4 QL roots, 8 source-deferred retained contracts, 7 instance variants with no separate QL;
- 30 curated families / 360 globally unique A–Z word records, all `PROVISIONAL_REVIEW` pending human corpus approval;
- canonical comparator plus independent selection-sort verifier;
- identical-word comparison traces rejected explicitly;
- state-derived Easy/Medium/Hard scoring with deterministic resampling to requested band;
- truthful misconception metadata for sequence, word, rank and adjacent-pair distractors;
- FIND_RANK targets interior positions so it does not collapse into endpoint questions;
- RANK_AFTER_INSERTION always selects a target whose rank actually shifts;
- unique-answer correction and partial-order validators;
- English, Hindi and Punjabi explanations now prove every adjacent comparison in the canonical order before giving the task-specific conclusion;
- locale-specific review-pack scaffolding with no hard-coded trilingual label leakage;
- source-evidence status attached to every prototype and generated question;
- CP-003 and predecessor/successor source gaps remain explicitly deferred rather than hidden behind executable `RETAIN` status;
- stale checked-in review snapshots removed; review packs are generated as CI artifacts;
- dedicated runtime, source-governance and corpus-diversity CI audits.

## Recommended permanent QL roots

```text
1. Complete dictionary order
   variants: reverse order, hard/deep-prefix full order

2. Endpoint after ordering
   variants: first word, last word

3. Word at a specified position
   variants: kth word, middle word, hard/deep-prefix kth

4. Position of a specified word
   variants: ordinary rank, hard/deep-prefix rank
```

Permanent IDs remain unallocated. The four-root architecture is a freeze recommendation, not publication activation.

## Corpus shape

```text
families: 30
word records: 360
EASY families: 8
MEDIUM families: 10
HARD families: 12
editorial state: PROVISIONAL_REVIEW
global normalized duplicates: blocked by runtime guard
```

## Source and freeze status

Direct/previous-paper evidence supports complete ordering, endpoints, kth-position and middle-word forms. Reverse dictionary order is retained as an instance of complete ordering rather than a separate QL. Position-of-specified-word remains a supported distinct query direction.

Targeted source saturation did not establish recurring direct exam evidence for predecessor/successor, insertion, misplaced-word, incorrect-adjacent-pair or partial-order contracts. Eight retained source-gap contracts therefore remain `DEFER_SOURCE_GAP`; the hard insertion prototype is already an instance variant with no QL.

Current posture:

```text
ELIGIBLE_AFTER_EDITORIAL: 4
DEFER_SOURCE_GAP: 8
INSTANCE_VARIANT_NO_QL: 7
```

## Automated gate

The branch-head CI must pass all of the following:

1. deterministic multilingual runtime audit;
2. requested difficulty equals state-derived difficulty;
3. tier-aware structural difficulty ordering;
4. every explanation contains proof for every adjacent canonical pair;
5. ordinary rank targets are interior positions;
6. rank-after-insertion actually shifts the target rank;
7. source-evidence and four-root freeze-governance audit;
8. 30-family/360-word corpus uniqueness, reachability and visible-set diversity audit;
9. commit-fresh review-pack generation and artifact upload;
10. API production build.

## Still gated after this remediation

- human editorial approval of the 360-word corpus;
- human English review of generated questions/explanations;
- native Hindi review;
- native Punjabi review;
- permanent ID allocation to the four recommended roots;
- central Question Studio discovery;
- public mock-test release.

Lifecycle remains `REVIEW_ONLY`; permanent QLs remain 0; Question Studio visibility and public release remain disabled.
