# PRT-001 E13 post-freeze exhaustiveness audit

**Audit status:** COMPLETE — EXHAUSTIVENESS REOPENED  
**Audit baseline:** E12 final cleaned head `17d4b0f83b96ca98e13dc59fb0dc643e0a498225`  
**Baseline runtime:** 7 CPs / 99 solve modes / 105 active QLs per locale / EN-HI-PA  
**Purpose:** test open-world exam exhaustiveness after the accepted 102-candidate design ledger and E12 automated freeze had closed.

## Executive verdict

E12 remains a valid validation result for the surface and source families that its permanent gates actually covered. The E13 source sweep shows, however, that **closing the original 102-candidate ledger did not prove open-world exam exhaustiveness**. Fresh official/PYQ evidence exposes material Partnership families that were not present in that original candidate universe, plus two target-exam ownership boundaries whose current delegation does not actually provide product coverage.

Therefore:

- the current 99-mode / 105-QL runtime remains internally validated and must not be discarded;
- the **chapter-level technical exhaustiveness freeze is reopened**;
- previously granted product/publication approval is recorded as satisfied, but publication must remain technically blocked until the E13 gaps are resolved and the full freeze chain is rerun;
- no existing runtime or audit threshold is weakened by this finding.

## Audit method

The audit reconciled five evidence layers:

1. the accepted 102-candidate Partnership solve-mode ledger and its E1-E5 closure;
2. all 105 active Question Studio QLs and the current typed capital-timeline/allocation state model;
3. E8 source provenance and E9 ownership boundaries;
4. neighbouring `INT-001` / Ratio & Proportion ownership evidence, to test whether delegated source families are truly covered elsewhere;
5. a fresh adversarial source sweep across SSC, Banking, Punjab Police, state CGL/police, defence and comparable aptitude papers, prioritising official-paper-tagged previous-year questions and 2024-2026 evidence while retaining older SSC evidence when it demonstrates a distinct topology.

A source pattern is classified as a new authority only when the current state/solver cannot truthfully represent the mathematics. If the solver can already execute the mathematics but Question Studio cannot author/seed-reach the source topology, it is classified as an exposure/generalisation gap. If a source is deliberately delegated but no neighbouring chapter actually produces the mixed contract, it is classified as an ownership-routing gap rather than silently counted as covered.

## Baseline that remains valid

The current runtime still has:

- 99 unique solve modes;
- 105 active QLs per locale;
- CP distribution `13 / 14 / 16 / 19 / 14 / 17 / 12`;
- 3 authored, seed-reachable stem skeletons per QL per locale;
- exact rational arithmetic and independent verification;
- 10 partner-pair and 12 business-context object pools;
- E9 sole product ownership by `PRT-001` with legacy `RAP-CP-013` retired from product generation;
- E10 English and E11 Hindi/Punjabi editorial gates;
- E12 full 3,150-question corpus and complete freeze audit pass.

Those facts show strong depth **inside the implemented universe**. They do not erase the newly discovered source families below.

## Disposition ledger

