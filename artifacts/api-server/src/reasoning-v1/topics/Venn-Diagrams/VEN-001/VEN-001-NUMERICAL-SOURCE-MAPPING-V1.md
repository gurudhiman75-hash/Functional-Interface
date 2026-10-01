# VEN-001 Numerical Source Mapping V1

Date: 2026-10-01

Status: **Library-backed source calibration for VEN-CP005..VEN-CP010**

## Purpose

This record separates three things that must not be conflated:

1. a mathematically valid generator operation;
2. an exam-relevant Venn operation supported by the Examtree source Library;
3. a source-saturated learner pattern with enough evidence to treat its exact presentation as established.

The current VEN numerical runtime remains review-only. This mapping does not remove mathematically valid extensions, but it marks which exact subpatterns still need source evidence.

## Library evidence reviewed

The Examtree Library contains broad exam-tagged Venn material in `reasoning_aggarwal.pdf` and a substantial SSC Mathematics Set Theory/Venn section in `Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf`.

Observed source-backed operations include:

- populated two-set and three-set Venn counting;
- only/both/neither/exact-overlap region reading;
- direct inclusion-exclusion from prose counts;
- percentage-based three-set inclusion-exclusion;
- recovering a missing two-set intersection from union and marginal counts.

Concrete examples include SSC CHSL/CPO/GD/MTS tagged diagram-count questions in the reasoning source and Disha illustrations using:
- a political survey with percentages across three proposals;
- two sets with union 50, marginals 28 and 32, solving the common intersection;
- a class of 35 students with 24 cricket and 16 football, solving the number who like both.

## Checkpoint mapping

| Checkpoint | Subpattern | Source status | Decision |
|---|---|---|---|
| VEN-CP005 | Two-set counts | STRONG_LIBRARY_SUPPORT | retain |
| VEN-CP006 | Three-set counts | STRONG_LIBRARY_SUPPORT | retain |
| VEN-CP007 | percentage-count | STRONG_LIBRARY_SUPPORT | retain |
| VEN-CP007 | percentage-three-count | STRONG_LIBRARY_SUPPORT | retain |
| VEN-CP007 | percentage-total / percentage-three-total | DIRECT_OPERATION_SUPPORT | retain as inverse form; do not call exact presentation source-saturated |
| VEN-CP007 | ratio-two / ratio-three / ratio-given-total | DERIVED_EXTENSION | retain review-only; dedicated source evidence still desirable |
| VEN-CP008 | missing-pair | STRONG_LIBRARY_SUPPORT | retain |
| VEN-CP008 | missing-triple | DIRECT_OPERATION_SUPPORT | retain; exact explicit-x centre form needs stronger direct evidence |
| VEN-CP008 | missing-total / region-equation | DERIVED_EXTENSION | retain review-only as inverse/constraint variants |
| VEN-CP009 | shared caselet counting | STRONG_LIBRARY_SUPPORT at operation level | retain |
| VEN-CP010 | minimum two-set intersection | STRONG_LIBRARY_SUPPORT | direct RRB NTPC 28 Mar 2016 Shift 1 evidence; retain |
| VEN-CP010 | maximum two-set intersection | SOURCE_GAP_OPEN | retain review-only; target-exam evidence still needed |
| VEN-CP010 | minimum/maximum three-set intersection | SOURCE_GAP_OPEN | retain review-only; target-exam evidence still needed |
| VEN-CP010 | minimum/maximum two-/three-set union bounds | SOURCE_GAP_OPEN | retain review-only; target-exam evidence still needed |

## Important conclusion

The earlier broad statement that VEN numerical content lacked source support was incorrect once the Library was included.

The corrected conclusion is narrower:

- **core counting is strongly sourced;**
- **percentage Venn reasoning is sourced;**
- **missing-intersection solving is sourced;**
- **some ratio/inverse/x formulations are derived extensions of sourced mathematics;**
- **the two-set minimum-overlap pattern is now directly sourced from RRB NTPC; the remaining CP010 bound variants remain the clearest open source gap.**

This is a source-calibration distinction, not a correctness defect. Runtime metadata now exposes the status per generated numerical question so Question Studio review can distinguish sourced patterns from controlled extensions.

## Lifecycle

- Question Studio: review-only
- Question Bank write: false
- test/mock eligibility: false
- public publication: false
- CP010 source saturation: open
- learner-data difficulty calibration: later gate
- novelty promotion: later cross-chapter pass


## CP010 source refinement — 2026-10-01

A broader source search located a direct target-exam match for `minimum-intersection-2`:

- **RRB NTPC, 28 March 2016, Shift 1**: 40 students; 28 speak Tamil; 30 speak Telugu; all speak at least one language; asked for the **minimum number who can speak both Tamil and Telugu**.
- The solution is the exact lower-bound relation used by the current two-set CP010 generator: `max(0, n(A)+n(B)-N)`.

This changes only that specific CP010 variant from open-gap to strongly supported.

The following CP010 variants remain open for comparable SSC/Banking/Punjab-state evidence:

- maximum-intersection-2;
- minimum-intersection-3;
- maximum-intersection-3;
- minimum-union-2;
- maximum-union-2;
- minimum-union-3;
- maximum-union-3.

Non-target-exam sources (for example CAT/GMAT-style set-bound questions) demonstrate mathematical legitimacy, but are not used here to claim target-exam saturation.
