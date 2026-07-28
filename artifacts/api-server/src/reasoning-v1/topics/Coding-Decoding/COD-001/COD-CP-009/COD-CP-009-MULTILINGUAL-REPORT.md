# COD-CP-009 — Hindi and Punjabi Runtime

Status: **language-adapted runtime-proof complete for `COD-QL-175..198`; review-only**.

## Permanent coverage

All 24 permanent sentence/artificial-language solve contracts are implemented in:

```text
English: en-IN
Hindi:   hi-IN
Punjabi: pa-IN
```

## Locale model

The English runtime remains the abstract topology and hidden word-token mapping authority. Hindi and Punjabi use complete injective lexicons for every approved CP-009 lexeme, while artificial code tokens stay unchanged.

Localized rows preserve:

- statement membership;
- one-to-one word/token structure;
- displayed code-token sets and order;
- target and missing-member positions;
- topology, scenario, difficulty and answer position;
- all solution and witness metadata.

Hindi and Punjabi sentences are authored through grammar-aware rendering. List rows use native conjunctions. Sentence rows place verbs at the end while preserving the abstract word membership required by the constraint solver.

## Executable proof

The guarded audit generates:

```text
24 QLs × 24 seeds × 2 locales = 1,152 questions
```

It reaches:

- all 10 topology families;
- all 16 source task prototypes;
- all four answer types;
- 50 scenarios;
- all four answer positions.

Answer-position counts in each added locale are:

```text
145 / 147 / 144 / 140
```

The audit additionally proves prompt and option reverse-isomorphism to English, complete injective vocabulary, row and code-token membership preservation, deterministic repeat generation, Hindi/Gurmukhi scripts, no English instructional fallback and natural Punjabi terminology.

## Review packs

The CI workflow exports four samples per QL for each added locale in JSONL and Markdown, producing 96 Hindi and 96 Punjabi review questions.

## Release boundary

Question Studio, Question Bank conversion, mock-test eligibility and public routing remain disabled. A final whole-chapter three-locale gate must pass before multilingual chapter closure is declared.