| ID | Source-backed family | Current disposition | Why |
|---|---|---|---|
| E13-G01 | Sleeping partner receives a fractional entitlement of the normal capital-based share | **NEW AUTHORITY** | Current `Partner` state has role + capital segments but no truthful partner-specific profit-weight/share multiplier; allocation is solely by effective capital. |
| E13-G02 | A partner reinvests a computed first-year profit share as capital for the next period | **NEW AUTHORITY** | Requires two-stage endogenous state transition: first-period distribution -> computed reinvestment -> next-period capital -> next-period ratio. Current modes only consume stated capital histories. |
| E13-G03 | Two or more partners each receive separate gross-profit percentages before residual capital-ratio sharing | **EXPOSE / GENERALISE** | Allocation engine already supports multiple recipient gross allocations, but no active authored QL seed-reaches this topology; QL-040 is reserve -> one post-pool commission. |
| E13-G04 | Partners invest fractions of total capital for fractions of total duration, with the final partner taking residual capital | **EXPOSE / GENERALISE** | Capital×time solver is sufficient after materialisation, but Question Studio lacks a source-real residual-fraction parameter topology. |
| E13-G05 | Aggregate relational capital equation yielding a coefficient such as `A + B = 1.5C` | **EXPOSE / GENERALISE** | Current QL-096 only seed-reaches the special identity `one weight = exact sum of the others`; the generic aggregate coefficient family is not reachable. |
| E13-G06 | Each partner first earns interest on invested capital, then the remaining business profit is divided by partnership ratio | **OWNERSHIP / ALLOCATION-BASIS GAP** | Target Banking evidence exists. PRT previously delegated interest-on-capital to Interest, but current `INT-001` ownership does not implement this mixed partnership distribution contract, and PRT lacks a truthful `% of partner capital` allocation basis. |
| E13-G07 | Incoming partner acquires a stated profit fraction from existing partners in a stated sacrifice ratio; ask the new profit-sharing ratio | **OWNERSHIP / PRODUCT GAP** | Target Punjab Police aptitude evidence exists. Broad “accounting reconstitution” exclusion is too coarse for this arithmetic-only profit-share reallocation, and no current PRT/RAP surface generates it. |
| E13-W01 | Commission equal to x% of profit *after charging that same commission* | **WATCHLIST / OUT-OF-SCOPE FOR NOW** | Self-referential basis is absent from the engine, but official evidence found is accounting/commerce/manager material rather than target aptitude Partnership. Do not promote without target SSC/Banking/Punjab/comparable aptitude evidence. |
| E13-M01 | `coverage-targets.library.json` still said `E9_LEGACY_OWNERSHIP_VALIDATED_NOT_FINAL` | **METADATA DEBT — FIXED IN E13** | Runtime counts were current but lifecycle label predated E10-E12. E13 replaces it with `E13_POST_FREEZE_EXHAUSTIVENESS_REOPENED`. |

## E13-G01 — reduced sleeping-partner entitlement

### Source evidence

**SSC CGL Tier 2 Quant Previous Paper 8 — 18 Feb 2018**

A:B:C invest in the ratio 4:5:7; C is a sleeping partner and receives **half** of the share he would receive as a working partner; 25% of profit is reinvested and the remainder is distributed.

Source: https://testbook.com/question-answer/a-b-and-c-invest-in-a-business-in-the-ratio-4-%E2%88%B6--5c20b58906e94d2a1191aa7a

**SSC CGL Tier 2 Quant Previous Paper 11 — 21 Feb 2018**

A:B:C invest 3:6:5; B is sleeping and receives **3/4** of his ordinary share; half the profit is reinvested before distribution.

Source: https://testbook.com/question-answer/a-b-and-c-invest-in-a-business-in-the-ratio-3-6--5c2e13a5fdb8bb5d5d6eb9a1

### Runtime comparison

Current `Partner` state has `role` and `capitalSegments`. The generic allocation stage divides the distributable pool by effective-capital weights. There is no first-class entitlement multiplier such as `profitWeightMultiplier` / `shareEntitlementMultiplier`.

Current `PRT-QL-099 / findSleepingPartnerShareWithActivePartnerSalary` is a different family: the sleeping partner receives an ordinary capital-ratio share after the active partner's salary. It cannot truthfully model a stated sleeping partner with the same capital but only 1/2 or 3/4 entitlement.

### Required closure

Add a truthful first-class adjusted-entitlement representation rather than faking lower capital. Add source-real direct QL exposure with retained/reinvested-profit handling. Only add inverse variants if independent source evidence justifies them.

## E13-G02 — prior-period profit reinvested into next-period capital

### Source evidence

**OSSC CGL 2024 Preliminary Exam Official Paper — 20 Oct 2024**

X and Y initially invest Rs 3,000 and Rs 4,000. First-year profit is Rs 2,100. X reinvests **his computed first-year profit share**; Y does not. The question asks the second-year profit ratio.

Source: https://testbook.com/question-answer/x-and-y-put-in-rs-3000-and-rs-4000-respectivel--694f279d00a17a14925bc4f1

### Runtime comparison

