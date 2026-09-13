# WFM-001 — Source, ownership and review design

Status: `IMPLEMENTED_REVIEW_CANDIDATE__TAXONOMY_APPROVAL_PENDING`

Proposed product code: `REAS-WFM`  
Chapter ID: `WFM-001`  
Student title: **Word Formation**  
Family: Symbolic and sequence reasoning

## Why this chapter exists

The Alphabet Test final audit exposed a real Reasoning V1 ownership gap: classic questions that ask whether a meaningful candidate word can or cannot be formed from the letters of one supplied source word were present in the reviewed source material, but no current runtime owned them.

The neighboring boundaries are already clear:

- `ALP-001` owns explicit alphabet-position, pair, scan and rearrangement operations;
- `WOR-001` owns ordering multiple words or clusters according to dictionary order and querying the sorted state;
- `COD-001` owns hidden coding/decoding rule inference.

Letter-inventory feasibility is a different reasoning contract. It therefore receives a dedicated review candidate instead of being hidden inside one of those chapters.

## Source-backed family

The audited source material contains the classic SSC word-formation family, including source-word examples such as:

- `MERCHANDISE`;
- `REPUTATION`;
- `CUMBERSOME`;
- `SUPERINTENDENT`;
- `INCONVENIENCE`;
- `DISTRIBUTION`.

This implementation records the family and generates new instances; it does not copy the source stems or answer sets.

## Exact ownership

`WFM-001` owns:

1. **CAN_FORM** — exactly one option can be formed using the source letters;
2. **CANNOT_FORM** — exactly one option cannot be formed using the source letters;
3. repeated-letter multiplicity as an instance property (for example, a candidate needing two copies of a letter when the source contains only one);
4. meaningful real-word options only;
5. four-option SSC/Punjab presentation in the review runtime.

It does not own:

- alphabetical/dictionary sorting of several words (`WOR-001`);
- alphabet positions, opposite letters, pair counting or mixed-row scans (`ALP-001`);
- hidden substitutions or inferred code rules (`COD-001`);
- free anagram enumeration or vocabulary-definition testing.

## QL compression

Only two proposed QL roots are used:

| QL | Identity |
|---|---|
| `WFM-QL-001` | Which option **can** be formed? |
| `WFM-QL-002` | Which option **cannot** be formed? |

Repeated-letter traps, source length, candidate vocabulary and language shells are generation parameters, not separate QL identities. This avoids the semantic inflation found elsewhere in the audit.

## Generator and solver

The generator constructs a source/candidate state from a governed real-word corpus. The solver independently recounts source and candidate letters and requires exactly one valid answer after option shuffling.

No synthetic non-word distractors are used.

The runtime reuses the frozen `WOR-001` real-word corpus as a **lexical resource only**. This is not logic ownership: `WOR-001` continues to own dictionary sorting, while `WFM-001` owns multiset feasibility. A small WFM supplement supplies additional ordinary candidate words and preserves direct-source coverage.

## Difficulty

Difficulty is derived from the generated option state, never from source-word length or seed alone.

- **Easy:** wrong/target option fails because one or more required letters are simply absent from the source.
- **Medium:** a one-letter absent-letter near miss is used, or one multiplicity trap competes with ordinary absent-letter distractors.
- **Hard:** the decisive trap is letter multiplicity; the letters all appear in the source, but a candidate needs one repeated letter more times than available. CAN_FORM hard items contain at least two such traps.

Seed chooses an instance target, but the emitted difficulty is recomputed from the finished option state and must match the target or generation fails.

## Distractor provenance

Every option carries actual state-derived provenance:

- `VALID_LETTER_MULTISET`;
- `IGNORED_MISSING_LETTER`;
- `IGNORED_REPEATED_LETTER_LIMIT`.

These labels describe how the option behaves under the independent letter-count rule; they are not generic editorial labels attached after the fact.

## Explanation policy

Explanations are beginner-first and question-specific:

- state the letter-count rule;
- show the counts needed by the correct/decisive candidate;
- for a multiplicity trap, show the exact shortage (for example, `S×2 needed, S×1 available`);
- do not perform boilerplate option-by-option analysis.

English, Hindi and Punjabi shells are provided while source and candidate words remain in the Latin alphabet, matching the nature of the reasoning operation.

## Production and lifecycle gate

This branch is deliberately review-only:

- proposed taxonomy owner only; the master blueprint is **not** changed in this PR until ownership is approved;
- no Question Bank write;
- no test/mock eligibility;
- no public publication;
- no Banking five-option delivery;
- no Reasoning-wide release promotion.

If this ownership decision is approved, the next governance step is to add `REAS-WFM | Word Formation` to the authoritative master blueprint and update ALP/WOR boundary documents to delegate this family explicitly.
