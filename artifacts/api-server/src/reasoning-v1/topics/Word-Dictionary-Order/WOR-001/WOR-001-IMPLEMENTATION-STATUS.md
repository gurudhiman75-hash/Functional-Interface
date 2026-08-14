# WOR-001 Implementation Status — Remediation V1

## Current implementation

- clean WOR-001 subtree transplanted onto current `New-main` lineage rather than rebasing the stale multi-topic feature branch;
- four-checkpoint runtime with 19 provisional prototypes / 15 distinct solve contracts;
- freeze posture separated from executable taxonomy: 7 retained contracts are eligible after editorial gates, 8 retained contracts are `DEFER_SOURCE_GAP`, and 4 CP-004 items are `INSTANCE_VARIANT_NO_QL`;
- 30 curated families / 360 globally unique A–Z word records, all `PROVISIONAL_REVIEW`;
- canonical comparator plus independent selection-sort verifier;
- identical-word comparison traces rejected explicitly;
- state-derived Easy/Medium/Hard scoring with deterministic resampling to requested band;
- truthful misconception metadata for sequence, word, rank and adjacent-pair distractors;
- unique-answer correction and partial-order validators;
- task-specific English, Hindi and Punjabi explanations;
- locale-specific review-pack scaffolding with no hard-coded trilingual English/HI/PA label leakage;
- source-evidence status attached to every prototype and generated question;
- CP-003 source gaps encoded as deferred freeze posture rather than hidden behind `RETAIN`;
- stale checked-in review snapshots removed; review packs are generated as CI artifacts;
- dedicated runtime, source-governance and corpus-diversity CI audits.

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

Core complete-order, endpoint and kth/position-style reasoning has pinned competitive-exam evidence in the source audit. Platform-supported contracts remain marked separately. Targeted source-saturation searches did not establish recurring evidence for predecessor/successor, insertion, misplaced-word, incorrect-adjacent-pair or partial-order contracts, so retained source-gap contracts are explicitly `DEFER_SOURCE_GAP`.

There are 9 source-gap prototypes in total: 8 retained contracts are deferred and `WOR-PROT-019` is already an instance variant with no separate QL.

## Automated gate

The head CI gate must pass all of the following before this remediation branch is considered engineering-merge-ready:

1. deterministic multilingual runtime audit;
2. requested difficulty equals state-derived difficulty;
3. tier-aware structural difficulty ordering (Hard structurally deeper than Medium; Medium deeper than Easy);
4. source-evidence and freeze-governance audit;
5. 30-family/360-word corpus uniqueness, reachability and visible-set diversity audit;
6. commit-fresh review-pack generation and artifact upload;
7. API production build.

No locally stated pass result substitutes for the GitHub Actions result on the branch head.

## Still gated after engineering remediation

- source saturation / merge-remove decision for `DEFER_SOURCE_GAP` contracts;
- human editorial approval of the 360-word corpus;
- human English review of generated questions/explanations;
- native Hindi review;
- native Punjabi review;
- permanent QL allocation;
- central Question Studio discovery;
- public mock-test release.

Lifecycle remains `REVIEW_ONLY`; permanent QLs remain 0; Question Studio visibility and public release remain disabled.