The capital timeline can represent a known later capital, but none of the 99 active solve contracts derives that capital from a previous-period distribution. This is not merely a capital-addition stem: the added amount is endogenous to a prior solve stage.

### Required closure

Add a controlled multi-period carry-forward authority, initially scoped to one prior period feeding the next period. The solver should explicitly compute first-period share, apply the stated reinvestment rule, build next-period capital, and then answer the requested next-period ratio/share. Avoid an unbounded accounting simulator.

## E13-G03 — multiple gross-profit allocations to different partners

### Source evidence

**OSSSC Forester, Forest Guard & Excise Constable Official Paper — 22 Apr 2026 Shift 1**

X invests ₹25,00,000 and Y ₹20,00,000. X first receives **20% of gross profit**, Y receives **10% of gross profit**, and the remaining 70% is divided by invested capital. The question asks X's final receipt.

Source: https://testbook.com/question-answer/two-companies-x-and-y-enter-into-a-partnership--6a0ab43990fad6301d9f645a

### Runtime comparison

The allocation engine can already execute multiple `PERCENT_OF_GROSS_PROFIT` recipient allocations, so this does not justify inventing a new core mathematical authority merely for the wording.

However, active QL-040 is specifically authored as **fixed reserve -> one partner commission on the post-reserve pool -> residual distribution**. The source topology with two different gross-profit recipients is not currently seed-reachable.

### Required closure

Add a human-authored product-facing QL/topology, preferably reusing/generalising the existing multiple-ordered-allocation solver authority. Require at least 3 material states and multiple recipient-percentage combinations.

## E13-G04 — residual fractions of total capital/time

### Source evidence

**UP Police Constable Re-Exam 2024 Official Paper — 24 Aug 2024 Shift 1**

X invests 1/6 of total capital for 1/6 of total time, Y invests 1/3 for 1/3 of time, and Z invests the **remaining capital** for the whole time.

Source: https://testbook.com/question-answer/in-a-partnership-x-invests-frac16th-of-t--66c98f15c2a6ce31a8f8c877

**UPSC CSE Prelims 2026 CSAT Official Paper**

A invests one-third of total capital for one-third duration, B one-fourth for one-fourth duration, and C invests the **remaining capital** for the whole duration.

Source: https://testbook.com/question-answer/three-partners-a-b-and-c-entered-into-a-business--6a159cdb0bd449d7a0bb5e17

The recurrence across distinct official examinations demonstrates a reusable aptitude family rather than a one-off phrasing trick.

### Runtime comparison

Once fractional capitals/times are materialised, the current exact rational capital×time solver is sufficient. The missing layer is the parameter semantics: total-capital fractions, total-duration fractions, and residual capital derivation.

### Required closure

Add a CP5 relational/residual-fraction QL/topology reusing existing weighted-share mathematics. Preserve rational fractions exactly; do not convert them to arbitrary nominal capitals merely to hide the relation from the generated stem/explanation.

## E13-G05 — aggregate relational coefficient

### Source evidence

**AFCAT Official Paper — 31 Jan 2026 Shift 1**

`B = (3C - 2A) / 2`, hence `A + B = 1.5C`. With equal time, the question asks C's share from total profit without requiring A and B individually.

Source: https://testbook.com/question-answer/among-three-partners-a-b-and-c-in-a-business-the--6a070264ee09dbb41f0a6814

### Runtime comparison

Current `PRT-QL-096 / findPartnerShareWhenOneWeightIsSumOfOthers` is hard-wired to the special relation where one effective weight equals the **exact sum** of the other two. Its curated generator states do not reach coefficients such as `A+B = 1.5C`.

### Required closure

Generalise the relational aggregate family to rational coefficients, or add an adjacent product QL on the same mathematical authority if that keeps authored semantics clearer. This should not become a new solve mode if a generic aggregate-relation resolver can share the existing final-share mathematics.

## E13-G06 — interest on partners' capital before residual profit distribution

### Source evidence

**IBPS Clerk Mains — 28 Feb 2021 memory-based test, Shift 1**

