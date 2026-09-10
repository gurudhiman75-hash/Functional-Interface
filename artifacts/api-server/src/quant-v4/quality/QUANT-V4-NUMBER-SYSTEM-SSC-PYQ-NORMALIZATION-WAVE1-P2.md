# Quant V4 Number System SSC PYQ Normalization — Wave 1 P2

**Authority:** `QUANT-V4-NUMBER-SYSTEM-SSC-PYQ-NORMALIZATION-WAVE1-P2`

**Source inspected:** `SSC Mathematics Previous Year Solved Paper Number System [sscstudy.com].pdf` from the Examtree project Library.

## Evidence classification

This source is a secondary chapterwise solved-PYQ collection. It is **not** treated as an official SSC paper. The ten retained observations are therefore registered as `VERIFIED_PYQ_COLLECTION`, not `OFFICIAL_PAPER` or `DIRECT_PYQ`.

The collection preserves an SSC CGL Tier-I exam/year attribution for the retained items, but it does not preserve a dependable exact exam date, shift, or official paper identifier. To prevent false paper-count inflation, every Wave-1 observation uses the same unresolved-paper identity and omits `heldDate` and `shift`.

This wave is sufficient to change `NUM-001 / SSC_CGL_TIER_I` from **zero normalized evidence** to **evidence accumulating**. It is not sufficient to calibrate CP/QL weights, difficulty, or representation frequencies.

## Retained fixtures

| ID | Collection attribution | Collection ref | Paraphrased tested invariant | V4 owner | Independent check | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| `NUM-SSC-W1-001` | SSC CGL Tier-I 2010 | Q67 | A repeated two-digit block forms a four-digit number divisible by a fixed factor. | `NUM-CP-003` | `ABAB = 101 × AB`. | retain |
| `NUM-SSC-W1-002` | SSC CGL Tier-I 2010 | Q69 | Difference of fourth powers of odd positive integers has guaranteed divisibility. | `NUM-CP-003` | Odd fourth powers are `1 mod 16`; difference is divisible by 16, hence by listed factor 8. | retain |
| `NUM-SSC-W1-003` | SSC CGL Tier-I 2010 | Q70 | Guaranteed divisor of `n³−n`. | `NUM-CP-003` | `n³−n = n(n−1)(n+1)`, a product of three consecutive integers, hence divisible by 6. | retain |
| `NUM-SSC-W1-004` | SSC CGL Tier-I 2011 | Q46 | Six-digit repeated two-digit block `xyxyxy`. | `NUM-CP-003` | `xyxyxy = 10101 × (10x+y)`. | retain |
| `NUM-SSC-W1-005` | SSC CGL Tier-I 2011 | Q49 | Divisibility of `2^16−1`. | `NUM-CP-003` | `2^16−1 = 255 × 257`; 255 is divisible by 17. | retain |
| `NUM-SSC-W1-006` | SSC CGL Tier-I 2011 | Q52 | Least addition making 9999 divisible by 345. | `NUM-CP-003` | `9999 mod 345 = 339`; least addition is 6. | retain |
| `NUM-SSC-W1-007` | SSC CGL Tier-I 2011 | Q54 | Divisibility of a three-term power sum. | `NUM-CP-003` | `5^71+5^72+5^73 = 5^71(1+5+25) = 31×5^71`, hence divisible by 155. | retain |
| `NUM-SSC-W1-008` | SSC CGL Tier-I 2013 | Q26 | Identify an option divisible by 25. | `NUM-CP-003` | Retained value 303375 ends in 75 and is divisible by 25. | retain |
| `NUM-SSC-W1-009` | SSC CGL Tier-I 2013 | Q30 | Divisibility of the difference between a two-digit number and its reversal. | `NUM-CP-003` | `(10x+y)−(10y+x)=9(x−y)`. | retain |
| `NUM-SSC-W1-010` | SSC CGL Tier-I 2013 | Q31 | HCF of `3^333+1` and `3^334+1`. | `NUM-CP-006` | `B−3A = −2`; both A and B are even, so gcd is 2. | retain |

## Deliberate exclusions

Items attributed only to generic `SSC CGL` without Tier-I/Tier-II identity are not normalized into `SSC_CGL_TIER_I`. Items belonging to CPO, MTS, CISF, Constable, FCI or other exam families are also excluded because those exam IDs are outside this specialized-profile checkpoint. Remainder-transformation and terminal-digit questions owned by `NUM-002` are excluded from the `NUM-001` sample even when they have usable SSC CGL Tier-I attribution.

The source also contains questions whose chapter heading says Number System but whose actual inference belongs to Algebra, Average or other arithmetic chapters. Those are not counted for `NUM-001` merely because they appear in the collection.

## Current evidence shape

Wave 1 contains **10 normalized countable observations**:

- 9 owned by `NUM-CP-003`;
- 1 owned by `NUM-CP-006`;
- 0 across `NUM-CP-001`, `002`, `004`, and `005`;
- exact paper/date/shift identity unresolved for all 10.

This is visibly too narrow to infer a package-wide SSC selection distribution. The sample is also strongly concentrated in divisibility because this first wave deliberately chose the cleanest, explicitly Tier-I-attributed fixtures rather than maximizing count.

## Runtime decision

`NUM-001 / SSC_CGL_TIER_I` must expose:

- `selectionStatus: EVIDENCE_ACCUMULATING_SELECTION_PENDING`;
- `profileSelectionCalibrated: false`;
- `deliveryAllowed: true`;
- `normalizedCountableObservationCount: 10`;
- no `NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE` blocker;
- blockers for insufficient calibration breadth, unproven CP/QL distribution, uncalibrated difficulty/representation, and incomplete dated paper identity.

No CP weight, QL weight, difficulty weight, or representation weight is promoted by this wave.

## Next source wave

The next useful step is to recover additional **explicitly Tier-I-attributed** fixtures for `NUM-CP-001`, `002`, `004`, `005`, and `006`, while preserving the collection's actual provenance limits. If stronger source material supplies exact dates/shifts/paper identities, those observations should supersede the unresolved collection identity rather than retroactively inventing it here.
