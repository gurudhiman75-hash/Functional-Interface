# WOR-001 — Word & Dictionary Order: Implemented End-to-End Design

This file records the implemented form of the user-approved WOR-001 design.

## Pipeline

```text
curated exam-safe word family
→ deterministic structural word-set builder
→ explicit ASCII A–Z comparator
→ canonical lexical order
→ task-specific state derivation
→ misconception-owned four-option set
→ independent selection-sort verification
→ question-specific explanation
→ English/Hindi/Punjabi rendering
→ review-only Question Studio adapter and exports
```

## Lexical contract

Words are compared case-insensitively from left to right. The first differing character decides the order. If all compared characters match and one word ends, the shorter completed word comes first. V1 accepts A–Z tokens only and excludes punctuation, spaces, numerals, accents and native-script collation.

The generator comparator and verifier use separate implementations. The verifier ignores stored answers and reconstructs the order through repeated pairwise selection.

## Task architecture

- CP-001: complete ascending/descending order, first and last;
- CP-002: kth, rank, predecessor, successor and middle;
- CP-003: insertion, new rank, insertion neighbour, correction and partial order;
- CP-004: high-density common-prefix construction applied to existing solve contracts.

Difficulty comes from word count, common-prefix depth, late decisions, prefix containment, close neighbours, reverse direction and task burden—not obscure vocabulary.

## Localization contract

English words remain the exact logic tokens for all locales. Hindi and Punjabi receive natural instructions and explanations. Seed, word set, answer, options, comparison trace and difficulty are invariant across locales.

## Lifecycle contract

Implementation completeness does not equal publication approval. Prototypes remain review-only, permanent QLs remain unallocated, and Question Studio/public visibility remain disabled until source and human-language gates are approved.