Three partners invest Rs 48,000, Rs 52,000 and Rs 36,000. The partnership condition states that **each gets 8% per annum on capital**, then the remaining profit is divided in the ratio of capitals. The question asks the first partner's final share.

Source: https://testbook.com/question-answer/three-friends-invested-rs-48000-rs-52000-and-36--603b79a25ece44e569a86b4f

### Ownership comparison

E8 deliberately treated interest-on-capital as an Interest boundary. That is reasonable for **pure interest computation**, but it does not by itself cover a Banking Partnership question whose mathematical contract is:

1. compute partner-specific capital interest;
2. deduct those allocations from business profit;
3. divide the remainder by partnership ratio;
4. add the interest entitlement back to the target partner's final receipt.

The current `INT-001` ownership audit says Partnership owns profit sharing by capital/time and does not claim this mixed distribution contract. Current PRT allocation bases also have no truthful `PERCENT_OF_PARTNER_CAPITAL` semantic basis. Treating capital interest as a salary/fixed arbitrary amount would be mathematically possible only after hiding the source relation and would be semantically wrong.

### Required closure

Reopen the ownership boundary. Preferred architecture: pure SI/CI remains INT-owned, while this **mixed Partnership allocation contract** is PRT-owned (likely CP6/CP7) with a first-class capital-interest allocation semantic. If architecture instead assigns the whole mixed contract to INT, Question Studio must still expose it under the Partnership product taxonomy and ownership tests must prove there is no gap. Do not leave it as a paper delegation with no generator.

## E13-G07 — incoming partner acquires profit share from existing partners

### Source evidence

**Punjab Police Constable Official Paper-I & II — 10 Aug 2023 Shift 2**

Bhavya and Chirag share profits 2:1. Rahul joins with a **one-fourth share**, acquired from Bhavya and Chirag in the ratio 1:2. The question asks the new profit-sharing ratio.

Source: https://testbook.com/question-answer/ques--69ea07e10639cc52d17aa343

### Ownership comparison

The E8 boundary broadly excluded accounting partnership admission/reconstitution. That exclusion is still correct for goodwill, revaluation, capital accounts, journal entries and legal/accounting mechanics. This Punjab Police item is different: it is a compact arithmetic profit-share reallocation problem with no accounting ledger knowledge.

No current PRT/RAP source found in the repo exposes an incoming-partner share acquisition/sacrifice topology. Therefore broad exclusion currently creates a target-Punjab product gap.

### Required closure

Split the boundary more precisely:

- **include or explicitly cross-route** arithmetic-only old-share -> sacrifice -> new-share ratio questions;
- continue excluding goodwill, reserves, revaluation, capital-account adjustments, admission accounting and legal doctrine.

Do not automatically import the entire accounting “reconstitution” syllabus. Build only the source-backed aptitude ratio topology.

## E13-W01 — self-referential commission basis

The current allocation basis supports fixed amounts, percent of gross profit, and percent of the current post-deduction pool. It does not support a clause such as “commission is 10% of profit after charging this commission,” which requires solving `C = p(P-C)`.

The sweep found official accounting/commerce-style examples of this basis, but not a target SSC/Banking/Punjab/comparable aptitude Partnership paper strong enough to justify expanding PRT-001 now. Keep this explicitly on the watchlist. If target aptitude evidence appears, add a dedicated net-of-own-commission basis rather than abusing `PERCENT_OF_POST_DEDUCTION_POOL`.

## Already-covered source spot checks

The adversarial sweep also reconfirmed current coverage for representative target families including:

- Punjab Police 2025 multi-event capital withdrawal/addition + late third join;
- Punjab Police 2025 three-partner unequal durations;
- Punjab Police 2025 half-capital withdrawal after six months;
- Punjab Police 2023 equal effective weights despite different join/leave timings;
- DSSSB MTS 2026 late third join;
- DSSSB MTS 2026 active partner 12.5% gross remuneration with reverse total-profit recovery;
- OSSSC 2026 active partner 20% gross remuneration with reverse final-receipt difference;
- same-period direct/reverse shares and unknown capital;
- unequal capital-duration direct and inverse questions;
- dynamic additions/withdrawals, percentage/fraction changes and multi-event histories;
- three/four-partner and relational systems;
- reserve/charity/business-expense deductions;
- combined timeline + remuneration systems;
- multi-year stated withdrawal histories;
- legacy RAP ownership without duplicate product exposure.

