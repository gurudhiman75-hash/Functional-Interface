# NUM-CP-009 — Final Source Saturation and Merge/Split Proposal

**Discovery prototypes:** 17 (`PROT-001..017`)  
**Routine source gaps after Wave 03:** 0  
**Proposed permanent authorities:** 12  
**Permanent QLs allocated here:** 0  
**Next free Number System identity:** `NUM-QL-185`

## Proposed authority set

| Proposal | Learner / solver contract | Source prototypes |
|---|---|---|
| `AUTH-PROP-001` | Unit digit of a single power | P001 |
| `AUTH-PROP-002` | Unit digit of a short composed power expression | P002 + P003 |
| `AUTH-PROP-003` | Unit digit of a bounded power tower | P004 |
| `AUTH-PROP-004` | Unit-digit cycle length | P005 |
| `AUTH-PROP-005` | Exponent class set from terminal conditions — one or several classes | P006 + P016 |
| `AUTH-PROP-006` | Bounded exponent count from a terminal condition | P007 |
| `AUTH-PROP-007` | Last two digits of a power expression | P008 + P009 + P015 last-two slice |
| `AUTH-PROP-008` | Last three digits of a power expression | P010 + P011 + P015 last-three slice |
| `AUTH-PROP-009` | Complete bounded exponent set from a terminal condition | P012 |
| `AUTH-PROP-010` | Terminal-digit feasibility — possible / impossible | P013 |
| `AUTH-PROP-011` | Unit digit with a structured exponent | P014 |
| `AUTH-PROP-012` | Unit digit of a long repeated-power sum | P017 |

## Why P015 is split rather than promoted

P015 closes a missing **edge regime**, not a new answer semantic. Its non-coprime states prove that the last-two and last-three authorities remain valid when factors of 2 and 5 create preperiod/stabilisation and exact `00` / `000` blocks.

Therefore:

- P015 `LAST_TWO_DIGITS` states harden `AUTH-PROP-007`;
- P015 `LAST_THREE_DIGITS` states harden `AUTH-PROP-008`;
- P015 does not justify its own permanent QL.

## Merge decisions

### P002 + P003

Both require the same learner contract: resolve several explicitly displayed powered terms to unit-digit residues and combine them under the shown arithmetic operation. Product versus sum/difference is a variation of the composition operator, not a separate final evidence contract.

### P006 + P016

Both invert a terminal condition into exponent congruence classes. P006 proves the one-class case; P016 proves that a composite condition may require several classes. One authority should deliberately own both one-class and multi-class outcomes.

### P008 + P009 + P015(last-two)

The final answer is always a fixed two-digit block modulo 100. Single versus composed expression and coprime versus non-coprime state are solve-mode/edge variations within the same last-two-digit authority.

### P010 + P011 + P015(last-three)

The same reasoning applies modulo 1000 with a fixed three-digit answer block.

## Protected non-merges

1. **P001 vs P014:** structured-exponent work requires a real preprocessing solver (triangular or square-sum total) before cyclicity; merging it into a plain power would hide a material solve topology.
2. **P002/P003 vs P017:** P017 requires whole-cycle block aggregation across a long consecutive power sum, not just resolving a few explicit terms.
3. **P004 vs P014:** power-tower reduction through an outer cycle is different from deriving a closed-form structured exponent.
4. **P005 vs P006/P016:** cycle length and exponent-class recovery have different learner answer semantics.
5. **P006/P016 vs P007 vs P012:** class set, bounded count and complete bounded set are distinct projections and must remain separate.
6. **Last two vs last three:** modulus, fixed-width answer semantic and zero-padding contract differ.
7. **P013 vs P006/P016:** feasibility asks existence/non-existence; exponent-class recovery asks for the complete inverse class set.

## Final source disposition

- routine V2 CP009 families recovered: 6;
- post-Wave02 material gaps closed by Wave03: 3;
- remaining routine source gaps: **0**;
- claim/statement/table and terminal DS: representation adapters/holds unless direct source evidence establishes a new inference contract;
- CRT: solver route only; general CRT remains CP008;
- structured repeated digit block: CP009 adapter when suffix alone matters, CP010 when arbitrary digit construction is essential;
- factorial/product last non-zero digit: CP011 when valuation/trailing-zero structure is primary, CP014 only if valuation and terminal-cycle engines both pass necessity ablation.

## Governance gate

This document proposes **12 permanent CP009 authorities**. It intentionally allocates **no** `NUM-QL-*` identities.

Only after explicit approval of the count and merge/split may the next gate allocate from `NUM-QL-185` onward and construct the permanent English runtime.

All downstream lifecycle remains closed:

```text
questionStudioDiscoverable: false
questionBankWritable:       false
testEligible:               false
publiclyPublishable:        false
```
