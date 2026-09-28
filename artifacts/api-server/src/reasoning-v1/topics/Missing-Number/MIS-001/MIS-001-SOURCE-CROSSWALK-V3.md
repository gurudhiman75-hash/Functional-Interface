# MIS-001 Target-Exam Source Crosswalk V3

Status: **PUNJAB-STATE POSITIVE EVIDENCE ADDED; NOT SATURATED**

## 1. PSPCL LDC previous-paper evidence

Source:
- PSPCL LDC Previous Paper 12
- Held 4 Jan 2020, Shift 2
- Repeated square figures

Observed rule:

- first square: `11 + 14 + 8 + 7 = 40`
- second square: `6 + 6 + 12 + 16 = 40`
- third square: `11 + 14 + ? + 11 = 40`
- therefore `? = 4`

## 2. Semantic decision

This does **not** create a new arithmetic authority.

The underlying semantic relation is still the existing four-corner sum authority:

`SUM_FOUR_CORNERS` → canonical `MIS-CAND-050`

What is new is the exam presentation:

- the common sum is inferred from completed figures;
- the result is not shown as a centre value;
- a corner is missing;
- solving therefore uses inverse reasoning.

Decision:

- add runtime/source variant **MIS-CAND-086**;
- canonical authority remains **MIS-CAND-050**;
- disposition: inverse/missing-position variant;
- no new permanent QL identity.

## 3. Runtime implementation

CP014 now supports:

- three repeated four-corner squares;
- two complete evidence figures;
- one target figure with one missing corner;
- all four corner positions as possible blank locations;
- independent inverse solver;
- misconception-driven options;
- source-backed review metadata;
- clean square SVG with no artificial centre number.

## 4. Inventory after V3

- runtime patterns: **86**
- canonical semantic authorities: **52**
- aliases / reuse variants: **34**
- new semantic authorities from source audit so far: **2** (CP013)
- new source-backed query variants: **1** (CP014)
- permanent QLs: **0**

## 5. Punjab-state evidence status

Punjab-state coverage has moved from boundary-only evidence to **positive Missing Number figure evidence**.

Confirmed:
- PSPCL repeated-square invariant-sum / missing-corner form.

Still needed:
- more PSSSB/Punjab Police/other Punjab-state repeated-group figures;
- frequency evidence across papers;
- digit/inverse/pair-product examples with identifiable provenance.

## 6. Banking status

Still not saturated.

Banking searches remain dominated by Number Series when using the phrase "missing number". Generic banking puzzle-practice sources exist, but they are not strong enough to freeze MIS-001 authority coverage without previous-paper provenance.

## 7. Next source wave

Crosswalk V4 should prioritize:

1. additional Punjab-state paper-backed figure forms;
2. Banking previous-paper repeated-group/figure forms;
3. SSC source frequency for the two CP013 authorities;
4. source-thin SMALL_FACTORIAL;
5. digit-property and inverse-input forms.

No permanent QL allocation yet.
