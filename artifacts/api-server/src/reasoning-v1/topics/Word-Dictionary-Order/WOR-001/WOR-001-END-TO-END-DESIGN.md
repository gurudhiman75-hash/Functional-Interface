# WOR-001 — Word & Dictionary Order: Implemented End-to-End Design

This file records the remediated implementation of the user-approved WOR-001 design.

## Pipeline

```text
curated provisional word family
→ deterministic structural word-set builder
→ explicit ASCII A–Z comparator
→ canonical lexical order
→ task-specific state derivation
→ structural difficulty scoring
→ deterministic resampling to requested difficulty band
→ misconception-owned four-option set
→ independent selection-sort verification
→ task-specific explanation
→ English/Hindi/Punjabi rendering
→ review-only Question Studio adapter
→ commit-fresh CI review artifact
```

## Lexical contract

Words are compared case-insensitively from left to right. The first differing character decides the order. If all compared characters match and one word ends, the shorter completed word comes first. V1 accepts A–Z tokens only and excludes punctuation, spaces, numerals, accents and native-script collation. Comparison traces reject identical normalized words because a decision trace is meaningful only for distinct tokens.

The generator comparator and verifier use separate implementations. The verifier ignores stored answers and reconstructs the order through repeated pairwise selection.

## Corpus contract

The remediation corpus contains 30 families and 360 globally unique words:

- 8 Easy families — broad familiar vocabulary with mostly early decisions;
- 10 Medium families — moderate shared-prefix structure;
- 12 Hard families — deeper common-prefix and prefix-containment opportunities.

All records remain `PROVISIONAL_REVIEW` until human corpus approval. Runtime guards reject non-A–Z tokens, cross-family duplicates and duplicate word IDs.

## Task architecture

- CP-001: complete ascending/descending order, first and last;
- CP-002: kth, rank, predecessor, successor and middle;
- CP-003: insertion, new rank, insertion neighbour, correction and partial order;
- CP-004: high-density common-prefix construction applied to existing solve contracts.

CP-004 remains an instance-variant layer, not a separate permanent-QL reservation.

## Difficulty contract

Difficulty is derived from the actual generated state, not merely from the requested family tier. The scorer uses word count, common-prefix depth, late decisions, prefix containment, reverse direction and task-inference burden. The runtime deterministically resamples candidate states until the generated state classifies into the requested Easy/Medium/Hard band. Hard-only CP-004 contracts remain Hard.

Automated validation checks both `question.difficulty === state.difficulty` and `state.difficulty === classify(features)`.

## Distractor contract

Every wrong option carries a misconception ID derived from the transformation that produced that option. Rank labels distinguish one/two/multiple places early or late. Sequence labels distinguish first-letter errors, common-prefix errors, late-character errors, prefix-termination errors and reverse-order errors. Incorrect-adjacent-pair distractors explicitly represent choosing a correctly ordered pair.

## Source-evidence contract

Every prototype and generated question carries one of:

- `PYQ_SUPPORTED`;
- `PLATFORM_SUPPORTED`;
- `EXPLORATORY_SOURCE_GAP`.

Source status is independent of runtime validity. A source-gap prototype may remain executable for review but cannot become permanent-QL-ready merely because automated generation passes. CP-003 currently remains source-gap gated.

## Localization contract

English words remain the exact logic tokens for all locales. Hindi and Punjabi receive localized instructions, review labels, decisive-character explanations and task-specific conclusions. Seed, word set, answer, options, comparison trace and difficulty remain invariant across locales.

## Review-artifact contract

Generated review snapshots are not committed as durable evidence. CI generates Markdown and JSON packs from the exact tested commit and uploads them as the `wor-001-review-packs` artifact. This prevents stale review files from surviving engine, corpus or localization changes.

## Lifecycle contract

Implementation completeness does not equal publication approval. Prototypes remain review-only, permanent QLs remain unallocated, and Question Studio/public visibility remain disabled until source, corpus and human-language gates are approved.
