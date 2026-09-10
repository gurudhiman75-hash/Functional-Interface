# Quant V4 Specialized Question Studio Profile Bypass Map — P2

Authority: `QUANT-V4-SPECIALIZED-PROFILE-BYPASS-MAP-P2`

## Purpose

The shared Quant generation entry point now transports exam profiles and enforces the central delivery option-count contract. Some Question Studio routes return before that shared entry point is reached, so they can still bypass those guarantees.

This checkpoint measures those specialized routes directly instead of assuming the shared fix covers them.

## Status meanings

- `PROFILE_APPLIED_OR_EXPOSED` — the requested profile is observable in runtime output and the delivery option count matches the central profile.
- `DELIVERY_MATCH_ONLY_NO_PROFILE_PROOF` — the option count happens to match, but the runtime does not prove it consumed the requested profile. This must not be counted as exam calibration.
- `PROFILE_BYPASS_DELIVERY_MISMATCH` — the specialized route bypasses the requested profile and also violates its delivery option-count contract.

## Measured results

The exact-head executable audit produced:

| Route | Requested profile | Required options | Observed | Profile proof | Status |
| --- | --- | ---: | ---: | --- | --- |
| AVG-001 | BANKING_PRELIMS | 5 | 4 | no | `PROFILE_BYPASS_DELIVERY_MISMATCH` |
| MAL-001 | BANKING_PRELIMS | 5 | 4 | no | `PROFILE_BYPASS_DELIVERY_MISMATCH` |
| NUM-001 | BANKING_PRELIMS | 5 | 4 | no | `PROFILE_BYPASS_DELIVERY_MISMATCH` |
| TMW-001 | BANKING_PRELIMS | 5 | 4 | no | `PROFILE_BYPASS_DELIVERY_MISMATCH` |
| SAP Banking Speed Maths | BANKING_PRELIMS | 5 | 5 | yes | `PROFILE_APPLIED_OR_EXPOSED` |
| AVG-001 | PUNJAB_STATE | 4 | 4 | no | `DELIVERY_MATCH_ONLY_NO_PROFILE_PROOF` |
| standard SAP | PUNJAB_STATE | 4 | 4 | no | `DELIVERY_MATCH_ONLY_NO_PROFILE_PROOF` |

## Audit principle

A four-option Punjab question is not automatically Punjab-calibrated. Likewise, a four-option Banking question is not acceptable merely because its mathematics is valid: the Banking delivery contract requires five options.

This audit therefore separates delivery correctness from profile-selection correctness.

## Remediation order after this map

1. preserve SAP Banking Speed Maths as the positive control;
2. close the externally visible Banking delivery mismatch for AVG-001, MAL-001, NUM-001 and TMW-001;
3. then thread profile evidence/application into specialized Punjab routes;
4. only after those routes prove profile application should exam-family CP/QL selection calibration be considered.

The first remediation should be a shared specialized-route delivery wrapper rather than four unrelated option-count patches, provided the wrapper preserves each chapter's native answer and lifecycle metadata.
