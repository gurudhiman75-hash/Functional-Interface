# MIS-001 Target-Exam Source Crosswalk V6

Status: **ROOT-EXTRACTION GAPS ADDED; SATURATION IMPROVING BUT NOT YET REACHED**

## 1. Reconfirmation evidence

Newly sampled SSC papers continue to map cleanly to existing authorities:

- SSC GD 6 Mar 2019 Shift 3: product relation in a circular/sector figure -> existing PRODUCT authority with renderer/role mapping.
- SSC CHSL 24 Jan 2017 Morning Shift: cube of pair sum -> existing PAIR_SUM_OR_DIFFERENCE_CUBE authority.
- SSC CGL 27 Aug 2016 Morning Shift: direct cube progression inside a figure -> existing cube authority.
- Punjab-state searches continue to return many ordinary missing-number series questions, which remain owned by Series rather than MIS-001.

These are positive saturation signals because newly sampled questions do not require new semantic families.

## 2. Source-backed root-extraction gaps — CP020

### MIS-CAND-101 — square root of pair product

Source:
- SSC CHSL 7 Jan 2017 Evening Shift.

Observed relation:

- `√(25×144) = 60`
- `√(81×225) = 135`
- `√(49×289) = 119`

Normalized rule:

`result = √(a×b)`

Decision:
- add a distinct root-extraction authority;
- generator uses exact perfect-square inputs only;
- no decimal or rounded roots.

### MIS-CAND-102 — difference of square roots

Source:
- SSC CHSL 25 Jan 2017 Evening Shift.

Observed relation:

- `√9 − √4 = 1`
- `√36 − √25 = 1`
- `√144 − √81 = 3`

Normalized rule:

`result = √a − √b`

Decision:
- add a distinct authority;
- both displayed values must be exact perfect squares;
- positive integer outputs only.

### MIS-CAND-103 — sum of cube roots

Source:
- SSC GD 9 Mar 2019 Shift 2.

Observed relation:

- `∛27 + ∛64 = 3 + 4 = 7`
- `∛343 + ∛729 = 7 + 9 = 16`

Normalized rule:

`result = ∛a + ∛b`

Decision:
- add a distinct root-extraction authority;
- displayed values must be exact perfect cubes;
- no approximation.

## 3. Boundary calibration

### Punjab-state

Current paper-backed positive MIS evidence remains:
- PSPCL missing-corner repeated-square form.

Many additional Punjab Police / PSPCL searches continue to resolve to ordinary number series. These stay in Series.

### Banking

Searches continue to show that the phrase "missing number" in SBI/IBPS contexts is overwhelmingly used for Number Series under Quant/Numerical Ability.

Decision:
- keep MIS-001 available for any future paper-backed repeated-group figure question;
- do not create Banking-specific MIS families without evidence.

## 4. Source-thin items

Still source-thin:
- SMALL_FACTORIAL;
- MIS-CAND-095 `a+4b+1`.

No additional target-exam recurrence was found in this wave, so neither should be promoted to a permanent QL yet.

## 5. Inventory after V6

- runtime patterns: **103**
- canonical semantic authorities: **68**
- aliases / reuse-only variants: **35**
- permanent QLs: **0**
- source saturation: **false**

## 6. Saturation assessment

V6 produced both:
- multiple reconfirmations of existing authorities;
- three genuinely new root-extraction authorities.

Therefore the chapter is closer to saturation, but not ready to freeze.

## 7. Next wave

V7 should prioritize:
1. another broad SSC sample, especially older CHSL/CGL/GD figure questions;
2. additional Punjab-state figure/repeated-group papers;
3. recurrence of root-extraction authorities;
4. factorial-derived forms;
5. source-thin MIS-CAND-095 recurrence;
6. any new inverse-input forms;
7. merge/split review if new examples differ only by constant, sign, renderer or blank position.

Permanent QL allocation remains blocked.
