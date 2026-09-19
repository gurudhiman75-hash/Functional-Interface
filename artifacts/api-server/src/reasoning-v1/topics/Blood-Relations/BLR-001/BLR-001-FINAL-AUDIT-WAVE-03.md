# BLR-001 — Reasoning V1 Final Audit Wave 03

Status: **stem, distractor and explanation-renderer audit implemented; renewed CP-001/002 English learner-word review required; release gates remain closed.**

## Scope

Wave 03 audits what the learner actually sees:

- standalone and shared-set stem naturalness;
- repeated instruction fatigue;
- distractor construction quality;
- family-tree/graph explanation evidence in Question Studio;
- stale checkpoint lifecycle documentation.

## Finding A — CP-001 standalone stems carried unnecessary instruction boilerplate

CP-001 standalone named-relation questions prefixed every item with a generic line such as:

- read the following family information;
- study the relations;
- consider the statements;
- use the information below.

For a standalone item, this adds no reasoning information and makes generated questions feel templated.

### Remediation

The basic, advanced and exact-lineage CP-001 renderers now begin directly with the relation evidence and end with the exam question.

Query wording still varies where the renderer supports it.

A runtime regression rejects generic instruction openers on permanent CP-001 questions.

No clue, query direction, correct answer, option semantic key or permanent QL identity changes.

## Finding B — CP-002 photograph/stage wording had drifted away from common exam phrasing

The active CP-002 editorial upgrader transformed the conventional competitive-exam construction:

`Pointing to a photograph of a man/woman/person ...`

into:

`Pointing to a man/woman/person in a photograph ...`

The stage renderer also used:

`Showing X on the stage ...`

### Remediation

CP-002 now uses:

- `Pointing to a photograph of ...` for photograph questions;
- `Pointing to X on the stage ...` for stage questions.

The role-chain assertion, query, solve contract, options and answer remain unchanged.

Canonical integration tests now lock these wording rules.

## Governance consequence for CP-001 / CP-002

Both checkpoints had historical English discovery/human-review evidence.

Wave 03 intentionally changes learner wording after those historical review artifacts.

Therefore:

- the old semantic/discovery evidence remains valid;
- permanent QL ownership remains valid;
- the old learner-wording approval must **not** be represented as approval of the new final-audit wording;
- CP-001/002 remain review-only;
- renewed English learner-word review is required before chapter closure;
- Hindi/Punjabi remain unimplemented for CP-001/002.

## Finding C — early family-tree renderer lost structured graph evidence in Studio

CP-001 source questions often declare `FAMILY_TREE_EXPLANATION`, but their source structured prompt stores:

- typed clues;
- person names;
- query;

rather than a prebuilt `familyGraph`.

The shared chapter Studio adapter previously looked only for a prebuilt graph/tree. This meant CP-001 could expose only the legacy text `familyTreeGrid` despite having enough structured authority to build the graph.

### Remediation

The adapter now reuses the existing `graphFromClues` family-graph authority.

For CP-001:

`structured clues + person names -> existing validated family graph -> Studio reasoningGraph/familyTree evidence`.

No new solver or diagram inference was introduced.

Standard-Studio regressions require CP-001 and CP-002 review items to expose structured graph evidence and report family-tree availability.

## Distractor fatigue audit

### CP-001 — PASS with no structural rewrite

Distractors are assembled from:

1. reversed query direction when valid;
2. gender-swapped relation;
3. nearby kinship confusion;
4. broader relation-family fallback only when required.

They remain semantic/misconception distractors rather than arbitrary labels.

### CP-002 — PASS with no structural rewrite

Non-self questions prioritize:

1. reverse relation;
2. wrong gender;
3. nearby role-chain relations.

SELF questions draw from plausible family-role labels rather than random unrelated answer types.

### CP-003 — ACCEPTABLE, monitor during multilingual human review

Relation/claim questions use nearby kinship pools.

Shared-family married-pair questions choose actual named pairs from the same reconstructed family while excluding other spouse pairs. This is structurally valid and exam-like, though pair distractor closeness should be spot-checked during the pending Hindi/Punjabi human-language review.

### CP-004 — PASS

Numeric count distractors stay close to the solved count (`±1/±2`, with safe non-negative fallbacks).

Composition-profile distractors alter individual components such as male/female count, couple count or generation count. This models common counting mistakes and does not need random relation noise.

### CP-005 — PASS

Options are model-space aware:

- relation alternatives distinguish exact/broad invariance;
- uncertainty options retain/omit surviving outcomes deliberately;
- claim/person/count options carry definite/possible/impossible status;
- count determinacy includes attainable and unattainable alternatives.

No generic distractor retrofit is justified.

### CP-006 — frozen; no silent learner rewrite

The coded-relation option system is solver-backed and type-compatible.

A separate Wave 02 finding remains open: the frozen learner prompt explicitly tells students not to apply arithmetic precedence. That sentence is tutorial-like and should be removed only through a superseding trilingual editorial/parity/freeze pass.

### CP-007 — PASS

The V4 Wave 3 layer already contains explicit anti-fatigue/security work:

- derived QL-031 distractors vary multiple statement positions/directions;
- QL-033 varies both blanks and includes a two-error distractor;
- QL-034 uses multiple decisive connected family structures;
- reverse options are solver-filtered;
- exact shortcut/trap repetition is capped.

No new distractor rewrite is required in this audit wave.

## Explanation-surface conclusion

Legacy source authorities may still retain diagnostic fields such as shortcut, trap and option analysis for audit/debug evidence.

The shared standard Question Studio learner projection now strips mandatory legacy boilerplate and exposes:

- useful reasoning steps;
- question-specific conclusion;
- structured family-tree/graph evidence when available.

This preserves source diagnostics without forcing them into every learner explanation.

## Stale CP-007 checkpoint README

The CP-007 README still described:

- English freeze as pending;
- Hindi/Punjabi as not started;
- Question Studio as disabled.

Those statements conflict with the later multilingual-freeze and shared standard-Studio authorities.

The README now records:

- English freeze complete;
- Hindi/Punjabi localization complete;
- multilingual freeze complete;
- shared standard admin review registration;
- current review payload locked;
- `releaseEligibleAfterApproval=true` as a future capability, not current release permission.

## Remaining BLR final-audit blockers

1. exact-head CI for Waves 01–03;
2. renewed CP-001/002 English learner-word review after the final-audit stem cleanup;
3. CP-001/002 Hindi/Punjabi implementation and parity;
4. CP-003/004/005 Hindi/Punjabi human-language review and explicit freeze;
5. controlled CP-006 superseding trilingual editorial pass if the tutorial-like precedence hint is removed;
6. final chapter-wide authority and release-boundary audit.

## Release boundary

Still closed:

- current Question Bank admission;
- test eligibility;
- mock-test eligibility;
- student delivery;
- public publication;
- automatic release.

No CP-008 or BLR-QL-036 is allocated by Wave 03.
