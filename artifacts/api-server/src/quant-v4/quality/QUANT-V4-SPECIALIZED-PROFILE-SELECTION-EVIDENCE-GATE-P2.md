# Quant V4 Specialized Profile Selection Evidence Gate — P2

**Authority:** `QUANT-V4-SPECIALIZED-PROFILE-SELECTION-EVIDENCE-GATE-P2`  
**Registry authority:** `QUANT-V4-PYQ-OBSERVATION-REGISTRY-P2`  
**Scope:** `AVG-001`, `MAL-001`, `NUM-001`, `TMW-001` across SSC, Banking and Punjab State competitive profiles.

## Decision

No specialized route is promoted to native SSC, Banking or Punjab selection in this checkpoint.

All four packages remain:

`EVIDENCE_GATED_SELECTION_PENDING`

Their central delivery contracts remain usable, so Banking can correctly receive five options and SSC/Punjab four options. That delivery correctness is not evidence that the package is selecting the right CPs, QLs, difficulty mix or representation mix for the requested exam.

## Why no promotion is defensible yet

The normalized PYQ-frequency authority counts only evidence with identifiable provenance and question identity (`OFFICIAL_PAPER`, `DIRECT_PYQ`, or `VERIFIED_PYQ_COLLECTION`). Book exercises, practice taxonomies and internal fixtures may support coverage decisions but cannot determine empirical exam weights.

At this checkpoint the repository-wide normalized observation registry contains **10 countable observations, all for `ALG-001`**. There are **zero registered countable observations** for `AVG-001`, `MAL-001`, `NUM-001` or `TMW-001`.

The specialized chapter material is still useful, but it is not equivalent to profile calibration:

- **AVG-001:** the design authority describes expected SSC/Banking/State contexts and labels several CPs as typical of those exams. That is a structural design statement, not a dated paper/question observation set.
- **MAL-001:** source-recovery work includes book/XAT material and explicitly records unresolved direct-source gaps. It does not provide a normalized SSC/Banking/Punjab profile sample.
- **NUM-001:** multiple source-backed discovery waves establish mathematical/question-family coverage, but no Number System observation corpus has been migrated into the normalized PYQ authority.
- **TMW-001:** the chapter has extensive runtime/audit evidence and uploaded competitive-exam references, including SSC/book material, but those references were used for coverage/readiness work rather than a normalized profile-frequency ledger.

Therefore copying generic, SSC or Banking-looking CP mixes into another profile would be guesswork.

## Executable contract

`common/specialized-profile-selection.ts` exposes a Question Studio capability for every competitive profile on the four specialized packages. Each entry currently states:

- `selectionStatus: EVIDENCE_GATED_SELECTION_PENDING`
- `profileSelectionCalibrated: false`
- `deliveryAllowed: true`
- `normalizedCountableObservationCount: 0`
- blockers:
  - `NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE`
  - `CP_QL_DISTRIBUTION_UNPROVEN`
  - `DIFFICULTY_REPRESENTATION_UNCALIBRATED`

Question Studio package discovery exposes this contract as `examProfileSelection`, so callers can distinguish a usable delivery profile from a genuinely calibrated content selector. The discovery layer decorates both already-registered package cards and fallback-added cards, preventing older registrations from silently omitting the evidence status.

## Normalized observation registry

`quant-v4-pyq-observation-registry-p2.ts` is the integration point for countable PYQ corpora. It initially registers the existing Algebra Wave-1 observations only.

The dedicated CI gate cross-checks each specialized package/profile against this registry. If relevant normalized observations are added later, the current zero-evidence assertion intentionally fails. That failure is the review trigger: the evidence must be audited, a profile-specific sufficiency policy must be defined, and only then may the selection contract be changed.

There is intentionally **no invented universal minimum** for papers/questions. The existing PYQ evidence authority supports explicit policies; the threshold chosen for a future profile must match the claimed calibration scope.

## Runtime proof

The regression verifies that:

- AVG/MAL/NUM/TMW Banking Prelims still deliver five options;
- sampled Punjab specialized routes still deliver four options;
- all sampled non-native specialized routes remain `DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING` with `profileSelectionCalibrated: false`;
- SAP Banking remains the positive native-profile control and continues to use `SAP_BANKING_SPEED_PROFILE_V1`.

## Next evidence work

The next substantive promotion step is **source normalization**, not weight invention:

1. recover identifiable SSC/Banking/Punjab questions for one specialized chapter;
2. map each observation to package, CP/subtopic and representation without changing provenance;
3. register those observations in the normalized registry;
4. evaluate paper/question/topic coverage using an explicit profile policy;
5. only if the evidence passes, implement native CP/QL/difficulty selection for that chapter/profile and change its status from selection-pending.

A narrow, well-supported first profile is preferred over broad synthetic calibration across all four chapters.
