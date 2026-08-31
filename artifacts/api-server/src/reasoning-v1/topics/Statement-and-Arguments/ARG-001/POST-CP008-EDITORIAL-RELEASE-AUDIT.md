# ARG-001 Post-CP008 Editorial Release Audit

Status: **RELEASE BLOCKED / REMEDIATION REQUIRED**

This audit is intentionally downstream of `ARG_CP008_REAL_PAPER_CLOSURE_V1`. It does **not** mutate or supersede either frozen authority:

- core freeze: `ARG_CP006_IMMUTABLE_FREEZE_V1`
- real-paper closure: `ARG_CP008_REAL_PAPER_CLOSURE_V1`

The chapter remains available for Question Studio review only. Learner release must remain locked until a separately versioned remediation authority is reviewed, tested and frozen.

## Audit scope

Reviewed all 48 CP003 source templates across the six permanent QLs for:

- grammar after slot substitution
- semantic coherence under the 4 x 4 x 4 x 4 Cartesian variant model
- answer/strength integrity
- SSC/Banking exam naturalness
- explanation-to-argument alignment
- release ambiguity risk

The audit distinguishes **mechanical blockers** (a generated surface can be objectively malformed or semantically wrong) from **editorial naturalness debt** (understandable but below the desired paper standard).

## Release-blocking findings

### B01 — `ARG-CP003-QL001-T07` — plural benchmark composition

Current opposing argument contains:

`If one fixed {b} is shown ...`

Every `{b}` value is plural (`expected response times`, `target resolution windows`, `expected acknowledgement periods`, `service-response benchmarks`). This yields surfaces such as `one fixed expected response times`.

**Impact:** 256 / 256 semantic variants in the template.

**Required remediation:** replace the compositional phrase with a number-neutral noun such as `If one fixed benchmark is shown ...` while retaining the same reasoning and answer class.

### B02 — `ARG-CP003-QL002-T07` — answer-polarity defect for `student stress`

The strong opposing argument says frequent/high-pressure practice can **reduce {d}**. This is an opposing consequence for `teaching time`, `breadth of learning`, and `time for discussion-based learning`, but when `{d} = student stress`, reducing stress is beneficial and therefore does not support the stated opposition.

**Impact:** 64 / 256 semantic variants in the template.

**Required remediation:** replace the dimension value with a genuinely adverse quantity (for example `time for rest and recovery`) or change the argument construction so the polarity remains adverse for every slot value.

### B03 — `ARG-CP003-QL003-T04` — `every` + plural exam noun

Current stem:

`Should every {a} move entirely to {b} {c}?`

All `{a}` values are plural (`recruitment examinations`, `licensing examinations`, etc.), yielding `Should every recruitment examinations ...`.

**Impact:** 256 / 256 semantic variants in the template.

**Required remediation:** use a plural-compatible quantifier such as `Should all {a} ...` or singularise the slot bank.

### B04 — `ARG-CP003-QL004-T01` — malformed learner-group phrase

Current weak argument contains:

`Every student in {c} who attends ...`

Every `{c}` value is already a plural learner phrase (`students with identified learning gaps`, `students falling behind in assessment`, etc.), yielding forms such as `Every student in students with identified learning gaps ...`.

**Impact:** 256 / 256 semantic variants in the template.

**Required remediation:** use `{c} who attend ...` or introduce a singular learner slot.

### B05 — `ARG-CP003-QL004-T06` — duplicated temporal connector

Current stem:

`Should an online service send {c} before {a} becomes {b}?`

Two `{c}` values already end in a `before conversion` construction:

- `a reminder twenty-four hours before conversion`
- `a reminder three days before conversion`

This produces `... before conversion before a free trial becomes ...`.

**Impact:** at least 128 / 256 semantic variants are mechanically awkward; `a notice before the first charge` creates additional naturalness debt.

**Required remediation:** make `{c}` a noun phrase without its own `before ...` complement, or move the timing into a separate slot.

### B06 — `ARG-CP003-QL005-T01` — accessibility feature/user Cartesian mismatch

The feature slot and affected-user slot are independently varied, but several combinations do not address the stated barrier. Definite examples include:

