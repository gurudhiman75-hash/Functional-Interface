# PRT-001 E8 — Source/PYQ Saturation and Exam-Realness Audit

## Verdict

The E1-E5 solve-contract expansion is substantially aligned with observed SSC, Banking, Punjab-state and comparable state-exam Partnership questions. The E8 source sweep did **not** identify a new core capital-time mathematical authority that requires a 100th solve mode.

It did identify two exam-facing production gaps that were not represented strongly enough in the 103-QL runtime:

1. **reverse total profit after a fixed gross-profit split**, where one percentage is shared equally and the remainder is distributed by capital ratio;
2. **multi-year dynamic-capital timelines**, especially three-partner withdrawal cases running for 2–4 years rather than the dominant 12-month surface.

E8 therefore adds two source-backed QLs while reusing generalized existing authorities:

- `PRT-QL-104` → `findTotalProfitFromShareDifferenceAndCapitals`
- `PRT-QL-105` → `findShareAfterCapitalWithdrawal`

Resulting intended runtime: **105 active QLs / 99 solve modes**.

## Reviewed source families

| Source | Observed pattern | PRT disposition |
|---|---|---|
| PSSSB Excise Inspector, 21 May 2023 | ₹125k/₹85k; 60% profit shared equally, 40% by capital; receipt difference → total profit | **E8 exposed as QL-104** using generalized reverse-total authority |
| Punjab Police Constable, 7 Jun 2025 Shift 1 | one partner withdraws, another adds capital, third joins later, then direct share/difference | Covered by dynamic/multi-partner authorities |
| SSC CGL 2025, 16 Sep Shift 3 | late join + capital addition + early leave → profit ratio | Covered by CP007 compound authority |
| SSC CHSL 2025, 14 Nov Shift 1 | 3-year partnership; one withdrawal after year 1; three partners → share | **E8 exposed as QL-105** and long-duration pools widened |
| SSC CHSL Tier-II 2024, 18 Nov | unequal durations + working-partner 20% gross remuneration → another partner's share | Covered by CP006/CP007 remuneration authorities |
| OSSSC Forester/Forest Guard/Excise Constable, 16 Apr 2026 Shift 3 | working partner 20% gross; final-receipt difference → reverse total profit | Covered by reverse remuneration authorities |
| SBI Clerk Prelims memory, 22 Jun 2019 | capital relation + late third partner + known share → another share | Covered by generalized relational/staggered authorities |
| PSSSB Clerk, 6 Aug 2023 | simple same-period capitals + total profit → partner share | Covered by CP001 |
| DSSSB MTS, 8 Mar 2026 Shift 2 | same unknown `x` drives C's late join and B's early leave; stated 3-partner ratio | Covered by generalized join/leave inverse authorities |
| Punjab Police Constable, 6 Aug 2023 Shift 2 | full-period, early-leave and late-join partners produce equal effective weights | Covered by staggered/equal-profit authorities |
| SSC Selection Post 2025, 26 Jul Shift 3 | interest on individual capital before residual profit distribution | **Delegated to Interest** per chapter ownership boundary |
| Punjab Patwari, 24 Jan 2016 | admission of a new accounting partner/new profit-sharing ratio | **Excluded accounting/reconstitution**, not aptitude Partnership capital-time |

Canonical source URLs and mappings are machine-readable in `source-provenance.e8.json`.

## Source-driven runtime changes

### QL-104 — reverse split-allocation total profit

Source topology: a fixed percentage of gross profit is shared equally; the balance is divided in the capital ratio; the final receipt difference is known; total profit is requested.

This does not need a new solve mode. The equal component cancels from the receipt difference, so E8 generalizes the existing reverse-total-from-share-difference authority over a pre-distribution split. Independent verification reconstructs gross profit from the observed receipt difference, effective-weight difference and residual percentage rather than reading the hidden generated gross value.

The source-like state includes the exact PSSSB pattern: capitals ₹1,25,000 and ₹85,000, 60% equal / 40% capital-ratio split, with a ₹3,000 final-receipt difference leading to total profit ₹39,375.

### QL-105 — multi-year withdrawal share

Source topology: three partners, a 3-year horizon, one partner withdraws part of capital after year 1, and a partner share is requested.

The capital timeline engine already supports arbitrary rational boundaries, so E8 reuses `findShareAfterCapitalWithdrawal` and adds curated 24-, 30-, 36- and 48-month states. This closes the previous production bias toward annual/12-month wording without creating duplicate mathematics.

### Baseline duration pool

`variable-ranges.library.json` is widened to include source-real duration values above one year, with a configured maximum of at least 36 months for general CP002 generation in addition to QL-105's dedicated 48-month topology.

## Ownership decisions retained

### Interest on capital

Observed SSC Selection Post questions can award interest on each partner's capital before the residual profit is shared. This is not silently absorbed into PRT-001. It remains a cross-chapter routing requirement for the **Interest** chapter, consistent with the original PRT design ownership boundary.

### Accounting partnership reconstitution

Questions about admission of a partner, sacrifice ratio and new accounting profit-sharing ratio are not capital-time aptitude Partnership. Punjab Patwari evidence confirms this adjacent family exists in target exams, but it remains explicitly excluded/delegated rather than contaminating PRT-001.

## What E8 proves / does not prove

E8 is intended to prove that the chapter's mathematical surface is source-saturated against the reviewed Partnership families and that the two remaining exam-facing scenario gaps are executable, localized and audited.

E8 does **not** constitute final chapter publication freeze. Remaining gates after E8 are:

1. legacy `RAP-003` Partnership ownership/de-duplication;
2. human English editorial review, including E7's six non-blocking similarity pairs;
3. human Hindi/Punjabi editorial parity against the final English surface;
4. final corpus/release rerun after those ownership/editorial changes.
