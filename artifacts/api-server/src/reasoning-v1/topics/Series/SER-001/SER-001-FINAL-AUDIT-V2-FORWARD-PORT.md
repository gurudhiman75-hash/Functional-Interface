# SER-001 final audit V2 — current-main forward port

Status: **REVIEW-ONLY CURRENT-MAIN CANDIDATE**

This checkpoint replaces the stale `audit-remediation/ser-001-v1-20260912` history with a narrow forward port from the current `New-main` Series authority.

## Preserved current-main authority

This branch does **not** replace or rewind:

- the permanent `SER-QL-001..013` registry;
- the frozen CP007 Question Studio review package;
- the separately approved CP007 internal Test Builder activation authority;
- current Series routes, shared registry wiring or admin UI;
- current Question Bank/Test Builder lifecycle decisions for already-approved CP007 content.

The CP007 review source remains review-only. The downstream internal activation can write reviewed CP007 items to Question Bank and use them in the internal Test Builder, while mock release, public release authorization, student delivery and automatic publication remain blocked. The continuity gate verifies both layers independently.

Only chapter-local audit remediation is added for the new gap families.

## Forward-ported remediation

### CP007 — difficulty repair

The existing frozen corpus keeps the same questions and permanent identities. Difficulty is recalculated from generated-instance properties rather than source-rule identity alone. The feature analysis includes task burden, target count, interleaving, progressive transformations, active channels, length changes, permutation, wraparound, evidence depth, distractor proximity and case signaling.

### CP008 — single-letter and alphanumeric Series gaps

The source-gap experiment spans `SER-QL-014..028`, but the **audited Series candidate retains only 13 identities: `SER-QL-014..018` and `SER-QL-021..028`**.

Two source-backed experiments are explicitly rejected from Series ownership:

- `SER-QL-019 / ALPHANUMERIC_LETTER_POSITION_BINDING`: the displayed tokens do not progress from one term to the next; the missing number is obtained only from the letter-number relation inside the target token.
- `SER-QL-020 / ALPHANUMERIC_OUTER_LETTER_SUM_BINDING`: the answer is obtained only by adding the outer letter positions inside the target token; the preceding tokens are not required to form a progression.

Both are internal alphanumeric-relation solve contracts rather than Series progressions. They remain in the source experiment only as provenance evidence, are **not reserved**, and cannot be promoted from this checkpoint.

The retained CP008 candidates cover source-backed learner-visible progression contracts including single-letter progressive/interleaved series, parallel/interleaved alphanumeric channels, progressive number/letter movement, square-coupled sequences, wrong-term progression, token rotation, opposing channels and number-letter block completion.

Lifecycle remains:

- review-only;
- not permanently allocated;
- not Question Studio discoverable;
- not Question Bank writable;
- not mock/test eligible through this checkpoint;
- not publicly publishable;
- no automatic student delivery.

### CP009 — SSC Reasoning number series

The **audited Series candidate is `SER-QL-029..041` (13 provisional identities)**. CP009 owns only SSC-style four-option Reasoning number-series questions.

The source-gap experiment originally included `SER-QL-042 / INTERNAL_DIGIT_RELATION_OPTION_SERIES`. Final ownership review rejects it because its values do not form a cross-term progression; each value merely obeys the same internal digit relation. That is number-relation/classification logic, not Series. `SER-QL-042` is therefore not reserved and cannot be promoted from this checkpoint.

The audited CP009 layer also:

- forbids leading-zero pseudo-numbers in digit-rotation items;
- recalibrates difficulty from structural burden, using special-pattern recognition as a minimum Medium floor without double-counting a burden already represented by reasoning layers;
- retains visible-state independent solving, misconception-labelled distractors and multilingual parity.

The separate Quant V4 package `BNS-001` continues to own Banking Prelims five-option Speed Mathematics number series. Shared arithmetic primitives do not imply shared product ownership.

The boundary is executable:

| Package | Product surface | Exam profile | Options | Lifecycle at this checkpoint |
|---|---|---|---:|---|
| `SER-001 / SER-CP-009` | Reasoning Series | `SSC_REASONING` | 4 | review-only, undiscoverable |
| `BNS-001` | Speed Mathematics / Banking Number Series | `BANKING_PRELIMS` | 5 | separate Quant V4 lifecycle |

`ser-bns-ownership-boundary.test.ts` fails if these profiles collapse into one product contract.

## Anti-inflation and chapter-ownership rule

A provisional QL is justified only by a distinct learner-visible solve contract, not by a different stem shell, number size, option placement, locale or renderer-only variation.

Source evidence alone is not enough to claim Series ownership. A candidate must require a learner-visible cross-term or block progression. A source-backed item whose answer is recoverable only from an internal relation inside one token/value is rejected from Series even if a source book grouped it under a broad “series” heading. QL019, QL020 and QL042 are the explicit executable examples of this rule.

CP008 and CP009 retained identities remain provisional until source-coverage, collision and merge/split audits explicitly approve permanent identities.

## Safety

This forward port does not authorize promotion of any new Series candidate. It creates a current-main audit surface only. Any permanent QL allocation, shared Question Studio registration, Question Bank storage, test/mock eligibility or public release for the retained CP008/CP009 families requires a separate approval checkpoint.

Rejected identities `SER-QL-019`, `SER-QL-020` and `SER-QL-042` are not reserved.
