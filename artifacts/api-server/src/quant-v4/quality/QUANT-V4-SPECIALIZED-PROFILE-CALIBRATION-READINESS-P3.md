# Quant V4 Specialized Profile Calibration Readiness — P3

**Authority:** `QUANT-V4-SPECIALIZED-PROFILE-CALIBRATION-READINESS-P3`  
**Scope:** evidence diagnosis only  
**Selection promotion:** disabled  
**Novelty:** out of scope

## Why this checkpoint exists

The specialized profile-selection layer already knows when normalized evidence exists, but every evidence-bearing profile is still labelled with the generic blocker:

`PROFILE_SAMPLE_INSUFFICIENT_FOR_CALIBRATION`

That wording is no longer precise for the strongest SSC CGL Tier-I surfaces. Current normalized counts include:

- AVG-001: 7
- MAL-001: 5
- NUM-001: 26
- TMW-001: 27

NUM and TMW therefore have substantial samples, including dated complete-section observations. The audit still must not invent a threshold and declare them calibrated.

## What can be measured now

For each specialized package/profile pair the P3 authority reports:

- countable observation count;
- dated observation count;
- distinct resolved papers represented by dated evidence;
- representation coverage;
- observations carrying an explicit canonical CP mapping;
- canonical CP coverage;
- CP-mapping completeness.

## What cannot yet support a selector

### No ratified package-level calibration policy

The repository has no adopted methodology defining the evidence conditions under which a specialized chapter may move from evidence-accumulating to profile-calibrated.

P3 therefore records:

`CALIBRATION_POLICY_NOT_ADOPTED`

It does not invent a minimum question count, paper count, CP count or representation count.

### Canonical CP/QL mapping is incomplete

Whole-section evidence is excellent for paper composition, but many observations describe the mathematical task without a canonical `*-CP-xxx` identifier. That is sufficient for section-frequency evidence, not for deriving CP/QL selection weights.

Where incomplete, P3 records:

`CANONICAL_CP_MAPPING_INCOMPLETE`

### Difficulty evidence is not normalized

`QuantV4PyqObservation` currently records topic, subtopic and representation but not an empirical difficulty label. A chapter-specific difficulty selector therefore cannot be calibrated from this registry.

P3 records:

`DIFFICULTY_EVIDENCE_NOT_NORMALIZED`

## Current decision

No specialized SSC CGL Tier-I package is promoted by this checkpoint.

In particular, NUM-001 and TMW-001 must remain:

- delivery-allowed;
- evidence-accumulating;
- `profileSelectionCalibrated: false`;
- selection calibration unauthorized.

## Next implementation work

The next useful step is methodological rather than increasing an arbitrary counter:

1. define and ratify a package-level calibration policy;
2. backfill canonical CP ownership for whole-section observations where the mapping is unambiguous;
3. decide how empirical difficulty is represented and normalize it without inferring difficulty from generator labels;
4. rerun this readiness audit;
5. only then derive a non-production selector candidate.

Production selection and simulator weighting remain separate authorization gates.
