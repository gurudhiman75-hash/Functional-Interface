# ANA-CP-009 Legacy Allocation Boundary Audit

Status: **AUTHORITATIVE FOR THE 24 HISTORICAL CP-009 PLACEHOLDERS; ZERO PERMANENT QLS ADMITTED**.

> Allocation supersession — 2026-09-11: the historical CP-009 reservation `ANA-QL-251..274` is no longer an unallocated current window. The final ANA-001 source-gap closure assigns `ANA-QL-251..268` to implemented `ANA-CP-010`. `ANA-QL-269..274` remain unallocated. This document remains authoritative for the conclusion that **CP-009 itself owns zero permanent QLs** and for the historical merge/delegate/quarantine decisions below.

## 1. Why this audit is required

The original ANA-001 design reserved 24 QLs for CP-009 before CP-003 through CP-008 were source-saturated and implemented. Those historical entries used the labels `ANA-QL-237..260`, but later manifest amendments reassigned the implemented chapter continuously through `ANA-QL-250` and, at that historical stage, moved the provisional CP-009 window to `ANA-QL-251..274`.

The old family names therefore cannot be copied into any later range. They must first pass the current ownership rule:

> CP-009 owns only a source-backed relation in which the pair-local rule or its parameter must itself be derived across complete pairs.

A harder formula, a second source example, a reversed blank, a closer distractor or an odd-pair presentation does not by itself create a CP-009 authority.

## 2. Historical family decisions

| Historical family | Decision | Correct boundary |
|---|---|---|
| two arithmetic operations | delegate | numeric analogy CP-003 through CP-005 |
| power plus digit operation | delegate | digit-based numeric analogy CP-005 |
| infer from two examples | presentation only | underlying rule owns the QL |
| reverse-direction transfer | presentation only | inverse audit under the underlying rule |
| number-to-letter position | delegate | CP-008 analogy or Coding-Decoding by task framing |
| letter-to-number position | delegate | CP-007/CP-008 or Coding-Decoding by task framing |
| word length plus alphabet value | delegate after source proof | CP-007 word structure |
| close semantic discrimination | delegate | CP-001/CP-002 curated semantic relations |
| hierarchy-sensitive semantic analogy | delegate | CP-001/CP-002 curated hierarchy relations |
| conditional branch rule | quarantine | possible CP-009 family only after recurring source proof |
| identify incorrect analogy | presentation only | odd/incorrect-pair form of each underlying rule |
| most precise relation | delegate | CP-001/CP-002 semantic precision review |

Machine-readable decisions and zero-QL enforcement live in:

- `legacy-allocation-boundary.ts`;
- `legacy-allocation-boundary.test.ts`.

The `formerQlRange` fields in that ledger are historical labels only. They are not current allocation claims and must not be interpreted as ownership of `ANA-QL-251..268`.

## 3. Key ownership corrections

### Numeric complexity is not meta-analogy

A formula containing two operations, powers or digit decomposition remains a numeric analogy when one stable formula maps every input to its output. It belongs in the numeric checkpoint whose rule grammar and ambiguity pool can validate it.

### More evidence is not a new solve mode

Two complete examples may be necessary to disambiguate a rule, but the number of examples is part of instance construction and difficulty. `Infer from two examples` cannot own a generic solver independent of the rule being inferred.

### Inversion is presentation

A missing input term may require applying an invertible rule backwards. The underlying authority remains unchanged; a separate CP-009 solver would duplicate ownership.

### Cross-domain conversion is already owned

Number-to-letter and letter-to-number position mappings are pair-local cross-domain relations. Analogy-framed forms belong to CP-007/CP-008 as appropriate. Direct code recovery belongs to Coding-Decoding.

### Semantic precision stays semantic

Closer relation distinctions, hierarchy depth and precise relation labels require better curated datasets and distractors. They do not require an advanced symbolic runtime.

### Conditional branching remains the only legacy candidate

A visible source condition that chooses between two bounded pair-local rules could be a genuine meta-rule. The historical entry supplies no recurring exam fixture, branch predicate, rule whitelist or uniqueness proof. It remains quarantined and receives no QL.

## 4. Result

- historical families reviewed: **12**;
- delegated to existing authorities: **8**;
- presentation-only families: **3**;
- source-required CP-009 candidates: **1**;
- permanent CP-009 QLs admitted: **0**.

Current identity state after the final ANA-001 source-gap closure:

```text
ANA-CP-009 permanent QLs: 0
ANA-CP-010 implemented QLs: ANA-QL-251..268
currently unallocated tail: ANA-QL-269..274
```

Future CP-009 QLs must still be discovered from recurring source evidence and formal option-independent uniqueness proofs. They must not be reconstructed from the old placeholder count or assumed to occupy any historical range.
