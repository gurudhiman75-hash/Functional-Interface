# BLR-001 — Reasoning V1 Final Audit Waves 05–07

Status: **CP-001/002 Hindi-Punjabi executable review candidates implemented; both are available in the shared Question Studio review workflow; localized explanations upgraded to question-specific reasoning; human language approval still required. CP-006 Editorial V3 is a separate trilingual review candidate and does not replace the current freeze.**

## Wave 05 — CP-001 multilingual closure candidate

CP-001 now reconstructs Hindi and Punjabi learner text from structured semantics for all permanent QLs `BLR-QL-001..007`.

The localizer uses:

- direct relation IDs;
- person identities;
- ordered-pair semantics;
- relation-claim semantics;
- generation IDs;
- gender evidence;
- exact paternal/maternal lineage IDs.

It does not translate completed English stems as opaque text.

Executable parity preserves:

- permanent QL;
- source prototype;
- structured prompt;
- correct index;
- option semantic keys;
- hidden structural fingerprint;
- solve authority.

Localized records remain review-only, Question-Bank ineligible, test/mock ineligible and non-public.

The shared Question Studio package exposes CP-001 as `en/hi/pa`, but Hindi/Punjabi records retain `LOCALIZED_REVIEW_REQUIRED`.

## Wave 06 — CP-002 multilingual closure candidate

CP-002 now reconstructs Hindi and Punjabi from its structured role-chain model for `BLR-QL-008`.

Coverage includes:

- pointing;
- photograph;
- portrait;
- introduction;
- stage;
- conversation;
- speaker/listener/pointed-person anchors;
- one- through four-step role chains;
- ONLY constraints;
- negative role/sibling constraints;
- SELF identity;
- ordinary relation questions;
- photograph/portrait ownership forms.

Hindi listener wording uses the respectful `आप/आपका` register consistently with Punjabi `ਤੁਸੀਂ/ਤੁਹਾਡਾ`.

Executable parity preserves scenario/prototype ownership, structured role expressions, answer ID, option answer IDs, correct index, hidden fingerprint and solve authority.

The shared Question Studio package exposes CP-002 as `en/hi/pa`; Hindi/Punjabi remain review-only and release-locked.

## Wave 07 — localized explanation quality

The first CP-001/002 multilingual candidates were semantically correct but their explanations were too generic compared with the English reasoning evidence.

### CP-001

Hindi/Punjabi explanation steps now follow the actual question contract.

- named relation: trace the asked direction between the two named people;
- person identification: find the unique person with the requested relation;
- ordered pair: verify relation direction inside each pair;
- relation claim: test each claim against the reconstructed family;
- generation comparison: place both people at their generation levels;
- branching relation: complete both branches before tracing;
- gender identification: use only gender-bearing relationship evidence;
- exact lineage: solve the broad relation, then use the connecting parent to choose paternal vs maternal side.

The reasoning path must explicitly reach the displayed correct answer.

### CP-002

Hindi/Punjabi explanation steps now expose the actual role-chain reasoning:

- resolve `मैं/ਮੈਂ` to the speaker;
- resolve `आप/ਤੁਸੀਂ` to the listener when present;
- apply ONLY constraints when present;
- apply negative constraints when present;
- state when both endpoints collapse to the same person;
- otherwise state the solved relation or ownership answer.

The family graph remains structured evidence in Question Studio.

## CP-006 Editorial V3 boundary

The audit also produced a separate trilingual Editorial V3 review candidate for CP-006.

It removes tutorial-style learner wording about arithmetic precedence from:

- the shared prompt;
- the core concept;
- the common-trap list.

The internal solver invariant `noArithmeticPrecedence=true` remains unchanged.

The existing `BLR_CP006_MULTILINGUAL_FROZEN` corpus is not overwritten. Editorial V3 remains:

- human-review required;
- review-only;
- Question-Bank locked;
- test/mock locked;
- public-release locked.

A new multilingual freeze requires explicit approval after trilingual wording review.

## Current multilingual closure state

| Checkpoint | Current final-audit state |
|---|---|
| CP-001 | Hindi/Punjabi executable parity proved; shared Studio review integrated; question-specific localized explanation; human language review pending |
| CP-002 | Hindi/Punjabi executable parity proved; shared Studio review integrated; question-specific localized explanation; human language review pending |
| CP-003 | executable-parity candidate; deterministic wording cleanup applied; human language review/freeze pending |
| CP-004 | executable-parity candidate; deterministic wording cleanup applied; human language review/freeze pending |
| CP-005 | executable-parity candidate; deterministic wording cleanup applied; human language review/freeze pending |
| CP-006 | current multilingual freeze retained; cleaner Editorial V3 review candidate exists; superseding trilingual review/freeze pending |
| CP-007 | multilingual-frozen; current generated review items release-locked |

## Chapter invariants

Unchanged:

- seven checkpoints;
- permanent QLs `BLR-QL-001..035`;
- `BLR-QL-036` unallocated;
- no new solve authority introduced;
- current generated review items are not automatically published;
- Question Bank/test/mock/public gates remain separate from Question Studio review.

## Remaining closure work

1. complete exact-head validation of Wave 07;
2. human-review Hindi/Punjabi CP-001..005;
3. human-review CP-006 Editorial V3 in English/Hindi/Punjabi;
4. if approved, issue explicit new multilingual freeze authorities rather than mutating old freeze records;
5. run final chapter-wide release-boundary and authority audit before closing BLR-001.
