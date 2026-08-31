# ARG-001 Post-CP008 Editorial Release Audit

Status: **RELEASE BLOCKED / REMEDIATION REQUIRED**

Audit revision: **V2 — exhaustive structural pass**

This audit is intentionally downstream of `ARG_CP008_REAL_PAPER_CLOSURE_V1`. It does **not** mutate or supersede either frozen authority:

- core freeze: `ARG_CP006_IMMUTABLE_FREEZE_V1`
- real-paper closure: `ARG_CP008_REAL_PAPER_CLOSURE_V1`

The chapter remains Question Studio review-only. Learner release must remain locked until a separately versioned remediation authority is reviewed, tested and frozen.

A separate CP007-specific audit is recorded in `POST-CP008-CP007-REAL-PAPER-AUDIT.md`; it confirms that the real-paper layer also has independently composed slot pairs that require remediation.

## Scope

Reviewed all 48 CP003 source templates across the six permanent QLs for:

- part-of-speech compatibility of every placeholder in every sentence position
- grammar after 4 x 4 x 4 x 4 Cartesian substitution
- semantic compatibility between independently varied dimensions
- answer/strength integrity
- explanation-to-argument alignment
- SSC/Banking exam naturalness
- release ambiguity risk

The counts below are deliberately conservative. A surface is counted as a hard blocker only where the generated wording or intended strength can be shown to fail mechanically. Softer context/naturalness defects are listed separately.

## Definite release blockers

### B01 — `ARG-CP003-QL001-T01` — plural subject with singular verb

The strong argument ends `{d} addresses a material safety risk`. Three of four `{d}` values are plural (`certified helmets`, `protective helmets`, `standard-compliant helmets`), yielding forms such as `certified helmets addresses ...`.

**Impact:** 192 / 256 variants.

**Fix:** make the predicate number-neutral, e.g. `{d} can address a material safety risk`.

### B02 — `ARG-CP003-QL001-T03` — verb phrase used as noun subject

The strong opposing argument contains `If {c} is too easy to trigger ...`, while every `{c}` value is an action phrase such as `temporarily disable transactions` or `pause outgoing digital payments`.

Example: `If temporarily disable transactions is too easy to trigger ...`

**Impact:** 256 / 256 variants.

**Fix:** use a noun/action construction such as `If the transaction-control action is too easy to trigger ...` or rewrite the sentence around `If customers can trigger this action too easily ...`.

### B03 — `ARG-CP003-QL001-T07` — singular quantifier with plural benchmark slot

The opposing argument contains `If one fixed {b} is shown ...`; every `{b}` value is plural (`expected response times`, `target resolution windows`, etc.).

**Impact:** 256 / 256 variants.

**Fix:** use `If one fixed benchmark is shown ...`.

### B04 — `ARG-CP003-QL001-T08` — `every` with plural enquiry slot

The weak supporting argument says `every {c} ... will be resolved`, while every `{c}` value is plural (`application status enquiries`, `payment queries`, etc.).

**Impact:** 256 / 256 variants.

**Fix:** use `all {c}` or singularise the slot.

### B05 — `ARG-CP003-QL002-T07` — answer-polarity defect for `student stress`

The strong opposing argument says excessive practice can `reduce {d}`. That is adverse for `teaching time`, `breadth of learning`, and `time for discussion-based learning`, but beneficial when `{d} = student stress`.

**Impact:** 64 / 256 variants.

**Fix:** replace the slot value with an adverse quantity or use polarity-safe wording.

### B06 — `ARG-CP003-QL003-T02` — pronoun/number disagreement

The weak supporting argument says `Once {d} is introduced, it requires ...`. Two `{d}` values are plural (`digital-only channels`, `self-service digital terminals`).

**Impact:** 128 / 256 variants.

**Fix:** use number-neutral wording such as `Using {d} supposedly requires ...`.

### B07 — `ARG-CP003-QL003-T04` — `every` with plural examination slot

Stem: `Should every {a} move entirely to {b} {c}?`

All `{a}` values are plural (`recruitment examinations`, `licensing examinations`, etc.).

**Impact:** 256 / 256 variants.

**Fix:** use `Should all {a} ...` or singular slots.

### B08 — `ARG-CP003-QL004-T01` — duplicated learner noun

The weak argument contains `Every student in {c} who attends ...`, while `{c}` is already a plural learner phrase such as `students with identified learning gaps`.

Example: `Every student in students with identified learning gaps ...`

**Impact:** 256 / 256 variants.

**Fix:** use `{c} who attend ...` or a singular learner slot.

### B09 — `ARG-CP003-QL004-T06` — duplicated temporal connector

Stem: `Should an online service send {c} before {a} becomes {b}?`

Two `{c}` values already contain `before conversion`, producing `... before conversion before ...`.

**Impact:** at least 128 / 256 variants.

**Fix:** separate reminder type from timing or use a timing-neutral notification noun.

### B10 — `ARG-CP003-QL004-T08` — location noun incorrectly made policy actor

The opposing argument says `{b} should never regulate it ...`, but `{b}` contains locations such as `school premises`, `training centres`, `examination campuses`, and `college classrooms`.

Example: `school premises should never regulate mobile phones ...`

