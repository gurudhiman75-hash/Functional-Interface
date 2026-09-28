# DI Delivery Novelty Mix V1

Status: **CONTROLLED REVIEW CANDIDATE**  
Authority: `DI-DELIVERY-NOVELTY-MIX-V1`

## Purpose

Compose chapter-level DI review batches from existing Question Studio authorities while controlling repetition and novelty at **selection time** rather than forcing every generator to become unusual.

## Default profile

For Banking profiles:

- 75% `STANDARD`
- 20% `FRESH_FAMILIAR`
- 5% `HIGHER_NOVELTY`

For SSC Tier-I review:

- 75% `STANDARD`
- 25% `FRESH_FAMILIAR`
- 0% `HIGHER_NOVELTY`

The SSC high-novelty quota is intentionally disabled in V1 because the current explicitly higher-novelty source modes are Banking-oriented. The 5% is reassigned to fresh/familiar instead of importing an exam-misaligned representation.

## Default difficulty composition

When Question Studio does not request one explicit difficulty, the chapter mix applies an independent exam-profile difficulty plan:

- SSC CGL Tier I: 35% Easy / 40% Medium / 25% Hard
- Banking Prelims: 30% Easy / 50% Medium / 20% Hard
- Banking Mains: 15% Easy / 45% Medium / 40% Hard

For 20 questions this resolves to:

- SSC: 7 Easy / 8 Medium / 5 Hard
- Banking Prelims: 6 Easy / 10 Medium / 4 Hard
- Banking Mains: 3 Easy / 9 Medium / 8 Hard

If the reviewer explicitly selects Easy, Medium or Hard, that explicit choice overrides the default mix.

Novelty tier and difficulty are allocated independently: a fresh or higher-novelty question is not automatically treated as a hard question.

## Tier meaning

### STANDARD

Mainstream exam authorities such as:

- basic/advanced tables,
- grouped bar,
- two-series line,
- ordinary/hidden pie,
- base caselet,
- missing data,
- business arithmetic,
- histogram/frequency polygon where profile-appropriate.

### FRESH_FAMILIAR

Recognizable exam DI with broader structure:

- single-series bar/line,
- comparative/double pie,
- donut,
- advanced caselet,
- advanced arithmetic,
- advanced variable/multi-missing.

### HIGHER_NOVELTY

Still exam-valid, but structurally less routine:

- mixed/multi-chart,
- stacked bar,
- three-series line,
- radar/web,
- radar + pie hybrid.

## Guardrails

- Deterministic selection and ordering for a fixed seed.
- Exact normalized learner stems are de-duplicated across source modes within a delivered batch.
- Fresh/familiar and higher-novelty questions are spaced through the batch instead of being allowed to cluster.
- Higher-novelty source selection rotates deterministically across eligible modes over different batch seeds.
- Source package/CP metadata remains intact.
- Each delivered question is tagged with:
  - `noveltyTier`
  - `noveltyMixAuthority`
  - `noveltySourceMode`
- No lifecycle widening:
  - Question Bank writes disabled
  - test/mock eligibility disabled
  - public publication disabled
  - production release unauthorized
  - manual approval required
- English controlled review only in V1.
- High-novelty formats are never pulled into an exam profile that does not explicitly own them.

## Intended next gate

Human review should evaluate whether the 75/20/5 Banking composition feels naturally exam-like over complete mock-sized batches. Production/test promotion remains a separate approval.
