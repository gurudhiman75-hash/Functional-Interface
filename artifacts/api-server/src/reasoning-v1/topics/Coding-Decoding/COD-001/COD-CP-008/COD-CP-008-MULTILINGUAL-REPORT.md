# COD-CP-008 — Hindi and Punjabi Runtime

Status: **language-adapted runtime-proof complete for `COD-QL-173..174`; review-only**.

## Permanent contracts

- `COD-QL-173` — identify the renamed label assigned directly to a stated referent;
- `COD-QL-174` — identify the ordinary semantic referent, then apply one renaming edge.

## Locale design

Hindi and Punjabi use complete locale-specific referent dictionaries for every direct-label pool and all semantic domains. All fifteen semantic facts have separately authored questions and rationales in each language. Mapping statements, prompt labels, options, stems and explanations are localized together.

The abstract English question remains the identity and topology authority. The localized runtime preserves the same QL, seed, mapping shape, topology, difficulty, renderer, option position and abstract hidden fingerprint. The locale-neutral one-edge mapping solver independently verifies the localized answer.

## Executable proof

The audit generates:

```text
2 QLs × 120 seeds × 2 locales = 480 questions
```

It reaches:

- all 15 semantic facts;
- `ATTRIBUTE`, `CATEGORY`, `FUNCTION` and `ROLE` facts;
- open-chain and cycle mappings;
- all four answer positions;
- deterministic repeat generation;
- unique translated options and independent mapping-solver agreement;
- Hindi/Gurmukhi script and no-English-fallback gates;
- natural Punjabi terminology.

## Release boundary

Question Studio, Question Bank conversion, mock-test eligibility and public routing remain disabled. The remaining chapter localisation gap is `COD-QL-175..198` in CP-009.
