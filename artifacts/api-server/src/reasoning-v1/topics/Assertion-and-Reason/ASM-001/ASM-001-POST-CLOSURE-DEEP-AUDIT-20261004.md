# ASM-001 — Post-Closure Deep Audit

Status: **CLOSED — POST-CLOSURE BREADTH, NO-REPEAT AND TRILINGUAL REMEDIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`ASM-001-FINAL-DEEP-AUDIT-CLOSURE-20261003.md`

The 2026-10-03 closure remains historical evidence. This authority records defects found only when the already-implemented chapter was re-audited against review-batch behavior and difficulty-level semantic breadth.

## Scope

- chapter: `ASM-001`
- permanent QL: `ASM-QL-001`
- checkpoint: `ASM-CP-001`
- languages: English / Hindi / Punjabi
- answer classes: 5
- presentation profiles: standard 4-option + extended 5-option
- lifecycle: review-only
- Matrix/Games/Tournament: out of scope
- no new permanent QL added

## Material defects found

### 1. Question Studio could repeat the same curated scenario inside one batch

The chapter used a fixed curated truth authority, but each Question Studio item independently selected a scenario by hashing its item seed.

The package accepted counts up to 50 while the corpus contained only 20 scenarios.

That meant:
- repeated scenarios were possible even at moderate counts;
- repetition was unavoidable for large batches;
- changing option order could disguise a repeated underlying question.

Remediation:

- Question Studio now deterministically shuffles the eligible curated scenario pool;
- each scenario is used at most once inside a batch;
- generation is **without replacement**;
- when the requested count exceeds the available curated pool, generation fails clearly instead of repeating content.

### 2. Hard difficulty was semantically thin

Before this audit:

- Easy: 9 scenarios
- Medium: 9 scenarios
- Hard: **2 scenarios**

Hard covered only:

- `ASSERTION_TRUE_REASON_FALSE`
- `ASSERTION_FALSE_REASON_TRUE`

It did not cover:

- both true / Reason explains;
- both true / Reason does not explain;
- both false.

This meant “Hard supported” was technically true but semantically incomplete.

Remediation:

Three new curated Hard authorities were added:

- `ASM-SC-021` — both true and Reason explains;
- `ASM-SC-022` — both true but Reason does not explain;
- `ASM-SC-023` — both false.

Current difficulty distribution:

- Easy: **9**
- Medium: **9**
- Hard: **5**

All five semantic answer classes are now represented at **every** difficulty.

### 3. Curated authority expanded from 20 to 23

Current corpus:

- total curated scenarios: **23**
- all factual truth states manually controlled
- no free-form runtime truth generation
- one permanent solve contract only
- no QL inflation

The post-closure authority is:

`ASM_001_POST_CLOSURE_DEEP_AUDIT_20261004_V2`

Freeze version:

`ASM_001_POST_CLOSURE_FREEZE_2026_10_04_V2`

### 4. Hindi/Punjabi material-medium terminology

The existing sound/vacuum scenarios used literal wording equivalent to “substance medium”:

- Hindi: `पदार्थ माध्यम`
- Punjabi: `ਪਦਾਰਥਕ ਮਾਧਿਅਮ`

These were normalized to the more standard exam/science wording:

- Hindi: `भौतिक माध्यम`
- Punjabi: `ਭੌਤਿਕ ਮਾਧਿਅਮ`

The newly added Punjabi circular-motion item was also normalized to use `ਪ੍ਰਵੇਗ` for acceleration.

### 5. Operational metadata was stale

Current operational files still described 20 curated scenarios.

Remediation:

- README now reports 23 scenarios;
- Question Studio metadata exposes distinct scenario capacities;
- novelty inventory now reports 23 curated scenarios and all-five-class coverage by difficulty.

Historical Oct 3 closure text is preserved unchanged as historical evidence.

## Current distinct batch capacities

Question Studio now exposes:

- Mixed: **23**
- Easy: **9**
- Medium: **9**
- Hard: **5**

Requests above these capacities fail closed rather than repeat a curated scenario.

## Runtime answer integrity

The existing truth lattice remains correct:

1. judge Assertion truth;
2. judge Reason truth;
3. only if both are true, judge whether R explains A;
4. derive one of the five semantic answer classes.

The runtime still validates that curated truth flags resolve to the authored answer class.

Four-option mode is never used for `BOTH_FALSE`; those scenarios always use the extended five-option profile.

## Post-closure executable proof

New gate:

`asm-001-post-closure-audit-20261004.test.ts`

Coverage:

- 23 curated authorities
- 3 languages
- 8 deterministic option-order variants per authority
- full-capacity Easy batch
- full-capacity Medium batch
- full-capacity Hard batch
- full-capacity Mixed batch
- over-capacity rejection for all four pool modes
- standard Reasoning adapter Hard/Punjabi batch
- review-only lifecycle locks

Generated/audited learner surfaces:

- direct authority surfaces: **552**
- full-capacity Question Studio batch surfaces: **46**
- standard adapter Hard/Punjabi surfaces: **5**
- total: **603**

The gate also proves:

- all five answer classes per difficulty;
- no repeated curated scenario within a batch;
- correct semantic option at the keyed index;
- BOTH_FALSE always uses the five-option profile;
- curated rationale appears in the final explanation;
- Question Bank/test/mock/public lifecycle stays locked.

## Exact substantive-head validation

Substantive head:

`e41dab0043db91fa90e94744da65d1c96b7f3a39`

Workflow:

`Validate ASM-001 Assertion and Reason` — run **#60**

Result: **SUCCESS**

The exact head passed:

- standalone ASM closure proof;
- post-closure breadth/no-repeat proof;
- Reasoning novelty inventory proof;
- cross-chapter novelty current-head proof;
- global Reasoning audit reconciliation;
- production API build.

Parallel shared gates also passed:

- Reasoning final current-head status;
- global Reasoning reconciliation;
- branch topology;
- CI workflow hygiene.

## Lifecycle

No release escalation is made by this audit.

Current lifecycle remains:

```text
Question Studio review generation: ENABLED
Question Bank writable:           false
test eligible:                    false
mock-test eligible:               false
publicly publishable:             false
automatic student publication:    false
```

## Final disposition

```text
permanent QLs:                    1
curated scenarios:                23
Easy / Medium / Hard:             9 / 9 / 5
all answer classes per difficulty: YES
same-batch scenario repetition:   CLOSED
over-capacity behavior:           FAIL_CLOSED
EN/HI/PA:                         CLOSED
runtime answer lattice:           CLOSED
Question Studio integration:      CLOSED
public/student release:           LOCKED
post-closure audit status:        CLOSED
```

Reopen ASM-001 only for a newly evidenced recurring Assertion-and-Reason contract outside the existing truth/explanation task, a curated-fact correction, a localization/editorial regression, a permanent audit-gate failure, or a separately approved release transition.
