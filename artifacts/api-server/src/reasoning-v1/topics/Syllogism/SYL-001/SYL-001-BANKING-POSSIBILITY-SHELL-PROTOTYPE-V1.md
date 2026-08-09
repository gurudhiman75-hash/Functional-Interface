# SYL-001 — Banking Possibility Shell Prototype V1

Authority: `SYL_001_BANKING_POSSIBILITY_SHELL_V1`

Status: **prototype; not registered as a QL and not connected to profile generation**.

## Problem being solved

The source-profile closeout found that Banking questions can place a possibility-worded proposition inside an ordinary conclusion set. The current `SYL-QL-005` tests possibility semantics through a standalone four-option conclusion-selection task. That remains useful practice but is not the final mock-test shell.

## Prototype shape

Each record contains:

- Banking-authorised statements;
- exactly two conclusions;
- exactly one ordinary categorical conclusion;
- exactly one possibility-worded conclusion;
- the standard five Banking combination options:
  - only conclusion I follows;
  - only conclusion II follows;
  - both follow;
  - neither follows;
  - either I or II follows.

The possibility and ordinary conclusions may appear in either order.

## Semantic rule

The existing canonical solver remains authoritative.

```text
Ordinary conclusion follows:
  classification === ENTAILED

Possibility conclusion follows:
  canBeTrue === true
```

The prototype restricts possibility wording to `SOME` and `SOME_NOT` conclusions and excludes already-entailed candidates. Therefore:

```text
UNDETERMINED  → possibility follows
CONTRADICTED → possibility does not follow
```

No new logical foundation type is introduced.

## Source boundary

Only Banking-authorised scenario groups are permitted:

```text
CORE
ONLY
FEW
```

Scenario authority must use a `SYL-SRC-BANK-*` source pattern. Cross-exam and SSC-only scenarios are prohibited.

## Prototype audit

The audit covers:

```text
80 seeds × 3 locales = 240 records
```

It verifies:

- all four non-either-or pair outcomes are produced evenly;
- one possibility and one ordinary conclusion per record;
- possibility truth is bound to `canBeTrue`;
- ordinary truth is bound to `ENTAILED`;
- five unique localized options with one correct answer;
- semantic parity across English, Hindi and Punjabi;
- Banking-only scenario authority;
- at least two scenario groups, two source patterns and eight scenarios;
- option-position variation;
- all activation and delivery locks remain false.

## Compatibility boundary

```text
Legacy SYL-QL-005 changed: false
New registered QL created: false
Profile planner connected: false
Question Studio visible: false
Question bank writable: false
Test eligible: false
Public: false
```

## Next decision after prototype proof

A later checkpoint may register a new canonical Banking archetype or adapter only after:

- the generated stems and explanations are human-reviewed;
- source wording and option shell are compared against a broader Banking question ledger;
- deterministic profile-plan integration is separately audited;
- compatibility and release decisions are explicitly approved.
