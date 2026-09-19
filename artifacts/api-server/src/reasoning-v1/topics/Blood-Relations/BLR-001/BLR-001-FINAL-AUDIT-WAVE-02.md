# BLR-001 — Reasoning V1 Final Audit Wave 02

Status: **difficulty/lifecycle/authority remediation implemented; multilingual editorial blockers explicitly retained; no learner-release gate opened.**

## Scope

Wave 02 continues the chapter-wide final audit after Wave 01 fixed the standard Question Studio explanation projection and contradictory CP-007 current-release flags.

This wave checks:

- generated-instance difficulty;
- major exam-family coverage;
- multilingual completeness;
- frozen-corpus editorial boundaries;
- authority-document drift;
- Question Studio regression assumptions.

## Finding A — CP-001 / CP-002 difficulty depended on seed

### Defect

Several CP-001 and CP-002 generators used the seed as an input to the learner difficulty label even after the structural problem was already determined.

Examples included:

- a one-edge CP-001 relation becoming Easy or Medium by seed;
- a two-edge CP-001 relation becoming Medium or Hard by seed;
- CP-001 lineage/claim forms changing tier by seed;
- CP-002 self-identity and mid-score role-chain items changing tier by seed.

This means two questions with the same solve burden could carry different difficulty labels solely because the name/option-generation seed changed.

### Remediation

CP-001 and CP-002 now classify difficulty from completed learner-visible burden only.

CP-001 uses:

- path depth;
- clue burden;
- generation difference;
- relation/query form;
- exact-lineage burden.

CP-002 uses:

- role depth;
- only/negative constraints;
- conversation-anchor burden;
- self-identity constraints.

The seed parameter is retained only for call compatibility and no longer changes difficulty.

### Regression proof

Permanent runtime audits now group repeated structural scenarios and assert that the same structural signature cannot change difficulty across seeds.

The chapter still reaches Easy, Medium and Hard; the change removes random tier switching, not difficulty breadth.

## Finding B — CP-007 review-registry test assumed it was the only Reasoning package

The historical CP-007 source-adapter regression asserted that the entire Reasoning V1 review registry contained exactly one package.

That assumption became stale as more Reasoning packages were registered.

The test now scopes package-count and enabled-package assertions to the CP-007 package itself. This preserves isolation without blocking legitimate growth of the shared registry.

## Finding C — current review state and future release capability were conflated

The old CP-007 production regression expected an unreviewed generated item to already be:

- Question Bank writable;
- test eligible;
- publicly publishable.

The final-audit contract now distinguishes:

- **current state:** review-only, `NOT_STORED`, non-writable, test-ineligible, non-public;
- **future capability:** `releaseEligibleAfterApproval=true`.

The CP-007 release-path regression now explicitly proves that an unreviewed item is rejected by the Question Bank eligibility guard.

A separate approval/promotion transition is required before conversion/release.

## Coverage audit

No new Blood Relations checkpoint or permanent QL is justified by current source ownership.

The existing seven checkpoints cover the major V1 exam families:

| Checkpoint | Exam family |
|---|---|
| CP-001 | direct, reverse, composed, identity, pair, claim, generation and exact-lineage relations |
| CP-002 | pointing, photograph, portrait, conversation and nested self-reference |
| CP-003 | shared family passages / shared family graphs |
| CP-004 | member, relation-pair, generation and composition counting |
| CP-005 | definite / possible / impossible / indeterminate and count determinacy |
| CP-006 | coded relation decoding and solving |
| CP-007 | coded expression construction, completion and validation |

Permanent inventory remains `BLR-QL-001..035`.

`BLR-QL-036` remains unallocated.

## Multilingual closure blockers

### CP-001 / CP-002

Only English learner runtimes exist.

**Blocker:** Hindi and Punjabi implementation/parity/human review are still required for chapter-wide trilingual closure.

### CP-003 / CP-004 / CP-005

Hindi/Punjabi candidates exist and executable semantic parity is proved.

**Blocker:** the current authority still requires human natural-language review and an explicit multilingual freeze.

### CP-006

English/Hindi/Punjabi are already frozen and human-reviewed.

The final audit found one editorial issue in the learner prompt: it explicitly tells the learner that relation symbols are not arithmetic operators / must not use precedence. That is tutorial guidance rather than normal exam-prompt wording.

Because CP-006 is already multilingual-frozen, Wave 02 does **not** silently edit this sentence under the old freeze authority.

**Required path:** superseding trilingual editorial review -> parity proof -> explicit re-freeze.

### CP-007

Multilingual corpus is frozen. Current standard-Studio items remain release-locked; future release eligibility is separately represented.

## Authority reconciliation

The chapter README and end-to-end design were stale.

They now reflect:

- seven implemented checkpoints;
- 35 permanent QLs;
- `BLR-QL-036` unallocated;
- all seven packages registered in the shared standard admin review workflow;
- current generated BLR review items remain release-locked;
- CP-001/002 multilingual gap;
- CP-003..005 human-language-review gap;
- CP-006 frozen editorial-remediation boundary;
- explanation policy: do not force shortcut/trap/option-analysis boilerplate on every question.

## Remaining final-audit work

1. complete exact-head CI for Waves 01–02;
2. inspect distractor fatigue / repeated option families across CP-001..007;
3. inspect stem-template fatigue and exam-naturalness across generated banks;
4. verify family-tree explanation readability and renderer evidence;
5. build CP-001/002 Hindi/Punjabi remediation plan;
6. perform CP-003..005 human-language review/freeze pass;
7. supersede CP-006 multilingual freeze only if the tutorial-hint removal is approved through the proper trilingual review path;
8. perform final chapter closure after all blockers are cleared.

## Release boundary

Still closed:

- Question Bank admission for current review items;
- test eligibility;
- mock-test eligibility;
- student delivery;
- public publication;
- automatic release.
