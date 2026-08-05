# BLR-CP-007 — Coded Relation Construction

## Permanent authority boundary

BLR-CP-007 owns five permanent review-only English QLs:

```text
BLR-QL-031  SELECT_CODED_EXPRESSION
BLR-QL-032  COMPLETE_MISSING_CODE_TOKEN
BLR-QL-033  COMPLETE_ORDERED_CODE_TOKEN_PAIR
BLR-QL-034  COMPLETE_MISSING_PERSON
BLR-QL-035  SELECT_CODED_STATEMENT_BY_VALIDITY
```

The V1 runtime remains the logical regression baseline. Its learner-facing editorial freeze is superseded by V2.

## V2 status

```text
runtime status:                 exact-head validated
full-corpus editorial audit:    passed
human approval:                 pending
English manual freeze:          blocked
localisation:                    blocked
Question Studio:                disabled
Question Bank:                  NOT_STORED
mock-test eligibility:          INELIGIBLE
public publication:             false
merge:                          not authorised
```

V2 preserves the five logical authorities while replacing learner-facing answer ordering, distractors, explanations, diagram semantics and review proof.

## V2 review guarantees

- 168 deterministic English review questions and 672 independently checked options;
- no legacy answer-position cycles or long repeated answer substrings;
- every displayed option creates a valid graph;
- all 24 ordered-token-pair items are solved from a unique final target relation;
- all 96 wrong missing-person options remain connected and yield a supported alternative relation;
- conclusions and option explanations are task-specific;
- direct explanations do not repeat the decoded relation;
- missing-person main solutions retain only the decisive family chain;
- gendered claims are described as unproved when only a gender-neutral relation is established;
- option-by-option diagnostics and family diagrams are available through collapsed optional panels;
- visible explanations, including all option analyses, remain within 300 words.

## Validation commands

```bash
npx --yes tsx@4.20.6 cp007-runtime.test.ts
npx --yes tsx@4.20.6 cp007-v2.test.ts
npx --yes tsx@4.20.6 cp007-v2-editorial.test.ts
npx --yes tsx@4.20.6 export-cp007-v2.ts cp007-v2-output
npx --yes tsx@4.20.6 audit-cp007-v2-deep-remediation.ts cp007-v2-output
npx --yes tsx@4.20.6 polish-cp007-v2-review-html.ts cp007-v2-output
npx --yes tsx@4.20.6 audit-cp007-v2-manual-editorial.ts cp007-v2-output
```

## Boundary

Pure decoding remains CP-006. Open-ended code induction, Data Sufficiency, Question Studio, Question Bank, Hindi/Punjabi localisation, public tests, public publication, production staging and merge remain disabled.

Passing automated, independent and model-assisted editorial audits does not self-authorise learner release. Human approval and a renewed chapter-wide English audit using the V2 artifact are required before any manual-freeze decision.
