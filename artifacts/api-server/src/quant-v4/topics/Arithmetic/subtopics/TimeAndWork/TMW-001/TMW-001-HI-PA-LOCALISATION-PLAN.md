# TMW-001 — Hindi and Punjabi Localisation & Parity Plan

## Status

**English authority: FROZEN and merged.**

**Hindi/Punjabi localisation phase: STARTED.**

This phase is anchored to English-freeze merge commit:

`b4f7dcc8380663cbbb53700c6c76279257385b0f`

Working branch:

`feat/tmw-001-hi-pa-localisation`

No localisation output is publishable during implementation or review.

## Scope

The localisation authority must cover all 211 permanent QLs without changing chapter ownership:

| Checkpoint | QL range | QLs |
|---|---:|---:|
| TMW-CP-001 | TMW-QL-001–020 | 20 |
| TMW-CP-002 | TMW-QL-021–034 | 14 |
| TMW-CP-003 | TMW-QL-035–057 | 23 |
| TMW-CP-004 | TMW-QL-058–081 | 24 |
| TMW-CP-005 | TMW-QL-082–105 | 24 |
| TMW-CP-006 | TMW-QL-106–127 | 22 |
| TMW-CP-007 | TMW-QL-128–143 | 16 |
| TMW-CP-008 | TMW-QL-144–156 | 13 |
| TMW-CP-009 | TMW-QL-157–174 | 18 |
| TMW-CP-010 | TMW-QL-175–192 | 18 |
| TMW-CP-011 | TMW-QL-193–211 | 19 |

Total: **211 QLs per locale**.

## Locales

- Hindi runtime key: `hi`; display locale: `hi-IN`.
- Punjabi runtime key: `pa`; display locale: `pa-IN`.
- English remains the canonical source locale.

## Non-negotiable parity contract

Localisation may change only learner-facing language. For every QL and seed, Hindi and Punjabi must preserve the English package's:

- `archetypeId`;
- `canonicalProblemId`;
- `questionLanguageId`;
- `solveMode`;
- generated parameter state;
- canonical solution value and answer type;
- mathematical fingerprint;
- misconception ownership of each option;
- correct option identity and `correctIndex`;
- validation result;
- publication lock.

Localisation must not introduce a second solver, second parameter generator, alternate option mathematics or language-specific answer authority.

## Delivery architecture

The localisation layer will consume a valid frozen English package and build a localized delivery package.

Planned permanent modules:

1. `foundation/localization-types.ts`
   - locale and localized-delivery contracts;
   - editorial status;
   - parity metadata.

2. `foundation/localization-glossary.ts`
   - natural Hindi and Punjabi terminology;
   - localized units, headings, option labels and answer phrases;
   - approved English carry-through for symbols, formulas and unavoidable proper nouns.

3. `foundation/localization-shared.ts`
   - safe extraction of numeric and MathJax tokens;
   - template filling;
   - option and answer formatting;
   - localized four-tier explanation assembly;
   - option-linked diagnostic trap rendering.

4. checkpoint-localized copy modules
   - one approved source module per checkpoint;
   - QL-complete stem templates;
   - concept-family explanations and trap diagnostics;
   - no generic machine-translation fallback.

5. `tmw-001-localization-parity.test.ts`
   - complete Hindi/Punjabi structural and mathematical parity proof.

6. `tmw-001-localization-review-export.ts`
   - 211-row Hindi corpus;
   - 211-row Punjabi corpus;
   - reviewer-visible stem, options, answer and four-tier explanation.

7. permanent read-only GitHub Actions workflow
   - strict TypeScript check;
   - English freeze regression;
   - Hindi/Punjabi parity proof;
   - review-corpus generation;
   - publication-lock enforcement.

## Language quality rules

### Hindi

Use natural competitive-exam Hindi rather than literal textbook translation.

- prefer `काम की दर` over unnecessarily technical terminology;
- use `दक्षता`, `कुल काम`, `बाकी काम`, `मिलकर`, `अलग-अलग`, `समय`, `भुगतान` and context-appropriate everyday words;
- avoid internal solve-mode language, programming vocabulary and excessive Sanskritisation;
- retain mathematical symbols and MathJax expressions unchanged.

### Punjabi

Use natural Gurmukhi used by Punjabi-medium exam candidates.

- prefer `ਕੰਮ ਦੀ ਦਰ`, `ਕੁੱਲ ਕੰਮ`, `ਬਾਕੀ ਕੰਮ`, `ਇਕੱਠੇ`, `ਵੱਖ-ਵੱਖ`, `ਸਮਾਂ`, `ਭੁਗਤਾਨ` and familiar contextual wording;
- avoid stiff literal translations and overly technical words where a common Punjabi expression is clearer;
- do not transliterate English sentences into Gurmukhi;
- retain mathematical symbols and MathJax expressions unchanged.

### Both locales

- stems must read like original exam questions, not translated templates;
- option units must agree with the localized stem and answer type;
- explanations must preserve Core Concept → Working → Shortcut → Diagnostic Trap;
- trap text must name the actual delivered wrong option and explain the mathematical error;
- no negative-command teaching style such as “do not choose this option”;
- no internal IDs, camelCase solve modes, generation language or audit language;
- conclusion must answer the exact target naturally.

## Mathematical and formatting gates

For every localized candidate:

- exactly four unique options;
- exactly one canonical correct option;
- option order and correct index equal English;
- localized option labels do not alter numeric values;
- answer and conclusion agree with the target;
- balanced inline MathJax;
- no raw `\\frac` outside MathJax;
- no unsupported dollar delimiters;
- no unresolved placeholders;
- no ASCII fractional-time regression;
- deterministic replay for identical QL, seed and locale;
- `publiclyPublishable: false` and editorial status `PENDING` until manual freeze.

## Rollout sequence

### L0 — contracts, glossary and proof harness

Create the shared locale contracts, glossary, token-preserving adapter, parity assertions and review-export shape before checkpoint copy begins.

### L1 — foundation rates

- CP-001: single-agent work, rate and time;
- CP-002: combined and signed rates.

### L2 — productivity and schedules

- CP-003: relative efficiency and productivity;
- CP-004: work schedules and partial participation;
- CP-005: alternating, periodic and cyclic work.

### L3 — workforce and payment

- CP-006: workforce equivalence and changed schedules;
- CP-007: advanced workforce systems;
- CP-008: wages and payment distribution.

### L4 — pipes and advanced synthesis

- CP-009: core signed pipe rates;
- CP-010: staged and cyclic pipe schedules;
- CP-011: final advanced synthesis.

### L5 — complete parity and manual freeze

- 211 Hindi rows and 211 Punjabi rows;
- zero missing QLs;
- zero parity mismatches;
- zero publication leaks;
- complete Hindi manual review;
- complete Punjabi manual review;
- multilingual freeze ledger and exact-head evidence.

## Evidence requirements

The final multilingual freeze cannot rely on checkpoint tests alone. It requires:

1. the frozen 2,532-case English chapter proof to remain green;
2. deterministic Hindi and Punjabi parity sampling across all 211 QLs;
3. exact QL/CP/solve-mode continuity in both locales;
4. 211-row manual-review corpus for each locale;
5. natural-language review with zero unresolved editorial findings;
6. explicit confirmation that all 422 localized rows remain non-publishable.

## Safety boundary

This phase does not enable Question Studio routing, Question Bank writes, test assembly or public delivery. Hindi and Punjabi packages remain review-only until both locale manuals are frozen and a separate integration phase is approved.