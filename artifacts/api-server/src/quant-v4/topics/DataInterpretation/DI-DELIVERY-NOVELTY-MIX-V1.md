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
