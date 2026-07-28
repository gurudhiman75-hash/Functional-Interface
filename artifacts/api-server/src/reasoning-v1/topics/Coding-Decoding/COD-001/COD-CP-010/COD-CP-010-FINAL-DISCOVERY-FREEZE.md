# COD-CP-010 — Final English Discovery Freeze

Status: **English discovery frozen under `COD_CP010_ENGLISH_DISCOVERY_FREEZE_V1`; one solve contract; zero permanent QLs in this PR**.

## Frozen contract

```text
APPLY_CONDITIONAL_TABLE_FORWARD
```

The student must:

1. use the displayed lookup table to obtain the ordinary code;
2. classify the first and last source tokens;
3. select the one mutually exclusive condition that applies;
4. apply that condition's override exactly once;
5. choose the complete resulting code sequence.

## Frozen generated dimensions

The following remain instance properties inside the same solve contract:

- letter versus digit input;
- vowel/consonant versus odd/even classification;
- all eight domain/endpoint signatures;
- source length and table order;
- constant endpoint replacement;
- endpoint-code interchange;
- copying the left endpoint code to both endpoints;
- copying the right endpoint code to both endpoints;
- replacing every member of a stated class by one designated table code;
- stem wording, answer position and difficulty.

These axes do not change the answer predicate, solver route, renderer contract or proof obligation. They must not consume separate QLs.

## Executable proof

The prototype audit generates 800 deterministic English questions and proves:

- independent hidden-evaluator and displayed-prompt solver agreement;
- both input domains;
- all eight endpoint signatures;
- all five admitted action kinds;
- Easy, Medium and Hard reach;
- four semantically distinct options with one correct answer;
- all answer positions;
- class-wide overrides visibly affect at least two source tokens;
- complete table, condition and explanation payloads;
- no permanent identity or public-surface leakage.

## Excluded expansions

Freeze version 1 excludes:

- inverse decoding under non-injective overrides;
- missing-token recovery without recurring source evidence;
- inferring hidden conditions instead of applying displayed conditions;
- overlapping-condition precedence systems;
- separate QLs for letter/digit domains or action variants;
- unsupported repeated-character-only and positional-only conditional families;
- arithmetic or relation-symbol substitution owned by `OPS-001`.

A later expansion requires direct recurring exam evidence and a new freeze version.

## Allocation consequence

After this discovery freeze is merged, the guarded permanent allocation may assign exactly:

```text
COD-QL-199 — APPLY_CONDITIONAL_TABLE_FORWARD
```

No other CP-010 identity is authorised by this freeze.

## Release boundary

- permanent CP-010 QLs in this PR: **0**;
- English: executable prototype only;
- Hindi/Punjabi: not started;
- Question Studio, Question Bank, mock-test and public publication: disabled.
