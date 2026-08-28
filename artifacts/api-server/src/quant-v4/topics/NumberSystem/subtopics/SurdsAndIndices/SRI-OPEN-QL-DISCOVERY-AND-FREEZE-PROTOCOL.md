# SRI Open QL Discovery and Freeze Protocol

**Permanent QLs:** 58  
**Frozen solve modes:** 58  
**Current state:** `MULTILINGUAL_FROZEN_V1`.

**Approved localization artifact:** `9684834606`  
**Approved artifact digest:** `sha256:a212a40f917e8e91a6d5741fc4acd32a73782885981b2b7f7ef8b4c3bb7251ac`  
**Approval authority:** explicit product-owner approval in active session on 2026-08-28.  
**Approved source head:** `a3d24d97221bf94da04e77daa140164dbcdb0e51`.  
**Base recertification:** run `33176307480` on head `1b96cb213eacb25d9f5372afed77ee4ff286d2f8` against `New-main` `2754618366072250467e4d862caa11525d4e0900` passed English freeze, 2,784-question localization parity, strict editorial quality, reviewer export verification and evidence upload before activation.  
**Freeze activation certification:** run `33177065943` validated the frozen lifecycle and governed wrapper against the same `New-main` base, including all 2,784 frozen localized runtime packages with downstream release disabled.  
**Final exact-head certification:** run `33177440135` on head `48bf1235fbb2332375178da90dadab900a1f66c5` and PR merge-ref `137c4529c20c00bcbd9d9a03a2a58f362743621b` passed English freeze, 2,784-question localization parity, strict editorial quality, the 2,784-package multilingual freeze audit, reviewer export verification and artifact upload. Repository workflow-hygiene, branch-topology and Render production-build checks are also green on this exact head.  
**Final evidence artifact:** `9688237353`, digest `sha256:49bb69ed92558e6e0f326e8268bb6be08d0852b4628f281eb3bb942cb7a1cfef`.  
**CI fanout policy:** the chapter validator is path-scoped to SRI/shared SRI source only; its own workflow YAML is intentionally not listed in `pull_request.paths`, so workflow-definition edits are governed by the repository-wide workflow-hygiene gate rather than self-triggering chapter validation.

## 1. What may create a candidate QL

A provisional candidate is justified only by a materially different learner-task contract, including one or more of:

- governing mathematical law;
- given/unknown topology;
- target direction (forward, inverse, parameter recovery, comparison, truth-set);
- exact answer semantic;
- domain/admissibility condition;
- independent-verification strategy;
- misconception profile that changes the option contract.

Changing numbers, variable names, option order, language, cosmetic wording or an equivalent object family does not create a QL.

## 2. Required discovery sequence

For each checkpoint:

```text
source evidence
→ provisional solve-mode candidate
→ ownership check
→ exact canonical state
→ canonical solver
→ materially independent verifier
→ domain/admissibility proof
→ executable prototype
→ inverse/reverse audit
→ edge/domain audit
→ representation audit
→ source-gap audit
→ object-pool audit
→ merge/split compression
→ cross-CP overlap audit
→ cross-chapter collision audit
→ no-known-gap evidence
→ permanent QL proposal
```

Skipping from a source example directly to a permanent QL is prohibited.

## 3. Candidate dispositions

- `KEEP` — legacy/source family has a valid distinct contract and survives executable review.
- `MERGE` — same learner contract as another candidate after exact normalization.
- `SPLIT` — one provisional family contains materially different inference/domain/answer contracts.
- `MOVE` — tested burden belongs to another chapter.
- `DROP` — not exam-relevant, duplicates another family, is mathematically invalid, or cannot support a sound option contract.
- `SOURCE_GATED` — plausible but insufficiently corroborated for the target release.

## 4. Permanent allocation gate

Permanent IDs remain forbidden until all release-boundary candidates have completed:

1. executable solver/verifier proof;
2. source saturation search;
3. inverse and reverse-direction search;
4. edge/domain search;
5. representation search;
6. object-pool diversity review;
7. duplicate/near-duplicate audit;
8. cross-checkpoint merge/split closure;
9. Algebra / Number System / Simplification / Data Sufficiency ownership closure;
10. explicit human approval of the final English inventory.

Only then may contiguous package-local IDs be allocated.

## 5. English freeze gate

Every retained permanent QL must prove:

- deterministic seeded generation;
- exact canonical state;
- canonical solver and materially independent verifier agreement;
- original-domain verification for equations;
- exactly one correct option;
- misconception-backed distractors;
- meaningful parameter/object diversity;
- acceptable duplicate and near-duplicate rates;
- natural, varied exam-standard stems;
- human explanation stating what is given/asked, the governing method, concrete working and final answer;
- no formula-wall explanation;
- no metadata leakage;
- approved English review corpus;
- content fingerprint recorded.

## 6. Multilingual gate

Hindi/Punjabi derive from frozen structured English semantic authority. They may not regenerate mathematics independently. Freeze requires terminology, grammar, notation and semantic-parity review.

The Phase-9 multilingual reviewer artifact named above is explicitly approved and frozen. `permanent-multilingual-freeze-v1.ts` is the governed frozen runtime wrapper; it preserves the reviewed localized question byte-for-byte and changes only lifecycle/approval metadata. The underlying reviewed localization generator remains immutable review authority.

## 7. Product lifecycle gate

Multilingual freeze is independent from Question Studio, Question Bank, test and public release.

Until explicit later approval, all of the following remain false:

- Question Studio discoverability;
- Question Studio production generation;
- Question Bank writes;
- mock/test eligibility;
- public publication.

A multilingual-frozen mathematical package is not automatically a released product package.
