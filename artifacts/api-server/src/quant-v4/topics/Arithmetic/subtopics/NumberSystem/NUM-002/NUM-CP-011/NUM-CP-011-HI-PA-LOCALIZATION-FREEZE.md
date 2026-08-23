# NUM-CP-011 — Hindi/Punjabi Localization Freeze

**Checkpoint:** `NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes`  
**Permanent QLs:** `NUM-QL-213..225`  
**Languages:** Hindi (`hi-IN`) and Punjabi (`pa-IN`)  
**Status:** multilingual freeze candidate; downstream delivery remains closed

## Localization rule

Localization is a presentation adapter over the permanent English authority. It must never generate a new mathematical state.

For every Hindi/Punjabi package these source properties remain identical to English:

- permanent QL and authority identity;
- discovery-prototype ancestry;
- seed/source seed;
- difficulty and representation;
- answer semantics;
- hidden mathematical state;
- mathematical fingerprint;
- option order;
- correct option index;
- misconception mapping;
- canonical/verifier meaning.

Numbers, algebraic symbols, factorial notation, powers, valuation notation and set notation are preserved. Learner-facing stem, concept, strategy and worked steps are localized.

## Textual-answer exception

`NUM-QL-220` may produce the textual no-solution option:

```text
No positive integer n
```

This option is localized semantically while its option position, correctness and misconception identity remain unchanged:

- Hindi: `कोई धनात्मक पूर्णांक n नहीं`
- Punjabi: `ਕੋਈ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਨਹੀਂ`

No other option family needs textual translation; numeric and set-valued options remain byte-for-byte unchanged.

## Executable proof

The parity audit covers:

```text
13 authorities × 120 seeds × 2 languages = 3,120 localized packages
```

It proves structural, option-semantic, language and lifecycle parity.

A separate human-quality sweep covers:

```text
13 authorities × 60 seeds × 2 languages = 1,560 localized packages
```

and checks native-script density, explanation completeness, obvious English learner-prose leakage, implementation vocabulary leakage and repeated no-solution fixtures.

The learner review export contains:

```text
13 authorities × 3 seeds × 2 languages = 78 questions
```

## Lifecycle

Localization does not expose the checkpoint to Question Studio or students:

```text
maturity = PERMANENT_AUTHORITY
reviewStatus = MULTILINGUAL_FROZEN
active = false
questionStudioDiscoverable = false
questionBankWritable = false
testEligible = false
publiclyPublishable = false
```

Question Studio integration is a separate later gate and must validate the actual admin route for `NUM-CP-011` and `NUM-QL-213..225`.
