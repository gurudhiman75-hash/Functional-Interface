# MAL-CP-006 Wave 04 — Within-Identity Generalisation and Permanent-Allocation Proposal

## Scope

Wave 04 closes the two generalisation gaps identified by the Wave 03 merge/split analysis **without creating new learner identities**:

1. `MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO` now has an asymmetric form where the first transfer is known and the return quantity is a different unknown;
2. `MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO` now has a longer three-leg alternating transfer form where every later transfer samples the source vessel's changed composition.

The approved Wave 01/Wave 02 learner authorities remain regression authorities. These Wave 04 variants extend the existing identities rather than replacing their approved forms.

## Generalisation policy

The identity does **not** split merely because:

- the out-and-back transfer amounts are equal in one question and unequal in another;
- a forward transfer-return question has two legs in one state and three alternating legs in another;
- different liquids or container nouns are used.

A new QL would require a material change in learner task direction, requested unknown, answer semantic or decisive state transition. Wave 03 already proved those identity boundaries.

## Source-backed closure

### Asymmetric inverse return

Supporting source authority: `BANK-MAINS-2021-GENERAL-INVERSE-RETURN`.

Contract:

```text
known first transfer changes B
→ unknown quantity returns from current B
→ target final ratio in A determines the return amount
```

The calculation remains linear in the unknown return quantity. It is therefore a generalisation of the existing inverse transfer-return identity, not a new QL.

### Longer alternating forward transfer-return

Direct source authority: `CAT-2022-S2-Q61-TWO-CONTAINER-ROUND-TRIP`.

Contract:

```text
A → B
→ current B → A
→ current A → B
→ ask final composition/ratio in B
```

The source-faithful half-current-source witness reduces to the known final ratio `5:6`.

## Learner-surface policy

Wave 04 keeps the previously approved editorial direction:

- ordinary exam English;
- calculation-first explanations;
- explicit use of the changed source composition;
- no internal ledger terminology in learner text;
- no arrow shorthand in learner-facing questions;
- no random numerical distractors;
- 8 stem structures per extension variant;
- canonical liquid-library object contexts through the approved Wave 02 allowlist;
- context-compatible use of vessel/container/tank/drum;
- alligation cross remains non-core for CP006.

## Permanent-allocation proposal — NOT YET ALLOCATED

The repository currently contains no `MAL-QL-061` identity, and the released CP005 range ends at `MAL-QL-060`. Subject to explicit approval and a final collision recheck immediately before allocation, the proposed CP006 permanent range is:

| Proposed QL | Proposed solve mode | Existing retained learner identity | Learner contract |
|---|---|---|---|
| `MAL-QL-061` | `MAL-CP006-SM-001` | `MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO` | Forward sequential transfer/return, including longer alternating forms, → final within-vessel component ratio |
| `MAL-QL-062` | `MAL-CP006-SM-002` | `MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS` | Simultaneous equal exchange → transfer quantity required for equal final concentrations |
| `MAL-QL-063` | `MAL-CP006-SM-003` | `MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION` | Three-vessel current-source cycle → final concentration in selected vessel |
| `MAL-QL-064` | `MAL-CP006-SM-004` | `MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO` | Transfer → pure refill of source → retransfer → destination component ratio |
| `MAL-QL-065` | `MAL-CP006-SM-005` | `MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO` | Sequential round trip → ratio between component amounts located in different final vessels |
| `MAL-QL-066` | `MAL-CP006-SM-006` | `MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO` | Sequential transfer-return, equal or asymmetric quantities → infer transfer quantity from target final ratio |
| `MAL-QL-067` | `MAL-CP006-SM-007` | `MAL-CP006-PROT-CHANGED-SOURCE-CHAIN-REMAINING-COMPONENT` | Linear A→B→C changed-source chain → infer hidden scale and find remaining component quantity |

### Shared mathematical engines

Seven learner identities do not require seven unrelated solvers.

Proposed shared mathematical cores:

1. `STAGED_VESSEL_LEDGER` — transfer, current-composition sampling and optional refill; serves QLs 061, 063, 064, 065, 066 and 067.
2. `SIMULTANEOUS_EQUAL_EXCHANGE` — serves QL 062.

The QL boundary is learner-contract based; the engine boundary is mathematical.

## Held boundary

`MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE` remains outside the proposed CP006 allocation.

If equal final concentrations are already guaranteed, the common concentration is the aggregate weighted concentration and the exchange quantity is irrelevant to the requested answer. It remains a CP001 weighted-blend equivalent.

## Lifecycle boundary

This document is a **proposal only**. No permanent identity is created by this file.

Current required state remains:

```text
permanent QLs:               0
permanent solve modes:       0
Question Studio discovery:   false
Question Bank writes:        false
test/mock eligibility:       false
public publication:          false
language:                    English only
Hindi/Punjabi:               not authorized
```

Explicit approval is required before writing permanent `MAL-QL-061..067` allocation entries. Allocation and later delivery activation remain separate gates.
