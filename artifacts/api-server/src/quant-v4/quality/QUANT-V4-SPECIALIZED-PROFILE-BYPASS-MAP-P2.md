# Quant V4 Specialized Question Studio Profile Bypass Map — P2

Authority: `QUANT-V4-SPECIALIZED-PROFILE-BYPASS-MAP-P2`

## Purpose

The shared Quant generation entry point now transports exam profiles and enforces the central delivery option-count contract. Some Question Studio routes return before that shared entry point is reached, so they can still bypass those guarantees.

This checkpoint measures those specialized routes directly instead of assuming the shared fix covers them.

## Status meanings

- `PROFILE_APPLIED_OR_EXPOSED` — the requested profile is observable in runtime output and the delivery option count matches the central profile.
- `DELIVERY_MATCH_ONLY_NO_PROFILE_PROOF` — the option count happens to match, but the runtime does not prove it consumed the requested profile. This must not be counted as exam calibration.
- `PROFILE_BYPASS_DELIVERY_MISMATCH` — the specialized route bypasses the requested profile and also violates its delivery option-count contract.

## Probed surfaces

The executable audit covers:

- AVG-001 through the specialized Question Studio generation engine;
- MAL-001 through the specialized Question Studio generation engine;
- NUM-001 through the specialized Question Studio generation engine;
- TMW-001 through the Question Studio review engine;
- SAP Banking Speed Maths as the positive specialized profile-aware control;
- AVG-001 and standard SAP under `PUNJAB_STATE` to distinguish four-option coincidence from real Punjab profile application.

## Audit principle

A four-option Punjab question is not automatically Punjab-calibrated. Likewise, a four-option Banking question is not acceptable merely because its mathematics is valid: the Banking delivery contract requires five options.

This audit therefore separates delivery correctness from profile-selection correctness.

## Remediation order after this map

1. preserve SAP Banking Speed Maths as the positive control;
2. close specialized Banking delivery mismatches first because they are externally visible contract violations;
3. then thread profile evidence/application into specialized Punjab routes;
4. only after those routes prove profile application should exam-family CP/QL selection calibration be considered.
