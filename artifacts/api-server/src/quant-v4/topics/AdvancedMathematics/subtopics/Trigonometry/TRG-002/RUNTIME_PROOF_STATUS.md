# TRG-002 20-QL Runtime Proof Status

Status: **IMPLEMENTED + AI PROOF REVIEW COMPLETE — EXECUTION/HUMAN REVIEW PENDING**

## Scope

Phase 6 implements **20 permanent English QLs** for `TRG-002 — Heights & Distances Applications`.

The proof deliberately samples permanent IDs across the locked Phase 0 subfamilies instead of consuming the first five contiguous IDs of each CP.

Distribution:

- TRG-CP-007: 5 QLs
- TRG-CP-008: 5 QLs
- TRG-CP-009: 5 QLs
- TRG-CP-010: 5 QLs
- total: **20 / 20 proof QLs**
- full TRG-002 production target: **20 / 96**

## Permanent proof IDs

### TRG-CP-007
- `TRG-002-QL-001` — height from elevation
- `TRG-002-QL-007` — distance from elevation
- `TRG-002-QL-012` — clean standard angle from height/distance
- `TRG-002-QL-015` — target height from depression
- `TRG-002-QL-023` — reverse single observation using line of sight

### TRG-CP-008
- `TRG-002-QL-025` — shadow → height
- `TRG-002-QL-030` — height → shadow
- `TRG-002-QL-033` — changed shadow / solar elevation
- `TRG-002-QL-036` — ladder against wall
- `TRG-002-QL-045` — guy wire / ground anchor

### TRG-CP-009
- `TRG-002-QL-049` — same-side two observations
- `TRG-002-QL-056` — observer moves closer
- `TRG-002-QL-061` — observer moves farther
- `TRG-002-QL-065` — recover original distance
- `TRG-002-QL-068` — recover point separation

### TRG-CP-010
- `TRG-002-QL-073` — eye-height correction
- `TRG-002-QL-078` — opposite-side observations
- `TRG-002-QL-083` — building-to-building height relation
- `TRG-002-QL-088` — combined elevation + depression
- `TRG-002-QL-092` — river width

These 20 IDs represent **20 distinct locked family roles and 20 distinct solve modes**.

## Runtime files

- `runtime-proof.ts` — exact 20-QL engineering proof generator
- `runtime-proof-reviewed.ts` — active reviewed proof candidate
- `runtime-proof.test.ts` — base engineering gates
- `runtime-proof-reviewed.test.ts` — editorial-integrity overlay gates

`runtime-proof-reviewed.ts` is the candidate surface to use for subsequent expansion.

## Question contract

Every proof question contains:

- permanent package/CP/QL identity;
- locked family and solve mode;
- deterministic seed;
- exam-style English stem;
- exactly four exact answer options;
- misconception ID on each distractor;
- correct index;
- exact answer;
- generated value-aware explanation;
- canonical spatial state;
- deterministic diagram spec generated from that state;
- independent spatial verification result;
- diagram validation result;
- independent answer reconstruction result;
- final validation checks;
- review and activation locks.

## Spatial authority integration

A proof question cannot be emitted unless all three authorities agree:

1. **primary exact solver / canonical coordinates**;
2. **independent coordinate verifier**;
3. **diagram projection validator**.

The answer is also reconstructed independently from the canonical coordinates or target object geometry.

This prevents the future stem, explanation and diagram from silently describing different triangles.

## Representative application coverage

The proof now exercises:

- direct tangent height/distance;
- line-of-sight sine application;
- exact standard-angle recovery;
- angle of depression with unequal object heights;
- solar shadows;
- changed shadow angle;
- ladder geometry;
- guy-wire hypotenuse geometry;
- same-side two-point systems;
- moving closer / farther;
- recovery of original distance / separation;
- observer eye-height correction;
- opposite-side observer geometry;
- two-building height difference;
- simultaneous elevation and depression;
- river width.

