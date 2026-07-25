# ANA-001 Manifest Amendment — CP-006 Coverage Expansion

Status: **authoritative for unimplemented QLs from ANA-QL-161 onward**.

This amendment corrects a source-backed coverage gap discovered before ANA-CP-006 implementation. It does not modify any implemented QL from `ANA-QL-001` through `ANA-QL-160`.

## Why an amendment is required

The audited ANA-001 manifest assigned 40 QLs to ANA-CP-006: 20 letter-cluster rule families with direct-completion and pair-selection forms. A comparison against SSC/RRB/DSSSB alphabet-analogy material showed four recurring, independently solvable families that were not owned by that allocation:

1. exchange the two equal outer blocks while preserving their internal order;
2. reverse each half or outer block independently;
3. regroup letters by odd/even source positions;
4. arrange the letters alphabetically.

Representative source patterns include:

- `GLIDERS → ERSDGLI`: exchange the outer three-letter blocks around the centre;
- `ACTION → TCANOI`, `THUNDER → UHTNRED`, `ABSORPTION → ROSBANOITP`: reverse each half/outer block;
- `NUMERAL → UEALRMN`: a parity-based positional regrouping;
- `INTEX → EINTX`, `Flora → Aflor`: alphabetic ordering.

These are not safely reducible to rotation, whole reversal, adjacent-pair exchange, first/last exchange, or an unrestricted “mixed” bucket. Treating them as arbitrary mixed rules would weaken ambiguity checking and hide distinct exam-solving strategies.

## Revised checkpoint allocation

| Checkpoint | Previous count/range | Revised count/range | Status |
|---|---:|---:|---|
| ANA-CP-001 | 36 / `001..036` | unchanged | implemented |
| ANA-CP-002 | 24 / `037..060` | unchanged | implemented |
| ANA-CP-003 | 48 / `061..108` | unchanged | implemented |
| ANA-CP-004 | 32 / `109..140` | unchanged | implemented |
| ANA-CP-005 | 20 / `141..160` | unchanged | implemented |
| ANA-CP-006 | 40 / `161..200` | **48 / `161..208`** | amended before implementation |
| ANA-CP-007 | 20 / `201..220` | **20 / `209..228`** | unimplemented IDs shifted |
| ANA-CP-008 | 16 / `221..236` | **16 / `229..244`** | unimplemented IDs shifted |
| ANA-CP-009 | 24 / `237..260` | **24 / `245..268`** | unimplemented IDs shifted |

Revised chapter total: **268 QLs**.

No permanent merged QL ID is reassigned. The architecture rule prohibiting silent reassignment remains satisfied because the shifted QLs had not been implemented or merged.

## Added CP-006 families

| Revised QLs | Rule family | Presentation modes |
|---|---|---|
| `ANA-QL-201/202` | `CLUSTER_HALF_BLOCK_SWAP` | direct completion / pair selection |
| `ANA-QL-203/204` | `CLUSTER_REVERSE_EACH_BLOCK` | direct completion / pair selection |
| `ANA-QL-205/206` | `CLUSTER_PARITY_REGROUP` | direct completion / pair selection |
| `ANA-QL-207/208` | `CLUSTER_ALPHABETICAL_SORT` | direct completion / pair selection |

## Exhaustiveness boundary

ANA-CP-006 owns deterministic, language-neutral transformations over arbitrary uppercase English letter clusters. It includes:

- per-letter alphabet transforms;
- position-dependent transforms;
- named order/permutation schemas;
- bounded insertion, deletion and expansion;
- whitelisted two-stage compositions.

It excludes:

- semantic word relationships;
- transformations whose validity depends on a meaningful English/Hindi/Punjabi word;
- unrestricted arbitrary permutations chosen only because they fit one example;
- free-form substitution maps;
- figure analogy;
- series continuation.

A new family may be added only when source evidence shows a recurring exam pattern that cannot be represented by one named existing schema or a whitelisted two-stage composition.

## Collision correction required during implementation

`CLUSTER_REVERSE_THEN_SHIFT` and `CLUSTER_SHIFT_THEN_REVERSE` are identical when “shift” means one uniform character shift. Their operational definitions must therefore use the same **non-palindromic position-shift vector** in different operation orders:

- reverse first, then apply the vector to the new positions;
- apply the vector to original positions, then reverse.

Uniform shifts are prohibited for these two composite families.

## Governance

This amendment is the source of truth for ANA-CP-006 and all later unimplemented ANA-001 QL ranges. Any machine-readable chapter manifest introduced into the repository must reproduce this allocation exactly.