# RNK-001 — Book-to-QL Ownership Audit

Status: **ownership audit complete; no new permanent QL allocated**  
Audit date: **2026-08-08**  
Audit base: `8aac456d79d9b5b9c7487dd0b69168ae89a4b0b9`

## 1. References examined

### Primary reference

**A New Approach to Reasoning for Competitions**, Preeti Aggarwal and Tanvy Aggarwal, Radian Book Company, first edition 2022.

The contents separate:

```text
Chapter 12  Ranking
Chapter 13  Seating Arrangement
Chapter 14  Puzzles
```

The Ranking chapter covers comparison ranking, top/bottom and left/right rank arithmetic, people between, mixed-end totals, minimum/maximum totals, interchange, movement and related inverses.

The Seating Arrangement chapter separately owns immediate left/right, adjacency, neighbours, extreme ends and complete row reconstruction.

### Secondary reference

**Verbal & Non-Verbal Reasoning for Competitive Exams with Practice Sets**, Gajendra Kumar and Abhishek Banerjee, Disha Publication.

Its contents place clue-led caselets under:

```text
Linear Arrangement
Matrix Arrangement
Circular Arrangement
```

The linear-arrangement material uses immediate left/right, neighbours, extreme ends and full arrangement reconstruction. Shared directions followed by several linked questions are treated as an arrangement delivery format, not as a new ranking formula.

## 2. Book family to existing QL mapping

| Reference-book family | Existing ownership | Coverage verdict |
|---|---|---|
| Rank from the opposite end when total is known | `RNK-QL-001` | Covered |
| Total from one person's top and bottom ranks | `RNK-QL-002` | Covered |
| People before/after from a known rank | `RNK-QL-003..006` | Covered |
| Exact middle rank and odd total inverses | `RNK-QL-007..009` | Covered |
| People between two known positions | `RNK-QL-010` | Covered |
| Difference between two ranks | `RNK-QL-011` | Covered |
| Recover one person's rank from another person's rank and separation | `RNK-QL-012` | Covered |
| Compare two normalized positions | `RNK-QL-013` | Covered |
| Total from mixed-end ranks when relative order is known | `RNK-QL-014` | Covered |
| Minimum or maximum total when relative order is unknown | `RNK-QL-015` | Covered |
| Decide exact total versus indeterminate total | `RNK-QL-016` | Covered |
| Test whether a proposed total is possible for an order | `RNK-QL-017` | Covered |
| Direct or inverse interchange of two ranks | `RNK-QL-018` | Covered |
| Total inferred from interchange and changed rank | `RNK-QL-019` | Covered |
| Rank before or after one movement | `RNK-QL-020` | Covered |
| People passed from rank change | `RNK-QL-021` | Covered |
| Rank after insertion or removal | `RNK-QL-022..023` | Covered |
| Sequential moves and another person's movement effect | `RNK-QL-024..025` | Covered |
| Movement combined with membership change | `RNK-QL-026` | Covered |
| Highest/lowest from comparison statements | `RNK-QL-027` | Covered |
| Person at an exact or middle position after comparison reconstruction | `RNK-QL-028` | Covered |
| Rank of a named person after reconstruction | `RNK-QL-029` | Covered |
| Complete strict order from comparisons | `RNK-QL-030` | Covered |
| Relative order of a named pair | `RNK-QL-031` | Covered |
| Exact pair rank difference after reconstruction | `RNK-QL-032` | Covered |
| Immediate neighbour in a strict rank order | `RNK-QL-033` | Covered inside ranking order; geometric left/right adjacency remains Seating Arrangement |
| Definitely true relation under one strict order | `RNK-QL-034` | Covered |
| Missing comparison required to make a strict order unique | `RNK-QL-035` | Covered |

## 3. Genuine remaining ranking gap

The primary book explicitly demonstrates comparison sets in which two entities remain incomparable. The final result may establish some ranks or relations while leaving another pair unresolved.

This is not a complete-order question and must not be forced into CP-004. It requires a partial-order solver that can reason across all valid orders.

Candidate query contracts for the next discovery checkpoint are:

```text
DEFINITELY_TRUE
DEFINITELY_FALSE
POSSIBLE
IMPOSSIBLE
CANNOT_BE_DETERMINED
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
UNIQUE_OR_MULTIPLE_ORDERS
```

These are discovery candidates only. They do not receive permanent QL IDs until executable prototypes, source evidence, ambiguity proof, editorial review and merge/split audit are complete.

## 4. Ownership corrections

### Shared passages

A shared passage is an assembly and presentation capability:

```text
one evidence block
  -> several questions
```

It does not create a new mathematical or reasoning authority. Existing CP-001 through CP-004 authorities may later be assembled into shared sets without receiving duplicate QLs.

### Row and queue language

Top/bottom, left/right and front/back are direction vocabularies. Rank arithmetic in a row or queue remains Ranking. Clue-heavy placement using immediate left/right, facing, neighbours and extreme seats belongs to Seating Arrangement.

### Attribute words

Tallest, shortest, oldest, youngest, highest marks and best performance are valid surface contexts for CP-004 when the burden is only strict comparison ranking.

They do not justify a separate checkpoint by themselves. When age, marks, speed or score arithmetic is the decisive burden, ownership moves to the relevant Quant or puzzle chapter.

### Shared arrangement caselets

Linear, circular, floor and matrix caselets remain Arrangement/Puzzles even when questions ask who is first, last or between two people. The decisive burden is constructing positions from adjacency and placement clues.

## 5. CP-005 reset decision

The proposed `presentation-led and shared ranking sets` checkpoint is rejected.

```text
RNK-QL-036..043: not allocated
CP-005 permanent runtime: none
CP-005 projection: none
Question Studio registration: none
```

The next checkpoint is reset to:

```text
RNK-CP-005 — Partial Order and Ranking Uncertainty
```

Its first task is ownership discovery, not permanent generation.

## 6. Revised later-checkpoint roadmap

| Checkpoint | Revised role |
|---|---|
| `RNK-CP-005` | partial order, definite/possible/impossible, cannot determine, uniqueness and possible-rank bounds |
| `RNK-CP-006` | non-strict or tied-ranking source audit only; no implementation without strong exam evidence |
| `RNK-CP-007` | advanced mixed ranking transformations only after gap audit |
| `RNK-CP-008` | reserved; shared-set assembly is infrastructure, not an authority checkpoint |

## 7. Final audit verdict

`RNK-QL-001..035` already cover the standard strict-ranking families found in the reviewed books.

The next meaningful work is partial-order uncertainty. Creating another checkpoint from tables, ledgers, shared passages, row wording or attribute vocabulary would duplicate existing logic or cross into Seating Arrangement.

## 8. Lifecycle

```text
cumulative permanent range: RNK-QL-001..035
next available identity:    RNK-QL-036
CP-005 QLs allocated:       0
Question Studio:            DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
Hindi/Punjabi:              NOT_STARTED
```