Broken-object and composite-vertical-object families are **not represented in this 20-QL proof** and remain mandatory for MVP/production expansion.

## Editorial finding corrected

### QL-061 information leak

The first engineering stem for `TRG-002-QL-061` disclosed the initial distance from the tower while also giving the initial 60° elevation angle.

That made the second observation and move-farther information unnecessary: the student could calculate the height directly from the first observation.

The reviewed candidate now states only:

- initial angle = 60°;
- distance moved away;
- final angle = 30°;
- target = tower height.

The initial distance is unknown, forcing the intended two-observation system:

`x tan60° = (x + movement) tan30°`.

The review-specific test locks this distinction while requiring the exact answer, mathematical options, canonical spatial state and diagram to remain unchanged.

## AI proof-stage editorial result

The 20 representative QLs were reviewed for:

- locked-family fit;
- stem realism;
- whether all supplied data is genuinely relevant;
- mathematical validity;
- option uniqueness and misconception plausibility;
- difficulty integrity;
- explanation clarity/depth;
- diagram/state consistency;
- scope fit.

Result after QL-061 remediation:

- AI reviewed: **20 / 20**
- AI proof-stage PASS: **20 / 20**
- unresolved AI blockers: **0**
- human reviewed: **0 / 20**

This proof review is not the later 96-row production human freeze.

## Executable gates committed

### Base proof gate

`runtime-proof.test.ts` targets:

- exact 20-ID distributed sample;
- five QLs per CP;
- 20 distinct solve modes;
- 20 distinct locked families;
- permanent range compliance;
- 12 canonical seeds per QL = **240 target cases**;
- deterministic regeneration;
- independent spatial verification;
- diagram verification;
- answer reconstruction;
- four mathematically distinct options;
- one correct option;
- correct-index integrity;
- diagram-strategy agreement;
- explanation depth;
- at least two stem variants per QL;
- activation locks;
- 50-seed full proof sweep = **1,000 target cases**.

### Reviewed-overlay gate

`runtime-proof-reviewed.test.ts` repeats the canonical/sweep safety checks on the active reviewed candidate and additionally requires:

- QL-061 reviewed stem differs from its leaky engineering source;
- the original distance is not disclosed;
- both observation equations appear in the explanation;
- exact answer/options/correct index/canonical state/diagram remain unchanged by editorial remediation.

## Execution evidence

The gate suites are **committed but not claimed as executed**.

No GitHub Actions run has been observed for this branch. The current execution environment cannot clone the repository from `github.com`, so a local TypeScript run is unavailable here.

Therefore:

- strict TypeScript compile: **NOT CLAIMED**
- 240-case canonical proof pass: **NOT CLAIMED**
- 1,000-case sweep pass: **NOT CLAIMED**
- reviewed-overlay execution pass: **NOT CLAIMED**
- GitHub Actions pass: **NOT CLAIMED**

## Activation state

Still OFF:

- Question Studio discovery
- Test Builder eligibility
- question-bank storage
- public publication
- Hindi/Punjabi runtime

Every generated proof question is:

- `reviewStatus = UNREVIEWED`
- `aiEditorialStatus = PENDING` in runtime metadata despite the external review record
- `humanReviewStatus = PENDING`
- `questionBankStatus = NOT_STORED`
- `testEligibility = INELIGIBLE`
- `publiclyPublishable = false`
- `questionStudioDiscoverable = false`
- `proofOnly = true`

The runtime flags remain conservative even when a review document records AI proof-stage acceptance.

## Next checkpoint — TRG-002 48-QL MVP

The next expansion should move from **20 → 48 QLs**, approximately 12 per CP, while keeping permanent family allocations authoritative.

Priority additions must include families absent from the proof, especially:

- broken tree / broken pole geometry;
- additional shadow transformations;
- guy-wire variants;
- move-farther variants;
- comparative/two-object systems;
- composite vertical-object cases;
- broader building-to-building and river-width forms.

The 20 reviewed proof QLs should be retained as anchor templates unless a defect is discovered.