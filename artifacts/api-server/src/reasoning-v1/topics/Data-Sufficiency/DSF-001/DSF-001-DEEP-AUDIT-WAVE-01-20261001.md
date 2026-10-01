# DSF-001 — Deep Audit Wave 01

Date: 2026-10-01

Status: **CP017 normal Question Studio surface under executable deep audit; chapter closure not yet claimed**

## Why this wave exists

CP016 already proved the common-base implementation corpus, including a 2,100-record editorial/anti-duplicate audit and permanent allocation of `DSF-QL-002`.

CP017 later opened the normal Question Studio review workflow for the implemented two-statement breadth, but its README still marked validation as pending and no dedicated CP017 end-to-end audit file was present on `New-main`.

This wave validates the actual learner-review surface now exposed through CP017.

## Source breadth finding

The Examtree Library materially supports the chapter taxonomy.

The reasoning source explicitly describes Data Sufficiency as spanning:

- blood relations;
- order/ranking;
- seating arrangement;
- direction and distance;
- other reasoning topics.

A Punjab & Sind Bank PO source set includes direct two-statement Data Sufficiency examples for:

- coding-decoding;
- ranking/order;
- blood relations;
- row-position/ranking.

The SSC mathematics source contains a dedicated Data Sufficiency section with number, arithmetic and algebra-style two-statement questions.

Therefore the current Quant + Reasoning breadth is not a blueprint-only invention. It is consistent with observed competitive-exam Data Sufficiency usage.

## CP017 implemented scope

Normal Question Studio currently exposes 21 two-statement lanes under `DSF-QL-001`:

### Quant
1. Number System
2. Ratio & Proportion
3. Percentage
4. Algebra
5. Average
6. Ages
7. Profit, Loss & Discount
8. Simple & Compound Interest
9. Time & Work / Pipes & Cisterns
10. Time, Speed & Distance / Trains / Boats
11. Mixture & Alligation
12. Mensuration
13. Ratio / Percentage / Number System enrichment
14. Algebra enrichment

### Reasoning
15. Ranking & Order
16. Direction Sense
17. Blood Relations
18. Inequality
19. Seating Arrangement
20. Coding-Decoding
21. Calendar

## Executable audit added

`DSF-CP-017/cp017-deep-audit-wave-01.test.ts` checks:

- exactly 21 registered lanes;
- only `DSF-QL-001` is currently batch-generatable;
- `DSF-QL-002` remains explicitly runtime-deferred;
- five generated items per lane;
- deterministic replay stability;
- exactly two statements per item;
- exactly five answer choices;
- exactly one correct option;
- non-empty exam-facing stem and explanation;
- rejection of obvious placeholder/serialization defects;
- rejection of generic instruction-style stem openings;
- source identity and Question Studio ID uniqueness;
- minimum within-lane content-fingerprint variation;
- 50-item mixed-batch uniqueness and multi-lane breadth;
- Question Studio discovery/review persistence enabled;
- Question Bank, scored test, mock, public and automatic learner publication locked;
- Hindi/Punjabi requests rejected on the new English-first breadth rather than silently mistranslated;
- `DSF-QL-002` requests rejected until a reviewed production batch runtime exists.

Total direct CP017 sample surface in this audit: **155 generated questions** (105 lane-scoped + 50 mixed).

The existing CP016 common-base gate continues to supply the larger **2,100-record** editorial/anti-duplicate proof for the underlying implemented corpus.

## Important remaining gaps

This wave must not be mistaken for final chapter closure.

1. **New breadth localization gap** — CP011–CP013 normal Question Studio lanes are English-first. The older specialized DSF route has approved Hindi/Punjabi coverage, but the 21-lane CP017 breadth does not yet have language parity.
2. **DSF-QL-002 runtime gap** — three-statement semantics are permanent and exhaustively foundation-tested, but no exhaustively reviewed batch generator is exposed through normal Question Studio. This is **not a source-pattern gap**: the Examtree Library contains explicit three-statement Data Sufficiency examples asking which of Statements I, II and III are sufficient, including partnership, Time & Work and profit/article-count problems. The remaining QL002 blocker is production batch-generation/editorial validation.
3. **External source-solver holds** — Geometry DS and generic floor/box/scheduling puzzle DS remain held until authoritative source solvers exist.
4. **Primary/source-frequency calibration** — Library material establishes real exam use across core DS domains, but exact lane frequency by exam family/year is not claimed here.
5. **Learner-data difficulty calibration** — later analytics gate.
6. **Novelty promotion** — held for the final cross-chapter pass.

## Closure meaning after this wave

If the CP017 executable gate is green on the current `New-main` base, the correct status is:

`TWO_STATEMENT_CP017_IMPLEMENTED_SURFACE_DEEP_AUDITED__CHAPTER_FINAL_CLOSURE_PENDING_LOCALIZATION_AND_QL002_RUNTIME`

This is a real content/integration milestone, but not a full DSF chapter freeze.


## QL002 source-status correction

A dedicated Library pass located direct three-statement Data Sufficiency material in the SSC mathematics source.

Observed learner task:
- a question followed by Statements I, II and III;
- learner determines which individual/combined statements are sufficient;
- answer choices encode combinations such as only I+III, only II+III, all three necessary, any two sufficient, or even all three insufficient.

Observed domains include:
- partnership/profit share;
- Time & Work;
- profit / number of articles sold.

Therefore `DSF-QL-002 / THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS` is source-backed at the learner-task level. Its deferred status must be understood as a **runtime and editorial production gap**, not lack of competitive-exam evidence.
