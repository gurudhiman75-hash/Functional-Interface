# WFM-001 — Source Coverage and Gap Audit

Status: **SOURCE GAP REMEDIATED — CURRENT-MAIN SIX-QL AUTHORITY**

Date: 2026-09-29

## Scope

This audit compares WFM-001 against recurring SSC / Banking / Punjab competitive-exam Word Formation contracts.

Novelty is excluded.

## Existing conventional contracts retained

The original chapter correctly covered:

1. `WFM-QL-001` — one option can be formed from the full source word;
2. `WFM-QL-002` — one option cannot be formed from the full source word;
3. `WFM-QL-003` — selected source positions → count meaningful words using every selected letter exactly once;
4. `WFM-QL-004` — rearrange a supplied letter multiset into one meaningful word.

Recent SSC evidence continues to support all four.

## Source-backed correction inside QL-003

The selected-position authority for:

```text
RECOGNIZE → positions 1, 3, 6, 7 → R, C, N, I
```

was previously recorded as producing zero governed words.

Recent SSC Tier-II source evidence accepts:

```text
CRIN
```

Therefore the authority has been corrected from:

```text
acceptedWords: []
```

to:

```text
acceptedWords: ["CRIN"]
```

This is a source-alignment correction, not a new QL.

## Banking gap 1 — ordered extraction without jumbling

Recurring Banking Mains questions provide one or more source words plus letter positions and ask which candidate produces a meaningful word when the extracted letters are read **in the stated order**.

This is not equivalent to:

- QL-003 count-after-rearrangement;
- QL-004 free rearrangement.

It is a distinct ordered-extraction solve contract.

Permanent allocation:

```text
WFM-CP-004
WFM-QL-005
```

Two renderer variants share the same QL:

- one source word + several positions;
- several source words + one position per word.

No separate QL is created for renderer-only differences.

## Banking gap 2 — unique / multiple / none output

Recurring Banking questions select letters from a source word and require:

1. determine whether zero, one or multiple meaningful words can be formed;
2. if exactly one exists, return a requested letter from that word;
3. otherwise return X/Y according to the sentinel convention explicitly stated in the question.

This is materially different from merely counting the number of words.

Permanent allocation:

```text
WFM-CP-005
WFM-QL-006
```

Both historical X/Y conventions are supported, but only when the convention is stated explicitly in the learner stem.

## Banking presentation for QL-003

Banking selected-letter counting uses five answer options.

That does **not** create a new semantic QL.

`WFM-QL-003` now supports:

- SSC/Punjab: 4-option count presentation;
- Banking: 5-option count presentation.

## Ownership decisions

### Kept outside WFM

The audit did not promote the following:

- transform letters by alphabet-position rules before word formation;
- large letter-arrangement puzzles whose primary burden is positional constraint solving;
- dictionary-order tasks;
- hidden coding rules;
- unrestricted permutation-and-combination word counting.

These remain source-watch or belong to neighboring reasoning families unless recurring evidence proves a stable WFM-owned solve contract.

## Current permanent inventory

| Checkpoint | QL | Contract | Exam profile |
|---|---|---|---|
| CP001 | QL001 | full-source can form | SSC / Punjab |
| CP001 | QL002 | full-source cannot form | SSC / Punjab |
| CP002 | QL003 | selected positions → count meaningful words | SSC / Punjab / Banking |
| CP003 | QL004 | meaningful-word rearrangement | SSC / Punjab |
| CP004 | QL005 | ordered extraction without jumbling | Banking |
| CP005 | QL006 | unique/multiple/none → output letter/X/Y | Banking |

## Lifecycle

All six QLs are review-only.

Normal shared Question Studio discovery and generation are authorized.

Still locked:

- canonical Question Bank write;
- test eligibility;
- mock eligibility;
- public publication;
- automatic learner publication;
- production release.

## Current source-gap disposition

```text
SSC can/cannot:                         COVERED
SSC selected-position count:            COVERED
SSC meaningful rearrangement:            COVERED
Banking selected-position count:         COVERED via QL003 5-option renderer
Banking ordered extraction:              REMEDIATED via QL005
Banking unique/multiple/none output:      REMEDIATED via QL006
new conventional WFM QL required now:    NO FURTHER GAP EVIDENCED
novelty:                                 DEFERRED
```
