# TMW-001 Remediation R1 Status

## Verdict

`R1_CRITICAL_BLOCKERS_REMEDIATED_AND_REGRESSION_PROVED`

This checkpoint repairs the seven critical blockers identified by the post-freeze exam-readiness audit. It does **not** declare the full chapter exam-ready, does **not** close the remaining major/editorial findings, and does **not** enable Question Studio routing, Question Bank writes, test assembly or public delivery.

## Authority and scope

- Chapter: `TMW-001 — Time, Work & Pipes`
- Permanent QL range retained: `TMW-QL-001..TMW-QL-211`
- Checkpoints retained: `TMW-CP-001..TMW-CP-011`
- R1 working branch: `fix/tmw-001-remediation-r1-multilingual`
- R1 base: `feat/tmw-001-hi-pa-localisation`
- Critical QLs: `102, 131, 133, 138, 148, 183, 187`

## Critical source remediation

### TMW-QL-102 — exact cycle boundary

The exact-boundary contract is now fail-closed at parameter construction:

- solo times printed by the stem and segment rates consumed by the solver are updated from the same authority;
- only parameter states for which one whole work unit equals an integral number of complete two-turn cycles are admitted;
- the R1 proof independently recomputes cycle work, cycle duration and exact cycle count;
- the R1 proof also checks `printed solo time = reciprocal(internal segment rate)` for both workers.

This prevents the former contradiction in which the prose claimed an exact cycle boundary while the worked mathematics produced a fractional cycle count.

### TMW-QL-187 — automatic level controller

The source schedule now has two exclusive phases:

1. outlet-only movement from the upper mark to the lower mark;
2. inlet-only movement from the lower mark back to the upper mark.

The refill phase no longer keeps the outlet active. Options, answer and explanation are regenerated from the corrected source state. The R1 proof independently recomputes the level span, drain time, refill time and requested return count and requires agreement with the canonical solver.

## Critical localized stem-authority remediation

The final chapter-localization pipeline now applies the R1 blocker guard **after** all legacy polish/remediation layers, so later editorial transforms cannot silently remove the required facts.

- `TMW-QL-131`: the asked target category is rebuilt from the same source index used by the mathematical answer contract.
- `TMW-QL-133`: both individual category rates used by the simultaneous equations are stated in the Hindi/Punjabi stem.
- `TMW-QL-138`: the category-efficiency ratio used by the solution is stated in the Hindi/Punjabi stem.
- `TMW-QL-148`: equal daily working hours are made explicit, removing the hidden equal-hours assumption.
- `TMW-QL-183`: Pipe A's solo filling time is stated in the Hindi/Punjabi stem.
- `TMW-QL-187`: the Hindi/Punjabi controller stem explicitly states outlet-only drain and inlet-only refill phases.

`TMW-QL-102` also inherits the corrected source parameters in Hindi/Punjabi through the normal localized pipeline.

## Permanent R1 proof

Workflow: `Validate TMW-001 critical remediation R1`

Exact strengthened head before this status record:

- head: `28b5db36a937070c6d551ea20a9f9380010bc2f1`
- run: `31353106182` — **PASS**
- evidence artifact: `9049640381`
- artifact digest: `sha256:0e6d8f755bb51c395947645070bd855596d0c39260fa81050b4246b79c26cb17`

Dedicated R1 proof:

- 7 critical QLs;
- 20 deterministic seeds per QL;
- 280 Hindi/Punjabi critical rows checked;
- exact QL-102 stem/rate synchronization checked;
- exact QL-102 integral-boundary oracle checked;
- exclusive QL-187 phase contract checked;
- independent QL-187 return-time oracle checked;
- four unique options and correct option/answer agreement checked;
- publication locks retained.

Whole-chapter regression in the same run:

- 211 QLs across 11 checkpoints;
- 12 deterministic states per QL;
- 2,532 English packages;
- 5,064 localized packages;
- 5,064 exact parity checks;
- 0 invalid localized packages;
- 0 publishable localized packages;
- 211 Hindi QLs and 211 Punjabi QLs retained.

## Explanation-remodel foundation

R1 introduces `TmwLearnerExplanationV2` as the target learner-facing contract:

1. **Method**
2. **Solution** — 2 to 5 connected steps
3. **Answer** — exact final answer
4. **Shortcut** — optional
5. **Common Mistake** — optional

A compatibility projector allows the legacy explanation structure to be validated against this contract while R2/R3 migrate the 211 QLs checkpoint-wise. R1 deliberately does not bulk-rewrite all explanations.

## Self-review finding closed during R1

The first R1 implementation changed QL-102 cycle rates but left the stem's `timeA/timeB` fields unchanged. A source-to-render self-review caught this despite the initial CI pass. The implementation was corrected so stem solo times and cycle rates now share one authority, and the permanent R1 test was strengthened to make that class of drift fail in future.

## Remaining gates

R1 closes the seven critical blockers only. The chapter remains **NO-GO for publication** until the remaining major/editorial findings and explanation remodeling are completed and the final corpus is independently re-audited.

Recommended continuation:

- **R2:** remediate remaining major validity/editorial issues and remodel CP-001 through CP-006 onto the V2 learner explanation contract.
- **R3:** remodel CP-007 through CP-011, regenerate Hindi/Punjabi from corrected English/source authority, and perform a full independent exam-readiness audit.

## Safety boundary

- `publiclyPublishable: false` remains mandatory.
- No Question Studio route is enabled.
- No Question Bank persistence is enabled.
- No test assembly or public student delivery is enabled.
- No existing permanent QL ID is renumbered or replaced.
