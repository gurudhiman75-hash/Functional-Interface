# Quant V4 Catalog Profile Resolver — P3

**Authority:** `QUANT-V4-CATALOG-PROFILE-RESOLVER-P3`

## Purpose

The empirical-difficulty telemetry bridge requires a trustworthy mapping from canonical catalog exam identity to a Quant V4 exam profile.

This checkpoint provides an explicit code-based resolver for catalog codes that already have a direct Quant profile counterpart.

## Current exact mappings

- `SSC_CGL_T1` -> `SSC_CGL_TIER_I`
- `SSC_CHSL_T1` -> `SSC_CGL_CHSL`
- `IBPS_PO_PRE` -> `BANKING_PRELIMS`
- `IBPS_CLERK_PRE` -> `BANKING_PRELIMS`
- `PUNJAB_PSSSB_CLERK` -> `PUNJAB_STATE`
- `PUNJAB_EXCISE_INSP` -> `PUNJAB_STATE`

The resolver also checks the catalog exam family before returning a profile.

## Fail-closed codes

Exam codes without a direct Quant profile remain unresolved. Current examples include:

- `SSC_MTS`;
- `RRB_NTPC_CBT1`;
- `RRB_GROUP_D`.

No title or fuzzy-name inference is used.

## End-to-end consequence

Canonical learner telemetry can now flow through:

catalog exam identity -> exact profile resolver -> empirical difficulty telemetry bridge -> `EmpiricalDifficultyObservation[]`

for the mapped exam codes.

This still does not adopt production empirical-difficulty thresholds or automatically rewrite question difficulty.