**Impact:** 256 / 256 variants.

**Fix:** make the actor explicit (`the institution should never regulate ...`) rather than using `{b}` as the policy-making subject.

### B11 — `ARG-CP003-QL005-T01` — accessibility feature/user Cartesian mismatch

The feature slot and affected-user slot vary independently. Definite mismatches include:

- `keyboard-only navigation` × `users needing high-contrast interfaces`
- `high-contrast display support` × `users unable to operate a mouse`
- `accessible form labels` × `users unable to operate a mouse`
- `accessible form labels` × `users needing high-contrast interfaces`

The strong argument claims the selected feature reduces the selected group's access barrier, which is not true for these pairs.

**Impact:** at least 64 / 256 variants; additional pairs need editorial judgement.

**Fix:** use correlated feature/user pairs or a genuinely generic affected-user slot.

### B12 — `ARG-CP003-QL006-T04` — verb phrase placed after `without` and used as clause subject

The `{d}` values are verbs (`investigate the affected centre`, `verify evidence and scope`, etc.). The arguments use them as:

- `without {d}` → `without investigate the affected centre`
- `{d} cannot be considered` → `investigate the affected centre cannot be considered`

**Impact:** 256 / 256 variants.

**Fix:** convert `{d}` to gerund/noun phrases or rewrite both argument frames.

### B13 — `ARG-CP003-QL006-T05` — `exist` agreement failure

Both arguments use `where {d} exist`. Two `{d}` values are singular/mass (`parallel road capacity`, `reliable bus and metro access`).

**Impact:** 128 / 256 variants.

**Fix:** use number-neutral `where {d} is available` with compatible slot wording.

### B14 — `ARG-CP003-QL006-T07` — contradictory fee label

One `{b}` value is `a reusable-option surcharge`, but the statement applies the fee to single-use goods, yielding forms such as `a reusable-option surcharge for single-use shopping bags`.

**Impact:** 64 / 256 variants.

**Fix:** replace with `a single-use surcharge` or another fee label whose object is the disposable item.

## Definite minimum affected count

The fourteen hard blockers above affect distinct template/variant regions and expose at least:

**2,560 / 12,288 English CP003 semantic variants = 20.83%**

to an objective grammar or semantic-strength defect.

This remains a lower bound. It excludes plausible-but-not-certain semantic pair mismatches and general exam-naturalness debt.

Do **not** multiply the English count mechanically by three. Hindi and Punjabi preserve much of the semantic pairing but can differ grammatically; they require their own exhaustive rendered audit.

## Additional semantic/naturalness debt not included in 2,560

- `ARG-CP003-QL001-T03`: `{c} for {a}` also creates redundant payment wording in the stem.
- `ARG-CP003-QL001-T08`: `for {d} about {c}` is frequently unlike concise exam prose even after the `every` defect is fixed.
- `ARG-CP003-QL002-T05`: the changed field `{a}` and enabled consequence `{d}` are independently crossed; combinations involving `mailing address` or `transaction-limit setting` can weaken the claimed fraud mechanism.
- `ARG-CP003-QL003-T03`: a street/road `use {c}` is unnatural policy wording.
- `ARG-CP003-QL004-T03`: policy/window slots can create combinations such as `limited flexible departure times within two defined start bands`.
- `ARG-CP003-QL004-T04`: `attending {d} on {a}` is awkward because `{a}` itself already names a workshop/session.
- `ARG-CP003-QL005-T08`: `Any one of all employees/trainees/...` is below the desired exam prose standard.
- `ARG-CP003-QL006-T02`: some blanket-control nouns do not naturally fit `apply {b} to every instance of {a}`, especially an account hold applied to an individual transaction instance.

## What remains strong

This is not a chapter-coverage failure. ARG-001 still has:

- six distinct reasoning QLs
- balanced core truth classes
- 48 source templates
- broad domains and scenario diversity
- a useful weak-argument defect taxonomy
- deterministic replay
- substantial semantic capacity
- trilingual review infrastructure
- review-only lifecycle safeguards

The principal defect is **compositional reliability under saturation**.

## Required remediation architecture

Do not edit frozen CP006 files in place under `ARG_CP006_IMMUTABLE_FREEZE_V1`.

The superseding remediation should:

1. build corrected template authorities from the frozen sources under a new versioned authority;
2. add explicit correlated-slot support where dimensions are not safely Cartesian;
3. eliminate part-of-speech-sensitive slot frames (`every {plural}`, `without {verb}`, `{plural} addresses`, etc.);
4. render and inspect all 256 variants for every remediated template;
5. exhaustively validate EN/HI/PA rather than assuming grammar parity;
6. re-run answer/strength invariants after every semantic slot correction;
7. re-run CP007 real-paper profiles against the new editorial contract;
8. issue a new byte freeze only after the full remediation gate is green;
9. keep persistence, Question Bank writes, tests, mocks, public publication and automatic learner publication locked until explicit manual release approval.

## Release verdict

**NOT READY FOR LEARNER RELEASE.**

`ARG_CP008_REAL_PAPER_CLOSURE_V1` remains a valid historical freeze record, but the post-freeze editorial audit proves that a new explicit remediation authority is required before learner delivery can be considered.
