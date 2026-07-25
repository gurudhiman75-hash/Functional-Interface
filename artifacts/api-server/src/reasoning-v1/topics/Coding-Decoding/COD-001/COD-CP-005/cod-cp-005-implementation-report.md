# COD-001 / COD-CP-005 Runtime-Proof Implementation

Status: `RUNTIME_PROOF`  
Publicly publishable: `false`

## Scope

- QL range: `COD-QL-113` through `COD-QL-136`
- QL count: 24
- Canonical rearrangement families: 6
- Locale: English (`en-IN`)
- Question Studio/public discovery: intentionally disabled

## Implemented families

1. `REVERSE_SEQUENCE`
2. `CYCLIC_POSITION_ROTATION`
3. `HALF_SWAP`
4. `ODD_THEN_EVEN_EXTRACTION`
5. `EVEN_THEN_ODD_EXTRACTION`
6. `OUTER_INNER_INTERLEAVING`

Rotation covers left/right movement by one or two positions. Outer–inner interleaving covers left-first and right-first reading.

## Student-facing task coverage

- encode a target word;
- decode a rearranged code;
- infer and apply the position order;
- choose the matching code;
- recover one visibly masked letter.

## Runtime contracts

- deterministic QL/seed output;
- exactly four unique options and one correct answer;
- independent inference and inverse decoding;
- no identity rearrangements;
- rejection of any equal-or-simpler CP-003/CP-004/CP-005 interpretation;
- exact source-position order in every Rule explanation;
- missing-letter solutions identify the exact code position, source position and letter;
- option-specific misconception feedback;
- no production exposure before checkpoint freeze.

## Validation target

- checkpoint runtime audit: 24 QLs × 100 seeds = 2,400 questions;
- editorial audit: 24 QLs × 20 seeds = 480 questions;
- editorial review corpus: 24 QLs × 5 seeds = 120 questions.
