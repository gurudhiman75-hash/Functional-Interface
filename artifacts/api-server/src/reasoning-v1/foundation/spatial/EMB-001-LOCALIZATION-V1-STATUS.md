# EMB-001 Localization V1 Status

Status: **REVIEW-READY PRE-CI CANDIDATE — ACTIVATION BLOCKED**

## Parent English authority

- Parent PR: `#1101`
- English freeze head: `a4b18a3f302736524a72c486afd3ec81656bf14d`
- Freeze authority: `EMB-001-ENGLISH-FREEZE-V1`
- Freeze workflow: `Validate SPA EMB-001 English Freeze V1`
- Run: `33048724276`
- Infrastructure state: two attempts failed before any executable workflow step (`steps: []`, `runner_id: 0`, no job-log blob).
- Therefore English freeze CI evidence is **not yet authoritative**, even though CP005 allocation/runtime evidence is green and pinned.

## Localization branch

`feat/spa-emb-001-localization-v1`

The child branch is based on the exact English-freeze head and is intentionally not opened as a PR while hosted-runner provisioning is unavailable.

## Localization implementation

Authority: `EMB-001-HI-PA-LOCALIZATION-V1`

- Hindi: `hi-IN`
- Punjabi: `pa-IN`
- 8 natural stem variants per language
- question-specific observation → rule → application → check explanations
- distractor-aware application wording for rotation, reflection, missing edge, wrong incidence and non-uniform-scale traps
- permanent QL remains `SPA-QL-041`
- fixed-orientation policy remains invariant
- geometry / diagrams / option order / answer / IDs / fingerprints remain invariant
- localization is review-only and not frozen

## Authored automated gates

`spatial-embedded-figure-localization-v1.test.ts` is designed to prove:

- 240 English source questions → 480 localized questions
- exact EN↔HI and EN↔PA invariant parity
- all 8 stem variants in each locale
- all 8 motif families
- all 3 difficulty bands
- all 4 answer positions
- localized explanation script and answer references
- 25-question side-by-side EN/HI/PA human-review artifact with all five distractor families and connectivity-remediation examples
- Question Studio / Question Bank / test / public / automatic-publication lifecycle remains locked

Workflow authored: `Validate SPA EMB-001 Hindi Punjabi Localization V1`.

## Pre-CI direct editorial audit

Source: exact green V1.2 English learner-review artifact

- workflow run: `32971493016`
- artifact: `9608325338`
- digest: `sha256:b2774d9c8c14fadb9a835a465d3d13e3feb210cda298402f2b48c3331e151154`
- questions reviewed: **25/25**
- Hindi stem variants observed: **8/8**
- Punjabi stem variants observed: **8/8**
- Hindi answer-reference checks: **25/25**
- Punjabi answer-reference checks: **25/25**
- Devanagari learner-text presence: **25/25**
- Gurmukhi learner-text presence: **25/25**
- English word leakage in localized learner text: **0**
- editorial polish applied before this status: removed redundant uniform-scale phrasing and improved two “part of figure” stems in both languages

This pre-CI audit is supporting editorial evidence only. It does not replace the required exact-head localization CI gate.

## Governance

- English freeze CI green: **pending infrastructure**
- localization activation: **blocked**
- localization frozen: **false**
- Question Studio registered: **false**
- Question Bank writable: **false**
- test/mock/public eligibility: **false**
- automatic student publication: **false**
- merge authorization: **false**
- deployment authorization: **false**

## Next gate

1. Restore hosted-runner availability/account Actions provisioning.
2. Rerun English Freeze V1 on unchanged parent head `a4b18a3f302736524a72c486afd3ec81656bf14d`.
3. After green freeze evidence, open the localization child branch for CI.
4. Run `Validate SPA EMB-001 Hindi Punjabi Localization V1` and inspect its exact generated 25-question review artifact.
5. Only then consider localization freeze and Question Studio integration as separate governed steps.
