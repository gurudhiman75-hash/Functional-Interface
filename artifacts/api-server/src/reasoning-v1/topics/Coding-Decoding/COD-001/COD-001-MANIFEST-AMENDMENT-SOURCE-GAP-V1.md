# COD-001 Manifest Amendment — Source-Gap V1

Status: **authoritative permanent identity allocation for the approved source-gap discovery freeze**.

This amendment operates under `cod-001-open-ql-discovery-amendment.md` and `COD-001-SOURCE-GAP-DISCOVERY-FREEZE-V1.md`.

It allocates four late-discovered English solve contracts after the previously closed `COD-QL-001..199` range. It does not restore any revoked legacy reservation.

## Permanent allocation

| QL ID | Owner checkpoint | Solve contract | Rule family | English maturity |
|---|---|---|---|---|
| `COD-QL-200` | `COD-CP-005` | infer alphabetical ascending sort and encode target | `ALPHABETICAL_ASCENDING_SORT` | runtime-proof |
| `COD-QL-201` | `COD-CP-006` | infer indexed shifts then reverse and encode target | `INDEXED_SHIFT_THEN_REVERSE` | runtime-proof |
| `COD-QL-202` | `COD-CP-006` | infer reverse then uniform shift and encode target | `REVERSE_THEN_UNIFORM_SHIFT` | runtime-proof |
| `COD-QL-203` | `COD-CP-007` | infer mixed vowel/consonant class coding and encode target | `MIXED_CLASS_CODE` | runtime-proof |

## Generated-instance properties, not new QLs

The following remain parameters or generated properties of the four contracts:

- evidence words and target word;
- target length;
- answer position;
- stem wording;
- difficulty;
- indexed-shift base and direction;
- uniform-shift sign and magnitude;
- mixed-class mapping variant;
- repeated-letter burden, wraparound and class-switch count;
- misconception distractor selection.

## Identity effect

- stable English COD-001 range becomes `COD-QL-001..203`;
- English permanent QL count becomes **203**;
- `COD-CP-005` gains `COD-QL-200` and has 25 permanent English QLs;
- `COD-CP-006` gains `COD-QL-201..202` and has 34 permanent English QLs;
- `COD-CP-007` gains `COD-QL-203` and has 5 permanent English QLs;
- all other checkpoint allocations remain unchanged;
- `COD-QL-204` is not reserved or automatically available;
- the revoked legacy total of 260 remains revoked.

Because these are late evidence-led discoveries, checkpoint ownership is no longer represented only by one contiguous numeric interval. The canonical authority is the explicit contract registry plus this amendment.

## Explicit non-allocations

This amendment does not create identities for:

- inverse decoding;
- missing-token recovery;
- choose-matching-code as a separate solve contract;
- explicit-rule forward application;
- rule naming/classification;
- the two mixed-class mapping contexts as separate QLs;
- parameter, difficulty or renderer variants.

## Release boundary

`COD-QL-200..203` are permanent after merge but remain English review-only:

- Question Studio visibility: false;
- public publishability: false;
- Question Bank and mock-test eligibility: disabled;
- Hindi/Punjabi: not yet implemented for these identities.

The existing multilingual closure at `COD-QL-001..199` remains valid for the older range and is not falsely extended by this amendment.
