# INT-CP-003 — Hindi and Punjabi Localisation Plan

## Phase status

**IMPLEMENTATION STARTED — EXECUTABLE REVIEW REQUIRED**

This phase branches from the approved, inactive English freeze:

```text
English freeze ID:       INT-CP-003-EN-v1-frozen
English freeze head:     5bfa1eee21e4790f17c86374838ea60a6a60c79f
Localisation branch:     feat/int-cp003-hi-pa-localisation
QL range:                INT-QL-053..INT-QL-066
Target locales:          hi-IN, pa-IN
Localisation version:    INT-CP-003-HI-PA-LOCALISATION-v1
```

## Non-negotiable parity rules

Hindi and Punjabi questions must preserve the frozen English authority exactly for:

1. permanent QL ID;
2. mathematical state and mathematical fingerprint;
3. rate profile and numeric family;
4. solve contract and answer semantic;
5. option values and option order;
6. correct option index and canonical solution;
7. source solution-step IDs and verification meaning;
8. difficulty classification;
9. all inactive lifecycle states.

Only learner-facing language may change.

## Localisation method

The implementation will **re-render from the mathematical state and solution trace**. It will not use loose machine translation of a finished English paragraph.

- Stems will be generated QL by QL from the same resolved values used by English.
- Structured tables will retain the same rows, columns, values and missing entries.
- Money, percentages, fractions and equations will remain mathematically identical.
- Option values will remain unchanged; only labels and feedback may be localised.
- Explanations will be rebuilt from the same trace operations and source-step IDs.
- Hindi will use natural exam language in Devanagari.
- Punjabi will use natural exam language in Gurmukhi.
- English technical scaffolding, placeholders and transliterated filler are prohibited.

## Terminology authority

The initial glossary is implemented in `cp003-localization-language-pack.ts`.

Preferred Hindi terms include:

- मूलधन — principal
- राशि — amount
- चक्रवृद्धि ब्याज — compound interest
- वार्षिक दर — annual rate
- मूल राशि — original sum
- शेष राशि — balance

Preferred Punjabi terms include:

- ਮੂਲਧਨ — principal
- ਰਕਮ — amount
- ਚੱਕਰਵੱਧੀ ਵਿਆਜ — compound interest
- ਸਾਲਾਨਾ ਦਰ — annual rate
- ਮੂਲ ਰਕਮ — original sum
- ਬਕਾਇਆ ਰਕਮ — balance

Terminology must remain consistent across stems, options and explanations.

## Implementation sequence

### Wave 1 — Contracts and language authority

- Localised question, presentation, option, explanation and lifecycle types.
- Hindi/Punjabi terminology authority.
- Script and placeholder rejection guards.
- Exact frozen-English source dependency.

### Wave 2 — Question presentation

Implement Hindi and Punjabi renderers for all 14 QLs:

- `INT-QL-053`: amount
- `INT-QL-054`: compound interest
- `INT-QL-055`: principal from amount
- `INT-QL-056`: principal from compound interest
- `INT-QL-057`: annual rate from amount
- `INT-QL-058`: complete years from amount
- `INT-QL-059`: interest in a specified year
- `INT-QL-060`: principal from specified-year interest
- `INT-QL-061`: rate from specified-year interest
- `INT-QL-062`: previous balance
- `INT-QL-063`: rate from consecutive balances
- `INT-QL-064`: principal from consecutive observations
- `INT-QL-065`: difference between two amounts
- `INT-QL-066`: later-year interest

All six representations must be supported without changing the mathematical givens.

### Wave 3 — Explanations and option feedback

- Re-render each solution-trace operation in both languages.
- Preserve every source-step ID.
- Preserve quick-method and verification ownership.
- Use simple student language and show the same intermediate calculations.
- Localise misconception feedback without changing the distractor calculation.

### Wave 4 — Parity audit and review pack

For each locale:

- replay at least 1,400 questions;
- prove mathematical-state identity with English;
- prove option-value/order/correct-index identity;
- prove all source-step IDs are preserved;
- reject mixed-script placeholders and untranslated scaffolding;
- produce 56-question question-and-explanation review Markdown;
- retain `NOT_STAGED`, `NOT_REGISTERED`, `NOT_STORED`, `INELIGIBLE` and non-public lifecycle states.

## Current implementation boundary

Wave 1 has started. No Hindi or Punjabi question is active, staged, registered, stored, test-eligible or publicly publishable.