These remain valid and should not be duplicated under E13.

## Count impact

E13 is an audit, not an implementation wave, so **current runtime counts remain 99 solve modes / 105 QLs per locale**.

The implementation impact is intentionally not frozen yet. The second merge/split pass currently starts from:

- **2 definite new core authorities**: G01, G02;
- **3 exposure/generalisation families** that should preferably reuse/generalise existing authorities: G03-G05;
- **2 ownership-routing gaps** requiring explicit owner decisions and executable coverage: G06-G07;
- no promotion of W01 without target aptitude evidence.

G06 may require a new first-class allocation basis/authority if PRT owns the mixed contract. G07 may be implemented inside PRT or through a cross-routed ratio authority, but in either case the Partnership product surface must generate it. Do not pre-allocate final QL IDs or claim final solve-mode counts until executable prototypes prove these decisions.

## Required E13 closure plan

### E13A — executable authority prototypes

1. adjusted sleeping-partner entitlement multiplier with exact rational support;
2. one-period-to-next-period profit-share reinvestment authority;
3. independent verification for both.

### E13B — exposure/generalisation

1. multi-recipient gross-profit allocations before residual sharing;
2. residual fractions of total capital / total duration;
3. aggregate relational coefficient family.

### E13C — ownership resolution

1. resolve G06 so the Banking interest-on-capital + residual Partnership contract is executable somewhere and product-routed to Partnership;
2. resolve G07 so arithmetic incoming-partner share acquisition is executable/product-visible without importing accounting reconstitution;
3. add cross-chapter ownership regression tests for both boundaries.

### E13D — production/editorial depth

For every accepted new QL:

- at least 3 material mathematical states;
- human-authored EN stems, then HI/PA semantic localization;
- 3 authored and seed-reachable skeletons per QL/locale unless a later evidence-based policy changes that chapter-wide standard;
- question-specific explanations;
- misconception-aware distractors;
- structural duplicate/collision checks against all existing 105 QLs.

### E13E — full revalidation

After implementation:

1. Partnership-scoped TypeScript;
2. full expanded seeded corpus in EN/HI/PA;
3. independent-answer parity;
4. E1-E13 math/source/diversity/editorial audits;
5. RAP historical regression + multilingual Question Studio smoke + ownership audit;
6. Interest/Partnership ownership regression for G06;
7. Ratio/Partnership ownership regression for G07 if cross-routed;
8. full structural/near-duplicate audit;
9. option-quality and Question Studio integration;
10. final release/freeze rerun from a cleaned head.

Only after all accepted E13 gaps close should chapter-level technical exhaustiveness/publication freeze be restored.

## Publication and approval lifecycle

Product/publication approval was granted after E12. That approval is **recorded as received**. E13 then discovered new technical exhaustiveness gaps, so approval is no longer the blocker; **technical E13 closure is now the blocker**. Publication must remain disabled until the expanded chapter passes the complete rerun.

## Audit conclusion

**PRT-001 does not pass a fresh open-world exhaustiveness freeze at 99 modes / 105 QLs.**

The existing surface is strong and fully validated against its defined gates, but the final E13 sweep found:

- **2 confirmed new authority gaps** — reduced sleeping-partner entitlement; prior-profit reinvestment into next-period capital;
- **3 confirmed exposure/generalisation gaps** — multiple gross-profit recipient allocations; residual total-capital/time fractions; aggregate relational coefficient;
- **2 confirmed ownership/product-routing gaps** — Banking interest-on-capital + residual partnership distribution; Punjab Police arithmetic incoming-partner share acquisition;
- **1 watchlist/out-of-scope basis** — self-referential commission after charging itself;
- **1 lifecycle metadata inconsistency, fixed in E13**.

Accordingly, E13 reopens the chapter exhaustiveness freeze without invalidating the correctness of the already-implemented 105 QLs.