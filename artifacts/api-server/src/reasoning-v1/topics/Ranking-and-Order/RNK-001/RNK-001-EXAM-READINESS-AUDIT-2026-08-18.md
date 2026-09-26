# RNK-001 Exam-Readiness Audit — 2026-08-18

Audit: `RNK_001_EXAM_READINESS_AUDIT_V1`

## Decision

- Keep the frozen mathematical range `RNK-QL-001..042`.
- Do not allocate `RNK-QL-043`.
- CP001..CP007 have technical Hindi/Punjabi review-candidate coverage.
- Do **not** grant chapter-final multilingual/product freeze yet.
- Do **not** activate RNK in Question Studio yet.

The audit found delivery/editorial gaps, not missing mathematical authorities.

## Coverage verdict

The checkpoint split remains valid: CP001 one-person arithmetic; CP002 two-position constraints; CP003 movement/interchange; CP004 unique strict order; CP005 partial-order uncertainty; CP006 explicit equality; CP007 category composition; CP008 derivation/caselet adapters routed to existing QLs.

Verdict: **authority coverage PASS; ownership/duplication PASS.**

## Finding 1 — CP004 option pedagogy — REMEDIATED

Direct review of the retained CP004 V5 Final multilingual artifact found recurring weak wrong-option explanations in sampled `RNK-QL-027` and `RNK-QL-028` questions. Several explanations effectively said an option was wrong because the correct answer was another option.

CP004 V6 now replaces only QL027/028 teaching text with reason-specific feedback: actual reconstructed endpoint/rank placement and why the option fails the requested position. Stems, clues, option labels/order, answer, correct index, mathematics and permanent identity remain frozen.

Exact-head V6 workflow `32162654654` is green end-to-end. The retained 32-question Hindi/Punjabi V6 artifact was directly audited and no remaining learner-facing blocker was found in the target family.

Disposition: **technical remediation PASS; formal native/product-owner approval still required.**

## Finding 2 — RNK-QL-042 percentage presentation — IMPLEMENTED / CI GATE PENDING

SSC Stenographer 2025 official-paper material contains the same `CATEGORY_COMPOSITION_AROUND_RANK` contract with a 40%/60% category split, rank from the top, a known category count ahead, and a requested category count behind.

The frozen CP007 engine owns the mathematics in `RNK-QL-042`; therefore percentage evidence is a presentation adapter, not a new QL.

`RNK_CP007_QL042_PERCENTAGE_PRESENTATION_ADAPTER_V1` now:

- selects the source-backed boys/girls partition;
- accepts only exact integral percentage-to-count states;
- preserves frozen QL042 state, answer, options and permanent fingerprints;
- renders EN/HI/PA percentage surfaces;
- explicitly records `newQlAllocated: false` and `mathematicalAuthorityChanged: false`.

Disposition: **implemented; dedicated exact-head CI/artifact audit must pass before this gap is closed.**

## External real-exam spot audit

Observed official-paper forms strongly support a core-heavy delivery profile:

- Punjab Police Constable 19 Aug 2023: direct conversion from rank from top to rank from bottom;
- Punjab Police Constable 03 Jun 2025: convert rank from bottom to rank from top;
- Punjab Police Constable 12 May 2025 and 04 Jun 2025: total class size from mixed top/bottom ranks and relative position;
- Punjab Police Constable 07 Jun 2025 and 28 May 2025: number of students between two ranked persons;
- SSC Stenographer 08 Aug 2025: percentage category composition around a ranked person;
- banking order/ranking practice modeled on bank-exam delivery commonly uses five choices, including `None of these`.

These examples map primarily to CP001/CP002 plus the QL042 compositional adapter. They do not justify uniformly sampling all 42 authorities in an exam mock.

## Exam frequency realism

`42 permanent QLs` must not mean `42 equally frequent exam forms`.

Delivery tiers:

- core: `RNK-QL-001..026`;
- secondary: `RNK-QL-027..035`;
- advanced: `RNK-QL-036..041`;
- source-specific compositional: `RNK-QL-042`.

A non-production exam-delivery policy now rejects uniform 42-QL exam sampling while allowing exhaustive 42-QL chapter practice. Its generic guard requires at least 70% core coverage and caps advanced/source-specific shares. These are safety defaults, not final PYQ-calibrated per-exam weights.

Exact SSC, banking and Punjab profile weights must be calibrated in the Question Studio profile layer rather than frozen into mathematical runtimes.

## Context realism

Keep the broad object pool for chapter practice, but exam-profile mocks should favor natural contexts such as class/merit list, students, queue/race and shift/batch. Abstract set/group labels may remain available but should be lower-weight in exam mode.

## Banking delivery — IMPLEMENTED / CI GATE PENDING

Banking order/ranking delivery commonly uses five answer choices while frozen RNK canonical banks use four balanced answer positions.

`RNK_001_BANKING_FIVE_OPTION_DELIVERY_ADAPTER_V1` adds a localized option E (`None of these` / Hindi / Punjabi equivalent) only at delivery time. Because the frozen correct answer remains among A-D, E is a known-false distractor. The adapter preserves the canonical four options, answer, correct index and mathematical authority and cannot allocate a QL.

Disposition: **delivery primitive implemented; exact-head audit CI must pass before use.**

## Question Studio finding

The current shared exam-profile route is Quant-oriented and calls the Quant V4 generator. RNK integration needs a Reasoning-aware profile layer for authority weights, entity/clue complexity, context preferences, language, and 4-vs-5 option delivery. Reuse the shared Question Studio lifecycle/UI; do not create an RNK-specific admin panel.

## CP005 / CP006

Current retained multilingual samples are strong. CP005 provides proof/counterexample/witness reasoning for uncertainty and rank bounds. CP006 is source-backed and correctly requires explicit equality to participate in inference. Keep both authorities, but low-weight advanced CP005/CP006 forms in ordinary exam profiles unless profile evidence calls for them.

## Current final gate

- mathematical authority coverage: **PASS**
- ownership/duplication: **PASS**
- English content freeze: **KEEP**
- technical HI/PA checkpoint coverage: **PASS**
- CP004 QL027/028 pedagogy: **REMEDIATED / GREEN**
- QL042 percentage surface: **IMPLEMENTED / CI PENDING**
- generic exam-mode weighting guard: **IMPLEMENTED / CI PENDING**
- banking five-option delivery: **IMPLEMENTED / CI PENDING**
- formal native/product-owner approvals: **REQUIRED**
- consolidated chapter multilingual freeze: **HOLD**
- Reasoning-aware Question Studio profile integration: **REQUIRED**
- Question Studio activation: **HOLD**
- `RNK-QL-043`: **UNALLOCATED**

Release sequence: complete pending exact-head gates and artifact audits; consolidate approved locale lineage; calibrate SSC/banking/Punjab exam-profile weights and complexity; integrate the Reasoning profile through shared Question Studio; run accessibility/product lifecycle gates; only then grant chapter-final multilingual/product freeze and activate RNK.