- `keyboard-only navigation` × `users needing high-contrast interfaces`
- `high-contrast display support` × `users unable to operate a mouse`
- `accessible form labels` × `users unable to operate a mouse`
- `accessible form labels` × `users needing high-contrast interfaces`

The strong argument claims the selected feature reduces the selected group's access barrier, so these combinations can invalidate the intended `STRONG` judgement.

**Impact:** at least 64 / 256 semantic variants are definite semantic mismatches; additional pairs require editorial review.

**Required remediation:** use correlated feature/user pairs rather than independent Cartesian slots, or rewrite the affected-user slot generically enough that every feature is genuinely relevant.

### B07 — `ARG-CP003-QL006-T07` — contradictory fee label

One `{b}` value is `a reusable-option surcharge`, while the statement applies `{b}` **to single-use items**. This yields surfaces such as `charge a reusable-option surcharge for single-use shopping bags`, which reverses/obscures the intended incentive.

**Impact:** 64 / 256 semantic variants in the template.

**Required remediation:** replace with a single-use-compatible fee label such as `a single-use surcharge` while retaining the same incentive logic.

## Minimum mechanically affected surface count

The seven blockers above expose **at least 1,088 of the 12,288 English CP003 semantic variants** to an objective grammar or semantic-integrity defect, before counting softer naturalness issues. This is a lower bound, not a claim that every affected variant would necessarily reach a learner under a future scheduler.

Do **not** mechanically multiply this number by three for EN/HI/PA; localized overlays must be checked separately because grammar can differ by locale even when semantic slot pairing is shared.

## High-priority editorial naturalness debt

These items are not used in the minimum blocker count but should be repaired in the same editorial pass:

- `ARG-CP003-QL001-T03`: `{c} for {a}` can produce redundant payment phrasing such as `temporarily disable transactions for online card payments`.
- `ARG-CP003-QL001-T08`: several `for {d} about {c}` combinations are syntactically serviceable but unlike concise exam prose.
- `ARG-CP003-QL003-T02`: `Once {d} is introduced, it ...` has number agreement problems when `{d}` is plural (`digital-only channels`, `self-service digital terminals`).
- `ARG-CP003-QL003-T03`: a road/street `use {c}` is less natural than applying or imposing a traffic rule on the road.
- `ARG-CP003-QL004-T03`: independent policy/window slots permit combinations such as `limited flexible departure times within two defined start bands`.
- `ARG-CP003-QL004-T04`: constructions such as `attending a single session on basic digital-literacy workshops` are structurally awkward because the intervention slot itself already names a workshop/session.
- `ARG-CP003-QL005-T08`: `Any one of {b}` becomes awkward with values such as `all employees`.
- `ARG-CP003-QL006-T02`: some blanket-control nouns do not combine naturally with `apply {b} to every instance of {a}` (for example an account hold applied to an individual transaction instance).

## What remains strong

The audit does **not** find a coverage failure. The chapter still has:

- six distinct reasoning QLs
- balanced core answer classes
- 48 source templates
- broad scenario diversity
- strong weak-argument defect taxonomy
- deterministic replay
- CP007 real-paper profile shapes
- review-only lifecycle safeguards

The release blocker is **surface reliability under saturation**, not conceptual breadth.

## Required next checkpoint

Do not edit the CP006 files in place under the existing freeze authority.

The next implementation should be an explicit superseding editorial remediation checkpoint that:

1. records every changed frozen source authority and why it changed;
2. repairs the seven release blockers plus high-priority naturalness debt;
3. adds exhaustive 256-variant grammar/semantic assertions for every remediated template;
4. adds correlated-slot support where independent Cartesian composition is unsafe;
5. re-runs EN/HI/PA localization parity;
6. re-runs CP007 real-paper profiles against the remediated content contract;
7. issues a new byte freeze only after the exhaustive review gate is green;
8. keeps Question Bank/test/mock/public/automatic learner publication locked until explicit manual release approval.

## Release verdict

**NOT READY FOR LEARNER RELEASE.**

`ARG_CP008_REAL_PAPER_CLOSURE_V1` remains a valid record of the previously frozen review/runtime layer, but this post-freeze editorial audit identifies defects that must be fixed under a new explicit authority before learner publication is considered.
