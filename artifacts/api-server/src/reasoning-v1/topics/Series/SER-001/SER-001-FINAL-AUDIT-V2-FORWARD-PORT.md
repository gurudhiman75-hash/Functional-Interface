# SER-001 final audit V2 — current-main forward port

Status: **REVIEW-ONLY CURRENT-MAIN CANDIDATE**

This checkpoint replaces the stale `audit-remediation/ser-001-v1-20260912` history with a narrow forward port from the current `New-main` Series authority.

## Preserved current-main authority

This branch does **not** replace or rewind:

- the permanent `SER-QL-001..013` registry;
- the frozen CP007 Question Studio package;
- the current internal Test Builder activation authority;
- current Series routes, shared registry wiring or admin UI;
- current question-bank/test lifecycle decisions for already-approved CP007 content.

Only chapter-local audit remediation is added.

## Forward-ported remediation

### CP007 — difficulty repair

The existing frozen corpus keeps the same questions and permanent identities. Difficulty is recalculated from generated-instance properties rather than source-rule identity alone. The feature analysis includes task burden, target count, interleaving, progressive transformations, active channels, length changes, permutation, wraparound, evidence depth, distractor proximity and case signaling.

### CP008 — missing single-letter and alphanumeric Series families

`SER-QL-014..028` remain **provisional audit identities**, not permanent QLs. They cover source-backed solve contracts that the frozen cluster-heavy CP007 corpus cannot express, including single-letter progressive/interleaved series and alphanumeric channel/binding/rotation/block-completion families.

Lifecycle remains:

- review-only;
- not Question Studio discoverable;
- not Question Bank writable;
- not mock/test eligible through this checkpoint;
- not publicly publishable;
- no automatic student delivery.

### CP009 — SSC Reasoning number series

`SER-QL-029..042` remain **provisional audit identities**, not permanent QLs. CP009 owns only SSC-style four-option Reasoning number-series questions.

The separate Quant V4 package `BNS-001` continues to own Banking Prelims five-option Speed Mathematics number series. Shared arithmetic primitives do not imply shared product ownership.

The boundary is executable:

| Package | Product surface | Exam profile | Options | Lifecycle at this checkpoint |
|---|---|---|---:|---|
| `SER-001 / SER-CP-009` | Reasoning Series | `SSC_REASONING` | 4 | review-only, undiscoverable |
| `BNS-001` | Speed Mathematics / Banking Number Series | `BANKING_PRELIMS` | 5 | separate Quant V4 lifecycle |

`ser-bns-ownership-boundary.test.ts` fails if these profiles collapse into one product contract.

## Anti-inflation rule

A provisional QL is justified only by a distinct learner-visible solve contract, not by a different stem shell, number size, option placement, locale or renderer-only variation. CP008/CP009 remain provisional until source-coverage, collision and merge/split audits explicitly approve their permanent identities.

## Safety

This forward port does not authorize promotion of `SER-QL-014..042`. It creates a current-main audit surface only. Any permanent QL allocation, shared Question Studio registration, Question Bank storage, test/mock eligibility or public release for these new families requires a separate approval checkpoint.
