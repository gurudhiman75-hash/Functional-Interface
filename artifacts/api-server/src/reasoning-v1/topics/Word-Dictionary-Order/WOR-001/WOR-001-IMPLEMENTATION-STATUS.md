# WOR-001 Implementation Status — Remediation V1

## Current implementation

- clean WOR-001 subtree transplanted onto current `New-main` lineage rather than rebasing the stale multi-topic feature branch;
- four-checkpoint runtime with 19 provisional prototypes / 15 distinct solve contracts;
- 30 curated families / 360 globally unique A–Z word records, all `PROVISIONAL_REVIEW`;
- canonical comparator plus independent selection-sort verifier;
- identical-word comparison traces rejected explicitly;
- state-derived Easy/Medium/Hard scoring with deterministic resampling to requested band;
- truthful misconception metadata for sequence, word, rank and adjacent-pair distractors;
- unique-answer correction and partial-order validators;
- task-specific English, Hindi and Punjabi explanations;
- locale-specific review-pack scaffolding with no hard-coded trilingual English/HI/PA label leakage;
- source-evidence status attached to every prototype and generated question;
- CP-003 source gaps encoded as governance state rather than hidden behind `RETAIN`;
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

## Source status

Core complete-order, endpoint and kth/position-style reasoning now has pinned competitive-exam evidence in the source audit. Platform-supported contracts remain marked separately. All six CP-003 contracts remain `EXPLORATORY_SOURCE_GAP` until recurring SSC/Banking/Punjab evidence is pinned or the contract is merged/removed.

## Automated gate

The head CI gate must pass all of the following before this remediation branch is considered merge-ready:

1. deterministic multilingual runtime audit;
2. requested difficulty equals state-derived difficulty;
3. tier-aware structural difficulty ordering (Hard structurally deeper than Medium; Medium deeper than Easy);
4. source-evidence governance audit;
5. 30-family/360-word corpus uniqueness, reachability and visible-set diversity audit;
6. commit-fresh review-pack generation and artifact upload;
7. API production build.

No locally stated pass result substitutes for the GitHub Actions result on the branch head.

## Still gated after engineering remediation

- source saturation / merge-remove decision for `EXPLORATORY_SOURCE_GAP` contracts;
- human editorial approval of the 360-word corpus;
- human English review of generated questions/explanations;
- native Hindi review;
- native Punjabi review;
- permanent QL allocation;
- central Question Studio discovery;
- public mock-test release.

Lifecycle remains `REVIEW_ONLY`; permanent QLs remain 0; Question Studio visibility and public release remain disabled.
