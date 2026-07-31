# SER-001 — Numeric Wave A edge-domain expansion

## Purpose

This executable wave addresses the first three blockers identified by the chapter-wide numeric gap audit:

- descending and signed domains;
- zero-step and constant series;
- fractional, decimal and division series.

It does not allocate permanent QLs. It tests whether these familiar surfaces require new solve authorities or are domain extensions of already-discovered CP-001 and CP-002 authorities.

## Source-shaped families

```text
ZERO_STEP_CONSTANT
DESCENDING_SIGNED_ADDITIVE
DESCENDING_SIGNED_AFFINE
FRACTIONAL_ADDITIVE_STEP
UNIT_FRACTION_MULTIPLICATIVE
TERMINATING_DECIMAL_AFFINE
```

Each family is exercised through next-term, interior-missing, previous-term and wrong-term tasks.

## Provisional ownership

```text
ZERO_STEP_CONSTANT
DESCENDING_SIGNED_ADDITIVE
FRACTIONAL_ADDITIVE_STEP
  -> SER-CP-001 / UNIFORM_ADDITIVE_STEP

UNIT_FRACTION_MULTIPLICATIVE
  -> SER-CP-002 / UNIFORM_MULTIPLICATIVE_RATIO

DESCENDING_SIGNED_AFFINE
TERMINATING_DECIMAL_AFFINE
  -> SER-CP-002 / AFFINE_MULTIPLY_THEN_ADD
```

The wave therefore extends three existing canonical authorities and creates no new provisional canonical authority.

## Exact arithmetic boundary

The generator and independent solver use reduced numerator-denominator pairs internally. Decimal rendering happens only after exact inference, so binary floating-point rounding cannot create or remove a candidate authority.

## Freeze boundary

Even after Wave A passes, permanent allocation remains blocked by Wave B, Wave C and source/editorial saturation. Question Studio, Question Bank, test eligibility and public publication remain disabled.
