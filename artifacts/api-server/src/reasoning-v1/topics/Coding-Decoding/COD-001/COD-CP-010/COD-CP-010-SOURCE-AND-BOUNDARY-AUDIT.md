# COD-CP-010 — Source and Boundary Audit

Status: **English discovery prototype; one source-backed solve contract; zero permanent QLs**.

## Source evidence

The primary uploaded source is *Reasoning for Competitions*, Coding–Decoding, Type 6 Conditional Coding.

Recurring source structure:

1. a fixed letter→code or digit→code lookup table;
2. one source group to encode;
3. mutually exclusive conditions classified by the first and last source tokens;
4. one condition-selected override applied after ordinary table lookup;
5. four complete code-sequence options.

Observed override actions include:

- replacing both endpoint codes by a fixed constant;
- interchanging the two endpoint codes;
- copying the first endpoint's table code to both endpoints;
- copying the last endpoint's table code to both endpoints;
- replacing every vowel code by one designated table code when an endpoint condition is met.

The source supplies both letter/vowel-consonant and digit/odd-even datasets. These change the classification data, not the student solve operation.

## Retained solve contract

```text
APPLY_CONDITIONAL_TABLE_FORWARD
```

Student proof path:

1. write the ordinary code from the table;
2. classify the first and last source tokens;
3. identify the unique matching condition;
4. apply that condition's override once;
5. select the resulting complete code sequence.

Endpoint class, input domain, source length and override action are generated-instance properties. They do not justify separate QLs because the answer predicate, solver route, renderer, option semantics and explanation skeleton remain the same.

## Merge decisions

| Candidate split | Decision | Reason |
|---|---|---|
| letter versus digit input | merge | same lookup → classify → select → override pipeline |
| vowel/consonant versus odd/even conditions | merge | classification data only |
| constant, swap, copy-left, copy-right and class-wide override | merge | action parameter inside the same explicit condition system |
| source length and table size | merge | difficulty/presentation only |
| choose-code wording variants | merge | same answer obligation |

## Exclusions and source gaps

The following are not admitted in freeze version 1:

- inverse decode from a conditional code sequence, because no recurring source evidence was found and overrides may be non-injective;
- missing-token recovery, because the reviewed source asks for the complete code;
- inferred hidden conditions, because the conditions are explicitly displayed in the source format;
- overlapping conditions with first-match, last-match or compose-all precedence, because the reviewed source uses mutually exclusive endpoint cases;
- repeated-character-only and arbitrary positional override families without direct recurring source evidence;
- arithmetic or relation-symbol substitution, which belongs to `OPS-001`;
- ordinary direct letter/digit/symbol lookup without a condition, which belongs to `COD-CP-001` or `COD-CP-007`;
- sentence/artificial-language constraint coding, which belongs to `COD-CP-009`.

## Safety boundary

- permanent QLs: **0**;
- next available COD identity: `COD-QL-199`, not allocated;
- locale: English prototype only;
- Question Studio, Question Bank, mock-test and public routing: disabled;
- Hindi and Punjabi: deferred until English ownership freezes.
